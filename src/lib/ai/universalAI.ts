/**
 * Universal AI Caller for CareerOS
 * Dispatches structured JSON calls to the configured LLM providers.
 * The provider order is controlled by PRIMARY_AI_PROVIDER, then a safe fallback
 * order. Every provider failure is attempted before surfacing a 503.
 */

import { isGeminiConfigured, callGeminiJson } from './geminiClient';
import { isAnthropicConfigured, callClaudeJson } from './claudeClient';
import { openCodeProvider } from './providers/opencode';
import { nvidiaProvider } from './providers/nvidia';
import { groqProvider } from './providers/groq';
import { openRouterProvider } from './providers/openrouter';
import { hasValidGroq, hasValidNvidia, hasValidOpenCode } from '@/lib/env';

export class AIAnalysisUnavailableError extends Error {
  readonly code = 'ANALYSIS_UNAVAILABLE';
  readonly statusCode = 503;
  readonly retryable = true;

  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AIAnalysisUnavailableError';
    this.cause = cause;
  }
}

export interface UniversalAIOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

type ProviderKey = 'nvidia' | 'opencode' | 'anthropic' | 'gemini' | 'groq' | 'openai' | 'openrouter';

const DEFAULT_ORDER: ProviderKey[] = [
  'nvidia',
  'opencode',
  'anthropic',
  'gemini',
  'groq',
  'openai',
  'openrouter',
];

/**
 * Clean JSON fences or leading/trailing conversational debris.
 */
export function sanitizeJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Some models still prepend a sentence ("Here is the analysis:") or append a
 * note after the JSON object. Pull out the first complete JSON object/array.
 */
export function extractJsonResponse(raw: string): string {
  const cleaned = sanitizeJsonResponse(raw);
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // Continue and try to locate the payload.
  }

  const objectStart = cleaned.indexOf('{');
  const arrayStart = cleaned.indexOf('[');
  const candidates = [objectStart, arrayStart].filter((index) => index >= 0);
  if (candidates.length === 0) return cleaned;

  const start = Math.min(...candidates);
  const open = cleaned[start];
  const close = open === '{' ? '}' : ']';
  const end = cleaned.lastIndexOf(close);
  if (end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

function parseJson<T>(text: string): T {
  const extracted = extractJsonResponse(text);
  try {
    return JSON.parse(extracted) as T;
  } catch (firstError) {
    // Repair the most common model JSON mistake: a trailing comma.
    const repaired = extracted.replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(repaired) as T;
    } catch {
      throw firstError;
    }
  }
}

function getProviderOrder(): ProviderKey[] {
  const primary = (process.env.PRIMARY_AI_PROVIDER || '').trim().toLowerCase();
  const ordered =
    primary && DEFAULT_ORDER.includes(primary as ProviderKey)
      ? [primary as ProviderKey, ...DEFAULT_ORDER.filter((name) => name !== primary)]
      : DEFAULT_ORDER;

  return ordered.filter(isProviderConfigured);
}

function isProviderConfigured(name: ProviderKey): boolean {
  switch (name) {
    case 'nvidia':
      return hasValidNvidia() && nvidiaProvider.isConfigured();
    case 'opencode':
      return hasValidOpenCode() && openCodeProvider.isConfigured();
    case 'anthropic':
      return isAnthropicConfigured();
    case 'gemini':
      return isGeminiConfigured();
    case 'groq':
      return hasValidGroq() && groqProvider.isConfigured();
    case 'openai':
      return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
    case 'openrouter':
      return openRouterProvider.isConfigured();
  }
}

function messagesFor(options: UniversalAIOptions<unknown>) {
  return [
    {
      role: 'system' as const,
      content: `${options.systemPrompt}\n\nIMPORTANT: Respond with pure, valid JSON ONLY. Do NOT enclose it in markdown formatting or backticks. Do not add comments to the JSON.`,
    },
    {
      role: 'user' as const,
      content: options.userPrompt,
    },
  ];
}

async function runProvider(name: ProviderKey, options: UniversalAIOptions<unknown>): Promise<unknown> {
  const messages = messagesFor(options);
  const temperature = options.temperature ?? 0.2;

  switch (name) {
    case 'nvidia': {
      const completion = await nvidiaProvider.complete({
        messages,
        temperature,
        maxTokens: options.maxTokens ?? 4096,
        model:
          options.model ||
          process.env.NVIDIA_MODEL ||
          'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
      });
      return parseJson(completion.text);
    }

    case 'opencode': {
      const completion = await openCodeProvider.complete({
        messages,
        temperature,
        maxTokens: options.maxTokens ?? 2000,
        model: options.model || process.env.OPENCODE_MODEL || 'big-pickle',
      });
      return parseJson(completion.text);
    }

    case 'anthropic': {
      const result = await callClaudeJson<unknown | null>({
        systemPrompt: options.systemPrompt,
        userPrompt: options.userPrompt,
        temperature,
        maxTokens: options.maxTokens,
        fallback: () => null,
      });
      if (result === null) throw new Error('Claude returned no parsed JSON');
      return result;
    }

    case 'gemini': {
      const result = await callGeminiJson<unknown | null>({
        systemPrompt: options.systemPrompt,
        userPrompt: options.userPrompt,
        temperature,
        model: options.model,
        fallback: () => null,
      });
      if (result === null) throw new Error('Gemini returned no parsed JSON');
      return result;
    }

    case 'groq': {
      const completion = await groqProvider.complete({
        messages,
        temperature,
        maxTokens: options.maxTokens ?? 2000,
        model: options.model || process.env.GROQ_TEXT_MODEL || 'llama-3.1-8b-instant',
      });
      return parseJson(completion.text);
    }

    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY!;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          temperature,
          messages,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from OpenAI');
      return parseJson(content);
    }

    case 'openrouter': {
      const completion = await openRouterProvider.complete({
        messages,
        temperature,
        maxTokens: options.maxTokens ?? 2000,
        model: options.model || process.env.OPENROUTER_MODEL || 'google/gemma-2-9b-it:free',
      });
      return parseJson(completion.text);
    }
  }
}

/**
 * Executes a structured JSON LLM call.
 * Tries the configured providers in priority order, then retries once.
 * Never silently reverts to fake mock data.
 */
export async function callUniversalAIJson<T>(options: UniversalAIOptions<T>): Promise<T> {
  const order = getProviderOrder();

  if (order.length === 0) {
    throw new AIAnalysisUnavailableError(
      'No AI provider API key configured (checked NVIDIA_API_KEY, OPENCODE_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY). Please configure your API credentials.'
    );
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    for (const name of order) {
      try {
        const result = await runProvider(name, options as UniversalAIOptions<unknown>);
        if (result === null || result === undefined) {
          throw new Error(`${name} returned an empty response`);
        }
        return result as T;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(
          `[UniversalAI] ${name} attempt ${attempt} failed:`,
          lastError.message
        );
      }
    }
  }

  throw new AIAnalysisUnavailableError(
    `AI analysis is temporarily unavailable: ${lastError?.message || 'Upstream provider error'}. Please try again.`,
    lastError
  );
}
