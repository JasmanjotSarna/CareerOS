'use client';

import React from 'react';
import Link from 'next/link';
import { OfferPath } from './ContactOverlayPanel';

interface ThreeOfferPathsProps {
  onSelectPath: (path: OfferPath) => void;
}

export function ThreeOfferPaths({ onSelectPath }: ThreeOfferPathsProps) {
  return (
    <div data-ui="three-offer-paths" className="w-full space-y-8 select-none">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-wider text-[#2563eb] block mb-2">
          ARCHITECTURE // THREE OFFER PATHS
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
          Three paths. Built for autonomy and cohort scale.
        </h2>
        <p className="mt-3 text-base text-[#8b92a5] leading-relaxed">
          CareerOS is not locked into any single institution. Choose self-serve individual acceleration, institutional placement supervision, or both united.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Path 1: For Students */}
        <div className="p-7 rounded-2xl bg-[#0e1015] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#8b92a5]">PATHWAY 01</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                INDIVIDUAL AUTONOMY
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">For Students & Graduates</h3>

            <p className="text-sm text-[#8b92a5] leading-relaxed">
              Self-serve career operating system for individuals, university seniors, career switchers, and candidates targeting overseas relocation.
            </p>

            <ul className="space-y-2.5 text-xs text-[#c2c7d6] pt-2 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Private profile — zero institutional monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Explainable ATS resume tailoring & gap analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Unlimited AI Interview Coach audio simulations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Full international listings with visa transparency</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectPath('students')}
            className="w-full py-3 px-5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm font-mono tracking-wider transition-colors active:scale-[0.98]"
          >
            GET EARLY ACCESS →
          </button>
        </div>

        {/* Path 2: For Colleges */}
        <div className="p-7 rounded-2xl bg-[#0e1015] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#8b92a5]">PATHWAY 02</span>
              <span className="px-2 py-0.5 rounded bg-[#2563eb]/20 text-[#3b82f6] font-semibold">
                INSTITUTIONAL
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">For Colleges & Universities</h3>

            <p className="text-sm text-[#8b92a5] leading-relaxed">
              A command center for university placement cells and career deans to supervise cohort readiness, verify skills, and target drive interventions.
            </p>

            <ul className="space-y-2.5 text-xs text-[#c2c7d6] pt-2 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-[#3b82f6] font-bold">✓</span>
                <span>Cohort-level readiness distribution metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3b82f6] font-bold">✓</span>
                <span>At-risk student diagnostic warnings [Planned]</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3b82f6] font-bold">✓</span>
                <span>Recruitment drive slotting & eligibility filters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3b82f6] font-bold">✓</span>
                <span>Curriculum-to-industry gap benchmarking</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link
              href="/colleges"
              className="w-full py-3 px-5 rounded-xl bg-[#171a22] hover:bg-[#1f232e] text-white border border-white/10 font-semibold text-sm font-mono tracking-wider transition-colors flex items-center justify-center"
            >
              EXPLORE FOR COLLEGES →
            </Link>
          </div>
        </div>

        {/* Path 3: Together */}
        <div className="p-7 rounded-2xl bg-[#0e1015] border border-[#2563eb]/40 hover:border-[#2563eb]/70 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#8b92a5]">PATHWAY 03</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold">
                SYNERGISTIC
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">Together: Campus Rollout</h3>

            <p className="text-sm text-[#8b92a5] leading-relaxed">
              A college and its students connected together. Students retain complete autonomy over private interview records while the placement office views cohort health.
            </p>

            <ul className="space-y-2.5 text-xs text-[#c2c7d6] pt-2 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Dual privacy boundaries — zero student surveillance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Verified recruiter direct pipelines for the university</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Automated interview transcripts & ATS score tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Dedicated rollout engineering & custom LMS sync</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link
              href="/together"
              className="w-full py-3 px-5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm font-mono tracking-wider transition-colors flex items-center justify-center"
            >
              PLAN A CAMPUS ROLLOUT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
