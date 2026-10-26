'use client';

import React from 'react';

const STAGES = [
  { name: 'Saved', count: 12, label: 'Target roles' },
  { name: 'Preparing', count: 4, label: 'Resume & gap sprint' },
  { name: 'Applied', count: 18, label: 'Applications submitted' },
  { name: 'Assessment', count: 6, label: 'Take-homes & CBT tests' },
  { name: 'Interview', count: 4, label: 'Technical rounds' },
  { name: 'Offer', count: 2, label: 'Formal offers' },
];

export function TrackerAnalyticsWindow() {
  return (
    <div
      data-ui="tracker-analytics-window"
      className="w-full max-w-5xl mx-auto rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            tracker-analytics.service: Pipeline Conversion Metrics
          </span>
        </div>
        <div className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
          Conversion Rate: 22.2% (Measured)
        </div>
      </div>

      {/* Pipeline Funnel Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((st) => (
          <div
            key={st.name}
            className="p-4 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-2 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm text-[#a6a49c]">{st.name}</p>
              <p className="text-3xl font-extrabold text-[#edece8] mt-1">{st.count}</p>
            </div>
            <p className="text-sm text-[#a6a49c] pt-2">{st.label}</p>
          </div>
        ))}
      </div>

      {/* Conversion Breakdown & Follow-Up Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-2">
          <span className="font-bold text-[#edece8]">Stage-by-Stage Conversion Funnel</span>
          <div className="space-y-2 pt-2">
            <div>
              <div className="flex justify-between text-[#a6a49c]">
                <span>Application to Assessment</span>
                <span className="font-semibold text-[#edece8]">33.3% (6 of 18)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1e2128] mt-1 overflow-hidden">
                <div className="h-full bg-[#2456d6] dark:bg-[#4a7cf6] rounded-full" style={{ width: '33.3%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#a6a49c]">
                <span>Assessment to Interview</span>
                <span className="font-semibold text-[#edece8]">66.7% (4 of 6)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1e2128] mt-1 overflow-hidden">
                <div className="h-full bg-[#2456d6] dark:bg-[#4a7cf6] rounded-full" style={{ width: '66.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#a6a49c]">
                <span>Interview to Offer</span>
                <span className="font-semibold text-[#edece8]">50.0% (2 of 4)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1e2128] mt-1 overflow-hidden">
                <div className="h-full bg-[#2456d6] dark:bg-[#4a7cf6] rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6]">
              Actionable Pipeline Finding
            </span>
            <p className="text-base text-[#edece8] font-semibold leading-snug">
              Follow-up recommended for Platform Co
            </p>
            <p className="text-[#a6a49c] leading-relaxed">
              Your technical assessment was completed 5 days ago. Sending a polite check-in today falls directly within the optimal response window.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="h-10 px-5 rounded-xl bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white font-semibold text-sm transition-colors active:scale-[0.97]"
            >
              Draft 5-Day Follow-Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
