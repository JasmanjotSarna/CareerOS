import { z } from 'zod';

const PLACEHOLDER_PATTERNS = [
  'REPLACE_WITH',
  'your-',
  'changeme',
  'insert-',
  'TODO',
  '<',
  '>',
];

function isPlaceholder(val: string): boolean {
  const v = val.trim().toLowerCase();
  if (v.length === 0) return true;
  return PLACEHOLDER_PATTERNS.some((p) => v.includes(p.toLowerCase()));
}

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1)
    .refine((v) => !isPlaceholder(v), { message: 'placeholder value not allowed' })
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  OPENCODE_API_KEY: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  OPENCODE_API_BASE: z.string().url().optional(),
  OPENCODE_MODEL: z.string().min(1).optional(),
  NVIDIA_API_KEY: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  NVIDIA_API_KEY_FALLBACK: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  NVIDIA_API_BASE: z.string().url().optional(),
  NVIDIA_MODEL: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  GEMINI_API_KEY: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  GEMINI_MODEL: z.string().min(1).optional(),
  GROQ_API_KEY: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  GROQ_API_BASE: z.string().url().optional(),
  GROQ_TEXT_MODEL: z.string().min(1).optional(),
  GROQ_TRANSCRIPTION_MODEL: z.string().min(1).optional(),
  OPENROUTER_API_KEY: z.string().min(1).refine((v) => !isPlaceholder(v), { message: 'placeholder' }).optional(),
  OPENROUTER_API_BASE: z.string().url().optional(),
  OPENROUTER_MODEL: z.string().min(1).optional(),
  OPENROUTER_SITE_URL: z.string().url().optional(),
  OPENROUTER_APP_NAME: z.string().min(1).optional(),
  OPENROUTER_ENABLED: z.enum(['true', 'false']).optional(),
  AI_REQUEST_TIMEOUT_MS: z.string().regex(/^\d+$/).optional(),
  AI_MAX_RETRIES: z.string().regex(/^\d+$/).optional(),
  AI_DAILY_USER_LIMIT: z.string().regex(/^\d+$/).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

function getServerEnv(): ServerEnv {
  // Empty strings are common in .env files for optional integrations (for example
  // ANTHROPIC_API_KEY=). Treat them as "not configured" instead of invalid so one
  // unused integration cannot invalidate every other environment variable.
  const cleaned: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string' && value.trim() === '') continue;
    cleaned[key] = value;
  }

  const parsed = serverSchema.safeParse(cleaned);
  if (!parsed.success) {
    const keys = [...new Set(parsed.error.issues.map((issue) => String(issue.path[0] ?? 'unknown')))];
    console.error(`[env] Invalid environment variables: ${keys.join(', ')}`);
    // Keep the process usable with the raw values; individual feature checks
    // (hasValidOpenCode, isOpenRouterEnabled, ...) still validate their own keys.
    return process.env as unknown as ServerEnv;
  }
  return parsed.data;
}

export const serverEnv = getServerEnv();

export function requireServerEnv(keys: (keyof ServerEnv)[]): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const key of keys) {
    const val = serverEnv[key];
    if (val === undefined || val === null) {
      missing.push(String(key));
      continue;
    }
    if (typeof val === 'string' && (val.trim() === '' || isPlaceholder(val))) {
      missing.push(String(key));
      continue;
    }
  }
  return { ok: missing.length === 0, missing };
}

export function isServerEnvConfigured(): boolean {
  const required = ['NEXT_PUBLIC_SUPABASE_URL'] as const;
  const { ok } = requireServerEnv(required as any);
  return ok;
}

export function hasValidOpenCode(): boolean {
  const key = process.env.OPENCODE_API_KEY || serverEnv.OPENCODE_API_KEY;
  return Boolean(key && key.trim().length > 0 && !isPlaceholder(key));
}

export function hasValidNvidia(): boolean {
  const primary = process.env.NVIDIA_API_KEY || serverEnv.NVIDIA_API_KEY;
  const fallback = process.env.NVIDIA_API_KEY_FALLBACK || serverEnv.NVIDIA_API_KEY_FALLBACK;
  return Boolean(
    (primary && primary.trim().length > 0 && !isPlaceholder(primary)) ||
    (fallback && fallback.trim().length > 0 && !isPlaceholder(fallback))
  );
}

export function hasValidGemini(): boolean {
  const key = process.env.GEMINI_API_KEY || serverEnv.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 0 && !isPlaceholder(key));
}

export function hasValidGroq(): boolean {
  const key = process.env.GROQ_API_KEY || serverEnv.GROQ_API_KEY;
  return Boolean(key && key.trim().length > 0 && !isPlaceholder(key));
}

export function isOpenRouterEnabled(): boolean {
  if (process.env.OPENROUTER_ENABLED === 'false') return false;
  const key = process.env.OPENROUTER_API_KEY || serverEnv.OPENROUTER_API_KEY;
  if (!key || key.trim().length === 0) return false;
  if (isPlaceholder(key)) return false;
  return true;
}


