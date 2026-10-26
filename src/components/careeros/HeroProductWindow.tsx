'use client';

import React from 'react';

export function HeroProductWindow() {
  const readinessMetrics = [
    { label: 'Technical', score: 58, color: 'bg-[#4361EE]' },
    { label: 'Aptitude', score: 70, color: 'bg-emerald-500' },
    { label: 'Communication', score: 64, color: 'bg-sky-500' },
    { label: 'HR Readiness', score: 56, color: 'bg-[#FF6B6B]' },
  ];

  const missingSkills = [
    { name: 'System design fundamentals', priority: 'High', status: 'Deficit' },
    { name: 'SQL joins & indexing', priority: 'High', status: 'In progress' },
    { name: 'Interview pacing under pressure', priority: 'Medium', status: 'Pending drill' },
  ];

  const roadmapSteps = [
    { step: '1', title: 'Complete SQL joins module', duration: '2h', status: 'Next' },
    { step: '2', title: 'Retake mock technical interview', duration: '45m', status: 'Scheduled' },
    { step: '3', title: 'Speaking drill: pacing exercise', duration: '15m', status: 'Queued' },
  ];

  return (
    <div
      data-ui="hero-product-window"
      className="w-full rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F8F9FA] shadow-2xl overflow-hidden select-none transition-colors duration-200"
    >
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-[#0B132B] border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
          <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
          <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
          <span className="ml-2 font-mono text-xs text-slate-500 dark:text-[#94A3B8]">
            Career Workspace — SDE-1 Readiness
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-slate-600 dark:text-[#94A3B8]">
          Sample data
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Top Header Row: Target Role & 62% Gauge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200/80 dark:border-white/5">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B]">
              Target Role
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              SDE-1, Product Company
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8]">
              Readiness calculated from verified profile, coding drills, and mock rounds.
            </p>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-white/5">
            <span className="font-mono text-[11px] text-slate-500 dark:text-[#94A3B8] uppercase">
              Overall Readiness
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                62
              </span>
              <span className="text-lg font-mono text-[#4361EE] font-bold">%</span>
            </div>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-300 font-medium">Approaching benchmark</span>
          </div>
        </div>

        {/* 4 Dimensional Readiness Bars */}
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] block">
            Readiness by Dimension
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {readinessMetrics.map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200/80 dark:border-white/5 space-y-1.5 hover:border-[#4361EE]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-[#E2E8F0] font-medium">{item.label}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{item.score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#334155] overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              Missing Skills (Ranked by Impact)
            </span>
            <span className="text-xs text-slate-500 dark:text-[#94A3B8]">3 prioritized</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {missingSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#1E293B]/30 border border-slate-200/80 dark:border-white/5 text-xs hover:border-[#4361EE]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
                  <span className="text-slate-800 dark:text-[#F1F5F9] font-medium">{skill.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-500 dark:text-[#94A3B8]">Priority: {skill.priority}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-[#E2E8F0]">
                    {skill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next on Your Roadmap */}
        <div className="space-y-2.5 pt-1 border-t border-slate-200 dark:border-white/10">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] block">
            Next on Your Roadmap
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roadmapSteps.map((step) => (
              <div
                key={step.step}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200/80 dark:border-white/5 space-y-1 hover:border-[#4361EE]/40 transition-colors"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-[#94A3B8]">
                  <span>Step {step.step}</span>
                  <span>{step.duration}</span>
                </div>
                <p className="text-xs font-medium text-slate-900 dark:text-white line-clamp-2">{step.title}</p>
                <span className="inline-block text-[10px] font-mono text-[#4361EE] pt-0.5">
                  {step.status} →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
