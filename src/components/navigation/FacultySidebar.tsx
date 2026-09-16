'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  AlertTriangle,
  GraduationCap,
  Building,
  ArrowLeft,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { cn } from '@/lib/utils';
import { soundFX } from '@/components/effects/SoundFX';

export const FacultySidebar: React.FC = () => {
  const pathname = usePathname();
  const { cohortKPIs, setPersona } = useApp();

  const navItems = [
    { label: 'Cohort Overview', href: '/faculty/dashboard', icon: BarChart3 },
    { label: 'Student Directory', href: '/faculty/students', icon: Users, badge: '842' },
    { 
      label: 'Interventions Needed', 
      href: '/faculty/students?filter=at-risk', 
      icon: AlertTriangle, 
      alertBadge: `${cohortKPIs.studentsAtRiskCount}` 
    },
  ];

  return (
    <aside className="w-60 shrink-0 border-r border-[#1e293b] bg-[#090d16] flex flex-col justify-between py-4 px-3 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-4">
        {/* Brand Header */}
        <Link href="/faculty/dashboard" className="block px-2 pt-1 pb-2">
          <div className="flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <Image
              src="/brand/careeros-logo.png"
              alt="CareerOS — Placement Intelligence"
              width={140}
              height={40}
              className="object-contain h-7 w-auto"
              priority
            />
          </div>
        </Link>

        {/* Institutional Cohort KPI Header */}
        <div className="p-2.5 rounded-xl bg-[#120f24] border border-purple-500/30">
          <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono mb-1">
            <span>PLACEMENT DEPT</span>
            <span className="font-bold">2026 DRIVE</span>
          </div>
          <div className="text-xs font-semibold text-white truncate">
            JECRC University Placements
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#1e293b] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Cohort Readiness</span>
            <span className="font-extrabold font-mono text-purple-400">{cohortKPIs.overallReadiness}%</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Placement Intelligence
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => soundFX.playHover()}
                onClick={() => soundFX.playClick()}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group relative',
                  isActive
                    ? 'bg-purple-500/10 text-purple-300 font-semibold border-l-2 border-purple-400 pl-2.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121826]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300')} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#161f30] text-slate-400 border border-[#1e293b] font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.alertBadge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30 font-mono font-bold">
                      {item.alertBadge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Switch back to student experience shortcut */}
      <div className="pt-3 border-t border-[#1e293b]">
        <button
          onClick={() => {
            soundFX.playClick();
            setPersona('student');
          }}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-[#111724] hover:bg-[#161f30] border border-[#1e293b] text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Switch to Student View</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
