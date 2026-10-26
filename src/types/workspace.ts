/**
 * CareerOS workspace domain types.
 *
 * These entities power the opportunity → application → follow-up loop that sits
 * on top of the existing readiness/profile engine. Every record is user-scoped.
 */

export const APPLICATION_STATUSES = [
  'interested',
  'saved',
  'preparing',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: 'Interested',
  saved: 'Saved',
  preparing: 'Preparing',
  applied: 'Applied',
  assessment: 'Assessment',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export interface Job {
  /** Stable identity: `${source}:${externalId}`. Used for de-duplication. */
  id: string;
  externalId: string;
  source: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite' | 'unknown';
  employmentType: string;
  salaryText?: string;
  description: string;
  url: string;
  postedAt?: string;
  fetchedAt: string;
  tags: string[];
  /** Only set when the provider explicitly publishes a deadline. */
  deadline?: string;
}

export interface SavedJob {
  id: string;
  job: Job;
  savedAt: string;
  dismissed: boolean;
}

export interface JobMatch {
  score: number;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  factors: Array<{ label: string; score: number; detail: string }>;
  disclaimer: string;
}

export interface Application {
  id: string;
  company: string;
  roleTitle: string;
  jobUrl?: string;
  source?: string;
  location?: string;
  workMode?: Job['workMode'];
  salaryText?: string;
  jobDescription?: string;
  status: ApplicationStatus;
  savedAt: string;
  appliedAt?: string;
  resumeVersion?: string;
  coverLetterText?: string;
  contactName?: string;
  contactEmail?: string;
  followUpAt?: string;
  notes?: string;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note?: string;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueAt?: string;
  applicationId?: string;
  jobUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export type ContactStatus =
  | 'new'
  | 'contacted'
  | 'replied'
  | 'referral_requested'
  | 'referred'
  | 'dormant';

export interface NetworkingContact {
  id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  relationship?: string;
  source?: string;
  status: ContactStatus;
  nextFollowUpAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planned' | 'in_progress' | 'completed';

export interface PortfolioProject {
  id: string;
  title: string;
  summary: string;
  problem?: string;
  contribution?: string;
  techStack: string[];
  repoUrl?: string;
  demoUrl?: string;
  status: ProjectStatus;
  visibility: 'private' | 'public';
  resumeBullets: string[];
  createdAt: string;
  updatedAt: string;
}

export type NotificationKind =
  | 'interview'
  | 'follow_up'
  | 'task_due'
  | 'application_update'
  | 'learning';

export interface WorkspaceNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  readAt?: string;
  createdAt: string;
}

export type WorkspaceCollection =
  | 'applications'
  | 'applicationEvents'
  | 'savedJobs'
  | 'tasks'
  | 'contacts'
  | 'projects'
  | 'notifications';

export type PersistenceMode = 'supabase' | 'local';

export interface WorkspaceState {
  applications: Application[];
  applicationEvents: ApplicationEvent[];
  savedJobs: SavedJob[];
  tasks: Task[];
  contacts: NetworkingContact[];
  projects: PortfolioProject[];
  notifications: WorkspaceNotification[];
}

export const EMPTY_WORKSPACE: WorkspaceState = {
  applications: [],
  applicationEvents: [],
  savedJobs: [],
  tasks: [],
  contacts: [],
  projects: [],
  notifications: [],
};

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'interested',
  'saved',
  'preparing',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
];
