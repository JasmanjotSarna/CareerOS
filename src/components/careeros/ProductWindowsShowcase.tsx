'use client';

import React, { useState } from 'react';

type WindowTab = 'interview' | 'command' | 'college';

export function ProductWindowsShowcase() {
  const [activeTab, setActiveTab] = useState<WindowTab>('interview');

  // Filters for college dashboard
  const [branchFilter, setBranchFilter] = useState<'All' | 'CSE' | 'ECE' | 'IT'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'SDE-1' | 'Data Analyst' | 'ML Engineer'>('All');

  return (
    <section className="max-w-6xl mx-auto px-6 space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Product In Action
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Realistic product views. Not abstract mockups.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8]">
            Inspect the actual views students and placement officers use every day.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 self-start sm:self-auto font-sans text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'interview'
                ? 'bg-[#4361EE] text-white shadow-xs'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Technical Interview Report
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('command')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'command'
                ? 'bg-[#4361EE] text-white shadow-xs'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Command Center
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('college')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'college'
                ? 'bg-[#4361EE] text-white shadow-xs'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            College Placement Dashboard
          </button>
        </div>
      </div>

      {/* WINDOW (A): AI TECHNICAL INTERVIEW REPORT */}
      {activeTab === 'interview' && (
        <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
          {/* Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100/80 dark:bg-[#0B132B] border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="ml-2 font-mono text-xs text-slate-600 dark:text-[#94A3B8]">
                AI Technical Interview — Post-Session Evaluation
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#94A3B8]">
              Sample data
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="font-mono text-xs text-[#4361EE] uppercase font-semibold">
                  Round: Arrays & Hashing
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">
                  Session Feedback & Diagnostic Breakdown
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-0.5">
                  Adaptive interview simulating SDE-1 algorithmic screening with live audio and code checks.
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1E293B]/50 border border-slate-200 dark:border-white/5 text-right">
                  <span className="text-slate-500 dark:text-[#94A3B8] block text-[10px]">TIME SPENT</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">28m 42s</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1E293B]/50 border border-slate-200 dark:border-white/5 text-right">
                  <span className="text-slate-500 dark:text-[#94A3B8] block text-[10px]">TECHNICAL SCORE</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">74 / 100</span>
                </div>
              </div>
            </div>

            {/* Three Core Feedback Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 dark:text-white font-bold">1. Correctness</span>
                  <span className="text-amber-600 dark:text-amber-300 font-semibold">Partial (Brute-Force)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Solved with a working O(n²) brute-force solution that passed all basic test cases, but missed the optimal O(n) hashmap approach required for maximum efficiency under benchmark constraints.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 dark:text-white font-bold">2. Communication</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Strong (142 WPM)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Explained thought process clearly before typing. Verbalized edge cases out loud and maintained consistent speaking cadence with minimal hesitation or filler words.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 dark:text-white font-bold">3. Time Management</span>
                  <span className="text-[#FF6B6B] font-semibold">Needs Bounding</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Spent 14 minutes discussing hypothetical edge cases before writing the first function definition, leaving insufficient time to refactor to the optimal O(n) space-time tradeoff.
                </p>
              </div>
            </div>

            {/* Suggested Focus Callout */}
            <div className="p-4 rounded-xl bg-[#4361EE]/10 border border-[#4361EE]/30 space-y-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#4361EE] font-bold block">
                Suggested Focus for Next Round
              </span>
              <p className="text-xs text-slate-800 dark:text-[#E2E8F0] leading-relaxed">
                Practice hashmap-based lookup patterns and strictly timebox preliminary problem exploration to under 5 minutes before attempting implementation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WINDOW (B): THE COMMAND CENTER */}
      {activeTab === 'command' && (
        <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
          {/* Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100/80 dark:bg-[#0B132B] border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="ml-2 font-mono text-xs text-slate-600 dark:text-[#94A3B8]">
                Career Command Center — Daily Prioritized Actions
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#94A3B8]">
              Sample data
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="font-mono text-xs text-[#FF6B6B] uppercase font-semibold">
                  Today&apos;s Focus
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">
                  Three high-impact moves sequenced for today.
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-0.5">
                  Each action is calculated from your verified skill gap and target role requirements.
                </p>
              </div>

              <div className="font-mono text-xs text-right">
                <span className="text-slate-500 dark:text-[#94A3B8] block text-[10px]">CURRENT READINESS</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">62%</span>
                <span className="text-[#4361EE] block text-[11px]">+4% projected from today</span>
              </div>
            </div>

            {/* Daily Actions List with Reasons */}
            <div className="space-y-3">
              {[
                {
                  id: '01',
                  action: 'Complete SQL Joins & Subqueries Module',
                  time: '45 mins',
                  impact: '+2.5% Technical Readiness',
                  reason: 'Flagged as top deficit in your last technical assessment against the SDE-1 benchmark.',
                  badge: 'Technical Deficit',
                },
                {
                  id: '02',
                  action: 'Tailor Resume for Cloud Platform Role',
                  time: '20 mins',
                  impact: '+1.0% Match Score',
                  reason: 'Resume currently lacks explicit mentions of Docker and PostgreSQL query tuning mentioned in the posting.',
                  badge: 'ATS Alignment',
                },
                {
                  id: '03',
                  action: 'Complete 15-Minute STAR Behavioral Drill',
                  time: '15 mins',
                  impact: '+1.5% HR Readiness',
                  reason: 'Campus placement drive scheduled in 14 days requires structured conflict-resolution storytelling.',
                  badge: 'Interview Prep',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#FF6B6B]">{item.id}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.action}</h4>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-[#94A3B8]">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Reason:</strong> {item.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 font-mono text-xs">
                    <div className="text-right">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold block">{item.impact}</span>
                      <span className="text-slate-500 dark:text-[#94A3B8] text-[11px]">{item.time}</span>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#4361EE] hover:bg-[#3451db] text-white font-medium text-xs transition-colors shadow-xs"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WINDOW (C): THE COLLEGE DASHBOARD */}
      {activeTab === 'college' && (
        <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
          {/* Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100/80 dark:bg-[#0B132B] border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
              <span className="ml-2 font-mono text-xs text-slate-600 dark:text-[#94A3B8]">
                Placement Officer Workspace — Cohort Readiness Overview
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#94A3B8]">
              Sample data
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Cohort Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Final-Year Students', val: '842', highlight: 'text-slate-900 dark:text-white' },
                { label: 'Overall Readiness', val: '58%', highlight: 'text-slate-900 dark:text-white' },
                { label: 'Technical Readiness', val: '61%', highlight: 'text-[#4361EE]' },
                { label: 'Aptitude Readiness', val: '66%', highlight: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Communication Readiness', val: '49%', highlight: 'text-amber-600 dark:text-amber-300' },
                { label: 'Interview Readiness', val: '55%', highlight: 'text-[#FF6B6B]' },
              ].map((m) => (
                <div key={m.label} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/50 border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 dark:text-[#94A3B8] block uppercase">
                    {m.label}
                  </span>
                  <span className={`text-2xl font-bold font-mono block ${m.highlight}`}>
                    {m.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Filters: Branch & Role */}
            <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-100 dark:bg-[#1E293B]/30 border border-slate-200 dark:border-white/5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-[#94A3B8]">Branch:</span>
                {(['All', 'CSE', 'ECE', 'IT'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranchFilter(b)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      branchFilter === b
                        ? 'bg-[#4361EE] text-white font-bold'
                        : 'bg-white dark:bg-white/5 text-slate-700 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-[#94A3B8]">Target Role:</span>
                {(['All', 'SDE-1', 'Data Analyst', 'ML Engineer'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      roleFilter === r
                        ? 'bg-[#4361EE] text-white font-bold'
                        : 'bg-white dark:bg-white/5 text-slate-700 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Section: Top Skill Gaps vs Students Needing Intervention */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Skill Gaps across Cohort */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                    Top Skill Gaps Across Cohort
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-[#94A3B8]">5 key deficits</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { skill: 'System Design Fundamentals', pct: 72 },
                    { skill: 'SQL & Databases (Indexing & Joins)', pct: 61 },
                    { skill: 'Communication Pacing Under Pressure', pct: 58 },
                    { skill: 'Behavioral & HR Framing (STAR)', pct: 44 },
                    { skill: 'Core DSA Patterns (Graphs & Trees)', pct: 37 },
                  ].map((gap) => (
                    <div key={gap.skill} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-800 dark:text-[#E2E8F0] font-medium">{gap.skill}</span>
                        <span className="font-mono font-bold text-[#FF6B6B]">{gap.pct}% students gap</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#334155] overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B6B] rounded-full"
                          style={{ width: `${gap.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Students Requiring Intervention */}
              <div className="lg:col-span-6 p-5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                    Students Requiring Intervention
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
                    113 Urgent
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  113 students have an overall readiness score below 40% with under 60 days remaining until placement drives commence.
                </p>

                <div className="space-y-2 font-mono text-xs">
                  {[
                    { id: 'STU-4821', branch: 'CSE', role: 'SDE-1', score: '34%', flag: 'Aptitude & DSA deficit' },
                    { id: 'STU-1903', branch: 'ECE', role: 'SDE-1', score: '36%', flag: 'Coding round failures' },
                    { id: 'STU-5512', branch: 'IT', role: 'Data Analyst', score: '38%', flag: 'Communication pacing' },
                  ].map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">{s.id}</span>
                        <span className="text-slate-500 dark:text-[#94A3B8] text-[11px]">{s.branch} · {s.role}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-rose-500 dark:text-rose-400 block">{s.score} Readiness</span>
                        <span className="text-[10px] text-slate-500 dark:text-[#94A3B8]">{s.flag}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white font-medium text-xs font-mono transition-colors text-center border border-slate-200 dark:border-transparent"
                  >
                    View All 113 Students in Intervention Queue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
