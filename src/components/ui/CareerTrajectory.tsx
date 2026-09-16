'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface Waypoint {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'upcoming';
  progress: number; // 0 to 100
}

interface CareerTrajectoryProps {
  progress?: number; // 0 to 100 overall readiness progress
  interactive?: boolean;
  waypoints?: Waypoint[];
  className?: string;
  variant?: 'hero' | 'compact' | 'horizontal';
  onSelectWaypoint?: (id: string) => void;
}

const DEFAULT_WAYPOINTS: Waypoint[] = [
  { id: 'profile', label: 'Profile Ingestion', status: 'completed', progress: 100 },
  { id: 'skills', label: 'Skill Matrix', status: 'completed', progress: 100 },
  { id: 'roadmap', label: 'Adaptive Roadmap', status: 'active', progress: 65 },
  { id: 'interview', label: 'AI Mock Interviews', status: 'active', progress: 50 },
  { id: 'readiness', label: '78% Readiness Gate', status: 'active', progress: 78 },
  { id: 'placement', label: 'Recruiter Dispatch', status: 'upcoming', progress: 0 },
];

export function CareerTrajectory({
  progress = 72,
  interactive = true,
  waypoints = DEFAULT_WAYPOINTS,
  className,
  variant = 'horizontal',
  onSelectWaypoint
}: CareerTrajectoryProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div className={cn('relative w-full overflow-hidden select-none', className)}>
      {variant === 'horizontal' ? (
        <div className="relative w-full py-8">
          {/* Subtle background track */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-slate-800/80" />

          {/* Active continuous glowing trajectory line */}
          <motion.div 
            className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-400 shadow-[0_0_16px_rgba(6,182,212,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(10, progress))}%` }}
            transition={{ duration: prefersReduced ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Waypoints along the trajectory */}
          <div className="relative flex justify-between items-center z-10">
            {waypoints.map((wp, idx) => {
              const isPassed = wp.status === 'completed';
              const isActive = wp.status === 'active';

              return (
                <div 
                  key={wp.id} 
                  onClick={() => onSelectWaypoint && onSelectWaypoint(wp.id)}
                  className={cn(
                    'group flex flex-col items-center cursor-pointer transition-all duration-300',
                    interactive && 'hover:-translate-y-1'
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Living halo on active node */}
                    {isActive && (
                      <span className="absolute -inset-2 rounded-full bg-cyan-500/20 animate-ping opacity-75" />
                    )}

                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 border',
                      isPassed 
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                        : isActive 
                        ? 'bg-slate-900 text-cyan-300 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.8)]' 
                        : 'bg-slate-900 text-slate-500 border-slate-700'
                    )}>
                      {idx + 1}
                    </div>
                  </div>

                  <span className={cn(
                    'mt-2.5 text-[11px] font-mono tracking-tight text-center max-w-[90px] transition-colors',
                    isPassed ? 'text-slate-200 font-medium' : isActive ? 'text-cyan-300 font-semibold' : 'text-slate-500'
                  )}>
                    {wp.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Evolving Hero Trajectory for Landing Page */
        <div className="relative w-full h-48 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 200" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trajectoryGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
              </linearGradient>
              <filter id="bloom">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background path */}
            <path
              d="M 50,150 Q 200,30 400,100 T 750,40"
              stroke="rgba(30, 41, 59, 0.6)"
              strokeWidth="3"
              fill="none"
            />

            {/* Glowing trajectory curve */}
            <motion.path
              d="M 50,150 Q 200,30 400,100 T 750,40"
              stroke="url(#trajectoryGlow)"
              strokeWidth="4"
              fill="none"
              filter="url(#bloom)"
              strokeDasharray="900"
              initial={{ strokeDashoffset: 900 }}
              animate={{ strokeDashoffset: 900 - (900 * (progress / 100)) }}
              transition={{ duration: prefersReduced ? 0 : 2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Key waypoint nodes */}
            <circle cx="50" cy="150" r="6" fill="#06B6D4" className="animate-pulse" />
            <circle cx="400" cy="100" r="7" fill="#8B5CF6" className="drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
            <circle cx="750" cy="40" r="8" fill="#F59E0B" className="drop-shadow-[0_0_16px_rgba(245,158,11,0.9)]" />
          </svg>
        </div>
      )}
    </div>
  );
}
