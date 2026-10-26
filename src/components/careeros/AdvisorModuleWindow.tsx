'use client';

import React, { useState } from 'react';

const PATHWAYS = [
  {
    id: 'sde',
    title: 'Distributed Systems & Cloud Engineer',
    fit: 88,
    overlap: '84% competency overlap with your core stack (TypeScript, Go, PostgreSQL, Docker)',
    pros: 'Direct alignment with high-concurrency cloud infrastructure demands; rapid time-to-impact.',
    tradeoff: 'Requires mastering Raft consensus and distributed transactional isolation boundaries.',
    salary: '$135,000 – $170,000 [Market benchmark]',
    timeToRamp: '4–6 weeks targeted sprint',
    basis: 'Analyzed against 1,420 Q3 backend openings',
  },
  {
    id: 'mle',
    title: 'Machine Learning Systems Specialist',
    fit: 79,
    overlap: '68% competency overlap (Python, PyTorch base; delta in GPU memory & CUDA profiling)',
    pros: 'Highest compensation ceiling; immense institutional demand for vLLM & inference acceleration.',
    tradeoff: 'Steep learning curve in low-level GPU kernel profiling and KV cache optimization.',
    salary: '$150,000 – $195,000 [Market benchmark]',
    timeToRamp: '8–10 weeks specialized ramp',
    basis: 'Analyzed against 890 production AI infrastructure roles',
  },
  {
    id: 'data',
    title: 'Data & Analytics Platform Architect',
    fit: 82,
    overlap: '76% competency overlap (SQL, schema design, event pipelines; delta in PySpark broadcast joins)',
    pros: 'Stable demand across mid-market & enterprise; clear promotion pathways to Staff Architect.',
    tradeoff: 'Heavy dependency on legacy warehouse migrations and data quality contract governance.',
    salary: '$125,000 – $155,000 [Market benchmark]',
    timeToRamp: '5 weeks focused sprint',
    basis: 'Analyzed against 1,150 data engineering postings',
  },
];

export function AdvisorModuleWindow() {
  const [activeTab, setActiveTab] = useState(0);
  const active = PATHWAYS[activeTab];

  return (
    <div
      data-ui="advisor-module-window"
      className="w-full rounded-2xl bg-[#0e1015] border border-white/10 text-[#f0f2f7] p-6 sm:p-8 space-y-6 select-none"
    >
      {/* OS Window Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
          </div>
          <span className="font-mono text-xs text-[#8b92a5] uppercase tracking-wider">
            ADVISOR.SYS // QUESTION 01: WHICH CAREER?
          </span>
        </div>
        <div className="font-mono text-xs text-[#3b82f6]">
          MULTIVERSE CAREER COMPARISON • ZERO HALLUCINATED SALARIES
        </div>
      </div>

      {/* Pathway Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PATHWAYS.map((p, idx) => {
          const isSelected = activeTab === idx;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`p-4 rounded-xl text-left border transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#1b2234] border-[#2563eb] text-white shadow-sm'
                  : 'bg-[#13161d] border-white/5 text-[#8b92a5] hover:border-white/15 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-[#8b92a5]">PATHWAY {idx + 1}</span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-[#2563eb] text-white' : 'bg-white/10 text-[#c2c7d6]'
                }`}>
                  {p.fit}% FIT
                </span>
              </div>
              <p className="font-medium text-sm text-white leading-snug">{p.title}</p>
            </button>
          );
        })}
      </div>

      {/* Deep Trajectory Comparative Surface */}
      <div className="p-6 rounded-xl bg-[#141720] border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{active.title}</h3>
            <p className="text-sm text-[#8b92a5] mt-1">{active.overlap}</p>
          </div>
          <div className="text-left md:text-right font-mono">
            <span className="text-xs text-[#8b92a5] block">COMPENSATION BAND</span>
            <span className="text-base font-semibold text-emerald-400">{active.salary}</span>
          </div>
        </div>

        {/* Tradeoffs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-lg bg-[#191c26] border border-white/5 space-y-1.5">
            <span className="font-mono text-xs text-emerald-400 font-semibold block uppercase">
              STRATEGIC ADVANTAGE
            </span>
            <p className="text-[#c2c7d6] leading-relaxed">{active.pros}</p>
          </div>

          <div className="p-4 rounded-lg bg-[#191c26] border border-white/5 space-y-1.5">
            <span className="font-mono text-xs text-amber-400 font-semibold block uppercase">
              CRITICAL TRADE-OFF & FRICTION
            </span>
            <p className="text-[#c2c7d6] leading-relaxed">{active.tradeoff}</p>
          </div>
        </div>

        {/* Ramp Time & Verification Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#101217] border border-white/5 text-xs font-mono text-[#8b92a5]">
          <span>RAMP DELTA: <strong className="text-white">{active.timeToRamp}</strong></span>
          <span>{active.basis}</span>
        </div>
      </div>
    </div>
  );
}
