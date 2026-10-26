'use client';

import React from 'react';

export function CommandCenterHero() {
  return (
    <div
      data-ui="command-center-hero"
      className="w-full rounded-2xl bg-[#0e1015] border border-white/10 text-[#f0f2f7] p-5 sm:p-6 space-y-4 select-none animate-rise"
    >
      {/* OS Window Titlebar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#353945]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#353945]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#353945]" />
          <span className="ml-2 font-mono text-xs text-[#8b92a5] uppercase tracking-wider">
            COMMAND_CENTER.OS // LIVE FRAGMENT
          </span>
        </div>
        <span className="font-mono text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </span>
      </div>

      {/* Hero Focus Target Card */}
      <div className="p-4 rounded-xl bg-[#141720] border border-white/5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[11px] text-[#8b92a5] uppercase block">ACTIVE TARGET ROLE</span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              Distributed Systems Engineer
            </h4>
          </div>
          <div className="text-right font-mono">
            <span className="text-2xl font-bold text-[#3b82f6]">88%</span>
            <span className="text-[10px] text-[#8b92a5] block">ESTIMATED FIT</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#202533] overflow-hidden">
          <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '88%' }} />
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#141720] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-[#8b92a5] block uppercase">DAILY ACTIONS</span>
          <span className="text-base font-bold text-white block">3 Prioritized</span>
          <span className="text-[10px] text-emerald-400 block font-medium">Ready in queue</span>
        </div>

        <div className="p-3 rounded-lg bg-[#141720] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-[#8b92a5] block uppercase">APPLICATIONS</span>
          <span className="text-base font-bold text-white block">18 Tracked</span>
          <span className="text-[10px] text-[#3b82f6] block font-medium">5 Active screens</span>
        </div>
      </div>

      {/* Next High-Impact Move Bar */}
      <div className="p-3 rounded-lg bg-[#141720] border border-white/5 flex items-center justify-between text-xs">
        <div>
          <span className="font-mono text-[10px] text-[#8b92a5] uppercase block">NEXT MOVE:</span>
          <span className="font-medium text-white">Solve Redis lock mitigation probe</span>
        </div>
        <a
          href="#next-move"
          className="px-3 py-1 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono text-[11px] font-semibold transition-colors active:scale-[0.97]"
        >
          EXECUTE →
        </a>
      </div>

      {/* Acoustic Signal Bar */}
      <div className="pt-1 flex items-center justify-between font-mono text-[10px] text-[#8b92a5]">
        <span>READINESS ENGINE // ACTIVE</span>
        <div className="h-3 flex items-center gap-1">
          {[40, 70, 90, 55, 80, 100, 60, 45, 85, 95, 50, 75].map((h, idx) => (
            <div
              key={idx}
              className="w-0.5 rounded-full bg-[#2563eb] animate-wave-bar"
              style={{
                height: `${h}%`,
                animationDelay: `${(idx % 6) * 120}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
