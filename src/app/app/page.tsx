'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Target,
  GitPullRequest,
  Map,
  FileCheck,
  Code2,
  Users2,
  Brain,
  Mic,
  Columns3,
  Briefcase,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';

export default function AppCommandCenterPage() {
  const {
    studentProfile,
    activeTargetRole,
    readinessScores,
    roadmapWeeks,
    resumeData,
  } = useApp();

  const { state } = useWorkspace();

  const totalApplications = state.applications.length;
  const activeInterviews = state.applications.filter(
    (a) => a.status === 'interview' || a.status === 'assessment'
  ).length;

  const currentRole = activeTargetRole?.title || 'SDE-1 (Full-Stack / Backend)';
  const overallScore = readinessScores?.overall || 62;

  // Next prioritized actions
  const dailyActions = [
    {
      id: '01',
      title: 'Complete SQL Joins & Subqueries Module',
      duration: '45 mins',
      impact: '+2.5% Technical Readiness',
      reason: 'Identified as the highest deficit in your technical profile against the benchmark.',
      href: '/roadmap',
      badge: 'Skill Deficit',
      color: 'text-[#4361EE] border-[#4361EE]/30 bg-[#4361EE]/10',
    },
    {
      id: '02',
      title: 'Practice Arrays & Hashing Technical Mock',
      duration: '30 mins',
      impact: '+2.0% Interview Readiness',
      reason: 'Last mock round flagged suboptimal timeboxing and missed optimal hashmap complexity.',
      href: '/interviews/technical',
      badge: 'Technical Mock',
      color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    },
    {
      id: '03',
      title: 'Run 15-Minute STAR Behavioral Drill',
      duration: '15 mins',
      impact: '+1.5% HR Readiness',
      reason: 'Prepare structured Situation-Task-Action-Result narratives for upcoming interviews.',
      href: '/interviews/hr',
      badge: 'HR & Fit',
      color: 'text-[#FF6B6B] border-[#FF6B6B]/30 bg-[#FF6B6B]/10',
    },
  ];

  const quickArenas = [
    {
      title: 'Resume Studio',
      desc: 'ATS scan & keyword alignment',
      score: resumeData?.atsScore ? `${resumeData.atsScore}%` : '78%',
      href: '/resume',
      icon: FileCheck,
      color: 'text-[#4361EE]',
    },
    {
      title: 'Technical Studio',
      desc: 'Live algorithmic coding arena',
      score: `${readinessScores?.technical || 58}%`,
      href: '/interviews/technical',
      icon: Code2,
      color: 'text-cyan-400',
    },
    {
      title: 'Behavioral Studio',
      desc: 'STAR framework HR practice',
      score: `${readinessScores?.hr || 56}%`,
      href: '/interviews/hr',
      icon: Users2,
      color: 'text-[#FF6B6B]',
    },
    {
      title: 'Aptitude Arena',
      desc: 'DSA & analytical reasoning drills',
      score: `${readinessScores?.aptitude || 70}%`,
      href: '/aptitude',
      icon: Brain,
      color: 'text-emerald-400',
    },
    {
      title: 'Communication Lab',
      desc: 'Speech cadence & clarity analysis',
      score: `${readinessScores?.communication || 64}%`,
      href: '/communication',
      icon: Mic,
      color: 'text-violet-400',
    },
    {
      title: 'Application Tracker',
      desc: '8-stage recruitment pipeline',
      score: `${totalApplications} Tracked`,
      href: '/app/tracker',
      icon: Columns3,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B18] text-[#F8F9FA]">
      <TopNav />
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6">
        <StudentSidebar />

        <main className="min-w-0 flex-1 space-y-8 py-6 lg:py-8 lg:pl-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#131D33] to-[#0F172A] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#94A3B8]">Career Command Center</span>
                <span className="text-white font-bold">Live Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Welcome back, {studentProfile?.fullName || 'Candidate'}.
              </h1>
              <p className="text-sm text-[#94A3B8] max-w-xl">
                Targeting <strong className="text-white">{currentRole}</strong>. Here is your daily diagnostic breakdown, prioritized tasks, and active application pipeline.
              </p>
            </div>

            {/* Overall Score Gauge Card */}
            <div className="p-5 rounded-2xl bg-[#0B132B]/90 border border-white/10 flex items-center gap-5 flex-shrink-0">
              <div className="text-center">
                <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] block">
                  Overall Readiness
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-4xl font-mono font-bold text-white tabular-nums">
                    {overallScore}
                  </span>
                  <span className="text-lg font-mono text-[#4361EE] font-bold">%</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 mt-0.5 block">
                  +4% this week
                </span>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div className="space-y-1 font-mono text-xs text-[#94A3B8]">
                <div>Tech: <strong className="text-white">{readinessScores?.technical || 58}%</strong></div>
                <div>Aptitude: <strong className="text-white">{readinessScores?.aptitude || 70}%</strong></div>
                <div>HR & Comm: <strong className="text-white">{readinessScores?.communication || 64}%</strong></div>
              </div>
            </div>
          </div>

          {/* Today's Prioritized Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
                  Daily Execution Plan
                </span>
                <h2 className="text-xl font-serif font-bold text-white">
                  Today&apos;s Prioritized Moves
                </h2>
              </div>
              <Link
                href="/roadmap"
                className="text-xs font-mono text-[#4361EE] hover:underline flex items-center gap-1"
              >
                View Full 12-Week Roadmap →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {dailyActions.map((action) => (
                <div
                  key={action.id}
                  className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#4361EE]/40 hover:bg-[#131D33]"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#FF6B6B]">{action.id}</span>
                      <h3 className="text-sm sm:text-base font-bold text-white">{action.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] border ${action.color}`}>
                        {action.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      <strong className="text-white">Reason:</strong> {action.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 font-mono text-xs">
                    <div className="text-right">
                      <span className="text-emerald-400 font-semibold block">{action.impact}</span>
                      <span className="text-[#94A3B8] text-[11px]">{action.duration}</span>
                    </div>
                    <Link
                      href={action.href}
                      className="px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white font-medium text-xs transition-colors flex items-center gap-1"
                    >
                      Start Task →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Arena Navigation Grid */}
          <div className="space-y-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] block">
                Integrated Modules
              </span>
              <h2 className="text-xl font-serif font-bold text-white">
                Practice Arenas & Workspaces
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickArenas.map((arena) => {
                const Icon = arena.icon;
                return (
                  <Link
                    key={arena.title}
                    href={arena.href}
                    className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 flex flex-col justify-between space-y-4 transition-all hover:border-white/25 hover:bg-[#131D33] group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <Icon className={`w-5 h-5 ${arena.color}`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-[#4361EE] transition-colors">
                            {arena.title}
                          </h3>
                          <p className="text-xs text-[#94A3B8] mt-0.5">{arena.desc}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                      <span className="text-[#94A3B8]">Status:</span>
                      <span className="text-white font-bold">{arena.score}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Application Pipeline Quick Bar */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
                  Pipeline Tracking
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Active Recruitment Lifecycle
                </h3>
              </div>
              <Link
                href="/app/tracker"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold border border-white/10 transition-colors"
              >
                Open Kanban Board →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center font-mono text-xs">
              {[
                { stage: 'Saved', count: state.applications.filter((a) => a.status === 'saved').length },
                { stage: 'Preparing', count: state.applications.filter((a) => a.status === 'preparing').length },
                { stage: 'Applied', count: state.applications.filter((a) => a.status === 'applied').length },
                { stage: 'Assessment', count: state.applications.filter((a) => a.status === 'assessment').length },
                { stage: 'Interview', count: state.applications.filter((a) => a.status === 'interview').length },
                { stage: 'Offer', count: state.applications.filter((a) => a.status === 'offer').length },
                { stage: 'Rejected', count: state.applications.filter((a) => a.status === 'rejected').length },
                { stage: 'Withdrawn', count: state.applications.filter((a) => a.status === 'withdrawn').length },
              ].map((s) => (
                <div key={s.stage} className="p-3 rounded-xl bg-[#1E293B]/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#94A3B8] block">{s.stage}</span>
                  <span className="text-lg font-bold text-white block">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
