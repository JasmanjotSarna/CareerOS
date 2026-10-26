'use client';

import React, { useState } from 'react';

export function ProductFragments() {
  const [activeTab, setActiveTab] = useState<'all' | 'resume' | 'interview' | 'speaking' | 'dashboard'>('all');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-rise">
      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-2xl bg-[#cac9c4] dark:bg-[#24231f] max-w-2xl mx-auto">
        {[
          { id: 'all', label: 'All 4 Modules' },
          { id: 'resume', label: 'Resume ATS Scan' },
          { id: 'interview', label: 'Technical Interview' },
          { id: 'speaking', label: 'Speaking Waveform' },
          { id: 'dashboard', label: 'University Dashboard' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors active:scale-[0.97] ${
                active
                  ? 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                  : 'text-[#5f5d55] dark:text-[#a6a49c] hover:text-[#26251e] dark:hover:text-[#edece8]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-12">
        {/* Screen 1: Resume ATS Scan */}
        {(activeTab === 'all' || activeTab === 'resume') && (
          <div
            data-ui="resume-ats-scan"
            className="rounded-2xl p-6 md:p-8 bg-[#d3d2ce] dark:bg-[#24231f] text-[#26251e] dark:text-[#edece8] space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
              <div>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">ATS synthesis report</p>
                <h4 className="text-2xl font-bold">Resume Parsing: Aarav Sharma (21BCE10482)</h4>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Target: SDE-1 (Full Stack & Systems)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#2456d6] dark:text-[#4a7cf6]">84%</span>
                <div className="text-sm">
                  <span className="block font-semibold">Match Score</span>
                  <span className="text-[#5f5d55] dark:text-[#a6a49c]">Tier 1 Cleared</span>
                </div>
              </div>
            </div>

            {/* Keyword and Competency Table */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-[#5f5d55] dark:text-[#a6a49c]">
                Domain competency audit
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Detected technical strengths (10 terms)</span>
                    <span className="text-[#2456d6] dark:text-[#4a7cf6]">Verified</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['React 19', 'Next.js SSR', 'TypeScript Generics', 'PostgreSQL', 'Docker', 'Redis Pub/Sub', 'Jest/Vitest', 'RESTful API', 'Git CI/CD', 'Graph Traversal'].map((kw) => (
                      <span key={kw} className="px-3 py-1 rounded bg-[#d3d2ce] dark:bg-[#383731] text-sm font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Missing domain keywords (3 terms)</span>
                    <span className="text-[#e07a2a]">Action Required</span>
                  </div>
                  <div className="space-y-2 pt-1 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Distributed tracing (OpenTelemetry)</span>
                      <span className="text-[#e07a2a] font-medium">Missing in projects</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database index cardinality analysis</span>
                      <span className="text-[#e07a2a] font-medium">Missing in skills</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Zero-downtime database migrations</span>
                      <span className="text-[#e07a2a] font-medium">Suggested addition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stated Finding */}
            <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
              ATS match score 84% — 3 missing domain competencies in distributed cache handling and query execution planning.
            </div>
          </div>
        )}

        {/* Screen 2: AI Technical Interview Transcript */}
        {(activeTab === 'all' || activeTab === 'interview') && (
          <div
            data-ui="interview-transcript"
            className="rounded-2xl p-6 md:p-8 bg-[#d3d2ce] dark:bg-[#24231f] text-[#26251e] dark:text-[#edece8] space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
              <div>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Interview studio transcript</p>
                <h4 className="text-2xl font-bold">Session #4028: Binary Tree Inversion & Recursion</h4>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">AI Interrogator: Algorithm Architect Engine</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded bg-[#2456d6]/15 text-[#2456d6] dark:bg-[#4a7cf6]/20 dark:text-[#4a7cf6] text-sm font-semibold">
                  Confidence 91%
                </span>
              </div>
            </div>

            {/* Exchange Sequence */}
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-1">
                <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6]">AI Interviewer (00:04:12):</span>
                <p className="leading-relaxed">
                  &ldquo;In your binary tree inversion solution, you used a recursive depth-first traversal. What is the maximum call stack memory depth in the worst-case degenerate tree, and how would you safeguard against stack overflow in production?&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#bebcb5] dark:bg-[#383731] space-y-2">
                <span className="font-bold text-[#26251e] dark:text-[#edece8]">Student (00:04:38):</span>
                <p className="leading-relaxed">
                  &ldquo;For a completely unbalanced tree of N nodes, recursive calls reach O(N) stack frames, risking overflow. In production, I would refactor to an iterative Breadth-First Search using an explicit Queue, capping memory to O(W) where W is maximum tree width.&rdquo;
                </p>
                <pre className="p-3 rounded bg-[#26251e] text-[#edece8] text-sm overflow-x-auto">
                  <code>{`// Iterative BFS inversion avoiding recursion limit
function invertTreeIterative(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    const temp = curr.left;
    curr.left = curr.right;
    curr.right = temp;
    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }
  return root;
}`}</code>
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-1">
                <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6]">AI Evaluation Rubric:</span>
                <p className="leading-relaxed">
                  Optimal boundary analysis. Candidate demonstrated deep mastery of stack overflow edge cases and offered an iterative queue alternative without prompting.
                </p>
              </div>
            </div>

            {/* Stated Finding */}
            <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
              Confidence 91% — recursive tree traversal with optimal O(N) space and production defensive error handling.
            </div>
          </div>
        )}

        {/* Screen 3: Speaking Waveform Assessment */}
        {(activeTab === 'all' || activeTab === 'speaking') && (
          <div
            data-ui="speaking-waveform"
            className="rounded-2xl p-6 md:p-8 bg-[#d3d2ce] dark:bg-[#24231f] text-[#26251e] dark:text-[#edece8] space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
              <div>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">BET English alignment report</p>
                <h4 className="text-2xl font-bold">Speech Waveform: Behavioral STAR Response</h4>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Acoustic & Clarity Engine (Business English Training)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#2456d6] dark:text-[#4a7cf6]">89%</span>
                <div className="text-sm">
                  <span className="block font-semibold">Fluency Index</span>
                  <span className="text-[#5f5d55] dark:text-[#a6a49c]">BET Tier A</span>
                </div>
              </div>
            </div>

            {/* Waveform Graphic */}
            <div className="p-6 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-4">
              <div className="flex items-center justify-between text-sm text-[#5f5d55] dark:text-[#a6a49c]">
                <span>Audio Duration: 02m 14s</span>
                <span>Pacing: 142 words/min (Optimal: 130–150 wpm)</span>
              </div>

              {/* Waveform Bars with micro-animation */}
              <div className="h-20 flex items-center justify-between gap-1 px-2">
                {[
                  25, 40, 60, 35, 75, 90, 65, 45, 80, 100, 85, 60, 40, 70, 95, 75, 50, 30,
                  55, 85, 90, 70, 40, 65, 80, 95, 60, 45, 75, 85, 60, 35, 50, 70, 85, 65,
                  40, 60, 75, 50, 35, 65, 80, 55, 40, 30, 20
                ].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 rounded-full bg-[#2456d6] dark:bg-[#4a7cf6] animate-wave-bar"
                    style={{
                      height: `${h}%`,
                      opacity: h > 70 ? 1 : 0.65,
                      animationDelay: `${(idx % 12) * 120}ms`,
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-sm">
                <div className="p-3 rounded-lg bg-[#d3d2ce] dark:bg-[#383731]">
                  <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Pacing Cadence</p>
                  <p className="font-bold text-base">142 WPM</p>
                </div>
                <div className="p-3 rounded-lg bg-[#d3d2ce] dark:bg-[#383731]">
                  <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Filler Rate</p>
                  <p className="font-bold text-base text-[#2456d6] dark:text-[#4a7cf6]">1.2% (Low)</p>
                </div>
                <div className="p-3 rounded-lg bg-[#d3d2ce] dark:bg-[#383731]">
                  <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Pronunciation</p>
                  <p className="font-bold text-base">94% Accurate</p>
                </div>
                <div className="p-3 rounded-lg bg-[#d3d2ce] dark:bg-[#383731]">
                  <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">STAR Structure</p>
                  <p className="font-bold text-base">4/4 Phases</p>
                </div>
              </div>
            </div>

            {/* Stated Finding */}
            <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
              BET English alignment: 89% fluency with consistent sentence pacing and minimal filler words (1.2%).
            </div>
          </div>
        )}

        {/* Screen 4: University Cohort Readiness Dashboard */}
        {(activeTab === 'all' || activeTab === 'dashboard') && (
          <div
            data-ui="university-dashboard"
            className="rounded-2xl p-6 md:p-8 bg-[#d3d2ce] dark:bg-[#24231f] text-[#26251e] dark:text-[#edece8] space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
              <div>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">JECRC University placement dashboard</p>
                <h4 className="text-2xl font-bold">2026 Batch Placement Readiness Monitor</h4>
                <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">Total Cohort: 1,240 Final-Year Students</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#2456d6] dark:text-[#4a7cf6]">78%</span>
                <div className="text-sm">
                  <span className="block font-semibold">Cohort Ready</span>
                  <span className="text-[#5f5d55] dark:text-[#a6a49c]">967 Students Cleared</span>
                </div>
              </div>
            </div>

            {/* Department Breakdown Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              {[
                { dept: 'Computer Science (CSE)', total: 540, ready: 464, pct: 86 },
                { dept: 'AI & Data Science (AIDS)', total: 280, ready: 227, pct: 81 },
                { dept: 'Information Tech (IT)', total: 220, ready: 183, pct: 83 },
                { dept: 'Electronics & Comm (ECE)', total: 200, ready: 144, pct: 72 },
              ].map((d) => (
                <div key={d.dept} className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-2">
                  <p className="text-sm font-semibold text-[#5f5d55] dark:text-[#a6a49c]">{d.dept}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{d.pct}%</span>
                    <span className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">{d.ready}/{d.total}</span>
                  </div>
                  <div className="w-full h-2 bg-[#bebcb5] dark:bg-[#383731] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2456d6] dark:bg-[#4a7cf6] rounded-full transition-[width] duration-500" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Intervention Alert Table */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#5f5d55] dark:text-[#a6a49c]">
                Targeted faculty intervention alerts
              </h5>
              <div className="space-y-2 text-sm">
                <div className="p-3.5 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#26251e] dark:text-[#edece8]">
                      Section B (CSE): Dynamic Programming & Recursion
                    </span>
                    <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">
                      142 students flagged below 75% on CBT mock assessment #6
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#e07a2a]/15 text-[#e07a2a] text-sm font-semibold">
                    Action Assigned
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#26251e] dark:text-[#edece8]">
                      Section A (ECE): System Software Architecture
                    </span>
                    <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c]">
                      56 students scheduled for targeted RTOS laboratory sprint
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#2456d6]/15 text-[#2456d6] dark:bg-[#4a7cf6]/20 dark:text-[#4a7cf6] text-sm font-semibold">
                    In Progress
                  </span>
                </div>
              </div>
            </div>

            {/* Stated Finding */}
            <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
              142 students in Section B require CBT recursion reinforcement before Day 1 placements.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
