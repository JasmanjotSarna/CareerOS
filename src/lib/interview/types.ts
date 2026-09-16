export type TurnTakingState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'speaking' 
  | 'processing' 
  | 'evaluating';

export type TurnAction = 
  | 'follow_up' 
  | 'probe_complexity' 
  | 're_engage' 
  | 'repeat_prompt' 
  | 'transition_topic' 
  | 'wrap_up';

export interface VADConfig {
  /** Baseline debounce silence duration before marking candidate turn finished (ms) */
  baseSilenceDebounceMs: number;
  /** Maximum threshold to expand to for naturally slow, pause-heavy speakers (ms) */
  maxAdaptiveSilenceMs: number;
  /** Minimum speech length before an utterance is considered valid (ms) */
  minSpeechDurationMs: number;
  /** Minimum word count before an utterance is treated as an intentional answer (avoids coughs/clicks) */
  minWordCount: number;
  /** Inactivity threshold before the AI interviewer gently re-engages (ms) */
  prolongedSilenceTimeoutMs: number;
}

export const DEFAULT_VAD_CONFIG: VADConfig = {
  baseSilenceDebounceMs: 850,
  maxAdaptiveSilenceMs: 2200,
  minSpeechDurationMs: 400,
  minWordCount: 3,
  prolongedSilenceTimeoutMs: 14000
};

export interface STTEvent {
  transcript: string;
  interimTranscript: string;
  isFinal: boolean;
  confidence?: number;
}

export interface STTCallbacks {
  onInterim: (partialText: string) => void;
  onFinal: (finalText: string) => void;
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
  onError: (error: string) => void;
}

export interface ISpeechToTextService {
  start(callbacks: STTCallbacks): void;
  stop(): void;
  isListening(): boolean;
  isSupported(): boolean;
  getProviderName(): string;
}

export interface ITextToSpeechService {
  speakSentence(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void, 
    onError?: (err: any) => void
  ): void;
  streamSentences(
    sentences: string[], 
    onSentenceStart?: (index: number, text: string) => void, 
    onComplete?: () => void
  ): void;
  cancel(): void;
  isSpeaking(): boolean;
  isSupported(): boolean;
  getProviderName(): string;
}

export interface ConversationTurn {
  id: string;
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: number;
  isInterim?: boolean;
}

export interface TurnEvaluationResult {
  evaluation: {
    score: number;
    depthScore: number;
    feedback: string;
    keyStrength?: string;
    keyWeakness?: string;
  };
  nextAction: TurnAction;
  followUpQuestion: string;
  updatedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  updatedTopic: string;
  shouldWrapUp: boolean;
}
