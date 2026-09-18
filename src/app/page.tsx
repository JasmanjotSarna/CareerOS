'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Mic, 
  Target, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Users2, 
  Bot,
  Flame,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Brain,
  Terminal
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatMetric } from '@/components/ui/StatMetric';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { HighlightGrid, SpotlightCard } from '@/components/ui/HighlightGrid';
import { HaikeiHeroMesh, HaikeiWaveDivider } from '@/components/visuals/HaikeiBackgrounds';
import { soundFX } from '@/components/effects/SoundFX';

export default function LandingPage() {
  const { setPersona } = useApp();
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'suitability' | 'coding' | 'resume'>('suitability');

  const handleLaunchStudent = () => {
    soundFX.playClick();
    setPersona('student');
  };

  const handleLaunchFaculty = () => {
    soundFX.playClick();
    setPersona('faculty');
  };

  const stages = [
    { number: '01', title: 'Vector Ingestion', desc: 'Autonomous transcript, GitHub repository & ATS resume synthesis.' },
    { number: '02', title: 'Competency Diagnosis', desc: 'Granular skill gap analysis against top tech hiring rubrics.' },
    { number: '03', title: 'Adaptive Sprint Roadmap', desc: 'Personalized weekly milestones closing high-priority technical gaps.' },
    { number: '04', title: 'Live AI Mock Interviews', desc: 'Continuous O(N) technical coding and STAR behavioral drills.' },
    { number: '05', title: 'Deterministic Readiness Gate', desc: '78%+ verified multi-dimensional score guaranteeing placement readiness.' }
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Haikei Background Organic Mesh */}
      <HaikeiHeroMesh />

      {/* Global Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#06090e] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-mono text-base font-extrabold tracking-tight text-white">
              Career<span className="text-cyan-400">OS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-[var(--text-muted)]">
            <a href="#features" className="hover:text-cyan-300 transition-colors">CAPABILITIES</a>
            <a href="#interactive" className="hover:text-cyan-300 transition-colors">LIVE STUDIO</a>
            <a href="#trajectory" className="hover:text-cyan-300 transition-colors">TRAJECTORY</a>
            <a href="#faculty" className="hover:text-cyan-300 transition-colors">FACULTY PORTAL</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" onClick={handleLaunchFaculty}>
              <span className="text-xs font-mono text-[var(--text-muted)] hover:text-white px-3 py-1.5 transition-colors hidden sm:inline-block">
                Dean & Faculty
              </span>
            </Link>
            <Link href="/login" onClick={handleLaunchStudent}>
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={handleLaunchStudent}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 text-center max-w-5xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>AUTONOMOUS CAREER READINESS & PLACEMENT ENGINE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]"
        >
          From University Student to{' '}
          <span className="gradient-text-accent">High-Growth Job Ready.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed"
        >
          CareerOS is the intelligence layer between university engineering and elite employment — continuously calculating role fit, closing skill deficits, optimizing resumes, and running live AI interview simulations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" onClick={handleLaunchStudent}>
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch Career Trajectory
            </Button>
          </Link>
          <Link href="/faculty/dashboard" onClick={handleLaunchFaculty}>
            <Button variant="secondary" size="lg" leftIcon={<Building2 className="w-4 h-4 text-indigo-400" />}>
              Placement Director Console
            </Button>
          </Link>
        </motion.div>

        {/* Floating Key Metrics Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <SpotlightCard className="text-center p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
              <AnimatedCounter value={78} suffix="%+" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">Placement Gate Standard</div>
          </SpotlightCard>
          <SpotlightCard className="text-center p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">
              <AnimatedCounter value={4.2} decimals={1} suffix="x" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">Faster Interview Callback</div>
          </SpotlightCard>
          <SpotlightCard className="text-center p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              <AnimatedCounter value={92} suffix="%" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">ATS Keyword Alignment</div>
          </SpotlightCard>
          <SpotlightCard className="text-center p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              <AnimatedCounter value={100} suffix="%" />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">Deterministic Scoring</div>
          </SpotlightCard>
        </motion.div>
      </section>

      {/* Interactive Studio Preview Section */}
      <section id="interactive" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Badge variant="cyan" pulse className="mb-3">
            INTERACTIVE CAPABILITIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            The Autonomous Readiness Suite
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xl mx-auto">
            Experience how CareerOS accelerates student readiness with instant feedback loops.
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] flex gap-2">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveInteractiveTab('suitability');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeInteractiveTab === 'suitability'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Role Suitability Vector
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveInteractiveTab('coding');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeInteractiveTab === 'coding'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Live AI Coding Studio
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveInteractiveTab('resume');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeInteractiveTab === 'resume'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              ATS Resume Rewriter
            </button>
          </div>
        </div>

        {/* Interactive Display Card */}
        <Card className="p-8 bg-[var(--surface-primary)]/90 border border-[var(--border-default)] shadow-2xl">
          <AnimatePresence mode="wait">
            {activeInteractiveTab === 'suitability' && (
              <motion.div
                key="suitability"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                <div className="md:col-span-5 text-center md:text-left space-y-4">
                  <Badge variant="cyan">Multi-Vector Alignment</Badge>
                  <h3 className="text-2xl font-bold text-white">
                    Software Engineer — SDE-1
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Evaluated across 5 key dimensions against 840+ successful campus hiring rubrics.
                  </p>
                  <div className="pt-2">
                    <Link href="/suitability" onClick={handleLaunchStudent}>
                      <Button variant="primary" size="md">
                        Explore Suitability Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  {[
                    { label: 'Technical Proficiency (Algorithms & Backend)', score: 78, color: 'from-cyan-500 to-blue-500' },
                    { label: 'Project Depth & Production Complexity', score: 85, color: 'from-indigo-500 to-purple-500' },
                    { label: 'Academic & CS Fundamentals (OS, DBMS, CN)', score: 90, color: 'from-emerald-500 to-teal-500' },
                    { label: 'ATS Resume Keyword Matching', score: 72, color: 'from-amber-500 to-orange-500' },
                  ].map((dim, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-[var(--text-secondary)]">{dim.label}</span>
                        <span className="font-mono text-white">{dim.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${dim.color} rounded-full`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeInteractiveTab === 'coding' && (
              <motion.div
                key="coding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">Live Coding Terminal — Two Sum II</span>
                  </div>
                  <Badge variant="momentum">O(N) Time Complexity Target</Badge>
                </div>
                <div className="p-4 rounded-xl bg-[#090d16] font-mono text-xs text-slate-300 border border-[var(--border-subtle)] overflow-x-auto">
                  <pre>{`def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`}</pre>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Passed all 14 test cases in 12ms
                  </span>
                  <Link href="/interviews/technical" onClick={handleLaunchStudent}>
                    <Button variant="primary" size="sm">
                      Start Full AI Interview
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {activeInteractiveTab === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">ATS Bullet Optimization</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">+18% ATS Score Lift</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-200">
                    <p className="font-mono text-[10px] text-red-400 uppercase font-bold mb-1">Before (Vague)</p>
                    <p>"Built backend services for the web application and fixed database bugs."</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-200">
                    <p className="font-mono text-[10px] text-emerald-400 uppercase font-bold mb-1">After (Quantified Impact)</p>
                    <p>"Architected modular FastAPI backend services with Redis caching, boosting endpoint throughput by 34%."</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link href="/resume" onClick={handleLaunchStudent}>
                    <Button variant="primary" size="sm">
                      Upload & Scan Your Resume
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </section>

      {/* Trajectory Sequence */}
      <section id="trajectory" className="py-20 px-6 max-w-6xl mx-auto relative z-10 border-t border-[var(--border-subtle)]">
        <div className="text-center mb-16">
          <Badge variant="indigo" className="mb-3">
            DETERMINISTIC PATHWAY
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How CareerOS Gets You Hired
          </h2>
        </div>

        <HighlightGrid className="rounded-3xl p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stages.map((st, i) => (
              <GlowCard key={i} glowColor="indigo" className="p-5 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-2xl font-black text-indigo-400 block mb-2">{st.number}</span>
                  <h4 className="text-sm font-bold text-white mb-1.5">{st.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{st.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </HighlightGrid>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">CareerOS</span>
            <span>— From Student to Job-Ready.</span>
          </div>
          <p className="font-mono text-[11px] text-[var(--text-dim)]">
            © 2026 CareerOS Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
