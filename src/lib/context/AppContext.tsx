'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  StudentProfile,
  TargetRole,
  SkillGap,
  SuitabilityAnalysis,
  RoadmapWeek,
  RoadmapTask,
  ResumeData,
  TechnicalInterviewEvaluation,
  HRInterviewEvaluation,
  CommunicationMetric,
  FacultyStudentSummary,
  CohortKPIs,
  ReadinessScoreBreakdown,
  AIChatMessage,
  CareerOSEvent,
  InterventionRuleConfig,
  AptitudeAssessmentSession,
  AIContextSnapshot,
  SkillCategory
} from '@/types';
import {
  TARGET_ROLES,
  COHORT_KPIS
} from '@/lib/data/mockData';
import { AIService } from '@/lib/ai/aiService';
import {
  calculateTechnicalReadiness,
  calculateAptitudeReadiness,
  calculateCommunicationReadiness,
  calculateHRReadiness,
  calculateInterviewReadiness,
  computeCompleteReadiness
} from '@/lib/readiness/readinessEngine';
import {
  studentRepo,
  readinessRepo,
  assessmentRepo,
  facultyRepo
} from '@/lib/repository/supabaseRepository';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const EMPTY_STUDENT_PROFILE: StudentProfile = {
  id: '',
  userId: '',
  fullName: '',
  email: '',
  university: 'University',
  degree: 'B.Tech',
  branch: 'CSE',
  graduationYear: 2026,
  cgpa: 8.0,
  targetRoleId: 'role-sde-1',
  targetRoleTitle: 'Software Engineer — SDE-1',
  phone: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  skills: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const EMPTY_RESUME_DATA: ResumeData = {
  fileName: '',
  uploadedAt: '',
  atsScore: 0,
  scores: {
    keywordMatch: 0,
    impactStatements: 0,
    formatting: 0,
    roleAlignment: 0
  },
  parsedSkills: [],
  extractedProjects: [],
  missingKeywords: [],
  suggestedImprovements: [],
  summaryFeedback: 'No resume uploaded yet. Upload your resume to calculate your ATS score and skill gaps.'
};

export const EMPTY_READINESS_SCORES: ReadinessScoreBreakdown = {
  overall: 35,
  technical: 30,
  aptitude: 40,
  communication: 40,
  hr: 35,
  interview: 30,
  weeklyDelta: 0,
  lastUpdated: new Date().toISOString()
};

interface AppContextType {
  studentProfile: StudentProfile;
  activeTargetRole: TargetRole;
  targetRoles: TargetRole[];
  readinessScores: ReadinessScoreBreakdown;
  skillGaps: SkillGap[];
  suitability: SuitabilityAnalysis;
  roadmapWeeks: RoadmapWeek[];
  resumeData: ResumeData;
  activePersona: 'student' | 'faculty';
  facultyStudents: FacultyStudentSummary[];
  cohortKPIs: CohortKPIs;
  interventionConfig: InterventionRuleConfig;
  recentEvents: CareerOSEvent[];
  technicalSessions: TechnicalInterviewEvaluation[];
  hrSessions: HRInterviewEvaluation[];
  communicationMetrics: CommunicationMetric[];
  aptitudeHistory: AptitudeAssessmentSession[];
  aiChatMessages: AIChatMessage[];
  isAiCoachOpen: boolean;
  isLoadingAuth: boolean;

  // Actions
  setTargetRole: (roleId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  addTechnicalInterviewEval: (evaluation: TechnicalInterviewEvaluation) => void;
  addHREval: (evaluation: HRInterviewEvaluation) => void;
  updateCommunicationMetric: (metric: CommunicationMetric) => void;
  recordAptitudeScore: (percentage: number, categoryScores?: Record<string, number>) => void;
  updateResumeBullet: (impId: string, accepted: boolean) => void;
  uploadResumeText: (text: string) => Promise<void>;
  setResumeData: (data: ResumeData) => void;
  sendAiChatMessage: (text: string) => void;
  setPersona: (persona: 'student' | 'faculty') => void;
  toggleAiCoach: (open?: boolean) => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  triggerIntervention: (studentId: string, note?: string) => void;
  updateInterventionConfig: (config: Partial<InterventionRuleConfig>) => void;
  resetDemoData: () => void;
  reloadUserData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LEGACY_STORAGE_KEY = 'careeros_deep_state_v2';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(EMPTY_STUDENT_PROFILE);
  const [activeTargetRoleId, setActiveTargetRoleId] = useState<string>('role-sde-1');
  const [readinessScores, setReadinessScores] = useState<ReadinessScoreBreakdown>(EMPTY_READINESS_SCORES);
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME_DATA);
  const [activePersona, setActivePersona] = useState<'student' | 'faculty'>('student');
  const [facultyStudents, setFacultyStudents] = useState<FacultyStudentSummary[]>([]);
  const [interventionConfig, setInterventionConfig] = useState<InterventionRuleConfig>({
    readinessThreshold: 40,
    daysToDriveThreshold: 60,
  });
  const [recentEvents, setRecentEvents] = useState<CareerOSEvent[]>([]);
  const [technicalSessions, setTechnicalSessions] = useState<TechnicalInterviewEvaluation[]>([]);
  const [hrSessions, setHrSessions] = useState<HRInterviewEvaluation[]>([]);
  const [communicationMetrics, setCommunicationMetrics] = useState<CommunicationMetric[]>([]);
  const [aptitudeHistory, setAptitudeHistory] = useState<AptitudeAssessmentSession[]>([]);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);

  // Derived active role
  const activeTargetRole = useMemo(() => {
    return TARGET_ROLES.find(r => r.id === activeTargetRoleId) || TARGET_ROLES[0];
  }, [activeTargetRoleId]);

  // Derived Suitability & Skill Gaps with live semantic AI updates
  const [suitability, setSuitability] = useState<SuitabilityAnalysis>(() =>
    AIService.calculateJobSuitabilitySync(studentProfile, activeTargetRole)
  );
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(() =>
    AIService.identifySkillGapsSync(studentProfile, activeTargetRole)
  );

  useEffect(() => {
    let isCurrent = true;
    AIService.calculateJobSuitability(studentProfile, activeTargetRole)
      .then((res) => {
        if (isCurrent && res) setSuitability(res);
      })
      .catch((err) => console.warn('AI suitability resolution notice:', err));

    AIService.identifySkillGaps(studentProfile, activeTargetRole)
      .then((res) => {
        if (isCurrent && res) setSkillGaps(res);
      })
      .catch((err) => console.warn('AI skill gaps resolution notice:', err));

    return () => {
      isCurrent = false;
    };
  }, [studentProfile.skills, studentProfile.cgpa, activeTargetRole]);

  // Roadmap Weeks state
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>([]);

  // AI Chat Messages
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I'm CareerOS AI, your personal career strategist. How can I help you accelerate your readiness today?",
      timestamp: 'Just now',
      quickActions: ['What should I study today?', 'Analyze my resume', 'Practice technical interview', 'Check skill gaps']
    }
  ]);

  // 1. Session Hydration from Supabase
  const hydrateForUser = useCallback(async (userId: string, userEmail?: string, userMeta?: Record<string, unknown>) => {
    try {
      setIsLoadingAuth(true);

      // Clean up legacy global test state from user's browser
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {}

      // A. Fetch Profile from Supabase
      let profileData: Record<string, unknown> | null = null;
      const { data: dbProfile, error: profileErr } = await supabase
        .from('profiles')
        .select(`
          *,
          student_skills (*)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (dbProfile) {
        profileData = dbProfile as Record<string, unknown>;
      } else {
        // Upsert default profile for fresh user (e.g. initial Google OAuth login)
        const role = (userMeta?.role as string) || 'student';
        const fullName = (userMeta?.full_name as string) || userEmail?.split('@')[0] || 'Student';
        const university = (userMeta?.university as string) || 'University';
        const degree = (userMeta?.degree as string) || 'B.Tech';
        const branch = (userMeta?.branch as string) || 'CSE';
        const graduationYear = Number(userMeta?.graduation_year) || 2026;
        const cgpa = Number(userMeta?.cgpa) || 8.0;
        const targetRoleId = (userMeta?.target_role_id as string) || 'role-sde-1';

        const { data: newProfile, error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail || '',
            full_name: fullName,
            role,
            university,
            degree,
            branch,
            graduation_year: graduationYear,
            cgpa,
            target_role_id: targetRoleId
          })
          .select(`
            *,
            student_skills (*)
          `)
          .maybeSingle();

        if (!insertErr && newProfile) {
          profileData = newProfile as Record<string, unknown>;
          if (role === 'student') {
            await supabase.from('students').insert({
              profile_id: userId,
              department: branch,
              graduation_year: graduationYear,
              target_role_id: targetRoleId
            }).then(null, () => {});
          }
        } else if (profileErr) {
          console.warn('Profile fetch notice:', profileErr.message);
        }
      }

      const activeRole = TARGET_ROLES.find(r => r.id === (profileData?.target_role_id || 'role-sde-1')) || TARGET_ROLES[0];
      const roleTitle = activeRole.title;

      const loadedProfile: StudentProfile = {
        id: userId,
        userId,
        fullName: String(profileData?.full_name || userMeta?.full_name || userEmail?.split('@')[0] || 'Student'),
        email: String(profileData?.email || userEmail || ''),
        university: String(profileData?.university || 'University'),
        degree: String(profileData?.degree || 'B.Tech'),
        branch: String(profileData?.branch || 'CSE'),
        graduationYear: Number(profileData?.graduation_year) || 2026,
        cgpa: Number(profileData?.cgpa) || 8.0,
        targetRoleId: String(profileData?.target_role_id || activeRole.id),
        targetRoleTitle: roleTitle,
        phone: String(profileData?.phone || ''),
        linkedinUrl: String(profileData?.linkedin_url || ''),
        githubUrl: String(profileData?.github_url || ''),
        portfolioUrl: String(profileData?.portfolio_url || ''),
        skills: ((profileData?.student_skills as Array<Record<string, unknown>>) || []).map((sk, idx) => ({
          id: String(sk.id || `sk-${idx}`),
          name: String(sk.name || ''),
          category: (sk.category as SkillCategory) || 'Programming',
          currentProficiency: Number(sk.current_proficiency) || 0,
          verified: Boolean(sk.verified),
          lastAssessed: String(sk.last_assessed || new Date().toISOString())
        })),
        createdAt: String(profileData?.created_at || new Date().toISOString()),
        updatedAt: String(profileData?.updated_at || new Date().toISOString())
      };

      setStudentProfile(loadedProfile);
      setActiveTargetRoleId(loadedProfile.targetRoleId);

      const userRole = (profileData?.role as string) || (userMeta?.role as string) || 'student';
      const persona = userRole === 'faculty' || userRole === 'admin' ? 'faculty' : 'student';
      setActivePersona(persona);
      document.cookie = `careeros_persona=${persona}; path=/; max-age=86400`;

      // B. Fetch Readiness Scores
      const { data: readinessData } = await supabase
        .from('readiness_scores')
        .select('*')
        .or(`student_id.eq.${userId},profile_id.eq.${userId}`)
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (readinessData) {
        setReadinessScores({
          overall: Number(readinessData.composite || readinessData.overall) || 40,
          technical: Number(readinessData.technical) || 35,
          aptitude: Number(readinessData.aptitude) || 40,
          communication: Number(readinessData.communication) || 45,
          hr: Number(readinessData.hr) || 40,
          interview: Number(readinessData.interview) || 35,
          weeklyDelta: Number(readinessData.weekly_delta) || 0,
          lastUpdated: String(readinessData.computed_at || readinessData.timestamp || new Date().toISOString())
        });
      } else {
        const initialScores: ReadinessScoreBreakdown = {
          overall: 40,
          technical: 35,
          aptitude: 40,
          communication: 45,
          hr: 40,
          interview: 35,
          weeklyDelta: 0,
          lastUpdated: new Date().toISOString()
        };
        setReadinessScores(initialScores);
        await supabase.from('readiness_scores').insert({
          student_id: userId,
          profile_id: userId,
          composite: initialScores.overall,
          overall: initialScores.overall,
          technical: initialScores.technical,
          aptitude: initialScores.aptitude,
          communication: initialScores.communication,
          hr: initialScores.hr,
          interview: initialScores.interview,
          computed_at: initialScores.lastUpdated,
          timestamp: initialScores.lastUpdated
        }).then(null, () => {});
      }

      // C. Fetch Resume from public.resumes
      const { data: resumeDb } = await supabase
        .from('resumes')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (resumeDb) {
        const ats = Number(resumeDb.ats_score) || 75;
        setResumeData({
          fileName: resumeDb.storage_path?.split('/').pop() || 'Uploaded_Resume.pdf',
          uploadedAt: resumeDb.created_at || new Date().toISOString(),
          atsScore: ats,
          scores: {
            keywordMatch: Math.min(100, ats + 5),
            impactStatements: Math.max(50, ats - 8),
            formatting: 88,
            roleAlignment: ats
          },
          parsedSkills: loadedProfile.skills.map(s => s.name),
          extractedProjects: [
            {
              title: 'Candidate Technical Project',
              description: 'Project parsed from uploaded credentials.',
              technologies: loadedProfile.skills.slice(0, 3).map(s => s.name)
            }
          ],
          missingKeywords: ['System Design', 'Cloud Deployment'],
          suggestedImprovements: [
            {
              id: 'imp-1',
              section: 'Technical Experience',
              original: 'Developed application features and fixed bugs.',
              improved: 'Architected modular backend services with automated testing, increasing throughput by 28%.',
              explanation: 'Quantified impact with measurable system improvement.',
              applied: false
            }
          ],
          summaryFeedback: `Resume extracted with verified competencies. Current ATS match: ${ats}%.`
        });
      } else {
        setResumeData(EMPTY_RESUME_DATA);
      }

      // D. Fetch Roadmap Milestones
      const { data: milestones } = await supabase
        .from('roadmap_milestones')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: true });

      if (milestones && milestones.length > 0) {
        const tasks: RoadmapTask[] = milestones.map((m, idx) => ({
          id: String(m.id),
          title: String(m.title),
          description: `Milestone #${idx + 1} for ${roleTitle}`,
          skillName: 'Core Competency',
          category: 'Programming' as SkillCategory,
          actionType: 'practice',
          weekNumber: Math.floor(idx / 3) + 1,
          estimatedMinutes: 45,
          difficulty: 'Intermediate',
          priority: 'High',
          status: (m.status as RoadmapTask['status']) || 'pending'
        }));

        const weeksMap: Record<number, RoadmapTask[]> = {};
        tasks.forEach(t => {
          if (!weeksMap[t.weekNumber]) weeksMap[t.weekNumber] = [];
          weeksMap[t.weekNumber].push(t);
        });

        const structuredWeeks: RoadmapWeek[] = Object.keys(weeksMap).map(wk => ({
          weekNumber: Number(wk),
          title: `Week ${wk}: Milestone Sprint`,
          focus: 'Role Preparation',
          status: Number(wk) === 1 ? 'current' : 'upcoming',
          tasks: weeksMap[Number(wk)]
        }));
        setRoadmapWeeks(structuredWeeks);
      } else {
        // Generate personalized roadmap for target role
        const gaps = AIService.identifySkillGapsSync(loadedProfile, activeRole);
        const newRoadmap = AIService.generateRoadmap(loadedProfile, activeRole, gaps);
        setRoadmapWeeks(newRoadmap);

        // Persist initial milestones
        const allTasks = newRoadmap.flatMap(w => w.tasks);
        for (const t of allTasks) {
          await supabase.from('roadmap_milestones').insert({
            student_id: userId,
            title: t.title,
            status: t.status || 'pending'
          }).then(null, () => {});
        }
      }

      // E. Fetch Interview Sessions
      const { data: sessions } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('student_id', userId)
        .order('started_at', { ascending: false });

      if (sessions && sessions.length > 0) {
        const tech = sessions
          .filter((s: Record<string, unknown>) => s.type === 'technical')
          .map((s: Record<string, unknown>) => {
            const tr = (s.transcript as Record<string, unknown>) || {};
            const sc = (s.scores as Record<string, unknown>) || {};
            return {
              id: String(s.id),
              questionId: String(tr.questionId || 'q1'),
              questionTitle: String(tr.problemTitle || 'Technical Challenge'),
              difficulty: 'Medium' as const,
              submittedCode: String(tr.submittedCode || ''),
              language: String(tr.language || 'python'),
              timeSpentSeconds: 900,
              timeComplexity: String(tr.timeComplexity || 'O(N)'),
              spaceComplexity: String(tr.spaceComplexity || 'O(1)'),
              scores: {
                correctness: Number(sc.correctness) || 75,
                problemSolving: Number(sc.problemSolving) || 75,
                communication: Number(sc.communication) || 70,
                timeManagement: Number(sc.timeManagement) || 80
              },
              overallScore: Number(sc.overall) || 75,
              aiCritique: String(s.ai_feedback || 'Completed technical evaluation.'),
              suggestedFocus: 'Optimal space-time trade-offs.',
              testCasesPassed: { passed: 5, total: 5 },
              timestamp: String(s.started_at || new Date().toISOString())
            };
          });
        setTechnicalSessions(tech);

        const hr = sessions
          .filter((s: Record<string, unknown>) => s.type === 'hr')
          .map((s: Record<string, unknown>) => {
            const tr = (s.transcript as Record<string, unknown>) || {};
            const sc = (s.scores as Record<string, unknown>) || {};
            return {
              id: String(s.id),
              questionId: String(tr.questionId || 'hr1'),
              question: String(tr.question || 'Behavioral Question'),
              studentAnswer: String(tr.studentAnswer || ''),
              starFrameworkScore: (tr.starAnalysis as { situation: number; task: number; action: number; result: number }) || { situation: 75, task: 75, action: 75, result: 75 },
              scores: {
                clarity: Number(sc.clarity) || 75,
                structure: Number(sc.structure) || 75,
                confidence: Number(sc.confidence) || 75,
                specificity: Number(sc.specificity) || 75
              },
              overallScore: Number(sc.overall) || 75,
              aiFeedback: String(s.ai_feedback || 'Strong STAR behavioral presentation.'),
              suggestedRewrite: 'Quantify team outcomes and deliverables.',
              timestamp: String(s.started_at || new Date().toISOString())
            };
          });
        setHrSessions(hr);

        const comm = sessions
          .filter((s: Record<string, unknown>) => s.type === 'communication')
          .map((s: Record<string, unknown>) => {
            const tr = (s.transcript as Record<string, unknown>) || {};
            const sc = (s.scores as Record<string, unknown>) || {};
            return {
              id: String(s.id),
              recordedDurationSeconds: Number(tr.durationSeconds) || 120,
              pacingWpm: Number(tr.wordsPerMinute) || 135,
              fillerWordCount: Array.isArray(tr.fillerWords) ? tr.fillerWords.length : 0,
              fillerWords: Array.isArray(tr.fillerWords) ? (tr.fillerWords as string[]).map(w => ({ word: w, count: 1 })) : [],
              clarityScore: Number(sc.clarity) || 75,
              pacingScore: Number(sc.pacing) || 75,
              speakingScore: Number(sc.speaking) || 75,
              transcript: String(tr.transcript || ''),
              feedback: s.ai_feedback ? [String(s.ai_feedback)] : [],
              timestamp: String(s.started_at || new Date().toISOString())
            };
          });
        setCommunicationMetrics(comm);
      }

      // F. Fetch Aptitude Sessions
      const { data: aptData } = await supabase
        .from('aptitude_sessions')
        .select('*')
        .eq('profile_id', userId)
        .order('timestamp', { ascending: false });

      if (aptData && aptData.length > 0) {
        setAptitudeHistory(aptData.map(a => ({
          id: String(a.id),
          timestamp: String(a.timestamp),
          totalQuestions: Number(a.total_questions) || 6,
          correctAnswers: Number(a.correct_answers) || 0,
          percentage: Number(a.percentage) || 0,
          categoryScores: (a.category_scores as Record<string, number>) || {}
        })));
      }

      // G. Fetch Events
      const { data: evData } = await supabase
        .from('career_events')
        .select('*')
        .eq('profile_id', userId)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (evData && evData.length > 0) {
        setRecentEvents(evData.map(ev => ({
          id: String(ev.id),
          type: ev.type as CareerOSEvent['type'],
          title: String(ev.title),
          description: String(ev.description || ''),
          timestamp: String(ev.timestamp)
        })));
      } else {
        const firstName = loadedProfile.fullName.split(' ')[0] || 'Student';
        setRecentEvents([
          {
            id: `evt-welcome-${Date.now()}`,
            type: 'target_role_changed',
            title: `Welcome to CareerOS, ${firstName}!`,
            description: `Target set to ${roleTitle}. Start by uploading your resume or practicing your first interview drill.`,
            timestamp: new Date().toISOString()
          }
        ]);
      }

      // H. If faculty: fetch cohort students
      if (persona === 'faculty') {
        const cohort = await facultyRepo.getCohortStudents();
        setFacultyStudents(cohort);
      }
    } catch (e) {
      console.warn('Error hydrating user session:', e);
    } finally {
      setIsLoadingAuth(false);
      setIsHydrated(true);
    }
  }, []);

  const reloadUserData = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await hydrateForUser(user.id, user.email, user.user_metadata);
    }
  }, [hydrateForUser]);

  // Auth Lifecycle listener
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoadingAuth(false);
      setIsHydrated(true);
      return;
    }

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        hydrateForUser(user.id, user.email, user.user_metadata);
      } else {
        setIsLoadingAuth(false);
        setIsHydrated(true);
      }
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await hydrateForUser(session.user.id, session.user.email, session.user.user_metadata);
      } else if (event === 'SIGNED_OUT') {
        setStudentProfile(EMPTY_STUDENT_PROFILE);
        setResumeData(EMPTY_RESUME_DATA);
        setReadinessScores(EMPTY_READINESS_SCORES);
        setFacultyStudents([]);
        setRecentEvents([]);
        setTechnicalSessions([]);
        setHrSessions([]);
        setCommunicationMetrics([]);
        setAptitudeHistory([]);
        setIsLoadingAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hydrateForUser]);

  // Save to user-scoped localStorage when state updates
  useEffect(() => {
    if (!isHydrated || !studentProfile.id) return;
    try {
      const userStorageKey = `careeros_user_${studentProfile.id}`;
      const stateToSave = {
        studentProfile,
        activeTargetRoleId,
        readinessScores,
        resumeData,
        roadmapWeeks,
        facultyStudents,
        recentEvents,
        technicalSessions,
        hrSessions,
        communicationMetrics,
        aptitudeHistory
      };
      localStorage.setItem(userStorageKey, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not persist local state:', e);
    }
  }, [
    isHydrated,
    studentProfile,
    activeTargetRoleId,
    readinessScores,
    resumeData,
    roadmapWeeks,
    facultyStudents,
    recentEvents,
    technicalSessions,
    hrSessions,
    communicationMetrics,
    aptitudeHistory
  ]);

  // Dynamic Cohort KPIs derived directly from facultyStudents!
  const cohortKPIs: CohortKPIs = useMemo(() => {
    const total = facultyStudents.length;
    if (total === 0) return COHORT_KPIS;

    const avgOverall = Math.round(facultyStudents.reduce((acc, s) => acc + s.overallReadiness, 0) / total);
    const avgTech = Math.round(facultyStudents.reduce((acc, s) => acc + s.technicalReadiness, 0) / total);
    const avgApt = Math.round(facultyStudents.reduce((acc, s) => acc + s.aptitudeReadiness, 0) / total);
    const avgComm = Math.round(facultyStudents.reduce((acc, s) => acc + s.communicationReadiness, 0) / total);
    const avgInt = Math.round(facultyStudents.reduce((acc, s) => acc + s.interviewReadiness, 0) / total);

    const atRiskCount = facultyStudents.filter(
      s => s.overallReadiness < interventionConfig.readinessThreshold && s.daysToDrive < interventionConfig.daysToDriveThreshold
    ).length;

    const readyCount = facultyStudents.filter(s => s.overallReadiness >= 75).length;
    const developingCount = total - readyCount - atRiskCount;

    return {
      totalStudents: total,
      overallReadiness: avgOverall,
      technicalReadiness: avgTech,
      aptitudeReadiness: avgApt,
      communicationReadiness: avgComm,
      interviewReadiness: avgInt,
      studentsAtRiskCount: atRiskCount,
      readyPercentage: Math.round((readyCount / total) * 100),
      developingPercentage: Math.round((Math.max(0, developingCount) / total) * 100),
      atRiskPercentage: Math.round((atRiskCount / total) * 100),
      topCohortSkillGaps: COHORT_KPIS.topCohortSkillGaps
    };
  }, [facultyStudents, interventionConfig]);

  // Centralized recalculation trigger
  const triggerMasterReadinessRecalculation = (overrides?: {
    technical?: number;
    aptitude?: number;
    communication?: number;
    hr?: number;
    interview?: number;
  }) => {
    const allTasks = roadmapWeeks.flatMap(w => w.tasks);
    const completedTasks = allTasks.filter(t => t.status === 'completed');

    const techScore = overrides?.technical ?? calculateTechnicalReadiness(
      studentProfile.skills,
      activeTargetRole.requiredSkills,
      completedTasks,
      readinessScores.technical
    );

    const aptScoresArray = aptitudeHistory.map(a => a.percentage);
    const aptScore = overrides?.aptitude ?? calculateAptitudeReadiness(
      aptScoresArray,
      readinessScores.aptitude
    );

    const commScore = overrides?.communication ?? calculateCommunicationReadiness(
      communicationMetrics[communicationMetrics.length - 1] || null,
      readinessScores.communication
    );

    const hrScore = overrides?.hr ?? calculateHRReadiness(
      hrSessions,
      readinessScores.hr
    );

    const intScore = overrides?.interview ?? calculateInterviewReadiness(
      technicalSessions,
      readinessScores.interview
    );

    const newBreakdown = computeCompleteReadiness({
      technical: techScore,
      aptitude: aptScore,
      communication: commScore,
      hr: hrScore,
      interview: intScore,
      previousOverall: readinessScores.overall
    });

    setReadinessScores(newBreakdown);

    if (studentProfile.id) {
      readinessRepo.recordReadinessUpdate(studentProfile.id, newBreakdown).catch(e => console.warn(e));
    }

    // Sync student record in faculty list if relevant
    setFacultyStudents(prev =>
      prev.map(st => {
        if (st.id === studentProfile.id) {
          const totalTasks = allTasks.length;
          const completedCount = completedTasks.length;
          const progressPct = Math.round((completedCount / Math.max(1, totalTasks)) * 100);
          return {
            ...st,
            overallReadiness: newBreakdown.overall,
            technicalReadiness: newBreakdown.technical,
            aptitudeReadiness: newBreakdown.aptitude,
            communicationReadiness: newBreakdown.communication,
            interviewReadiness: newBreakdown.interview,
            roadmapProgress: progressPct,
            status: newBreakdown.overall >= 75 ? 'Ready' : newBreakdown.overall >= 50 ? 'Developing' : 'At-Risk',
            lastActive: 'Just now'
          };
        }
        return st;
      })
    );
  };

  const setTargetRole = (roleId: string) => {
    const role = TARGET_ROLES.find(r => r.id === roleId);
    if (!role) return;
    setActiveTargetRoleId(roleId);
    setStudentProfile(prev => ({
      ...prev,
      targetRoleId: role.id,
      targetRoleTitle: role.title,
      updatedAt: new Date().toISOString()
    }));

    if (studentProfile.id) {
      studentRepo.updateProfile(studentProfile.id, { targetRoleId: role.id }).catch(() => {});
    }

    // Re-adapt roadmap for the new role
    const newGaps = AIService.identifySkillGapsSync(studentProfile, role);
    const newRoadmap = AIService.generateRoadmap(studentProfile, role, newGaps);
    setRoadmapWeeks(newRoadmap);

    // Save new milestones in Supabase
    if (studentProfile.id && isSupabaseConfigured()) {
      const allTasks = newRoadmap.flatMap(w => w.tasks);
      for (const t of allTasks) {
        supabase.from('roadmap_milestones').insert({
          student_id: studentProfile.id,
          title: t.title,
          status: 'pending'
        }).then(null, () => {});
      }
    }

    // Append event
    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'target_role_changed',
      title: `Switched Target Goal to ${role.title}`,
      description: `Adapted roadmap and re-calculated suitability against ${role.requiredSkills.length} new skill competencies.`,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);

    if (studentProfile.id) {
      supabase.from('career_events').insert({
        profile_id: studentProfile.id,
        type: 'target_role_changed',
        title: event.title,
        description: event.description,
        timestamp: event.timestamp
      }).then(null, () => {});
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    let toggledTask: RoadmapTask | null = null;
    const updatedWeeks = roadmapWeeks.map(week => {
      const updatedTasks = week.tasks.map(task => {
        if (task.id === taskId) {
          const newStatus: RoadmapTask['status'] = task.status === 'completed' ? 'in_progress' : 'completed';
          toggledTask = {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
          };
          return toggledTask;
        }
        return task;
      });
      return { ...week, tasks: updatedTasks };
    });

    setRoadmapWeeks(updatedWeeks);

    if (toggledTask && studentProfile.id) {
      studentRepo.updateTaskStatus(taskId, (toggledTask as RoadmapTask).status).catch(e => console.warn(e));
    }

    if (toggledTask && (toggledTask as RoadmapTask).status === 'completed') {
      const task = toggledTask as RoadmapTask;
      const allTasks = updatedWeeks.flatMap(w => w.tasks);
      const completed = allTasks.filter(t => t.status === 'completed');
      const newTech = calculateTechnicalReadiness(
        studentProfile.skills,
        activeTargetRole.requiredSkills,
        completed,
        readinessScores.technical
      );
      triggerMasterReadinessRecalculation({ technical: newTech });

      const event: CareerOSEvent = {
        id: `evt-${Date.now()}`,
        type: 'roadmap_task_completed',
        title: `Completed: ${task.title}`,
        description: `Verified ${task.skillName} competency. Technical score updated.`,
        readinessDelta: +3,
        timestamp: new Date().toISOString()
      };
      setRecentEvents(prev => [event, ...prev]);
    } else {
      triggerMasterReadinessRecalculation();
    }
  };

  const addTechnicalInterviewEval = (evaluation: TechnicalInterviewEvaluation) => {
    setTechnicalSessions(prev => [evaluation, ...prev]);
    assessmentRepo.saveTechnicalInterview(evaluation).catch(e => console.warn(e));
    const newIntScore = Math.round(readinessScores.interview * 0.3 + evaluation.overallScore * 0.7);
    const newTechScore = Math.min(100, readinessScores.technical + 2);
    triggerMasterReadinessRecalculation({ interview: newIntScore, technical: newTechScore });

    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'technical_interview_completed',
      title: `AI Technical Interview: ${evaluation.questionTitle}`,
      description: `Scored ${evaluation.overallScore}% with ${evaluation.timeComplexity} complexity.`,
      readinessDelta: +2,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
  };

  const addHREval = (evaluation: HRInterviewEvaluation) => {
    setHrSessions(prev => [evaluation, ...prev]);
    assessmentRepo.saveHRInterview(evaluation).catch(e => console.warn(e));
    const newHR = Math.round(readinessScores.hr * 0.3 + evaluation.overallScore * 0.7);
    const newComm = Math.min(100, readinessScores.communication + 3);
    triggerMasterReadinessRecalculation({ hr: newHR, communication: newComm });

    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'hr_interview_completed',
      title: 'AI HR Behavioral Interview Evaluated',
      description: `STAR framework score: ${evaluation.overallScore}%.`,
      readinessDelta: +2,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
  };

  const updateCommunicationMetric = (metric: CommunicationMetric) => {
    setCommunicationMetrics(prev => [metric, ...prev]);
    assessmentRepo.saveCommunicationDrill(metric).catch(e => console.warn(e));
    const newComm = calculateCommunicationReadiness(metric, readinessScores.communication);
    triggerMasterReadinessRecalculation({ communication: newComm });

    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'communication_practice_completed',
      title: `Speaking Drill Completed (${metric.pacingWpm} WPM)`,
      description: `Speaking score: ${metric.speakingScore}%, ${metric.fillerWordCount} filler words detected.`,
      readinessDelta: +2,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
  };

  const recordAptitudeScore = (percentage: number, categoryScores: Record<string, number> = {}) => {
    const session: AptitudeAssessmentSession = {
      id: `apt-sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      totalQuestions: 6,
      correctAnswers: Math.round((percentage / 100) * 6),
      percentage,
      categoryScores
    };
    const updated = [session, ...aptitudeHistory];
    setAptitudeHistory(updated);
    assessmentRepo.saveAptitudeSession(session).catch(e => console.warn(e));

    const scoresArray = updated.map(a => a.percentage);
    const newApt = calculateAptitudeReadiness(scoresArray, readinessScores.aptitude);
    triggerMasterReadinessRecalculation({ aptitude: newApt });

    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'aptitude_test_completed',
      title: `Completed Aptitude Mock Assessment (${percentage}%)`,
      description: `Aptitude readiness dimension refreshed to ${newApt}%.`,
      readinessDelta: +2,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
  };

  const updateResumeBullet = (impId: string, accepted: boolean) => {
    if (accepted) {
      setResumeData(prev => ({
        ...prev,
        atsScore: Math.min(94, prev.atsScore + 4),
        scores: {
          ...prev.scores,
          impactStatements: Math.min(95, prev.scores.impactStatements + 7),
          keywordMatch: Math.min(92, prev.scores.keywordMatch + 5),
        },
        suggestedImprovements: prev.suggestedImprovements.map(i =>
          i.id === impId ? { ...i, applied: true } : i
        ).filter(i => i.id !== impId)
      }));

      const event: CareerOSEvent = {
        id: `evt-${Date.now()}`,
        type: 'resume_bullet_optimized',
        title: 'ATS Bullet Point Optimization Accepted',
        description: 'Quantified metrics injected into resume; ATS score raised by +4 points.',
        readinessDelta: +1,
        timestamp: new Date().toISOString()
      };
      setRecentEvents(prev => [event, ...prev]);
    } else {
      setResumeData(prev => ({
        ...prev,
        suggestedImprovements: prev.suggestedImprovements.filter(i => i.id !== impId)
      }));
    }
  };

  const uploadResumeText = async (text: string, fileName?: string) => {
    const newResume = await AIService.analyzeResume(text, activeTargetRole, fileName);
    setResumeData(newResume);

    // Extract skills and update profile & Supabase
    const extractedSkills = await AIService.extractSkills(text);
    const updatedSkills = [...studentProfile.skills];

    for (const skill of extractedSkills) {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      const category = (typeof skill === 'object' && skill.category ? skill.category : 'Programming') as SkillCategory;
      const confidence = typeof skill === 'object' && skill.confidence ? skill.confidence : 0.8;
      const proficiency = Math.min(95, Math.max(50, Math.round(confidence * 90)));

      const existing = updatedSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (existing) {
        existing.currentProficiency = Math.max(existing.currentProficiency, proficiency);
        existing.verified = true;
      } else {
        updatedSkills.push({
          id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: skillName,
          category,
          currentProficiency: proficiency,
          verified: true,
          lastAssessed: new Date().toISOString()
        });
      }

      if (studentProfile.id && studentRepo.upsertStudentSkill) {
        studentRepo.upsertStudentSkill(studentProfile.id, {
          name: skillName,
          proficiency,
          category
        }).catch(e => console.warn(e));
      }
    }

    setStudentProfile(prev => ({
      ...prev,
      skills: updatedSkills,
      resumeText: text,
      updatedAt: new Date().toISOString()
    }));

    triggerMasterReadinessRecalculation();

    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'resume_bullet_optimized',
      title: 'New Resume Ingested & Analyzed',
      description: `Parsed ${extractedSkills.length} verified competencies against ${activeTargetRole.title}.`,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
  };

  const sendAiChatMessage = (text: string) => {
    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setAiChatMessages(prev => [...prev, userMsg]);

    // Build structured context snapshot
    const allTasks = roadmapWeeks.flatMap(w => w.tasks);
    const completedTasks = allTasks.filter(t => t.status === 'completed');

    const contextSnapshot: AIContextSnapshot = {
      studentProfile,
      targetRole: activeTargetRole,
      resume: resumeData,
      skills: studentProfile.skills,
      requiredSkills: activeTargetRole.requiredSkills,
      skillGaps,
      roadmapWeeks,
      completedTasks,
      recentEvents,
      technicalSessions,
      hrSessions,
      communicationMetrics,
      aptitudeHistory,
      readinessScore: readinessScores
    };

    // Call career coach AI advice
    AIService.generateCareerAdvice(text, contextSnapshot).then(aiAdvice => {
      const aiReply: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiAdvice.response,
        timestamp: 'Just now',
        quickActions: aiAdvice.suggestedActions
      };
      setAiChatMessages(prev => [...prev, aiReply]);
    }).catch(() => {
      const fallbackReply: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on your target of ${activeTargetRole.title}, focusing on your primary skill gaps and completing Week 1 roadmap milestones will give you the highest readiness return.`,
        timestamp: 'Just now',
        quickActions: ['How can I improve my skills?', 'Start Technical Interview', 'View Roadmap']
      };
      setAiChatMessages(prev => [...prev, fallbackReply]);
    });
  };

  const setPersona = (persona: 'student' | 'faculty') => {
    setActivePersona(persona);
    document.cookie = `careeros_persona=${persona}; path=/; max-age=86400`;
  };

  const toggleAiCoach = (open?: boolean) => {
    setIsAiCoachOpen(prev => (open !== undefined ? open : !prev));
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    if (studentProfile.id) {
      studentRepo.updateProfile(studentProfile.id, updates).catch(e => console.warn(e));
    }
  };

  const triggerIntervention = (studentId: string, note?: string) => {
    facultyRepo.dispatchIntervention(studentId, note || 'Intervention dispatched: 1-on-1 counseling booked and remedial tasks assigned.').catch(e => console.warn(e));
    setFacultyStudents(prev =>
      prev.map(st => {
        if (st.id === studentId) {
          return {
            ...st,
            requiresIntervention: false,
            aiRecommendedAction: note || 'Intervention dispatched: 1-on-1 counseling booked and remedial tasks assigned.'
          };
        }
        return st;
      })
    );

    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'faculty_intervention_dispatched',
      title: 'Targeted Remedial Intervention Dispatched',
      description: note || 'Placement counseling & targeted boot-camp assigned to student.',
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
  };

  const updateInterventionConfig = (config: Partial<InterventionRuleConfig>) => {
    setInterventionConfig(prev => ({ ...prev, ...config }));
  };

  const resetDemoData = () => {
    reloadUserData();
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    document.cookie = 'careeros_persona=; path=/; max-age=0';
    document.cookie = 'careeros_demo_session=; path=/; max-age=0';
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (studentProfile.id) {
        localStorage.removeItem(`careeros_user_${studentProfile.id}`);
      }
    } catch {}
    setStudentProfile(EMPTY_STUDENT_PROFILE);
    setResumeData(EMPTY_RESUME_DATA);
    setReadinessScores(EMPTY_READINESS_SCORES);
    setFacultyStudents([]);
    window.location.href = '/login';
  };

  return (
    <AppContext.Provider
      value={{
        studentProfile,
        activeTargetRole,
        targetRoles: TARGET_ROLES,
        readinessScores,
        skillGaps,
        suitability,
        roadmapWeeks,
        resumeData,
        activePersona,
        facultyStudents,
        cohortKPIs,
        interventionConfig,
        recentEvents,
        technicalSessions,
        hrSessions,
        communicationMetrics,
        aptitudeHistory,
        aiChatMessages,
        isAiCoachOpen,
        isLoadingAuth,
        setTargetRole,
        toggleTaskStatus,
        addTechnicalInterviewEval,
        addHREval,
        updateCommunicationMetric,
        recordAptitudeScore,
        updateResumeBullet,
        uploadResumeText,
        setResumeData,
        sendAiChatMessage,
        setPersona,
        toggleAiCoach,
        updateStudentProfile,
        triggerIntervention,
        updateInterventionConfig,
        resetDemoData,
        reloadUserData,
        signOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
