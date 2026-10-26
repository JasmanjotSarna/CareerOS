'use client';

import React from 'react';

const MODULES = [
  'COMMAND CENTER',
  'AI CAREER ADVISOR',
  'RESUME INTELLIGENCE',
  'JOB DISCOVERY & MATCHING',
  'APPLICATION KANBAN TRACKER',
  '12-WEEK SKILL ROADMAP',
  'AI INTERVIEW COACH',
  'COHORT READINESS INTELLIGENCE',
];

export function ModuleMarqueeStrip() {
  return (
    <div
      data-ui="module-marquee-strip"
      className="w-full overflow-hidden border-y border-white/10 bg-[#0a0b0e] py-4 select-none"
    >
      <div className="flex w-max animate-marquee text-xs font-mono font-semibold tracking-widest text-[#8b92a5]">
        {/* Render 3 copies for seamless infinite scroll */}
        {[0, 1, 2].map((group) => (
          <div key={group} className="flex items-center space-x-8 pr-8">
            {MODULES.map((mod) => (
              <span key={mod} className="flex items-center space-x-8">
                <span className="hover:text-white transition-colors">{mod}</span>
                <span className="text-[#2563eb] text-sm">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
