import type {
  Application,
  ApplicationEvent,
  NetworkingContact,
  PortfolioProject,
  SavedJob,
  Task,
  WorkspaceCollection,
  WorkspaceNotification,
  WorkspaceState,
} from '@/types/workspace';
import { EMPTY_WORKSPACE } from '@/types/workspace';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Workspace persistence.
 *
 * Primary store: Supabase tables protected by row-level security
 * (`supabase/migrations/20260920000000_career_workspace.sql`).
 *
 * When those tables are not available yet — or Supabase is not configured —
 * the workspace degrades to a user-scoped localStorage snapshot and reports
 * that state honestly in the UI. It never pretends a failed write succeeded.
 */

export type PersistenceMode = 'supabase' | 'local';

export interface LoadedWorkspace {
  state: WorkspaceState;
  modes: Record<WorkspaceCollection, PersistenceMode>;
  tablesAvailable: boolean;
}

const COLLECTIONS: WorkspaceCollection[] = [
  'applications',
  'applicationEvents',
  'savedJobs',
  'tasks',
  'contacts',
  'projects',
  'notifications',
];

const TABLE_BY_COLLECTION: Record<WorkspaceCollection, string> = {
  applications: 'applications',
  applicationEvents: 'application_events',
  savedJobs: 'saved_jobs',
  tasks: 'tasks',
  contacts: 'networking_contacts',
  projects: 'portfolio_projects',
  notifications: 'notifications',
};

const localKey = (userId: string) => `careeros_workspace_v1_${userId}`;

type Row = Record<string, unknown>;

function rowsToState(collection: WorkspaceCollection, rows: Row[]): unknown[] {
  switch (collection) {
    case 'applications':
      return rows.map((row) => ({
        ...((row.data as Record<string, unknown>) || {}),
        id: String(row.id),
        company: String(row.company || ''),
        roleTitle: String(row.role_title || ''),
        status: row.status,
        jobUrl: row.job_url ? String(row.job_url) : undefined,
        matchScore: row.match_score == null ? undefined : Number(row.match_score),
        createdAt: String(row.created_at || new Date().toISOString()),
        updatedAt: String(row.updated_at || row.created_at || new Date().toISOString()),
      })) as Application[];
    case 'applicationEvents':
      return rows.map((row) => ({
        id: String(row.id),
        applicationId: String(row.application_id),
        fromStatus: (row.from_status as ApplicationEvent['fromStatus']) ?? null,
        toStatus: row.to_status as ApplicationEvent['toStatus'],
        note: row.note ? String(row.note) : undefined,
        createdAt: String(row.created_at),
      })) as ApplicationEvent[];
    case 'savedJobs':
      return rows.map((row) => ({
        id: String(row.id),
        job: row.data as SavedJob['job'],
        savedAt: String(row.saved_at || row.created_at),
        dismissed: Boolean(row.dismissed),
      })) as SavedJob[];
    case 'tasks':
      return rows.map((row) => ({
        ...((row.data as Record<string, unknown>) || {}),
        id: String(row.id),
        title: String(row.title || ''),
        status: row.status,
        priority: row.priority,
        dueAt: row.due_at ? String(row.due_at) : undefined,
        createdAt: String(row.created_at),
      })) as Task[];
    case 'contacts':
      return rows.map((row) => ({
        ...((row.data as Record<string, unknown>) || {}),
        id: String(row.id),
        name: String(row.name || ''),
        company: row.company ? String(row.company) : undefined,
        status: row.status,
        nextFollowUpAt: row.next_follow_up_at ? String(row.next_follow_up_at) : undefined,
        updatedAt: String(row.updated_at || row.created_at),
      })) as NetworkingContact[];
    case 'projects':
      return rows.map((row) => ({
        ...((row.data as Record<string, unknown>) || {}),
        id: String(row.id),
        title: String(row.title || ''),
        status: row.status,
        visibility: row.visibility,
        updatedAt: String(row.updated_at || row.created_at),
      })) as PortfolioProject[];
    case 'notifications':
      return rows.map((row) => ({
        id: String(row.id),
        kind: row.kind,
        title: String(row.title || ''),
        body: String(row.body || ''),
        href: row.href ? String(row.href) : undefined,
        readAt: row.read_at ? String(row.read_at) : undefined,
        createdAt: String(row.created_at),
      })) as WorkspaceNotification[];
    default:
      return [];
  }
}

