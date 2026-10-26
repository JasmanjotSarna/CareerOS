'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot,
  Volume2,
  VolumeX,
  ChevronDown,
  LogOut,
  User,
  Bell,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MobileNav } from '@/components/navigation/MobileNav';
import CareerOSLogo from '@/components/brand/CareerOSLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { soundFX } from '@/components/effects/SoundFX';
import { cn } from '@/lib/utils';

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    activePersona,
    setPersona,
    toggleAiCoach,
    studentProfile,
    activeTargetRole,
    targetRoles,
    setTargetRole,
    readinessScores,
    signOut,
  } = useApp();
  const { unreadNotificationCount } = useWorkspace();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(() => {
    return typeof window !== 'undefined' ? soundFX.isEnabled() : true;
  });

  const handleToggleSound = () => {
    const newState = soundFX.toggle();
    setSoundActive(newState);
  };

  const isFacultyRoute = pathname.startsWith('/faculty');

  const handlePersonaSwitch = (newPersona: 'student' | 'faculty') => {
    soundFX.playClick();
    setPersona(newPersona);
    if (newPersona === 'faculty' && !isFacultyRoute) {
      router.push('/faculty/dashboard');
    } else if (newPersona === 'student' && isFacultyRoute) {
      router.push('/dashboard');
    }
  };

  const userInitials = useMemo(() => {
    if (activePersona === 'faculty') return 'FC';
    if (!studentProfile.fullName) return 'U';
    const parts = studentProfile.fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [studentProfile.fullName, activePersona]);

  const getPageTitle = () => {
    if (pathname === '/app') return 'Command center';
    if (pathname === '/app/tracker' || pathname === '/applications') return 'Applications';
    if (pathname === '/' || pathname === '/dashboard') return 'Overview';
    if (pathname === '/jobs') return 'Job search';
    if (pathname === '/tasks') return 'Goals & tasks';
    if (pathname === '/networking') return 'Networking';
    if (pathname === '/portfolio') return 'Portfolio & projects';
    if (pathname === '/suitability') return 'Role suitability';
    if (pathname === '/skills') return 'Skill gaps';
    if (pathname === '/roadmap') return 'Learning roadmap';
    if (pathname === '/analytics') return 'Career analytics';
    if (pathname === '/resume') return 'Resume studio';
    if (pathname === '/interviews/technical') return 'Technical studio';
    if (pathname === '/interviews/hr') return 'Behavioral studio';
    if (pathname === '/communication') return 'Communication lab';
    if (pathname === '/aptitude') return 'Aptitude arena';
    if (pathname === '/progress') return 'Readiness progress';
    if (pathname === '/coach') return 'AI career coach';
    if (pathname === '/notifications') return 'Notifications';
    if (pathname === '/settings') return 'Settings & integrations';
    if (pathname === '/profile') return 'Profile';
    if (pathname === '/faculty/dashboard') return 'Faculty dashboard';
    if (pathname.startsWith('/faculty/students')) return 'Cohort';
    return 'CareerOS';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left Section: Brand & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4">
          <MobileNav />
          <CareerOSLogo
            href={activePersona === 'faculty' ? '/faculty/dashboard' : '/dashboard'}
            size="md"
            imageClassName="h-6 sm:h-8"
            className="shrink-0"
          />

          <div className="hidden items-center gap-2 border-l border-[var(--border-default)] pl-4 text-xs font-medium text-[var(--text-muted)] md:flex">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
              {activePersona === 'faculty' ? 'Faculty portal' : 'Career workspace'}
            </span>
            <span>/</span>
            <span className="font-semibold text-[var(--text-primary)]">{getPageTitle()}</span>
          </div>
        </div>

        {/* Center: Target Role Switcher Pill (Students) or Placement Scope (Faculty) */}
        <div className="hidden lg:flex items-center gap-3">
          {activePersona === 'student' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-sm text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[var(--text-muted)]">Target:</span>
                <span className="font-semibold text-[var(--text-primary)]">{activeTargetRole?.title || 'Target Role'}</span>
                <Badge variant="cyan" className="ml-1 py-0 px-1.5 text-[10px]">
                  {readinessScores?.overall ?? 0}%
                </Badge>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-dim)]" />
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <div className="absolute top-full mt-2 w-72 p-2 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-2xl z-40 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-dim)] font-bold">
                      Switch Placement Target
                    </div>
                    {(targetRoles || []).map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          soundFX.playClick();
                          setTargetRole(role.id);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer',
                          activeTargetRole?.id === role.id
                            ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-white'
                        )}
                      >
                        <div className="truncate">
                          <p className="font-medium truncate">{role.title}</p>
                          <p className="text-[10px] text-[var(--text-dim)] font-mono">{role.salaryRange}</p>
                        </div>
                        {activeTargetRole.id === role.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Actions, AI Copilot Trigger, Persona Switch, User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-secondary)] hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 font-mono text-[9px] font-bold text-[#061018]">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              soundFX.playClick();
              toggleAiCoach();
            }}
            className="hidden gap-2 border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-300 hover:text-white sm:flex"
            leftIcon={<Bot className="h-4 w-4 text-cyan-400" />}
          >
            AI coach
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundActive ? 'Mute Interface Sound' : 'Enable Interface Sound'}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Persona Switch Toggle */}
          <div className="hidden items-center p-0.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)] sm:flex">
            <button
              type="button"
              onClick={() => handlePersonaSwitch('student')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                activePersona === 'student'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handlePersonaSwitch('faculty')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                activePersona === 'faculty'
                  ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              Faculty
            </button>
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-[#0e1420] rounded-[10px] flex items-center justify-center text-xs font-bold text-cyan-300 font-mono">
                {userInitials}
              </div>
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-2xl z-40 space-y-1">
                  <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {studentProfile.fullName || 'CareerOS User'}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate font-mono">
                      {studentProfile.email || 'user@careeros.ai'}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => {
                      soundFX.playClick();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Profile & Credentials</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setIsUserMenuOpen(false);
                      if (confirm('Are you sure you want to sign out?')) {
                        signOut();
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
