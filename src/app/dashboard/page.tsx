'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Target, 
  Clock, 
  Code2, 
  Mic, 
  FileText,
  ChevronRight,
  TrendingUp, 
  Bot,
  Zap,
  Check,
  AlertTriangle,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { MetricDisplay } from '@/components/ui/MetricDisplay';
import { AIOrb } from '@/components/ui/AIOrb';
import { GlowCard } from '@/components/ui/GlowCard';
import { CareerButton } from '@/components/ui/CareerButton';
import { CareerTrajectory } from '@/components/ui/CareerTrajectory';
import { soundFX } from '@/components/effects/SoundFX';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    studentProfile, 
    activeTargetRole, 
    readinessScores, 
    skillGaps, 
    suitability,
    roadmapWeeks,
    toggleTaskStatus
  } = useApp();

  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({
    'act-1': false,
    'act-2': false,
    'act-3': false
  });

  const [momentumFlash, setMomentumFlash] = useState(false);

  const toggleAction = (id: string, taskIdToSync?: string) => {
    soundFX.playClick();
    const willBeDone = !completedActions[id];
    setCompletedActions(prev => ({ ...prev, [id]: willBeDone }));

    if (willBeDone) {
      soundFX.playSuccess();
      setMomentumFlash(true);
      setTimeout(() => setMomentumFlash(false), 2000);

      // Trigger Bruno Simon-style celebration physics
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#06B6D4', '#8B5CF6', '#F59E0B']
      });
    }

    if (taskIdToSync) {
      toggleTaskStatus(taskIdToSync);
    }
  };

  const criticalGaps = skillGaps.filter(g => g.priority === 'Critical');
  const highGaps = skillGaps.filter(g => g.priority === 'High');

  // Next recommended task
  const currentWeek = roadmapWeeks[0] || { tasks: [] };
  const nextPendingTask = currentWeek.tasks.find(t => t.status !== 'completed') || currentWeek.tasks[0];

  const overallScore = readinessScores?.overall || 72;
  const weeklyDelta = readinessScores?.weeklyDelta || 4;

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-10 overflow-hidden">
          {/* 1. EDITORIAL GREETING & CONTEXT HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ACTIVE CAREER TRAJECTORY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Good morning, {studentProfile.fullName.split(' ')[0]}.
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 font-normal">
                Your placement trajectory is accelerating towards{' '}
                <span className="text-white font-semibold">{activeTargetRole.title}</span>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/interviews/technical">
                <CareerButton variant="momentum" size="md" leftIcon={<Code2 className="w-4 h-4" />}>
                  Start AI Interview
                </CareerButton>
              </Link>
            </div>
          </div>

          {/* 2. SIGNATURE CENTRAL READINESS COMMAND VISUALIZATION */}
          <GlowCard className="p-8 md:p-10 bg-[#0B0F16]/95 border border-white/[0.1]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Primary Metric & Momentum Surge */}
              <div className="flex items-center gap-6">
                <AIOrb 
                  size={100} 
                  state="idle" 
                  readinessTrend={weeklyDelta} 
                  onClick={() => soundFX.playClick()}
                />
                <div>
                  <MetricDisplay 
                    value={overallScore} 
                    suffix="%" 
                    label="Placement Readiness Gate" 
                    sublabel={`+${weeklyDelta}% momentum surge this sprint`}
                    size="hero" 
                    highlight={momentumFlash ? 'momentum' : 'cyan'} 
                    trend={weeklyDelta}
                  />
                </div>
              </div>

              {/* Multi-Dimensional Readiness Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full lg:w-auto">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Technical</span>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{readinessScores.technical}%</div>
                  <span className="text-[10px] text-slate-500 font-mono">Weight 35%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Aptitude</span>
                  <div className="text-xl font-bold font-mono text-violet-400 mt-1">{readinessScores.aptitude}%</div>
                  <span className="text-[10px] text-slate-500 font-mono">Weight 20%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Communication</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{readinessScores.communication}%</div>
                  <span className="text-[10px] text-slate-500 font-mono">Weight 15%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center">
                  <span className="text-[10px] font-mono uppercase text-slate-400">HR Behavioral</span>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">{readinessScores.hr}%</div>
                  <span className="text-[10px] text-slate-500 font-mono">Weight 15%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Interview Simulation</span>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{readinessScores.interview}%</div>
                  <span className="text-[10px] text-slate-500 font-mono">Weight 15%</span>
                </div>
              </div>
            </div>

            {/* Continuous Trajectory Line */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <CareerTrajectory progress={overallScore} variant="horizontal" />
            </div>
          </GlowCard>

          {/* 3. ASYMMETRICAL EDITORIAL WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: High-Impact Sprints & Skill Matrix (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Next-Best Action Sprint */}
              {nextPendingTask && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-violet-950/40 border border-cyan-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Next-Best Action Sprint • +{nextPendingTask.pointsContribution} Readiness Points</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{nextPendingTask.estimatedMinutes} Mins</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-2 font-mono">
                    {nextPendingTask.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {nextPendingTask.description}
                  </p>

                  <div className="mt-5 flex items-center gap-4">
                    <Link href="/roadmap">
                      <CareerButton variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Launch Learning Sprint
                      </CareerButton>
                    </Link>
                    <button 
                      onClick={() => toggleAction('sprint-action', nextPendingTask.id)}
                      className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              )}

              {/* Today's Action Checklist */}
              <GlowCard className="p-6 bg-[#0B0F16]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Today's Practice Checklist</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {Object.values(completedActions).filter(Boolean).length} / 3 Completed
                  </span>
                </div>

                <div className="space-y-3">
                  <div 
                    onClick={() => toggleAction('act-1')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      completedActions['act-1']
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-900/60 border-white/[0.06] hover:border-cyan-500/30 text-white'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completedActions['act-1'] ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-mono font-semibold ${completedActions['act-1'] ? 'line-through text-slate-500' : ''}`}>
                        Solve 5 Hashmap & Two-Pointer DSA Problems
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Target: O(N) linear time complexity without brute-force nesting.</p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0 font-bold">+3 pts</span>
                  </div>

                  <div 
                    onClick={() => toggleAction('act-2')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      completedActions['act-2']
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-900/60 border-white/[0.06] hover:border-cyan-500/30 text-white'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completedActions['act-2'] ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-mono font-semibold ${completedActions['act-2'] ? 'line-through text-slate-500' : ''}`}>
                        Complete 90-Second Technical Pitch in Speaking Lab
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Focus: Reduce transitional filler words (&quot;um&quot;, &quot;like&quot;).</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0 font-bold">+2 pts</span>
                  </div>

                  <div 
                    onClick={() => toggleAction('act-3')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      completedActions['act-3']
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-900/60 border-white/[0.06] hover:border-cyan-500/30 text-white'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completedActions['act-3'] ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-mono font-semibold ${completedActions['act-3'] ? 'line-through text-slate-500' : ''}`}>
                        Practice Behavioral STAR Response on Team Conflict
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Quantify specific outcome metrics in the Result section.</p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 shrink-0 font-bold">+3 pts</span>
                  </div>
                </div>
              </GlowCard>

              {/* Critical Skill Gap Threats */}
              <GlowCard className="p-6 bg-[#0B0F16]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Priority Skill Deficits</h3>
                  </div>
                  <Link href="/skills" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <span>Full Matrix</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {criticalGaps.slice(0, 3).map((gap) => (
                    <div key={gap.skillName} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-white font-bold">{gap.skillName}</span>
                        <span className="text-amber-400 font-semibold">{gap.currentLevel}% / {gap.requiredLevel}% Required</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">{gap.reason}</p>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>

            {/* Right Column: AI Intelligence & Live Mock Studio Launcher (5 Columns) */}
            <div className="lg:col-span-5 space-y-8">
              {/* AI Career Coach Console */}
              <GlowCard className="p-6 bg-gradient-to-b from-slate-900 to-[#0B0F16] border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <AIOrb size={44} state="idle" readinessTrend={weeklyDelta} />
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">CareerOS Intelligence</h3>
                    <p className="text-[11px] text-slate-400">Context Telemetry: Active SDE-1 Sprint</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-3.5 rounded-xl border border-white/[0.06]">
                  &quot;Jasmanjot, your 78% readiness puts you within 6 points of the Tier-1 campus placement cutoff. Closing your SQL indexing deficit will immediately bump your readiness to 84%.&quot;
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/coach">
                    <CareerButton variant="secondary" size="sm">
                      Open AI Coach Workspace
                    </CareerButton>
                  </Link>
                </div>
              </GlowCard>

              {/* Upcoming AI Mock Interview Card */}
              <div className="p-6 rounded-2xl bg-[#0B0F16] border border-white/[0.08] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">Live Simulation</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                    30 Mins
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-mono">AI Technical Coding Interview</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Real-time conversational problem solving with automated time/space complexity grading and test case verification.
                </p>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400">Next Scheduled: Today</span>
                  <Link href="/interviews/technical">
                    <CareerButton variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Enter Studio
                    </CareerButton>
                  </Link>
                </div>
              </div>

              {/* ATS Resume Alignment Quick Card */}
              <GlowCard className="p-6 bg-[#0B0F16]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">ATS Resume Health</h4>
                  </div>
                  <span className="text-xs font-mono text-violet-400 font-bold">74 / 100</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  3 keywords missing for {activeTargetRole.title}: <span className="text-slate-200 font-mono">System Design, SQL Indexing, Kafka</span>.
                </p>

                <div className="mt-4">
                  <Link href="/resume" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <span>Optimize Bullet Points</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </GlowCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
