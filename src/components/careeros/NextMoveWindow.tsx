'use client';

import React from 'react';

const ACTIONS = [
  {
    title: 'Review Tailored Bullets for Platform Architecture Co',
    why: 'Closing the 3 identified Redis and concurrency keyword gaps raises estimated match score from 76% to 84%.',
    nextStep: 'Approve or edit suggested bullets in Resume Lab',
    ctaText: 'Open Resume Lab',
    priority: 'Immediate (Due today)',
  },
  {
    title: 'Simulate High-Throughput Tree Traversal Interview',
    why: 'Platform Co technical screens specifically probe recursive vs iterative space complexity tradeoffs.',
    nextStep: 'Run 15-minute mock session with AI interrogator',
    ctaText: 'Start Interview Mock',
    priority: 'High (Schedule for morning)',
  },
  {
    title: 'Submit Follow-Up for Logistics Stream Labs Application',
    why: 'Application was submitted 6 days ago; candidate response telemetry shows Day 6 follow-ups boost review probability by 18%.',
    nextStep: 'Review draft message and confirm dispatch',
    ctaText: 'Review Follow-Up Draft',
    priority: 'Scheduled (Day 6 window)',
  },
];

export function NextMoveWindow() {
  return (
    <div
      data-ui="command-center-next-move"
      className="w-full max-w-5xl mx-auto rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            command-center.os: Daily Action Dispatcher
          </span>
        </div>
        <div className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
          3 prioritized moves for today
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        {ACTIONS.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-lg font-bold text-[#edece8]">{item.title}</h4>
              <span className="px-3 py-1 rounded bg-[#1e2128] text-sm text-[#2456d6] dark:text-[#4a7cf6] font-semibold flex-shrink-0">
                {item.priority}
              </span>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-[#a6a49c]">
                <strong className="text-[#edece8]">Why this matters: </strong>
                {item.why}
              </p>
              <p className="text-[#a6a49c]">
                <strong className="text-[#edece8]">Next step: </strong>
                {item.nextStep}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                className="h-10 px-5 rounded-xl bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white font-semibold text-sm transition-colors active:scale-[0.97]"
              >
                {item.ctaText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
