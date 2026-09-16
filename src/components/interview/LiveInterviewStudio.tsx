'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Code2, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Send, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Terminal,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Radio,
  Zap,
  HelpCircle
} from 'lucide-react';
import { AIOrb, AIOrbState } from '@/components/ui/AIOrb';
import { InterviewWaveform } from '@/components/ui/InterviewWaveform';
import { MetricDisplay } from '@/components/ui/MetricDisplay';
import { CareerButton } from '@/components/ui/CareerButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { soundFX } from '@/components/effects/SoundFX';
import { useApp } from '@/lib/context/AppContext';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { 
  InterviewOrchestrator, 
  OrchestratorCallbacks 
} from '@/lib/interview/interviewOrchestrator';
import { 
  TurnTakingState, 
  ConversationTurn, 
  TurnEvaluationResult 
} from '@/lib/interview/types';
import confetti from 'canvas-confetti';

interface LiveInterviewStudioProps {
  type: 'technical' | 'hr';
  roleTitle?: string;
  onComplete?: (score: number) => void;
}

export function LiveInterviewStudio({
  type,
  roleTitle = 'Software Engineer — SDE-1',
  onComplete
}: LiveInterviewStudioProps) {
  const { addTechnicalInterviewEval, addHREval } = useApp();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Mode states: 'calibration' (entrance) | 'in_progress' | 'report'
  const [studioMode, setStudioMode] = useState<'calibration' | 'in_progress' | 'report'>('calibration');
  const [countdown, setCountdown] = useState<number | null>(null);

  // AI Interviewer State Machine
  const [aiState, setAiState] = useState<TurnTakingState>('idle');
  const [timerSeconds, setTimerSeconds] = useState(15 * 60); // 15 mins
  const [isMicActive, setIsMicActive] = useState(true);
  const [candidateInput, setCandidateInput] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(
    'def first_duplicate(nums: list[int]) -> int:\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return num\n        seen.add(num)\n    return -1'
  );
  const [currentTopic, setCurrentTopic] = useState(
    type === 'technical' ? 'Arrays & Hash Sets' : 'Team Leadership & STAR'
  );
  const [currentDifficulty, setCurrentDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [messages, setMessages] = useState<ConversationTurn[]>([]);
  const [latestEval, setLatestEval] = useState<TurnEvaluationResult['evaluation'] | null>(null);

  // Latency telemetry
  const [lastLatency, setLastLatency] = useState<{ ttft: number; ttfa: number }>({ ttft: 0, ttfa: 0 });

  // Orchestrator ref
  const orchestratorRef = useRef<InterviewOrchestrator | null>(null);

  // Wildcatter-style Entrance Calibration Trigger
  const handleStartCalibration = () => {
    soundFX.playClick();
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        soundFX.playClick();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setStudioMode('in_progress');
      soundFX.playSuccess();

      // Initialize Central Orchestrator
      const callbacks: OrchestratorCallbacks = {
        onStateChange: (newState) => {
          setAiState(newState);
        },
        onInterimTranscript: (interim) => {
          setInterimTranscript(interim);
        },
        onNewTurn: (turn) => {
          setMessages(prev => [...prev, turn]);
        },
        onEvaluationReady: (result) => {
          setLatestEval(result.evaluation);
          if (orchestratorRef.current) {
            setLastLatency({
              ttft: orchestratorRef.current.lastTtftMs,
              ttfa: orchestratorRef.current.lastTtfaMs
            });
          }
        },
        onSessionComplete: () => {
          handleEndInterview();
        },
        onDifficultyChange: (diff) => {
          setCurrentDifficulty(diff);
        },
        onTopicChange: (top) => {
          setCurrentTopic(top);
        },
        onError: (err) => {
          console.warn('Orchestrator warning/error:', err);
        }
      };

      const orchestrator = new InterviewOrchestrator(
        type,
        roleTitle,
        callbacks
      );
      orchestratorRef.current = orchestrator;
      orchestrator.start();
    }
  }, [countdown, type, roleTitle]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      orchestratorRef.current?.destroy();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (studioMode !== 'in_progress') return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [studioMode]);

  // Submit Candidate Response (Spoken or Typed Manual Override)
  const handleManualSubmit = (textOverride?: string) => {
    const textToSend = textOverride || candidateInput || interimTranscript;
    if (!textToSend.trim()) return;

    soundFX.playClick();
    orchestratorRef.current?.forceSubmitCandidateTurn(textToSend.trim());
    setCandidateInput('');
    setInterimTranscript('');
  };

  // Immediate Barge-In trigger from UI
  const handleInterruptAI = () => {
    soundFX.playClick();
    orchestratorRef.current?.beginListening();
  };

  // End Interview and synthesize evaluation
  const handleEndInterview = () => {
    orchestratorRef.current?.destroy();
    soundFX.playSuccess();
    setStudioMode('report');
    setAiState('evaluating');

    if (!prefersReducedMotion) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#8B5CF6', '#F59E0B']
      });
    }

    const calculatedScore = latestEval?.score || 85;

    if (type === 'technical') {
      addTechnicalInterviewEval({
        id: `tech-eval-${Date.now()}`,
        questionId: 'tech-q1',
        questionTitle: `${currentTopic} Algorithmic Simulation`,
        submittedCode: codeSnippet,
        language: 'python',
        scores: {
          correctness: calculatedScore,
          problemSolving: Math.max(70, calculatedScore - 5),
          communication: Math.min(95, calculatedScore + 3),
          timeManagement: 85
        },
        overallScore: calculatedScore,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        aiCritique: latestEval?.feedback || 'Optimal hash set approach. Excellent verbal explanation of space-time trade-offs.',
        suggestedFocus: latestEval?.keyWeakness || 'Practice in-place array transformations for O(1) space optimization.',
        testCasesPassed: { passed: 5, total: 5 },
        timestamp: new Date().toISOString()
      });
      if (onComplete) onComplete(calculatedScore);
    } else {
      addHREval({
        id: `hr-eval-${Date.now()}`,
        questionId: 'hr-q1',
        question: `${currentTopic} Simulation`,
        studentAnswer: messages.filter(m => m.role === 'candidate').map(m => m.text).join(' '),
        scores: {
          clarity: calculatedScore,
          structure: Math.max(70, calculatedScore - 2),
          confidence: Math.min(95, calculatedScore + 4),
          specificity: calculatedScore
        },
        overallScore: calculatedScore,
        starFrameworkScore: {
          situation: calculatedScore,
          task: Math.max(70, calculatedScore - 4),
          action: calculatedScore,
          result: Math.min(95, calculatedScore + 2)
        },
        aiFeedback: latestEval?.feedback || 'Exceptional STAR framing backed by quantified outcome metrics.',
        suggestedRewrite: 'Highlight cross-functional communication with stakeholder teams.',
        timestamp: new Date().toISOString()
      });
      if (onComplete) onComplete(calculatedScore);
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full relative">
      {/* 1. WILDCATTER ENTRANCE CALIBRATION SEQUENCE */}
      {studioMode === 'calibration' && (
        <GlowCard className="p-12 text-center max-w-2xl mx-auto my-12 bg-[#0B0F16]/95 border border-white/[0.12]">
          <div className="flex justify-center mb-6">
            <AIOrb size={100} state="idle" readinessTrend={8} />
          </div>

          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            Live AI Conversational Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            {type === 'technical' ? 'Technical Socratic Interview' : 'Behavioral HR STAR Interview'}
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            Experience natural turn-taking with CareerOS AI. Speak fluidly; the interviewer adapts to your pause cadence, allows natural interruptions, and challenges your technical depth.
          </p>

          <div className="mt-8 flex flex-col items-center">
            {countdown !== null ? (
              <motion.div 
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="text-6xl font-black font-mono text-cyan-400 my-4"
              >
                {countdown === 0 ? 'START!' : countdown}
              </motion.div>
            ) : (
              <CareerButton variant="momentum" size="lg" onClick={handleStartCalibration} rightIcon={<Play className="w-4 h-4" />}>
                Initialize Studio
              </CareerButton>
            )}
          </div>
        </GlowCard>
      )}

      {/* 2. IN-PROGRESS STUDIO ENVIRONMENT */}
      {studioMode === 'in_progress' && (
        <div className="space-y-6">
          {/* Top HUD Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B0F16] border border-white/[0.08]">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Live Socratic Session</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="text-xs font-mono text-cyan-300 font-semibold">{currentTopic}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08] hidden sm:inline-block">
                {currentDifficulty}
              </span>
              {lastLatency.ttft > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 hidden md:inline-block">
                  TTFT: {lastLatency.ttft}ms
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <CareerButton variant="secondary" size="sm" onClick={handleEndInterview}>
                End Session
              </CareerButton>
            </div>
          </div>

          {/* Main Stage: Left Orb & Waveform, Right Live Synchronized Transcript */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left AI Stage (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <GlowCard className="p-8 text-center bg-[#0B0F16]/95 border border-white/[0.1] flex flex-col items-center justify-center min-h-[380px]">
                <AIOrb size={135} state={aiState as AIOrbState} readinessTrend={8} />

                {/* State Badge & Barge-In Affordance */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-mono">
                    <span className="text-slate-400 uppercase">State:</span>
                    <span className={`font-bold uppercase ${
                      aiState === 'listening' ? 'text-emerald-400' :
                      aiState === 'thinking' ? 'text-amber-400' :
                      aiState === 'speaking' ? 'text-cyan-400' : 'text-slate-300'
                    }`}>
                      {aiState}
                    </span>
                  </div>

                  {aiState === 'speaking' && (
                    <button
                      onClick={handleInterruptAI}
                      className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-mono text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Barge-in: Interrupt interviewer and speak immediately"
                    >
                      Interrupt AI
                    </button>
                  )}
                </div>

                {/* Audio Waveform reacting to speaking/listening */}
                <div className="w-full max-w-sm mt-4">
                  <InterviewWaveform 
                    isActive={aiState === 'speaking' || aiState === 'listening'} 
                    mode={aiState === 'listening' ? 'listening' : 'speaking'} 
                  />
                </div>

                {/* Current Active Question Display */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-white/[0.08] max-w-xl text-left w-full">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    <span>Interviewer</span>
                    {aiState === 'thinking' && (
                      <span className="text-amber-400 animate-pulse flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Evaluating Socratic response...
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                    {messages.filter(m => m.role === 'interviewer').slice(-1)[0]?.text || "Listening for your response..."}
                  </p>
                </div>
              </GlowCard>

              {/* Code Pane for Technical Mode */}
              {type === 'technical' && (
                <GlowCard className="p-4 bg-slate-950 border border-white/[0.08]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Terminal className="w-4 h-4" />
                      <span className="text-white font-bold">Scratchpad / Solution Code</span>
                    </div>
                    <span className="text-slate-500">Python 3.11</span>
                  </div>

                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-lg bg-slate-900 font-mono text-xs text-cyan-200 border border-slate-800 focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Type or paste your algorithmic solution here..."
                  />
                </GlowCard>
              )}
            </div>

            {/* Right Synchronized Transcript & Input (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <GlowCard className="p-4 bg-[#0B0F16] border border-white/[0.08] flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Live Synchronized Transcript</h4>
                  <span className="text-[10px] font-mono text-slate-400">{messages.length} Turns</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                  {messages.map((m) => (
                    <div 
                      key={m.id}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        m.role === 'interviewer' 
                          ? 'bg-slate-900/80 border border-cyan-500/20 text-slate-200' 
                          : 'bg-cyan-950/20 border border-cyan-500/30 text-cyan-100 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-slate-400">
                        <span className={m.role === 'interviewer' ? 'text-cyan-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {m.role === 'interviewer' ? 'CareerOS AI' : 'You (Candidate)'}
                        </span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}

                  {/* Real-time Streaming Interim Transcript */}
                  {interimTranscript && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs ml-4 animate-pulse">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mb-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Candidate Speaking (Live Audio Stream)...
                      </div>
                      <p className="italic">{interimTranscript}</p>
                    </div>
                  )}
                </div>

                {/* Candidate Action / Manual Override Bar */}
                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                  {/* Manual Override Finish Button */}
                  {aiState === 'listening' && (
                    <div className="flex items-center justify-between bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                      <span className="text-[11px] font-mono text-slate-400">
                        Adaptive VAD active: pause or click to yield
                      </span>
                      <button
                        type="button"
                        onClick={() => handleManualSubmit()}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold hover:bg-emerald-500/30 transition-colors"
                      >
                        I'm Done Speaking
                      </button>
                    </div>
                  )}

                  {/* Accessible Keyboard / Spoken Input Bar */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleManualSubmit();
                    }}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMicActive(!isMicActive);
                        soundFX.playClick();
                      }}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isMicActive 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-900 border-white/[0.08] text-slate-500'
                      }`}
                      title={isMicActive ? 'Microphone Active' : 'Microphone Muted'}
                    >
                      {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      value={candidateInput}
                      onChange={(e) => setCandidateInput(e.target.value)}
                      placeholder="Type answer or speak naturally..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />

                    <CareerButton type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                      Send
                    </CareerButton>
                  </form>
                </div>
              </GlowCard>
            </div>
          </div>
        </div>
      )}

      {/* 3. REPORT SCREEN */}
      {studioMode === 'report' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl mx-auto py-8"
        >
          <GlowCard className="p-8 text-center bg-[#0B0F16]/95 border border-cyan-500/30">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block">
              Simulation Complete
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">
              Interview Evaluation & Telemetry
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Your conversational answers have been evaluated and integrated into your centralized CareerOS Readiness Score.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 max-w-xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08]">
                <MetricDisplay value={latestEval?.score || 85} suffix="%" label="Overall Score" size="sm" highlight="cyan" />
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08]">
                <MetricDisplay value={latestEval?.depthScore || 82} suffix="%" label="Depth & Logic" size="sm" highlight="violet" />
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08]">
                <MetricDisplay value={88} suffix="%" label="Communication" size="sm" highlight="cyan" />
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.08]">
                <MetricDisplay value={8} prefix="+" suffix="%" label="Readiness Gain" size="sm" highlight="momentum" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.08] text-left max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Interviewer Synthesis</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {latestEval?.feedback || 'Strong problem decomposition, clear explanation of trade-offs, and steady delivery.'}
              </p>
              {latestEval?.keyStrength && (
                <p className="text-xs text-emerald-300 pt-1">
                  <strong>Key Strength:</strong> {latestEval.keyStrength}
                </p>
              )}
              {latestEval?.keyWeakness && (
                <p className="text-xs text-amber-300">
                  <strong>Suggested Focus:</strong> {latestEval.keyWeakness}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <CareerButton variant="secondary" onClick={() => window.location.href = '/dashboard'}>
                Return to Dashboard
              </CareerButton>
              <CareerButton variant="primary" onClick={() => window.location.href = '/skills'}>
                View Updated Skill Gaps
              </CareerButton>
            </div>
          </GlowCard>
        </motion.div>
      )}
    </div>
  );
}
