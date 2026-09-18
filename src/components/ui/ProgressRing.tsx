'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  variant?: 'cyan' | 'indigo' | 'momentum' | 'success';
  className?: string;
  showText?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  variant = 'cyan',
  className,
  showText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  const strokeColor = {
    cyan: '#06b6d4',
    indigo: '#6366f1',
    momentum: '#f59e0b',
    success: '#10b981',
  }[variant];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[var(--surface-tertiary)]"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs sm:text-sm font-black font-mono text-[var(--text-primary)]">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
    </div>
  );
};

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'cyan' | 'indigo' | 'momentum' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'cyan',
  size = 'md',
  className,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const gradients = {
    cyan: 'from-cyan-500 to-blue-600',
    indigo: 'from-indigo-500 to-purple-600',
    momentum: 'from-amber-400 to-orange-500',
    success: 'from-emerald-400 to-teal-500',
  }[variant];

  return (
    <div className={cn('w-full bg-[var(--surface-tertiary)] rounded-full overflow-hidden', heights, className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn('h-full rounded-full bg-gradient-to-r', gradients)}
      />
    </div>
  );
};
