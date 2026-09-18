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
  CareerOSEvent,
  SkillCategory
} from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  MockStudentRepository,
  MockTargetRoleRepository,
  MockReadinessRepository,
  MockFacultyRepository
} from './mockRepository';

const shouldUseMockFallback = () => {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !isSupabaseConfigured();
};

export class SupabaseStudentRepository implements IStudentRepository {
  private fallback = new MockStudentRepository();

  async getProfile(studentId: string): Promise<StudentProfile> {
    if (shouldUseMockFallback()) {
      return this.fallback.getProfile(studentId);
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          student_skills (*)
        `)
        .eq('id', studentId)
        .single();

      if (error || !data) {
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          return this.fallback.getProfile(studentId);
        }
        throw error || new Error('Profile not found');
      }

      const profile: StudentProfile = {
        id: data.id,
        userId: data.id,
        fullName: data.full_name || 'Student User',
        email: data.email || '',
        university: data.university || 'JECRC University',
        degree: data.degree || 'B.Tech',
        branch: data.branch || 'CSE',
        graduationYear: data.graduation_year || 2026,
        cgpa: Number(data.cgpa) || 8.5,
        targetRoleId: data.target_role_id || 'role-sde-1',
        targetRoleTitle: data.target_role_id === 'role-sde-1' ? 'Software Engineer — SDE-1' : 'Target Role',
        phone: data.phone || '',
        linkedinUrl: data.linkedin_url || '',
        githubUrl: data.github_url || '',
        portfolioUrl: data.portfolio_url || '',
        skills: (data.student_skills || []).map((sk: Record<string, unknown>, idx: number) => ({
          id: String(sk.id || `sk-${idx}`),
          name: String(sk.name || ''),
          category: (sk.category as SkillCategory) || 'Programming',
          currentProficiency: Number(sk.current_proficiency) || 0,
          verified: Boolean(sk.verified),
          lastAssessed: String(sk.last_assessed || new Date().toISOString())
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return profile;
    } catch {
      return this.fallback.getProfile(studentId);
    }
  }

  async updateProfile(studentId: string, updates: Partial<StudentProfile>): Promise<StudentProfile> {
    if (shouldUseMockFallback()) {
      return this.fallback.updateProfile(studentId, updates);
    }

    try {
      const dbUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      };

      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.university !== undefined) dbUpdates.university = updates.university;
      if (updates.degree !== undefined) dbUpdates.degree = updates.degree;
      if (updates.branch !== undefined) dbUpdates.branch = updates.branch;
      if (updates.graduationYear !== undefined) dbUpdates.graduation_year = updates.graduationYear;
      if (updates.cgpa !== undefined) dbUpdates.cgpa = updates.cgpa;
      if (updates.targetRoleId !== undefined) dbUpdates.target_role_id = updates.targetRoleId;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
      if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl;
      if (updates.portfolioUrl !== undefined) dbUpdates.portfolio_url = updates.portfolioUrl;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', studentId);

      if (error) {
        console.warn('Supabase updateProfile error:', error.message);
      }

      return this.getProfile(studentId);
    } catch {
      return this.fallback.updateProfile(studentId, updates);
    }
  }

  // Unified cutover to roadmap_milestones
  async getRoadmapTasks(studentId: string): Promise<RoadmapTask[]> {
    if (shouldUseMockFallback()) {
      return this.fallback.getRoadmapTasks(studentId);
    }

    try {
      // Read directly from roadmap_milestones
      const { data, error } = await supabase
        .from('roadmap_milestones')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((m: Record<string, unknown>, idx: number) => ({
          id: String(m.id),
          title: String(m.title),
          description: `Milestone #${idx + 1} for target role achievement`,
          skillName: 'Core Competency',
          category: 'Programming' as SkillCategory,
          actionType: 'practice' as RoadmapTask['actionType'],
          weekNumber: Math.floor(idx / 3) + 1,
          estimatedMinutes: 45,
          difficulty: 'Intermediate' as RoadmapTask['difficulty'],
          priority: 'High' as RoadmapTask['priority'],
          status: (m.status as RoadmapTask['status']) || 'pending'
        }));
      }

      // Fallback check against legacy roadmap_tasks if milestones are not yet seeded
      const { data: legacyData } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .eq('profile_id', studentId)
        .order('week_number', { ascending: true });

      if (legacyData && legacyData.length > 0) {
        return legacyData.map((t: Record<string, unknown>) => ({
          id: String(t.id),
          title: String(t.title),
          description: String(t.description || ''),
          skillName: String(t.skill_name || ''),
          category: (t.category as SkillCategory) || 'Programming',
          actionType: (t.action_type as RoadmapTask['actionType']) || 'practice',
          weekNumber: Number(t.week_number) || 1,
          estimatedMinutes: Number(t.estimated_minutes) || 30,
          difficulty: (t.difficulty as RoadmapTask['difficulty']) || 'Intermediate',
          priority: (t.priority as RoadmapTask['priority']) || 'High',
          status: (t.status as RoadmapTask['status']) || 'pending'
        }));
      }

      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return this.fallback.getRoadmapTasks(studentId);
      }
      return [];
    } catch {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return this.fallback.getRoadmapTasks(studentId);
      }
      return [];
    }
  }

  async updateTaskStatus(taskId: string, status: RoadmapTask['status']): Promise<RoadmapTask> {
    if (shouldUseMockFallback()) {
      return this.fallback.updateTaskStatus(taskId, status);
    }

    try {
      // 1. Try updating unified roadmap_milestones first
      const { data: mData, error: mError } = await supabase
        .from('roadmap_milestones')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId)
        .select()
        .single();

      if (!mError && mData) {
        return {
          id: String(mData.id),
          title: String(mData.title),
          description: 'Milestone updated in roadmap_milestones',
          skillName: 'Core Competency',
          category: 'Programming' as SkillCategory,
          actionType: 'practice',
          weekNumber: 1,
          estimatedMinutes: 45,
          difficulty: 'Intermediate',
          priority: 'High',
          status: (mData.status as RoadmapTask['status']) || 'pending'
        };
      }

      // 2. Fallback to legacy roadmap_tasks if task is in legacy table
      const { data, error } = await supabase
        .from('roadmap_tasks')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error || !data) {
        return this.fallback.updateTaskStatus(taskId, status);
      }

      return {
        id: String(data.id),
        title: String(data.title),
        description: String(data.description || ''),
        skillName: String(data.skill_name || ''),
        category: (data.category as SkillCategory) || 'Programming',
        actionType: (data.action_type as RoadmapTask['actionType']) || 'practice',
        weekNumber: Number(data.week_number) || 1,
        estimatedMinutes: Number(data.estimated_minutes) || 30,
        difficulty: (data.difficulty as RoadmapTask['difficulty']) || 'Intermediate',
        priority: (data.priority as RoadmapTask['priority']) || 'High',
        status: (data.status as RoadmapTask['status']) || 'pending'
      };
    } catch {
      return this.fallback.updateTaskStatus(taskId, status);
    }
  }

  async addMilestone(studentId: string, title: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('roadmap_milestones').insert({
        student_id: studentId,
        title,
        status: 'pending'
      });
    } catch (e) {
      console.warn('Error adding milestone:', e);
    }
  }

  async upsertStudentSkill(studentId: string, skill: { name: string; category?: string; proficiency: number; verified?: boolean }): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('student_skills').upsert({
        student_id: studentId,
        profile_id: studentId,
        name: skill.name,
        category: skill.category || 'Programming',
        current_proficiency: skill.proficiency,
        verified: skill.verified ?? false,
        last_assessed: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'profile_id,name' });
    } catch (e) {
      console.warn('upsertStudentSkill notice:', e);
    }
  }
}

