'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bot, 
  Sparkles,
  Volume2, 
  VolumeX, 
  ChevronDown,
  Briefcase,
  GraduationCap,
  Users2,
  LogOut,
  User,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
    signOut
  } = useApp();

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
    if (pathname === '/' || pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/suitability') return 'Role Suitability';
    if (pathname === '/skills') return 'Skill Gap Matrix';
    if (pathname === '/roadmap') return 'Personalized Roadmap';
    if (pathname === '/resume') return 'ATS Resume Optimizer';
    if (pathname === '/interviews/technical') return 'AI Technical Studio';
    if (pathname === '/interviews/hr') return 'STAR Behavioral Studio';
    if (pathname === '/communication') return 'Communication Lab';
    if (pathname === '/aptitude') return 'Aptitude Arena';
    if (pathname === '/progress') return 'Readiness Telemetry';
    if (pathname === '/coach') return 'AI Career Strategist';
    if (pathname === '/profile') return 'Profile & Settings';
    if (pathname === '/faculty/dashboard') return 'Dean & Placement Console';
    if (pathname.startsWith('/faculty/students')) return 'Cohort Directory';
    return 'Career Intelligence';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Breadcrumb */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#06090e] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono">
              Career<span className="text-cyan-400">OS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] border-l border-[var(--border-default)] pl-4">
            <span className="text-[var(--text-dim)] uppercase tracking-wider font-mono text-[10px]">
              {activePersona === 'faculty' ? 'FACULTY PORTAL' : 'STUDENT CONSOLE'}
            </span>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-semibold">{getPageTitle()}</span>
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
                <span className="font-semibold text-[var(--text-primary)]">{activeTargetRole.title}</span>
                <Badge variant="cyan" className="ml-1 py-0 px-1.5 text-[10px]">
                  {readinessScores.overall}%
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
                    {targetRoles.map((role) => (
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
                          activeTargetRole.id === role.id
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
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* AI Copilot Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              toggleAiCoach();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">AI Copilot</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              ⌘J
            </span>
          </button>

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
          <div className="flex items-center p-0.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)]">
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
