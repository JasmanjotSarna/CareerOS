'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, ListChecks, Plus } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import type { TaskPriority } from '@/types/workspace';

export default function TasksPage() {
  const { state, createTask, toggleTask, persistenceNotice } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    notes: '',
    priority: 'medium' as TaskPriority,
    dueAt: '',
  });

  const todo = state.tasks.filter((task) => task.status === 'todo');
  const done = state.tasks.filter((task) => task.status === 'done');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    await createTask({
      title: form.title,
      notes: form.notes || undefined,
      priority: form.priority,
      dueAt: form.dueAt || undefined,
    });
    setForm({ title: '', notes: '', priority: 'medium', dueAt: '' });
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
                <ListChecks className="h-3.5 w-3.5" />
                <span>Goals & tasks</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Tasks</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Keep follow-ups, prep work, and learning actions visible with reminders derived from real due dates.
              </p>
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsOpen(true)}>
              Add task
            </Button>
          </header>

          {persistenceNotice && (
            <Card className="border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
              {persistenceNotice}
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[var(--border-default)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold">To do</div>
                <span className="text-xs text-[var(--text-dim)]">{todo.length}</span>
              </div>
              <div className="space-y-2">
                {todo.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-start gap-3 rounded-xl border border-[var(--border-subtle)] p-3 text-left transition-colors hover:bg-[var(--surface-primary)]"
                  >
                    <Circle className="mt-0.5 h-4 w-4 text-[var(--text-dim)]" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{task.title}</div>
                      {task.notes && <div className="mt-1 text-sm text-[var(--text-muted)]">{task.notes}</div>}
                      {task.dueAt && (
                        <div className="mt-1 text-xs text-[var(--text-dim)]">
                          Due {new Date(task.dueAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                {todo.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-4 text-center text-sm text-[var(--text-dim)]">
                    Nothing to do right now.
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-[var(--border-default)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold">Completed</div>
                <span className="text-xs text-[var(--text-dim)]">{done.length}</span>
              </div>
              <div className="space-y-2">
                {done.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-start gap-3 rounded-xl border border-[var(--border-subtle)] p-3 text-left opacity-70 transition-colors hover:bg-[var(--surface-primary)] hover:opacity-100"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium line-through">{task.title}</div>
                      {task.completedAt && (
                        <div className="mt-1 text-xs text-[var(--text-dim)]">
                          Completed {new Date(task.completedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                {done.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-4 text-center text-sm text-[var(--text-dim)]">
                    No completed tasks yet.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add task" maxWidth="md">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Priority</span>
              <select
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Due date</span>
              <input
                type="date"
                value={form.dueAt}
                onChange={(event) => setForm((current) => ({ ...current, dueAt: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Notes (optional)</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
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
