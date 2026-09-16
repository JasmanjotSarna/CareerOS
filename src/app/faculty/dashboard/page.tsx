'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Download, 
  ChevronRight, 
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { FacultySidebar } from '@/components/navigation/FacultySidebar';
import { MetricDisplay } from '@/components/ui/MetricDisplay';
import { GlowCard } from '@/components/ui/GlowCard';
import { CareerButton } from '@/components/ui/CareerButton';
import { soundFX } from '@/components/effects/SoundFX';

export default function FacultyDashboardPage() {
  const { 
    cohortKPIs, 
    facultyStudents, 
    triggerIntervention, 
    interventionConfig 
  } = useApp();

  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  const atRiskStudents = facultyStudents.filter(
    s => s.overallReadiness < interventionConfig.readinessThreshold && s.daysToDrive < interventionConfig.daysToDriveThreshold
  );

  const handleDispatch = (studentId: string) => {
    soundFX.playClick();
    triggerIntervention(studentId, 'AI 1-on-1 Remedial counseling session booked and personalized SQL sprint assigned.');
    setDispatchedId(studentId);
    setTimeout(() => setDispatchedId(null), 2500);
    soundFX.playSuccess();
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <FacultySidebar />

        <main className="flex-1 py-8 md:px-8 space-y-10 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span>DEAN & PLACEMENT DIRECTOR PORTAL</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Cohort Placement Intelligence
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Real-time readiness telemetry, cohort deficits, and automated early interventions across all engineering branches.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/faculty/students">
                <CareerButton variant="secondary" size="md" rightIcon={<Users className="w-4 h-4" />}>
                  Inspect All Students
                </CareerButton>
              </Link>
            </div>
          </div>

          {/* 1. THREE PRIMARY HERO METRICS (Visual Data Storytelling) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GlowCard className="p-6 bg-[#0B0F16]/90 border border-white/[0.1]">
              <MetricDisplay 
                value={cohortKPIs.totalStudents} 
                label="Total Monitored Cohort" 
                sublabel="CSE, CSE-AI & IT (Batch 2026)" 
                size="lg" 
                highlight="cyan" 
              />
            </GlowCard>

            <GlowCard className="p-6 bg-[#0B0F16]/90 border border-white/[0.1]">
              <MetricDisplay 
                value={cohortKPIs.overallReadiness} 
                suffix="%" 
                label="Cohort Avg Readiness" 
                sublabel="+6% improvement over previous month" 
                size="lg" 
                highlight="violet" 
                trend={6}
              />
            </GlowCard>

            <GlowCard className="p-6 bg-[#0B0F16]/90 border border-amber-500/30">
              <MetricDisplay 
                value={atRiskStudents.length} 
                label="At-Risk Candidates" 
                sublabel="<45% readiness with <60 days to campus drives" 
                size="lg" 
                highlight="momentum" 
              />
            </GlowCard>
          </div>

          {/* 2. READINESS TIERS & SYSTEMIC SKILL DEFICITS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Readiness Tiers Distribution (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <GlowCard className="p-6 bg-[#0B0F16]">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-6">
                  Cohort Readiness Distribution
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-emerald-400 font-bold">Placement Ready (&gt;75% Readiness)</span>
                      <span className="text-white font-bold">{cohortKPIs.readyPercentage}% (236 Students)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cohortKPIs.readyPercentage}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-cyan-400 font-bold">Developing Phase (50% - 75%)</span>
                      <span className="text-white font-bold">{cohortKPIs.developingPercentage}% (493 Students)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${cohortKPIs.developingPercentage}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-amber-400 font-bold">At-Risk Phase (&lt;50% Readiness)</span>
                      <span className="text-white font-bold">{cohortKPIs.atRiskPercentage}% (113 Students)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cohortKPIs.atRiskPercentage}%` }} />
                    </div>
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Right: Systemic Skill Deficits Heatmap (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <GlowCard className="p-6 bg-[#0B0F16]">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-6">
                  Cohort Competency Deficit Heatmap
                </h3>

                <div className="space-y-3">
                  {cohortKPIs.topCohortSkillGaps.map((gap) => (
                    <div key={gap.skill} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-white font-bold">{gap.skill}</span>
                        <span className="text-amber-400 font-bold">{gap.deficitPercentage}% Deficit</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                          style={{ width: `${gap.deficitPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>
          </div>

          {/* 3. AT-RISK STUDENTS EARLY INTERVENTION ROSTER */}
          <GlowCard className="p-6 bg-[#0B0F16] border border-amber-500/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Early Intervention Priority Queue ({atRiskStudents.length} Students)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Students below the 45% readiness threshold with campus drives arriving within 60 days.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Student Name</th>
                    <th className="pb-3 font-semibold">Roll Number</th>
                    <th className="pb-3 font-semibold">Branch</th>
                    <th className="pb-3 font-semibold">Readiness</th>
                    <th className="pb-3 font-semibold">Days to Drive</th>
                    <th className="pb-3 font-semibold text-right">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {atRiskStudents.slice(0, 5).map((student) => (
                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-white font-bold">{student.name}</td>
                      <td className="py-3 text-slate-400">{student.rollNumber}</td>
                      <td className="py-3 text-slate-400">{student.branch}</td>
                      <td className="py-3 text-amber-400 font-bold">{student.overallReadiness}%</td>
                      <td className="py-3 text-slate-400">{student.daysToDrive} Days</td>
                      <td className="py-3 text-right">
                        {dispatchedId === student.id ? (
                          <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dispatched</span>
                          </span>
                        ) : (
                          <CareerButton 
                            variant="momentum" 
                            size="sm"
                            onClick={() => handleDispatch(student.id)}
                            leftIcon={<Send className="w-3 h-3" />}
                          >
                            Dispatch AI Plan
                          </CareerButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </main>
      </div>
    </div>
  );
}
