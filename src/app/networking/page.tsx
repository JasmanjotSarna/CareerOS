'use client';

import React, { useState } from 'react';
import { Contact, Plus, Mail, Link as LinkIcon } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export default function NetworkingPage() {
  const { state, createContact, persistenceNotice } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    linkedinUrl: '',
    notes: '',
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    await createContact({
      name: form.name,
      company: form.company || undefined,
      role: form.role || undefined,
      email: form.email || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      notes: form.notes || undefined,
    });
    setForm({ name: '', company: '', role: '', email: '', linkedinUrl: '', notes: '' });
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
                <Contact className="h-3.5 w-3.5" />
                <span>Networking & referrals</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Contacts</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Lightweight CRM for recruiters, alumni, and employees. Keep follow-up dates and context in one place.
              </p>
            </div>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsOpen(true)}>
              Add contact
            </Button>
          </header>

          {persistenceNotice && (
            <Card className="border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
              {persistenceNotice}
            </Card>
          )}

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {state.contacts.map((contact) => (
              <Card key={contact.id} className="border-[var(--border-default)] p-4">
                <div className="text-base font-semibold">{contact.name}</div>
                {(contact.role || contact.company) && (
                  <div className="mt-1 text-sm text-[var(--text-muted)]">
                    {[contact.role, contact.company].filter(Boolean).join(' · ')}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
                  {contact.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {contact.email}
                    </span>
                  )}
                  {contact.linkedinUrl && (
                    <span className="inline-flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5" />
                      LinkedIn
                    </span>
                  )}
                </div>
                {contact.notes && <p className="mt-3 text-sm text-[var(--text-secondary)]">{contact.notes}</p>}
              </Card>
            ))}
            {state.contacts.length === 0 && (
              <Card className="col-span-full flex flex-col items-center justify-center gap-2 p-8 text-center">
                <Contact className="h-6 w-6 text-[var(--text-dim)]" />
                <div className="font-semibold">No contacts yet</div>
                <div className="text-sm text-[var(--text-muted)]">Add people you want to reach out to for referrals or advice.</div>
              </Card>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add contact" maxWidth="md">
        <form onSubmit={submit} className="space-y-4">
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Company</span>
              <input
                value={form.company}
                onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Role</span>
              <input
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[var(--text-muted)]">LinkedIn URL</span>
              <input
                value={form.linkedinUrl}
                onChange={(event) => setForm((current) => ({ ...current, linkedinUrl: event.target.value }))}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Notes</span>
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
