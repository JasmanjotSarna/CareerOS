import { VADConfig, DEFAULT_VAD_CONFIG } from './types';

export class AdaptiveVoiceActivityDetector {
  private config: VADConfig;
  private silenceTimer: NodeJS.Timeout | null = null;
  private prolongedTimer: NodeJS.Timeout | null = null;
  
  // Cadence tracking
  private pauseDurations: number[] = [];
  private lastSpeechTimestamp: number = 0;
  private speechStartTimestamp: number = 0;
  private isSpeaking: boolean = false;

  constructor(config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_VAD_CONFIG, ...config };
  }

  /**
   * Reset all active timers and cadence metrics
   */
  public reset(): void {
    this.clearTimers();
    this.pauseDurations = [];
    this.lastSpeechTimestamp = 0;
    this.speechStartTimestamp = 0;
    this.isSpeaking = false;
  }

  public clearTimers(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.prolongedTimer) {
      clearTimeout(this.prolongedTimer);
      this.prolongedTimer = null;
    }
  }

  /**
   * Starts monitoring for prolonged silence while the AI waits for the candidate.
   */
  public startProlongedSilenceWatch(onProlongedSilence: () => void): void {
    this.clearTimers();
    this.prolongedTimer = setTimeout(() => {
      onProlongedSilence();
    }, this.config.prolongedSilenceTimeoutMs);
  }

  /**
   * Called whenever candidate speech activity is detected.
   * Cancels prolonged silence timer and starts or updates cadence.
   */
  public handleSpeechActivity(
    transcript: string,
    isFinal: boolean,
    onTurnFinished: (finalText: string) => void
  ): void {
    const now = Date.now();

    // Cancel prolonged silence since candidate is actively producing input
    if (this.prolongedTimer) {
      clearTimeout(this.prolongedTimer);
      this.prolongedTimer = null;
    }

    if (!this.isSpeaking) {
      this.isSpeaking = true;
      this.speechStartTimestamp = now;
      this.lastSpeechTimestamp = now;
    } else {
      // Record pause duration between previous speech event and now
      const pauseDuration = now - this.lastSpeechTimestamp;
      if (pauseDuration > 200 && pauseDuration < 4000) {
        this.pauseDurations.push(pauseDuration);
        if (this.pauseDurations.length > 8) {
          this.pauseDurations.shift();
        }
      }
      this.lastSpeechTimestamp = now;
    }

    // Reset silence debounce timer
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // Calculate dynamic debounce threshold based on candidate's historical cadence
    const adaptiveDebounceMs = this.computeAdaptiveDebounce();

    // Schedule turn completion
    this.silenceTimer = setTimeout(() => {
      this.isSpeaking = false;
      this.silenceTimer = null;
      onTurnFinished(transcript);
    }, adaptiveDebounceMs);
  }

  /**
   * Computes the adaptive silence debounce threshold.
   * If the candidate regularly pauses for 1.2s - 2.0s while formulating thoughts,
   * dynamically scales the silence threshold so we never cut them off mid-sentence.
   */
  public computeAdaptiveDebounce(): number {
    if (this.pauseDurations.length < 2) {
      return this.config.baseSilenceDebounceMs;
    }

    const avgPause = this.pauseDurations.reduce((a, b) => a + b, 0) / this.pauseDurations.length;
    // Scale baseline: base + 60% of average pause
    const computed = this.config.baseSilenceDebounceMs + (avgPause * 0.6);
    
    // Clamp between base and maximum allowed silence
    return Math.min(this.config.maxAdaptiveSilenceMs, Math.max(this.config.baseSilenceDebounceMs, computed));
  }

  /**
   * Inspects transcript to distinguish between genuine candidate answers
   * and ambient noise, coughs, single-word microphone clicks, or filler fragments.
   */
  public isGarbageOrNoise(transcript: string): boolean {
    const cleaned = (transcript || '').trim().toLowerCase();
    if (!cleaned) return true;

    // Filter out common non-answer filler noises
    const pureFillers = ['um', 'uh', 'ah', 'er', 'hmm', 'huh', 'cough', 'throat clearing'];
    if (pureFillers.includes(cleaned)) return true;

    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    // If fewer than minWordCount (default 3 words), treat as noise/accidental trigger
    if (words.length < this.config.minWordCount) {
      return true;
    }

    return false;
  }
}
