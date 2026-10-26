import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY || '';
const defaultModel = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

let anthropicClient: Anthropic | null = null;

export function isAnthropicConfigured(): boolean {
  return Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes('placeholder'));
}

export function getAnthropicClient(): Anthropic | null {
  if (!isAnthropicConfigured()) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export async function callClaudeJson<T>({
  systemPrompt,
  userPrompt,
  fallback,
  maxTokens = 2000,
  temperature = 0.2
}: {
  systemPrompt: string;
  userPrompt: string;
  fallback: () => T;
  maxTokens?: number;
  temperature?: number;
}): Promise<T> {
  const client = getAnthropicClient();
  if (!client) {
    try {
      const { callUniversalAIJson } = await import('./universalAI');
      return await callUniversalAIJson<T>({
        systemPrompt,
        userPrompt,
        maxTokens,
        temperature
      });
    } catch {
      return fallback();
    }
  }

  try {
    const response = await client.messages.create({
      model: defaultModel,
      max_tokens: maxTokens,
      temperature,
      system: `${systemPrompt}\n\nIMPORTANT: Respond with pure, valid JSON ONLY. Do NOT enclose in markdown formatting or backticks. No conversational filler or explanations before or after the JSON.`,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    // Clean any accidental markdown code fences
    let cleaned = textContent;
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    const parsed = JSON.parse(cleaned.trim()) as T;
    return parsed;
  } catch (err) {
    console.warn('Claude API call or parsing failed, falling back gracefully:', err);
    return fallback();
  }
}
