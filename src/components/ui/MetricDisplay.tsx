'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface MetricDisplayProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  sublabel?: string;
  trend?: number; // e.g. +4
  size?: 'sm' | 'md' | 'lg' | 'hero';
  highlight?: 'cyan' | 'violet' | 'momentum' | 'emerald';
  className?: string;
}

export function MetricDisplay({
  value,
  suffix = '',
  prefix = '',
  label,
  sublabel,
  trend,
  size = 'md',
  highlight = 'cyan',
  className
}: MetricDisplayProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [displayVal, setDisplayVal] = useState(value);

  const spring = useSpring(0, {
    stiffness: 75,
    damping: 18,
  });

  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (prefersReduced) {
      setDisplayVal(value);
    } else {
      spring.set(value);
      const unsubscribe = rounded.on('change', (latest) => {
        setDisplayVal(latest);
      });
      return () => unsubscribe();
    }
  }, [value, spring, rounded, prefersReduced]);

  const sizeClasses = {
    sm: 'text-2xl font-bold tracking-tight',
    md: 'text-4xl font-extrabold tracking-tight',
    lg: 'text-6xl font-black tracking-tighter',
    hero: 'text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none'
  };

  const highlightClasses = {
    cyan: 'text-cyan-400 drop-shadow-[0_0_24px_rgba(6,182,212,0.25)]',
    violet: 'text-violet-400 drop-shadow-[0_0_24px_rgba(139,92,246,0.25)]',
    momentum: 'text-amber-400 drop-shadow-[0_0_28px_rgba(245,158,11,0.35)]',
    emerald: 'text-emerald-400 drop-shadow-[0_0_24px_rgba(16,185,129,0.25)]'
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn(sizeClasses[size], highlightClasses[highlight], 'tabular-nums font-mono')}>
          {prefix}{displayVal}{suffix}
        </span>
        {trend !== undefined && trend !== 0 && (
          <span className={cn(
            'inline-flex items-center text-xs font-mono font-semibold px-2 py-0.5 rounded-full border',
            trend > 0 
              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' 
              : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
          )}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
      {label && (
        <span className="text-xs uppercase tracking-widest font-mono text-slate-400 mt-1 font-semibold">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-xs text-slate-500 mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
}
