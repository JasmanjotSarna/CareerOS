'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Flame, ShieldCheck, Cloud, CloudOff } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { STUDENT_NAV_SECTIONS } from '@/components/navigation/navConfig';
import { soundFX } from '@/components/effects/SoundFX';
import { cn } from '@/lib/utils';

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    readinessScores,
    activeTargetRole,
    studentProfile,
    suitability,
    roadmapWeeks,
    resumeData,
  } = useApp();
  const { unreadNotificationCount, tablesAvailable, supabaseConfigured } = useWorkspace();

  const allTasks = useMemo(() => roadmapWeeks.flatMap((w) => w.tasks), [roadmapWeeks]);
  const completedTasks = useMemo(() => allTasks.filter((t) => t.status === 'completed'), [allTasks]);
  const roadmapProgress = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  const badgeFor = (href: string): string | undefined => {
    if (href === '/suitability') return suitability?.overallMatch !== undefined ? `${suitability.overallMatch}%` : undefined;
    if (href === '/roadmap') return `${roadmapProgress}%`;
    if (href === '/resume') return (resumeData?.atsScore || 0) > 0 ? `${resumeData.atsScore}` : 'New';
    if (href === '/notifications' && unreadNotificationCount > 0) return `${unreadNotificationCount}`;
    return undefined;
  };

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 select-none flex-col justify-between overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-5 lg:flex">
      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ProgressRing value={readinessScores?.overall ?? 0} size={54} strokeWidth={5} variant="cyan" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Readiness
              </div>
              <div className="mt-0.5 truncate text-xs font-bold text-[var(--text-primary)]">
                {activeTargetRole?.title || 'Target Role'}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <Flame className="h-3 w-3 text-amber-400" />
                <span>+{readinessScores?.weeklyDelta ?? 0}% this week</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-5" aria-label="Primary">
          {STUDENT_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const badge = badgeFor(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => soundFX.playHover()}
                    onClick={() => soundFX.playClick()}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150',
                      isActive
                        ? 'bg-[var(--accent-primary-subtle)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-[var(--signal)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {badge && (
                        <span
                          className={cn(
                            'rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold',
                            item.href === '/notifications'
                              ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                              : 'border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-[var(--text-muted)]'
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
        <div
          className="flex items-center gap-2 px-2 text-[10px] font-mono text-[var(--text-dim)]"
          title={
            supabaseConfigured && tablesAvailable
              ? 'Workspace data is synced to your Supabase account.'
              : 'Workspace data is currently stored in this browser.'
          }
        >
          {supabaseConfigured && tablesAvailable ? (
            <Cloud className="h-3 w-3 text-emerald-400" />
          ) : (
            <CloudOff className="h-3 w-3 text-amber-400" />
          )}
          <span>{supabaseConfigured && tablesAvailable ? 'Cloud sync active' : 'Local workspace'}</span>
        </div>

        <Link
          href="/profile"
          onClick={() => soundFX.playClick()}
          className="group flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-2.5 transition-colors hover:bg-[var(--surface-secondary)]"
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-[var(--text-primary)]">
                {studentProfile.university || 'Your profile'}
              </p>
              <p className="font-mono text-[9px] text-[var(--text-muted)]">Candidate account</p>
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-white" />
        </Link>
      </div>
    </aside>
  );
};
