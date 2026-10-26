'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Sparkles,
  FileCheck,
  Code2,
  Users2,
  Columns3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  ShieldCheck,
  Zap,
  BookOpen,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { ContactOverlayPanel } from '@/components/careeros/ContactOverlayPanel';
import CareerOSLogo from '@/components/brand/CareerOSLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function StudentsLandingPage() {
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
            <Link href="/students" className="text-slate-900 dark:text-white font-semibold">
              For Students
            </Link>
            <Link href="/colleges" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              For Colleges
            </Link>
            <Link href="/together" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Together
            </Link>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/app"
              className="h-10 px-5 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow"
            >
              Launch Workspace
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-[#4361EE]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4361EE]/10 border border-[#4361EE]/30 text-[#4361EE] font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student & Early-Career Workspace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]">
            From Student to Job-Ready.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] via-indigo-300 to-[#FF6B6B]">
              Every Step Mapped.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Stop guessing what recruiters want. CareerOS compares your profile against current market benchmarks, gives you a step-by-step weekly roadmap to close skill gaps, scores your resume for ATS parsers, and simulates real technical and HR interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/app"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-150 active:scale-[0.98]"
            >
              <span>Open Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/suitability"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 text-sm font-medium flex items-center justify-center transition-colors"
            >
              Check Role Suitability (Free)
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8] font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Student Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Benchmark Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live ATS Parsing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Step Student Lifecycle */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            End-To-End Journey
          </span>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
            The 6 Pillars of Placement Preparation
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Everything connects directly into one central dashboard. When your skills grow, your readiness score updates instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#4361EE]/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#4361EE]/10 border border-[#4361EE]/30 flex items-center justify-center text-[#4361EE]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">1. Target Role Suitability</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Select your goal role (e.g., SDE-1, Data Analyst, Cloud DevOps). CareerOS evaluates your profile against benchmark hiring bars and gives you an exact readiness breakdown.
            </p>
            <Link href="/suitability" className="inline-flex items-center gap-1.5 text-xs text-[#4361EE] hover:underline font-mono">
              Test suitability →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#4361EE]/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">2. Skill Gap Roadmap</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Never get stuck wondering what to learn next. Receive an adaptive weekly roadmap that prioritizes your biggest skill deficits with curated practice tasks.
            </p>
            <Link href="/roadmap" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-mono">
              Explore roadmap →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#4361EE]/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/30 flex items-center justify-center text-violet-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">3. ATS Resume Optimizer</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Upload your PDF resume to see how real ATS scanners parse it. Get targeted bullet point suggestions and critical missing keywords before you apply.
            </p>
            <Link href="/resume" className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:underline font-mono">
              Scan resume →
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#4361EE]/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">4. Technical Interview Arena</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Practice live data structure and algorithmic coding problems in an interactive editor. Get real-time feedback on time complexity, edge cases, and code structure.
            </p>
            <Link href="/interviews/technical" className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-mono">
              Start coding mock →
            </Link>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#4361EE]/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B]">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">5. Behavioral & HR Mock Studio</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Master the STAR technique (Situation, Task, Action, Result) with structured voice and text questions tailored to team collaboration and leadership.
            </p>
            <Link href="/interviews/hr" className="inline-flex items-center gap-1.5 text-xs text-[#FF6B6B] hover:underline font-mono">
              Practice HR questions →
            </Link>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#4361EE]/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Columns3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">6. Application Lifecycle Tracker</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Organize every application across 8 distinct stages: Saved, Preparing, Applied, Assessment, Interview, Offer, Rejected, and Withdrawn. Never miss a follow-up.
            </p>
            <Link href="/app/tracker" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-mono">
              View Kanban board →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Transparent Student Pricing
          </span>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
            Accessible for Every Student
          </h2>
          <p className="text-sm text-[#94A3B8]">
            No predatory commitments. Cancel anytime or pay per mock session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Card: Monthly Plan */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#131D33] border-2 border-[#4361EE] relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#4361EE] text-white font-mono text-[10px] uppercase font-bold tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-serif font-bold text-white">Full Student Access</h3>
                <span className="font-mono text-2xl font-bold text-white">₹349<span className="text-xs text-[#94A3B8] font-normal"> / mo</span></span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Complete suite for continuous readiness improvement during placement season.
              </p>

              <ul className="space-y-2.5 text-xs text-[#c5cdd9] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited role suitability diagnostics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Weekly adaptive skill roadmap</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full ATS resume scanner & bullet optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI technical coding and HR mock rounds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>8-stage application tracking board</span>
                </li>
              </ul>
            </div>

            <Link
              href="/app"
              className="w-full h-11 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-xs font-semibold flex items-center justify-center transition-colors"
            >
              Get Started Now
            </Link>
          </div>

          {/* Card: Pay-Per-Mock */}
          <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-serif font-bold text-white">Pay-Per-Interview</h3>
                <span className="font-mono text-2xl font-bold text-white">₹99<span className="text-xs text-[#94A3B8] font-normal"> / mock</span></span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                For students who only need targeted interview simulations before an upcoming round.
              </p>

              <ul className="space-y-2.5 text-xs text-[#c5cdd9] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Full AI Mock Session (Technical or HR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Detailed rubric breakdown & score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full verbatim transcript & improvement notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No monthly subscription required</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold flex items-center justify-center transition-colors"
            >
              Purchase Mock Credits
            </button>
          </div>
        </div>
      </section>

      {/* Student FAQ */}
      <section className="py-16 px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-10 space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#4361EE]" />
              Is my interview and resume data shared with my college?
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              No. Your personal notes, resume revisions, practice mock transcripts, and audio recordings remain strictly confidential to you. When colleges subscribe to an institutional cohort, placement directors only see aggregated cohort statistics and overall readiness metrics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#4361EE]" />
              Can I use CareerOS independently if my college hasn't partnered yet?
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Yes, absolutely. CareerOS is fully self-serve for individual students and early-career job seekers. You can create an account, check role suitability, scan resumes, and practice interviews immediately.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#4361EE]" />
              How is my readiness score calculated?
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Readiness scores are calculated across four weighted dimensions: Technical Aptitude, Resume ATS Keyword Alignment, Communication & Behavioral Delivery, and Problem Solving speed. Each dimension is benchmarked against real job descriptions for your chosen role.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <footer className="py-12 border-t border-white/10 bg-[#070B18] text-center text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CareerOSLogo href="/" size="xs" plate="always" className="shrink-0" />
            <span className="text-white/20">•</span>
            <span>From Student to Job-Ready.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/students" className="text-white">Students</Link>
            <Link href="/colleges" className="hover:text-white transition-colors">Colleges</Link>
            <Link href="/together" className="hover:text-white transition-colors">Together</Link>
            <Link href="/app" className="text-[#4361EE] hover:underline font-semibold">Open App</Link>
          </div>
        </div>
      </footer>

      {/* Contact Overlay Modal */}
      <ContactOverlayPanel isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
