'use client';

import React from 'react';
import { TrendingUp, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { ReadinessScoreBreakdown } from '@/types';
import { cn } from '@/lib/utils';
import { getReadinessTier } from '@/lib/readiness/readinessEngine';

interface ReadinessScoreProps {
  scores: ReadinessScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
  className?: string;
  onDrillDown?: () => void;
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({
  scores,
  showBreakdown = true,
  className,
  onDrillDown
}) => {
  const tier = getReadinessTier(scores.overall);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scores.overall / 100) * circumference;

  const tierColors = {
    'Ready': {
      text: 'text-emerald-400',
      badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
      fill: '#10b981'
    },
    'Developing': {
      text: 'text-cyan-400',
      badge: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40',
      fill: '#06b6d4'
    },
    'At-Risk': {
      text: 'text-amber-400',
      badge: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
      fill: '#f59e0b'
    }
  }[tier];

  const subDimensions = [
    { label: 'Technical', weight: '35%', value: scores.technical, color: 'bg-cyan-400', textColor: 'text-cyan-400' },
    { label: 'Aptitude & DSA', weight: '20%', value: scores.aptitude, color: 'bg-blue-400', textColor: 'text-blue-400' },
    { label: 'Communication', weight: '15%', value: scores.communication, color: 'bg-purple-400', textColor: 'text-purple-400' },
    { label: 'HR Behavioral', weight: '15%', value: scores.hr, color: 'bg-indigo-400', textColor: 'text-indigo-400' },
    { label: 'Interview Sim', weight: '15%', value: scores.interview, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
  ];

  return (
    <div className={cn('bg-[#111724] border border-[#1e293b] rounded-xl p-6 relative overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 font-mono">
            Career Readiness Index
          </span>
        </div>

        <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', tierColors.badge)}>
          {tier === 'Ready' ? 'Placement Ready' : tier === 'Developing' ? 'Developing Track' : 'Needs Attention'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-7">
        {/* Calibrated SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="readinessGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#1b2436"
              strokeWidth="9"
              fill="transparent"
            />

            {/* Dynamic Value Arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#readinessGradCompact)"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              {scores.overall}%
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Readiness
            </span>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+{scores.weeklyDelta}% this week</span>
            </div>
          </div>
        </div>

        {/* 5-Dimension sub-bars */}
        {showBreakdown && (
          <div className="flex-1 w-full space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              <span>Readiness Factor</span>
              <span>Weight & Score</span>
            </div>
            {subDimensions.map((dim) => (
              <div key={dim.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{dim.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">({dim.weight})</span>
                    <span className={cn('font-semibold font-mono text-xs', dim.textColor)}>
                      {dim.value}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#161f30] rounded-full overflow-hidden border border-[#1e293b]">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700 ease-out', dim.color)}
                    style={{ width: `${Math.min(100, Math.max(0, dim.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {onDrillDown && (
        <div className="mt-5 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <span>Readiness updates dynamically as you complete sprints and assessments.</span>
          <button
            onClick={onDrillDown}
            className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Trajectory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
