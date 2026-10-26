'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useApp } from '@/lib/context/AppContext';
import type {
  Application,
  ApplicationEvent,
  ApplicationStatus,
  Job,
  NetworkingContact,
  PortfolioProject,
  SavedJob,
  Task,
  TaskPriority,
  WorkspaceCollection,
  WorkspaceNotification,
  WorkspaceState,
} from '@/types/workspace';
import { EMPTY_WORKSPACE } from '@/types/workspace';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  loadWorkspace,
  newId,
  persistRecord,
  readLocalWorkspace,
  removeRecord,
  writeLocalWorkspace,
  type PersistenceMode,
} from './persistence';

interface WorkspaceContextValue {
  isReady: boolean;
  userId: string;
  state: WorkspaceState;
  modes: Record<WorkspaceCollection, PersistenceMode>;
  supabaseConfigured: boolean;
  tablesAvailable: boolean;
  persistenceNotice: string | null;
  unreadNotificationCount: number;

  saveJob: (job: Job) => Promise<SavedJob>;
  dismissJob: (jobId: string) => Promise<void>;
  removeSavedJob: (savedJobId: string) => Promise<void>;

  createApplication: (input: NewApplicationInput) => Promise<Application>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  changeApplicationStatus: (
    id: string,
    status: ApplicationStatus,
    note?: string
  ) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;

