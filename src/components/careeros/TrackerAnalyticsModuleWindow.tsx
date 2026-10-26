'use client';

import React, { useState } from 'react';

const TRACKER_STAGES = [
  { stage: 'Saved', count: 4, note: 'Target roles catalogued' },
  { stage: 'Preparing', count: 2, note: 'Tailoring bullets & STAR prep' },
  { stage: 'Applied', count: 6, note: 'Dispatched with verified resume' },
  { stage: 'Assessment', count: 3, note: 'Take-home & HackerRank screens' },
  { stage: 'Interview', count: 2, note: 'Technical rounds scheduled' },
  { stage: 'Offer', count: 1, note: 'Offer in active review' },
  { stage: 'Rejected', count: 3, note: 'Feedback archived for learning' },
  { stage: 'Withdrawn', count: 1, note: 'Low compensation misalignment' },
];

export function TrackerAnalyticsModuleWindow() {
  const [selectedStage, setSelectedStage] = useState('Interview');

  return (
    <div
      data-ui="tracker-analytics-module-window"
      className="w-full rounded-2xl bg-[#0e1015] border border-white/10 text-[#f0f2f7] p-6 sm:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
          </div>
          <span className="font-mono text-xs text-[#8b92a5] uppercase tracking-wider">
            TRACKER_ANALYTICS.SYS // QUESTION 05: IS IT WORKING?
          </span>
        </div>
        <div className="font-mono text-xs text-[#3b82f6]">
          MEASURED FACTUAL METRICS VS ESTIMATED PROJECTIONS
        </div>
      </div>

      {/* Main Grid: Pipeline Kanban Stages & Measured vs Estimated Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Complete 8-Stage Application Pipeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8b92a5]">
                APPLICATION LIFECYCLE PIPELINE (8 VERIFIED STAGES)
              </span>
              <span className="font-mono text-xs text-white">22 TOTAL ENTITIES</span>
            </div>

            {/* Stage Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRACKER_STAGES.map((s) => {
                const isSelected = selectedStage === s.stage;
                return (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => setSelectedStage(s.stage)}
                    className={`p-3 rounded-lg border text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#1b2234] border-[#2563eb] text-white'
                        : 'bg-[#191c26] border-white/5 text-[#8b92a5] hover:border-white/15 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold">{s.stage}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        s.stage === 'Offer'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isSelected
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-white/10 text-white'
                      }`}>
                        {s.count}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8b92a5] mt-1 truncate">{s.note}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected Stage Detail Card */}
            <div className="p-4 rounded-lg bg-[#191c26] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-white text-sm">
                  ACTIVE IN [{selectedStage.toUpperCase()}] STAGE
                </span>
                <span className="text-[#3b82f6]">KANBAN VIEW</span>
              </div>

              {selectedStage === 'Interview' ? (
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded bg-[#141720] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Stripe [Sample Demo]</p>
                      <p className="text-[#8b92a5] text-[11px]">Senior Infrastructure Engineer • Round 3 (System Design)</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">In 3 Days</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#141720] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Monzo [Sample Demo]</p>
                      <p className="text-[#8b92a5] text-[11px]">Platform Core Engineer • Round 2 (Code Review & Architecture)</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">In 6 Days</span>
                  </div>
                </div>
              ) : selectedStage === 'Offer' ? (
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <p className="font-semibold text-emerald-300">Cloudflare [Sample Demo] — Offer Extended</p>
                  <p className="text-[#c2c7d6] text-[11px]">
                    Package: $165,000 base + equity. Decision deadline: 10 days remaining.
                  </p>
                </div>
              ) : (
                <p className="text-[#8b92a5] leading-relaxed pt-1">
                  Tracking {TRACKER_STAGES.find((s) => s.stage === selectedStage)?.count} opportunities in {selectedStage}. Every stage records timestamped transition events and feedback.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Measured Facts vs Estimated Forecasts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#8b92a5] block border-b border-white/10 pb-3">
              METRICS AUDIT // FACTS VS PROJECTIONS
            </span>

            {/* Measured Figures (Factual Ground Truth) */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] text-emerald-400 uppercase font-semibold block">
                [MEASURED] FACTUAL LOGS (ZERO PROJECTION)
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-3 rounded bg-[#191c26] border border-white/5">
                  <span className="text-[10px] text-[#8b92a5] block">SUBMITTED APPS</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">18</span>
                  <span className="text-[9px] text-[#8b92a5]">VERIFIED DISPATCHES</span>
                </div>
                <div className="p-3 rounded bg-[#191c26] border border-white/5">
                  <span className="text-[10px] text-[#8b92a5] block">INTERVIEWS HELD</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">5</span>
                  <span className="text-[9px] text-[#8b92a5]">ROUNDS ATTENDED</span>
                </div>
                <div className="p-3 rounded bg-[#191c26] border border-white/5">
                  <span className="text-[10px] text-[#8b92a5] block">CODING PROBES</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">42</span>
                  <span className="text-[9px] text-[#8b92a5]">SOLVED ON TARGET</span>
                </div>
                <div className="p-3 rounded bg-[#191c26] border border-white/5">
                  <span className="text-[10px] text-[#8b92a5] block">AVERAGE WPM</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">138</span>
                  <span className="text-[9px] text-[#8b92a5]">ACOUSTIC VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Estimated Figures (Probabilistic Forecasts) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="font-mono text-[11px] text-[#3b82f6] uppercase font-semibold block">
                [ESTIMATED] STATISTICAL PROJECTIONS
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-3 rounded bg-[#191c26] border border-[#2563eb]/20">
                  <span className="text-[10px] text-[#8b92a5] block">READINESS INDEX</span>
                  <span className="text-xl font-bold text-[#3b82f6] mt-0.5 block">88%</span>
                  <span className="text-[9px] text-[#8b92a5]">PROJECTION MODEL</span>
                </div>
                <div className="p-3 rounded bg-[#191c26] border border-[#2563eb]/20">
                  <span className="text-[10px] text-[#8b92a5] block">TIME-TO-OFFER</span>
                  <span className="text-xl font-bold text-[#3b82f6] mt-0.5 block">4.2 WEEKS</span>
                  <span className="text-[9px] text-[#8b92a5]">ESTIMATED WINDOW</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#8b92a5] font-mono leading-relaxed pt-1">
              CareerOS strictly separates empirical facts from AI models so candidates and colleges always know what is real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
