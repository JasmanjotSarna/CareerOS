'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { ContactOverlayPanel } from '@/components/careeros/ContactOverlayPanel';
import CareerOSLogo from '@/components/brand/CareerOSLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function CollegesLandingPage() {
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
            <Link href="/colleges" className="text-slate-900 dark:text-white font-semibold">
              For Colleges
            </Link>
            <Link href="/together" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Together
            </Link>
            <a href="#institutional-pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="h-10 px-3 sm:px-5 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-xs sm:text-sm font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow"
            >
              Book Campus Walkthrough
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Placement Cells & Institutional Leadership</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]">
            Transform Campus Placement Outcomes with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-[#4361EE] to-[#FF6B6B]">
              Real-Time Cohort Intelligence.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Move beyond retrospective placement spreadsheets. CareerOS gives Placement Directors and Deans live visibility into student readiness, identifies cohort skill gaps months before campus drives, and automates targeted remedial interventions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-150 active:scale-[0.98]"
            >
              <span>Schedule Institutional Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/faculty/dashboard"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 text-sm font-medium flex items-center justify-center transition-colors"
            >
              Open Placement Portal Preview
            </Link>
          </div>

          {/* Key Cohort Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 text-left">
              <span className="text-xs text-[#94A3B8] font-mono block">Active Cohort</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">842</span>
              <span className="text-[11px] text-emerald-400">Students monitored</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 text-left">
              <span className="text-xs text-[#94A3B8] font-mono block">Cohort Readiness</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">58%</span>
              <span className="text-[11px] text-cyan-400">Benchmark average</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 text-left">
              <span className="text-xs text-[#94A3B8] font-mono block">Early Interventions</span>
              <span className="text-2xl font-bold font-mono text-[#FF6B6B] mt-1 block">113</span>
              <span className="text-[11px] text-rose-300">Flagged &lt; 60 days</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 text-left">
              <span className="text-xs text-[#94A3B8] font-mono block">Verified ATS Scans</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">76%</span>
              <span className="text-[11px] text-violet-300">Passing ATS filters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Capabilities */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            Institutional Suite
          </span>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
            Built for High-Stakes Campus Hiring
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Equip your training and placement department with tools that prevent unplaced student outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Cohort Readiness Tracking</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Drill down by engineering department (CS, IT, ECE, Mechanical) to see aggregate readiness, coding mock performance, and communication fluency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">113-Student Intervention Queue</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Identifies students falling behind readiness thresholds with upcoming recruitment drives. Trigger automated remedial sprints and counselor sessions with a single click.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">Curated Recruiter Shortlists</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              When visiting enterprise recruiters request candidate pools, instantly export verified shortlists filtered by validated skills, ATS resume scores, and interview performance.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Pricing */}
      <section id="institutional-pricing" className="py-16 px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#131D33] border-2 border-indigo-500/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Campus Season Package</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              University Institutional Plan
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Equip your entire graduating batch with individual workspaces, while your placement cell gets cohort-wide analytics, early warnings, and recruiter shortlisting.
            </p>
            <div className="pt-2">
              <span className="font-mono text-3xl font-bold text-white">₹449</span>
              <span className="text-xs text-[#94A3B8]"> + GST per student / 3-month placement season</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="h-12 px-7 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-lg"
            >
              Request Institutional Proposal
            </button>
            <Link
              href="/faculty/dashboard"
              className="h-12 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 text-sm font-medium flex items-center justify-center transition-colors"
            >
              View Faculty Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#070B18] text-center text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CareerOSLogo href="/" size="xs" plate="always" className="shrink-0" />
            <span className="text-white/20">•</span>
            <span>Institutional Placement Intelligence</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/students" className="hover:text-white transition-colors">Students</Link>
            <Link href="/colleges" className="text-white">Colleges</Link>
            <Link href="/together" className="hover:text-white transition-colors">Together</Link>
            <Link href="/faculty/dashboard" className="text-[#4361EE] hover:underline font-semibold">Placement Portal</Link>
          </div>
        </div>
      </footer>

      {/* Contact Overlay Modal */}
      <ContactOverlayPanel isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
