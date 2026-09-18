'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Play
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Card, GlowCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatMetric } from '@/components/ui/StatMetric';
import { ProgressBar, ProgressRing } from '@/components/ui/ProgressRing';
import { APTITUDE_QUESTIONS } from '@/lib/data/mockData';
import { soundFX } from '@/components/effects/SoundFX';

export default function AptitudePage() {
  const { recordAptitudeScore, readinessScores, activeTargetRole } = useApp();

  const [testActive, setTestActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 min
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (testActive && !submitted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testActive, submitted, secondsRemaining]);

  const handleStartTest = () => {
    soundFX.playClick();
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSecondsRemaining(600);
    setSubmitted(false);
    setTestActive(true);
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    soundFX.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    soundFX.playSuccess();
    setSubmitted(true);
    let correctCount = 0;
    APTITUDE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / APTITUDE_QUESTIONS.length) * 100);
    recordAptitudeScore(scorePct);
  };

  const calculateResults = () => {
    let correct = 0;
    APTITUDE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) correct++;
    });
    return {
      correct,
      total: APTITUDE_QUESTIONS.length,
      percentage: Math.round((correct / APTITUDE_QUESTIONS.length) * 100),
    };
  };

  const results = submitted ? calculateResults() : null;

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
                <span>COGNITIVE & DSA ARENA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Aptitude & Problem Solving
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Calibrated against Tier-1 company online test patterns (Quant, Logical, CS Core).
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StatMetric 
                value={readinessScores.aptitude} 
                suffix="%" 
                label="Aptitude Dimension" 
                size="sm" 
                highlight="indigo" 
              />
            </div>
          </div>

          {/* Test Environment or Start Screen */}
          {!testActive && !submitted && (
            <GlowCard glowColor="indigo" className="p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                <Brain className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-white">Full Mock Aptitude Drill</h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 max-w-md mx-auto leading-relaxed">
                6 timed questions covering quantitative aptitude, logical reasoning, and data structure time complexities.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-6 text-center">
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Questions</span>
                  <span className="text-sm font-bold text-white">6 Multi-Choice</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Time Limit</span>
                  <span className="text-sm font-bold text-white">10 Mins</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Weight</span>
                  <span className="text-sm font-bold text-cyan-400">+2% Readiness</span>
                </div>
              </div>

              <Button variant="primary" size="lg" onClick={handleStartTest} rightIcon={<Play className="w-4 h-4" />}>
                Begin Assessment
              </Button>
            </GlowCard>
          )}

          {/* Active Test Screen */}
          {testActive && !submitted && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Question HUD */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)]">
                <div className="flex items-center gap-3">
                  <Badge variant="cyan">Question {currentIdx + 1} of {APTITUDE_QUESTIONS.length}</Badge>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{APTITUDE_QUESTIONS[currentIdx].category}</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-white bg-[var(--surface-secondary)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              </div>

              {/* Question Card */}
              <Card className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {APTITUDE_QUESTIONS[currentIdx].question}
                </h3>

                <div className="space-y-2.5">
                  {APTITUDE_QUESTIONS[currentIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentIdx, oIdx)}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-200'
                            : 'bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  >
                    Previous
                  </Button>

                  {currentIdx < APTITUDE_QUESTIONS.length - 1 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setCurrentIdx((prev) => prev + 1)}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="momentum"
                      size="sm"
                      onClick={handleSubmitQuiz}
                    >
                      Submit Assessment
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Submitted Results Screen */}
          {submitted && results && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              <GlowCard glowColor="cyan" className="p-8 text-center bg-[var(--surface-primary)] border border-cyan-500/30">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                  <Award className="w-7 h-7" />
                </div>

                <Badge variant="cyan" className="mb-2">Scorecard Generated</Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Assessment Results</h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  You scored <strong className="text-white">{results.correct} out of {results.total}</strong> correct ({results.percentage}%).
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 max-w-md mx-auto">
                  <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Percentage</span>
                    <span className="text-xl font-black font-mono text-cyan-400">{results.percentage}%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Readiness Delta</span>
                    <span className="text-xl font-black font-mono text-emerald-400">+2%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Aptitude Score</span>
                    <span className="text-xl font-black font-mono text-white">{readinessScores.aptitude}%</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button variant="secondary" size="md" onClick={handleStartTest}>
                    Retake Mock
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="primary" size="md">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
