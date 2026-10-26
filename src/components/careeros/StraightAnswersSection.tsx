'use client';

import React from 'react';

export function StraightAnswersSection() {
  const commitments = [
    {
      title: 'Your resume score is an estimate, never a promise.',
      body: 'Recruiting algorithms and ATS parsers vary between companies. Our scoring provides actionable diagnostic guidance on keyword coverage and structural clarity, not a guaranteed interview call.',
    },
    {
      title: 'We never invent experience, achievements or qualifications.',
      body: 'CareerOS suggests how to frame your real coursework, projects, and metrics more clearly. We never fabricate accomplishments or insert false claims onto your profile.',
    },
    {
      title: 'Anything we cannot verify is marked Unknown.',
      body: 'If a job listing does not state compensation or visa sponsorship, we explicitly label it "Not listed" or "Unknown". We never guess or pretend to know unverified terms.',
    },
    {
      title: 'You review everything before it is used or sent.',
      body: 'No AI agent submits applications on your behalf or sends automated messages to hiring managers without your explicit review and confirmation.',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 space-y-8 select-none">
      <div className="max-w-2xl space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
          Straight Answers
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
          What you can count on from CareerOS.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8]">
          Honesty about how the product works and what it will never do.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commitments.map((item, idx) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 space-y-2.5 transition-colors hover:border-[#4361EE]/40 shadow-xs dark:shadow-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#FF6B6B]">0{idx + 1}</span>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">{item.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed pl-6">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
