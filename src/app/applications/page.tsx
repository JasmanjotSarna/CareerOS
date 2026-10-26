'use client';

import React, { useMemo, useState } from 'react';
import { Columns3, Plus, CalendarClock, ExternalLink } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER, type ApplicationStatus } from '@/types/workspace';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  interested: 'border-slate-400/40 text-slate-300',
  saved: 'border-sky-400/40 text-sky-300',
  preparing: 'border-violet-400/40 text-violet-300',
  applied: 'border-cyan-400/40 text-cyan-300',
  assessment: 'border-amber-400/40 text-amber-300',
  interview: 'border-orange-400/40 text-orange-300',
  offer: 'border-emerald-400/40 text-emerald-300',
  rejected: 'border-rose-400/40 text-rose-300',
  withdrawn: 'border-slate-500/40 text-slate-400',
};

export default function ApplicationsPage() {
  const { state, createApplication, changeApplicationStatus, persistenceNotice } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    company: '',
    roleTitle: '',
    jobUrl: '',
    notes: '',
    status: 'saved' as ApplicationStatus,
  });

  const grouped = useMemo(() => {
    const map = new Map<ApplicationStatus, typeof state.applications>();
    for (const status of APPLICATION_STATUS_ORDER) map.set(status, []);
    for (const application of state.applications) {
      map.get(application.status)?.push(application);
    }
    return map;
  }, [state.applications]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.company.trim() || !form.roleTitle.trim()) return;
    await createApplication({
      company: form.company,
      roleTitle: form.roleTitle,
      jobUrl: form.jobUrl || undefined,
      notes: form.notes || undefined,
      status: form.status,
    });
    setForm({ company: '', roleTitle: '', jobUrl: '', notes: '', status: 'saved' });
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopNav />
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6">
        <StudentSidebar />
        <main className="min-w-0 flex-1 space-y-6 py-6 lg:py-8 lg:pl-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-[rgba(99,102,241,0.4)] bg-[var(--accent-primary-subtle)] px-3 py-1 text-xs text-[var(--accent-primary)]">
                <Columns3 className="h-3.5 w-3.5" />
                <span>Application tracking</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Applications</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Track every application with status history, follow-ups, and connections to jobs and tasks.
              </p>
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsOpen(true)}>
              Add application
            </Button>
          </header>

          {persistenceNotice && (
            <Card className="border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
              {persistenceNotice}
            </Card>
          )}

          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-4 pb-4">
              {APPLICATION_STATUS_ORDER.map((status) => {
                const items = grouped.get(status) || [];
                return (
                  <section key={status} className="w-80 shrink-0">
                    <header className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_COLORS[status]}`}>
                          {APPLICATION_STATUS_LABELS[status]}
                        </span>
                        <span className="text-xs text-[var(--text-dim)]">{items.length}</span>
                      </div>
                    </header>
                    <div className="space-y-2">
                      {items.map((application) => (
                        <Card key={application.id} className="border-[var(--border-default)] p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold">{application.roleTitle}</div>
                              <div className="text-sm text-[var(--text-muted)]">{application.company}</div>
                            </div>
                            {application.matchScore != null && (
                              <span className="font-mono text-xs text-cyan-300">{application.matchScore}%</span>
                            )}
                          </div>
                          {application.jobUrl && (
                            <Link
                              href={application.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--text-dim)] hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Original posting
                            </Link>
                          )}
                          {application.followUpAt && (
                            <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-300">
                              <CalendarClock className="h-3 w-3" />
                              Follow up {new Date(application.followUpAt).toLocaleDateString()}
                            </div>
                          )}
                          <div className="mt-3">
                            <select
                              value={application.status}
                              onChange={(event) =>
                                changeApplicationStatus(
                                  application.id,
                                  event.target.value as ApplicationStatus
                                )
                              }
                              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-2.5 py-1.5 text-xs text-white"
                            >
                              {APPLICATION_STATUS_ORDER.map((option) => (
                                <option key={option} value={option}>
                                  {APPLICATION_STATUS_LABELS[option]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Card>
                      ))}
                      {items.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-4 text-center text-xs text-[var(--text-dim)]">
                          Empty
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add application" maxWidth="md">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Company</span>
              <input
                required
                value={form.company}
                onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Role</span>
              <input
                required
                value={form.roleTitle}
                onChange={(event) => setForm((current) => ({ ...current, roleTitle: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Job URL (optional)</span>
            <input
              value={form.jobUrl}
              onChange={(event) => setForm((current) => ({ ...current, jobUrl: event.target.value }))}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ApplicationStatus }))}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            >
              {APPLICATION_STATUS_ORDER.map((option) => (
                <option key={option} value={option}>
                  {APPLICATION_STATUS_LABELS[option]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Notes (optional)</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={4}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
