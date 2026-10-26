'use client';

import React, { useState } from 'react';
import { BootLoaderOverlay } from '@/components/careeros/BootLoaderOverlay';
import { OSDesktopNav } from '@/components/careeros/OSDesktopNav';
import { ContactOverlayPanel, OfferPath } from '@/components/careeros/ContactOverlayPanel';
import { HeroProductWindow } from '@/components/careeros/HeroProductWindow';
import { ProblemSection } from '@/components/careeros/ProblemSection';
import { CareerTimeMachine } from '@/components/careeros/CareerTimeMachine';
import { InteractiveReadinessRadar } from '@/components/careeros/InteractiveReadinessRadar';
import { ModulesGrid } from '@/components/careeros/ModulesGrid';
import { ProductWindowsShowcase } from '@/components/careeros/ProductWindowsShowcase';
import { StraightAnswersSection } from '@/components/careeros/StraightAnswersSection';
import { ThreeWaysToStart } from '@/components/careeros/ThreeWaysToStart';
import { PricingSection } from '@/components/careeros/PricingSection';
import { OSFooter } from '@/components/careeros/OSFooter';

export default function LandingPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [initialContactPath, setInitialContactPath] = useState<OfferPath>('students');

  const handleOpenContact = (path: OfferPath = 'students') => {
    setInitialContactPath(path);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#070B18] text-slate-900 dark:text-[#F8F9FA] font-sans overflow-x-hidden selection:bg-[#4361EE] selection:text-white transition-colors duration-200">
      {/* 1. First-Visit Loader Sequence (Skippable, Product Language) */}
      <BootLoaderOverlay />

      {/* 2. Contact & Access Drawer Panel */}
      <ContactOverlayPanel
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialPath={initialContactPath}
      />

      {/* 3. Sticky Desktop Navigation Bar */}
      <OSDesktopNav onOpenContact={() => handleOpenContact('students')} />

      {/* 4. Main Page Flow */}
      <main className="space-y-28 sm:space-y-36 pt-8 pb-20">
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left 6 Columns: Hero Pitch & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#131D33] border border-slate-200 dark:border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#4361EE] animate-pulse" />
                <span className="text-slate-500 dark:text-[#94A3B8]">CareerOS</span>
                <span className="text-slate-900 dark:text-white font-serif font-bold">From Student to Job-Ready.</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                Your career. <br />
                Your operating system.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-[#94A3B8] leading-relaxed max-w-lg">
                CareerOS finds out where you stand for the role you want, shows exactly what&apos;s missing, builds the path to close it, and gets you ready for the real interview.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => handleOpenContact('students')}
                  className="h-12 px-7 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-lg shadow-[#4361EE]/20"
                >
                  Get early access
                </button>
                <a
                  href="#how-it-works"
                  className="h-12 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-[#131D33] dark:hover:bg-[#1E293B] dark:text-[#E2E8F0] border border-slate-200 dark:border-white/10 font-semibold flex items-center justify-center transition-colors active:scale-[0.98]"
                >
                  See how it works
                </a>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-[#94A3B8]">
                <span>Role Suitability</span>
                <span>•</span>
                <span>Skill Gap Analysis</span>
                <span>•</span>
                <span>Mock Interviews</span>
              </div>
            </div>

            {/* Right 6 Columns: Hero Product Window (62% Readiness, 4 Bars, Missing Skills, Roadmap) */}
            <div className="lg:col-span-6">
              <HeroProductWindow />
            </div>
          </div>
        </section>

        {/* SECTION 1: THE PROBLEM */}
        <ProblemSection />

        {/* SECTION 2: HOW IT WORKS (SIX STEPS + LIVE TIMELINE DEMO) */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6">
          <CareerTimeMachine />
        </section>

        {/* SECTION 2.5: INTERACTIVE READINESS RADAR */}
        <InteractiveReadinessRadar />

        {/* SECTION 3: NINE MODULES + WORKSPACE */}
        <ModulesGrid />

        {/* SECTION 4: PRODUCT VIEWS AS FULL-SIZE WINDOWS */}
        <ProductWindowsShowcase />

        {/* SECTION 5: STRAIGHT ANSWERS */}
        <StraightAnswersSection />

        {/* SECTION 6: THREE WAYS TO START */}
        <ThreeWaysToStart onSelectPath={handleOpenContact} />

        {/* SECTION 7: TRANSPARENT PRICING */}
        <PricingSection onSelectPath={handleOpenContact} />
      </main>

      {/* 5. FOOTER WITH WORDMARK AND REAL CONTACT */}
      <OSFooter onOpenContact={() => handleOpenContact('students')} />
    </div>
  );
}
