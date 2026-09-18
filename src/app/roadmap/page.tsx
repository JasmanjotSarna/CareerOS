'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Code2, 
  ArrowRight, 
  Zap, 
  Check, 
  Target,
  X,
  PlayCircle,
  Flame,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { StatMetric } from '@/components/ui/StatMetric';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressRing';
import { Modal } from '@/components/ui/Modal';
import { soundFX } from '@/components/effects/SoundFX';
import confetti from 'canvas-confetti';
import { RoadmapTask } from '@/types';

export default function RoadmapPage() {
  const { roadmapWeeks, toggleTaskStatus, readinessScores, activeTargetRole } = useApp();
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);

  const allTasks = roadmapWeeks.flatMap((w) => w.tasks);
  const completedTasks = allTasks.filter((t) => t.status === 'completed');
  const progressPercent = Math.round((completedTasks.length / Math.max(1, allTasks.length)) * 100);

  const handleToggleTask = (task: RoadmapTask) => {
    soundFX.playClick();
    const willBeDone = task.status !== 'completed';
    toggleTaskStatus(task.id);

    if (willBeDone) {
      soundFX.playSuccess();
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#6366F1', '#F59E0B'],
      });
    }

    if (selectedTask?.id === task.id) {
      setSelectedTask((prev) => (prev ? { ...prev, status: willBeDone ? 'completed' : 'pending' } : null));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ADAPTIVE SPRINT TRAJECTORY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Placement Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Personalized milestone sprints calibrated for <span className="text-white font-semibold">{activeTargetRole.title}</span>.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <StatMetric 
                value={progressPercent} 
                suffix="%" 
                label="Roadmap Velocity" 
                size="sm" 
                highlight="cyan" 
              />
              <StatMetric 
                value={completedTasks.length} 
                suffix={`/${allTasks.length}`} 
                label="Milestones Cleared" 
                size="sm" 
                highlight="momentum" 
              />
            </div>
          </div>

          {/* Overall Sprint Progress Bar */}
          <Card className="p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)] font-semibold">OVERALL ROADMAP COMPLETION</span>
              <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} variant="cyan" size="md" />
          </Card>

          {/* Weekly Sprint Sections */}
          <div className="space-y-6">
            {roadmapWeeks.map((week) => {
              const weekCompleted = week.tasks.filter((t) => t.status === 'completed').length;
              const isAllDone = week.tasks.length > 0 && weekCompleted === week.tasks.length;

              return (
                <div key={week.weekNumber} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-300">
                        W{week.weekNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{week.title}</h3>
                        <p className="text-[11px] text-[var(--text-muted)] font-mono">Focus: {week.focus}</p>
                      </div>
                    </div>
                    <Badge variant={isAllDone ? 'success' : 'cyan'}>
                      {weekCompleted}/{week.tasks.length} Cleared
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {week.tasks.map((task) => {
                      const isDone = task.status === 'completed';

                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                            isDone
                              ? 'bg-[var(--surface-primary)]/50 border-emerald-500/30 opacity-80'
                              : 'bg-[var(--surface-primary)] border-[var(--border-default)] hover:border-cyan-500/40 shadow-sm'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                                {task.skillName}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-dim)] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.estimatedMinutes}m
                              </span>
                            </div>

                            <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-white'}`}>
                              {task.title}
                            </h4>

                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                            <button
                              type="button"
                              onClick={() => setSelectedTask(task)}
                              className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                            >
                              Details
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleTask(task)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] hover:border-cyan-500/40'
                              }`}
                            >
                              {isDone ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Modal */}
          {selectedTask && (
            <Modal
              isOpen={Boolean(selectedTask)}
              onClose={() => setSelectedTask(null)}
              title={selectedTask.title}
              description={`Week ${selectedTask.weekNumber} Milestone • ${selectedTask.skillName}`}
            >
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-secondary)] p-4 rounded-xl border border-[var(--border-subtle)]">
                  {selectedTask.description}
                </p>

                <div className="flex justify-between items-center text-xs font-mono text-[var(--text-muted)]">
                  <span>Estimated Duration: {selectedTask.estimatedMinutes} mins</span>
                  <Badge variant={selectedTask.status === 'completed' ? 'success' : 'cyan'}>
                    {selectedTask.status === 'completed' ? 'Cleared' : 'Pending'}
                  </Badge>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant={selectedTask.status === 'completed' ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleTask(selectedTask)}
                  >
                    {selectedTask.status === 'completed' ? 'Mark as Incomplete' : 'Complete Task (+3% Readiness)'}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
}
