'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { soundFX } from '@/components/effects/SoundFX';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'momentum' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-xl';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:brightness-110 active:scale-[0.98]',
      secondary:
        'bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-tertiary)] hover:border-[var(--border-hover)] active:scale-[0.98]',
      outline:
        'bg-transparent text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-secondary)] hover:border-[var(--border-hover)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] active:scale-[0.98]',
      momentum:
        'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98]',
      danger:
        'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.98]',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs h-8 px-3 gap-1.5',
      md: 'text-xs sm:text-sm h-10 px-4 gap-2',
      lg: 'text-sm sm:text-base h-12 px-6 gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      soundFX.playClick();
      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
