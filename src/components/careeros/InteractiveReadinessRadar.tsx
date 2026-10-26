'use client';

import React, { useState } from 'react';
import { Target, Zap, TrendingUp, Sparkles, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

interface DimensionData {
  axis: string;
  studentScore: number;
  benchmarkScore: number;
  topDeficit: string;
  recommendedDrill: string;
  href: string;
}

const ROLE_DIMENSIONS: Record<string, { roleTitle: string; overallScore: number; benchmark: number; dimensions: DimensionData[] }> = {
  sde: {
    roleTitle: 'SDE-1 (Full-Stack / Backend)',
    overallScore: 62,
    benchmark: 85,
    dimensions: [
      { axis: 'Data Structures & Algorithms', studentScore: 68, benchmarkScore: 88, topDeficit: 'Dynamic Programming & Graph Traversal', recommendedDrill: '20-Min Tree DFS/BFS Arena', href: '/interviews/technical' },
      { axis: 'System Architecture', studentScore: 48, benchmarkScore: 82, topDeficit: 'Redis Invalidation & Raft Consensus', recommendedDrill: 'Caching & Sharding Architecture Sprint', href: '/roadmap' },
      { axis: 'Database & SQL Performance', studentScore: 56, benchmarkScore: 85, topDeficit: 'B-Tree Index Cardinality & Query Plans', recommendedDrill: 'SQL Execution Plan Drill', href: '/roadmap' },
      { axis: 'ATS Resume Coverage', studentScore: 78, benchmarkScore: 90, topDeficit: 'Distributed Tracing & Docker Keywords', recommendedDrill: 'ATS Keyword Booster Scanner', href: '/resume' },
      { axis: 'Behavioral & STAR Communication', studentScore: 64, benchmarkScore: 80, topDeficit: 'Pacing under Pressure & Result Quantification', recommendedDrill: 'STAR Conflict Resolution Mock', href: '/interviews/hr' },
      { axis: 'Problem Solving Speed', studentScore: 58, benchmarkScore: 84, topDeficit: 'Timeboxing 30-min LeetCode Mediums', recommendedDrill: 'Timed Speed Coding Challenge', href: '/aptitude' },
    ],
  },
  data: {
    roleTitle: 'Data & Analytics Engineer',
    overallScore: 59,
    benchmark: 84,
    dimensions: [
      { axis: 'Data Structures & Algorithms', studentScore: 60, benchmarkScore: 78, topDeficit: 'HashMaps, Tries & Sliding Window', recommendedDrill: 'Array Manipulation Sprint', href: '/interviews/technical' },
      { axis: 'System Architecture', studentScore: 52, benchmarkScore: 80, topDeficit: 'Kafka Partitioning & Event Streaming', recommendedDrill: 'Streaming Architecture Lab', href: '/roadmap' },
      { axis: 'Database & SQL Performance', studentScore: 74, benchmarkScore: 92, topDeficit: 'Windowing Functions (RANK/OVER)', recommendedDrill: 'Advanced SQL Analytical Queries', href: '/roadmap' },
      { axis: 'ATS Resume Coverage', studentScore: 70, benchmarkScore: 88, topDeficit: 'PySpark & Airflow DAG Keywords', recommendedDrill: 'Data Engineering Keyword Tailoring', href: '/resume' },
      { axis: 'Behavioral & STAR Communication', studentScore: 60, benchmarkScore: 78, topDeficit: 'Communicating Data Pipeline ROI to PMs', recommendedDrill: 'Cross-functional Communication Drill', href: '/interviews/hr' },
      { axis: 'Problem Solving Speed', studentScore: 58, benchmarkScore: 82, topDeficit: 'Debugging Schema Drift Errors', recommendedDrill: 'Data Validation Speed Drill', href: '/aptitude' },
    ],
  },
  ai: {
    roleTitle: 'AI / Machine Learning Engineer',
    overallScore: 55,
    benchmark: 88,
    dimensions: [
      { axis: 'Data Structures & Algorithms', studentScore: 64, benchmarkScore: 85, topDeficit: 'Matrix Operations & Memory Optimization', recommendedDrill: 'Vectorization & Algorithm Drill', href: '/interviews/technical' },
      { axis: 'System Architecture', studentScore: 46, benchmarkScore: 86, topDeficit: 'vLLM & Inference Latency Budgeting', recommendedDrill: 'Model Serving Architecture Lab', href: '/roadmap' },
      { axis: 'Database & SQL Performance', studentScore: 50, benchmarkScore: 78, topDeficit: 'Vector Database Indexing (HNSW/IVF)', recommendedDrill: 'Vector DB Similarity Search Sprint', href: '/roadmap' },
      { axis: 'ATS Resume Coverage', studentScore: 68, benchmarkScore: 92, topDeficit: 'Quantized LLM & PyTorch Profiling Terms', recommendedDrill: 'AI Resume Keyword Injection', href: '/resume' },
      { axis: 'Behavioral & STAR Communication', studentScore: 58, benchmarkScore: 80, topDeficit: 'Explaining Model Hallucination Mitigations', recommendedDrill: 'Technical Trade-off Defense Mock', href: '/interviews/hr' },
      { axis: 'Problem Solving Speed', studentScore: 52, benchmarkScore: 85, topDeficit: 'Fast Hyperparameter Debugging', recommendedDrill: 'Mathematical Reasoning Timebox', href: '/aptitude' },
    ],
  },
};

export function InteractiveReadinessRadar() {
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('sde');
  const [activeDimensionIndex, setActiveDimensionIndex] = useState<number>(0);

  const roleData = ROLE_DIMENSIONS[selectedRoleKey];
  const activeDim = roleData.dimensions[activeDimensionIndex];

  // SVG Geometry Constants for 6-axis Radar
  const size = 320;
  const center = size / 2;
  const radius = 110;
  const totalAxes = 6;

  const getCoordinates = (axisIndex: number, scorePct: number) => {
    const angle = (Math.PI * 2 * axisIndex) / totalAxes - Math.PI / 2;
    const r = (radius * scorePct) / 100;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const studentPolygonPoints = roleData.dimensions
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.studentScore);
      return `${x},${y}`;
    })
    .join(' ');

  const benchmarkPolygonPoints = roleData.dimensions
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.benchmarkScore);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="max-w-6xl mx-auto px-6 space-y-10 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4361EE]/10 border border-[#4361EE]/30 text-[#4361EE] font-mono text-xs uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Visualization</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Multi-Dimensional Readiness Radar
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed">
            See your exact competency polygon mapped against hiring benchmarks. Click any vertex to isolate the deficit and inspect the recommended sprint drill.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setSelectedRoleKey('sde'); setActiveDimensionIndex(0); }}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedRoleKey === 'sde'
                ? 'bg-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SDE-1
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRoleKey('data'); setActiveDimensionIndex(0); }}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedRoleKey === 'data'
                ? 'bg-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Data Platform
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRoleKey('ai'); setActiveDimensionIndex(0); }}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedRoleKey === 'ai'
                ? 'bg-[#4361EE] text-white shadow-sm'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AI / ML
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors">
        {/* Left 6 Columns: Interactive SVG Radar Visualization */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-[320px] h-[320px]">
            <svg width={size} height={size} className="overflow-visible">
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4361EE" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4361EE" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Background Concentric Radar Rings (20%, 40%, 60%, 80%, 100%) */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((ring) => (
                <polygon
                  key={ring}
                  points={[0, 1, 2, 3, 4, 5]
                    .map((idx) => {
                      const angle = (Math.PI * 2 * idx) / totalAxes - Math.PI / 2;
                      const r = radius * ring;
                      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                    })
                    .join(' ')}
                  className="fill-none stroke-slate-200 dark:stroke-white/10 stroke-1"
                />
              ))}

              {/* Axis Spoke Lines */}
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const angle = (Math.PI * 2 * idx) / totalAxes - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    className="stroke-slate-200 dark:stroke-white/10 stroke-1 stroke-dashed"
                  />
                );
              })}

              {/* Benchmark Target Polygon (Tier-1 Hiring Bar) */}
              <polygon
                points={benchmarkPolygonPoints}
                className="fill-indigo-500/10 stroke-indigo-400/50 stroke-1 stroke-dasharray-2 transition-all duration-700"
              />

              {/* Student Current Capability Polygon (Filled with Glow) */}
              <polygon
                points={studentPolygonPoints}
                className="fill-[#4361EE]/25 stroke-[#4361EE] stroke-2 filter drop-shadow transition-all duration-700"
              />

              {/* Interactive Vertex Nodes */}
              {roleData.dimensions.map((d, idx) => {
                const { x, y } = getCoordinates(idx, d.studentScore);
                const isSelected = activeDimensionIndex === idx;
                return (
                  <g
                    key={d.axis}
                    className="cursor-pointer group"
                    onClick={() => setActiveDimensionIndex(idx)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 5}
                      className={`transition-all duration-300 ${
                        isSelected
                          ? 'fill-[#FF6B6B] stroke-white stroke-2 shadow-lg'
                          : 'fill-[#4361EE] group-hover:fill-cyan-400 stroke-slate-900 dark:stroke-white stroke-1'
                      }`}
                    />
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={12}
                        className="fill-none stroke-[#FF6B6B] stroke-1 animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4361EE]" />
              <span className="text-slate-700 dark:text-slate-300">Your Current Capability</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-400/40 border border-indigo-400" />
              <span className="text-slate-500 dark:text-slate-400">Tier-1 Hiring Bar</span>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: Vertex Detail & Drill Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131D33] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#FF6B6B] font-bold uppercase tracking-wider">
                Dimension {activeDimensionIndex + 1} of 6
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#4361EE]/10 text-[#4361EE] border border-[#4361EE]/20">
                Gap: -{activeDim.benchmarkScore - activeDim.studentScore}%
              </span>
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                {activeDim.axis}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                Compared directly against current requirements for {roleData.roleTitle}.
              </p>
            </div>

            {/* Score Comparison Bars */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-300">Your Capability</span>
                  <span className="font-bold text-[#4361EE]">{activeDim.studentScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-[#4361EE] rounded-full transition-all duration-500"
                    style={{ width: `${activeDim.studentScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-300">Hiring Benchmark</span>
                  <span className="font-bold text-indigo-400">{activeDim.benchmarkScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeDim.benchmarkScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Critical Deficit Identified */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#FF6B6B] font-bold block">
                Critical Deficit Flagged
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {activeDim.topDeficit}
              </p>
            </div>

            {/* Recommended Drill CTA */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] block">RECOMMENDED REMEDIAL DRILL</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{activeDim.recommendedDrill}</span>
              </div>
              <a
                href={activeDim.href}
                className="h-10 px-4 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0"
              >
                <span>Launch Drill</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
