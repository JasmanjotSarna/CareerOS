import { 
  TurnTakingState, 
  ConversationTurn, 
  TurnEvaluationResult,
  ISpeechToTextService,
  ITextToSpeechService
} from './types';
import { WebSpeechSTTService } from './speechToText';
import { WebSpeechTTSService } from './textToSpeech';
import { AdaptiveVoiceActivityDetector } from './adaptiveVAD';

export interface OrchestratorCallbacks {
  onStateChange: (state: TurnTakingState) => void;
  onInterimTranscript: (interimText: string) => void;
  onNewTurn: (turn: ConversationTurn) => void;
  onEvaluationReady?: (result: TurnEvaluationResult) => void;
  onSessionComplete: () => void;
  onDifficultyChange: (difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  onTopicChange: (topic: string) => void;
  onError: (error: string) => void;
}

export class InterviewOrchestrator {
  private state: TurnTakingState = 'idle';
  private interviewType: 'technical' | 'hr';
  private targetRole: string;
  private currentTopic: string;
  private currentDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  private history: ConversationTurn[] = [];
  private turnCount: number = 0;

  // Services
  private stt: ISpeechToTextService;
  private tts: ITextToSpeechService;
  private vad: AdaptiveVoiceActivityDetector;
  private callbacks: OrchestratorCallbacks;

  // Latency telemetry (for definition-of-done reporting)
  public lastThinkingLatencyMs: number = 0;
  public lastTtftMs: number = 0;
  public lastTtfaMs: number = 0;

  constructor(
    interviewType: 'technical' | 'hr',
    targetRole: string,
    callbacks: OrchestratorCallbacks,
    sttService?: ISpeechToTextService,
    ttsService?: ITextToSpeechService
  ) {
    this.interviewType = interviewType;
    this.targetRole = targetRole;
    this.callbacks = callbacks;
    this.currentTopic = interviewType === 'technical' ? 'Arrays & Hash Sets' : 'Team Leadership & STAR';
    this.currentDifficulty = 'Intermediate';

    this.stt = sttService || new WebSpeechSTTService();
    this.tts = ttsService || new WebSpeechTTSService();
    this.vad = new AdaptiveVoiceActivityDetector();
  }

  public getState(): TurnTakingState {
    return this.state;
  }

  public getHistory(): ConversationTurn[] {
    return this.history;
  }

