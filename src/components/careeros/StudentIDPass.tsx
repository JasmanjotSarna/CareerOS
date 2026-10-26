'use client';

import React, { useState } from 'react';

interface StudentIDPassProps {
  studentName?: string;
  rollNumber?: string;
  branch?: string;
  university?: string;
}

export function StudentIDPass({
  studentName = 'Aarav Sharma',
  rollNumber = '21BCE10482',
  branch = 'Computer Science & Engineering',
  university = 'JECRC University, Jaipur',
}: StudentIDPassProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div data-ui="student-id-pass" className="w-full max-w-md mx-auto select-none" style={{ perspective: '1200px' }}>
      {/* Interactive 3D Card Container */}
      <div
        className="relative w-full cursor-pointer transition-transform duration-300 animate-rise"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${isFlipped ? 180 + rotate.y : rotate.y}deg)`,
          minHeight: '440px',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label="Student ID Card. Click to flip into Job-Ready Pass."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* FRONT: Physical Student ID Card */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-[#d3d2ce] text-[#26251e] flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Top Lanyard Slot & University Header */}
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-2.5 rounded-full bg-[#bebcb5]" />
            </div>

            <div className="flex items-start justify-between pb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#26251e]">
                  {university}
                </h3>
                <p className="text-sm text-[#5f5d55]">Faculty of Engineering & Technology</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#2456d6] text-white flex items-center justify-center font-bold text-sm">
                JU
              </div>
            </div>
          </div>

          {/* Student Profile Body */}
          <div className="flex items-center gap-4 py-2">
            <div className="w-20 h-24 rounded-lg bg-[#bebcb5] flex-shrink-0 overflow-hidden flex flex-col items-center justify-center text-[#5f5d55]">
              <div className="w-8 h-8 rounded-full bg-[#cac9c4] mb-1" />
              <div className="w-14 h-7 rounded-t-full bg-[#cac9c4]" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-[#26251e] leading-snug">
                {studentName}
              </p>
              <p className="text-sm text-[#5f5d55] font-medium">
                Roll No: <span className="text-[#26251e] font-semibold">{rollNumber}</span>
              </p>
              <p className="text-sm text-[#5f5d55]">
                Branch: <span className="text-[#26251e]">{branch}</span>
              </p>
              <p className="text-sm text-[#5f5d55]">
                Batch: <span className="text-[#26251e]">2022 to 2026</span>
              </p>
            </div>
          </div>

          {/* Barcode Strip & Flip Action */}
          <div className="pt-4 space-y-3">
            <div className="w-full h-8 bg-[#26251e] rounded flex items-center justify-around px-2 opacity-85">
              <span className="w-1 h-6 bg-white" />
              <span className="w-2 h-6 bg-white" />
              <span className="w-0.5 h-6 bg-white" />
              <span className="w-3 h-6 bg-white" />
              <span className="w-1 h-6 bg-white" />
              <span className="w-2 h-6 bg-white" />
              <span className="w-0.5 h-6 bg-white" />
              <span className="w-2 h-6 bg-white" />
              <span className="w-1.5 h-6 bg-white" />
              <span className="w-0.5 h-6 bg-white" />
              <span className="w-3 h-6 bg-white" />
              <span className="w-1 h-6 bg-white" />
            </div>

            <div className="flex items-center justify-between text-sm text-[#5f5d55]">
              <span>Campus ID Pass</span>
              <span className="text-[#2456d6] font-medium">Click to flip into Job-Ready Pass →</span>
            </div>
          </div>
        </div>

        {/* BACK: Verified Placement Readiness Pass */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-[#26251e] text-[#edece8] flex flex-col justify-between"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Header */}
          <div>
            <div className="flex justify-center mb-3">
              <div className="w-14 h-2.5 rounded-full bg-[#383731]" />
            </div>

            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Placement Readiness Pass
                </h3>
                <p className="text-sm text-[#a6a49c]">Verified by CareerOS</p>
              </div>
              <div className="px-3 py-1 rounded bg-[#4a7cf6]/20 text-[#4a7cf6] text-sm font-semibold">
                GATE CLEARED
              </div>
            </div>
          </div>

          {/* Central Score Gauge */}
          <div className="py-2 flex items-center justify-between bg-[#2d2c27] p-4 rounded-xl">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-bold text-white tracking-tight">86</span>
                <span className="text-base text-[#a6a49c]">/ 100</span>
              </div>
              <p className="text-sm text-[#4a7cf6] mt-0.5 font-medium">
                Placement ready (Threshold: 78%)
              </p>
            </div>

            {/* Dial Graphic with rotation & glow */}
            <div className="w-16 h-16 rounded-full bg-[#1a1916] flex items-center justify-center p-2 animate-ring-glow">
              <div className="w-12 h-12 rounded-full border-4 border-[#4a7cf6] border-t-transparent flex items-center justify-center text-sm font-bold text-white">
                86%
              </div>
            </div>
          </div>

          {/* Calibrated Pillars */}
          <div className="space-y-2.5 py-1 text-sm">
            <div className="flex justify-between items-center text-[#a6a49c]">
              <span>CBT DSA & Aptitude</span>
              <span className="font-semibold text-white">88% (42 solved)</span>
            </div>
            <div className="w-full h-2 bg-[#383731] rounded-full overflow-hidden">
              <div className="h-full bg-[#4a7cf6] rounded-full transition-[width] duration-500" style={{ width: '88%' }} />
            </div>

            <div className="flex justify-between items-center text-[#a6a49c]">
              <span>BET English & Speaking</span>
              <span className="font-semibold text-white">92% (142 wpm)</span>
            </div>
            <div className="w-full h-2 bg-[#383731] rounded-full overflow-hidden">
              <div className="h-full bg-[#4a7cf6] rounded-full transition-[width] duration-500" style={{ width: '92%' }} />
            </div>

            <div className="flex justify-between items-center text-[#a6a49c]">
              <span>Faculty Technical Assessment</span>
              <span className="font-semibold text-white">84% (Verified)</span>
            </div>
            <div className="w-full h-2 bg-[#383731] rounded-full overflow-hidden">
              <div className="h-full bg-[#4a7cf6] rounded-full transition-[width] duration-500" style={{ width: '84%' }} />
            </div>
          </div>

          {/* Footer of Pass */}
          <div className="pt-2 flex items-center justify-between text-sm text-[#a6a49c]">
            <span>Illustrative data</span>
            <span className="text-[#4a7cf6] font-medium">← Click to flip to Student ID</span>
          </div>
        </div>
      </div>
    </div>
  );
}
