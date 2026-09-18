/**
 * Universal AI Caller for CareerOS
 * Dispatches structured JSON calls to configured LLM providers (Gemini, Claude, OpenAI)
 * with automatic 1-shot retry, JSON sanitization, and explicit failure reporting.
 */

import { isGeminiConfigured, callGeminiJson } from './geminiClient';
import { isAnthropicConfigured, callClaudeJson } from './claudeClient';

export class AIAnalysisUnavailableError extends Error {
  readonly code = 'ANALYSIS_UNAVAILABLE';
  readonly statusCode = 503;
  readonly retryable = true;

  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'AIAnalysisUnavailableError';
  }
}

export interface UniversalAIOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

/**
 * Clean JSON fences or leading/trailing conversational debris
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
 * Executes a structured JSON LLM call.
 * Retries once on failure before raising AIAnalysisUnavailableError.
 * Never silently reverts to fake mock data.
 */
export async function callUniversalAIJson<T>(options: UniversalAIOptions<T>): Promise<T> {
  const hasGemini = isGeminiConfigured();
  const hasClaude = isAnthropicConfigured();
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);

  if (!hasGemini && !hasClaude && !hasOpenAI) {
    throw new AIAnalysisUnavailableError(
      'No AI provider API key configured (checked GEMINI_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY). Please configure your API credentials.'
    );
  }

  let lastError: Error | null = null;

  // Attempt 1, then Attempt 2 (retry once)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      if (attempt > 1) {
        // Wait 1000ms before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Priority 1: Anthropic Claude if key provided
      if (hasClaude) {
        let claudeError: Error | null = null;
        const result = await callClaudeJson<T | null>({
          systemPrompt: options.systemPrompt,
          userPrompt: options.userPrompt,
          temperature: options.temperature,
          maxTokens: options.maxTokens,
          fallback: () => {
            claudeError = new Error('Claude response returned fallback or failed parsing');
            return null;
          }
        });

        if (result !== null) {
          return result;
        }
        if (claudeError) throw claudeError;
      }

      // Priority 2: Google Gemini (active in this workspace)
      if (hasGemini) {
        let geminiError: Error | null = null;
        const result = await callGeminiJson<T | null>({
          systemPrompt: options.systemPrompt,
          userPrompt: options.userPrompt,
          temperature: options.temperature,
          model: options.model || 'gemini-3.6-flash',
          fallback: () => {
            geminiError = new Error('Gemini candidate models failed to return valid response');
            return null;
          }
        });

        if (result !== null) {
          return result;
        }
        if (geminiError) throw geminiError;
      }

      // Priority 3: OpenAI if configured
      if (hasOpenAI) {
        const apiKey = process.env.OPENAI_API_KEY!;
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: options.model || 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            temperature: options.temperature ?? 0.2,
            messages: [
              { role: 'system', content: `${options.systemPrompt}\nReturn pure JSON.` },
              { role: 'user', content: options.userPrompt }
            ]
          })
        });

        if (!res.ok) {
          throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) throw new Error('Empty response from OpenAI');

        const cleaned = sanitizeJsonResponse(content);
        return JSON.parse(cleaned) as T;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[UniversalAI] Attempt ${attempt} failed:`, lastError.message);
    }
  }

  throw new AIAnalysisUnavailableError(
    `AI analysis is temporarily unavailable: ${lastError?.message || 'Upstream provider error'}. Please try again.`,
    lastError
  );
}
