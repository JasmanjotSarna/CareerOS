'use client';

import React, { useState } from 'react';

interface JobOpportunity {
  id: string;
  role: string;
  company: string;
  location: string;
  region: 'US' | 'EU' | 'UK' | 'Remote';
  matchScore: number;
  salary: string;
  visaSponsorship: 'Verified Available' | 'Unknown' | 'Not Supported';
  hiringManager: 'Direct Verified' | 'Agency Dispatched';
  keyOverlaps: string[];
  missingRequirement: string;
  deadline: string;
}

const OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'job-01',
    role: 'Senior Distributed Systems Engineer',
    company: 'Cloudflare [Sample Listing]',
    location: 'Austin, TX / Hybrid',
    region: 'US',
    matchScore: 88,
    salary: '$145,000 – $175,000 [Disclosed in filing]',
    visaSponsorship: 'Verified Available',
    hiringManager: 'Direct Verified',
    keyOverlaps: ['Go', 'Raft Consensus', 'eBPF Kernel Probing', 'Docker'],
    missingRequirement: 'Linux socket zero-copy buffer management (Kernel 6.x)',
    deadline: 'Closes in 8 days',
  },
  {
    id: 'job-02',
    role: 'Infrastructure Core Engineer',
    company: 'Mistral AI [Sample Listing]',
    location: 'Paris, France / Hybrid',
    region: 'EU',
    matchScore: 82,
    salary: '€85,000 – €110,000 [Disclosed]',
    visaSponsorship: 'Verified Available',
    hiringManager: 'Direct Verified',
    keyOverlaps: ['Python', 'CUDA Profiling', 'vLLM Integration', 'FastAPI'],
    missingRequirement: 'Triton GPU kernel compilation benchmarks',
    deadline: 'Closes in 14 days',
  },
  {
    id: 'job-03',
    role: 'Platform & Reliability Engineer',
    company: 'Monzo Bank [Sample Listing]',
    location: 'London, UK / Remote UK',
    region: 'UK',
    matchScore: 84,
    salary: '£90,000 – £115,000 [Disclosed]',
    visaSponsorship: 'Unknown',
    hiringManager: 'Direct Verified',
    keyOverlaps: ['Go', 'Kubernetes Operator SDK', 'Kafka', 'PostgreSQL'],
    missingRequirement: 'Financial transaction idempotency & ledger audit trails',
    deadline: 'Closes in 11 days',
  },
  {
    id: 'job-04',
    role: 'Full-Stack Performance Specialist',
    company: 'Linear [Sample Listing]',
    location: 'Worldwide Remote',
    region: 'Remote',
    matchScore: 86,
    salary: 'Not Disclosed [Unspecified in listing]',
    visaSponsorship: 'Unknown',
    hiringManager: 'Direct Verified',
    keyOverlaps: ['TypeScript', 'Client-side SQLite sync', 'WebSockets'],
    missingRequirement: 'CRDT operational transform state conflict resolution',
    deadline: 'Rolling review',
  },
];

export function JobsModuleWindow() {
  const [regionFilter, setRegionFilter] = useState<'All' | 'US' | 'EU' | 'UK' | 'Remote'>('All');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity>(OPPORTUNITIES[0]);

  const filtered = regionFilter === 'All' ? OPPORTUNITIES : OPPORTUNITIES.filter((j) => j.region === regionFilter);

  return (
    <div
      data-ui="jobs-module-window"
      className="w-full rounded-2xl bg-[#0e1015] border border-white/10 text-[#f0f2f7] p-6 sm:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
            <span className="w-3 h-3 rounded-full bg-[#353945]" />
          </div>
          <span className="font-mono text-xs text-[#8b92a5] uppercase tracking-wider">
            DISCOVERY.SYS // QUESTION 02: WHERE ARE THE OPPORTUNITIES?
          </span>
        </div>
        <div className="font-mono text-xs text-[#3b82f6]">
          TRANSPARENT MATCH METRICS • HONEST UNKNOWN TAGS
        </div>
      </div>

      {/* International Region Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#141720] border border-white/5 font-mono text-xs">
          {(['All', 'US', 'EU', 'UK', 'Remote'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1 rounded transition-colors ${
                regionFilter === r
                  ? 'bg-[#2563eb] text-white font-semibold'
                  : 'text-[#8b92a5] hover:text-white'
              }`}
            >
              {r === 'All' ? 'ALL REGIONS' : r}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs text-[#8b92a5]">
          SHOWING {filtered.length} CURATED OPENINGS [DEMO DATA]
        </span>
      </div>

      {/* Main Grid: Listings List & Deep Match Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Listings (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map((job) => {
            const isSelected = selectedJob.id === job.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedJob(job)}
                className={`w-full p-4 rounded-xl text-left border transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#1b2234] border-[#2563eb] text-white shadow-sm'
                    : 'bg-[#141720] border-white/5 text-[#8b92a5] hover:border-white/15 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#8b92a5]">{job.company}</span>
                  <span className="font-mono text-xs font-bold text-[#3b82f6]">
                    {job.matchScore}% MATCH
                  </span>
                </div>
                <p className="font-semibold text-sm text-white mt-1 leading-snug">{job.role}</p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-[#8b92a5]">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.deadline}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Job Inspection Surface (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#141720] border border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs text-[#8b92a5] uppercase">{selectedJob.company}</p>
              <h4 className="text-lg font-bold text-white mt-0.5">{selectedJob.role}</h4>
              <p className="text-xs text-[#8b92a5] mt-1">{selectedJob.location}</p>
            </div>
            <div className="text-left sm:text-right font-mono">
              <span className="text-3xl font-extrabold text-[#3b82f6]">{selectedJob.matchScore}%</span>
              <span className="text-[10px] text-[#8b92a5] block">ESTIMATED OVERLAP</span>
            </div>
          </div>

          {/* Honest Unknowns & Transparency Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#191c26] border border-white/5">
              <span className="text-[#8b92a5] block text-[10px] uppercase">COMPENSATION</span>
              <span className="font-medium text-white mt-1 block">{selectedJob.salary}</span>
            </div>

            <div className="p-3 rounded-lg bg-[#191c26] border border-white/5">
              <span className="text-[#8b92a5] block text-[10px] uppercase">VISA SPONSORSHIP</span>
              <span className={`font-medium mt-1 block ${
                selectedJob.visaSponsorship === 'Verified Available'
                  ? 'text-emerald-400'
                  : selectedJob.visaSponsorship === 'Unknown'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {selectedJob.visaSponsorship}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#191c26] border border-white/5">
              <span className="text-[#8b92a5] block text-[10px] uppercase">SOURCE CHANNEL</span>
              <span className="font-medium text-emerald-400 mt-1 block">{selectedJob.hiringManager}</span>
            </div>
          </div>

          {/* Keyword Overlaps & Single Crucial Gap */}
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#191c26] border border-white/5 space-y-1">
              <span className="font-mono text-[11px] text-emerald-400 font-semibold block uppercase">
                VERIFIED COMPETENCY OVERLAPS
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedJob.keyOverlaps.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[11px]">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#191c26] border border-amber-500/20 space-y-1">
              <span className="font-mono text-[11px] text-amber-400 font-semibold block uppercase">
                SINGLE CRITICAL RECRUITMENT DELTA
              </span>
              <p className="text-[#c2c7d6] leading-relaxed">
                {selectedJob.missingRequirement}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#101217] font-mono text-[11px] text-[#8b92a5] flex items-center justify-between">
            <span>Unknowns are surfaced explicitly so you never waste weeks chasing ghost requirements.</span>
            <span className="text-white">Strict Transparency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
