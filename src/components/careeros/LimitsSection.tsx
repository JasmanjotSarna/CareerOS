'use client';

import React from 'react';

const LIMITS = [
  {
    code: 'RULE.01',
    title: 'Never invent credentials or inflate ATS scores',
    description: 'We will never suggest fabricating skills, projects, or employment dates to trick a parser. Every bullet tailored by CareerOS is verified against real work you actually performed.',
  },
  {
    code: 'RULE.02',
    title: 'Never dispatch ghost applications without your review',
    description: 'We will never spam 500 unreviewed applications into company ATS portals on your behalf. You review and confirm every tailored resume and cover note before sending.',
  },
  {
    code: 'RULE.03',
    title: 'Never conceal unknown compensation or visa data',
    description: 'When a job post omits salary or visa sponsorship, we mark it explicitly as "Not listed" or "Unknown". We never guess or promise guarantees we cannot verify.',
  },
  {
    code: 'RULE.04',
    title: 'Never sell personal search data to third parties',
    description: 'Your career searches, interview recordings, and application history remain private to your session. We do not sell user behavioral data to recruiters or employers.',
  },
];

export function LimitsSection() {
  return (
    <div
      data-ui="limits-section"
      className="w-full rounded-2xl bg-[#0e1015] border border-white/10 text-[#f0f2f7] p-6 sm:p-8 space-y-8 select-none"
    >
      {/* OS Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
          </div>
          <span className="font-mono text-xs text-[#8b92a5] uppercase tracking-wider">
            OPERATING_LIMITS.CONTRACT // WHAT CAREEROS WILL NEVER DO
          </span>
        </div>
        <div className="font-mono text-xs text-rose-400">
          NON-NEGOTIABLE ETHICAL CONSTRAINTS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LIMITS.map((limit) => (
          <div
            key={limit.code}
            className="p-5 rounded-xl bg-[#141720] border border-white/5 space-y-2.5"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-rose-400 font-bold">{limit.code}</span>
              <span className="text-[#8b92a5]">STRICT INVARIANT</span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">
              {limit.title}
            </h4>
            <p className="text-xs sm:text-sm text-[#8b92a5] leading-relaxed">
              {limit.description}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-lg bg-[#141720] border border-white/5 font-mono text-xs text-[#8b92a5] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>Honesty is our core design device. Designed for long-term candidate agency.</span>
        <span className="text-white font-medium">CareerOS Zero-Hype Compact</span>
      </div>
    </div>
  );
}
