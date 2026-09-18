import {
  StudentProfile,
  TargetRole,
  ReadinessScoreBreakdown,
  RoadmapTask,
  TechnicalInterviewEvaluation,
  HRInterviewEvaluation,
  CommunicationMetric,
  AptitudeAssessmentSession,
  FacultyStudentSummary,
  CareerOSEvent
} from '@/types';

/**
 * Service/Repository contracts for future Supabase or backend service migration.
 * UI components interact with these abstractions instead of hardcoded database calls.
 */

export interface IStudentRepository {
  getProfile(studentId: string): Promise<StudentProfile>;
  updateProfile(studentId: string, updates: Partial<StudentProfile>): Promise<StudentProfile>;
  getRoadmapTasks(studentId: string): Promise<RoadmapTask[]>;
  updateTaskStatus(taskId: string, status: RoadmapTask['status']): Promise<RoadmapTask>;
  upsertStudentSkill?(studentId: string, skill: { name: string; category?: string; proficiency: number; verified?: boolean }): Promise<void>;
}

export interface ITargetRoleRepository {
  getAllRoles(): Promise<TargetRole[]>;
  getRoleById(roleId: string): Promise<TargetRole | null>;
}

export interface IReadinessRepository {
  getLatestReadiness(studentId: string): Promise<ReadinessScoreBreakdown>;
  recordReadinessUpdate(studentId: string, score: ReadinessScoreBreakdown): Promise<void>;
  getHistoricalReadiness(studentId: string): Promise<Array<{ week: string; score: number }>>;
}

export interface IAssessmentRepository {
  saveTechnicalInterview(session: TechnicalInterviewEvaluation): Promise<void>;
  saveHRInterview(session: HRInterviewEvaluation): Promise<void>;
  saveCommunicationDrill(metric: CommunicationMetric): Promise<void>;
  saveAptitudeSession(session: AptitudeAssessmentSession): Promise<void>;
  getEventLog(studentId: string): Promise<CareerOSEvent[]>;
}

export interface IFacultyRepository {
  getCohortStudents(): Promise<FacultyStudentSummary[]>;
  getStudentDetail(studentId: string): Promise<FacultyStudentSummary | null>;
  dispatchIntervention(studentId: string, note: string): Promise<void>;
}