  createTask: (input: NewTaskInput) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  createContact: (input: NewContactInput) => Promise<NetworkingContact>;
  updateContact: (id: string, updates: Partial<NetworkingContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  createProject: (input: NewProjectInput) => Promise<PortfolioProject>;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearReadNotifications: () => Promise<void>;

  exportWorkspace: () => void;
}

export interface NewApplicationInput {
  company: string;
  roleTitle: string;
  jobUrl?: string;
  source?: string;
  location?: string;
  workMode?: Job['workMode'];
  salaryText?: string;
  jobDescription?: string;
  status?: ApplicationStatus;
  resumeVersion?: string;
  coverLetterText?: string;
  contactName?: string;
  contactEmail?: string;
  followUpAt?: string;
  notes?: string;
  matchScore?: number;
}

export interface NewTaskInput {
  title: string;
  notes?: string;
  priority?: TaskPriority;
  dueAt?: string;
  applicationId?: string;
  jobUrl?: string;
}

export interface NewContactInput {
  name: string;
  company?: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  relationship?: string;
  source?: string;
  status?: NetworkingContact['status'];
  nextFollowUpAt?: string;
  notes?: string;
}

export interface NewProjectInput {
  title: string;
  summary: string;
  problem?: string;
  contribution?: string;
  techStack?: string[];
  repoUrl?: string;
  demoUrl?: string;
  status?: PortfolioProject['status'];
  visibility?: PortfolioProject['visibility'];
  resumeBullets?: string[];
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const emptyModes = (): Record<WorkspaceCollection, PersistenceMode> => ({
  applications: 'local',
  applicationEvents: 'local',
  savedJobs: 'local',
  tasks: 'local',
  contacts: 'local',
  projects: 'local',
  notifications: 'local',
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { studentProfile } = useApp();
  const userId = studentProfile.id;

  const [state, setState] = useState<WorkspaceState>(() =>
    typeof window !== 'undefined' && userId ? readLocalWorkspace(userId) : EMPTY_WORKSPACE
  );
  const [modes, setModes] = useState<Record<WorkspaceCollection, PersistenceMode>>(emptyModes);
  const [tablesAvailable, setTablesAvailable] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [lastCloudWriteFailed, setLastCloudWriteFailed] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setCollection = useCallback(
    <K extends keyof WorkspaceState>(collection: K, values: WorkspaceState[K]) => {
      setState((current) => ({ ...current, [collection]: values }));
    },
    []
  );

  const writeLocal = useCallback(
    (next: WorkspaceState) => {
      if (userId) writeLocalWorkspace(userId, next);
    },
    [userId]
  );

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsReady(false);
      return;
    }
    setIsReady(false);
    loadWorkspace(userId).then((loaded) => {
      if (!active) return;
      setState(loaded.state);
      setModes(loaded.modes);
      setTablesAvailable(loaded.tablesAvailable);
      setIsReady(true);
      writeLocalWorkspace(userId, loaded.state);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  // Keep a rolling local snapshot for every change. This is a backup, not the
  // claimed primary store when Supabase is available.
  useEffect(() => {
    if (!isReady || !userId) return;
    writeLocalWorkspace(userId, state);
  }, [state, isReady, userId]);

  const trackWrite = useCallback((mode: PersistenceMode) => {
    if (mode === 'local' && isSupabaseConfigured()) setLastCloudWriteFailed(true);
  }, []);

  const persist = useCallback(
    async (
      collection: WorkspaceCollection,
      entity: { id: string } & Record<string, unknown>
    ) => {
      if (!userId) return;
      const mode = await persistRecord(collection, userId, entity);
      setModes((current) => ({ ...current, [collection]: mode }));
      trackWrite(mode);
    },
    [userId, trackWrite]
  );

  const saveJob = useCallback(
    async (job: Job): Promise<SavedJob> => {
      const existing = stateRef.current.savedJobs.find((saved) => saved.job.id === job.id);
      const record: SavedJob = existing
        ? { ...existing, job, dismissed: false }
        : {
            id: newId('saved'),
            job,
            savedAt: new Date().toISOString(),
            dismissed: false,
          };
      const next = existing
        ? stateRef.current.savedJobs.map((saved) => (saved.id === record.id ? record : saved))
        : [record, ...stateRef.current.savedJobs];
      setCollection('savedJobs', next);
      await persist('savedJobs', record as unknown as { id: string } & Record<string, unknown>);
      return record;
    },
    [persist, setCollection]
  );

  const dismissJob = useCallback(
    async (jobId: string) => {
      const record = stateRef.current.savedJobs.find((saved) => saved.job.id === jobId);
      if (!record) return;
      const updated: SavedJob = { ...record, dismissed: true };
      setCollection(
        'savedJobs',
        stateRef.current.savedJobs.map((saved) => (saved.id === record.id ? updated : saved))
      );
      await persist('savedJobs', updated as unknown as { id: string } & Record<string, unknown>);
    },
    [persist, setCollection]
  );

  const removeSavedJob = useCallback(
    async (savedJobId: string) => {
      setCollection('savedJobs', stateRef.current.savedJobs.filter((saved) => saved.id !== savedJobId));
      if (userId) await removeRecord('savedJobs', userId, savedJobId);
    },
    [setCollection, userId]
  );

  const addNotification = useCallback(
    async (notification: Omit<WorkspaceNotification, 'id' | 'createdAt'>) => {
      const record: WorkspaceNotification = {
        ...notification,
        id: newId('notif'),
        createdAt: new Date().toISOString(),
      };
      setCollection('notifications', [record, ...stateRef.current.notifications]);
      await persist('notifications', record as unknown as { id: string } & Record<string, unknown>);
      return record;
    },
    [persist, setCollection]
  );

  const createApplication = useCallback(
    async (input: NewApplicationInput): Promise<Application> => {
      const now = new Date().toISOString();
      const record: Application = {
        id: newId('app'),
        company: input.company.trim(),
        roleTitle: input.roleTitle.trim(),
        jobUrl: input.jobUrl?.trim() || undefined,
        source: input.source,
        location: input.location,
        workMode: input.workMode,
        salaryText: input.salaryText,
        jobDescription: input.jobDescription,
        status: input.status || 'saved',
        savedAt: now,
        appliedAt: input.status && ['applied', 'assessment', 'interview', 'offer', 'rejected'].includes(input.status)
          ? now
          : undefined,
        resumeVersion: input.resumeVersion,
        coverLetterText: input.coverLetterText,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        followUpAt: input.followUpAt,
        notes: input.notes,
        matchScore: input.matchScore,
        createdAt: now,
        updatedAt: now,
      };

      const event: ApplicationEvent = {
        id: newId('event'),
        applicationId: record.id,
        fromStatus: null,
        toStatus: record.status,
        note: 'Application created',
        createdAt: now,
      };

      setState((current) => ({
        ...current,
        applications: [record, ...current.applications],
        applicationEvents: [event, ...current.applicationEvents],
      }));

      await Promise.all([
        persist('applications', record as unknown as { id: string } & Record<string, unknown>),
        persist('applicationEvents', event as unknown as { id: string } & Record<string, unknown>),
      ]);
      return record;
    },
    [persist]
  );

  const updateApplication = useCallback(
    async (id: string, updates: Partial<Application>) => {
      const current = stateRef.current.applications.find((application) => application.id === id);
      if (!current) return;
      const updated: Application = {
        ...current,
        ...updates,
        id: current.id,
        updatedAt: new Date().toISOString(),
      };
      setCollection(
        'applications',
        stateRef.current.applications.map((application) => (application.id === id ? updated : application))
      );
      await persist('applications', updated as unknown as { id: string } & Record<string, unknown>);
    },
    [persist, setCollection]
  );

  const changeApplicationStatus = useCallback(
    async (id: string, status: ApplicationStatus, note?: string) => {
      const current = stateRef.current.applications.find((application) => application.id === id);
      if (!current || current.status === status) return;
      const now = new Date().toISOString();
      const updated: Application = {
        ...current,
        status,
        updatedAt: now,
        appliedAt:
          current.appliedAt ||
          (['applied', 'assessment', 'interview', 'offer', 'rejected'].includes(status) ? now : undefined),
      };

      const event: ApplicationEvent = {
        id: newId('event'),
        applicationId: id,
        fromStatus: current.status,
        toStatus: status,
        note,
        createdAt: now,
      };

      setState((stateValue) => ({
        ...stateValue,
        applications: stateValue.applications.map((application) =>
          application.id === id ? updated : application
        ),
        applicationEvents: [event, ...stateValue.applicationEvents],
      }));

      await Promise.all([
        persist('applications', updated as unknown as { id: string } & Record<string, unknown>),
        persist('applicationEvents', event as unknown as { id: string } & Record<string, unknown>),
      ]);

      if (['interview', 'assessment', 'offer'].includes(status)) {
        await addNotification({
          kind: 'application_update',
          title: `${current.company} moved to ${status}`,
          body: `${current.roleTitle} is now in the ${status} stage. Add any next steps or follow-up dates.`,
          href: '/applications',
        });
      }
    },
    [addNotification, persist]
  );

  const deleteApplication = useCallback(
    async (id: string) => {
      setState((current) => ({
        ...current,
        applications: current.applications.filter((application) => application.id !== id),
        applicationEvents: current.applicationEvents.filter((event) => event.applicationId !== id),
        tasks: current.tasks.map((task) =>
          task.applicationId === id ? { ...task, applicationId: undefined } : task
        ),
      }));
      if (userId) await removeRecord('applications', userId, id);
    },
    [userId]
  );

  const createTask = useCallback(
    async (input: NewTaskInput): Promise<Task> => {
      const record: Task = {
        id: newId('task'),
        title: input.title.trim(),
        notes: input.notes,
        priority: input.priority || 'medium',
        status: 'todo',
        dueAt: input.dueAt,
        applicationId: input.applicationId,
        jobUrl: input.jobUrl,
        createdAt: new Date().toISOString(),
      };
      setCollection('tasks', [record, ...stateRef.current.tasks]);
      await persist('tasks', record as unknown as { id: string } & Record<string, unknown>);
      return record;
    },
    [persist, setCollection]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      const current = stateRef.current.tasks.find((task) => task.id === id);
      if (!current) return;
      const updated: Task = { ...current, ...updates, id: current.id };
      setCollection(
        'tasks',
        stateRef.current.tasks.map((task) => (task.id === id ? updated : task))
      );
      await persist('tasks', updated as unknown as { id: string } & Record<string, unknown>);
    },
    [persist, setCollection]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const current = stateRef.current.tasks.find((task) => task.id === id);
      if (!current) return;
      const done = current.status !== 'done';
      const updated: Task = {
        ...current,
        status: done ? 'done' : 'todo',
        completedAt: done ? new Date().toISOString() : undefined,
      };
      setCollection(
        'tasks',
        stateRef.current.tasks.map((task) => (task.id === id ? updated : task))
      );
      await persist('tasks', updated as unknown as { id: string } & Record<string, unknown>);
    },
    [persist, setCollection]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setCollection('tasks', stateRef.current.tasks.filter((task) => task.id !== id));
      if (userId) await removeRecord('tasks', userId, id);
    },
    [setCollection, userId]
  );

