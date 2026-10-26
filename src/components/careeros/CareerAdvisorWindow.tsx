'use client';

import React, { useState } from 'react';

const PATHWAYS = [
  {
    title: 'Systems & Infrastructure Engineer',
    fit: 86,
    alignment: 'Strong fit with current TypeScript and Docker stack',
    marketDemand: 'High (Estimated 1,840 quarterly postings)',
    salaryRange: '$120,000 – $155,000 (Market benchmark)',
    rampTime: '4–6 weeks to close Redis concurrency gap',
    evidence: 'Calculated from 14 verified repository submissions',
  },
  {
    title: 'Cloud Solutions Architect',
    fit: 79,
    alignment: 'Moderate fit; requires multi-region Terraform IaC depth',
    marketDemand: 'Very High (Estimated 2,420 quarterly postings)',
    salaryRange: '$135,000 – $170,000 (Market benchmark)',
    rampTime: '8–10 weeks to build production AWS topology',
    evidence: 'Estimated based on syllabus & project portfolio',
  },
  {
    title: 'Data & Analytics Engineer',
    fit: 82,
    alignment: 'Good fit with SQL windowing and Python pipeline base',
    marketDemand: 'Steady (Estimated 1,410 quarterly postings)',
    salaryRange: '$115,000 – $145,000 (Market benchmark)',
    rampTime: '6 weeks to master PySpark partition tuning',
    evidence: 'Measured via automated code evaluation mocks',
  },
  {
    title: 'Site Reliability Engineer (SRE)',
    fit: 74,
    alignment: 'Foundational; needs Prometheus observability & on-call drill',
    marketDemand: 'Moderate (Estimated 920 quarterly postings)',
    salaryRange: '$130,000 – $165,000 (Market benchmark)',
    rampTime: '10–12 weeks to simulate incident mitigation',
    evidence: 'Estimated from systems testing performance',
  },
];

export function CareerAdvisorWindow() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = PATHWAYS[selectedIdx];

  return (
    <div
      className="w-full max-w-5xl mx-auto rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-6 select-none"
    >
      {/* OS Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            advisor.sys: Career Path Multiverse Analyzer
          </span>
        </div>
        <div className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
          4 pathways analyzed • Zero hype
        </div>
      </div>

      {/* Pathway Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PATHWAYS.map((p, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={p.title}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`p-3.5 rounded-xl text-left transition-colors active:scale-[0.97] min-h-[56px] flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                  : 'bg-[#262a34] text-[#edece8] hover:bg-[#2e3340] dark:bg-[#22252e]'
              }`}
            >
              <span className="font-semibold text-sm leading-snug">{p.title}</span>
              <div className="flex items-baseline justify-between mt-2 text-sm">
                <span className={isSelected ? 'text-white/80' : 'text-[#a6a49c]'}>Fit Index</span>
                <span className="font-bold text-base">{p.fit}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pathway Deep Diagnostic */}
      <div className="p-6 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-[#edece8]">{active.title}</p>
            <p className="text-sm text-[#a6a49c] mt-0.5">{active.alignment}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-[#2456d6] dark:text-[#4a7cf6]">
              {active.fit}%
            </span>
            <p className="text-sm text-[#a6a49c]">Estimated suitability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm">
          <div className="p-3.5 rounded-lg bg-[#1e2128]">
            <p className="text-[#a6a49c]">Market Demand</p>
            <p className="font-bold text-[#edece8] mt-1">{active.marketDemand}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#1e2128]">
            <p className="text-[#a6a49c]">Salary Trajectory</p>
            <p className="font-bold text-[#edece8] mt-1">{active.salaryRange}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#1e2128]">
            <p className="text-[#a6a49c]">Targeted Ramp Time</p>
            <p className="font-bold text-[#2456d6] dark:text-[#4a7cf6] mt-1">{active.rampTime}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#1e2128] text-sm flex items-center justify-between text-[#a6a49c]">
          <span>Assessment basis: {active.evidence}.</span>
          <span className="text-[#edece8] font-medium">Sample profile</span>
        </div>
      </div>
    </div>
  );
}
