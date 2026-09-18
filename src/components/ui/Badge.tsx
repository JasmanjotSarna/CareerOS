'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'cyan' | 'indigo' | 'momentum' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  className,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    momentum: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    warning: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
    danger: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    neutral: 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)]',
    ai: 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-200 border-cyan-400/30',
  };

  const dotColors: Record<BadgeVariant, string> = {
    cyan: 'bg-cyan-400',
    indigo: 'bg-indigo-400',
    momentum: 'bg-amber-400',
    success: 'bg-emerald-400',
    warning: 'bg-yellow-400',
    danger: 'bg-rose-400',
    neutral: 'bg-slate-400',
    ai: 'bg-cyan-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border tracking-wide uppercase',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};
