'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Zap, 
  BookOpen, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { MetricDisplay } from '@/components/ui/MetricDisplay';
import { GlowCard } from '@/components/ui/GlowCard';
import { CareerButton } from '@/components/ui/CareerButton';
import { soundFX } from '@/components/effects/SoundFX';
import { SkillGap } from '@/types';

export default function SkillGapsPage() {
  const { skillGaps, activeTargetRole } = useApp();
  const [selectedGap, setSelectedGap] = useState<SkillGap | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Programming', 'Data', 'Backend', 'CS Fundamentals'];

  const filteredGaps = skillGaps.filter(g => 
    selectedCategory === 'All' || g.category === selectedCategory
  );

  const criticalCount = skillGaps.filter(g => g.priority === 'Critical').length;
  const highCount = skillGaps.filter(g => g.priority === 'High').length;

  const handleSelectSkill = (gap: SkillGap) => {
    soundFX.playClick();
    setSelectedGap(gap);
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
                <span>COMPETENCY GRAPH MATRIX</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Skill Gap Network
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Granular diagnosis of required capabilities for <span className="text-white font-semibold">{activeTargetRole.title}</span>.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <MetricDisplay 
                value={criticalCount} 
                label="Critical Deficits" 
                size="sm" 
                highlight="momentum" 
              />
              <MetricDisplay 
                value={highCount} 
                label="High Gaps" 
                size="sm" 
                highlight="violet" 
              />
            </div>
          </div>

          {/* 1. VISUAL COMPETENCY MAP (Interactive Network Graph) */}
          <GlowCard className="p-8 bg-[#0B0F16]/95 border border-white/[0.1] text-center">
            <div className="max-w-xs mx-auto p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_24px_rgba(6,182,212,0.2)]">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Target Role Root</span>
              <h3 className="text-sm font-bold text-white font-mono mt-1">{activeTargetRole.title}</h3>
            </div>

            {/* Connecting Line Downward */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-violet-500 mx-auto" />

            {/* Cluster Branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {filteredGaps.map((gap) => {
                const isCritical = gap.priority === 'Critical';
                const isHigh = gap.priority === 'High';

                return (
                  <motion.div
                    key={gap.skillName}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectSkill(gap)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isCritical
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-400'
                        : isHigh
                        ? 'bg-violet-950/20 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-violet-400'
                        : 'bg-slate-900/70 border-white/[0.08] hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isCritical ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {gap.priority}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {gap.currentLevel}% / {gap.requiredLevel}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white font-mono">{gap.skillName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{gap.category}</span>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCritical ? 'bg-amber-400' : isHigh ? 'bg-violet-400' : 'bg-cyan-400'}`}
                        style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {gap.reason}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </GlowCard>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-mono text-slate-500 uppercase mr-2">Filter Cluster:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedCategory === cat ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 border border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Skill Diagnostic Drawer / Modal */}
      <AnimatePresence>
        {selectedGap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#0B0F16] border border-cyan-500/30 text-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Skill Diagnostic Dossier</span>
                <button onClick={() => setSelectedGap(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedGap.skillName}</h3>
                <span className="text-xs font-mono text-slate-400">{selectedGap.category} • Priority: {selectedGap.priority}</span>
              </div>

              {/* Benchmark comparison bar */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Assessed Level:</span>
                  <span className="text-white font-bold">{selectedGap.currentLevel}%</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Role Benchmark:</span>
                  <span className="text-cyan-400 font-bold">{selectedGap.requiredLevel}%</span>
                </div>
                <div className="flex justify-between text-xs font-mono pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Calculated Gap:</span>
                  <span className="text-amber-400 font-bold">-{selectedGap.gap}% Deficit</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Root Cause Analysis</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/[0.06]">
                  {selectedGap.reason}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <CareerButton variant="secondary" size="sm" onClick={() => setSelectedGap(null)}>
                  Close
                </CareerButton>
                <Link href="/roadmap" onClick={() => setSelectedGap(null)}>
                  <CareerButton variant="momentum" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Add Remedial Sprint
                  </CareerButton>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
