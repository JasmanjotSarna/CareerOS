'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  GitPullRequest,
  Map,
  FileCheck,
  Code2,
  Users2,
  Mic,
  Brain,
  TrendingUp,
  Bot,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { ProgressRing } from '@/components/ui/ProgressRing';
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
    resumeData 
  } = useApp();

  const allTasks = useMemo(() => roadmapWeeks.flatMap(w => w.tasks), [roadmapWeeks]);
  const completedTasks = useMemo(() => allTasks.filter(t => t.status === 'completed'), [allTasks]);
  const roadmapProgress = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    pulse?: boolean;
  }

  const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'CORE DIAGNOSTICS',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Role Suitability', href: '/suitability', icon: Target, badge: `${suitability.overallMatch}%` },
        { label: 'Skill Gap Matrix', href: '/skills', icon: GitPullRequest },
        { label: 'Sprint Roadmap', href: '/roadmap', icon: Map, badge: `${roadmapProgress}%` },
        { label: 'ATS Resume Studio', href: '/resume', icon: FileCheck, badge: resumeData.atsScore > 0 ? `${resumeData.atsScore}` : 'New' },
      ],
    },
    {
      title: 'INTERVIEW & DRILLS',
      items: [
        { label: 'AI Technical Studio', href: '/interviews/technical', icon: Code2 },
        { label: 'STAR Behavioral Studio', href: '/interviews/hr', icon: Users2 },
        { label: 'Aptitude Arena', href: '/aptitude', icon: Brain },
        { label: 'Communication Lab', href: '/communication', icon: Mic },
      ],
    },
    {
      title: 'INTELLIGENCE & COACH',
      items: [
        { label: 'Readiness Telemetry', href: '/progress', icon: TrendingUp },
        { label: 'AI Career Coach', href: '/coach', icon: Bot, pulse: true },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex flex-col justify-between py-6 px-4 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-6">
        {/* Dynamic Target Role & Readiness Hero Card */}
        <div className="p-4 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-sm">
          <div className="flex items-center gap-3">
            <ProgressRing value={readinessScores.overall} size={54} strokeWidth={5} variant="cyan" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                READINESS GATE
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] truncate mt-0.5">
                {activeTargetRole.title}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>+{readinessScores.weeklyDelta}% this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] font-mono">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => soundFX.playHover()}
                    onClick={() => soundFX.playClick()}
                    className={cn(
                      'group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-200 font-semibold shadow-sm border border-cyan-500/30'
                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-primary)]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors shrink-0',
                          isActive ? 'text-cyan-400' : 'text-[var(--text-muted)] group-hover:text-cyan-300'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.pulse && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                      {item.badge && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          {item.badge}
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

      {/* Footer / University Status Pill */}
      <div className="pt-4 border-t border-[var(--border-subtle)]">
        <Link
          href="/profile"
          onClick={() => soundFX.playClick()}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-subtle)] transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                {studentProfile.university || 'Placement Sync'}
              </p>
              <p className="text-[9px] text-emerald-400 font-mono">
                Verified Candidate
              </p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-white" />
        </Link>
      </div>
    </aside>
  );
};
