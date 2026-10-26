'use client';

import React, { useState } from 'react';

const ACTIONS = [
  {
    id: 'act-01',
    priority: 'HIGH PRIORITY',
    deadline: 'Next 48 Hours',
    title: 'Solve Redis Distributed Lock Invalidation Probe',
    reason: 'Target Cloudflare role requires explicit evidence of concurrency failover mitigation.',
    xp: '+4% Readiness Index',
  },
  {
    id: 'act-02',
    priority: 'RECOMMENDED',
    deadline: 'In 4 Days',
    title: 'Review System Design STAR Defense for Monzo Drive',
    reason: 'Campus recruitment drive commences in 11 days. System Design mock scheduled.',
    xp: '+6% Readiness Index',
  },
  {
    id: 'act-03',
    priority: 'SCHEDULED',
    deadline: 'This Weekend',
    title: 'Export Tailored ATS Resume Variant (v4.2-Go)',
    reason: 'Closes 3 parsed keyword gaps detected in Q3 backend openings.',
    xp: '+3% ATS Match',
  },
];

export function CommandInterviewModuleWindow() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div
      data-ui="command-interview-module-window"
      className="w-full rounded-2xl bg-[#0e1015] border border-white/10 text-[#f0f2f7] p-6 sm:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
          </div>
          <span className="font-mono text-xs text-[#8b92a5] uppercase tracking-wider">
            COMMAND_INTERVIEW.SYS // QUESTION 04: WHAT IS NEXT?
          </span>
        </div>
        <div className="font-mono text-xs text-[#3b82f6]">
          PRIORITIZED DAILY ACTIONS • ACOUSTIC INTERVIEW ANALYSIS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Command Center Prioritized Daily Actions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-xs text-[#8b92a5] uppercase block">CAREER COMMAND CENTER</span>
                <p className="text-sm font-semibold text-white mt-0.5">3 High-Leverage Actions Sequenced</p>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                FOCUS MODE
              </span>
            </div>

            <div className="space-y-3">
              {ACTIONS.map((action) => (
                <div
                  key={action.id}
                  className="p-3.5 rounded-lg bg-[#191c26] border border-white/5 space-y-1.5 text-xs hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        action.priority === 'HIGH PRIORITY'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : action.priority === 'RECOMMENDED'
                          ? 'bg-[#2563eb]/20 text-[#3b82f6] border border-[#2563eb]/30'
                          : 'bg-white/10 text-[#8b92a5]'
                      }`}
                    >
                      {action.priority}
                    </span>
                    <span className="text-[#8b92a5] text-[11px]">{action.deadline}</span>
                  </div>

                  <p className="font-semibold text-sm text-white pt-0.5">{action.title}</p>
                  <p className="text-[#8b92a5] leading-relaxed">
                    <strong className="text-[#c2c7d6]">Reason: </strong>
                    {action.reason}
                  </p>

                  <div className="pt-1 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-emerald-400 font-semibold">{action.xp}</span>
                    <span className="text-[#2563eb] hover:underline cursor-pointer">Execute Action →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: AI Interview Coach Recorded Session & Acoustic Waveform */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#141720] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-xs text-[#8b92a5] uppercase block">AI INTERVIEW COACH</span>
                <p className="text-sm font-semibold text-white mt-0.5">Recorded System Design Session</p>
              </div>
              <div className="font-mono text-xs text-right">
                <span className="text-[#8b92a5]">TIMECODE: </span>
                <span className="text-emerald-400 font-bold">04:18 / 15:00</span>
              </div>
            </div>

            {/* Probe Question */}
            <div className="p-3.5 rounded-lg bg-[#191c26] border border-white/5 space-y-1 text-xs">
              <span className="font-mono text-[11px] text-[#2563eb] uppercase font-semibold">
                INTERVIEWER PROBE [SYSTEM DESIGN]:
              </span>
              <p className="text-white leading-relaxed">
                &ldquo;Under a 10x traffic spike, your primary database master CPU hits 98%. How do you architect read replicas and circuit breakers to prevent cascading database downtime?&rdquo;
              </p>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="p-4 rounded-lg bg-[#101217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8b92a5] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AUDIO PLAYBACK ANALYSIS
                </span>
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="text-[#3b82f6] hover:underline text-[11px]"
                >
                  {isPlayingAudio ? 'PAUSE WAVEFORM' : 'SIMULATE AUDIO PLAYBACK'}
                </button>
              </div>

              {/* Waveform Bars */}
              <div className="h-10 flex items-center gap-1 overflow-hidden px-1">
                {[45, 80, 60, 95, 30, 70, 85, 40, 65, 90, 50, 75, 85, 30, 60, 92, 70, 40, 85, 95, 60, 75, 45, 90, 65, 35, 80, 85, 55, 70, 90, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-[#2563eb]' : 'bg-[#2b3140]'
                    }`}
                    style={{
                      height: isPlayingAudio ? `${Math.max(15, (h + (i % 3) * 10) % 100)}%` : `${h * 0.7}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Speaking Feedback Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-xs">
              <div className="p-2.5 rounded bg-[#191c26] border border-white/5">
                <span className="text-[10px] text-[#8b92a5] block">CLARITY</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">88%</span>
              </div>
              <div className="p-2.5 rounded bg-[#191c26] border border-white/5">
                <span className="text-[10px] text-[#8b92a5] block">PACING</span>
                <span className="text-base font-bold text-white mt-0.5 block">136 WPM</span>
                <span className="text-[9px] text-[#8b92a5]">OPTIMAL</span>
              </div>
              <div className="p-2.5 rounded bg-[#191c26] border border-white/5">
                <span className="text-[10px] text-[#8b92a5] block">ACCURACY</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">91%</span>
              </div>
              <div className="p-2.5 rounded bg-[#191c26] border border-white/5">
                <span className="text-[10px] text-[#8b92a5] block">STRUCTURE</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">STAR ✓</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8b92a5] italic leading-relaxed pt-1">
              Feedback: &ldquo;Strong technical framing on read replica latency lags. Zero vocal hesitation filler words detected.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
