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
import { StatMetric } from '@/components/ui/StatMetric';
import { Card, GlowCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
    (s) => s.overallReadiness < interventionConfig.readinessThreshold && s.daysToDrive < interventionConfig.daysToDriveThreshold
  );

  const handleDispatch = (studentId: string) => {
    soundFX.playClick();
    triggerIntervention(studentId, 'AI 1-on-1 Remedial counseling session booked and personalized SQL sprint assigned.');
    setDispatchedId(studentId);
    setTimeout(() => setDispatchedId(null), 2500);
    soundFX.playSuccess();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <FacultySidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>DEAN & PLACEMENT DIRECTOR PORTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Cohort Placement Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Real-time readiness telemetry, cohort deficits, and automated early interventions across all engineering branches.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/faculty/students">
                <Button variant="secondary" size="md" rightIcon={<Users className="w-4 h-4" />}>
                  Inspect All Candidates
                </Button>
              </Link>
            </div>
          </div>

          {/* 3 Primary Hero Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlowCard glowColor="indigo" className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <StatMetric 
                value={cohortKPIs.totalStudents} 
                label="Total Monitored Cohort" 
                sublabel="CSE, AI & IT (Batch 2026)" 
                size="lg" 
                highlight="indigo" 
              />
            </GlowCard>

            <GlowCard glowColor="cyan" className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <StatMetric 
                value={cohortKPIs.overallReadiness} 
                suffix="%" 
                label="Cohort Avg Readiness" 
                sublabel="+6% improvement over previous month" 
                size="lg" 
                highlight="cyan" 
                trend={6}
              />
            </GlowCard>

            <GlowCard glowColor="momentum" className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <StatMetric 
                value={atRiskStudents.length} 
                label="Urgent Intervention Required" 
                sublabel="Candidates below 40% threshold with upcoming drive" 
                size="lg" 
                highlight="momentum" 
              />
            </GlowCard>
          </div>

          {/* At Risk Candidates Callout Table */}
          <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Candidates Requiring Remedial Action</h3>
              </div>
              <Badge variant="momentum">{atRiskStudents.length} Flagged</Badge>
            </div>

            <div className="space-y-2.5">
              {atRiskStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{st.name}</h4>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">({st.branch})</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Target: <strong className="text-white">{st.targetRole}</strong> • Readiness: <span className="text-amber-400 font-bold font-mono">{st.overallReadiness}%</span>
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                    onClick={() => handleDispatch(st.id)}
                    disabled={dispatchedId === st.id}
                  >
                    {dispatchedId === st.id ? 'Intervention Sent!' : 'Dispatch 1-on-1 Counseling'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
