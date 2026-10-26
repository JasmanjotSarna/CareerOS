'use client';

import React from 'react';
import Link from 'next/link';
import CareerOSLogo from '@/components/brand/CareerOSLogo';

interface OSFooterProps {
  onOpenContact?: () => void;
}

export function OSFooter({ onOpenContact }: OSFooterProps) {
  return (
    <footer className="relative bg-slate-100 dark:bg-[#070B18] border-t border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F8F9FA] pt-20 pb-16 overflow-hidden select-none transition-colors">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Closing Call To Action: "Find out where you stand." */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0F172A] dark:to-[#131D33] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
              Get Started Today
            </span>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
              Find out where you stand.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Find out where you stand for the role you want, see exactly what is missing, build the path to close the gap, and get ready for the real interview.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenContact}
              className="h-12 px-7 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-lg"
            >
              Get early access
            </button>
            <a
              href="#how-it-works"
              className="h-12 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/15 text-sm font-medium flex items-center justify-center transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Links & Founder Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-5 space-y-3">
            <CareerOSLogo href="/" size="md" imageClassName="h-8" plate="always" />
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] max-w-sm leading-relaxed">
              From Student to Job-Ready. The career management operating system connecting resume optimization, skill gaps, learning roadmaps, and interview preparation.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="font-mono uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
              Platform
            </p>
            <ul className="space-y-1.5 text-slate-600 dark:text-[#94A3B8]">
              <li>
                <Link href="/students" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  For Colleges
                </Link>
              </li>
              <li>
                <Link href="/together" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Together
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Career Workspace
                </Link>
              </li>
              <li>
                <Link href="/app/tracker" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <a href="/#modules" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Readiness Modules
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2 text-xs">
            <p className="font-mono uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
              Contact & Inquiries
            </p>
            <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              For university pilots, demos, and early access inquiries:
            </p>
            <div className="space-y-1 font-mono text-xs pt-1">
              <a
                href="mailto:jasmanjotsinghsarna@gmail.com"
                className="text-[#4361EE] hover:underline block"
              >
                jasmanjotsinghsarna@gmail.com
              </a>
              <a
                href="https://linkedin.com/in/jasmanjot-singh-sarna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white block transition-colors"
              >
                linkedin.com/in/jasmanjot-singh-sarna ↗
              </a>
              <a
                href="https://jasmanjot-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white block transition-colors"
              >
                jasmanjot-portfolio.vercel.app ↗
              </a>
            </div>
          </div>
        </div>

        {/* Full-Width Monument Display Wordmark */}
        <div className="w-full text-center select-none overflow-hidden py-8 border-y border-slate-200 dark:border-white/5">
          <span
            className="text-[14vw] font-serif font-bold tracking-tighter text-slate-900/[0.04] dark:text-white/[0.05] block leading-none hover:text-slate-900/[0.08] dark:hover:text-white/[0.10] transition-colors"
          >
            CAREEROS
          </span>
        </div>

        {/* Bottom Bar: Clean Disclosures */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 dark:text-[#94A3B8] gap-3">
          <span>CareerOS — From Student to Job-Ready.</span>
          <span>Sample data shown for demonstration • Zero fabricated guarantees</span>
        </div>
      </div>
    </footer>
  );
}
