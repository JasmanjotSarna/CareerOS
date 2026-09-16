import { IAIServiceProvider, CallJsonOptions, StreamTextOptions } from './providerTypes';
import { isGeminiConfigured, callGeminiJson, streamGeminiText } from './geminiClient';

export class GeminiProvider implements IAIServiceProvider {
  readonly providerName = 'google-gemini';

  isConfigured(): boolean {
    return isGeminiConfigured();
  }

  async callJson<T>(options: CallJsonOptions<T>): Promise<T> {
    return callGeminiJson<T>(options);
  }

  async streamText(options: StreamTextOptions): Promise<ReadableStream<Uint8Array>> {
    return streamGeminiText(options);
  }
}

// Default singleton instance
export const defaultAIProvider: IAIServiceProvider = new GeminiProvider();
