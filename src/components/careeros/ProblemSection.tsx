'use client';

import React from 'react';

export function ProblemSection() {
  const studentQuestions = [
    {
      number: '01',
      question: 'Am I actually suitable for this role?',
      detail:
        'Generic placement tests compare you against an arbitrary batch average, not against real role benchmarks for the jobs you actually want.',
    },
    {
      number: '02',
      question: 'Which skills am I missing, and which matter most?',
      detail:
        'A syllabus tells you what to study for exams, but cannot isolate which engineering topics or system fundamentals are blocking you from getting hired.',
    },
    {
      number: '03',
      question: "Is my resume even reaching the recruiter's screen?",
      detail:
        'Without transparent ATS evaluation, students submit applications blind, unaware if parsing errors or missing keywords disqualify them before a human reads them.',
    },
    {
      number: '04',
      question: 'Will I perform in a real technical or HR interview?',
      detail:
        'Writing code in a classroom is very different from explaining tradeoffs, timeboxing edge cases, and answering behavioral questions under live pressure.',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 space-y-12 select-none">
      <div className="max-w-3xl space-y-4">
        <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
          The Personalization Gap
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Placement training exists. Personalization doesn&apos;t.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#94A3B8] leading-relaxed">
          Universities run aptitude training, technical lectures, and resume drives for hundreds of students at once. But placement faculty cannot realistically give every student individualized diagnostic feedback and repeated mock interviews at scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentQuestions.map((item) => (
          <div
            key={item.number}
            className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 space-y-3 transition-colors hover:border-[#4361EE]/40"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#FF6B6B] font-semibold">
                Question {item.number}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4361EE]" />
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white">
              {item.question}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