  const createContact = useCallback(
    async (input: NewContactInput): Promise<NetworkingContact> => {
      const now = new Date().toISOString();
      const record: NetworkingContact = {
        id: newId('contact'),
        name: input.name.trim(),
        company: input.company,
        role: input.role,
        email: input.email,
        linkedinUrl: input.linkedinUrl,
        relationship: input.relationship,
        source: input.source,
        status: input.status || 'new',
        nextFollowUpAt: input.nextFollowUpAt,
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };
      setCollection('contacts', [record, ...stateRef.current.contacts]);
      await persist('contacts', record as unknown as { id: string } & Record<string, unknown>);
      return record;
    },
    [persist, setCollection]
  );

  const updateContact = useCallback(
    async (id: string, updates: Partial<NetworkingContact>) => {
      const current = stateRef.current.contacts.find((contact) => contact.id === id);
      if (!current) return;
      const updated: NetworkingContact = {
        ...current,
        ...updates,
        id: current.id,
        updatedAt: new Date().toISOString(),
      };
      setCollection(
        'contacts',
        stateRef.current.contacts.map((contact) => (contact.id === id ? updated : contact))
      );
      await persist('contacts', updated as unknown as { id: string } & Record<string, unknown>);
    },
    [persist, setCollection]
  );

  const deleteContact = useCallback(
    async (id: string) => {
      setCollection('contacts', stateRef.current.contacts.filter((contact) => contact.id !== id));
      if (userId) await removeRecord('contacts', userId, id);
    },
    [setCollection, userId]
  );

