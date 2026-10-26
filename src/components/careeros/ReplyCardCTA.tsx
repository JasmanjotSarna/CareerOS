'use client';

import React from 'react';

export function ReplyCardCTA() {
  return (
    <section className="relative overflow-hidden bg-[#26251e] dark:bg-[#151412] text-[#edece8] py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Columns 1-5: The Statement Paragraph */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Placement Pass.
          </h3>
          <p className="text-base sm:text-lg text-[#a6a49c] leading-relaxed max-w-md">
            Built for universities running campus prep and students who want every technical and behavioral milestone provably verified before recruitment drives open.
          </p>
          <div className="pt-2 text-sm text-[#a6a49c]">
            Comprehensive preparation across all engineering and management branches.
          </div>
        </div>

        {/* Columns 6-12: The Physical Reply Card */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div
            className="w-full max-w-lg bg-[#d3d2ce] text-[#26251e] p-8 md:p-12 rounded-none transform lg:rotate-2 shadow-none transition-transform duration-300"
            style={{
              boxShadow: 'none',
            }}
          >
            <div className="text-center space-y-4">
              <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#26251e]">
                Claim Your Readiness Pass
              </h4>
              <p className="text-base text-[#5f5d55] max-w-sm mx-auto leading-relaxed">
                Connect your academic branch, verify your CBT code competencies, and generate your audit score.
              </p>

              {/* Action Buttons for Both Audiences */}
              <div className="pt-4 space-y-3">
                <a
                  href="/login?role=student"
                  className="block w-full h-14 bg-[#26251e] text-[#edece8] font-semibold text-sm flex items-center justify-center transition-colors hover:bg-[#1a1916] active:scale-[0.97]"
                >
                  Start Student Readiness Check
                </a>
                <a
                  href="/login?role=faculty"
                  className="block w-full h-12 bg-[#cac9c4] text-[#26251e] font-semibold text-sm flex items-center justify-center transition-colors hover:bg-[#bebcb5] active:scale-[0.97]"
                >
                  Access University Placement Portal
                </a>
              </div>

              <p className="text-xs text-[#5f5d55] pt-2">
                Engineering & Technology Placement Season
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
