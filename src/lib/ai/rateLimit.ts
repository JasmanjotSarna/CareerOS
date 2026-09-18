/**
 * CareerOS AI Cost, Rate Limiting & Content Deduplication Engine
 * Protects serverless LLM endpoints against abusive re-runs and runaway costs.
 */

import crypto from 'crypto';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cache for content deduplication: hash -> { data, expiresAt }
interface CacheRecord {
  data: unknown;
  expiresAt: number;
}
const contentCache = new Map<string, CacheRecord>();

// Clean up stale records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
    for (const [key, record] of contentCache.entries()) {
      if (now > record.expiresAt) {
        contentCache.delete(key);
      }
    }
  }, 60000);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
  message?: string;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1, reset: now + windowMs, limit };
  }

  if (record.count >= limit) {
    const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      reset: record.resetTime,
      limit,
      message: `Rate limit reached. Please wait ${waitSeconds}s before requesting analysis again.`,
    };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.resetTime, limit };
}

/**
 * Strict per-user rate limit for heavy resume analysis
 * Default: 10 uploads/analyses per hour per user
 */
export function checkResumeAnalysisRateLimit(userIdOrIp: string): RateLimitResult {
  const ONE_HOUR = 60 * 60 * 1000;
  const MAX_PER_HOUR = 10;
  return checkRateLimit(`ai-resume-limit:${userIdOrIp}`, MAX_PER_HOUR, ONE_HOUR);
}

/**
 * Content hash helper for resume text deduplication
 */
export function computeContentHash(content: string, contextId: string = ''): string {
  return crypto
    .createHash('sha256')
    .update(`${content.trim()}::${contextId}`)
    .digest('hex');
}

/**
 * Retrieve cached analysis to avoid paying for identical consecutive uploads
 */
export function getCachedAnalysis<T>(hash: string): T | null {
  const record = contentCache.get(hash);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    contentCache.delete(hash);
    return null;
  }
  return record.data as T;
}

/**
 * Store analysis result in deduplication cache for 15 minutes
 */
export function setCachedAnalysis<T>(hash: string, data: T, ttlMs: number = 15 * 60 * 1000): void {
  contentCache.set(hash, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}
