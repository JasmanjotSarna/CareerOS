'use client';

import React from 'react';
import Link from 'next/link';
import { OfferPath } from './ContactOverlayPanel';

interface ThreeWaysToStartProps {
  onSelectPath: (path: OfferPath) => void;
}

export function ThreeWaysToStart({ onSelectPath }: ThreeWaysToStartProps) {
  const paths = [
    {
      id: 'students' as OfferPath,
      name: 'For Students',
      badge: 'Individual Access',
      tagline: 'Self-serve preparation for students and job-seekers.',
      desc: 'Use the complete readiness platform independently. Choose a monthly plan or pay only for the specific assessments and resume reviews you need.',
      features: [
        'Role suitability match against target benchmarks',
        'Personalized 12-week adaptive learning roadmap',
        'AI technical and behavioral mock interview sessions',
        'ATS resume optimization with keyword gap analysis',
        'Job matching with honest unknown tags',
      ],
      ctaText: 'Get early access',
      highlight: false,
    },
    {
      id: 'colleges' as OfferPath,
      name: 'For Colleges',
      badge: 'Placement Departments',
      tagline: 'A readiness programme for final-year cohorts.',
      desc: 'Equip your training and placement cell with institutional analytics, cohort-level skill-gap tracking, and automated intervention flags for at-risk students.',
      features: [
        'Cohort-wide placement readiness dashboard',
        'Readiness breakdown across technical, aptitude & HR',
        'Early-intervention filter for students needing support',
        'Top skill-gap analytics by branch and target role',
        'Unlimited readiness scores and roadmaps for students',
      ],
      ctaText: 'Talk to us about your college',
      highlight: true,
    },
    {
      id: 'together' as OfferPath,
      name: 'Together',
      badge: 'Integrated Rollout',
      tagline: 'A college and its students on one shared system.',
      desc: 'The university provides CareerOS for the entire cohort. Students receive full access to all practice arenas while faculty track aggregate placement readiness.',
      features: [
        'Full student access paired with placement oversight',
        'Curriculum alignment to campus recruitment benchmarks',
        'Dedicated onboarding and faculty orientation sessions',
        'Quarterly cohort improvement and outcome reporting',
        'Priority campus support during active placement drives',
      ],
      ctaText: 'Plan a rollout',
      highlight: false,
    },
  ];

  return (
    <section id="for-students" className="max-w-6xl mx-auto px-6 space-y-12 select-none">
      <div id="for-colleges" className="max-w-3xl space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
          Ways To Start
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
          Three ways to start with CareerOS.
        </h2>
        <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
          Whether you are an individual student preparing for placement season or a university department responsible for an entire cohort.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {paths.map((p) => (
          <div
            key={p.id}
            className={`p-7 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-200 ${
              p.highlight
                ? 'bg-[#131D33] border-2 border-[#4361EE] shadow-xl'
                : 'bg-[#0F172A] border border-white/10 hover:border-white/20'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white">
                  {p.badge}
                </span>
                {p.highlight && (
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#FF6B6B]">
                    Recommended
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-serif font-bold text-white">{p.name}</h3>
                <p className="text-sm font-medium text-[#4361EE]">{p.tagline}</p>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {p.desc}
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] block">
                  Includes:
                </span>
                <ul className="space-y-1.5 text-xs text-[#E2E8F0]">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="text-[#4361EE] font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                href={p.id === 'students' ? '/students' : p.id === 'colleges' ? '/colleges' : '/together'}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-medium text-center text-[#c5cdd9] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Learn more about {p.name.toLowerCase()}</span>
                <span>↗</span>
              </Link>
              <button
                type="button"
                onClick={() => onSelectPath(p.id)}
                className={`w-full py-3 px-5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                  p.highlight
                    ? 'bg-[#4361EE] hover:bg-[#3451db] text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                }`}
              >
                {p.ctaText} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