export class SupabaseTargetRoleRepository implements ITargetRoleRepository {
  private fallback = new MockTargetRoleRepository();

  async getAllRoles(): Promise<TargetRole[]> {
    if (shouldUseMockFallback()) {
      return this.fallback.getAllRoles();
    }

    try {
      const { data, error } = await supabase
        .from('target_roles')
        .select('*');

      if (error || !data || data.length === 0) {
        return this.fallback.getAllRoles();
      }

      return data.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        title: String(r.title),
        category: (r.category as TargetRole['category']) || 'Software Engineering',
        description: String(r.description || ''),
        salaryRange: String(r.salary_range || 'Competitive'),
        marketDemand: (r.market_demand as TargetRole['marketDemand']) || 'High',
        experienceLevel: (r.experience_level as TargetRole['experienceLevel']) || 'Entry Level (0-2 yrs)',
        educationExpectations: String(r.education_expectations || ''),
        experienceExpectations: String(r.experience_expectations || ''),
        softSkills: Array.isArray(r.soft_skills) ? (r.soft_skills as string[]) : [],
        interviewAreas: Array.isArray(r.interview_areas) ? (r.interview_areas as string[]) : [],
        aptitudeAreas: Array.isArray(r.aptitude_areas) ? (r.aptitude_areas as string[]) : [],
        communicationExpectations: String(r.communication_expectations || ''),
        requiredSkills: Array.isArray(r.required_skills) ? (r.required_skills as TargetRole['requiredSkills']) : []
      }));
    } catch {
      return this.fallback.getAllRoles();
    }
  }

  async getRoleById(roleId: string): Promise<TargetRole | null> {
    const roles = await this.getAllRoles();
    return roles.find(r => r.id === roleId) || null;
  }
}

