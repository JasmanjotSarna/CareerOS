'use client';

import React, { forwardRef } from 'react';
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
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-md';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[var(--accent-primary)] text-[var(--accent-ink)] hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-pressed)]',
      secondary:
        'bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-tertiary)] hover:border-[var(--border-hover)]',
      outline:
        'bg-transparent text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-secondary)] hover:border-[var(--border-hover)]',
      ghost:
        'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]',
      momentum:
        'bg-[var(--accent-primary)] text-[var(--accent-ink)] hover:brightness-110',
      danger:
        'bg-[var(--status-danger-subtle)] text-[var(--status-danger)] border border-[rgba(239,68,68,0.4)] hover:bg-[rgba(239,68,68,0.16)]',
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
