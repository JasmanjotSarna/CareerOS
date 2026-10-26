'use client';

import React, { useState } from 'react';

interface PipelineData {
  role: string;
  category: string;
  analysis: string;
  matchScore: number;
  matchTier: string;
  missingGaps: string[];
  recommendedProject: {
    title: string;
    description: string;
    duration: string;
  };
  sampleListing: {
    title: string;
    company: string;
    salary: string;
    visa: string;
    matchPct: number;
    deadline: string;
  };
  tailoredBullet: {
    original: string;
    tailored: string;
    rationale: string;
  };
  interviewProbes: string[];
  progressStage: string;
}

const SAMPLE_PROFILE = {
  name: 'Maya Chen',
  level: 'Early-career Software Engineer',
  experience: '2.5 years experience',
  coreSkills: ['TypeScript', 'Python', 'PostgreSQL', 'Docker', 'REST APIs'],
  locationPreference: 'Hybrid or Remote',
};

const ROLES_PIPELINE: Record<string, PipelineData> = {
  fullstack: {
    role: 'Full-Stack Developer',
    category: 'Engineering & Systems',
    analysis: 'Evaluates microservice architecture, client hydration, database indexing, and async queues.',
    matchScore: 84,
    matchTier: 'Strong Alignment (Estimated)',
    missingGaps: [
      'Redis distributed caching and TTL eviction policies',
      'End-to-end integration test suites with Vitest and Playwright',
    ],
    recommendedProject: {
      title: 'Real-time WebSocket Collaborative Document Engine',
      description: 'Build an operational transform editor with Redis Pub/Sub cluster backplane and zero-downtime failover.',
      duration: '3 weeks (Estimated)',
    },
    sampleListing: {
      title: 'Full-Stack Systems Engineer',
      company: 'Platform Co [Sample listing]',
      salary: 'Not listed',
      visa: 'Unknown',
      matchPct: 86,
      deadline: '14 days remaining',
    },
    tailoredBullet: {
      original: 'Worked on backend APIs and optimized database tables for the web app.',
      tailored: 'Architected 14 REST and WebSocket endpoints in Node.js, reducing p99 database query latency from 240ms to 42ms via PostgreSQL composite indexes.',
      rationale: 'Replaces passive verb with quantified latency improvement and explicit technical indexing keywords.',
    },
    interviewProbes: [
      'How do you prevent race conditions during distributed cache invalidation?',
      'Describe how React 19 server actions handle optimistic updates with rollback.',
    ],
    progressStage: 'Application Staged (Preparing stage)',
  },
  datascientist: {
    role: 'Data Scientist',
    category: 'Applied AI & Modeling',
    analysis: 'Scans statistical inference, feature engineering, distributed PySpark pipelines, and production inference latency.',
    matchScore: 78,
    matchTier: 'Targeted Delta Closing (Estimated)',
    missingGaps: [
      'PySpark cluster memory tuning and broadcast join optimization',
      'Model drift detection and canary deployment pipelines',
    ],
    recommendedProject: {
      title: 'Continuous Feature Store & Model Telemetry Pipeline',
      description: 'Implement automated data drift monitoring using Evidently and FastAPI with sub-50ms inference latency.',
      duration: '4 weeks (Estimated)',
    },
    sampleListing: {
      title: 'Data Science & Analytics Lead',
      company: 'Logistics Core [Sample listing]',
      salary: '$135,000 – $155,000 (Disclosed)',
      visa: 'Available',
      matchPct: 80,
      deadline: '9 days remaining',
    },
    tailoredBullet: {
      original: 'Built machine learning models to predict customer churn rate.',
      tailored: 'Trained and deployed XGBoost classifier on 1.4M customer records, improving churn prediction recall from 64% to 82% with daily drift audits.',
      rationale: 'Demonstrates model validation discipline and tangible recall gain without inflating achievements.',
    },
    interviewProbes: [
      'Explain how you distinguish between covariate shift and concept drift in production.',
      'How would you handle severe class imbalance (1:1000) without introducing synthetic bias?',
    ],
    progressStage: 'Technical Assessment Ready',
  },
  productanalyst: {
    role: 'Product Analyst',
    category: 'Product Analytics & Experimentation',
    analysis: 'Evaluates A/B experimentation frameworks, cohort retention modeling, SQL window functions, and executive briefs.',
    matchScore: 81,
    matchTier: 'High Alignment (Estimated)',
    missingGaps: [
      'Sample ratio mismatch (SRM) diagnosis in multi-variant A/B experiments',
      'dbt dimensional modeling for customer lifecycle event tracking',
    ],
    recommendedProject: {
      title: 'Experimentation Integrity Audit Dashboard',
      description: 'Create an automated pipeline validating statistical power, minimum detectable effect (MDE), and SRM alerts.',
      duration: '2.5 weeks (Estimated)',
    },
    sampleListing: {
      title: 'Growth & Experimentation Analyst',
      company: 'Consumer Network [Sample listing]',
      salary: 'Not listed',
      visa: 'Unknown',
      matchPct: 83,
      deadline: '21 days remaining',
    },
    tailoredBullet: {
      original: 'Analyzed user tests and presented weekly metrics to product team.',
      tailored: 'Designed and evaluated 8 conversion funnel A/B tests across 450k monthly active users, identifying a drop-off step that recovered $28k MRR.',
      rationale: 'Quantifies cohort sample size and business outcome using honest experimentation terminology.',
    },
    interviewProbes: [
      'What statistical test do you apply when variance differs significantly between A/B variants?',
      'Walk me through how you detect network effect spillover in marketplace testing.',
    ],
    progressStage: 'Recruiter Screen Cleared',
  },
  mlengineer: {
    role: 'ML Engineer',
    category: 'Systems & Infrastructure',
    analysis: 'Assesses GPU cluster utilization, Triton inference servers, quantization (AWQ/GPTQ), and vector database indexing.',
    matchScore: 75,
    matchTier: 'Bridge Required (Estimated)',
    missingGaps: [
      'TensorRT-LLM engine compilation and GPU memory profiling',
      'Hierarchical Navigable Small World (HNSW) vector search tuning',
    ],
    recommendedProject: {
      title: 'Low-Latency Vector Search Microservice',
      description: 'Deploy Qdrant vector index with hybrid sparse-dense retrieval and benchmark query throughput under concurrency.',
      duration: '4 weeks (Estimated)',
    },
    sampleListing: {
      title: 'Machine Learning Infrastructure Engineer',
      company: 'Model Fabric [Sample listing]',
      salary: 'Not listed',
      visa: 'Unknown',
      matchPct: 77,
      deadline: '12 days remaining',
    },
    tailoredBullet: {
      original: 'Handled deployment of AI models and monitored servers.',
      tailored: 'Containerized 3 Hugging Face transformer models with Docker and Triton, reducing p95 API response time from 380ms to 92ms via FP16 quantization.',
      rationale: 'Specifies runtime framework, quantization technique, and measured latency delta.',
    },
    interviewProbes: [
      'How does KV cache paged attention resolve GPU memory fragmentation during token generation?',
      'Compare trade-offs between static batching and continuous dynamic batching.',
    ],
    progressStage: 'Learning Sprint in Progress',
  },
};

