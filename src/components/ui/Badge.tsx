'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'lime' | 'cyan' | 'indigo' | 'momentum' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';

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
    lime: 'bg-[var(--accent-primary-subtle)] text-[var(--signal)] border-[var(--signal)]/40',
    cyan: 'bg-[var(--accent-secondary-subtle)] text-[var(--accent-secondary)] border-[rgba(34,211,238,0.4)]',
    indigo: 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)] border-[rgba(99,102,241,0.4)]',
    momentum: 'bg-[var(--accent-momentum-subtle)] text-[var(--accent-momentum)] border-[rgba(245,158,11,0.4)]',
    success: 'bg-[var(--status-success-subtle)] text-[var(--status-success)] border-[rgba(34,197,94,0.4)]',
    warning: 'bg-[var(--status-warning-subtle)] text-[var(--status-warning)] border-[rgba(245,158,11,0.4)]',
    danger: 'bg-[var(--status-danger-subtle)] text-[var(--status-danger)] border-[rgba(239,68,68,0.4)]',
    neutral: 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)]',
    ai: 'bg-[var(--accent-primary-subtle)] text-[var(--text-primary)] border-[rgba(99,102,241,0.4)]',
  };

  const dotColors: Record<BadgeVariant, string> = {
    lime: 'bg-[var(--signal)]',
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
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border tracking-wide uppercase',
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
