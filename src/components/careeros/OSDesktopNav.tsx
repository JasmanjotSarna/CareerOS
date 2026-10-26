'use client';

import React from 'react';
import Link from 'next/link';
import CareerOSLogo from '@/components/brand/CareerOSLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface OSDesktopNavProps {
  onOpenContact: () => void;
}

export function OSDesktopNav({ onOpenContact }: OSDesktopNavProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors select-none">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <CareerOSLogo href="/" size="md" imageClassName="h-6 sm:h-8" className="shrink-0" />

        {/* Primary Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#c5cdd9]">
          <a href="/#modules" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Modules
          </a>
          <a href="/#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            How it works
          </a>
          <Link href="/students" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            For students
          </Link>
          <Link href="/colleges" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            For colleges
          </Link>
          <Link href="/together" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Together
          </Link>
          <a href="/#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        {/* Primary CTAs + Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/app"
            className="hidden sm:inline-flex h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white border border-slate-200 dark:border-white/10 text-sm font-medium items-center justify-center transition-colors"
          >
            Open App
          </Link>
          <button
            type="button"
            onClick={onOpenContact}
            className="h-10 px-5 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-sm font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow"
          >
            Get early access
          </button>
        </div>
      </nav>
    </header>
  );
}
