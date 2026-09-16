'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  TrendingUp
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { APTITUDE_QUESTIONS } from '@/lib/data/mockData';
import { cn } from '@/lib/utils';

export default function AptitudePage() {
  const { recordAptitudeScore, readinessScores, activeTargetRole } = useApp();

  const [testActive, setTestActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 min
  const [submitted, setSubmitted] = useState(false);

  // Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (testActive && !submitted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testActive, submitted, secondsRemaining]);

  const handleStartTest = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSecondsRemaining(600);
    setSubmitted(false);
    setTestActive(true);
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
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
      percentage: Math.round((correct / APTITUDE_QUESTIONS.length) * 100)
    };
  };

  const results = submitted ? calculateResults() : null;

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <StudentSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Cognitive & Problem Solving Assessment
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Aptitude & DSA Arena
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Quantitative, Logical Reasoning, Verbal, and Core DSA screening questions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Aptitude Readiness Score:</span>
              <span className="text-sm font-black font-mono text-cyan-400">
                {readinessScores.aptitude}%
              </span>
            </div>
          </div>

          {!testActive ? (
            /* Arena Dashboard */
            <div className="space-y-6">
              {/* Category Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { cat: 'Quantitative Aptitude', score: 74, weak: 'Probability, Time & Work', icon: Brain, color: 'text-cyan-400' },
                  { cat: 'Logical Reasoning', score: 78, weak: 'Number Series, Syllogisms', icon: Sparkles, color: 'text-purple-400' },
                  { cat: 'Verbal & Language', score: 72, weak: 'Sentence Inversion', icon: Award, color: 'text-blue-400' },
                  { cat: 'Core DSA Concepts', score: 80, weak: 'Hash Table Collisions', icon: CheckCircle2, color: 'text-emerald-400' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.cat} className="p-5 rounded-2xl bg-[#111722] border border-[#202938] space-y-2">
                      <div className="flex items-center justify-between">
                        <Icon className={cn('w-4 h-4', item.color)} />
                        <span className="text-sm font-bold font-mono text-white">{item.score}%</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">{item.cat}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        Weak spots: <span className="text-amber-400">{item.weak}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Start Assessment Banner */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#111722] via-[#0d1424] to-[#140e29] border border-cyan-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="max-w-xl mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    Ready for your Placement Screening Mock Drill?
                  </h3>
                  <p className="text-xs text-slate-300">
                    6 carefully curated questions covering Quantitative, Logical Reasoning, Verbal, and DSA hash structures. Time limit: 10 minutes.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleStartTest}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
                  >
                    Start 6-Question Mock Assessment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Live Assessment Question Flow */
            <div className="bg-[#111722] border border-[#202938] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Top Bar with Timer & Question Progress */}
              <div className="flex items-center justify-between pb-4 border-b border-[#202938]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">
                    Question {currentIdx + 1} of {APTITUDE_QUESTIONS.length}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#161e2e] text-cyan-400 border border-[#202938]">
                    {APTITUDE_QUESTIONS[currentIdx].category} • {APTITUDE_QUESTIONS[currentIdx].topic}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-sm">
                    {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Active Question */}
              <div className="space-y-4">
                <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {APTITUDE_QUESTIONS[currentIdx].question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {APTITUDE_QUESTIONS[currentIdx].options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    const isCorrect = optIdx === APTITUDE_QUESTIONS[currentIdx].correctOptionIndex;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentIdx, optIdx)}
                        disabled={submitted}
                        className={cn(
                          'w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer',
                          submitted && isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : submitted && isSelected && !isCorrect
                            ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                            : isSelected
                            ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-sm'
                            : 'bg-[#0d111a] border-[#202938] text-slate-300 hover:border-slate-600'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-[#161e2e] border border-[#202938] flex items-center justify-center font-mono text-[10px]">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {submitted && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation when submitted */}
                {submitted && (
                  <div className="p-4 rounded-xl bg-[#0d111a] border border-cyan-500/30 text-xs space-y-1 text-slate-300 animate-in fade-in duration-200">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
                      Solution Explanation
                    </span>
                    <p>{APTITUDE_QUESTIONS[currentIdx].explanation}</p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#202938]">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl bg-[#161e2e] text-slate-300 text-xs font-semibold disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < APTITUDE_QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(prev => Math.min(APTITUDE_QUESTIONS.length - 1, prev + 1))}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Next Question
                    </button>
                  ) : !submitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-xs font-bold cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      Submit Assessment
                    </button>
                  ) : (
                    <button
                      onClick={() => setTestActive(false)}
                      className="px-5 py-2 rounded-xl bg-[#161e2e] text-cyan-400 text-xs font-bold cursor-pointer border border-cyan-500/30"
                    >
                      Return to Arena
                    </button>
                  )}
                </div>
              </div>

              {/* Submission Score Banner */}
              {results && (
                <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Assessment Complete: {results.correct} / {results.total} Correct ({results.percentage}%)
                    </h4>
                    <p className="text-[11px] text-emerald-300 mt-0.5">
                      New aptitude metrics submitted to Central Readiness Engine!
                    </p>
                  </div>
                  <Link href="/progress" className="font-semibold underline text-white">
                    View Progress Chart →
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