  const createProject = useCallback(
    async (input: NewProjectInput): Promise<PortfolioProject> => {
      const now = new Date().toISOString();
      const record: PortfolioProject = {
        id: newId('project'),
        title: input.title.trim(),
        summary: input.summary.trim(),
        problem: input.problem,
        contribution: input.contribution,
        techStack: input.techStack || [],
        repoUrl: input.repoUrl,
        demoUrl: input.demoUrl,
        status: input.status || 'in_progress',
        visibility: input.visibility || 'private',
        resumeBullets: input.resumeBullets || [],
        createdAt: now,
        updatedAt: now,
      };
      setCollection('projects', [record, ...stateRef.current.projects]);
      await persist('projects', record as unknown as { id: string } & Record<string, unknown>);
      return record;
    },
    [persist, setCollection]
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<PortfolioProject>) => {
      const current = stateRef.current.projects.find((project) => project.id === id);
      if (!current) return;
      const updated: PortfolioProject = {
        ...current,
        ...updates,
        id: current.id,
        updatedAt: new Date().toISOString(),
      };
      setCollection(
        'projects',
        stateRef.current.projects.map((project) => (project.id === id ? updated : project))
      );
      await persist('projects', updated as unknown as { id: string } & Record<string, unknown>);
    },
    [persist, setCollection]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      setCollection('projects', stateRef.current.projects.filter((project) => project.id !== id));
      if (userId) await removeRecord('projects', userId, id);
    },
    [setCollection, userId]
  );

  const markNotificationRead = useCallback(
    async (id: string) => {
      const current = stateRef.current.notifications.find((notification) => notification.id === id);
      if (!current || current.readAt) return;
      const updated = { ...current, readAt: new Date().toISOString() };
      setCollection(
        'notifications',
        stateRef.current.notifications.map((notification) =>
          notification.id === id ? updated : notification
        )
      );
      await persist(
        'notifications',
        updated as unknown as { id: string } & Record<string, unknown>
      );
    },
    [persist, setCollection]
  );

  const markAllNotificationsRead = useCallback(async () => {
    const now = new Date().toISOString();
    const updated = stateRef.current.notifications.map((notification) =>
      notification.readAt ? notification : { ...notification, readAt: now }
    );
    setCollection('notifications', updated);
    await Promise.all(
      updated
        .filter((notification) => notification.readAt === now)
        .map((notification) =>
          persist('notifications', notification as unknown as { id: string } & Record<string, unknown>)
        )
    );
  }, [persist, setCollection]);

  const clearReadNotifications = useCallback(async () => {
    const toRemove = stateRef.current.notifications.filter((notification) => notification.readAt);
    setCollection(
      'notifications',
      stateRef.current.notifications.filter((notification) => !notification.readAt)
    );
    if (userId) {
      await Promise.all(toRemove.map((notification) => removeRecord('notifications', userId, notification.id)));
    }
  }, [setCollection, userId]);

  /**
   * Derive reminders from real due dates. IDs are deterministic so a reload
   * cannot duplicate the same reminder.
   */
  useEffect(() => {
    if (!isReady) return;
    const now = Date.now();
    const withinThreeDays = (value?: string) => {
      if (!value) return false;
      const time = new Date(value).getTime();
      return !Number.isNaN(time) && time <= now + 3 * 86_400_000;
    };

    const existingIds = new Set(stateRef.current.notifications.map((notification) => notification.id));
    const candidates: Array<WorkspaceNotification> = [];

    for (const task of stateRef.current.tasks) {
      if (task.status === 'done' || !withinThreeDays(task.dueAt)) continue;
      const dueKey = (task.dueAt || '').slice(0, 10);
      const id = `auto-task-${task.id}-${dueKey}`;
      if (existingIds.has(id)) continue;
      candidates.push({
        id,
        kind: 'task_due',
        title: `Task due: ${task.title}`,
        body: task.dueAt
          ? `Due ${new Date(task.dueAt).toLocaleDateString()}.`
          : 'This task is due soon.',
        href: '/tasks',
        createdAt: new Date().toISOString(),
      });
    }

    for (const application of stateRef.current.applications) {
      if (
        !withinThreeDays(application.followUpAt) ||
        ['rejected', 'withdrawn', 'offer'].includes(application.status)
      ) {
        continue;
      }
      const dueKey = (application.followUpAt || '').slice(0, 10);
      const id = `auto-app-${application.id}-${dueKey}`;
      if (existingIds.has(id)) continue;
      candidates.push({
        id,
        kind: 'follow_up',
        title: `Follow up with ${application.company}`,
        body: `${application.roleTitle} · follow-up scheduled for ${new Date(application.followUpAt!).toLocaleDateString()}.`,
        href: '/applications',
        createdAt: new Date().toISOString(),
      });
    }

    for (const contact of stateRef.current.contacts) {
      if (contact.status === 'dormant' || !withinThreeDays(contact.nextFollowUpAt)) continue;
      const dueKey = (contact.nextFollowUpAt || '').slice(0, 10);
      const id = `auto-contact-${contact.id}-${dueKey}`;
      if (existingIds.has(id)) continue;
      candidates.push({
        id,
        kind: 'follow_up',
        title: `Reconnect with ${contact.name}`,
        body: contact.company
          ? `${contact.company}${contact.role ? ` · ${contact.role}` : ''}`
          : 'Networking follow-up due.',
        href: '/networking',
        createdAt: new Date().toISOString(),
      });
    }

    if (candidates.length > 0) {
      setState((current) => ({
        ...current,
        notifications: [...candidates, ...current.notifications],
      }));
    }
  }, [isReady, state.applications, state.tasks, state.contacts]);

  const unreadNotificationCount = useMemo(
    () => state.notifications.filter((notification) => !notification.readAt).length,
    [state.notifications]
  );

  const persistenceNotice = useMemo(() => {
    if (!isSupabaseConfigured()) {
      return 'Supabase is not configured. Workspace data is saved in this browser only.';
    }
    if (!tablesAvailable || lastCloudWriteFailed) {
      return 'Cloud workspace tables are not available yet. Changes are saved in this browser. Apply the career_workspace migration to sync across devices.';
    }
    return null;
  }, [tablesAvailable, lastCloudWriteFailed]);

  const exportWorkspace = useCallback(() => {
    if (!userId) return;
    const payload = {
      exportedAt: new Date().toISOString(),
      userId,
      profile: studentProfile,
      workspace: stateRef.current,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careeros-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [studentProfile, userId]);

  const value: WorkspaceContextValue = {
    isReady,
    userId,
    state,
    modes,
    supabaseConfigured: isSupabaseConfigured(),
    tablesAvailable,
    persistenceNotice,
    unreadNotificationCount,
    saveJob,
    dismissJob,
    removeSavedJob,
    createApplication,
    updateApplication,
    changeApplicationStatus,
    deleteApplication,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    createContact,
    updateContact,
    deleteContact,
    createProject,
    updateProject,
    deleteProject,
    markNotificationRead,
    markAllNotificationsRead,
    clearReadNotifications,
    exportWorkspace,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
}
