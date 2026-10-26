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
  ArrowUpRight,
  Code2,
  Brain
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Card, GlowCard } from '@/components/ui/Card';
import { SpotlightCard } from '@/components/ui/HighlightGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatMetric } from '@/components/ui/StatMetric';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import { ProgressBar } from '@/components/ui/ProgressRing';
import { Modal } from '@/components/ui/Modal';
import { soundFX } from '@/components/effects/SoundFX';
import { SkillGap } from '@/types';

export default function SkillGapsPage() {
  const { skillGaps, activeTargetRole } = useApp();
  const [selectedGap, setSelectedGap] = useState<SkillGap | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All Domains' },
    { id: 'Programming', label: 'Programming' },
    { id: 'Data', label: 'Data & Databases' },
    { id: 'Backend', label: 'Backend Architecture' },
    { id: 'CS Fundamentals', label: 'CS Fundamentals' },
  ];

  const filteredGaps = skillGaps.filter(
    (g) => selectedCategory === 'All' || g.category === selectedCategory
  );

  const criticalCount = skillGaps.filter((g) => g.priority === 'Critical').length;
  const highCount = skillGaps.filter((g) => g.priority === 'High').length;

  const handleSelectSkill = (gap: SkillGap) => {
    soundFX.playClick();
    setSelectedGap(gap);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="min-w-0 flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>COMPETENCY GRAPH MATRIX</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Skill Gap Analysis
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Granular diagnosis of required capabilities for <span className="text-white font-semibold">{activeTargetRole.title}</span>.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <StatMetric 
                value={criticalCount} 
                label="Critical Deficits" 
                size="sm" 
                highlight="momentum" 
              />
              <StatMetric 
                value={highCount} 
                label="High Gaps" 
                size="sm" 
                highlight="indigo" 
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-between gap-4">
            <AnimatedTabs
              tabs={categories}
              activeTab={selectedCategory}
              onChange={setSelectedCategory}
              layoutId="skill-tabs"
            />
          </div>

          {/* Competency Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGaps.map((gap) => {
              const isCritical = gap.priority === 'Critical';
              const isHigh = gap.priority === 'High';

              return (
                <SpotlightCard
                  key={gap.skillName}
                  onClick={() => handleSelectSkill(gap)}
                  className="p-5 cursor-pointer space-y-4"
                  spotlightColor="rgba(6, 182, 212, 0.15)"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                        {gap.category}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                        {gap.skillName}
                      </h3>
                    </div>
                    <Badge
                      variant={isCritical ? 'momentum' : isHigh ? 'indigo' : 'neutral'}
                      pulse={isCritical}
                      className="text-[9px] py-0 px-1.5"
                    >
                      {gap.priority}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[var(--text-muted)]">Current: {gap.currentLevel}%</span>
                      <span className="text-white font-bold">Target: {gap.requiredLevel}%</span>
                    </div>
                    <ProgressBar
                      value={gap.currentLevel}
                      variant={isCritical ? 'momentum' : 'cyan'}
                      size="sm"
                    />
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {gap.recommendedAction}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-cyan-400 font-medium group-hover:underline">
                    <span>Inspect Recommended Remediation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Skill Drill Detail Modal */}
          {selectedGap && (
            <Modal
              isOpen={Boolean(selectedGap)}
              onClose={() => setSelectedGap(null)}
              title={selectedGap.skillName}
              description={`Competency remediation for ${activeTargetRole.title}`}
            >
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)]">Current Proficiency</span>
                    <span className="text-cyan-400 font-bold">{selectedGap.currentLevel}% / {selectedGap.requiredLevel}%</span>
                  </div>
                  <ProgressBar value={selectedGap.currentLevel} variant="cyan" size="md" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">
                    AI Remedial Prescription
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-secondary)]/60 p-3 rounded-xl border border-[var(--border-subtle)]">
                    {selectedGap.recommendedAction}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Link href="/roadmap" onClick={() => setSelectedGap(null)}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Add to Roadmap Sprint
                    </Button>
                  </Link>
                </div>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
}
