import { ISpeechToTextService, STTCallbacks } from './types';

// Declare types for Web Speech API recognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export class WebSpeechSTTService implements ISpeechToTextService {
  private recognition: any = null;
  private listening: boolean = false;
  private callbacks: STTCallbacks | null = null;
  private accumulatedFinalText: string = '';

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public getProviderName(): string {
    return 'Browser-Native Web Speech API (Streaming STT)';
  }

  public isListening(): boolean {
    return this.listening;
  }

  public start(callbacks: STTCallbacks): void {
    if (!this.isSupported()) {
      callbacks.onError('Web Speech API is not supported in this browser environment.');
      return;
    }

    // If already running, reset state
    this.stop();
    this.callbacks = callbacks;
    this.accumulatedFinalText = '';

    const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecClass();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.listening = true;
    };

    this.recognition.onspeechstart = () => {
      this.callbacks?.onSpeechStart();
    };

    this.recognition.onspeechend = () => {
      this.callbacks?.onSpeechEnd();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let newlyFinalized = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const transcriptChunk = item[0]?.transcript || '';
        if (item.isFinal) {
          newlyFinalized += transcriptChunk + ' ';
        } else {
          interim += transcriptChunk;
        }
      }

      if (newlyFinalized.trim().length > 0) {
        this.accumulatedFinalText += newlyFinalized;
        const totalFinal = this.accumulatedFinalText.trim();
        this.callbacks?.onFinal(totalFinal);
      } else if (interim.trim().length > 0) {
        const preview = (this.accumulatedFinalText + ' ' + interim).trim();
        this.callbacks?.onInterim(preview);
      }
    };

    this.recognition.onerror = (event: any) => {
      // Ignore routine harmless no-speech timeouts
      if (event.error === 'no-speech') {
        return;
      }
      if (event.error === 'aborted') {
        return;
      }
      this.callbacks?.onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.listening = false;
      // If stopped unexpectedly while callbacks are active, attempt restart if intentional
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
    }
  }

  public stop(): void {
    this.listening = false;
    if (this.recognition) {
      try {
        this.recognition.onend = null;
        this.recognition.onerror = null;
        this.recognition.stop();
      } catch (err) {
        // Ignored
      }
      this.recognition = null;
    }
    this.callbacks = null;
    this.accumulatedFinalText = '';
  }
}
