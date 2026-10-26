import { AIProvider, AIProviderRequest, AIProviderResponse } from './types';

const OPENCODE_API_BASE = process.env.OPENCODE_API_BASE || 'https://api.opencode.ai/v2';

export class OpenCodeProvider implements AIProvider {
  name: 'opencode' = 'opencode';

  isConfigured(): boolean {
    return Boolean(process.env.OPENCODE_API_KEY && process.env.OPENCODE_API_KEY.trim().length > 0);
  }

  private getApiKey(): string | undefined {
    const key = process.env.OPENCODE_API_KEY;
    return key && key.trim().length > 0 ? key.trim() : undefined;
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.isConfigured()) {
      return { ok: false, message: 'OPENCODE_API_KEY not configured' };
    }
    const apiKey = this.getApiKey()!;
    try {
      // Try to list models or a lightweight endpoint if available
      const res = await fetch(`${OPENCODE_API_BASE}/models`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        return { ok: true, message: 'OpenCode API reachable' };
      }
      return { ok: false, message: `OpenCode API error: ${res.status}` };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Connection failed' };
    }
  }

  async complete(request: AIProviderRequest): Promise<AIProviderResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenCode API key not configured');
    }

    // OpenCode HTTP API documented for instance routes; do not assume chat/completions unless verified.
    // Try common shapes defensively but prefer failing clearly if endpoint differs.
    const body = {
      model: request.model || process.env.OPENCODE_MODEL || 'big-pickle',
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1024,
      stream: false,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(process.env.AI_REQUEST_TIMEOUT_MS || 30000));

    try {
      const res = await fetch(`${OPENCODE_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`OpenCode API error ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json().catch(() => ({}));
      const content =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.delta?.content ||
        data?.message?.content ||
        data?.text ||
        '';

      return {
        text: typeof content === 'string' ? content : JSON.stringify(content),
        model: data?.model || body.model,
        usage: data?.usage,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async *stream(request: AIProviderRequest): AsyncIterable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenCode API key not configured');
    }

    const body = {
      model: request.model || process.env.OPENCODE_MODEL || 'big-pickle',
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1024,
      stream: true,
    };

    const res = await fetch(`${OPENCODE_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new Error(`OpenCode API error ${res.status}: ${text.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // Try to parse SSE
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content =
              parsed?.choices?.[0]?.delta?.content ||
              parsed?.choices?.[0]?.message?.content ||
              parsed?.delta?.content ||
              parsed?.content;
            if (typeof content === 'string') {
              yield content;
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    }
  }
}

export const openCodeProvider = new OpenCodeProvider();