export class SupabaseReadinessRepository implements IReadinessRepository {
  private fallback = new MockReadinessRepository();

  async getLatestReadiness(studentId: string): Promise<ReadinessScoreBreakdown> {
    if (shouldUseMockFallback()) {
      return this.fallback.getLatestReadiness(studentId);
    }

    try {
      // 1. Try unified composite readiness_scores first
      const { data, error } = await supabase
        .from('readiness_scores')
        .select('*')
        .or(`student_id.eq.${studentId},profile_id.eq.${studentId}`)
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          overall: Number(data.composite || data.overall) || 72,
          technical: Number(data.technical) || 68,
          aptitude: Number(data.aptitude) || 71,
          communication: Number(data.communication) || 76,
          hr: Number(data.hr) || 80,
          interview: Number(data.interview) || 75,
          weeklyDelta: Number(data.weekly_delta) || 3,
          lastUpdated: String(data.computed_at || data.timestamp || new Date().toISOString())
        };
      }

      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return this.fallback.getLatestReadiness(studentId);
      }
      return {
        overall: 35,
        technical: 30,
        aptitude: 40,
        communication: 40,
        hr: 35,
        interview: 30,
        weeklyDelta: 0,
        lastUpdated: new Date().toISOString()
      };
    } catch {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return this.fallback.getLatestReadiness(studentId);
      }
      return {
        overall: 35,
        technical: 30,
        aptitude: 40,
        communication: 40,
        hr: 35,
        interview: 30,
        weeklyDelta: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  async recordReadinessUpdate(studentId: string, score: ReadinessScoreBreakdown): Promise<void> {
    if (!isSupabaseConfigured()) {
      return this.fallback.recordReadinessUpdate(studentId, score);
    }

    try {
      await supabase.from('readiness_scores').insert({
        student_id: studentId,
        profile_id: studentId,
        composite: score.overall,
        overall: score.overall,
        technical: score.technical,
        aptitude: score.aptitude,
        communication: score.communication,
        hr: score.hr,
        interview: score.interview,
        computed_at: score.lastUpdated || new Date().toISOString(),
        timestamp: score.lastUpdated || new Date().toISOString()
      });
    } catch (e) {
      console.warn('Supabase recordReadinessUpdate notice:', e);
    }
  }

  async getHistoricalReadiness(studentId: string): Promise<Array<{ week: string; score: number }>> {
    if (shouldUseMockFallback()) {
      return this.fallback.getHistoricalReadiness(studentId);
    }

    try {
      const { data, error } = await supabase
        .from('readiness_scores')
        .select('composite, overall, computed_at, timestamp')
        .or(`student_id.eq.${studentId},profile_id.eq.${studentId}`)
        .order('computed_at', { ascending: true })
        .limit(8);

      if (!error && data && data.length > 0) {
        return data.map((d: Record<string, unknown>, idx: number) => ({
          week: `Wk ${idx + 1}`,
          score: Number(d.composite || d.overall) || 65
        }));
      }

      return this.fallback.getHistoricalReadiness(studentId);
    } catch {
      return this.fallback.getHistoricalReadiness(studentId);
    }
  }
}

