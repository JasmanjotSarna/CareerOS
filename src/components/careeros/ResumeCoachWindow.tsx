'use client';

import React from 'react';

export function ResumeCoachWindow() {
  return (
    <div
      className="w-full max-w-5xl mx-auto rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-8 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            strength-engine.os: Resume Intelligence & Interview Coach
          </span>
        </div>
        <div className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
          Dual Module Intelligence
        </div>
      </div>

      {/* Part 1: Resume Intelligence */}
      <div data-ui="resume-coverage-card" className="p-6 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold text-[#edece8]">
              Resume Semantic Coverage: Senior Infrastructure Role
            </h4>
            <p className="text-sm text-[#a6a49c] mt-0.5">
              Target JD: Distributed Systems Engineer • Scanned 48 technical tokens
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-[#2456d6] dark:text-[#4a7cf6]">
              84%
            </span>
            <div className="text-sm">
              <span className="block font-bold text-[#edece8]">Estimated Score</span>
              <span className="text-[#a6a49c]">Source: Parsed</span>
            </div>
          </div>
        </div>

        {/* Keyword Gaps and Tailored Bullets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-[#1e2128] space-y-2">
            <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6]">
              Identified Keyword Gaps (3 Missing)
            </span>
            <div className="space-y-1.5 text-sm text-[#edece8]">
              <p>• Distributed cache eviction (LRU / LFU policies)</p>
              <p>• Concurrency locking (Distributed Redis Redlock)</p>
              <p>• Telemetry traces (OpenTelemetry instrumentation)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1e2128] space-y-2">
            <span className="font-bold text-[#edece8]">
              Suggested Honest Bullet Tailoring
            </span>
            <p className="text-[#a6a49c] leading-relaxed">
              &ldquo;Architected zero-downtime database failover using PostgreSQL replication slots, reducing recovery time objective (RTO) to under 4 seconds during simulated network splits.&rdquo;
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#1e2128] text-sm text-[#a6a49c] flex items-center justify-between">
          <span>Every bullet change is user-approved before export. No hallucinated stats.</span>
          <span className="text-[#edece8] font-medium">Demo data</span>
        </div>
      </div>

      {/* Part 2: AI Interview Coach with Always-Active Acoustic Waveform */}
      <div data-ui="interview-transcript-card" className="p-6 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold text-[#edece8]">
              AI Technical Interview: High-Concurrency System Design
            </h4>
            <p className="text-sm text-[#a6a49c] mt-0.5">
              Session transcript with real-time acoustic speaking evaluation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#2456d6]/20 text-[#2456d6] dark:text-[#4a7cf6] text-sm font-bold">
              Pacing: 142 WPM (Optimal)
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-xl bg-[#1e2128] space-y-1">
            <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6]">Interviewer Probe:</span>
            <p className="leading-relaxed text-[#edece8]">
              &ldquo;If your cache cluster drops connections under sudden traffic bursts, what circuit breaker pattern do you implement to safeguard your underlying database from catastrophic failure?&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1e2128] space-y-1">
            <span className="font-bold text-[#edece8]">Candidate Response (STAR format):</span>
            <p className="leading-relaxed text-[#a6a49c]">
              &ldquo;I configure an exponential backoff circuit breaker with half-open probing. When failure rate exceeds 15% over a 10-second sliding window, requests immediately fall back to pre-rendered stale cache without touching primary SQL instances.&rdquo;
            </p>
          </div>
        </div>

        {/* Animated Waveform Representation: 24 active continuously moving bars */}
        <div className="p-4 rounded-xl bg-[#1e2128] space-y-2">
          <div className="flex justify-between text-sm text-[#a6a49c]">
            <span>Acoustic Waveform Pacing Monitor</span>
            <span className="text-[#2456d6] dark:text-[#4a7cf6] font-medium">Filler word rate: 1.1% (Low)</span>
          </div>
          <div className="h-12 flex items-center justify-between gap-1 px-1">
            {[30, 50, 75, 45, 90, 60, 35, 80, 100, 65, 40, 75, 85, 55, 30, 60, 95, 70, 45, 80, 60, 40, 70, 85].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-[#2456d6] dark:bg-[#4a7cf6] animate-wave-bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i % 12) * 120}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
