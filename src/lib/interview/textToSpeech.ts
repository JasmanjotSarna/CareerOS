import { ITextToSpeechService } from './types';

export class WebSpeechTTSService implements ITextToSpeechService {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private sentenceQueue: string[] = [];
  private isPlayingQueue: boolean = false;
  private currentSentenceIndex: number = 0;
  private onCompleteCallback: (() => void) | null = null;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  }

  public getProviderName(): string {
    return 'Browser-Native Web Speech Synthesis (Sentence-Streaming)';
  }

  public isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    return window.speechSynthesis.speaking || this.isPlayingQueue;
  }

  /**
   * Immediately stops audio playback and clears all pending sentences.
   * Critical for Barge-In interruption when the candidate starts speaking.
   */
  public cancel(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.sentenceQueue = [];
    this.isPlayingQueue = false;
    this.activeUtterance = null;
    this.onCompleteCallback = null;
  }

  /**
   * Speaks a single sentence immediately.
   */
  public speakSentence(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void, 
    onError?: (err: any) => void
  ): void {
    if (!this.isSupported() || !text.trim()) {
      onStart?.();
      setTimeout(() => onEnd?.(), 1500);
      return;
    }

    this.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (err) => {
      this.activeUtterance = null;
      onError?.(err);
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Streams a paragraph by splitting it into individual sentences and synthesizing
   * sentence #1 IMMEDIATELY. This dramatically slashes Time-to-First-Audio latency.
   */
  public streamSentences(
    sentences: string[], 
    onSentenceStart?: (index: number, text: string) => void, 
    onComplete?: () => void
  ): void {
    if (!this.isSupported()) {
      onComplete?.();
      return;
    }

    this.cancel();
    const cleanSentences = sentences
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (cleanSentences.length === 0) {
      onComplete?.();
      return;
    }

    this.sentenceQueue = [...cleanSentences];
    this.isPlayingQueue = true;
    this.currentSentenceIndex = 0;
    this.onCompleteCallback = onComplete || null;

    this.playNextSentenceInQueue(onSentenceStart);
  }

  private playNextSentenceInQueue(
    onSentenceStart?: (index: number, text: string) => void
  ): void {
    if (this.sentenceQueue.length === 0) {
      this.isPlayingQueue = false;
      this.activeUtterance = null;
      const done = this.onCompleteCallback;
      this.onCompleteCallback = null;
      done?.();
      return;
    }

    const currentText = this.sentenceQueue.shift()!;
    const currentIndex = this.currentSentenceIndex++;

    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      onSentenceStart?.(currentIndex, currentText);
    };

    utterance.onend = () => {
      // Continue next sentence seamlessly
      this.playNextSentenceInQueue(onSentenceStart);
    };

    utterance.onerror = () => {
      this.playNextSentenceInQueue(onSentenceStart);
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Utility helper to split continuous text into discrete sentences for streaming playback
   */
  public static splitIntoSentences(text: string): string[] {
    if (!text) return [];
    // Match sentences ending in punctuation or newlines
    const regex = /[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g;
    const matches = text.match(regex);
    if (!matches) return [text.trim()];
    return matches.map(m => m.trim()).filter(m => m.length > 0);
  }
}
