'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Briefcase, 
  Bot, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Card, GlowCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing, ProgressBar } from '@/components/ui/ProgressRing';
import { soundFX } from '@/components/effects/SoundFX';

export default function SuitabilityPage() {
  const { activeTargetRole, targetRoles, setTargetRole, suitability } = useApp();

  const role = activeTargetRole || targetRoles?.[0] || {
    id: 'role-sde-1',
    title: 'Software Engineer — SDE-1',
    salaryRange: '$85,000 - $115,000',
  };

  const safeTargetRoles = targetRoles && targetRoles.length > 0 ? targetRoles : [role];

  const breakdown = suitability?.breakdown || {
    skills: 75,
    experience: 64,
    education: 95,
    projects: 78,
    resume: 71,
  };

  const overallMatch = suitability?.overallMatch ?? 78;

  const facetList = [
    { label: 'Technical Skills Proficiency', score: breakdown.skills ?? 0, weight: '40% weight', desc: 'Evaluated against required core languages, frameworks, and data stores.' },
    { label: 'Project Depth & Complexity', score: breakdown.projects ?? 0, weight: '25% weight', desc: 'Assessed from full-stack architectural scale, production deployments, and testing.' },
    { label: 'CS Fundamentals & Academics', score: breakdown.education ?? 0, weight: '15% weight', desc: 'OS, DBMS, Computer Networks, and System Design foundations.' },
    { label: 'ATS Resume Keyword Matching', score: breakdown.resume ?? 0, weight: '10% weight', desc: 'Target role keyword vector match and quantified impact metrics.' },
    { label: 'Practical / Internship Experience', score: breakdown.experience ?? 0, weight: '10% weight', desc: 'Real-world software engineering collaboration and delivery history.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="min-w-0 flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>DETERMINISTIC FIT DIAGNOSTICS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Role Suitability Vector
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Continuous AI benchmarking of your verified competencies against industry hiring rubrics.
              </p>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)] text-xs">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[9px] uppercase font-bold text-[var(--text-dim)] block font-mono">
                  Benchmark Target
                </span>
                <select
                  value={role.id}
                  onChange={(e) => {
                    soundFX.playClick();
                    setTargetRole(e.target.value);
                  }}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {safeTargetRoles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[var(--surface-primary)] text-white">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Top Banner: Overall Match & Summary */}
          <GlowCard glowColor="cyan" className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Match Dial & Status */}
              <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-3 md:border-r border-[var(--border-subtle)] md:pr-8">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  Overall Vector Match
                </span>
                <div className="flex items-center gap-4">
                  <ProgressRing value={overallMatch} size={84} strokeWidth={7} variant="cyan" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    <Badge variant="cyan" className="mt-1">
                      {overallMatch >= 70 ? 'High Fit Candidate' : 'Developing Fit'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] pt-1">
                  Salary market benchmark: <strong className="text-white font-mono">{role.salaryRange}</strong>
                </p>
              </div>

              {/* Strategic AI Verdict */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold">
                  <Bot className="w-4 h-4" />
                  <span>AI SUITABILITY VERDICT</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {suitability?.aiSummary ||
                    `Your current skill matrix is well-aligned with ${role.title}. Closing the high-priority deficits in SQL database optimization and system design will elevate your readiness above the 85th percentile.`}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Link href="/skills">
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore Skill Gaps
                    </Button>
                  </Link>
                  <Link href="/roadmap">
                    <Button variant="primary" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                      View Sprint Roadmap
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* 5-Vector Breakdown List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Dimension Breakdown</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facetList.map((facet, idx) => (
                <Card key={idx} className="p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{facet.label}</h4>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{facet.weight}</span>
                    </div>
                    <span className="text-base font-mono font-bold text-cyan-400">{facet.score}%</span>
                  </div>

                  <ProgressBar value={facet.score} variant="cyan" size="md" />

                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {facet.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
