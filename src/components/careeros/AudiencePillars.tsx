'use client';

import React from 'react';

const AUDIENCES = [
  {
    target: 'Final-Year Students',
    challenge: 'Uncertain how campus coursework matches industry job rubrics.',
    solution: 'Maps university syllabus directly to real recruitment benchmarks and generates explainable gap roadmaps.',
  },
  {
    target: 'Fresh Graduates',
    challenge: 'Struggling to pass initial ATS filters without 3+ years of commercial experience.',
    solution: 'Tailors honest project-based evidence showing system design depth and verified code benchmarks.',
  },
  {
    target: 'Early-Career Engineers',
    challenge: 'Aiming for senior and staff-level promotion criteria without feedback loops.',
    solution: 'Identifies architectural competency deltas and coordinates live technical design defenses.',
  },
  {
    target: 'Career Switchers',
    challenge: 'Translating non-traditional background skills into engineering and product terms.',
    solution: 'Calculates adjacent skill bridges and sequences high-impact portfolio sprints to de-risk transitions.',
  },
  {
    target: 'Candidates Looking Abroad',
    challenge: 'Confused by undisclosed visa sponsorship criteria and international job norms.',
    solution: 'Explicitly filters listings with verified visa sponsorship while highlighting missing requirements upfront.',
  },
];

export function AudiencePillars() {
  return (
    <div
      className="w-full max-w-5xl mx-auto rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            user-profiles.sys: Five Candidate Realities
          </span>
        </div>
        <div className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
          Targeted pathways
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AUDIENCES.map((aud) => (
          <div
            key={aud.target}
            className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-2 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-base font-bold text-[#edece8]">{aud.target}</h4>
              <p className="text-sm text-[#a6a49c] mt-1 font-medium">
                Challenge: {aud.challenge}
              </p>
            </div>
            <p className="text-sm text-[#a6a49c] leading-relaxed pt-2">
              <strong className="text-[#edece8]">CareerOS Solution: </strong>
              {aud.solution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