// Unified cutover: writes to unified interview_sessions table
export class SupabaseAssessmentRepository implements IAssessmentRepository {
  async saveTechnicalInterview(session: TechnicalInterviewEvaluation): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Insert into unified interview_sessions
      const { error: sessionError } = await supabase.from('interview_sessions').insert({
        student_id: user.id,
        type: 'technical',
        transcript: {
          questionId: session.questionId,
          problemTitle: session.questionTitle,
          submittedCode: session.submittedCode,
          language: session.language,
          timeComplexity: session.timeComplexity,
          spaceComplexity: session.spaceComplexity,
        },
        scores: {
          correctness: session.scores.correctness,
          problemSolving: session.scores.problemSolving,
          communication: session.scores.communication,
          timeManagement: session.scores.timeManagement,
          overall: session.overallScore,
        },
        ai_feedback: session.aiCritique,
        started_at: session.timestamp || new Date().toISOString(),
        completed_at: session.timestamp || new Date().toISOString(),
      });

      if (sessionError) {
        console.warn('interview_sessions insert notice:', sessionError.message);
      }

      // Also log career event
      await supabase.from('career_events').insert({
        profile_id: user.id,
        type: 'interview_completed',
        title: `Technical Interview: ${session.questionTitle}`,
        description: `Scored ${session.overallScore}% in ${session.language} technical drill.`,
        timestamp: session.timestamp || new Date().toISOString()
      });
    } catch (e) {
      console.warn('saveTechnicalInterview error:', e);
    }
  }

  async saveHRInterview(session: HRInterviewEvaluation): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Insert into unified interview_sessions
      const { error: sessionError } = await supabase.from('interview_sessions').insert({
        student_id: user.id,
        type: 'hr',
        transcript: {
          questionId: session.questionId,
          question: session.question,
          studentAnswer: session.studentAnswer,
          starAnalysis: session.starFrameworkScore,
        },
        scores: {
          clarity: session.scores.clarity,
          structure: session.scores.structure,
          confidence: session.scores.confidence,
          specificity: session.scores.specificity,
          overall: session.overallScore,
        },
        ai_feedback: session.aiFeedback,
        started_at: session.timestamp || new Date().toISOString(),
        completed_at: session.timestamp || new Date().toISOString(),
      });

      if (sessionError) {
        console.warn('interview_sessions HR insert notice:', sessionError.message);
      }

      // Also log career event
      await supabase.from('career_events').insert({
        profile_id: user.id,
        type: 'interview_completed',
        title: `HR Behavioral Drill Completed`,
        description: `STAR alignment evaluated at ${session.overallScore}%.`,
        timestamp: session.timestamp || new Date().toISOString()
      });
    } catch (e) {
      console.warn('saveHRInterview error:', e);
    }
  }

  async saveCommunicationDrill(metric: CommunicationMetric): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const overall = Math.round((metric.clarityScore + metric.pacingScore + metric.speakingScore) / 3);

      // 1. Insert into unified interview_sessions
      const { error: sessionError } = await supabase.from('interview_sessions').insert({
        student_id: user.id,
        type: 'communication',
        transcript: {
          transcript: metric.transcript,
          durationSeconds: metric.recordedDurationSeconds,
          wordsPerMinute: metric.pacingWpm,
          fillerWords: metric.fillerWords,
        },
        scores: {
          clarity: metric.clarityScore,
          pacing: metric.pacingScore,
          speaking: metric.speakingScore,
          overall,
        },
        ai_feedback: Array.isArray(metric.feedback) ? metric.feedback.join('; ') : metric.feedback,
        started_at: metric.timestamp || new Date().toISOString(),
        completed_at: metric.timestamp || new Date().toISOString(),
      });

      if (sessionError) {
        console.warn('interview_sessions Comm drill insert notice:', sessionError.message);
      }
    } catch (e) {
      console.warn('saveCommunicationDrill error:', e);
    }
  }

  async saveAptitudeSession(session: AptitudeAssessmentSession): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('aptitude_sessions').insert({
        profile_id: user.id,
        total_questions: session.totalQuestions,
        correct_answers: session.correctAnswers,
        percentage: session.percentage,
        category_scores: session.categoryScores,
        timestamp: session.timestamp
      });
    } catch (e) {
      console.warn('saveAptitudeSession error:', e);
    }
  }

  async getEventLog(studentId: string): Promise<CareerOSEvent[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('career_events')
        .select('*')
        .eq('profile_id', studentId)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error || !data) return [];

      return data.map((ev: Record<string, unknown>) => ({
        id: String(ev.id),
        type: ev.type as CareerOSEvent['type'],
        title: String(ev.title),
        description: String(ev.description || ''),
        timestamp: String(ev.timestamp)
      }));
    } catch {
      return [];
    }
  }
}

