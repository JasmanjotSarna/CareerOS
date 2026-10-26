'use client';

import React from 'react';

const JOBS = [
  {
    title: 'Senior Systems Infrastructure Engineer',
    company: 'Platform Architecture Co [Sample listing]',
    location: 'Remote (US / Canada)',
    matchPct: 88,
    salary: 'Not listed by employer',
    visa: 'Unknown (Not specified in job posting)',
    deadline: 'Application closes in 11 days',
    matched: [
      'TypeScript and Go microservices (Demonstrated in GitHub repo)',
      'Docker containerization and multi-stage builds',
      'PostgreSQL query indexing and schema migrations',
    ],
    missing: [
      'Production Kubernetes cluster administration (Requires certification/project)',
      'Experience with eBPF network observability',
    ],
  },
  {
    title: 'Distributed Data Backend Engineer',
    company: 'Logistics Stream Labs [Sample listing]',
    location: 'Hybrid (Austin, TX or Remote)',
    matchPct: 82,
    salary: '$140,000 – $165,000 (Disclosed in posting)',
    visa: 'H-1B transfer supported (Verified by hiring manager)',
    deadline: 'Rolling review (Estimated 18 days)',
    matched: [
      'Python async concurrency and FastAPI endpoints',
      'Redis Pub/Sub message broker integration',
      'REST API security and JWT auth flows',
    ],
    missing: [
      'Kafka cluster partition rebalancing in high-throughput workloads',
    ],
  },
];

export function JobDiscoveryWindow() {
  return (
    <div
      className="w-full max-w-5xl mx-auto rounded-2xl bg-[#1e2128] dark:bg-[#1a1c22] text-[#edece8] p-6 md:p-8 space-y-6 select-none"
    >
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="w-3 h-3 rounded-full bg-[#3f3e37]" />
          <span className="ml-3 text-sm font-semibold text-[#a6a49c]">
            discovery.exec: Transparent Match Engine
          </span>
        </div>
        <div className="text-sm text-[#a6a49c]">
          Labels: Measured vs Unknown • Demo data
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-6">
        {JOBS.map((job) => (
          <div
            key={job.title}
            data-ui="job-card-listing"
            className="p-6 rounded-xl bg-[#262a34] dark:bg-[#22252e] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold text-[#edece8]">{job.title}</h4>
                <p className="text-sm text-[#a6a49c] mt-0.5">{job.company} • {job.location}</p>
                <p className="text-sm text-[#2456d6] dark:text-[#4a7cf6] mt-1 font-medium">{job.deadline}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-3xl font-extrabold text-[#2456d6] dark:text-[#4a7cf6]">
                  {job.matchPct}%
                </span>
                <p className="text-sm text-[#a6a49c]">Estimated Match</p>
              </div>
            </div>

            {/* Compensation & Sponsorship Honesty Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#1e2128] text-sm">
              <div>
                <span className="text-[#a6a49c] block">Salary Compensation:</span>
                <span className="font-semibold text-[#edece8]">{job.salary}</span>
              </div>
              <div>
                <span className="text-[#a6a49c] block">Visa Sponsorship Status:</span>
                <span className="font-semibold text-[#edece8]">{job.visa}</span>
              </div>
            </div>

            {/* Matched vs Missing Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-1">
              <div className="space-y-2">
                <span className="font-bold text-[#2456d6] dark:text-[#4a7cf6] block">
                  Matched Qualifications ({job.matched.length})
                </span>
                {job.matched.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#1e2128] text-[#edece8] flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2456d6] dark:bg-[#4a7cf6] mt-1.5 flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#a6a49c] block">
                  Missing Requirements ({job.missing.length})
                </span>
                {job.missing.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#1e2128] text-[#edece8] flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a6a49c] mt-1.5 flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <span className="text-[#a6a49c]">
                Review requirement overlap before generating tailored application materials.
              </span>
              <button
                type="button"
                className="h-11 px-5 rounded-xl bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white font-semibold text-sm transition-colors active:scale-[0.97]"
              >
                Stage for Application
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
