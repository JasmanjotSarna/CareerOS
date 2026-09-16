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
  PlayCircle
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { MetricDisplay } from '@/components/ui/MetricDisplay';
import { GlowCard } from '@/components/ui/GlowCard';
import { CareerButton } from '@/components/ui/CareerButton';
import { soundFX } from '@/components/effects/SoundFX';
import confetti from 'canvas-confetti';
import { RoadmapTask } from '@/types';

export default function RoadmapPage() {
  const { roadmapWeeks, toggleTaskStatus, readinessScores, activeTargetRole } = useApp();
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);

  const allTasks = roadmapWeeks.flatMap(w => w.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const progressPercent = Math.round((completedTasks.length / Math.max(1, allTasks.length)) * 100);

  // Career Trajectory Stages
  const journeyStages = [
    { id: 'foundation', label: 'Foundation', focus: 'CS Fundamentals & Complexity', status: 'completed' },
    { id: 'python', label: 'Python Deep-Dive', focus: 'Decorators, Async & OOP', status: 'completed' },
    { id: 'sql', label: 'SQL Joins & Indexing', focus: 'EXPLAIN ANALYZE & B-Trees', status: 'active' },
    { id: 'dsa', label: 'DSA High-Frequency', focus: 'Hashmaps, Two-Pointer & Sliding Window', status: 'active' },
    { id: 'projects', label: 'Production Microservices', focus: 'FastAPI, Redis, Docker & Postgres', status: 'upcoming' },
    { id: 'interview-tech', label: 'AI Technical Mock', focus: 'Live O(N) Coding Verification', status: 'upcoming' },
    { id: 'interview-hr', label: 'STAR HR Behavioral', focus: 'Leadership & Conflict Framing', status: 'upcoming' },
    { id: 'job-ready', label: 'Placement Gate', focus: '78%+ Deterministic Readiness', status: 'upcoming' }
  ];

  const handleToggleTask = (task: RoadmapTask) => {
    soundFX.playClick();
    const willBeDone = task.status !== 'completed';
    toggleTaskStatus(task.id);

    if (willBeDone) {
      soundFX.playSuccess();
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#8B5CF6', '#F59E0B']
      });
    }

    if (selectedTask?.id === task.id) {
      setSelectedTask(prev => prev ? { ...prev, status: willBeDone ? 'completed' : 'pending' } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-10 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ADAPTIVE SPRINT TRAJECTORY</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Your Career Journey
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                A contained, explorable path calibrated for <span className="text-white font-semibold">{activeTargetRole.title}</span>.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <MetricDisplay 
                value={progressPercent} 
                suffix="%" 
                label="Roadmap Velocity" 
                size="sm" 
                highlight="cyan" 
              />
              <MetricDisplay 
                value={completedTasks.length} 
                suffix={`/${allTasks.length}`} 
                label="Milestones" 
                size="sm" 
                highlight="violet" 
              />
            </div>
          </div>

          {/* 1. THE MESSENGER PATH: Contained Explorable Trajectory */}
          <GlowCard className="p-8 bg-[#0B0F16]/95 border border-white/[0.1]">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-6">
              Career Trajectory Path (Sequential Progression)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative">
              {journeyStages.map((stage, i) => {
                const isCompleted = stage.status === 'completed';
                const isActive = stage.status === 'active';

                return (
                  <motion.div
                    key={stage.id}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => soundFX.playClick()}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      isCompleted
                        ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.15)]'
                        : isActive
                        ? 'bg-slate-900 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-950/60 border-white/[0.06] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">0{i + 1}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-700" />
                      )}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold font-mono ${isCompleted ? 'text-white' : isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                        {stage.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {stage.focus}
                      </p>
                    </div>

                    <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${isCompleted ? 'text-cyan-400' : isActive ? 'text-amber-400' : 'text-slate-600'}`}>
                      {stage.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </GlowCard>

          {/* 2. GRANULAR SPRINT TASKS */}
          <div className="space-y-6">
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">
              Sprint Deliverables & Exercises
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTasks.map((task) => {
                const isCompleted = task.status === 'completed';

                return (
                  <GlowCard 
                    key={task.id}
                    className={`p-5 transition-all ${isCompleted ? 'border-cyan-500/30 bg-cyan-950/10' : 'bg-[#0B0F16]'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleTask(task)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isCompleted ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 hover:border-cyan-400 bg-slate-900'
                          }`}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <h4 className={`text-sm font-bold font-mono ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {task.description}
                          </p>

                          <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {task.estimatedMinutes} Mins
                            </span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">+{task.pointsContribution} pts</span>
                            <span>•</span>
                            <span className="uppercase text-slate-400">{task.difficulty}</span>
                          </div>
                        </div>
                      </div>

                      <CareerButton 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedTask(task)}
                      >
                        Inspect
                      </CareerButton>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Task Inspection Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#0B0F16] border border-cyan-500/30 text-slate-200 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Milestone Syllabus</span>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white font-mono mt-4">{selectedTask.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedTask.description}</p>

              <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Duration:</span>
                  <span className="text-white font-bold">{selectedTask.estimatedMinutes} Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Readiness Impact:</span>
                  <span className="text-amber-400 font-bold">+{selectedTask.pointsContribution} Score Points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Competency Domain:</span>
                  <span className="text-cyan-300 font-bold">{selectedTask.skillName} ({selectedTask.category})</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <CareerButton variant="secondary" size="sm" onClick={() => setSelectedTask(null)}>
                  Close
                </CareerButton>
                <CareerButton 
                  variant="momentum" 
                  size="sm" 
                  onClick={() => {
                    handleToggleTask(selectedTask);
                    setSelectedTask(null);
                  }}
                >
                  {selectedTask.status === 'completed' ? 'Mark Incomplete' : 'Mark as Completed'}
                </CareerButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
