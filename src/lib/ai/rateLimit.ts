/**
 * Simple in-memory rate limiter for serverless Next.js route handlers
 * Defaults: 30 requests per minute per IP/User
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000);
}

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.resetTime };
}
