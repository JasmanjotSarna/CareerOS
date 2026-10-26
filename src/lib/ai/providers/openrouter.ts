import { AIProvider, AIProviderRequest, AIProviderResponse } from './types';
import { isOpenRouterEnabled } from '@/lib/env';

const OPENROUTER_API_BASE = process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1';

const PLACEHOLDER_PATTERNS = ['REPLACE_WITH', 'your-', 'changeme', 'insert-', 'todo', '<', '>'];

function isPlaceholder(val: string): boolean {
  const v = val.trim().toLowerCase();
  if (v.length === 0) return true;
  return PLACEHOLDER_PATTERNS.some((p) => v.includes(p));
}

export class OpenRouterProvider implements AIProvider {
  name: 'openrouter' = 'openrouter';

  isConfigured(): boolean {
    if (process.env.OPENROUTER_ENABLED === 'false') return false;
    const key = process.env.OPENROUTER_API_KEY;
    if (!key || key.trim().length === 0) return false;
    if (isPlaceholder(key)) return false;
    return true;
  }

  private getApiKey(): string | undefined {
    if (!isOpenRouterEnabled()) return undefined;
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) return undefined;
    const trimmed = key.trim();
    if (trimmed.length === 0 || isPlaceholder(trimmed)) return undefined;
    return trimmed;
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.isConfigured()) {
      return { ok: false, message: 'OPENROUTER_API_KEY not configured' };
    }
    try {
      const apiKey = this.getApiKey()!;
      const res = await fetch(`${OPENROUTER_API_BASE}/models`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.OPENROUTER_APP_NAME || 'CareerOS',
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        return { ok: true, message: 'OpenRouter API reachable' };
      }
      return { ok: false, message: `OpenRouter API error: ${res.status}` };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Connection failed' };
    }
  }

  async complete(request: AIProviderRequest): Promise<AIProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const model = request.model || process.env.OPENROUTER_MODEL || 'google/gemma-2-9b-it:free';
    const body = {
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1024,
      stream: false,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(process.env.AI_REQUEST_TIMEOUT_MS || 30000));

    try {
      const res = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.OPENROUTER_APP_NAME || 'CareerOS',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`OpenRouter API error ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json().catch(() => ({}));
      const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.delta?.content || '';

      return {
        text: typeof content === 'string' ? content : JSON.stringify(content),
        model: data?.model || model,
        usage: data?.usage,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async *stream(request: AIProviderRequest): AsyncIterable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const model = request.model || process.env.OPENROUTER_MODEL || 'google/gemma-2-9b-it:free';
    const body = {
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1024,
      stream: true,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(process.env.AI_REQUEST_TIMEOUT_MS || 30000));

    try {
      const res = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.OPENROUTER_APP_NAME || 'CareerOS',
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        throw new Error(`OpenRouter API error ${res.status}: ${text.slice(0, 200)}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (typeof content === 'string') {
                yield content;
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const openRouterProvider = new OpenRouterProvider();
