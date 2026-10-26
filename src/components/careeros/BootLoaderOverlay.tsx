'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import CareerOSLogo from '@/components/brand/CareerOSLogo';

const STATUS_LINES = [
  { id: '01', text: 'Reading your resume' },
  { id: '02', text: 'Matching you to roles' },
  { id: '03', text: 'Finding skill gaps' },
  { id: '04', text: 'Building your roadmap' },
  { id: '05', text: 'Ready.' },
];

interface BootLoaderOverlayProps {
  onBootFinish?: () => void;
}

export function BootLoaderOverlay({ onBootFinish }: BootLoaderOverlayProps) {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolvedLines, setResolvedLines] = useState<number>(0);
  const [isWiping, setIsWiping] = useState(false);

  const completeBoot = useCallback(() => {
    setIsWiping(true);
    try {
      sessionStorage.setItem('careeros_boot_completed', 'true');
    } catch {
      // safe fallback
    }
    setTimeout(() => {
      setActive(false);
      onBootFinish?.();
    }, 500);
  }, [onBootFinish]);

  useEffect(() => {
    try {
      const already = sessionStorage.getItem('careeros_boot_completed');
      if (already === 'true') {
        return;
      }
    } catch {
      // safe fallback
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const mountTimer = setTimeout(() => {
      setActive(true);
    }, 0);

    let fontReady = false;
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontReady = true;
      });
    } else {
      fontReady = true;
    }

    const startTime = performance.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      const effectivePct = !fontReady && rawPct > 85 ? 85 : rawPct;
      setProgress(effectivePct);

      if (effectivePct < 20) setResolvedLines(0);
      else if (effectivePct < 40) setResolvedLines(1);
      else if (effectivePct < 65) setResolvedLines(2);
      else if (effectivePct < 88) setResolvedLines(3);
      else if (effectivePct < 100) setResolvedLines(4);
      else {
        setResolvedLines(5);
        clearInterval(interval);
        setTimeout(() => {
          completeBoot();
        }, 350);
      }
    }, 30);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        completeBoot();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(interval);
      window.removeEventListener('keydown', handleKey);
    };
  }, [completeBoot]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-label="CareerOS Loading"
      onClick={completeBoot}
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-white/95 dark:bg-[#070B18]/95 text-slate-900 dark:text-[#F8F9FA] backdrop-blur-2xl p-6 sm:p-12 cursor-pointer select-none transition-all duration-500 ease-out ${
        isWiping ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      style={{
        clipPath: isWiping ? 'polygon(0 0, 100% 0, 100% 0, 0 0)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <CareerOSLogo size="sm" imageClassName="h-6 sm:h-7" />
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block font-mono text-xs text-slate-500 dark:text-[#8b9bb4]">
            Click anywhere or press Esc to skip
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              completeBoot();
            }}
            className="px-3 py-1 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-colors"
          >
            Skip [Esc]
          </button>
        </div>
      </div>

      {/* Center Stage: Futuristic Gyroscope Orb + Progress & Status Lines */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6 space-y-8">
        {/* Orbital Gyroscope & Center Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* Outer Orbit with Satellites */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin-reverse"
              style={{ animationDuration: '14s' }}
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                className="text-[#4361EE]/40"
              />
              <circle cx="100" cy="8" r="3.5" className="fill-[#FF6B6B]" />
              <circle cx="100" cy="192" r="3.5" className="fill-[#4361EE]" />
            </svg>

            {/* Middle Clockwise Scanning Ring */}
            <svg
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin"
              style={{ animationDuration: '8s' }}
              viewBox="0 0 180 180"
            >
              <circle
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="18 12"
                className="text-cyan-500/50"
              />
              <circle cx="90" cy="8" r="4" className="fill-cyan-400" />
            </svg>

            {/* Inner Circular Progress SVG */}
            <svg className="absolute inset-5 w-[calc(100%-40px)] h-[calc(100%-40px)] -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200 dark:text-white/10"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="url(#bootLoaderGradient)"
                strokeWidth="3.5"
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68 * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
              <defs>
                <linearGradient id="bootLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4361EE" />
                  <stop offset="60%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#FF6B6B" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Core: Clean Logo Badge */}
            <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/15 shadow-xl">
              <Image
                src="/brand/careeros-logo.png"
                alt="CareerOS Logo"
                width={120}
                height={40}
                className="w-16 h-auto object-contain transition-transform duration-300 scale-95 hover:scale-105"
                priority
              />
              <div className="flex items-center gap-0.5 font-mono text-[11px] font-bold text-slate-800 dark:text-white mt-0.5 tabular-nums">
                <span>{progress}</span>
                <span className="text-[#4361EE]">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Five Status Lines */}
        <div className="space-y-2 font-sans text-xs sm:text-sm">
          {STATUS_LINES.map((line, idx) => {
            const isResolved = resolvedLines > idx;
            const isCurrent = resolvedLines === idx;

            return (
              <div
                key={line.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  isResolved
                    ? 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white'
                    : isCurrent
                    ? 'border-[#4361EE]/60 bg-[#4361EE]/10 text-slate-900 dark:text-white shadow-sm'
                    : 'border-transparent text-slate-400 dark:text-[#475569]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 dark:text-[#8b9bb4] w-6">0{idx + 1}</span>
                  <span className="font-medium">{line.text}</span>
                </div>
                <div className="flex-shrink-0 ml-4 font-mono text-xs">
                  {isResolved ? (
                    <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      Complete
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[#4361EE] animate-pulse font-medium">In progress...</span>
                  ) : (
                    <span className="text-slate-400 dark:text-[#475569]">Queued</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-[#8b9bb4] gap-2">
        <span>Target role readiness evaluation</span>
        <span>From Student to Job-Ready.</span>
      </div>
    </div>
  );
}
