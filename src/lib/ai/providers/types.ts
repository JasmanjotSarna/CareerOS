export interface AIProviderMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProviderRequest {
  model: string;
  messages: AIProviderMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIProviderResponse {
  text: string;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export type AIProviderName = 'opencode' | 'nvidia' | 'gemini' | 'groq' | 'openrouter';

export interface AIProvider {
  name: AIProviderName;
  complete(request: AIProviderRequest): Promise<AIProviderResponse>;
  stream?(request: AIProviderRequest): AsyncIterable<string>;
  testConnection(): Promise<{ ok: boolean; message: string }>;
  isConfigured(): boolean;
}
