'use client';

import React from 'react';

/**
 * Haikei Organic Mesh & Wave Backgrounds
 * Tailored with CareerOS Realtime Colors (Obsidian / Radiant Cyan / Electric Indigo / Amber Momentum)
 */

export const HaikeiHeroMesh: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    <svg
      className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1400px] h-[750px] opacity-40 blur-[90px]"
      viewBox="0 0 900 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M150 200 C300 100, 500 350, 750 180 C850 120, 900 400, 600 500 C400 550, 200 450, 150 200 Z"
        fill="url(#haikei-hero-grad1)"
      />
      <path
        d="M250 150 C450 50, 650 250, 800 350 C700 500, 450 480, 250 400 C150 350, 100 200, 250 150 Z"
        fill="url(#haikei-hero-grad2)"
      />
      <defs>
        <linearGradient id="haikei-hero-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="haikei-hero-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const HaikeiWaveDivider: React.FC<{ className?: string; flip?: boolean }> = ({ className = '', flip = false }) => (
  <div className={`w-full overflow-hidden leading-none ${className} ${flip ? 'rotate-180' : ''}`}>
    <svg
      className="relative block w-full h-12 md:h-16"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
        fill="currentColor"
        className="text-[var(--bg-canvas)]"
        opacity="0.9"
      />
    </svg>
  </div>
);

export const HaikeiEmptyStateSvg: React.FC<{ variant?: 'resume' | 'tasks' | 'interview' | 'skills' }> = ({ variant = 'tasks' }) => {
  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="url(#empty-blob-grad)" opacity="0.15" />
        <path
          d="M60 70 C80 50, 130 50, 150 80 C170 110, 140 150, 110 160 C70 170, 40 130, 50 90 Z"
          stroke="url(#empty-stroke-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="100" cy="100" r="38" fill="#0e1420" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
        <defs>
          <linearGradient id="empty-blob-grad" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="empty-stroke-grad" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
