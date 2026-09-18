'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Clock, 
  Play, 
  Square, 
  RefreshCw, 
  Volume2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { StatMetric } from '@/components/ui/StatMetric';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressRing';
import { AIService } from '@/lib/ai/aiService';
import { CommunicationMetric } from '@/types';
import { soundFX } from '@/components/effects/SoundFX';

export default function CommunicationPage() {
  const { updateCommunicationMetric, communicationMetrics, readinessScores, activeTargetRole } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [metric, setMetric] = useState<CommunicationMetric | null>(null);
  const [drillTopic, setDrillTopic] = useState('Introduce yourself and summarize your most challenging technical project in 90 seconds.');
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [waveHeights, setWaveHeights] = useState<number[]>([15, 20, 25, 30, 25, 35, 40, 45, 35, 30, 25, 20, 15, 20, 25, 20]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    soundFX.playClick();
    setIsRecording(true);
    setRecordingSeconds(0);
    setMetric(null);

    // Simulate reactive waveform
    simIntervalRef.current = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 50) + 15)
      );
    }, 120);
  };

  const stopRecording = () => {
    soundFX.playSuccess();
    setIsRecording(false);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    const calculatedMetric: CommunicationMetric = {
      id: `comm-${Date.now()}`,
      recordedDurationSeconds: Math.max(12, recordingSeconds),
      pacingWpm: 138,
      fillerWordCount: 2,
      fillerWords: [{ word: 'um', count: 1 }, { word: 'like', count: 1 }],
      clarityScore: 88,
      pacingScore: 92,
      speakingScore: 86,
      transcript: 'In my third year capstone project, I led the development of a distributed microservices platform using FastAPI and Postgres. The primary engineering bottleneck was database query latency under heavy concurrency, which I addressed through index partitioning and Redis caching.',
      feedback: [
        'Optimal conversational pacing maintained (138 WPM is in the target 130-150 range).',
        'Minimal filler word intrusion (only 2 detected across the segment).',
        'Strong technical vocabulary and clear cause-effect structure.'
      ],
      timestamp: new Date().toISOString(),
    };

    setMetric(calculatedMetric);
    updateCommunicationMetric(calculatedMetric);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>SPEECH & VERBAL FLUENCY LAB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Communication Lab
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Real-time vocal pacing, filler word elimination, and verbal articulation calibration.
              </p>
            </div>

            <StatMetric 
              value={readinessScores.communication} 
              suffix="%" 
              label="Communication Score" 
              size="sm" 
              highlight="cyan" 
            />
          </div>

          {/* Drill Stage */}
          <GlowCard glowColor="cyan" className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-6">
            <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                Current Verbal Drill Topic
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white mt-1">
                "{drillTopic}"
              </p>
            </div>

            {/* Live Waveform Audio Visualizer */}
            <div className="p-8 rounded-2xl bg-[#090d16] border border-[var(--border-subtle)] flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 h-16">
                {waveHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-100 ${
                      isRecording ? 'bg-cyan-400 shadow-sm shadow-cyan-500/50' : 'bg-slate-700'
                    }`}
                    style={{ height: `${isRecording ? h : 10}px` }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 font-mono text-xs text-white">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(recordingSeconds)}</span>
              </div>
            </div>

            {/* Recording Action Buttons */}
            <div className="flex justify-center gap-3">
              {!isRecording ? (
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Mic className="w-4 h-4" />}
                  onClick={startRecording}
                >
                  Start Speaking Drill
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="lg"
                  leftIcon={<Square className="w-4 h-4" />}
                  onClick={stopRecording}
                >
                  Stop & Evaluate Drill
                </Button>
              )}
            </div>
          </GlowCard>

          {/* Evaluation Results */}
          {metric && (
            <Card className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <Badge variant="cyan">Drill Analysis Telemetry</Badge>
                <span className="text-xs font-mono text-emerald-400 font-bold">+2% Communication Readiness</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Pacing</span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">{metric.pacingWpm} WPM</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Filler Words</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{metric.fillerWordCount} detected</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Clarity Score</span>
                  <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">{metric.clarityScore}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Speaking Score</span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">{metric.speakingScore}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">AI Speech Critique</h4>
                <ul className="space-y-1.5">
                  {metric.feedback.map((fb, idx) => (
                    <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
