export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type SkillCategory = 
  | 'Programming'
  | 'Data'
  | 'Backend'
  | 'Frontend'
  | 'AI/ML'
  | 'CS Fundamentals'
  | 'Communication'
  | 'Interview Skills'
  | 'Analytics & Business';

export interface StudentSkill {
  id: string;
  name: string;
  category: SkillCategory;
  currentProficiency: number; // 0-100
  verified: boolean;
  lastAssessed?: string;
}

export interface ExtractedSkill {
  name: string;
  confidence: number; // 0.0 to 1.0
  category: SkillCategory | string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  university: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  targetRoleId: string;
  targetRoleTitle: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills: StudentSkill[];
  resumeText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleSkillRequirement {
  name: string;
  category: SkillCategory;
  requiredProficiency: number; // 0-100
  weight: number; // 0.0 - 1.0
  critical: boolean;
  benchmarkDescription?: string;
}

export interface TargetRole {
  id: string;
  title: string;
  category: 'Software Engineering' | 'Data & Analytics' | 'AI / Machine Learning' | 'Product & Business' | 'Cloud & DevOps';
  description: string;
  salaryRange: string;
  marketDemand: 'High' | 'Very High' | 'Moderate';
  experienceLevel: 'Entry Level (0-2 yrs)' | 'Associate' | 'Mid-Level';
  requiredSkills: RoleSkillRequirement[];
  softSkills: string[];
  educationExpectations: string;
  experienceExpectations: string;
  interviewAreas: string[];
  aptitudeAreas: string[];
  communicationExpectations: string;
}

export interface SkillGap {
  skillName: string;
  category: SkillCategory;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  reason: string;
  recommendedAction: string;
}

export interface SuitabilityAnalysis {
  overallMatch: number; // 0-100
  roleId: string;
  roleTitle: string;
  breakdown: {
    skills: number;
    experience: number;
    education: number;
    projects: number;
    resume: number;
  };
  strongMatches: string[];
  missingSkills: string[];
  criticalGaps: string[];
  aiSummary: string;
  improvementTip: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  skillName: string;
  category: SkillCategory;
  weekNumber: number;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in_progress' | 'completed';
  actionType: 'learn' | 'practice' | 'mock_interview' | 'quiz';
  externalResource?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'practice_lab';
  };
  completedAt?: string;
  pointsContribution?: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focus: string;
  status: 'completed' | 'current' | 'upcoming';
  tasks: RoadmapTask[];
}

export interface ReadinessScoreBreakdown {
  overall: number; // 0-100
  technical: number;
  aptitude: number;
  communication: number;
  hr: number;
  interview: number;
  weeklyDelta: number; // e.g. +8
  lastUpdated: string;
}

export interface ResumeData {
  fileName: string;
  uploadedAt: string;
  atsScore: number;
  scores: {
    keywordMatch: number;
    impactStatements: number;
    formatting: number;
    roleAlignment: number;
  };
  parsedSkills: string[];
  extractedProjects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  missingKeywords: string[];
  suggestedImprovements: Array<{
    id: string;
    section: string;
    original: string;
    improved: string;
    explanation: string;
    applied?: boolean;
  }>;
  summaryFeedback: string;
}

export interface TechnicalInterviewQuestion {
  id: string;
  title: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  hints: string[];
}

export interface TechnicalInterviewEvaluation {
  id: string;
  questionId: string;
  questionTitle: string;
  submittedCode: string;
  language: string;
  scores: {
    correctness: number;
    problemSolving: number;
    communication: number;
    timeManagement: number;
  };
  overallScore: number;
  timeComplexity: string;
  spaceComplexity: string;
  aiCritique: string;
  suggestedFocus: string;
  testCasesPassed: {
    passed: number;
    total: number;
  };
  timestamp: string;
}

export interface HRInterviewQuestion {
  id: string;
  question: string;
  category: 'Problem Solving' | 'Conflict Resolution' | 'Leadership' | 'Failure & Adaptability' | 'Company Fit';
  contextTip: string;
}

export interface HRInterviewEvaluation {
  id: string;
  questionId: string;
  question: string;
  studentAnswer: string;
  scores: {
    clarity: number;
    structure: number;
    confidence: number;
    specificity: number;
  };
  overallScore: number;
  starFrameworkScore: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  aiFeedback: string;
  suggestedRewrite: string;
  timestamp: string;
}

export interface InterviewSession {
  id: string;
  type: 'technical' | 'hr';
  targetRole: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  metrics: Record<string, number>;
  timestamp: string;
}

export interface CommunicationMetric {
  id?: string;
  speakingScore: number; // 0-100
  pacingWpm: number; // words per min (target 120-150)
  pacingScore: number;
  clarityScore: number;
  fillerWordCount: number;
  fillerWords: Array<{ word: string; count: number }>;
  recordedDurationSeconds: number;
  transcript: string;
  feedback: string[];
  timestamp: string;
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal' | 'DSA';
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AptitudeAssessmentSession {
  id: string;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  categoryScores: Record<string, number>;
}

export interface CareerOSEvent {
  id: string;
  type: 
    | 'roadmap_task_completed'
    | 'aptitude_test_completed'
    | 'technical_interview_completed'
    | 'hr_interview_completed'
    | 'communication_practice_completed'
    | 'resume_bullet_optimized'
    | 'target_role_changed'
    | 'faculty_intervention_dispatched';
  title: string;
  description: string;
  readinessDelta?: number;
  timestamp: string;
}

export interface FacultyStudentSummary {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  degree: string;
  targetRole: string;
  overallReadiness: number;
  technicalReadiness: number;
  aptitudeReadiness: number;
  communicationReadiness: number;
  interviewReadiness: number;
  mainGap: string;
  daysToDrive: number;
  status: 'Ready' | 'Developing' | 'At-Risk';
  requiresIntervention: boolean;
  resumeAtsScore: number;
  roadmapProgress: number; // 0-100
  aiRecommendedAction: string;
  lastActive: string;
}

export interface InterventionRuleConfig {
  readinessThreshold: number; // e.g. 40%
  daysToDriveThreshold: number; // e.g. 60 days
}

export interface CohortKPIs {
  totalStudents: number;
  overallReadiness: number;
  technicalReadiness: number;
  aptitudeReadiness: number;
  communicationReadiness: number;
  interviewReadiness: number;
  studentsAtRiskCount: number;
  readyPercentage: number;
  developingPercentage: number;
  atRiskPercentage: number;
  topCohortSkillGaps: Array<{ skill: string; deficitPercentage: number }>;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActions?: string[];
  contextSnapshot?: {
    overallReadiness: number;
    targetRole: string;
    criticalGaps: string[];
    nextAction: string;
  };
}

export interface AIContextSnapshot {
  studentProfile: StudentProfile;
  targetRole: TargetRole;
  resume: ResumeData;
  skills: StudentSkill[];
  requiredSkills: RoleSkillRequirement[];
  skillGaps: SkillGap[];
  roadmapWeeks: RoadmapWeek[];
  completedTasks: RoadmapTask[];
  recentEvents: CareerOSEvent[];
  technicalSessions: TechnicalInterviewEvaluation[];
  hrSessions: HRInterviewEvaluation[];
  communicationMetrics: CommunicationMetric[];
  aptitudeHistory: AptitudeAssessmentSession[];
  readinessScore: ReadinessScoreBreakdown;
}
