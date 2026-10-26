'use client';

import React from 'react';

export function ModulesGrid() {
  const modules = [
    {
      id: '01',
      title: 'Job Suitability',
      subtitle: 'Match your profile to a target role',
      desc: 'Compares your academic background, verified projects, and skills directly against benchmark expectations for roles like SDE-1, Data Analyst, and Product Analyst.',
    },
    {
      id: '02',
      title: 'Skill Gap Analysis',
      subtitle: "See exactly what's missing, ranked by what matters most",
      desc: 'Isolates high-priority technical and domain gaps so you know whether missing SQL indexing or distributed caching is what stands between you and an offer.',
    },
    {
      id: '03',
      title: 'Personalized Roadmap',
      subtitle: 'A learning path built for your gap',
      desc: 'Transforms identified deficiencies into an actionable, sequenced weekly curriculum with concrete milestones and practice tasks.',
    },
    {
      id: '04',
      title: 'ATS Resume Optimization',
      subtitle: 'A resume tuned for the job (score is an estimate, never a guarantee)',
      desc: 'Analyzes keyword match density and formatting parsing against real job descriptions. Clear suggestions to improve bullet points without fabricating achievements.',
    },
    {
      id: '05',
      title: 'AI Technical Interview',
      subtitle: 'Adaptive, role-specific practice',
      desc: 'Role-specific live technical rounds with detailed evaluation across algorithmic correctness, code communication, time management, and edge-case handling.',
    },
    {
      id: '06',
      title: 'AI HR Interview',
      subtitle: 'Behavioural and fit-based practice',
      desc: 'Master behavioral questioning using the STAR framework (Situation, Task, Action, Result) with structured feedback on answer depth and clarity.',
    },
    {
      id: '07',
      title: 'Aptitude Preparation',
      subtitle: 'DSA and reasoning readiness checks',
      desc: 'Timed assessment rounds covering quantitative problem-solving, logical reasoning, and fundamental data structure patterns required for placement screening.',
    },
    {
      id: '08',
      title: 'Speaking & Communication',
      subtitle: 'Feedback on fluency, clarity and delivery',
      desc: 'Evaluates your verbal delivery speed (words per minute), cadence consistency, filler word count, and structured technical articulation.',
    },
    {
      id: '09',
      title: 'Progress Tracking',
      subtitle: 'One score, continuously updated',
      desc: 'A single, unified readiness gauge across Technical, Aptitude, Communication, and HR dimensions that recalculates whenever you complete tasks.',
    },
  ];

  const workspaceFeatures = [
    {
      name: 'Career Command Center',
      desc: "Daily prioritized actions with the explicit reason behind each move, eliminating guessing about what to study today.",
    },
    {
      name: 'Job & Internship Matching',
      desc: 'Clear match scores with transparent requirement overlap and honest "Unknown" tags where compensation or sponsorship is not disclosed.',
    },
    {
      name: 'Application Tracker',
      desc: 'Full lifecycle stage tracking (Saved, Preparing, Applied, Assessment, Interview, Offer, Rejected, Withdrawn) in one unified dashboard.',
    },
  ];

  return (
    <section id="modules" className="max-w-6xl mx-auto px-6 space-y-12 select-none">
      <div className="max-w-3xl space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
          Platform Architecture
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Nine modules. One readiness engine.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#94A3B8] leading-relaxed">
          Every part of CareerOS is interconnected. Completing a coding drill updates your skill gap, adjusts your learning roadmap, and directly recalculates your overall readiness score.
        </p>
      </div>

      {/* 9 Modules 3x3 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 space-y-3 transition-all duration-200 hover:border-[#4361EE]/40 hover:bg-slate-100/80 dark:hover:bg-[#131D33]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#FF6B6B] font-bold">
                {m.id}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4361EE]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">{m.title}</h3>
              <p className="text-xs font-medium text-[#4361EE]">{m.subtitle}</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed pt-1">
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Workspace Layer */}
      <div className="p-7 sm:p-8 rounded-2xl bg-slate-100 dark:bg-[#0B132B] border border-slate-200 dark:border-white/10 space-y-6">
        <div className="max-w-2xl space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            The Workspace Layer
          </span>
          <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Everything organized around your daily workflow.
          </h3>
          <p className="text-sm text-slate-600 dark:text-[#94A3B8]">
            Beyond individual practice arenas, CareerOS provides a persistent student workspace to manage your job search from first profile to final offer letter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {workspaceFeatures.map((wf) => (
            <div key={wf.name} className="p-5 rounded-xl bg-white dark:bg-[#1E293B]/50 border border-slate-200 dark:border-white/5 space-y-2 shadow-sm dark:shadow-none">
              <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white">{wf.name}</h4>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">{wf.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
