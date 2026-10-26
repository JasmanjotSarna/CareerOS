'use client';

import React from 'react';
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
        'relative overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] p-5 sm:p-6',
        hoverEffect && 'transition-colors hover:border-[var(--border-hover)]',
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
  <h3 className={cn('text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg', className)} {...props}>
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

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'indigo' | 'momentum' | 'none';
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor,
  ...props
}) => {
  const glowBorderClass =
    glowColor === 'cyan'
      ? 'hover:border-cyan-500/40'
      : glowColor === 'indigo'
      ? 'hover:border-indigo-500/40'
      : glowColor === 'momentum'
      ? 'hover:border-[var(--brand-accent)]'
      : 'hover:border-[var(--border-hover)]';

  return (
    <div
      className={cn(
        'relative rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] p-6 transition-colors',
        glowBorderClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
