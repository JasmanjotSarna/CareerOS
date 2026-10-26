'use client';

import React from 'react';
import { Settings, Database, Download, ShieldCheck } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  const { persistenceNotice, supabaseConfigured, tablesAvailable, exportWorkspace } = useWorkspace();
  const { studentProfile } = useApp();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopNav />
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6">
        <StudentSidebar />
        <main className="min-w-0 flex-1 space-y-6 py-6 lg:py-8 lg:pl-8">
          <header>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              <Settings className="h-3.5 w-3.5" />
              <span>Settings & integrations</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Account, workspace persistence, data export, and integration status.
            </p>
          </header>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-[var(--border-default)] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                Account
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Name</span>
                  <span>{studentProfile.fullName || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Email</span>
                  <span>{studentProfile.email || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">University</span>
                  <span>{studentProfile.university || 'Not set'}</span>
                </div>
              </div>
            </Card>

            <Card className="border-[var(--border-default)] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Database className="h-4 w-4 text-cyan-400" />
                Workspace persistence
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Supabase configured</span>
                  <span>{supabaseConfigured ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Career workspace tables</span>
                  <span>{tablesAvailable ? 'Available' : 'Not found'}</span>
                </div>
                {persistenceNotice && <p className="text-xs text-amber-200">{persistenceNotice}</p>}
                <p className="text-xs text-[var(--text-dim)]">
                  Apply <code className="rounded bg-[var(--surface-secondary)] px-1">supabase/migrations/20260920000000_career_workspace.sql</code> to enable cross-device sync. Until then, data is saved locally.
                </p>
              </div>
            </Card>

            <Card className="border-[var(--border-default)] p-5 lg:col-span-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Download className="h-4 w-4 text-cyan-400" />
                    Data export
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Export your profile, applications, tasks, contacts, projects, and notifications as JSON.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={exportWorkspace}>
                  Export workspace data
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
