'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
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
  AIContextSnapshot
} from '@/types';
import {
  INITIAL_STUDENT_PROFILE,
  TARGET_ROLES,
  INITIAL_READINESS_SCORES,
  INITIAL_RESUME_DATA,
  FACULTY_STUDENTS_MOCK,
  COHORT_KPIS
} from '@/lib/data/mockData';
import { AIService } from '@/lib/ai/aiService';
import {
  calculateOverallReadiness,
  calculateTechnicalReadiness,
  calculateAptitudeReadiness,
  calculateCommunicationReadiness,
  calculateHRReadiness,
  calculateInterviewReadiness,
  computeCompleteReadiness
} from '@/lib/readiness/readinessEngine';
import {
  studentRepo,
  targetRoleRepo,
  readinessRepo,
  assessmentRepo,
  facultyRepo
} from '@/lib/repository/supabaseRepository';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

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
  
  // Actions
  setTargetRole: (roleId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  addTechnicalInterviewEval: (evaluation: TechnicalInterviewEvaluation) => void;
  addHREval: (evaluation: HRInterviewEvaluation) => void;
  updateCommunicationMetric: (metric: CommunicationMetric) => void;
  recordAptitudeScore: (percentage: number, categoryScores?: Record<string, number>) => void;
  updateResumeBullet: (impId: string, accepted: boolean) => void;
  uploadResumeText: (text: string) => Promise<void>;
  sendAiChatMessage: (text: string) => void;
  setPersona: (persona: 'student' | 'faculty') => void;
  toggleAiCoach: (open?: boolean) => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  triggerIntervention: (studentId: string, note?: string) => void;
  updateInterventionConfig: (config: Partial<InterventionRuleConfig>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'careeros_deep_state_v2';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [activeTargetRoleId, setActiveTargetRoleId] = useState<string>('role-sde-1');
  const [readinessScores, setReadinessScores] = useState<ReadinessScoreBreakdown>(INITIAL_READINESS_SCORES);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [activePersona, setActivePersona] = useState<'student' | 'faculty'>('student');
  const [facultyStudents, setFacultyStudents] = useState<FacultyStudentSummary[]>(FACULTY_STUDENTS_MOCK);
  const [interventionConfig, setInterventionConfig] = useState<InterventionRuleConfig>({
    readinessThreshold: 40,
    daysToDriveThreshold: 60,
  });
  const [recentEvents, setRecentEvents] = useState<CareerOSEvent[]>([
    {
      id: 'evt-init',
      type: 'target_role_changed',
      title: 'Target Role Initialized: Software Engineer — SDE-1',
      description: 'Profile mapped to SDE-1 placement criteria; baseline readiness set to 72%.',
      timestamp: '2026-09-15T18:00:00Z'
    }
  ]);

  const [technicalSessions, setTechnicalSessions] = useState<TechnicalInterviewEvaluation[]>([]);
  const [hrSessions, setHrSessions] = useState<HRInterviewEvaluation[]>([]);
  const [communicationMetrics, setCommunicationMetrics] = useState<CommunicationMetric[]>([]);
  const [aptitudeHistory, setAptitudeHistory] = useState<AptitudeAssessmentSession[]>([
    {
      id: 'apt-init',
      timestamp: '2026-09-15T12:00:00Z',
      totalQuestions: 6,
      correctAnswers: 4,
      percentage: 71,
      categoryScores: { Quantitative: 74, Logical: 78, Verbal: 72, DSA: 80 }
    }
  ]);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);

  // Derived active role
  const activeTargetRole = TARGET_ROLES.find(r => r.id === activeTargetRoleId) || TARGET_ROLES[0];

  // Derived Suitability & Skill Gaps
  const suitability = useMemo(() => {
    return AIService.calculateJobSuitability(studentProfile, activeTargetRole);
  }, [studentProfile, activeTargetRole]);

  const skillGaps = useMemo(() => {
    return AIService.identifySkillGaps(studentProfile, activeTargetRole);
  }, [studentProfile, activeTargetRole]);

  // Roadmap Weeks state
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>(() =>
    AIService.generateRoadmap(INITIAL_STUDENT_PROFILE, TARGET_ROLES[0], AIService.identifySkillGaps(INITIAL_STUDENT_PROFILE, TARGET_ROLES[0]))
  );

  // AI Chat Messages
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello Jasmanjot! I'm CareerOS AI, your personal career strategist. I've analyzed your profile against your SDE-1 target. You're currently at 72% overall readiness. What would you like to tackle today?",
      timestamp: 'Just now',
      quickActions: ['What should I study today?', 'Why is my readiness 72%?', 'Analyze my resume', 'Practice technical interview']
    }
  ]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        /* eslint-disable react-hooks/set-state-in-effect */
        if (parsed.studentProfile) setStudentProfile(parsed.studentProfile);
        if (parsed.activeTargetRoleId) setActiveTargetRoleId(parsed.activeTargetRoleId);
        if (parsed.readinessScores) setReadinessScores(parsed.readinessScores);
        if (parsed.resumeData) setResumeData(parsed.resumeData);
        if (parsed.roadmapWeeks) setRoadmapWeeks(parsed.roadmapWeeks);
        if (parsed.facultyStudents) setFacultyStudents(parsed.facultyStudents);
        if (parsed.recentEvents) setRecentEvents(parsed.recentEvents);
        if (parsed.technicalSessions) setTechnicalSessions(parsed.technicalSessions);
        if (parsed.hrSessions) setHrSessions(parsed.hrSessions);
        if (parsed.communicationMetrics) setCommunicationMetrics(parsed.communicationMetrics);
        if (parsed.aptitudeHistory) setAptitudeHistory(parsed.aptitudeHistory);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch (e) {
      console.warn('Could not hydrate local state:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when major state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
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
    readinessRepo.recordReadinessUpdate(studentProfile.id, newBreakdown).catch(e => console.warn(e));

    // Sync student record in faculty list as well (Single Source of Truth)
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

    // Re-adapt roadmap for the new role!
    const newGaps = AIService.identifySkillGaps(studentProfile, role);
    const newRoadmap = AIService.generateRoadmap(studentProfile, role, newGaps);
    setRoadmapWeeks(newRoadmap);

    // Append event
    const event: CareerOSEvent = {
      id: `evt-${Date.now()}`,
      type: 'target_role_changed',
      title: `Switched Target Goal to ${role.title}`,
      description: `Adapted roadmap and re-calculated suitability against ${role.requiredSkills.length} new skill competencies.`,
      timestamp: new Date().toISOString()
    };
    setRecentEvents(prev => [event, ...prev]);
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

    if (toggledTask) {
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
    setTechnicalSessions(prev => [...prev, evaluation]);
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
    setHrSessions(prev => [...prev, evaluation]);
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
    setCommunicationMetrics(prev => [...prev, metric]);
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
    const updated = [...aptitudeHistory, session];
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

  const uploadResumeText = async (text: string) => {
    const newResume = await AIService.analyzeResume(text, activeTargetRole);
    setResumeData(newResume);

    // Extract skills and update profile
    const extractedSkills = AIService.extractSkills(text);
    const updatedSkills = studentProfile.skills.map(s => {
      if (extractedSkills.includes(s.name)) {
        return { ...s, currentProficiency: Math.min(95, s.currentProficiency + 10), verified: true };
      }
      return s;
    });

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

    // Build structured context snapshot for real AI intelligence
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
      // Fallback response if network latency
      const fallbackReply: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on your target of ${activeTargetRole.title}, focusing on your primary gap in SQL and completing Week 1 roadmap tasks will give you the highest readiness return.`,
        timestamp: 'Just now',
        quickActions: ['How can I improve my SQL?', 'Start Technical Interview', 'View Roadmap']
      };
      setAiChatMessages(prev => [...prev, fallbackReply]);
    });
  };

  const setPersona = (persona: 'student' | 'faculty') => {
    setActivePersona(persona);
  };

  const toggleAiCoach = (open?: boolean) => {
    setIsAiCoachOpen(prev => (open !== undefined ? open : !prev));
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    studentRepo.updateProfile(studentProfile.id, updates).catch(e => console.warn(e));
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setActiveTargetRoleId('role-sde-1');
    setReadinessScores(INITIAL_READINESS_SCORES);
    setResumeData(INITIAL_RESUME_DATA);
    setFacultyStudents(FACULTY_STUDENTS_MOCK);
    setRecentEvents([
      {
        id: 'evt-init',
        type: 'target_role_changed',
        title: 'Target Role Initialized: Software Engineer — SDE-1',
        description: 'Profile mapped to SDE-1 placement criteria; baseline readiness set to 72%.',
        timestamp: '2026-09-15T18:00:00Z'
      }
    ]);
    const initGaps = AIService.identifySkillGaps(INITIAL_STUDENT_PROFILE, TARGET_ROLES[0]);
    setRoadmapWeeks(AIService.generateRoadmap(INITIAL_STUDENT_PROFILE, TARGET_ROLES[0], initGaps));
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
        setTargetRole,
        toggleTaskStatus,
        addTechnicalInterviewEval,
        addHREval,
        updateCommunicationMetric,
        recordAptitudeScore,
        updateResumeBullet,
        uploadResumeText,
        sendAiChatMessage,
        setPersona,
        toggleAiCoach,
        updateStudentProfile,
        triggerIntervention,
        updateInterventionConfig,
        resetDemoData
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