export function LivePipelineSimulator() {
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('fullstack');
  const [approvedBullet, setApprovedBullet] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const current = ROLES_PIPELINE[selectedRoleKey] || ROLES_PIPELINE.fullstack;

  const handleRoleChange = (key: string) => {
    setSelectedRoleKey(key);
    setApprovedBullet(false);
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto space-y-10"
    >
      {/* OS Window Shell */}
      <div className="rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-8 select-none">
        {/* Window Titlebar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
            <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
            <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
            <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
              pipeline-runner.os: 8-Step Readiness Evaluation Engine
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#a6a49c]">
            <span>Evidence: Measured vs Estimated</span>
            <span>•</span>
            <span className="text-[#2456d6] dark:text-[#4a7cf6] font-medium">Sample data</span>
          </div>
        </div>

        {/* Step Header & Sample Profile Card */}
        <div className="p-4 rounded-xl bg-[#262a34] dark:bg-[#22252e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#edece8]">Active Profile: {SAMPLE_PROFILE.name}</p>
            <p className="text-sm text-[#a6a49c]">
              {SAMPLE_PROFILE.level} • {SAMPLE_PROFILE.experience} • {SAMPLE_PROFILE.locationPreference}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROFILE.coreSkills.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded bg-[#1e2128] text-sm text-[#edece8]">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Role Picker Buttons: Thumb-friendly (min 48px height) */}
        <div>
          <label className="block text-sm font-semibold text-[#a6a49c] mb-3">
            Choose a target role to run the 8-step operating pipeline
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'fullstack', label: 'Full-Stack Dev' },
              { key: 'datascientist', label: 'Data Scientist' },
              { key: 'productanalyst', label: 'Product Analyst' },
              { key: 'mlengineer', label: 'ML Engineer' },
            ].map((btn) => {
              const active = btn.key === selectedRoleKey;
              return (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => handleRoleChange(btn.key)}
                  className={`min-h-[48px] px-4 py-3 rounded-xl text-center text-sm font-semibold transition-colors active:scale-[0.97] ${
                    active
                      ? 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                      : 'bg-[#262a34] text-[#edece8] hover:bg-[#2e3340] dark:bg-[#22252e] dark:hover:bg-[#2a2e39]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Eight Pipeline Steps Rendered Cleanly */}
        <div className="space-y-6 pt-2">
          {/* Step 1 & 2: Analysis & Profile Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-2">
              <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                Step 1: Role Capability Analysis
              </span>
              <p className="text-sm text-[#edece8] leading-relaxed">
                {current.analysis}
              </p>
              <p className="text-sm text-[#a6a49c] pt-1">Domain: {current.category}</p>
            </div>

            <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                  Step 2: Profile Match Comparison
                </span>
                <span className="text-3xl font-extrabold text-[#edece8]">
                  {current.matchScore}%
                </span>
              </div>
              <p className="text-sm font-medium text-[#edece8]">{current.matchTier}</p>
              <div className="w-full h-2 rounded-full bg-[#1e2128] overflow-hidden">
                <div
                  className="h-full bg-[#2456d6] dark:bg-[#4a7cf6] rounded-full transition-[width] duration-500"
                  style={{ width: `${current.matchScore}%` }}
                />
              </div>
              <p className="text-sm text-[#a6a49c]">Score basis: Evaluated against benchmark job criteria</p>
            </div>
          </div>

          {/* Step 3 & 4: Explain Gaps & Recommended Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-3">
              <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                Step 3: Explain Missing Qualifications
              </span>
              <div className="space-y-2 text-sm text-[#edece8]">
                {current.missingGaps.map((gap, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#1e2128] flex items-start gap-2">
                    <span className="text-[#a6a49c]">•</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#a6a49c]">Honest diagnostic: no sugarcoating missing skills.</p>
            </div>

            <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-2">
              <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                Step 4: Recommended Portfolio Project
              </span>
              <h5 className="text-base font-bold text-[#edece8]">
                {current.recommendedProject.title}
              </h5>
              <p className="text-sm text-[#a6a49c] leading-relaxed">
                {current.recommendedProject.description}
              </p>
              <p className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium pt-1">
                Estimated build timeline: {current.recommendedProject.duration}
              </p>
            </div>
          </div>

          {/* Step 5: Find Opportunities (Honest Job Card with Unknowns) */}
          <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                Step 5: Transparent Opportunity Matching
              </span>
              <span className="text-sm text-[#a6a49c]">Honest disclosure of missing information</span>
            </div>

            <div data-ui="pipeline-job-card" className="p-4 rounded-xl bg-[#1e2128] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6 space-y-1">
                <p className="font-bold text-base text-[#edece8]">{current.sampleListing.title}</p>
                <p className="text-sm text-[#a6a49c]">{current.sampleListing.company}</p>
                <p className="text-sm text-[#a6a49c]">Deadline: {current.sampleListing.deadline}</p>
              </div>

              <div className="md:col-span-3 space-y-1 text-sm">
                <p className="text-[#edece8]">
                  Salary: <span className="text-[#a6a49c] font-medium">{current.sampleListing.salary}</span>
                </p>
                <p className="text-[#edece8]">
                  Visa Sponsorship: <span className="text-[#a6a49c] font-medium">{current.sampleListing.visa}</span>
                </p>
              </div>

              <div className="md:col-span-3 text-right">
                <span className="text-2xl font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                  {current.sampleListing.matchPct}%
                </span>
                <p className="text-sm text-[#a6a49c]">Estimated fit</p>
              </div>
            </div>
          </div>

          {/* Step 6: Tailor Honest Resume with Review & Approve Moment */}
          <div data-ui="pipeline-bullet-editor" className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                Step 6: Tailor Honest Resume (Review & Approve)
              </span>
              <span className="text-sm text-[#a6a49c]">User retains full control</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-[#1e2128] space-y-1">
                <span className="font-bold text-[#a6a49c]">Original Draft:</span>
                <p className="text-[#edece8] leading-relaxed">{current.tailoredBullet.original}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#1e2128] space-y-1">
                <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6]">Suggested Revision:</span>
                <p className="text-[#edece8] leading-relaxed">{current.tailoredBullet.tailored}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#1e2128] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <p className="text-[#a6a49c]">
                <strong className="text-[#edece8]">Audit rationale: </strong>
                {current.tailoredBullet.rationale}
              </p>
              <button
                type="button"
                onClick={() => setApprovedBullet(!approvedBullet)}
                className={`min-h-[44px] px-5 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 active:scale-[0.97] ${
                  approvedBullet
                    ? 'bg-[#15803d] text-white'
                    : 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                }`}
              >
                {approvedBullet ? 'Approved for Export' : 'Review & Approve Revision'}
              </button>
            </div>
          </div>

          {/* Step 7 & 8: Interview Topics & Progress Measurement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-3">
              <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                Step 7: Prepare Interview Topics
              </span>
              <div className="space-y-2 text-sm text-[#edece8]">
                {current.interviewProbes.map((probe, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#1e2128]">
                    {probe}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-sm font-bold text-[#2456d6] dark:text-[#4a7cf6]">
                  Step 8: Measure Pipeline Progress
                </span>
                <p className="text-base font-bold text-[#edece8]">{current.progressStage}</p>
                <p className="text-sm text-[#a6a49c]">
                  Stages tracked: Saved → Preparing → Applied → Assessment → Interview → Offer.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#1e2128] text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
                Pipeline execution verified. All 8 steps calibrated.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
