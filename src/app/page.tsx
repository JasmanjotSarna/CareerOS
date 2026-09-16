'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Code2, 
  Mic, 
  Target, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Users2, 
  Play, 
  Bot,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { CareerButton } from '@/components/ui/CareerButton';
import { MetricDisplay } from '@/components/ui/MetricDisplay';
import { AIOrb } from '@/components/ui/AIOrb';
import { GlowCard } from '@/components/ui/GlowCard';
import { CareerTrajectory } from '@/components/ui/CareerTrajectory';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { soundFX } from '@/components/effects/SoundFX';

export default function LandingPage() {
  const { setPersona, targetRoles } = useApp();
  const prefersReduced = usePrefersReducedMotion();

  // Scroll tracking for decoupled trajectory stages
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Stages in the Lusion-inspired trajectory
  const stages = [
    { id: 'profile', label: 'Profile Ingestion', metric: '100%', detail: 'Autonomous academic transcript & GitHub parse' },
    { id: 'skills', label: 'Skill Matrix', metric: '82%', detail: 'Granular diagnosis against target role benchmarks' },
    { id: 'roadmap', label: 'Adaptive Roadmap', metric: 'Week 2', detail: 'Personalized sprint sequence closing critical gaps' },
    { id: 'interview', label: 'AI Mock Interviews', metric: 'O(N)', detail: 'Live conversational coding & STAR behavioral feedback' },
    { id: 'readiness', label: 'Placement Gate', metric: '78%', detail: 'Deterministic multi-dimensional readiness score' },
    { id: 'placement', label: 'Recruiter Dispatch', metric: 'Tier 1', detail: 'High-confidence campus placement allocation' },
  ];

  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Interactive Live Teaser state
  const [activeTeaser, setActiveTeaser] = useState<'suitability' | 'coding' | 'speaking'>('suitability');
  const [codeRunSuccess, setCodeRunSuccess] = useState(false);

  const handleRunCode = () => {
    soundFX.playClick();
    setCodeRunSuccess(false);
    setTimeout(() => {
      soundFX.playSuccess();
      setCodeRunSuccess(true);
    }, 600);
  };

  const handleLaunchStudent = () => {
    soundFX.playClick();
    setPersona('student');
  };

  const handleLaunchFaculty = () => {
    soundFX.playClick();
    setPersona('faculty');
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#070A0F] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Decoupled Ambient Background Gradient Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[160px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#070A0F]/70 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-cyan-950/40 border border-cyan-500/30">
              <Image 
                src="/careeros-logo.png" 
                alt="CareerOS Logo" 
                width={28} 
                height={28} 
                className="object-contain"
                priority
              />
            </div>
            <span className="font-mono text-base font-extrabold tracking-tight text-white">
              Career<span className="text-cyan-400">OS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-slate-400">
            <a href="#trajectory" className="hover:text-cyan-300 transition-colors">TRAJECTORY</a>
            <a href="#architecture" className="hover:text-cyan-300 transition-colors">INTELLIGENCE</a>
            <a href="#interactive" className="hover:text-cyan-300 transition-colors">STUDIO</a>
            <a href="#faculty" className="hover:text-cyan-300 transition-colors">FACULTY</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" onClick={handleLaunchFaculty}>
              <span className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 transition-colors hidden sm:inline-block">
                Faculty Portal
              </span>
            </Link>
            <Link href="/login" onClick={handleLaunchStudent}>
              <CareerButton variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch App
              </CareerButton>
            </Link>
          </div>
        </div>
      </header>

      {/* 1. CINEMATIC HERO: Lusion Trajectory + Apple Restraint */}
      <section className="relative pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        {/* Subtle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>The Intelligence Layer Between Students & Employment</span>
        </motion.div>

        {/* Hero Title with Generous Scale */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white max-w-5xl leading-[0.95]"
        >
          From Student to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-300">
            Job-Ready.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed"
        >
          Continuous career readiness powered by real-time AI interviews, deterministic gap diagnostics, and adaptive learning trajectories.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/dashboard" onClick={handleLaunchStudent}>
            <CareerButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Job-Ready
            </CareerButton>
          </Link>
          <a href="#trajectory">
            <CareerButton variant="secondary" size="lg">
              Explore Trajectory
            </CareerButton>
          </a>
        </motion.div>

        {/* Hero Central Trajectory Visual (The Signature Line) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full mt-16 max-w-4xl"
        >
          <GlowCard className="p-6 md:p-8 backdrop-blur-xl bg-[#0B0F16]/90">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3 text-left">
                <AIOrb size={42} state="idle" readinessTrend={8} />
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">Autonomous Career Trajectory</h4>
                  <p className="text-xs text-slate-400">Target Role: Software Engineer — SDE-1</p>
                </div>
              </div>
              <MetricDisplay value={78} suffix="%" label="Overall Readiness" size="sm" highlight="cyan" />
            </div>

            <div className="pt-4">
              <CareerTrajectory progress={78} variant="horizontal" onSelectWaypoint={(id) => {
                const idx = stages.findIndex(s => s.id === id);
                if (idx !== -1) setActiveStageIndex(idx);
              }} />
            </div>
          </GlowCard>
        </motion.div>
      </section>

      {/* 2. TRAJECTORY STAGES (Lusion Storytelling: Profile -> Placement) */}
      <section id="trajectory" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">The Evolution</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            One Single Trajectory. Six Deterministic Gates.
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Unlike disjointed placement portals, CareerOS connects every practice drill and interview response into a unified readiness loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage, i) => (
            <GlowCard 
              key={stage.id} 
              className="p-6 transition-all duration-300 hover:border-cyan-500/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">STAGE 0{i + 1}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-cyan-300 border border-white/[0.08]">
                  {stage.metric}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono mb-2">{stage.label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{stage.detail}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE STUDIO DEMO (Apple Presentation + Active Theory Restraint) */}
      <section id="interactive" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">Studio Environment</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Experience the Intelligence Layer
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Preview real-time job suitability analysis, technical interview code diagnostics, and speaking lab metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/[0.08] self-start">
            <button
              onClick={() => setActiveTeaser('suitability')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTeaser === 'suitability' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Job Suitability
            </button>
            <button
              onClick={() => setActiveTeaser('coding')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTeaser === 'coding' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Live Coding
            </button>
            <button
              onClick={() => setActiveTeaser('speaking')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTeaser === 'speaking' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Speaking Lab
            </button>
          </div>
        </div>

        <GlowCard className="p-8 md:p-10 bg-[#0B0F16]/95 border border-white/[0.12]">
          {activeTeaser === 'suitability' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4">
                <MetricDisplay value={82} suffix="%" label="Target Role Match" sublabel="Software Engineer — SDE-1" highlight="cyan" size="lg" trend={4} />
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Benchmarked against 4,200+ campus hiring rounds. High alignment in core Python and system foundations; critical gap identified in multi-table SQL queries.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Skills Alignment</span>
                    <span className="text-cyan-300 font-bold">85%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Competencies (4)</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li>• Python Algorithms (85% proficiency)</li>
                    <li>• Data Structures & Complexity (82%)</li>
                    <li>• RESTful API Microservices (80%)</li>
                    <li>• Git Version Control & CI/CD (88%)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold mb-2">
                    <Target className="w-4 h-4" />
                    <span>Priority Skill Gaps (2)</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li>• Multi-Table SQL Joins & Window Functions (Critical, -25%)</li>
                    <li>• System Design Caching & Redis (High, -18%)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTeaser === 'coding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-white font-bold">First Duplicate Element in an Array</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    O(N) Time
                  </span>
                  <CareerButton variant="primary" size="sm" onClick={handleRunCode} leftIcon={<Play className="w-3 h-3" />}>
                    Execute Test
                  </CareerButton>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-200 overflow-x-auto border border-white/[0.06] leading-relaxed">
{`def first_duplicate(nums: list[int]) -> int:
    seen = set()
    for num in nums:
        if num in seen:
            return num
        seen.add(num)
    return -1`}
              </pre>

              {codeRunSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between"
                >
                  <span>✓ 5/5 Test Cases Passed in 14ms (Optimal Time & Space Complexity)</span>
                  <span className="font-bold">+4 Readiness Points Earned</span>
                </motion.div>
              )}
            </div>
          )}

          {activeTeaser === 'speaking' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <Mic className="w-8 h-8 text-cyan-400 mb-3 animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Speaking Cadence</span>
                <span className="text-3xl font-extrabold text-white font-mono mt-1">134 WPM</span>
                <span className="text-[11px] text-emerald-400 mt-1">Optimal Range (125-150)</span>
              </div>

              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <Flame className="w-8 h-8 text-amber-400 mb-3" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Filler Word Rate</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1">2.1%</span>
                <span className="text-[11px] text-slate-400 mt-1">3 fillers in 90 seconds</span>
              </div>

              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <ShieldCheck className="w-8 h-8 text-violet-400 mb-3" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Clarity Score</span>
                <span className="text-3xl font-extrabold text-violet-400 font-mono mt-1">88 / 100</span>
                <span className="text-[11px] text-slate-400 mt-1">STAR Method Structured</span>
              </div>
            </div>
          )}
        </GlowCard>
      </section>

      {/* 4. FACULTY / COHORT INTELLIGENCE */}
      <section id="faculty" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Institution Portal</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Placement Department Cohort Analytics
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Dean and placement directors gain deep observability into 842 students across CSE and IT branches. Identify systemic skill deficits 60 days before recruiters arrive.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-300"><strong className="text-white">Early Risk Detection:</strong> Auto-flags students with &lt;45% readiness before drive commencement.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <p className="text-xs text-slate-300"><strong className="text-white">1-Click Interventions:</strong> Automatically schedules mock remedial drills and counselor 1-on-1s.</p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/faculty/dashboard" onClick={handleLaunchFaculty}>
                <CareerButton variant="secondary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Open Faculty Dashboard
                </CareerButton>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <GlowCard className="p-6 md:p-8 bg-[#0B0F16]/90 border border-white/[0.12]">
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-white/[0.08] text-center">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Total Cohort</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">842</div>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Avg Readiness</span>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1">58%</div>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">At-Risk</span>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">113</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Cohort Skill Bottlenecks</span>
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">System Design (72% Deficit)</span>
                    <span className="text-amber-400 font-bold">606 Students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[72%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">Multi-Table SQL (61% Deficit)</span>
                    <span className="text-cyan-400 font-bold">514 Students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[61%]" />
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-28 px-6 max-w-5xl mx-auto text-center relative z-10 border-t border-white/[0.06]">
        <div className="flex justify-center mb-6">
          <AIOrb size={80} state="idle" readinessTrend={10} />
        </div>
        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
          Begin Your Career Trajectory Today.
        </h2>
        <p className="text-base text-slate-400 max-w-xl mx-auto mt-4">
          Eliminate placement anxiety with continuous AI readiness scoring, targeted practice sprints, and mock interview simulations.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup" onClick={handleLaunchStudent}>
            <CareerButton variant="momentum" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Student Account
            </CareerButton>
          </Link>
          <Link href="/login" onClick={handleLaunchStudent}>
            <CareerButton variant="ghost" size="lg">
              Sign In (Demo Account)
            </CareerButton>
          </Link>
        </div>
      </section>

      {/* Clean Minimal Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06] text-center text-xs font-mono text-slate-500">
        <p>© 2026 CareerOS Intelligence. From Student to Job-Ready. Built for high-velocity universities.</p>
      </footer>
    </div>
  );
}
