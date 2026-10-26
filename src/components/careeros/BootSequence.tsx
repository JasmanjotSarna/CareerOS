'use client';

import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  { time: '0.012s', label: 'system.init', message: 'CareerOS workspace initialized for session' },
  { time: '0.038s', label: 'advisor.sys', message: 'Q1: Which career? Comparing profile capabilities against 41 industry pathways' },
  { time: '0.064s', label: 'discovery.net', message: 'Q2: Best opportunities? Indexing active listings with transparent qualification matching' },
  { time: '0.091s', label: 'resume_lab.ai', message: 'Q3: Getting stronger? Measuring ATS keyword coverage and interview pacing' },
  { time: '0.118s', label: 'command.os', message: 'Q4: What next? Sequencing daily prioritized high-impact actions' },
  { time: '0.145s', label: 'pipeline.log', message: 'Q5: Is it working? Verifying application pipeline and response rates' },
  { time: '0.170s', label: 'system.ready', message: 'Ready. Career management platform active.' },
];

export function BootSequence({ onComplete }: { onComplete?: () => void }) {
  const [visibleCount, setVisibleCount] = useState(BOOT_LINES.length);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, show all lines immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCount(BOOT_LINES.length);
      return;
    }

    let current = 1;
    const interval = setInterval(() => {
      if (current < BOOT_LINES.length) {
        current += 1;
        setVisibleCount(current);
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsSkipped(true);
    setVisibleCount(BOOT_LINES.length);
    if (onComplete) onComplete();
  };

  return (
    <div
      data-ui="terminal-boot-sequence"
      className="w-full rounded-2xl bg-[#121316] text-[#edece8] p-5 sm:p-6 select-none animate-rise"
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between pb-4 border-b-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37] inline-block" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            careeros-boot-v4.2.sh
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2456d6] dark:bg-[#4a7cf6] animate-wave-bar" />
            ONLINE
          </span>
          {!isSkipped && visibleCount < BOOT_LINES.length && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-[#a6a49c] hover:text-[#edece8] underline transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Boot Log Terminal Stream inside real pre / code */}
      <div className="pt-4 space-y-2">
        <pre className="text-sm leading-relaxed overflow-x-auto text-[#edece8]">
          <code>
            {BOOT_LINES.slice(0, visibleCount).map((line, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline gap-2 py-0.5">
                <span className="text-[#5f5d55] dark:text-[#7a786f]">[{line.time}]</span>
                <span className="text-[#2456d6] dark:text-[#4a7cf6] font-semibold">
                  {line.label}:
                </span>
                <span className="text-[#edece8]">{line.message}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[#a6a49c] bg-[#1a1c21] p-3 rounded-xl">
        <span>Prompt: Five questions answered by real system modules.</span>
        <span className="text-[#edece8] font-medium">Concept: Boot your career.</span>
      </div>
    </div>
  );
}
