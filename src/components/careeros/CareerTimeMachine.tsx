'use client';

import React, { useState, useId } from 'react';

type RoleKey = 'sde' | 'data' | 'ml' | 'product';

interface RoleSimulation {
  title: string;
  category: string;
  initialScore: number;
  finalScore: number;
  skills: Array<{ name: string; start: number; end: number }>;
  sprints: Array<{ month: number; title: string; outcome: string }>;
  applications: Array<{ company: string; role: string; stageAtMonth: (m: number) => string }>;
  interviews: Array<{ month: number; title: string; score: number; feedback: string }>;
}

const ROLES_DATA: Record<RoleKey, RoleSimulation> = {
  sde: {
    title: 'SDE-1 (Full-Stack / Backend)',
    category: 'Software Engineering',
    initialScore: 54,
    finalScore: 92,
    skills: [
      { name: 'SQL Joins & Indexing', start: 42, end: 92 },
      { name: 'System Design Fundamentals', start: 30, end: 86 },
      { name: 'Core DSA & Array Hashing', start: 58, end: 94 },
      { name: 'Interview Pacing Under Pressure', start: 35, end: 88 },
    ],
    sprints: [
      { month: 3, title: 'Sprint 1: SQL Indexing & Query Tuning', outcome: 'Optimized complex query execution plans; eliminated full table scans.' },
      { month: 6, title: 'Sprint 2: System Design & Caching', outcome: 'Implemented Redis caching layer with invalidation and TTL policies.' },
      { month: 9, title: 'Sprint 3: High-Concurrency Mock Rounds', outcome: 'Completed 15 technical mock rounds with STAR delivery.' },
      { month: 12, title: 'Sprint 4: Campus & Off-Campus Drives', outcome: 'Placement readiness achieved with multiple drive shortlists.' },
    ],
    applications: [
      {
        company: 'Cloud Infrastructure Platform',
        role: 'Junior Backend Engineer',
        stageAtMonth: (m) => m < 2 ? 'Saved' : m < 4 ? 'Preparing' : m < 7 ? 'Applied' : m < 10 ? 'Interview' : 'Offer',
      },
      {
        company: 'Enterprise FinTech Co.',
        role: 'Graduate Software Engineer',
        stageAtMonth: (m) => m < 3 ? 'Saved' : m < 5 ? 'Preparing' : m < 8 ? 'Applied' : m < 11 ? 'Interview' : 'Offer',
      },
      {
        company: 'Developer Tooling Studio',
        role: 'Full-Stack Associate',
        stageAtMonth: (m) => m < 4 ? 'Saved' : m < 7 ? 'Applied' : m < 10 ? 'Assessment' : 'Interview',
      },
      {
        company: 'Global Logistics Software',
        role: 'SDE Trainee',
        stageAtMonth: (m) => m < 5 ? 'Saved' : m < 8 ? 'Preparing' : 'Applied',
      },
    ],
    interviews: [
      { month: 1, title: 'Diagnostic Technical Round', score: 58, feedback: 'Working brute-force solution; missed optimal hashmap approach.' },
      { month: 4, title: 'Data Structures: Tree & Graph Round', score: 72, feedback: 'Strong recursive logic; time management needs tighter bounding.' },
      { month: 7, title: 'System Fundamentals & API Mock', score: 85, feedback: 'Clear trade-off defense between consistency and availability.' },
      { month: 10, title: 'Final Technical & Behavioral Round', score: 92, feedback: 'Clear concise explanations, optimal complexity, confident delivery.' },
    ],
  },
  data: {
    title: 'Data Analyst / BI Engineer',
    category: 'Analytics & Business Intelligence',
    initialScore: 48,
    finalScore: 89,
    skills: [
      { name: 'Advanced SQL & Window Functions', start: 38, end: 94 },
      { name: 'Statistical Testing & A/B Analysis', start: 32, end: 85 },
      { name: 'Interactive Executive Dashboards', start: 50, end: 90 },
      { name: 'Business Metric Framing', start: 40, end: 86 },
    ],
    sprints: [
      { month: 3, title: 'Sprint 1: Advanced Window Functions', outcome: 'Mastered lead/lag, dense rank, and running aggregations.' },
      { month: 6, title: 'Sprint 2: Product Metrics & Cohorts', outcome: 'Built retention heatmaps and statistical significance tests.' },
      { month: 9, title: 'Sprint 3: Case Study & SQL Assessments', outcome: 'Cleared 10 timed SQL assessments with 100% accuracy.' },
      { month: 12, title: 'Sprint 4: Final Analytics Drive Rounds', outcome: 'Shortlisted for Analytics Associate roles across recruitment drives.' },
    ],
    applications: [
      {
        company: 'E-Commerce Marketplace',
        role: 'Associate Data Analyst',
        stageAtMonth: (m) => m < 2 ? 'Saved' : m < 4 ? 'Preparing' : m < 7 ? 'Applied' : m < 9 ? 'Interview' : 'Offer',
      },
      {
        company: 'Consumer Payments Network',
        role: 'Business Intelligence Analyst',
        stageAtMonth: (m) => m < 3 ? 'Saved' : m < 6 ? 'Preparing' : m < 9 ? 'Applied' : 'Interview',
      },
      {
        company: 'Digital Health Platform',
        role: 'Data Operations Associate',
        stageAtMonth: (m) => m < 4 ? 'Saved' : m < 7 ? 'Applied' : 'Assessment',
      },
      {
        company: 'Retail Analytics Group',
        role: 'Junior Reporting Analyst',
        stageAtMonth: (m) => m < 5 ? 'Saved' : 'Applied',
      },
    ],
    interviews: [
      { month: 1, title: 'Diagnostic SQL Assessment', score: 52, feedback: 'Solid grouping logic; struggled with multi-level joins.' },
      { month: 4, title: 'Business Case & Funnel Analysis', score: 68, feedback: 'Good numerical intuition; need to state metric assumptions clearly.' },
      { month: 7, title: 'Executive Stakeholder Presentation', score: 82, feedback: 'Clear storytelling and actionable summary points.' },
      { month: 10, title: 'Comprehensive Analytics Bar-Raiser', score: 89, feedback: 'Exceptional insight articulation with structured recommendations.' },
    ],
  },
  ml: {
    title: 'Machine Learning Engineer',
    category: 'Applied AI & Models',
    initialScore: 44,
    finalScore: 90,
    skills: [
      { name: 'PyTorch Model Training & Evaluation', start: 35, end: 90 },
      { name: 'Data Pipeline & Feature Engineering', start: 40, end: 88 },
      { name: 'Model Serving & FastAPI Endpoints', start: 28, end: 86 },
      { name: 'Model Metrics & Error Analysis', start: 32, end: 89 },
    ],
    sprints: [
      { month: 3, title: 'Sprint 1: Model Baseline & Pipelines', outcome: 'Built automated data validation and cross-validation pipelines.' },
      { month: 6, title: 'Sprint 2: Inference Serving Architecture', outcome: 'Packaged ONNX models into containerized FastAPI services.' },
      { month: 9, title: 'Sprint 3: ML System Design & Trade-offs', outcome: 'Simulated real-time recommendation system under latency budget.' },
      { month: 12, title: 'Sprint 4: Applied AI Placement Rounds', outcome: 'Secured shortlist for Machine Learning Graduate track.' },
    ],
    applications: [
      {
        company: 'Autonomous Systems Lab',
        role: 'Junior ML Engineer',
        stageAtMonth: (m) => m < 3 ? 'Saved' : m < 5 ? 'Preparing' : m < 8 ? 'Applied' : m < 11 ? 'Interview' : 'Offer',
      },
      {
        company: 'Natural Language AI Co.',
        role: 'Applied AI Associate',
        stageAtMonth: (m) => m < 3 ? 'Saved' : m < 6 ? 'Applied' : m < 9 ? 'Assessment' : 'Interview',
      },
      {
        company: 'Edge Computing Solutions',
        role: 'Computer Vision Trainee',
        stageAtMonth: (m) => m < 4 ? 'Saved' : m < 8 ? 'Preparing' : 'Applied',
      },
      {
        company: 'Enterprise Search Engine',
        role: 'Data & Model Operations',
        stageAtMonth: (m) => m < 5 ? 'Saved' : 'Applied',
      },
    ],
    interviews: [
      { month: 1, title: 'Python & NumPy Diagnostic Round', score: 50, feedback: 'Good syntax mastery; missed vectorization optimizations.' },
      { month: 4, title: 'ML Fundamentals & Loss Functions', score: 70, feedback: 'Explained cross-entropy well; review gradient descent variants.' },
      { month: 7, title: 'Production Pipeline Defense', score: 84, feedback: 'Excellent grasp of data drift and continuous monitoring.' },
      { month: 10, title: 'ML Architecture Final Round', score: 90, feedback: 'Rigorous trade-off analysis between model accuracy and latency.' },
    ],
  },
  product: {
    title: 'Product Analyst',
    category: 'Product Strategy & Metrics',
    initialScore: 50,
    finalScore: 91,
    skills: [
      { name: 'User Journey & Retention Funnels', start: 40, end: 92 },
      { name: 'Experimentation Design (Hypotheses)', start: 35, end: 88 },
      { name: 'Cross-Functional Stakeholder Framing', start: 45, end: 90 },
      { name: 'Product Sense & Problem Deconstruction', start: 38, end: 91 },
    ],
    sprints: [
      { month: 3, title: 'Sprint 1: Funnel & Drop-off Analysis', outcome: 'Identified friction points in onboarding flow with quantified drop-off.' },
      { month: 6, title: 'Sprint 2: Hypothesis & Sample Sizing', outcome: 'Authored 8 experiment briefs with pre-registered power calculations.' },
      { month: 9, title: 'Sprint 3: Executive Product Reviews', outcome: 'Presented trade-off matrices to mock cross-functional boards.' },
      { month: 12, title: 'Sprint 4: Product Placement Drives', outcome: 'Cleared interview rounds for Associate Product Analyst.' },
    ],
    applications: [
      {
        company: 'Fintech Mobile Application',
        role: 'Associate Product Analyst',
        stageAtMonth: (m) => m < 2 ? 'Saved' : m < 4 ? 'Preparing' : m < 7 ? 'Applied' : m < 10 ? 'Interview' : 'Offer',
      },
      {
        company: 'B2B SaaS Workspace',
        role: 'Product Growth Analyst',
        stageAtMonth: (m) => m < 3 ? 'Saved' : m < 6 ? 'Preparing' : m < 9 ? 'Applied' : 'Interview',
      },
      {
        company: 'EdTech Learning Platform',
        role: 'Junior Engagement Analyst',
        stageAtMonth: (m) => m < 4 ? 'Saved' : m < 7 ? 'Applied' : 'Assessment',
      },
      {
        company: 'Logistics Operations SaaS',
        role: 'Operations Analyst',
        stageAtMonth: (m) => m < 5 ? 'Saved' : 'Applied',
      },
    ],
    interviews: [
      { month: 1, title: 'Diagnostic Product Sense', score: 54, feedback: 'Good user empathy; needed more rigorous metric definitions.' },
      { month: 4, title: 'A/B Testing & Trade-Off Defense', score: 72, feedback: 'Strong hypothesis structure; remember to check edge segment impact.' },
      { month: 7, title: 'Root Cause & Growth Simulation', score: 85, feedback: 'Structured 5-whys breakdown with prioritized validation steps.' },
      { month: 10, title: 'Final Product Leadership Panel', score: 91, feedback: 'Compelling executive synthesis with unambiguous next steps.' },
    ],
  },
};

