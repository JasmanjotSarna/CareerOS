import { CallJsonOptions, StreamTextOptions } from './providerTypes';

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Calls Gemini with structured JSON mode.
 * Automatically handles multi-model failover if a model returns 503/404/429.
 */
export async function callGeminiJson<T>(options: CallJsonOptions<T>): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY is not configured. Invoking heuristic fallback.');
    return options.fallback();
  }

  const modelsToTry = options.model ? [options.model, ...CANDIDATE_MODELS.filter(m => m !== options.model)] : CANDIDATE_MODELS;

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const payload = {
        systemInstruction: {
          parts: [{ text: options.systemPrompt }]
        },
        contents: [
          {
            parts: [{ text: options.userPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: options.temperature ?? 0.2,
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[Gemini] ${model} returned HTTP ${res.status}: ${errorText.slice(0, 150)}`);
        // If 503 (high demand) or 404, try next candidate model
        if (res.status === 503 || res.status === 404 || res.status === 429) {
          continue;
        }
        throw new Error(`Gemini ${model} HTTP ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error(`Empty response content from Gemini ${model}`);
      }

      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned) as T;
      return parsed;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[Gemini] Attempt with ${model} failed:`, lastError.message);
    }
  }

  console.warn('[Gemini] All Gemini candidate models exhausted. Safely falling back.', lastError?.message);
  return options.fallback();
}

/**
 * Streams text from Gemini using streamGenerateContent (Server-Sent Events)
 */
export async function streamGeminiText(options: StreamTextOptions): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.GEMINI_API_KEY;
  const encoder = new TextEncoder();

  if (!apiKey) {
    console.warn('[Gemini Stream] GEMINI_API_KEY not configured. Streaming simulated advice.');
    return new ReadableStream({
      start(controller) {
        const fallbackText = "I am CareerOS AI Career Coach. Based on your current telemetry, your highest return on effort is strengthening your technical foundations and practicing live mock interviews. Let's tackle your priority roadmap task today!";
        controller.enqueue(encoder.encode(fallbackText));
        controller.close();
      }
    });
  }

  const model = options.model || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: options.systemPrompt }]
    },
    contents: [
      {
        parts: [{ text: options.userPrompt }]
      }
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Gemini stream HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async pull(controller) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
            break;
          }

          const rawChunk = decoder.decode(value, { stream: true });
          const lines = rawChunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                // Ignore incomplete SSE fragments
              }
            }
          }
        }
      }
    });
  } catch (err) {
    console.warn('[Gemini Stream] Stream setup failed, falling back:', err);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("I am currently synchronizing your career telemetry. Focusing on your core technical problem solving and DSA fundamentals will yield immediate score gains."));
        controller.close();
      }
    });
  }
}
