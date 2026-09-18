'use client';

import React from 'react';
import { HaikeiEmptyStateSvg } from '@/components/visuals/HaikeiBackgrounds';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'resume' | 'tasks' | 'interview' | 'skills';
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  variant = 'tasks',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-subtle)] my-4">
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-default)] flex items-center justify-center text-cyan-400 mb-4 shadow-sm">
          {icon}
        </div>
      ) : (
        <HaikeiEmptyStateSvg variant={variant} />
      )}

      <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-3">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mt-1 mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
