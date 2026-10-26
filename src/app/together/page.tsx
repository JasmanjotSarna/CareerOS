'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { ContactOverlayPanel } from '@/components/careeros/ContactOverlayPanel';
import CareerOSLogo from '@/components/brand/CareerOSLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TogetherLandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#070B18] text-slate-900 dark:text-[#F8F9FA] selection:bg-[#4361EE]/30 selection:text-white transition-colors">
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 select-none">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <CareerOSLogo href="/" size="md" imageClassName="h-6 sm:h-8" plate="always" className="shrink-0" />

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#c5cdd9]">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="/students" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              For Students
            </Link>
            <Link href="/colleges" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              For Colleges
            </Link>
            <Link href="/together" className="text-slate-900 dark:text-white font-semibold">
              Together
            </Link>
            <Link href="/app" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              App Workspace
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="h-10 px-5 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow"
            >
              Plan Campus Rollout
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-[#4361EE]/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4361EE]/10 border border-[#4361EE]/30 text-[#4361EE] font-mono text-xs uppercase tracking-wider">
            <GitMerge className="w-3.5 h-3.5" />
            <span>Integrated Campus Model</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]">
            When Students Prepare and Colleges Guide,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] via-indigo-300 to-[#FF6B6B]">
              Placement Rates Soar.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            The dual-workspace architecture connects student self-paced preparation with university placement leadership. Students get personalized guidance without sacrificing privacy; colleges gain real-time cohort visibility without administrative overhead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/app"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-150 active:scale-[0.98]"
            >
              <span>Explore Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/faculty/dashboard"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 text-sm font-medium flex items-center justify-center transition-colors"
            >
              Explore Placement Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Architecture Visual */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Dual Workspace Design
          </span>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
            Independent Workspaces. Unified Outcomes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Side 1: Student Side */}
          <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4361EE]/10 border border-[#4361EE]/30 flex items-center justify-center text-[#4361EE]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Student Workspace</h3>
                  <span className="text-xs text-[#94A3B8] font-mono">Personal & Self-Serve</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>100% Private</span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Students have complete ownership over their learning journey. Practice notes, raw interview audio, and resume drafts remain strictly private.
            </p>

            <ul className="space-y-2.5 text-xs text-[#c5cdd9]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Benchmark readiness diagnostics for target roles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Personalized weekly roadmap covering skill gaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Simulated AI technical coding & STAR behavioral mocks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live 8-stage personal application tracker</span>
              </li>
            </ul>

            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#4361EE] hover:underline"
            >
              Open student app →
            </Link>
          </div>

          {/* Side 2: Institutional Side */}
          <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Placement Cell Portal</h3>
                  <span className="text-xs text-[#94A3B8] font-mono">Institutional & Strategic</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-xs">
                <Layers className="w-3.5 h-3.5" />
                <span>Aggregate Intel</span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Placement Directors and faculty advisors receive high-level readiness distribution metrics without intruding into individual student study sessions.
            </p>

            <ul className="space-y-2.5 text-xs text-[#c5cdd9]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Batch-wide readiness scores (842 students tracked)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>113-student early intervention queue before drives</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Department-level deficit heatmaps (CS, IT, ECE)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click recruiter-ready candidate shortlists</span>
              </li>
            </ul>

            <Link
              href="/faculty/dashboard"
              className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:underline"
            >
              Open placement portal →
            </Link>
          </div>
        </div>
      </section>

      {/* Rollout Timeline */}
      <section className="py-16 px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-12 space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Rollout Playbook
          </span>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
            3-Stage Campus Placement Season
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white shrink-0">
              01
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-white">Week 1: Cohort Baseline Diagnostic</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Students complete initial 15-minute diagnostic assessments. The placement cell instantly gains a batch-wide baseline map across DSA, SQL, System Design, and Communication.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white shrink-0">
              02
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-white">Weeks 2–6: Remedial Sprints & Mock Arenas</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Students tackle prioritized weekly tasks while the intervention queue automatically flags candidates with upcoming campus drives who need mentor attention.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white shrink-0">
              03
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-white">Weeks 7+: Recruiter Matching & Placement Drives</h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                When enterprise recruiters arrive on campus, placement officers generate validated candidate rosters with verified skill benchmarks, leading to dramatically higher offer conversion.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-10">
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="h-12 px-8 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            Schedule a Rollout Discussion with Our Team
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#070B18] text-center text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CareerOSLogo href="/" size="xs" plate="always" className="shrink-0" />
            <span className="text-white/20">•</span>
            <span>From Student to Job-Ready.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/students" className="hover:text-white transition-colors">Students</Link>
            <Link href="/colleges" className="hover:text-white transition-colors">Colleges</Link>
            <Link href="/together" className="text-white">Together</Link>
            <Link href="/app" className="text-[#4361EE] hover:underline font-semibold">Workspace</Link>
          </div>
        </div>
      </footer>

      {/* Contact Overlay Modal */}
      <ContactOverlayPanel isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
