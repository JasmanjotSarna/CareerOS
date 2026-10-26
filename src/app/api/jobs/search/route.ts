import { NextRequest, NextResponse } from 'next/server';
import type { Job } from '@/types/workspace';

/**
 * Job discovery proxy.
 *
 * Provider: Remotive's public remote-jobs API (https://remotive.com/api/remote-jobs).
 * No credentials required. We never scrape pages, invent listings, or infer
 * sponsorship. If the provider is unavailable the endpoint fails honestly and
 * the UI shows a retry state instead of fabricated jobs.
 *
 * Optional Adzuna support can be added by configuring ADZUNA_APP_ID and
 * ADZUNA_APP_KEY; it is not enabled unless both are present.
 */

const REMOTIVE_ENDPOINT = 'https://remotive.com/api/remote-jobs';
const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  jobs: Job[];
  fetchedAt: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category?: string;
  tags?: string[];
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/');
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeJob(item: RemotiveJob, fetchedAt: string): Job {
  return {
    id: `remotive:${item.id}`,
    externalId: String(item.id),
    source: 'Remotive',
    title: item.title,
    company: item.company_name,
    companyLogoUrl: item.company_logo || undefined,
    location: item.candidate_required_location?.trim() || 'Remote',
    workMode: 'remote',
    employmentType: item.job_type || 'Not specified',
    salaryText: item.salary?.trim() || undefined,
    description: htmlToText(item.description || '').slice(0, 12000),
    url: item.url,
    postedAt: item.publication_date,
    fetchedAt,
    tags: [item.category, ...(item.tags || [])].filter(Boolean) as string[],
  };
}

export async function GET(req: NextRequest) {
  try {
    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();
    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: sign in to search jobs.' }, { status: 401 });
    }

    const query = (req.nextUrl.searchParams.get('q') || '').trim().slice(0, 100);
    const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit')) || 50));
    const cacheKey = `${query.toLowerCase()}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({
        jobs: cached.jobs,
        source: 'Remotive',
        fetchedAt: cached.fetchedAt,
        cached: true,
        attribution: 'Job data by Remotive (remotive.com). Always confirm details on the original posting.',
      });
    }

    const params = new URLSearchParams({ limit: String(limit) });
    if (query) params.set('search', query);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    let response: Response;
    try {
      response = await fetch(`${REMOTIVE_ENDPOINT}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CareerOS/1.0 (job discovery; contact: support@careeros.app)',
        },
        signal: controller.signal,
        cache: 'no-store',
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'provider_unavailable',
          message: `The job provider returned HTTP ${response.status}. No jobs were loaded. Please retry shortly.`,
        },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as { jobs?: RemotiveJob[] };
    const fetchedAt = new Date().toISOString();
    const jobs = (payload.jobs || [])
      .filter((item) => item && item.id && item.title && item.company_name && item.url)
      .map((item) => normalizeJob(item, fetchedAt));

    cache.set(cacheKey, { jobs, fetchedAt, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({
      jobs,
      source: 'Remotive',
      fetchedAt,
      cached: false,
      attribution: 'Job data by Remotive (remotive.com). Always confirm details on the original posting.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown job provider error';
    const aborted = message.toLowerCase().includes('abort');
    return NextResponse.json(
      {
        error: 'provider_unavailable',
        message: aborted
          ? 'The job provider timed out. No jobs were loaded — please retry.'
          : `Could not load jobs: ${message}`,
      },
      { status: 502 }
    );
  }
}
