'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Layers,
  BrainCircuit,
  Target,
  History,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { StatMetric } from '@/components/ui/StatMetric';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressRing';

export default function ProgressPage() {
  const { readinessScores, activeTargetRole, roadmapWeeks, recentEvents } = useApp();

  const trajectoryData = [
    { week: 'W1', readiness: 42, technical: 45, communication: 40, interview: 38 },
    { week: 'W2', readiness: 54, technical: 58, communication: 48, interview: 48 },
    { week: 'W3', readiness: 66, technical: 70, communication: 55, interview: 60 },
    { week: 'W4 (Current)', readiness: readinessScores.overall, technical: readinessScores.technical, communication: readinessScores.communication, interview: readinessScores.interview },
  ];

  const dimensionComparison = [
    { dimension: 'Technical', current: readinessScores.technical, baseline: 50 },
    { dimension: 'Aptitude', current: readinessScores.aptitude, baseline: 50 },
    { dimension: 'Communication', current: readinessScores.communication, baseline: 50 },
    { dimension: 'HR STAR', current: readinessScores.hr, baseline: 50 },
    { dimension: 'Interview Mock', current: readinessScores.interview, baseline: 50 },
  ];

  const netGrowth = Math.max(0, readinessScores.overall - 42);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>LONGITUDINAL PERFORMANCE TELEMETRY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Readiness & Growth Trajectory
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Tracking your trajectory against {activeTargetRole.title} placement standards.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 px-4 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-muted)]">Net Sprint Growth:</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                +{netGrowth}%
              </span>
            </div>
          </div>

          {/* 4-Week Area Chart Card */}
          <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-base font-bold text-white">4-Week Trajectory Velocity</h3>
                <p className="text-xs text-[var(--text-muted)]">Multi-dimensional progression towards placement gate</p>
              </div>
              <Badge variant="cyan">78% Target Gate</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="week" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e1420',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="readiness"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReadiness)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bar Chart: Dimensional Comparison */}
          <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-4">
            <h3 className="text-base font-bold text-white">Dimensional Breakdown vs Cohort Baseline</h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {dimensionComparison.map((dim, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold block">{dim.dimension}</span>
                  <span className="text-xl font-bold font-mono text-cyan-400 block">{dim.current}%</span>
                  <ProgressBar value={dim.current} variant="cyan" size="sm" />
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
