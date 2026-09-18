'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './AnimatedCounter';

export interface StatMetricProps {
  value: string | number;
  label: string;
  suffix?: string;
  sublabel?: string;
  trend?: number;
  highlight?: 'cyan' | 'indigo' | 'momentum' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  icon?: React.ReactNode;
  className?: string;
}

export const StatMetric: React.FC<StatMetricProps> = ({
  value,
  label,
  suffix = '',
  sublabel,
  trend,
  highlight = 'cyan',
  size = 'md',
  icon,
  className,
}) => {
  const valueColor = {
    cyan: 'text-cyan-400',
    indigo: 'text-indigo-400',
    momentum: 'text-amber-400',
    success: 'text-emerald-400',
    danger: 'text-rose-400',
  }[highlight];

  const sizeClasses = {
    sm: 'text-xl sm:text-2xl font-bold',
    md: 'text-2xl sm:text-3xl font-extrabold',
    lg: 'text-3xl sm:text-4xl font-black',
    hero: 'text-4xl sm:text-6xl font-black tracking-tight',
  }[size];

  const isNumeric = typeof value === 'number';

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
          {label}
        </span>
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1">
        {isNumeric ? (
          <AnimatedCounter
            value={value}
            className={cn('font-mono leading-none tracking-tight', sizeClasses, valueColor)}
          />
        ) : (
          <motion.span
            key={String(value)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('font-mono leading-none tracking-tight', sizeClasses, valueColor)}
          >
            {value}
          </motion.span>
        )}
        {suffix && (
          <span className="text-sm sm:text-lg font-mono font-bold text-[var(--text-muted)]">
            {suffix}
          </span>
        )}

        {trend !== undefined && trend !== 0 && (
          <span
            className={cn(
              'ml-2 text-xs font-mono font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md',
              trend > 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            )}
          >
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>

      {sublabel && (
        <p className="text-xs text-[var(--text-muted)] mt-1.5 font-normal leading-relaxed">
          {sublabel}
        </p>
      )}
    </div>
  );
};
