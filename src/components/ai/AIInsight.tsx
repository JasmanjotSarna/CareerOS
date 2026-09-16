'use client';

import React from 'react';
import { Sparkles, Cpu, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsightProps {
  title?: string;
  badge?: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber';
  icon?: 'sparkles' | 'cpu' | 'zap';
}

export const AIInsight: React.FC<AIInsightProps> = ({
  title = 'CareerOS Intelligence',
  badge = 'AI Verified',
  children,
  actionText,
  onAction,
  className,
  variant = 'cyan',
  icon = 'sparkles'
}) => {
  const variantStyles = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-500/50',
      bg: 'bg-[#0d1524]/90',
      glow: 'shadow-[0_0_24px_-6px_rgba(6,182,212,0.18)]',
      badgeBg: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
      iconColor: 'text-cyan-400',
      dotColor: 'bg-cyan-400',
      btnColor: 'text-cyan-400 hover:text-cyan-300',
      gradient: 'from-cyan-500/10 via-transparent to-transparent'
    },
    violet: {
      border: 'border-purple-500/30 hover:border-purple-500/50',
      bg: 'bg-[#130f24]/90',
      glow: 'shadow-[0_0_24px_-6px_rgba(139,92,246,0.18)]',
      badgeBg: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
      iconColor: 'text-purple-400',
      dotColor: 'bg-purple-400',
      btnColor: 'text-purple-400 hover:text-purple-300',
      gradient: 'from-purple-500/10 via-transparent to-transparent'
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      bg: 'bg-[#0a1816]/90',
      glow: 'shadow-[0_0_24px_-6px_rgba(16,185,129,0.18)]',
      badgeBg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
      iconColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      btnColor: 'text-emerald-400 hover:text-emerald-300',
      gradient: 'from-emerald-500/10 via-transparent to-transparent'
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/50',
      bg: 'bg-[#181308]/90',
      glow: 'shadow-[0_0_24px_-6px_rgba(245,158,11,0.18)]',
      badgeBg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
      iconColor: 'text-amber-400',
      dotColor: 'bg-amber-400',
      btnColor: 'text-amber-400 hover:text-amber-300',
      gradient: 'from-amber-500/10 via-transparent to-transparent'
    }
  }[variant];

  const IconComponent = icon === 'cpu' ? Cpu : icon === 'zap' ? Zap : Sparkles;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 md:p-5 transition-all duration-300',
        variantStyles.border,
        variantStyles.bg,
        variantStyles.glow,
        className
      )}
    >
      {/* Background radial accent */}
      <div className={cn('absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br rounded-full blur-2xl pointer-events-none opacity-40', variantStyles.gradient)} />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full ai-pulse-dot', variantStyles.dotColor)} />
          <div className="flex items-center gap-1.5">
            <IconComponent className={cn('w-4 h-4', variantStyles.iconColor)} />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-200">
              {title}
            </span>
          </div>
        </div>

        {badge && (
          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', variantStyles.badgeBg)}>
            {badge}
          </span>
        )}
      </div>

      {/* Body content */}
      <div className="text-sm text-slate-300 leading-relaxed relative z-10">
        {children}
      </div>

      {/* Optional action footer */}
      {actionText && (
        <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-end">
          <button
            onClick={onAction}
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors group cursor-pointer',
              variantStyles.btnColor
            )}
          >
            <span>{actionText}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};
