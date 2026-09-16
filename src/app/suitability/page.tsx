'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Briefcase, 
  Bot,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { soundFX } from '@/components/effects/SoundFX';

export default function SuitabilityPage() {
  const { activeTargetRole, targetRoles, setTargetRole, suitability } = useApp();

  const facetList = [
    { label: 'Technical Skills Proficiency', score: suitability.breakdown.skills, weight: '45% weight' },
    { label: 'Project Depth & Complexity', score: suitability.breakdown.projects, weight: '20% weight' },
    { label: 'Education & Academic Alignment', score: suitability.breakdown.education, weight: '15% weight' },
    { label: 'Internship & Practical Experience', score: suitability.breakdown.experience, weight: '10% weight' },
    { label: 'ATS Resume Keyword Matching', score: suitability.breakdown.resume, weight: '10% weight' },
  ];

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <StudentSidebar />

        <main className="flex-1 p-5 sm:p-7 space-y-6 overflow-y-auto">
          {/* Header with Evaluated Role Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1e293b]/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Market Fit Diagnostics
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Deterministic Vector Matching</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Role Suitability Analysis
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Continuous AI benchmarking of your verified competencies against industry hiring rubrics.
              </p>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center gap-2 bg-[#111724] border border-[#1e293b] px-3 py-1.5 rounded-lg text-xs">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Benchmark Role</span>
                <select
                  value={activeTargetRole.id}
                  onChange={(e) => {
                    soundFX.playClick();
                    setTargetRole(e.target.value);
                  }}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {targetRoles.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#111724] text-white">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Top Banner: SDE-1 78% Match & 5-Vector Breakdown */}
          <div className="p-6 rounded-xl bg-[#111724] border border-[#1e293b] relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Overall Match Card */}
              <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#1e293b] pb-6 md:pb-0 md:pr-6">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                  Overall Vector Match
                </span>
                <div className="text-5xl sm:text-6xl font-black font-mono text-cyan-400">
                  {suitability.overallMatch}%
                </div>
                <div className="text-xs text-slate-300">
                  Target: <strong className="text-white font-semibold">{activeTargetRole.title}</strong>
                </div>
                <div>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    Strong Placement Contender
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Salary benchmark: <span className="font-mono text-slate-300">{activeTargetRole.salaryRange}</span>
                </p>
              </div>

              {/* Right Column: 5 Alignment Vectors */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                  <span>Evaluation Vector</span>
                  <span>Benchmark Match</span>
                </div>
                {facetList.map((facet) => (
                  <div key={facet.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        {facet.label} <span className="text-[10px] text-slate-500 font-mono">({facet.weight})</span>
                      </span>
                      <span className="font-mono font-bold text-cyan-400">{facet.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#161f30] rounded-full overflow-hidden border border-[#1e293b]">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700"
                        style={{ width: `${facet.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Synthesized Match Explanation */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#0c1524] via-[#111724] to-[#120f26] border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 font-mono">
                CareerOS AI Match Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {suitability.aiSummary}
            </p>
            <div className="text-xs font-semibold text-emerald-300 pt-1 flex items-center gap-1.5">
              <span>💡</span>
              <span>{suitability.improvementTip}</span>
            </div>
          </div>

          {/* Strong Matches vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Strong Matches */}
            <div className="p-5 rounded-xl bg-[#111724] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Verified Strong Matches</h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {suitability.strongMatches.length} Core Skills Met
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                You satisfy or exceed the target hiring bar for these technical proficiencies:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {suitability.strongMatches.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-medium"
                  >
                    <span>✓</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills / Deficits */}
            <div className="p-5 rounded-xl bg-[#111724] border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h3 className="font-bold text-white text-sm">Missing Skills & Deficits</h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40">
                  {suitability.missingSkills.length} Deficits Flagged
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Closing these qualification gaps will immediately unlock round 1 technical shortlisting:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {suitability.missingSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-medium"
                  >
                    <span>⚠</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer Callout */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#111724] border border-[#1e293b] gap-4">
            <div>
              <h4 className="text-xs font-bold text-white">Ready to close these skill gaps?</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                CareerOS has auto-generated a targeted 4-week roadmap based on this suitability analysis.
              </p>
            </div>
            <Link
              href="/roadmap"
              onMouseEnter={() => soundFX.playHover()}
              onClick={() => soundFX.playClick()}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <span>Open My AI Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