export class SupabaseFacultyRepository implements IFacultyRepository {
  private fallback = new MockFacultyRepository();

  async getCohortStudents(): Promise<FacultyStudentSummary[]> {
    if (shouldUseMockFallback()) {
      return this.fallback.getCohortStudents();
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          degree,
          branch,
          target_role_id,
          target_roles (title),
          readiness_scores (overall, technical, aptitude, communication, interview, timestamp, composite, computed_at)
        `)
        .eq('role', 'student');

      if (error) {
        console.warn('getCohortStudents error:', error.message);
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          return this.fallback.getCohortStudents();
        }
        return [];
      }

      if (!data || data.length === 0) {
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          return this.fallback.getCohortStudents();
        }
        return [];
      }

      return data.map((row: Record<string, unknown>, idx: number) => {
        const scores = Array.isArray(row.readiness_scores) && row.readiness_scores.length > 0
          ? row.readiness_scores[0]
          : { overall: 65, technical: 62, aptitude: 68, communication: 60, interview: 64, composite: 65 };

        const targetRoleObj = row.target_roles as Record<string, unknown> | null;
        const targetTitle = targetRoleObj?.title ? String(targetRoleObj.title) : 'Software Engineer — SDE-1';
        const overall = Number(scores.composite || scores.overall) || 65;

        return {
          id: String(row.id),
          name: String(row.full_name || 'Student'),
          email: String(row.email || ''),
          rollNumber: `22BCON${300 + idx}`,
          degree: String(row.degree || 'B.Tech'),
          branch: String(row.branch || 'CSE'),
          targetRole: targetTitle,
          overallReadiness: overall,
          technicalReadiness: Number(scores.technical) || 62,
          aptitudeReadiness: Number(scores.aptitude) || 68,
          communicationReadiness: Number(scores.communication) || 60,
          interviewReadiness: Number(scores.interview) || 64,
          mainGap: 'SQL Indexing & Joins',
          daysToDrive: 45,
          status: (overall >= 75 ? 'Ready' : overall >= 50 ? 'Developing' : 'At-Risk') as FacultyStudentSummary['status'],
          requiresIntervention: overall < 60,
          resumeAtsScore: 78,
          roadmapProgress: 52,
          aiRecommendedAction: overall < 60 ? 'Assign SQL & DSA remedial workshop sprint' : 'Eligible for Day-1 Campus Drives',
          lastActive: 'Just now'
        };
      });
    } catch {
      return this.fallback.getCohortStudents();
    }
  }

  async getStudentDetail(studentId: string): Promise<FacultyStudentSummary | null> {
    const students = await this.getCohortStudents();
    return students.find(s => s.id === studentId) || null;
  }

  async dispatchIntervention(studentId: string, note: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      return this.fallback.dispatchIntervention(studentId, note);
    }

    try {
      await supabase.from('career_events').insert({
        profile_id: studentId,
        type: 'faculty_intervention',
        title: 'Faculty Placement Intervention Dispatched',
        description: note,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn('dispatchIntervention error:', e);
    }
  }
}

// Export singleton repositories
export const studentRepo = new SupabaseStudentRepository();
export const targetRoleRepo = new SupabaseTargetRoleRepository();
export const readinessRepo = new SupabaseReadinessRepository();
export const assessmentRepo = new SupabaseAssessmentRepository();
export const facultyRepo = new SupabaseFacultyRepository();
