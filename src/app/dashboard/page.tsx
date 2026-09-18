'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Brain,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { StatMetric } from '@/components/ui/StatMetric';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { soundFX } from '@/components/effects/SoundFX';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const { 
    studentProfile, 
    activeTargetRole, 
    readinessScores, 
    skillGaps, 
    suitability,
    roadmapWeeks,
    toggleTaskStatus,
    recentEvents
  } = useApp();

  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (id: string, taskIdToSync?: string) => {
    soundFX.playClick();
    const willBeDone = !completedActions[id];
    setCompletedActions(prev => ({ ...prev, [id]: willBeDone }));

    if (willBeDone) {
      soundFX.playSuccess();
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.65 },
        colors: ['#06b6d4', '#6366f1', '#f59e0b']
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

  const overallScore = readinessScores?.overall || 40;
  const weeklyDelta = readinessScores?.weeklyDelta || 4;

  const firstName = studentProfile.fullName ? studentProfile.fullName.trim().split(/\s+/)[0] : 'Student';

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* 1. Header Greeting & Primary Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>INTELLIGENCE RADAR ACTIVE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                Welcome back, {firstName}.
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
                Targeting <strong className="text-white font-semibold">{activeTargetRole.title}</strong> — your placement trajectory is on track.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/interviews/technical">
                <Button variant="primary" size="md" leftIcon={<Code2 className="w-4 h-4" />}>
                  Start Technical Mock
                </Button>
              </Link>
            </div>
          </div>

          {/* 2. Core Readiness Gate Command Visualization */}
          <GlowCard glowColor="cyan" className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Primary Score Dial */}
              <div className="flex items-center gap-6">
                <ProgressRing 
                  value={overallScore} 
                  size={96} 
                  strokeWidth={8} 
                  variant="cyan" 
                />
                <div>
                  <StatMetric 
                    value={overallScore} 
                    suffix="%" 
                    label="Placement Readiness Gate" 
                    sublabel={`+${weeklyDelta}% momentum surge this sprint`}
                    size="lg" 
                    highlight="cyan" 
                    trend={weeklyDelta}
                  />
                </div>
              </div>

              {/* Multi-Dimensional Dimension Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full lg:w-auto">
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">Technical</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    <AnimatedCounter value={readinessScores.technical} suffix="%" />
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">Aptitude</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    <AnimatedCounter value={readinessScores.aptitude} suffix="%" />
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">Communication</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    <AnimatedCounter value={readinessScores.communication} suffix="%" />
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">HR STAR</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    <AnimatedCounter value={readinessScores.hr} suffix="%" />
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">Mock Score</span>
                  <span className="text-lg font-mono font-bold text-cyan-400 mt-1 block">
                    <AnimatedCounter value={readinessScores.interview} suffix="%" />
                  </span>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* 3. Two-Column Grid: Next Best Action & Critical Skill Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Next Best Action Card (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Recommended Sprint Actions</h3>
                  </div>
                  <Badge variant="momentum">Highest ROI for Week 1</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {nextPendingTask && (
                    <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-cyan-500/30 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                            NEXT MILESTONE
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-mono">{nextPendingTask.estimatedMinutes} mins</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{nextPendingTask.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{nextPendingTask.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleAction('primary-task', nextPendingTask.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                          completedActions['primary-task'] || nextPendingTask.status === 'completed'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-[var(--surface-tertiary)] border-[var(--border-default)] hover:border-cyan-400 text-slate-300'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Secondary actions */}
                  {[
                    { id: 'act-ats', title: 'Optimize ATS Resume Keywords', desc: 'Accept 2 suggested AI bullet improvements.', link: '/resume', icon: FileText },
                    { id: 'act-comm', title: 'Complete 90-sec Speaking Drill', desc: 'Calibrate your pacing and eliminate filler words.', link: '/communication', icon: Mic },
                  ].map((act) => (
                    <Link
                      key={act.id}
                      href={act.link}
                      onClick={() => soundFX.playClick()}
                      className="p-3.5 rounded-xl bg-[var(--surface-secondary)]/60 hover:bg-[var(--surface-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface-tertiary)] flex items-center justify-center text-cyan-400">
                          <act.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{act.title}</p>
                          <p className="text-[11px] text-[var(--text-muted)]">{act.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-cyan-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Recent Events Log */}
              <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Activity & Telemetry Log
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Live Stream</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {recentEvents.slice(0, 4).map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border-subtle)]">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{evt.title}</p>
                        <p className="text-[11px] text-[var(--text-muted)] leading-tight">{evt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right: Skill Gap Matrix & Market Suitability (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-sm font-bold text-white">Priority Skill Gaps</h3>
                    <p className="text-xs text-[var(--text-muted)]">Requirements for {activeTargetRole.title}</p>
                  </div>
                  <Link href="/skills" onClick={() => soundFX.playClick()}>
                    <span className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
                      View All <ChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {criticalGaps.concat(highGaps).slice(0, 4).map((gap) => (
                    <div
                      key={gap.skillName}
                      className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{gap.skillName}</span>
                        <Badge
                          variant={gap.priority === 'Critical' ? 'momentum' : 'indigo'}
                          className="text-[9px] py-0 px-1.5"
                        >
                          {gap.priority}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                          <span>Current: {gap.currentLevel}%</span>
                          <span>Required: {gap.requiredLevel}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${gap.currentLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* JECRC / Placement Portal Verified Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Placement Sync Active</p>
                  <p className="text-[11px] text-emerald-300/80 leading-tight">
                    Verified candidate profile visible to campus recruiting partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
