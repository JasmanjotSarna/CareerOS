'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bot, 
  GraduationCap, 
  Building2, 
  Briefcase,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { cn } from '@/lib/utils';
import { soundFX } from '@/components/effects/SoundFX';

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
    resetDemoData,
    cohortKPIs 
  } = useApp();

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

  // Human readable page titles for breadcrumb
  const getPageContext = () => {
    if (pathname === '/' || pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/suitability') return 'Job Suitability';
    if (pathname === '/skills') return 'Skill Gap Analysis';
    if (pathname === '/roadmap') return 'Personalized Roadmap';
    if (pathname === '/resume') return 'ATS Resume Optimizer';
    if (pathname === '/interviews/technical') return 'Technical Interview';
    if (pathname === '/interviews/hr') return 'HR Interview (STAR)';
    if (pathname === '/communication') return 'Communication Lab';
    if (pathname === '/aptitude') return 'Aptitude & DSA Arena';
    if (pathname === '/progress') return 'Readiness & Progress';
    if (pathname === '/coach') return 'AI Career Coach';
    if (pathname === '/profile') return 'Profile & Settings';
    if (pathname === '/faculty/dashboard') return 'Placement Cohort Intelligence';
    if (pathname.startsWith('/faculty/students')) return 'Student Directory';
    return 'Placement Intelligence';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e293b] bg-[#080b12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand Logo & Page Context Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-white shadow-sm border border-slate-200 group-hover:shadow transition-shadow">
              <Image
                src="/brand/careeros-logo.png"
                alt="CareerOS"
                width={105}
                height={30}
                className="object-contain h-6 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Breadcrumb divider and Page Context */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium font-sans">
              {getPageContext()}
            </span>
          </div>
        </div>

        {/* Center: Clean Persona Switcher */}
        <div className="flex items-center bg-[#0d121d] p-0.5 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => handlePersonaSwitch('student')}
            onMouseEnter={() => soundFX.playHover()}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
              activePersona === 'student'
                ? 'bg-[#161f30] text-cyan-300 border border-[#2e3b52] shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Student</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950/80 text-cyan-400 rounded font-mono font-bold">
              {readinessScores.overall}%
            </span>
          </button>

          <button
            onClick={() => handlePersonaSwitch('faculty')}
            onMouseEnter={() => soundFX.playHover()}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
              activePersona === 'faculty'
                ? 'bg-[#161f30] text-purple-300 border border-[#2e3b52] shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Faculty</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-purple-950/80 text-purple-300 rounded font-mono font-bold">
              842
            </span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Target Role Selector (Student view) */}
          {activePersona === 'student' && (
            <div className="hidden lg:flex items-center gap-1.5 bg-[#0d121d] border border-[#1e293b] px-2.5 py-1 rounded-lg text-xs">
              <Briefcase className="w-3 h-3 text-cyan-400 shrink-0" />
              <select
                aria-label="Target Career Goal"
                value={activeTargetRole.id}
                onChange={(e) => {
                  soundFX.playClick();
                  setTargetRole(e.target.value);
                }}
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
              >
                {targetRoles.map(role => (
                  <option key={role.id} value={role.id} className="bg-[#111724] text-white">
                    {role.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* AI Career Coach Quick Launcher */}
          <button
            onClick={() => {
              soundFX.playClick();
              toggleAiCoach(true);
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all text-xs font-semibold cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-3.5 h-3.5 text-cyan-300" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={() => soundFX.playHover()}
            className="p-1.5 rounded-lg bg-[#0d121d] hover:bg-[#161f30] border border-[#1e293b] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            title={soundActive ? "Audio Feedback: On" : "Audio Feedback: Muted"}
          >
            {soundActive ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              if (confirm('Reset CareerOS demo state back to baseline?')) {
                resetDemoData();
                soundFX.playSuccess();
              }
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="p-1.5 rounded-lg bg-[#0d121d] hover:bg-[#161f30] border border-[#1e293b] text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            title="Reset Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile Pill */}
          <Link
            href={activePersona === 'student' ? '/profile' : '/faculty/dashboard'}
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-[#0d121d] border border-[#1e293b] hover:border-[#2e3b52] transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-[10px] text-white">
              {activePersona === 'student' ? 'JS' : 'FD'}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden sm:inline leading-none">
              {activePersona === 'student' ? studentProfile.fullName.split(' ')[0] : 'Placement Dean'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
