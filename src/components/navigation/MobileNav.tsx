'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { STUDENT_NAV_SECTIONS, FACULTY_NAV_SECTIONS } from '@/components/navigation/navConfig';
import { useApp } from '@/lib/context/AppContext';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { cn } from '@/lib/utils';
import CareerOSLogo from '@/components/brand/CareerOSLogo';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { activePersona, setPersona } = useApp();
  const { unreadNotificationCount } = useWorkspace();
  const navSections = activePersona === 'faculty' ? FACULTY_NAV_SECTIONS : STUDENT_NAV_SECTIONS;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-white lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto border-r border-[var(--border-default)] bg-[var(--bg-canvas)] p-5 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <CareerOSLogo
                href={activePersona === 'faculty' ? '/faculty/dashboard' : '/dashboard'}
                size="md"
                imageClassName="h-7"
                className="shrink-0"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-5 flex items-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-0.5">
              {(['student', 'faculty'] as const).map((persona) => (
                <button
                  key={persona}
                  type="button"
                  onClick={() => {
                    setPersona(persona);
                    setOpen(false);
                    router.push(persona === 'faculty' ? '/faculty/dashboard' : '/dashboard');
                  }}
                  aria-pressed={activePersona === persona}
                  className={cn(
                    'flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                    activePersona === persona
                      ? persona === 'faculty'
                        ? 'bg-indigo-500/20 font-semibold text-indigo-300'
                        : 'bg-cyan-500/20 font-semibold text-cyan-300'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {persona === 'faculty' ? 'Faculty' : 'Student'}
                </button>
              ))}
            </div>

            <nav className="space-y-6" aria-label="Mobile primary">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <p className="px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-[var(--accent-primary-subtle)] font-medium text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.href === '/notifications' && unreadNotificationCount > 0 && (
                          <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">
                            {unreadNotificationCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
