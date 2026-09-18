'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { soundFX } from '@/components/effects/SoundFX';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  layoutId?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  layoutId = 'active-tab-pill',
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)] max-w-full overflow-x-auto scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              soundFX.playClick();
              onChange(tab.id);
            }}
            className={cn(
              'relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 flex items-center gap-2 cursor-pointer z-10',
              isActive
                ? 'text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  isActive
                    ? 'bg-cyan-500/30 text-cyan-200'
                    : 'bg-[var(--surface-tertiary)] text-[var(--text-dim)]'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 border border-cyan-500/40 rounded-lg -z-10 shadow-sm"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
