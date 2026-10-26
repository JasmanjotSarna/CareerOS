'use client';

import React, { useState } from 'react';
import { FolderKanban, Plus, Globe } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';

export default function PortfolioPage() {
  const { state, createProject, persistenceNotice } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    techStack: '',
    repoUrl: '',
    demoUrl: '',
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) return;
    await createProject({
      title: form.title,
      summary: form.summary,
      techStack: form.techStack
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      repoUrl: form.repoUrl || undefined,
      demoUrl: form.demoUrl || undefined,
    });
    setForm({ title: '', summary: '', techStack: '', repoUrl: '', demoUrl: '' });
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
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Portfolio & projects</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Projects</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Showcase real work with context, contribution, and resume-ready bullet points. Sharing is opt-in.
              </p>
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsOpen(true)}>
              Add project
            </Button>
          </header>

          {persistenceNotice && (
            <Card className="border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
              {persistenceNotice}
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {state.projects.map((project) => (
              <Card key={project.id} className="border-[var(--border-default)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{project.title}</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">{project.summary}</div>
                  </div>
                  <span className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-xs text-[var(--text-dim)]">
                    {project.visibility}
                  </span>
                </div>
                {project.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  {project.repoUrl && (
                    <Link
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-white"
                    >
                      <Globe className="h-4 w-4" />
                      Repository
                    </Link>
                  )}
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-white"
                    >
                      <Globe className="h-4 w-4" />
                      Live demo
                    </Link>
                  )}
                </div>
              </Card>
            ))}
            {state.projects.length === 0 && (
              <Card className="col-span-full flex flex-col items-center justify-center gap-2 p-8 text-center">
                <FolderKanban className="h-6 w-6 text-[var(--text-dim)]" />
                <div className="font-semibold">No projects yet</div>
                <div className="text-sm text-[var(--text-muted)]">Document real projects with evidence and turn them into resume bullets.</div>
              </Card>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add project" maxWidth="md">
        <form onSubmit={submit} className="space-y-4">
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Title</span>
            <input
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Summary</span>
            <textarea
              required
              value={form.summary}
              onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
              rows={4}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Tech stack (comma separated)</span>
            <input
              value={form.techStack}
              onChange={(event) => setForm((current) => ({ ...current, techStack: event.target.value }))}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Repo URL</span>
              <input
                value={form.repoUrl}
                onChange={(event) => setForm((current) => ({ ...current, repoUrl: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Demo URL</span>
              <input
                value={form.demoUrl}
                onChange={(event) => setForm((current) => ({ ...current, demoUrl: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
          </div>
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
