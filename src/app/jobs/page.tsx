'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { computeJobMatch } from '@/lib/workspace/matching';
import type { Job, JobMatch } from '@/types/workspace';

interface JobSearchResponse {
  jobs: Job[];
  source: string;
  fetchedAt: string;
  cached: boolean;
  attribution: string;
  error?: string;
  message?: string;
}

export default function JobsPage() {
  const { studentProfile, activeTargetRole } = useApp();
  const { saveJob, state } = useWorkspace();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Job[]>([]);
  const [attribution, setAttribution] = useState('');
  const [fetchedAt, setFetchedAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Job | null>(null);

  const savedJobIds = useMemo(
    () => new Set(state.savedJobs.map((saved) => saved.job.id)),
    [state.savedJobs]
  );

  const search = useCallback(
    async (searchQuery: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        const res = await fetch(`/api/jobs/search?${params.toString()}`, { cache: 'no-store' });
        const data = (await res.json()) as JobSearchResponse;
        if (!res.ok || data.error) {
          throw new Error(data.message || data.error || 'Failed to load jobs');
        }
        setResults(data.jobs);
        setAttribution(data.attribution);
        setFetchedAt(data.fetchedAt);
        if (!selected && data.jobs[0]) setSelected(data.jobs[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selected]
  );

  useEffect(() => {
    search('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const match = useMemo<JobMatch | null>(() => {
    if (!selected) return null;
    return computeJobMatch(studentProfile, activeTargetRole, selected);
  }, [selected, studentProfile, activeTargetRole]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopNav />
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6">
        <StudentSidebar />
        <main className="min-w-0 flex-1 space-y-6 py-6 lg:py-8 lg:pl-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-[rgba(99,102,241,0.4)] bg-[var(--accent-primary-subtle)] px-3 py-1 text-xs text-[var(--accent-primary)]">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Job discovery</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Find opportunities</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Search legitimate job listings, see a transparent skill match, and save roles to your application pipeline.
              </p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                search(query);
              }}
              className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-1.5"
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="h-4 w-4 text-[var(--text-dim)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by role, skill, or keyword"
                  className="w-full bg-transparent py-2 text-sm text-white placeholder-[var(--text-dim)] outline-none"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
                Search
              </Button>
            </form>
          </header>

          {attribution && (
            <p className="text-xs text-[var(--text-dim)]">
              {attribution}
              {fetchedAt && ` · Fetched ${new Date(fetchedAt).toLocaleString()}`}
            </p>
          )}

          {error && (
            <Card className="border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-300">
              {error}
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <Card className="flex max-h-[calc(100vh-18rem)] flex-col overflow-hidden border-[var(--border-default)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
                <div className="text-sm font-semibold">Results</div>
                <Badge variant="cyan">{results.length}</Badge>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading && (
                  <div className="space-y-2 p-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="h-20 animate-pulse rounded-xl bg-[var(--surface-secondary)]" />
                    ))}
                  </div>
                )}
                {!isLoading && results.length === 0 && (
                  <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                    No jobs found. Try a different search or broaden your keywords.
                  </div>
                )}
                {results.map((job) => {
                  const active = selected?.id === job.id;
                  const saved = savedJobIds.has(job.id);
                  return (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setSelected(job)}
                      className={`flex w-full flex-col gap-2 border-b border-[var(--border-subtle)] p-4 text-left transition-colors ${
                        active ? 'bg-cyan-500/8' : 'hover:bg-[var(--surface-primary)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--text-primary)]">{job.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Building2 className="h-3.5 w-3.5" />
                            <span className="truncate">{job.company}</span>
                          </div>
                        </div>
                        {saved && <Badge className="border-emerald-400/40 text-emerald-300">Saved</Badge>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span>· {job.employmentType}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="border-[var(--border-default)]">
              {!selected ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 text-center">
                  <Filter className="h-6 w-6 text-[var(--text-dim)]" />
                  <div className="text-sm font-semibold">Select a job to see details and match insights</div>
                  <div className="max-w-md text-sm text-[var(--text-muted)]">
                    Each match is computed from your profile and the posting text with transparent factors — no fabricated probabilities.
                  </div>
                </div>
              ) : (
                <div className="space-y-6 p-6">
                  <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-xl font-bold sm:text-2xl">{selected.title}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />
                          {selected.company}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {selected.location}
                        </span>
                        <span>{selected.employmentType}</span>
                      </div>
                      {selected.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selected.tags.slice(0, 8).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => saveJob(selected)}
                        leftIcon={<Sparkles className="h-4 w-4" />}
                      >
                        {savedJobIds.has(selected.id) ? 'Saved' : 'Save to pipeline'}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        rightIcon={<ExternalLink className="h-4 w-4" />}
                        onClick={() => window.open(selected.url, '_blank', 'noopener,noreferrer')}
                      >
                        View original posting
                      </Button>
                    </div>
                  </header>

                  {match && (
                    <Card className="border-[var(--border-default)] p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-sm font-semibold">Explainable match</div>
                          <p className="mt-1 text-sm text-[var(--text-muted)]">{match.disclaimer}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black">{match.score}%</div>
                          <div className="text-xs text-[var(--text-dim)]">Fit heuristic</div>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {match.factors.map((factor) => (
                          <div
                            key={factor.label}
                            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-3"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{factor.label}</span>
                              <span className="font-mono text-cyan-300">{factor.score}%</span>
                            </div>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">{factor.detail}</p>
                          </div>
                        ))}
                      </div>
                      {(match.missingRequiredSkills.length > 0 || match.missingPreferredSkills.length > 0) && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {match.missingRequiredSkills.length > 0 && (
                            <div>
                              <div className="text-sm font-semibold text-rose-300">Missing required skills</div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {match.missingRequiredSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="rounded-full border border-rose-500/30 px-2.5 py-1 text-xs text-rose-200"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {match.missingPreferredSkills.length > 0 && (
                            <div>
                              <div className="text-sm font-semibold text-amber-300">Missing preferred skills</div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {match.missingPreferredSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="rounded-full border border-amber-500/30 px-2.5 py-1 text-xs text-amber-200"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  )}

                  <div>
                    <div className="mb-3 text-sm font-semibold">Job description</div>
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                      {selected.description || 'No description was provided by the source.'}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
