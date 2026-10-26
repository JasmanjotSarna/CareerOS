'use client';

import React from 'react';
import Image from 'next/image';

interface UniqueLoaderProps {
  progress?: number;
  statusText?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export function CareerOSUniqueLoader({
  progress = 75,
  statusText = 'SYNCHRONIZING CAREER READINESS ENGINE...',
  size = 'fullscreen',
}: UniqueLoaderProps) {
  const isFullscreen = size === 'fullscreen';

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Outer Gyroscope & Radar Orbit */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
        {/* Background Soft Glow */}
        <div className="absolute inset-0 rounded-full bg-[#4361EE]/15 blur-2xl animate-pulse" />

        {/* Ring 1: Outer Dashed Counter-Clockwise Orbit */}
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
            className="text-[#4361EE]/40 dark:text-[#4361EE]/50"
          />
          {/* Orbital Satellites */}
          <circle cx="100" cy="8" r="3.5" className="fill-[#FF6B6B]" />
          <circle cx="100" cy="192" r="3.5" className="fill-[#4361EE]" />
        </svg>

        {/* Ring 2: Clockwise Scanning Ring */}
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
            className="text-cyan-400/40"
          />
          <circle cx="90" cy="8" r="4" className="fill-cyan-400" />
        </svg>

        {/* Ring 3: Progress Track Ring with Gradient Stroke */}
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
            stroke="url(#loaderGradient)"
            strokeWidth="3.5"
            strokeDasharray={2 * Math.PI * 68}
            strokeDashoffset={2 * Math.PI * 68 * (1 - progress / 100)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4361EE" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Core: Logo and Pulsing Core Node */}
        <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-white/15 shadow-xl">
          <Image
            src="/brand/careeros-logo.png"
            alt="CareerOS Logo"
            width={120}
            height={40}
            className="w-16 h-auto object-contain transition-transform duration-500 scale-95 hover:scale-105"
            priority
          />
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-800 dark:text-white mt-1 tabular-nums">
            <span>{progress}</span>
            <span className="text-[#4361EE]">%</span>
          </div>
        </div>
      </div>

      {/* Futuristic Telemetry Status Bar */}
      <div className="mt-6 space-y-2 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{statusText}</span>
        </div>
        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
          From Student to Job-Ready.
        </p>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-[#070B18]/95 backdrop-blur-xl transition-colors">
        {content}
      </div>
    );
  }

  return content;
}
