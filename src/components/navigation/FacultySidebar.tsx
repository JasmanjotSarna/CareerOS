'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Send,
  ShieldCheck,
  TrendingUp,
  Download,
  Building2,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundFX } from '@/components/effects/SoundFX';
import { cn } from '@/lib/utils';

export const FacultySidebar: React.FC = () => {
  const pathname = usePathname();
  const { cohortKPIs, facultyStudents } = useApp();

  const atRiskCount = facultyStudents.filter(s => s.status === 'At-Risk' || s.overallReadiness < 40).length;

  const navItems = [
    {
      label: 'Cohort Overview',
      href: '/faculty/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Student Directory',
      href: '/faculty/students',
      icon: Users,
      badge: `${cohortKPIs.totalStudents}`,
    },
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 select-none flex-col justify-between overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-6 lg:flex">
      <div className="space-y-6">
        {/* Placement Telemetry Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-[var(--surface-primary)] border border-indigo-500/30 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono font-bold mb-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>BATCH 2026 PLACEMENT</span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {cohortKPIs.overallReadiness}%
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Cohort average readiness benchmark
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] font-mono mb-2">
            FACULTY MANAGEMENT
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
                  'group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-200 font-semibold border border-indigo-500/30'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-primary)]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-[var(--text-muted)] group-hover:text-indigo-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* At-Risk Alert Footprint */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-amber-300 uppercase">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Intervention Watch</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] leading-tight">
          <strong className="text-white font-bold">{atRiskCount} candidates</strong> require early counseling before drive begins.
        </p>
      </div>
    </aside>
  );
};