function entityToRow(
  collection: WorkspaceCollection,
  userId: string,
  entity: Record<string, unknown>
): Row {
  const base: Row = { user_id: userId };
  switch (collection) {
    case 'applications':
      return {
        ...base,
        id: entity.id,
        company: entity.company,
        role_title: entity.roleTitle,
        status: entity.status,
        job_url: entity.jobUrl ?? null,
        match_score: entity.matchScore ?? null,
        data: entity,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt,
      };
    case 'applicationEvents':
      return {
        ...base,
        id: entity.id,
        application_id: entity.applicationId,
        from_status: entity.fromStatus ?? null,
        to_status: entity.toStatus,
        note: entity.note ?? null,
        created_at: entity.createdAt,
      };
    case 'savedJobs': {
      const job = entity.job as SavedJob['job'];
      return {
        ...base,
        id: entity.id,
        external_id: job?.externalId,
        source: job?.source,
        title: job?.title,
        company: job?.company,
        url: job?.url,
        dismissed: entity.dismissed,
        data: job,
        saved_at: entity.savedAt,
      };
    }
    case 'tasks':
      return {
        ...base,
        id: entity.id,
        title: entity.title,
        status: entity.status,
        priority: entity.priority,
        due_at: entity.dueAt ?? null,
        data: entity,
        created_at: entity.createdAt,
      };
    case 'contacts':
      return {
        ...base,
        id: entity.id,
        name: entity.name,
        company: entity.company ?? null,
        status: entity.status,
        next_follow_up_at: entity.nextFollowUpAt ?? null,
        data: entity,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt,
      };
    case 'projects':
      return {
        ...base,
        id: entity.id,
        title: entity.title,
        status: entity.status,
        visibility: entity.visibility,
        data: entity,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt,
      };
    case 'notifications':
      return {
        ...base,
        id: entity.id,
        kind: entity.kind,
        title: entity.title,
        body: entity.body,
        href: entity.href ?? null,
        read_at: entity.readAt ?? null,
        created_at: entity.createdAt,
      };
    default:
      return base;
  }
}

export function readLocalWorkspace(userId: string): WorkspaceState {
  if (typeof window === 'undefined' || !userId) return EMPTY_WORKSPACE;
  try {
    const raw = window.localStorage.getItem(localKey(userId));
    if (!raw) return EMPTY_WORKSPACE;
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    return {
      applications: parsed.applications || [],
      applicationEvents: parsed.applicationEvents || [],
      savedJobs: parsed.savedJobs || [],
      tasks: parsed.tasks || [],
      contacts: parsed.contacts || [],
      projects: parsed.projects || [],
      notifications: parsed.notifications || [],
    };
  } catch {
    return EMPTY_WORKSPACE;
  }
}

export function writeLocalWorkspace(userId: string, state: WorkspaceState): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    window.localStorage.setItem(localKey(userId), JSON.stringify(state));
  } catch {
    // Storage can be full or disabled. UI writes are still reflected in memory.
  }
}

export async function loadWorkspace(userId: string): Promise<LoadedWorkspace> {
  const local = readLocalWorkspace(userId);
  const modes = Object.fromEntries(
    COLLECTIONS.map((collection) => [collection, 'local' as PersistenceMode])
  ) as Record<WorkspaceCollection, PersistenceMode>;

  if (!isSupabaseConfigured() || !userId || userId.startsWith('demo-')) {
    return { state: local, modes, tablesAvailable: false };
  }

  const nextState: WorkspaceState = { ...EMPTY_WORKSPACE };
  let available = 0;

  await Promise.all(
    COLLECTIONS.map(async (collection) => {
      try {
        const { data, error } = await supabase
          .from(TABLE_BY_COLLECTION[collection])
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;

        const records = rowsToState(collection, (data || []) as Row[]);
        (nextState[collection] as unknown[]) = records;
        modes[collection] = 'supabase';
        available += 1;
      } catch {
        (nextState[collection] as unknown[]) = local[collection] as unknown[];
        modes[collection] = 'local';
      }
    })
  );

  return { state: nextState, modes, tablesAvailable: available === COLLECTIONS.length };
}

export async function persistRecord(
  collection: WorkspaceCollection,
  userId: string,
  entity: { id: string } & Record<string, unknown>
): Promise<PersistenceMode> {
  if (!isSupabaseConfigured() || !userId || userId.startsWith('demo-')) return 'local';
  try {
    const { error } = await supabase
      .from(TABLE_BY_COLLECTION[collection])
      .upsert(entityToRow(collection, userId, entity), {
        onConflict: 'id',
      });
    if (error) throw error;
    return 'supabase';
  } catch {
    return 'local';
  }
}

export async function removeRecord(
  collection: WorkspaceCollection,
  userId: string,
  id: string
): Promise<PersistenceMode> {
  if (!isSupabaseConfigured() || !userId || userId.startsWith('demo-')) return 'local';
  try {
    const { error } = await supabase
      .from(TABLE_BY_COLLECTION[collection])
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
    return 'supabase';
  } catch {
    return 'local';
  }
}

export function newId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
