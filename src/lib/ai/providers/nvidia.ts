import { AIProvider, AIProviderRequest, AIProviderResponse } from './types';

const NVIDIA_API_BASE = process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1';

export class NvidiaProvider implements AIProvider {
  name: 'nvidia' = 'nvidia';

  isConfigured(): boolean {
    const keys = this.getApiKeys();
    return keys.length > 0;
  }

  private getApiKeys(): string[] {
    const primary = process.env.NVIDIA_API_KEY?.trim();
    const fallback = process.env.NVIDIA_API_KEY_FALLBACK?.trim();
    const keys: string[] = [];
    if (primary && primary.length > 0 && !primary.includes('placeholder')) {
      keys.push(primary);
    }
    if (fallback && fallback.length > 0 && !fallback.includes('placeholder') && !keys.includes(fallback)) {
      keys.push(fallback);
    }
    return keys;
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const keys = this.getApiKeys();
    if (keys.length === 0) {
      return { ok: false, message: 'NVIDIA_API_KEY not configured' };
    }
    for (const key of keys) {
      try {
        const res = await fetch(`${NVIDIA_API_BASE}/models`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          return { ok: true, message: 'NVIDIA Integrate API reachable' };
        }
      } catch (err) {
        // try next key
      }
    }
    return { ok: false, message: 'NVIDIA API connection failed on all keys' };
  }

  async complete(request: AIProviderRequest): Promise<AIProviderResponse> {
    const keys = this.getApiKeys();
    if (keys.length === 0) {
      throw new Error('NVIDIA API key not configured');
    }

    const model = request.model || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning';
    const body: Record<string, unknown> = {
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.6,
      top_p: 0.95,
      max_tokens: request.maxTokens ?? 4096,
      stream: false,
    };

    // If nemotron reasoning model, attach reasoning budget
    if (model.includes('reasoning')) {
      body.reasoning_budget = 16384;
    }

    let lastError: Error | null = null;

    // Dual-key failover attempt
    for (const key of keys) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), Number(process.env.AI_REQUEST_TIMEOUT_MS || 30000));

      try {
        const res = await fetch(`${NVIDIA_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`NVIDIA API HTTP ${res.status}: ${text.slice(0, 200)}`);
        }

        const data = await res.json().catch(() => ({}));
        const content =
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.delta?.content ||
          '';

        return {
          text: typeof content === 'string' ? content : JSON.stringify(content),
          model: data?.model || model,
          usage: data?.usage,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[NvidiaProvider] Key ${key.slice(0, 12)}... failed:`, lastError.message);
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError || new Error('NVIDIA complete call failed on all keys');
  }

  async *stream(request: AIProviderRequest): AsyncIterable<string> {
    const keys = this.getApiKeys();
    if (keys.length === 0) {
      throw new Error('NVIDIA API key not configured');
    }

    const model = request.model || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning';
    const body: Record<string, unknown> = {
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.6,
      top_p: 0.95,
      max_tokens: request.maxTokens ?? 4096,
      stream: true,
    };

    if (model.includes('reasoning')) {
      body.reasoning_budget = 16384;
    }

    for (const key of keys) {
      try {
        const res = await fetch(`${NVIDIA_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(body),
        });

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => '');
          throw new Error(`NVIDIA API HTTP ${res.status}: ${text.slice(0, 200)}`);
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
              const data = line.slice(6).trim();
              if (data === '[DONE]') return;
              try {
                const parsed = JSON.parse(data);
                const content =
                  parsed?.choices?.[0]?.delta?.content ||
                  parsed?.choices?.[0]?.message?.content;
                if (typeof content === 'string' && content.length > 0) {
                  yield content;
                }
              } catch {
                // Ignore SSE heartbeat or non-JSON chunk
              }
            }
          }
        }
        return;
      } catch (err) {
        console.warn(`[NvidiaProvider Stream] Key ${key.slice(0, 12)}... error:`, err instanceof Error ? err.message : String(err));
      }
    }
  }
}

export const nvidiaProvider = new NvidiaProvider();