export function CareerTimeMachine() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('sde');
  const [month, setMonth] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const sliderId = useId();

  const role = ROLES_DATA[selectedRole];
  const t = month / 12;

  // Linear interpolation of overall score
  const currentScore = Math.round(role.initialScore + (role.finalScore - role.initialScore) * t);

  // Play / Pause animation loop
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setMonth((prev) => {
          if (prev >= 12) {
            setIsPlaying(false);
            return 12;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-12 select-none">
      {/* 6 Step Journey Header */}
      <div className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#FF6B6B] block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Six steps from where you are to where you need to be.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8]">
            CareerOS does not simply optimize a resume. It determines where you stand, finds what is missing, builds the path to close the gap, and prepares you for real recruitment rounds.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '01', title: 'Pick a target role', desc: 'Choose the job you want to get hired for.' },
            { step: '02', title: 'Add your profile', desc: 'Upload your resume and academic background.' },
            { step: '03', title: 'See your skill gaps', desc: 'Get an honest breakdown of what is missing.' },
            { step: '04', title: 'Get your roadmap', desc: 'A learning path built specifically for your gap.' },
            { step: '05', title: 'Practice all 4 areas', desc: 'Aptitude, technical, HR, and speaking rounds.' },
            { step: '06', title: 'Watch readiness climb', desc: 'Track your score until you are placement-ready.' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 space-y-1 hover:border-[#4361EE]/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#FF6B6B] font-bold">{item.step}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4361EE]" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
              <p className="text-[11px] text-slate-600 dark:text-[#94A3B8] leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Simulation Window */}
      <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl transition-colors">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-[#0B132B] border-b border-slate-200 dark:border-white/10 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-[#334155]" />
            <span className="ml-2 font-mono text-xs text-slate-500 dark:text-[#94A3B8]">
              Interactive Simulation — Drag the Timeline
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-200/60 dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-slate-600 dark:text-[#94A3B8] self-start sm:self-auto">
            Sample data
          </span>
        </div>

        <div className="p-5 sm:p-7 space-y-8">
          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] block">
              1. Choose a Target Role
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {(Object.keys(ROLES_DATA) as RoleKey[]).map((key) => {
                const r = ROLES_DATA[key];
                const active = selectedRole === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedRole(key);
                      setMonth(0);
                      setIsPlaying(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-[#4361EE]/15 border-[#4361EE] text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-[#1E293B]/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white hover:border-[#4361EE]/40'
                    }`}
                  >
                    <span className="text-xs font-mono block text-slate-500 dark:text-[#94A3B8]">{r.category}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5 leading-snug">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B132B]/80 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#4361EE] hover:bg-[#3451db] text-white font-mono text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  {isPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMonth(0);
                    setIsPlaying(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white font-mono text-xs transition-colors"
                >
                  RESET
                </button>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  Month {month} of 12
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500 dark:text-[#94A3B8]">Overall Readiness:</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{currentScore}%</span>
                <span className="text-slate-500 dark:text-[#94A3B8] text-[11px]">(Estimated)</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <label htmlFor={sliderId} className="sr-only">
                Timeline month scrubber
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={12}
                step={1}
                value={month}
                onChange={(e) => {
                  setMonth(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full h-2 bg-slate-200 dark:bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#4361EE]"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-500 dark:text-[#94A3B8]">
                <span>Today (Baseline)</span>
                <span>3 Months</span>
                <span>6 Months</span>
                <span>9 Months</span>
                <span>12 Months (Placement Ready)</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Grid: Skills + Roadmap + Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Columns: Skill Gap Closure */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200/80 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                  Skill Gaps Closing Over Time
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-[#94A3B8]">{role.skills.length} target skills</span>
              </div>

              <div className="space-y-3">
                {role.skills.map((skill) => {
                  const currentSkillScore = Math.round(skill.start + (skill.end - skill.start) * t);
                  return (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-800 dark:text-[#E2E8F0] font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-500 dark:text-[#94A3B8] text-[11px]">Baseline: {skill.start}%</span>
                          <span className="font-bold text-slate-900 dark:text-white">{currentSkillScore}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#334155] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4361EE] to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${currentSkillScore}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 6 Columns: Applications & Roadmap State */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200/80 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                  Application Pipeline Progress
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-[#94A3B8]">4 active tracks</span>
              </div>

              <div className="space-y-2.5">
                {role.applications.map((app) => {
                  const stage = app.stageAtMonth(month);
                  const isOffer = stage === 'Offer';
                  const isInterview = stage === 'Interview';
                  return (
                    <div
                      key={app.company}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/5 text-xs"
                    >
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white block">{app.role}</span>
                        <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] block">{app.company}</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold ${
                          isOffer
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                            : isInterview
                            ? 'bg-[#4361EE]/15 text-[#4361EE] border border-[#4361EE]/30'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#94A3B8]'
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