  private setState(newState: TurnTakingState): void {
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  /**
   * Starts the interview with an initial Socratic greeting question
   */
  public start(initialPrompt?: string): void {
    this.history = [];
    this.turnCount = 0;
    this.vad.reset();

    const greeting = initialPrompt || (
      this.interviewType === 'technical'
        ? "Hello Jasmanjot. Welcome to your SDE-1 Technical Simulation. Today we'll examine linear time optimization and data structures. Given an array of integers, how would you find the first recurring element with optimal time and space complexity?"
        : "Hello Jasmanjot. Welcome to your Behavioral HR Interview. I will evaluate your leadership and problem solving using the STAR framework. Tell me about a time you faced a difficult technical blocker in a project and how you resolved it."
    );

    const initialTurn: ConversationTurn = {
      id: `turn-ai-${Date.now()}`,
      role: 'interviewer',
      text: greeting,
      timestamp: Date.now()
    };

    this.history.push(initialTurn);
    this.callbacks.onNewTurn(initialTurn);

    this.speakAIResponse(greeting);
  }

  /**
   * Vocalizes an AI response using sentence-level streaming.
   * Enables immediate Time-To-First-Audio without waiting for full synthesis.
   */
  private speakAIResponse(fullText: string): void {
    this.setState('speaking');
    const sentences = WebSpeechTTSService.splitIntoSentences(fullText);

    this.tts.streamSentences(
      sentences,
      (_index, _sentence) => {
        // AI is actively vocalizing a sentence
      },
      () => {
        // AI completed speaking: transition to listening and start watching for candidate speech
        this.beginListening();
      }
    );
  }

  /**
   * Enters the 'listening' state: starts streaming STT and watches for candidate speech or silence.
   */
  public beginListening(): void {
    if (this.state === 'evaluating') return;
    this.setState('listening');
    this.callbacks.onInterimTranscript('');

    // Start prolonged silence timer (14s)
    this.vad.startProlongedSilenceWatch(() => {
      this.handleProlongedSilence();
    });

    if (!this.stt.isListening()) {
      this.stt.start({
        onSpeechStart: () => {
          // BARGE-IN INTERRUPTION CHECK:
          // If candidate starts speaking while AI is in 'speaking' state, cancel audio immediately!
          if (this.state === 'speaking') {
            this.tts.cancel();
            this.setState('listening');
          }
        },
        onInterim: (partial) => {
          // Live partial transcript streaming to UI
          this.callbacks.onInterimTranscript(partial);
          // Update VAD speech activity and pause cadence
          this.vad.handleSpeechActivity(partial, false, (finalized) => {
            this.processCandidateUtterance(finalized);
          });
        },
        onFinal: (finalText) => {
          this.callbacks.onInterimTranscript(finalText);
          this.vad.handleSpeechActivity(finalText, true, (finalized) => {
            this.processCandidateUtterance(finalized);
          });
        },
        onSpeechEnd: () => {
          // Handled adaptively by VAD
        },
        onError: (err) => {
          this.callbacks.onError(err);
        }
      });
    }
  }

  /**
   * Manual override: Candidate presses "I'm done speaking"
   */
  public forceSubmitCandidateTurn(textOverride?: string): void {
    this.vad.clearTimers();
    if (textOverride && textOverride.trim()) {
      this.processCandidateUtterance(textOverride.trim());
    }
  }

  /**
   * Handles candidate utterance when adaptive VAD silence detection triggers
   */
  private async processCandidateUtterance(rawTranscript: string): Promise<void> {
    const transcript = rawTranscript.trim();
    if (!transcript) return;

    // Check for noise / garbage filter (< 3 words or cough/fillers)
    if (this.vad.isGarbageOrNoise(transcript)) {
      // Don't submit noise to Claude. Ask candidate to repeat or elaborate.
      const prompt = "I didn't quite catch that. Could you please repeat your thought with a bit more detail?";
      const turn: ConversationTurn = {
        id: `turn-ai-${Date.now()}`,
        role: 'interviewer',
        text: prompt,
        timestamp: Date.now()
      };
      this.history.push(turn);
      this.callbacks.onNewTurn(turn);
      this.speakAIResponse(prompt);
      return;
    }

    // Stop STT while evaluating
    this.stt.stop();
    this.vad.clearTimers();

    const candidateTurn: ConversationTurn = {
      id: `turn-cand-${Date.now()}`,
      role: 'candidate',
      text: transcript,
      timestamp: Date.now()
    };
    this.history.push(candidateTurn);
    this.callbacks.onNewTurn(candidateTurn);
    this.callbacks.onInterimTranscript('');

    // Transition to 'thinking'
    this.setState('thinking');
    const thinkingStart = Date.now();

    try {
      // Call server route with lean conversation context
      const res = await fetch('/api/ai/interview/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType: this.interviewType,
          targetRole: this.targetRole,
          currentTopic: this.currentTopic,
          currentDifficulty: this.currentDifficulty,
          candidateAnswer: transcript,
          history: this.history.map(h => ({ role: h.role, text: h.text })),
          turnCount: this.turnCount
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 403 || errData.code === 'consent_required') {
          this.destroy();
          this.callbacks.onError(errData.reason || 'Interview blocked: Required consent is missing or withdrawn.');
          return;
        }
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data: TurnEvaluationResult = await res.json();
      const thinkingEnd = Date.now();
      this.lastThinkingLatencyMs = thinkingEnd - thinkingStart;
      this.lastTtftMs = this.lastThinkingLatencyMs; // TTFT approximation

      this.turnCount++;
      if (data.updatedDifficulty) {
        this.currentDifficulty = data.updatedDifficulty;
        this.callbacks.onDifficultyChange(data.updatedDifficulty);
      }
      if (data.updatedTopic) {
        this.currentTopic = data.updatedTopic;
        this.callbacks.onTopicChange(data.updatedTopic);
      }

      this.callbacks.onEvaluationReady?.(data);

      const aiTurn: ConversationTurn = {
        id: `turn-ai-${Date.now()}`,
        role: 'interviewer',
        text: data.followUpQuestion,
        timestamp: Date.now()
      };
      this.history.push(aiTurn);
      this.callbacks.onNewTurn(aiTurn);

      if (data.shouldWrapUp) {
        this.setState('evaluating');
        this.tts.speakSentence(data.followUpQuestion, undefined, () => {
          this.callbacks.onSessionComplete();
        });
      } else {
        const audioStart = Date.now();
        this.speakAIResponse(data.followUpQuestion);
        this.lastTtfaMs = Date.now() - audioStart;
      }
    } catch (err: any) {
      this.callbacks.onError(`Turn evaluation failed: ${err?.message || err}`);
      // Fallback continuation
      const fallbackPrompt = "Thank you. How would you analyze the time and space complexity of that solution?";
      const fallbackTurn: ConversationTurn = {
        id: `turn-ai-${Date.now()}`,
        role: 'interviewer',
        text: fallbackPrompt,
        timestamp: Date.now()
      };
      this.history.push(fallbackTurn);
      this.callbacks.onNewTurn(fallbackTurn);
      this.speakAIResponse(fallbackPrompt);
    }
  }

  /**
   * Handles 14-second prolonged silence when candidate has stalled or walked away
   */
  private handleProlongedSilence(): void {
    if (this.state !== 'listening') return;
    this.stt.stop();

    const gentlePrompt = "Take your time, Jasmanjot. Would you like me to clarify the question or provide a small hint?";
    const promptTurn: ConversationTurn = {
      id: `turn-ai-reengage-${Date.now()}`,
      role: 'interviewer',
      text: gentlePrompt,
      timestamp: Date.now()
    };
    this.history.push(promptTurn);
    this.callbacks.onNewTurn(promptTurn);

    this.speakAIResponse(gentlePrompt);
  }

  /**
   * Cleanly stop and dismantle all active timers and audio listeners
   */
  public destroy(): void {
    this.vad.clearTimers();
    this.stt.stop();
    this.tts.cancel();
  }
}
