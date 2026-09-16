'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  User,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { cn } from '@/lib/utils';
import { soundFX } from '@/components/effects/SoundFX';

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname();
  const { readinessScores, activeTargetRole, studentProfile } = useApp();

  const primaryNav = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const careerNav = [
    { label: 'Suitability', href: '/suitability', icon: Target, badge: '78%' },
    { label: 'Skill Gaps', href: '/skills', icon: GitPullRequest },
    { label: 'Roadmap', href: '/roadmap', icon: Map, badge: '42%' },
    { label: 'Resume (ATS)', href: '/resume', icon: FileCheck, badge: '74' },
  ];

  const practiceNav = [
    { label: 'Technical Interview', href: '/interviews/technical', icon: Code2 },
    { label: 'HR Interview', href: '/interviews/hr', icon: Users2 },
    { label: 'Aptitude Arena', href: '/aptitude', icon: Brain },
    { label: 'Communication Lab', href: '/communication', icon: Mic },
  ];

  const intelligenceNav = [
    { label: 'Readiness & Progress', href: '/progress', icon: TrendingUp },
    { label: 'AI Career Coach', href: '/coach', icon: Bot, pulse: true },
  ];

  const renderNavGroup = (items: typeof primaryNav, groupTitle?: string) => (
    <div className="space-y-0.5">
      {groupTitle && (
        <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          {groupTitle}
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playClick()}
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group relative',
              isActive
                ? 'bg-cyan-500/10 text-cyan-300 font-semibold border-l-2 border-cyan-400 pl-2.5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121826]'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300')} />
              <span>{item.label}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {Boolean((item as { pulse?: boolean }).pulse) && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
              {Boolean((item as { badge?: string }).badge) && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#161f30] text-slate-400 border border-[#1e293b] font-mono">
                  {String((item as { badge?: string }).badge)}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="w-60 shrink-0 border-r border-[#1e293b] bg-[#090d16] flex flex-col justify-between py-4 px-3 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-4">
        {/* Brand Header */}
        <Link href="/dashboard" className="block px-2 pt-1 pb-2">
          <div className="flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <Image
              src="/brand/careeros-logo.png"
              alt="CareerOS — From Student to Job-Ready"
              width={140}
              height={40}
              className="object-contain h-7 w-auto"
              priority
            />
          </div>
        </Link>

        {/* Compact Target Role & Readiness Header Pill */}
        <div className="p-2.5 rounded-xl bg-[#0f1523] border border-[#1e293b]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>TARGET ROLE</span>
            <span className="text-cyan-400 font-bold">{readinessScores.overall}% READY</span>
          </div>
          <div className="text-xs font-semibold text-white truncate">
            {activeTargetRole.title}
          </div>
          <div className="h-1 w-full bg-[#1b2436] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${readinessScores.overall}%` }}
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-20rem)] pr-0.5">
          {renderNavGroup(primaryNav)}
          {renderNavGroup(careerNav, 'My Career')}
          {renderNavGroup(practiceNav, 'Practice & Testing')}
          {renderNavGroup(intelligenceNav, 'Intelligence')}
        </nav>
      </div>

      {/* Bottom Account & Settings */}
      <div className="pt-3 border-t border-[#1e293b] space-y-1">
        <Link
          href="/profile"
          onMouseEnter={() => soundFX.playHover()}
          onClick={() => soundFX.playClick()}
          className={cn(
            'flex items-center justify-between p-2 rounded-lg text-xs transition-colors',
            pathname === '/profile'
              ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-[#121826]'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
              JS
            </div>
            <div className="text-left">
              <span className="block text-xs font-medium text-slate-200 leading-tight">
                {studentProfile.fullName.split(' ')[0]}
              </span>
              <span className="block text-[10px] text-slate-500 leading-tight">
                Profile & Settings
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </Link>
      </div>
    </aside>
  );
};
