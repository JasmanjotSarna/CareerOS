'use client';

import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER } from '@/types/workspace';

export default function AnalyticsPage() {
  const { readinessScores, studentProfile } = useApp();
  const { state } = useWorkspace();

  const stats = useMemo(() => {
    const total = state.applications.length;
    const applied = state.applications.filter((app) => ['applied', 'assessment', 'interview', 'offer', 'rejected'].includes(app.status)).length;
    const interviews = state.applications.filter((app) => ['interview', 'offer'].includes(app.status)).length;
    const offers = state.applications.filter((app) => app.status === 'offer').length;
    const responseRate = applied === 0 ? 0 : Math.round((interviews / applied) * 100);
    const interviewToOffer = interviews === 0 ? 0 : Math.round((offers / interviews) * 100);

    const byStatus = APPLICATION_STATUS_ORDER.map((status) => ({
      status,
      label: APPLICATION_STATUS_LABELS[status],
      count: state.applications.filter((app) => app.status === status).length,
    }));

    return { total, applied, interviews, offers, responseRate, interviewToOffer, byStatus };
  }, [state.applications]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopNav />
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6">
        <StudentSidebar />
        <main className="min-w-0 flex-1 space-y-6 py-6 lg:py-8 lg:pl-8">
          <header>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Career analytics</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Analytics</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Real metrics computed from your applications and readiness. Denominators are shown to avoid misleading percentages.
            </p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-[var(--border-default)] p-4">
              <div className="text-xs text-[var(--text-dim)]">Applications tracked</div>
              <div className="mt-1 text-2xl font-bold">{stats.total}</div>
            </Card>
            <Card className="border-[var(--border-default)] p-4">
              <div className="text-xs text-[var(--text-dim)]">Applied / assessed onward</div>
              <div className="mt-1 text-2xl font-bold">{stats.applied}</div>
            </Card>
            <Card className="border-[var(--border-default)] p-4">
              <div className="text-xs text-[var(--text-dim)]">Response rate (to interview/offer) / {stats.applied}</div>
              <div className="mt-1 text-2xl font-bold">{stats.responseRate}%</div>
            </Card>
            <Card className="border-[var(--border-default)] p-4">
              <div className="text-xs text-[var(--text-dim)]">Interview → offer / {stats.interviews}</div>
              <div className="mt-1 text-2xl font-bold">{stats.interviewToOffer}%</div>
            </Card>
          </div>

          <Card className="border-[var(--border-default)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Pipeline distribution</div>
                <div className="text-xs text-[var(--text-muted)]">Based on your actual applications</div>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stats.byStatus.map((row) => (
                <div key={row.status} className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3 py-2">
                  <span className="text-sm text-[var(--text-secondary)]">{row.label}</span>
                  <span className="font-mono text-sm">{row.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[var(--border-default)] p-5">
            <div className="mb-2 text-sm font-semibold">Readiness snapshot</div>
            <div className="text-xs text-[var(--text-muted)]">From the existing readiness engine for {studentProfile.fullName || 'you'}</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ['Overall', readinessScores.overall],
                ['Technical', readinessScores.technical],
                ['Aptitude', readinessScores.aptitude],
                ['Communication', readinessScores.communication],
                ['HR', readinessScores.hr],
                ['Interview', readinessScores.interview],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-3 text-center">
                  <div className="text-xs text-[var(--text-dim)]">{label}</div>
                  <div className="mt-1 text-lg font-bold">{value}%</div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
