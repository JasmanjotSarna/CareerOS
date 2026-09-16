'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface CareerButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'momentum' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function CareerButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: CareerButtonProps) {
  const prefersReduced = usePrefersReducedMotion();

  const baseStyles = 'relative inline-flex items-center justify-center font-mono font-medium select-none transition-all duration-200 cursor-pointer overflow-hidden rounded-xl';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.55)] border border-cyan-400/50',
    secondary: 'bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-white/[0.12] hover:border-cyan-500/40 hover:text-white',
    momentum: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:shadow-[0_0_32px_rgba(245,158,11,0.6)] border border-amber-300',
    ghost: 'bg-transparent text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04]',
    glass: 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] backdrop-blur-md'
  };

  return (
    <motion.button
      whileHover={prefersReduced || disabled ? {} : { scale: 1.02 }}
      whileTap={prefersReduced || disabled ? {} : { scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed shadow-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-1" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
