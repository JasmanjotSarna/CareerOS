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
import { AIInsight } from '@/components/ai/AIInsight';

export default function ProgressPage() {
  const { readinessScores, activeTargetRole, roadmapWeeks, recentEvents } = useApp();

  // Progress trajectory data reflecting current score at Week 4
  const trajectoryData = [
    { week: 'Week 1', readiness: 51, technical: 58, communication: 48, interview: 45 },
    { week: 'Week 2', readiness: 58, technical: 65, communication: 52, interview: 54 },
    { week: 'Week 3', readiness: 64, technical: 72, communication: 58, interview: 61 },
    { week: 'Week 4 (Current)', readiness: readinessScores.overall, technical: readinessScores.technical, communication: readinessScores.communication, interview: readinessScores.interview },
  ];

  const dimensionComparison = [
    { dimension: 'Technical', current: readinessScores.technical, baseline: 58 },
    { dimension: 'Aptitude', current: readinessScores.aptitude, baseline: 55 },
    { dimension: 'Communication', current: readinessScores.communication, baseline: 48 },
    { dimension: 'HR Framing', current: readinessScores.hr, baseline: 50 },
    { dimension: 'Interview', current: readinessScores.interview, baseline: 45 },
  ];

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <StudentSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Performance Telemetry
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Readiness Trajectory & Activity Log
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Longitudinal tracking of your preparedness against {activeTargetRole.title} placement benchmarks.
              </p>
            </div>

            <div className="p-3 px-4 rounded-xl bg-[#111722] border border-[#202938] flex items-center gap-3">
              <span className="text-xs text-slate-400">Net Trajectory Growth:</span>
              <span className="text-xl font-black font-mono text-emerald-400">
                +{readinessScores.overall - 51}%
              </span>
            </div>
          </div>

          {/* AI Progress Summary Callout */}
          <AIInsight
            title="CareerOS Progress Synthesis"
            badge="Weekly Digest"
            variant="cyan"
          >
            Your overall readiness has increased <strong className="text-emerald-300">+{readinessScores.overall - 51}%</strong> over the last 4 weeks. Technical competencies (+20 pts) and coding speed are improving faster than verbal communication pacing. Your highest-impact immediate task is SQL practice in Week 1 roadmap.
          </AIInsight>

          {/* Main Area Chart: 4-Week Trajectory */}
          <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="font-bold text-white text-base">Overall Placement Readiness Over Time</h3>
                <p className="text-xs text-slate-400">4-Week progression from baseline to current sprint</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">Readiness Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-slate-300">Technical Depth</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#202938" vertical={false} />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[30, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0d111a', borderColor: '#202938', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="readiness"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReadiness)"
                    name="Readiness (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="technical"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTech)"
                    name="Technical (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dimension Comparison Bar Chart + Live Event Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Dimension Comparison */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-4 shadow-xl">
              <div>
                <h3 className="font-bold text-white text-base">Current vs Baseline by Dimension</h3>
                <p className="text-xs text-slate-400">Comparing day 1 intake against today</p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dimensionComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#202938" vertical={false} />
                    <XAxis dataKey="dimension" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0d111a', borderColor: '#202938', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="baseline" fill="#1e293b" radius={[4, 4, 0, 0]} name="Baseline Score" />
                    <Bar dataKey="current" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Current Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Event Log Timeline */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#202938]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">Real-Time Career Activity Log</h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">{recentEvents.length} events</span>
              </div>

              <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                {recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-[#0d111a] border border-[#202938] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-white block">{evt.title}</span>
                      <p className="text-[11px] text-slate-400">{evt.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {evt.readinessDelta && (
                      <span className="text-xs font-bold font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                        +{evt.readinessDelta}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
