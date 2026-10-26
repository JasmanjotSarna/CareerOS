'use client';

import React, { useState } from 'react';

const TAILORED_BULLETS = [
  {
    original: 'Worked on backend services and made database queries faster.',
    tailored: 'Architected 12 microservice endpoints in Go with composite PostgreSQL indexes, reducing p99 API query response times from 340ms to 48ms under peak concurrent load.',
    rationale: 'Replaces generic action verb with quantified p99 latency metric and explicit indexing architecture keywords.',
    atsImpact: '+12% Keyword Match',
  },
  {
    original: 'Created automated tests for the payment workflow.',
    tailored: 'Designed idempotent integration test matrix using Testcontainers and Redis Pub/Sub, preventing distributed race conditions during parallel checkout flows.',
    rationale: 'Surfaces mission-critical distributed systems and idempotency keywords required by Tier-1 rubrics.',
    atsImpact: '+9% Keyword Match',
  },
];

const ROADMAP_SPRINTS = [
  {
    week: 'Weeks 01–03',
    title: 'Distributed Caching & Concurrency Invalidation',
    milestone: 'Implement Redis Redlock cluster with automated TTL eviction benchmarks.',
    status: 'COMPLETE',
  },
  {
    week: 'Weeks 04–06',
    title: 'PostgreSQL Advanced Query Execution Plans',
    milestone: 'Diagnose sequential scans, build partial indexes, and eliminate N+1 join cascades.',
    status: 'IN PROGRESS',
  },
  {
    week: 'Weeks 07–09',
    title: 'High-Concurrency System Design Defense',
    milestone: 'Complete 3 live peer mock defenses on distributed message brokers (Kafka/RabbitMQ).',
    status: 'SCHEDULED',
  },
  {
    week: 'Weeks 10–12',
    title: 'Placement Drive Readiness & ATS Dispatch',
    milestone: 'Finalize ATS-tailored resume variants and enter Tier-1 recruitment drive queues.',
    status: 'SCHEDULED',
  },
];

export function StrengthModuleWindow() {
  const [selectedBullet, setSelectedBullet] = useState(0);

  return (
    <div
      data-ui="strength-module-window"
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
            RESUME_LAB.SYS // QUESTION 03: HOW DO I GET STRONGER?
          </span>
        </div>
        <div className="font-mono text-xs text-[#3b82f6]">
          EXPLAINABLE ATS COVERAGE • 12-WEEK ROADMAP SPRINTS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Resume Intelligence & Bullet Tailoring */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-xs text-[#8b92a5] uppercase block">SEMANTIC ATS SCORE</span>
                <p className="text-sm font-semibold text-white mt-0.5">Distributed Systems Engineer</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-3xl font-extrabold text-[#3b82f6]">78%</span>
                <span className="text-[10px] text-[#8b92a5] block">ESTIMATED</span>
              </div>
            </div>

            {/* Keyword Delta */}
            <div className="space-y-2 text-xs">
              <span className="font-mono text-[#8b92a5] uppercase text-[11px] block">
                PARSED KEYWORD GAPS (3 DETECTED IN TARGET JD)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  ✗ Raft Consensus
                </div>
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  ✗ Redis Redlock
                </div>
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  ✗ OpenTelemetry
                </div>
              </div>
            </div>

            {/* Bullet Tailoring Inspection */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#8b92a5] text-xs uppercase">
                  HONEST BULLET TAILORING [CLICK TO COMPARE]
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  {TAILORED_BULLETS[selectedBullet].atsImpact}
                </span>
              </div>

              <div className="flex gap-2">
                {TAILORED_BULLETS.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedBullet(idx)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      selectedBullet === idx
                        ? 'bg-[#2563eb] text-white font-semibold'
                        : 'bg-[#191c26] text-[#8b92a5] hover:text-white'
                    }`}
                  >
                    EXAMPLE {idx + 1}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-lg bg-[#191c26] border border-white/5 space-y-2 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-[#8b92a5] uppercase block">ORIGINAL BULLET</span>
                  <p className="text-[#8b92a5] line-through mt-0.5">
                    &ldquo;{TAILORED_BULLETS[selectedBullet].original}&rdquo;
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase block font-semibold">
                    TAILORED EVIDENCE BULLET
                  </span>
                  <p className="text-white font-medium leading-relaxed mt-0.5">
                    &ldquo;{TAILORED_BULLETS[selectedBullet].tailored}&rdquo;
                  </p>
                </div>
                <div className="pt-1 text-[11px] text-[#8b92a5] border-t border-white/5">
                  <strong className="text-[#c2c7d6]">Rationale: </strong>
                  {TAILORED_BULLETS[selectedBullet].rationale}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: 12-Week Adaptive Roadmap Milestones */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8b92a5]">
                12-WEEK GAP CLOSURE ROADMAP
              </span>
              <span className="font-mono text-xs text-emerald-400">
                1 OF 4 SPRINTS VERIFIED
              </span>
            </div>

            <div className="space-y-3">
              {ROADMAP_SPRINTS.map((sprint) => (
                <div
                  key={sprint.week}
                  className={`p-3.5 rounded-lg border text-xs transition-all ${
                    sprint.status === 'COMPLETE'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                      : sprint.status === 'IN PROGRESS'
                      ? 'bg-[#2563eb]/10 border-[#2563eb]/40 text-white'
                      : 'bg-[#191c26] border-white/5 text-[#8b92a5]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#8b92a5] text-[11px]">{sprint.week}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        sprint.status === 'COMPLETE'
                          ? 'text-emerald-400'
                          : sprint.status === 'IN PROGRESS'
                          ? 'text-[#3b82f6]'
                          : 'text-[#60677a]'
                      }`}
                    >
                      {sprint.status === 'COMPLETE' ? '✓ VERIFIED' : sprint.status}
                    </span>
                  </div>
                  <p className="font-semibold text-white mt-1 text-sm">{sprint.title}</p>
                  <p className="text-[#8b92a5] text-xs mt-1 leading-relaxed">{sprint.milestone}</p>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded bg-[#101217] font-mono text-[11px] text-[#8b92a5] flex items-center justify-between">
              <span>Sprint milestones adapt dynamically as you solve coding mocks and push commits.</span>
              <span className="text-white">Active Roadmap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
