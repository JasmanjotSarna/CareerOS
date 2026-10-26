'use client';

import React, { useState } from 'react';

interface AuditItem {
  metric: string;
  score: string;
  confidence: string;
  source: string;
  evidence: string;
  reasoning: string;
}

const AUDIT_ITEMS: AuditItem[] = [
  {
    metric: 'Data Structures & Algorithms',
    score: '88 / 100',
    confidence: '94% (High)',
    source: 'CBT Session #104 & Live Code Studio',
    evidence: 'Solved 42 of 45 problems under 25-minute test limits. 0 memory leaks.',
    reasoning: 'Optimal O(V+E) time complexity demonstrated in Dijkstra and topological sort implementations. Deducted 12 points for suboptimal memory overhead in recursive tree traversal.',
  },
  {
    metric: 'Acoustic Speaking & English Fluency',
    score: '92 / 100',
    confidence: '91% (High)',
    source: 'BET Behavioral Mock #8',
    evidence: 'Audio recording duration: 04m 20s. Words per minute: 142. Filler word count: 3 (1.2%).',
    reasoning: 'Meets tier-1 recruiter speech benchmarks. Consistent vocal pitch modulation with complete STAR structured narrative.',
  },
  {
    metric: 'System Architecture & Concurrency',
    score: '78 / 100',
    confidence: '86% (Good)',
    source: 'Faculty Technical Review & GitHub Repos',
    evidence: 'Repository: careeros-sync-engine. Commit: 9b2d84f. 12 integration tests passing.',
    reasoning: 'Demonstrated solid Redis Pub/Sub event architecture. Scored down on missing distributed lock lease renewal during network partitions.',
  },
  {
    metric: 'ATS Keyword Match & Industry Formatting',
    score: '84 / 100',
    confidence: '96% (Very High)',
    source: 'Resume Synthesis Engine v4',
    evidence: 'Extracted 31 technical tokens against 40 top-tier SDE-1 job specifications.',
    reasoning: 'Clear quantification of engineering impact across all project sections. Identified 3 missing domain tokens in distributed tracing.',
  },
];

export function EvidenceAuditTrace() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = AUDIT_ITEMS[selectedIdx] || AUDIT_ITEMS[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="max-w-2xl">
        <h3 className="text-3xl sm:text-4xl font-serif text-[#26251e] dark:text-[#edece8] leading-tight">
          Every score backed by evidence and confidence.
        </h3>
        <p className="mt-3 text-base text-[#5f5d55] dark:text-[#a6a49c] leading-relaxed">
          No black-box recommendations. CareerOS links every readiness metric to actual student code submissions, acoustic waveforms, and syllabus rubrics, providing full transparency for students and placement faculty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Metric Selector Column */}
        <div className="lg:col-span-5 space-y-2">
          {AUDIT_ITEMS.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={item.metric}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-full min-h-[56px] p-4 rounded-xl text-left transition-colors flex items-center justify-between active:scale-[0.97] ${
                  isSelected
                    ? 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                    : 'bg-[#f2f1ed] text-[#26251e] hover:bg-[#e6e5e1] dark:bg-[#24231f] dark:text-[#edece8] dark:hover:bg-[#2d2c27]'
                }`}
              >
                <div>
                  <p className="font-semibold text-xs leading-snug">{item.metric}</p>
                  <p className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#5f5d55] dark:text-[#a6a49c]'}`}>
                    {item.source}
                  </p>
                </div>
                <span className="font-bold text-sm ml-2 flex-shrink-0">{item.score}</span>
              </button>
            );
          })}
        </div>

        {/* Audit Evidence Card */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-[#f2f1ed] dark:bg-[#24231f] space-y-6 text-xs">
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-[11px] text-[#5f5d55] dark:text-[#a6a49c]">VERIFIED AUDIT RECORD</p>
              <h4 className="text-xl font-bold text-[#26251e] dark:text-[#edece8] mt-0.5">
                {active.metric}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#2456d6] dark:text-[#4a7cf6]">
                {active.score}
              </span>
              <p className="text-[11px] text-[#5f5d55] dark:text-[#a6a49c]">Confidence: {active.confidence}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#e6e5e1] dark:bg-[#2d2c27] space-y-1">
              <span className="font-bold text-[#5f5d55] dark:text-[#a6a49c] uppercase tracking-wider text-[11px]">
                Concrete Source Evidence
              </span>
              <p className="text-[#26251e] dark:text-[#edece8] leading-relaxed">
                {active.evidence}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#e6e5e1] dark:bg-[#2d2c27] space-y-1">
              <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6] uppercase tracking-wider text-[11px]">
                Transparent Reasoning & Scoring Rationale
              </span>
              <p className="text-[#26251e] dark:text-[#edece8] leading-relaxed">
                {active.reasoning}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#5f5d55] dark:text-[#a6a49c] pt-2">
            Audit cryptographic signature: sha256:7f01a8c9b4e2. Illustrative data.
          </div>
        </div>
      </div>
    </div>
  );
}
