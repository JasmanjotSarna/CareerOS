import {
  IStudentRepository,
  ITargetRoleRepository,
  IReadinessRepository,
  IAssessmentRepository,
  IFacultyRepository
} from './interfaces';
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
import {
  INITIAL_STUDENT_PROFILE,
  TARGET_ROLES,
  INITIAL_READINESS_SCORES,
  FACULTY_STUDENTS_MOCK
} from '@/lib/data/mockData';

export class MockStudentRepository implements IStudentRepository {
  private profile: StudentProfile = { ...INITIAL_STUDENT_PROFILE };

  async getProfile(studentId: string): Promise<StudentProfile> {
    return this.profile;
  }

  async updateProfile(studentId: string, updates: Partial<StudentProfile>): Promise<StudentProfile> {
    this.profile = { ...this.profile, ...updates, updatedAt: new Date().toISOString() };
    return this.profile;
  }

  async getRoadmapTasks(studentId: string): Promise<RoadmapTask[]> {
    return [];
  }

  async updateTaskStatus(taskId: string, status: RoadmapTask['status']): Promise<RoadmapTask> {
    return {
      id: taskId,
      title: 'Updated Task',
      description: '',
      skillName: '',
      category: 'Data',
      actionType: 'practice',
      weekNumber: 1,
      estimatedMinutes: 30,
      difficulty: 'Intermediate',
      priority: 'High',
      status
    };
  }
}

export class MockTargetRoleRepository implements ITargetRoleRepository {
  async getAllRoles(): Promise<TargetRole[]> {
    return TARGET_ROLES;
  }

  async getRoleById(roleId: string): Promise<TargetRole | null> {
    return TARGET_ROLES.find(r => r.id === roleId) || null;
  }
}

export class MockReadinessRepository implements IReadinessRepository {
  private score: ReadinessScoreBreakdown = { ...INITIAL_READINESS_SCORES };

  async getLatestReadiness(studentId: string): Promise<ReadinessScoreBreakdown> {
    return this.score;
  }

  async recordReadinessUpdate(studentId: string, score: ReadinessScoreBreakdown): Promise<void> {
    this.score = score;
  }

  async getHistoricalReadiness(studentId: string): Promise<Array<{ week: string; score: number }>> {
    return [
      { week: 'Week 1', score: 51 },
      { week: 'Week 2', score: 58 },
      { week: 'Week 3', score: 64 },
      { week: 'Week 4', score: this.score.overall },
    ];
  }
}

export class MockFacultyRepository implements IFacultyRepository {
  private students = [...FACULTY_STUDENTS_MOCK];

  async getCohortStudents(): Promise<FacultyStudentSummary[]> {
    return this.students;
  }

  async getStudentDetail(studentId: string): Promise<FacultyStudentSummary | null> {
    return this.students.find(s => s.id === studentId) || null;
  }

  async dispatchIntervention(studentId: string, note: string): Promise<void> {
    this.students = this.students.map(s =>
      s.id === studentId
        ? { ...s, requiresIntervention: false, aiRecommendedAction: note }
        : s
    );
  }
}
