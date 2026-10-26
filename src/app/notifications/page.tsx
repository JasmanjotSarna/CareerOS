'use client';

import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace/WorkspaceContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead, persistenceNotice } = useWorkspace();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopNav />
      <div className="mx-auto flex max-w-[1440px] px-4 sm:px-6">
        <StudentSidebar />
        <main className="min-w-0 flex-1 space-y-6 py-6 lg:py-8 lg:pl-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-[rgba(99,102,241,0.4)] bg-[var(--accent-primary-subtle)] px-3 py-1 text-xs text-[var(--accent-primary)]">
                <Bell className="h-3.5 w-3.5" />
                <span>Notifications</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Notifications center</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Real reminders for due tasks, follow-ups, and application updates.
              </p>
            </div>
            <Button variant="secondary" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          </header>

          {persistenceNotice && (
            <Card className="border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
              {persistenceNotice}
            </Card>
          )}

          <div className="space-y-2">
            {state.notifications.length === 0 && (
              <Card className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                <Bell className="h-6 w-6 text-[var(--text-dim)]" />
                <div className="font-semibold">You're all caught up</div>
                <div className="text-sm text-[var(--text-muted)]">Add due dates to tasks or follow-ups to see reminders here.</div>
              </Card>
            )}
            {state.notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`flex flex-col gap-2 border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between ${
                  notification.readAt ? 'opacity-70' : ''
                }`}
              >
                <div>
                  <div className="font-semibold">{notification.title}</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">{notification.body}</div>
                  <div className="mt-1 text-xs text-[var(--text-dim)]">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notification.href && (
                    <Button variant="ghost" size="sm" onClick={() => window.location.assign(notification.href!)}>
                      Open
                    </Button>
                  )}
                  {!notification.readAt && (
                    <Button variant="secondary" size="sm" onClick={() => markNotificationRead(notification.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
