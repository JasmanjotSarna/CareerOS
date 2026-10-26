import { AIProvider } from './providers/types';
import { openCodeProvider } from './providers/opencode';
import { nvidiaProvider } from './providers/nvidia';
import { groqProvider } from './providers/groq';
import { openRouterProvider } from './providers/openrouter';
import { hasValidGemini, hasValidGroq, hasValidOpenCode, hasValidNvidia } from '@/lib/env';

type RuntimeProviderName = 'opencode' | 'nvidia' | 'groq' | 'openrouter';

const providers: Record<RuntimeProviderName, AIProvider> = {
  opencode: openCodeProvider,
  nvidia: nvidiaProvider,
  groq: groqProvider,
  openrouter: openRouterProvider,
};

// Nvidia is deliberately first: it is the verified production provider for this
// deployment. The previous order tried OpenCode first even when
// PRIMARY_AI_PROVIDER was set to nvidia, which turned every AI request into a
// 404 round-trip before falling back.
const DEFAULT_ORDER: RuntimeProviderName[] = ['nvidia', 'opencode', 'groq', 'openrouter'];

function normalizeProviderName(name?: string): string | undefined {
  if (!name) return undefined;
  return name.trim().toLowerCase();
}

export function getPrimaryProviderName(): string {
  return normalizeProviderName(process.env.PRIMARY_AI_PROVIDER) || 'nvidia';
}

function isRuntimeProvider(name: string): name is RuntimeProviderName {
  return name === 'opencode' || name === 'nvidia' || name === 'groq' || name === 'openrouter';
}

function isProviderConfigured(name: RuntimeProviderName): boolean {
  switch (name) {
    case 'opencode':
      return hasValidOpenCode() && openCodeProvider.isConfigured();
    case 'nvidia':
      return hasValidNvidia() && nvidiaProvider.isConfigured();
    case 'groq':
      return hasValidGroq() && groqProvider.isConfigured();
    case 'openrouter':
      return openRouterProvider.isConfigured();
  }
}

export function getProviderPriority(): RuntimeProviderName[] {
  const primary = normalizeProviderName(process.env.PRIMARY_AI_PROVIDER);
  if (primary && isRuntimeProvider(primary)) {
    return [primary, ...DEFAULT_ORDER.filter((name) => name !== primary)];
  }
  return [...DEFAULT_ORDER];
}

export function getAIProvider(name?: string): AIProvider {
  const requested = normalizeProviderName(name);

  if (requested && isRuntimeProvider(requested) && isProviderConfigured(requested)) {
    return providers[requested];
  }

  for (const candidate of getProviderPriority()) {
    if (isProviderConfigured(candidate)) return providers[candidate];
  }

  // Return the primary provider even when unconfigured so callers receive a
  // clear "not configured" error instead of silently using the wrong service.
  const primary = normalizeProviderName(process.env.PRIMARY_AI_PROVIDER);
  if (primary && isRuntimeProvider(primary)) return providers[primary];
  return nvidiaProvider;
}

export function getProviderModel(name: string): string | undefined {
  switch (name) {
    case 'opencode':
      return process.env.OPENCODE_MODEL || 'big-pickle';
    case 'nvidia':
      return process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning';
    case 'groq':
      return process.env.GROQ_TEXT_MODEL || 'llama-3.1-8b-instant';
    case 'openrouter':
      return process.env.OPENROUTER_MODEL;
    default:
      return undefined;
  }
}

export function getProviderBaseUrl(name: string): string | undefined {
  switch (name) {
    case 'opencode':
      return process.env.OPENCODE_API_BASE || 'https://api.opencode.ai/v2';
    case 'nvidia':
      return process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1';
    case 'groq':
      return process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1';
    case 'openrouter':
      return process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1';
    default:
      return undefined;
  }
}

export async function testAIProvider(name?: string): Promise<{ ok: boolean; message: string; provider?: string }> {
  try {
    const requested = normalizeProviderName(name);
    if (requested && isRuntimeProvider(requested) && !isProviderConfigured(requested)) {
      return {
        ok: false,
        message: `${requested} is not configured (missing/placeholder key or disabled)`,
        provider: requested,
      };
    }

    const p = getAIProvider(name);
    const result = await p.testConnection();
    return { ...result, provider: p.name };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export function getAvailableProviders() {
  const primary = getPrimaryProviderName();
  return [
    { name: 'nvidia', configured: isProviderConfigured('nvidia'), primary: primary === 'nvidia' },
    { name: 'opencode', configured: isProviderConfigured('opencode'), primary: primary === 'opencode' },
    { name: 'gemini', configured: hasValidGemini(), primary: primary === 'gemini' },
    { name: 'groq', configured: isProviderConfigured('groq'), primary: primary === 'groq' },
    { name: 'openrouter', configured: isProviderConfigured('openrouter'), primary: primary === 'openrouter' },
  ];
}
