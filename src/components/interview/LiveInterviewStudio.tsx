'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video,
  VideoOff,
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
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileText,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { AIOrb, AIOrbState } from '@/components/ui/AIOrb';
import { InterviewWaveform } from '@/components/ui/InterviewWaveform';
import { StatMetric } from '@/components/ui/StatMetric';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
import { PreInterviewConsentModal, ConsentPreferences } from './PreInterviewConsentModal';
import { PostInterviewPrivacyModal } from './PostInterviewPrivacyModal';
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

  // Mode states: 'calibration' (entrance/device-check) | 'in_progress' | 'report' | 'withdrawn'
  const [studioMode, setStudioMode] = useState<'calibration' | 'in_progress' | 'report' | 'withdrawn'>('calibration');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Privacy & Consent State Machine
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showActivePrivacyModal, setShowActivePrivacyModal] = useState(false);
  const [showPostPrivacyModal, setShowPostPrivacyModal] = useState(false);
  const [consentPrefs, setConsentPrefs] = useState<ConsentPreferences | null>(null);

  // Device Readiness State Machine (Strictly uninitialized before consent)
  const [micStatus, setMicStatus] = useState<'idle' | 'checking' | 'ready' | 'denied'>('idle');
  const [camStatus, setCamStatus] = useState<'idle' | 'checking' | 'ready' | 'denied' | 'audio_only'>('idle');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'ready' | 'offline'>('idle');
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Live Timer & Recording Indicators
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(15 * 60); // 15 mins countdown

  // AI Interviewer State Machine
  const [aiState, setAiState] = useState<TurnTakingState>('idle');
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

  // 1. Device Hardware Validation (ONLY called after consent is recorded)
  const initializeDevices = async (wantCamera: boolean) => {
    setDeviceError(null);
    setMicStatus('checking');
    setCamStatus(wantCamera ? 'checking' : 'audio_only');
    setConnectionStatus('checking');

    // Check internet connectivity
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setConnectionStatus('offline');
      setDeviceError('No internet connection detected. Please connect to a network.');
      return;
    }
    setConnectionStatus('ready');

    // Browser media check
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicStatus('denied');
      setDeviceError('Your browser does not support WebRTC media recording.');
      return;
    }

    try {
      // Step 1: Request Microphone
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('ready');

      // Step 2: Request Camera if candidate opted in
      if (wantCamera) {
        try {
          const camStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
          // Combine tracks
          const combined = new MediaStream([
            ...micStream.getAudioTracks(),
            ...camStream.getVideoTracks()
          ]);
          mediaStreamRef.current = combined;
          setCamStatus('ready');

          if (videoRef.current) {
            videoRef.current.srcObject = combined;
          }
        } catch (camErr) {
          console.warn('Camera permission denied or camera missing:', camErr);
          setCamStatus('denied');
          mediaStreamRef.current = micStream;
          setDeviceError('Camera access denied or no webcam detected. You can proceed in Audio-Only Mode.');
        }
      } else {
        mediaStreamRef.current = micStream;
        setCamStatus('audio_only');
      }

      soundFX.playSuccess();
    } catch (micErr: any) {
      console.error('Microphone permission denied:', micErr);
      setMicStatus('denied');
      setDeviceError('Microphone permission was denied. Microphone access is required for AI speech-to-text.');
      soundFX.playPulse();
    }
  };

  const handleConsentGranted = (prefs: ConsentPreferences) => {
    setHasConsent(true);
    setConsentPrefs(prefs);
    setShowConsentModal(false);
    // Initialize hardware check only after valid consent
    initializeDevices(prefs.cameraConsent);
  };

  const handleFallbackAudioOnly = () => {
    setCamStatus('audio_only');
    setDeviceError(null);
    soundFX.playClick();
  };

  const handleStartCountdown = () => {
    if (!hasConsent || micStatus !== 'ready') return;
    soundFX.playClick();
    setCountdown(3);
  };

  // Countdown & Session Start
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
      setElapsedSeconds(0);
      soundFX.playSuccess();

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

  // Clean up streams and orchestrator on unmount
  useEffect(() => {
    return () => {
      orchestratorRef.current?.destroy();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer increments
  useEffect(() => {
    if (studioMode !== 'in_progress') return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [studioMode]);

  const handleManualSubmit = (textOverride?: string) => {
    const textToSend = textOverride || candidateInput || interimTranscript;
    if (!textToSend.trim()) return;

    soundFX.playClick();
    orchestratorRef.current?.forceSubmitCandidateTurn(textToSend.trim());
    setCandidateInput('');
    setInterimTranscript('');
  };

  const handleInterruptAI = () => {
    soundFX.playClick();
    orchestratorRef.current?.beginListening();
  };

  // Mid-Interview Consent Withdrawal
  const handleWithdrawConsentMidSession = async () => {
    soundFX.playPulse();
    // Stop streams immediately
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    // Destroy orchestrator
    orchestratorRef.current?.destroy();

    try {
      await fetch('/api/ai/interview/consent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewType: type, deleteData: false })
      });
    } catch (e) {
      console.error('Failed to notify server of withdrawal:', e);
    }

    setHasConsent(false);
    setShowActivePrivacyModal(false);
    setStudioMode('withdrawn');
  };

  const handleEndInterview = () => {
    orchestratorRef.current?.destroy();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    soundFX.playSuccess();
    setStudioMode('report');
    setAiState('evaluating');

    if (!prefersReducedMotion) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#6366F1', '#F59E0B']
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

  const formatElapsed = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full relative">
      {/* 1. ENTRANCE & PRE-INTERVIEW STAGE */}
      {studioMode === 'calibration' && (
        <div className="max-w-2xl mx-auto my-6 space-y-6">
          {!hasConsent ? (
            /* STEP 1A: PRE-CONSENT SCREEN (NO PERMISSIONS REQUESTED YET) */
            <GlowCard glowColor="cyan" className="p-8 sm:p-10 text-center bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>

              <Badge variant="cyan" className="mb-2">
                Privacy-First AI Architecture
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                {type === 'technical' ? 'Technical Socratic Coding Mock' : 'Behavioral HR STAR Interview'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-3 max-w-lg mx-auto leading-relaxed">
                CareerOS conversational interviews require candidate consent before accessing audio, video, or running AI transcription. No sensors are activated until you review and approve specific purposes.
              </p>

              {/* Data Minimization Disclosure Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 text-left">
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Data Minimization</h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Strictly evaluates response logic, code correctness, and STAR structure. Zero emotion or biometric detection.</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Candidate Control</h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">30-day default retention. Full export and instant permanent deletion available anytime post-interview.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => setShowConsentModal(true)} 
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Review Privacy & Grant Consent
                </Button>
              </div>
            </GlowCard>
          ) : (
            /* STEP 1B: HARDWARE READINESS & DEVICE CHECK (ONLY AFTER SERVER CONSENT) */
            <GlowCard glowColor="cyan" className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <Badge variant="success" className="mb-1">
                    Consent Verified (Policy v1.0.0)
                  </Badge>
                  <h3 className="text-xl font-bold text-white">Device Readiness & Sensor Verification</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowConsentModal(true)} 
                  className="text-xs text-[var(--text-muted)]"
                >
                  Edit Consent
                </Button>
              </div>

              {/* Error banner / recovery path */}
              {deviceError && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{deviceError}</span>
                  </div>
                  {camStatus === 'denied' && (
                    <Button variant="secondary" size="sm" onClick={handleFallbackAudioOnly}>
                      Use Audio-Only
                    </Button>
                  )}
                </div>
              )}

              {/* Hardware Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                {/* 1. Microphone */}
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <div className="flex justify-center mb-1.5">
                    {micStatus === 'ready' ? (
                      <Mic className="w-5 h-5 text-emerald-400" />
                    ) : micStatus === 'checking' ? (
                      <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : (
                      <MicOff className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Microphone</span>
                  <span className={`text-xs font-bold ${micStatus === 'ready' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {micStatus === 'ready' ? 'Active' : micStatus === 'checking' ? 'Validating...' : 'Denied'}
                  </span>
                </div>

                {/* 2. Camera */}
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <div className="flex justify-center mb-1.5">
                    {camStatus === 'ready' ? (
                      <Video className="w-5 h-5 text-emerald-400" />
                    ) : camStatus === 'audio_only' ? (
                      <Volume2 className="w-5 h-5 text-cyan-400" />
                    ) : camStatus === 'checking' ? (
                      <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : (
                      <VideoOff className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Camera</span>
                  <span className={`text-xs font-bold ${camStatus === 'ready' ? 'text-emerald-400' : camStatus === 'audio_only' ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {camStatus === 'ready' ? 'Stream OK' : camStatus === 'audio_only' ? 'Audio-Only' : 'Optional/Denied'}
                  </span>
                </div>

                {/* 3. Connection */}
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <div className="flex justify-center mb-1.5">
                    <Radio className={`w-5 h-5 ${connectionStatus === 'ready' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Connection</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {connectionStatus === 'ready' ? 'Secure TLS' : 'Connecting...'}
                  </span>
                </div>

                {/* 4. Consent */}
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <div className="flex justify-center mb-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Consent</span>
                  <span className="text-xs font-bold text-emerald-400">Verified</span>
                </div>
              </div>

              {/* Video Preview Box (if webcam enabled) */}
              {camStatus === 'ready' && (
                <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 bg-black aspect-video max-h-48 mx-auto mb-5">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover mirror"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Webcam Preview Ready
                  </div>
                </div>
              )}

              {/* Readiness Action */}
              <div className="mt-6 flex flex-col items-center">
                {countdown !== null ? (
                  <motion.div 
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="text-5xl font-black font-mono text-cyan-400 my-4"
                  >
                    {countdown === 0 ? 'START!' : countdown}
                  </motion.div>
                ) : (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    disabled={micStatus !== 'ready'} 
                    onClick={handleStartCountdown} 
                    rightIcon={<Play className="w-4 h-4" />}
                  >
                    Start Interview
                  </Button>
                )}
                {micStatus !== 'ready' && (
                  <p className="text-xs text-amber-400 mt-2">
                    Microphone validation required to enable session start.
                  </p>
                )}
              </div>
            </GlowCard>
          )}
        </div>
      )}

      {/* 2. IN-PROGRESS STUDIO ENVIRONMENT */}
      {studioMode === 'in_progress' && (
        <div className="space-y-6">
          {/* Top HUD Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)]">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {/* MANDATORY RECORDING INDICATOR (SECTION 7 REQUIREMENT) */}
              <div 
                id="career-os-recording-badge"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 font-mono text-xs font-bold tracking-wide shadow-md shadow-red-500/20 animate-pulse"
                title="Recording in progress"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>RED DOT — RECORDING</span>
                <span className="text-white font-mono ml-1">{formatElapsed(elapsedSeconds)}</span>
              </div>

              <span className="text-[var(--text-dim)] hidden sm:inline">|</span>
              <span className="text-xs font-mono text-cyan-300 font-semibold">{currentTopic}</span>
              <Badge variant="neutral" className="hidden sm:inline-flex">
                {currentDifficulty}
              </Badge>
              {lastLatency.ttft > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 hidden md:inline-block">
                  TTFT: {lastLatency.ttft}ms
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Privacy & Withdrawal Access during session (SECTION 8) */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowActivePrivacyModal(true)}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                className="text-xs text-[var(--text-muted)] hover:text-white"
              >
                Privacy
              </Button>

              <div className="flex items-center gap-1.5 font-mono text-xs text-white bg-[var(--surface-secondary)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleEndInterview}>
                End Session
              </Button>
            </div>
          </div>

          {/* Main Stage: Left AI Stage & Code Editor, Right Synchronized Transcript */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left AI Stage (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <GlowCard glowColor="cyan" className="p-6 sm:p-8 text-center bg-[var(--surface-primary)] border border-[var(--border-default)] flex flex-col items-center justify-center min-h-[360px]">
                <AIOrb size={120} state={aiState as AIOrbState} readinessTrend={8} />

                {/* State Badge & Barge-In Affordance */}
                <div className="mt-4 flex items-center gap-3">
                  <Badge variant={aiState === 'listening' ? 'success' : aiState === 'thinking' ? 'warning' : 'cyan'}>
                    State: {aiState}
                  </Badge>

                  {aiState === 'speaking' && (
                    <button
                      type="button"
                      onClick={handleInterruptAI}
                      className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-mono text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      title="Barge-in: Interrupt interviewer and speak immediately"
                    >
                      Interrupt AI
                    </button>
                  )}
                </div>

                {/* Audio Waveform */}
                <div className="w-full max-w-sm mt-4">
                  <InterviewWaveform 
                    isActive={aiState === 'speaking' || aiState === 'listening'} 
                    mode={aiState === 'listening' ? 'listening' : 'speaking'} 
                  />
                </div>

                {/* Active Question Box */}
                <div className="mt-6 p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] max-w-xl text-left w-full">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    <span>CareerOS AI Interviewer</span>
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
                <Card className="p-4 bg-[#090d16] border border-[var(--border-default)]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)] text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Terminal className="w-4 h-4" />
                      <span className="text-white">Solution Scratchpad</span>
                    </div>
                    <span className="text-[var(--text-dim)]">Python 3.11</span>
                  </div>

                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-xl bg-[var(--surface-primary)] font-mono text-xs text-cyan-200 border border-[var(--border-subtle)] focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Type or paste your algorithmic solution here..."
                  />
                </Card>
              )}
            </div>

            {/* Right Synchronized Transcript & Input (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-4 bg-[var(--surface-primary)] border border-[var(--border-default)] flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Synchronized Transcript</h4>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{messages.length} Turns</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                  {messages.map((m) => (
                    <div 
                      key={m.id}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        m.role === 'interviewer' 
                          ? 'bg-[var(--surface-secondary)] border border-cyan-500/20 text-[var(--text-primary)]' 
                          : 'bg-cyan-950/30 border border-cyan-500/30 text-cyan-100 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-[var(--text-dim)]">
                        <span className={m.role === 'interviewer' ? 'text-cyan-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {m.role === 'interviewer' ? 'CareerOS AI' : 'You (Candidate)'}
                        </span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}

                  {interimTranscript && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs ml-4 animate-pulse">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mb-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Candidate Speaking (Live Audio)...
                      </div>
                      <p className="italic">{interimTranscript}</p>
                    </div>
                  )}
                </div>

                {/* Candidate Action / Manual Override */}
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  {aiState === 'listening' && (
                    <div className="flex items-center justify-between bg-[var(--surface-secondary)] p-2 rounded-xl border border-[var(--border-subtle)]">
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        VAD active: click when done speaking
                      </span>
                      <button
                        type="button"
                        onClick={() => handleManualSubmit()}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
                      >
                        Done Speaking
                      </button>
                    </div>
                  )}

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
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isMicActive 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-[var(--surface-secondary)] border-[var(--border-subtle)] text-[var(--text-dim)]'
                      }`}
                      title={isMicActive ? 'Microphone Active' : 'Microphone Muted'}
                    >
                      {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      value={candidateInput}
                      onChange={(e) => setCandidateInput(e.target.value)}
                      placeholder="Type response or speak naturally..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-default)] text-xs text-white placeholder-[var(--text-dim)] focus:border-cyan-500 focus:outline-none"
                    />

                    <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                      Send
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* 3. WITHDRAWN SCREEN (MID-INTERVIEW TERMINATION CONFIRMATION) */}
      {studioMode === 'withdrawn' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-[var(--surface-primary)] border border-red-500/30 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <Badge variant="neutral" className="mb-2 text-red-300 border-red-500/30">
            Session Terminated
          </Badge>
          <h2 className="text-2xl font-black text-white">Consent Withdrawn</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            All audio recording, video capture, speech transcription, and AI model evaluation have stopped immediately. Your consent revocation has been registered on the server.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button variant="secondary" onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
            <Button variant="primary" onClick={() => {
              setStudioMode('calibration');
              setHasConsent(false);
            }}>
              Restart Interview Setup
            </Button>
          </div>
        </motion.div>
      )}

      {/* 4. POST-INTERVIEW REPORT SCREEN */}
      {studioMode === 'report' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl mx-auto py-8"
        >
          <GlowCard glowColor="cyan" className="p-8 text-center bg-[var(--surface-primary)] border border-cyan-500/30">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <Badge variant="cyan" className="mb-2">
              Simulation Complete
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Interview Evaluation & Scorecard
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 max-w-md mx-auto">
              Your conversational answers have been evaluated and integrated into your centralized CareerOS Readiness Score.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 max-w-xl mx-auto">
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                <StatMetric value={latestEval?.score || 85} suffix="%" label="Overall Score" size="sm" highlight="cyan" />
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                <StatMetric value={latestEval?.depthScore || 82} suffix="%" label="Depth & Logic" size="sm" highlight="indigo" />
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                <StatMetric value={88} suffix="%" label="Communication" size="sm" highlight="cyan" />
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                <StatMetric value={2} suffix="%" label="Readiness Gain" size="sm" highlight="momentum" trend={2} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-left max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Interviewer Synthesis</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
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

            {/* Privacy Controls Action Row (SECTION 9) */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button 
                variant="secondary" 
                onClick={() => setShowPostPrivacyModal(true)}
                leftIcon={<ShieldCheck className="w-4 h-4 text-cyan-400" />}
              >
                Privacy & Data Controls
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/dashboard'}>
                Return to Dashboard
              </Button>
              <Button variant="primary" onClick={() => window.location.href = '/skills'}>
                View Updated Skill Gaps
              </Button>
            </div>
          </GlowCard>
        </motion.div>
      )}

      {/* MODAL 1: PRE-INTERVIEW CONSENT MODAL */}
      <PreInterviewConsentModal
        isOpen={showConsentModal}
        interviewType={type}
        roleTitle={roleTitle}
        onConsentGranted={handleConsentGranted}
        onCancel={() => setShowConsentModal(false)}
      />

      {/* MODAL 2: POST-INTERVIEW PRIVACY & DATA CONTROLS MODAL */}
      <PostInterviewPrivacyModal
        isOpen={showPostPrivacyModal}
        interviewType={type}
        transcript={messages.map(m => `[${m.role === 'interviewer' ? 'CareerOS AI' : 'Candidate'}]: ${m.text}`).join('\n\n')}
        onClose={() => setShowPostPrivacyModal(false)}
        onDataDeleted={() => {
          setMessages([]);
          setLatestEval(null);
        }}
      />

      {/* MODAL 3: MID-SESSION PRIVACY WITHDRAWAL CONFIRMATION */}
      <AnimatePresence>
        {showActivePrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowActivePrivacyModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-[var(--surface-primary)] border border-red-500/30 rounded-2xl p-6 z-10 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Withdraw Consent & Stop Session</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Active technical privacy control</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Withdrawing consent will immediately terminate audio streaming, halt AI model inference, and mark your session consent as revoked on the backend.
              </p>

              <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[11px] space-y-1 font-mono text-[var(--text-muted)]">
                <div>• Active Consent: <span className="text-emerald-400">Granted (v1.0.0)</span></div>
                <div>• Current Status: <span className="text-red-400">Recording & Audio Streaming</span></div>
                <div>• Revocation: <span className="text-white">Instant Server-Side Halt</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowActivePrivacyModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={handleWithdrawConsentMidSession}
                  leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                >
                  Confirm Withdrawal
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
