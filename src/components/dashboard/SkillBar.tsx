'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { SkillGap } from '@/types';
import { cn } from '@/lib/utils';

interface SkillBarProps {
  gap: SkillGap;
  onPractice?: (skillName: string) => void;
  className?: string;
}

export const SkillBar: React.FC<SkillBarProps> = ({ gap, onPractice, className }) => {
  const priorityStyles = {
    Critical: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      bar: 'bg-rose-500',
      dot: 'bg-rose-500',
      label: 'Critical'
    },
    High: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      bar: 'bg-amber-500',
      dot: 'bg-amber-500',
      label: 'High'
    },
    Medium: {
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      bar: 'bg-cyan-500',
      dot: 'bg-cyan-500',
      label: 'Medium'
    },
    Low: {
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      bar: 'bg-slate-400',
      dot: 'bg-slate-400',
      label: 'Low'
    }
  }[gap.priority];

  return (
    <div className={cn('surface-card p-4 transition-all duration-200 hover:border-slate-700 flex flex-col justify-between group', className)}>
      <div>
        {/* Header: Skill Name, Category, Priority */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-100 text-sm tracking-tight">{gap.skillName}</h4>
              <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {gap.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{gap.reason}</p>
          </div>

          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0', priorityStyles.badge)}>
            {priorityStyles.label}
          </span>
        </div>

        {/* What I know vs What the job requires comparison */}
        <div className="mt-3.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Current:</span>
              <span className="font-mono font-bold text-white text-xs">{gap.currentLevel}%</span>
              <span className="text-slate-600 font-mono">→</span>
              <span className="text-slate-400 text-[11px]">Target:</span>
              <span className="font-mono font-bold text-cyan-400 text-xs">{gap.requiredLevel}%</span>
            </div>

            <div className="flex items-center gap-1">
              {gap.gap > 0 ? (
                <span className="text-[11px] font-semibold text-rose-400 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  Gap: {gap.gap} pts
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Benchmark Met
                </span>
              )}
            </div>
          </div>

          {/* Unified Comparison Delta Bar */}
          <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            {/* Required Level target marker zone */}
            <div
              className="absolute top-0 bottom-0 bg-cyan-500/20 border-r-2 border-cyan-400 z-10"
              style={{ width: `${gap.requiredLevel}%` }}
              title={`Target Requirement: ${gap.requiredLevel}%`}
            />
            {/* Current Level progress */}
            <div
              className={cn('h-full rounded-full transition-all duration-700 ease-out z-20 relative', priorityStyles.bar)}
              style={{ width: `${gap.currentLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer / Bridge Gap CTA */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Target role threshold: <span className="text-slate-300 font-mono">{gap.requiredLevel}%</span>
        </span>

        {onPractice && (
          <button
            onClick={() => onPractice(gap.skillName)}
            className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 cursor-pointer text-xs transition-colors"
          >
            <span>Bridge in Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
