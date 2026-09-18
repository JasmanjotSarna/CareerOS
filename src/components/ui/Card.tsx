'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'surface-card p-5 sm:p-6 relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-subtle)]',
        hoverEffect && 'hover:border-[var(--border-hover)] hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

export interface GlowCardProps extends HTMLMotionProps<'div'> {
  glowColor?: 'cyan' | 'indigo' | 'momentum' | 'none';
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  ...props
}) => {
  const glowStyles = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]',
    indigo: 'hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]',
    momentum: 'hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    none: '',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'relative rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] p-6 transition-all duration-300',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
