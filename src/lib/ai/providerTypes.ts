/**
 * CareerOS AI Provider Abstraction Layer
 * Allows swapping or adding providers (Gemini, etc.) without altering application workflows.
 */

export interface CallJsonOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  fallback: () => T;
  temperature?: number;
  model?: string;
}

export interface StreamTextOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  onChunk?: (chunk: string) => void;
  model?: string;
}

export interface IAIServiceProvider {
  readonly providerName: string;
  isConfigured(): boolean;
  callJson<T>(options: CallJsonOptions<T>): Promise<T>;
  streamText(options: StreamTextOptions): Promise<ReadableStream<Uint8Array>>;
}
