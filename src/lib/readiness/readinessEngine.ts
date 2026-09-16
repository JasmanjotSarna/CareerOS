import { 
  ReadinessScoreBreakdown, 
  StudentSkill, 
  RoadmapTask, 
  RoleSkillRequirement,
  TechnicalInterviewEvaluation,
  HRInterviewEvaluation,
  CommunicationMetric
} from '@/types';

export interface ReadinessWeights {
  technical: number;
  aptitude: number;
  communication: number;
  hr: number;
  interview: number;
}

export const DEFAULT_READINESS_WEIGHTS: ReadinessWeights = {
  technical: 0.35,
  aptitude: 0.20,
  communication: 0.15,
  hr: 0.15,
  interview: 0.15,
};

/**
 * Calculates weighted overall career readiness score (0-100)
 */
export function calculateOverallReadiness(
  scores: {
    technical: number;
    aptitude: number;
    communication: number;
    hr: number;
    interview: number;
  },
  weights: ReadinessWeights = DEFAULT_READINESS_WEIGHTS
): number {
  const sumWeights = weights.technical + weights.aptitude + weights.communication + weights.hr + weights.interview;
  
  const rawWeighted = 
    scores.technical * weights.technical +
    scores.aptitude * weights.aptitude +
    scores.communication * weights.communication +
    scores.hr * weights.hr +
    scores.interview * weights.interview;

  const normalized = Math.round(rawWeighted / sumWeights);
  return Math.min(100, Math.max(0, normalized));
}

/**
 * Computes Technical Readiness based on:
 * 1. Current student skill proficiencies vs target role critical requirements
 * 2. Completed roadmap technical tasks
 */
export function calculateTechnicalReadiness(
  studentSkills: StudentSkill[],
  targetRequirements: RoleSkillRequirement[],
  completedRoadmapTasks: RoadmapTask[],
  baseScore: number = 78
): number {
  if (targetRequirements.length === 0) return baseScore;

  let totalWeightedMatch = 0;
  let totalRequirementWeight = 0;

  for (const req of targetRequirements) {
    const studentSkill = studentSkills.find(
      s => s.name.toLowerCase() === req.name.toLowerCase()
    );
    const studentProficiency = studentSkill ? studentSkill.currentProficiency : 0;
    
    // Ratio of student's proficiency to required proficiency
    const ratio = Math.min(1.0, studentProficiency / Math.max(1, req.requiredProficiency));
    const importance = req.critical ? req.weight * 1.5 : req.weight;
    
    totalWeightedMatch += ratio * 100 * importance;
    totalRequirementWeight += importance;
  }

  const skillsScore = totalRequirementWeight > 0 
    ? totalWeightedMatch / totalRequirementWeight 
    : baseScore;

  // Bonus for completed technical roadmap tasks (up to +15 pts)
  const techTasks = completedRoadmapTasks.filter(
    t => t.category === 'Programming' || t.category === 'Backend' || t.category === 'Data' || t.category === 'CS Fundamentals'
  );
  const taskBonus = Math.min(15, techTasks.length * 3.5);

  const finalTechScore = Math.round(skillsScore * 0.85 + taskBonus);
  return Math.min(100, Math.max(0, finalTechScore));
}

/**
 * Calculates Aptitude score given quiz results and baseline
 */
export function calculateAptitudeReadiness(
  aptitudeQuizScores: number[],
  baseScore: number = 71
): number {
  if (aptitudeQuizScores.length === 0) return baseScore;
  const avg = aptitudeQuizScores.reduce((a, b) => a + b, 0) / aptitudeQuizScores.length;
  // Blend 40% baseline with 60% latest performance
  return Math.round(baseScore * 0.4 + avg * 0.6);
}

/**
 * Calculates Communication Readiness based on audio metrics or drills
 */
export function calculateCommunicationReadiness(
  communicationMetric: CommunicationMetric | null,
  baseScore: number = 64
): number {
  if (!communicationMetric) return baseScore;
  
  // Pacing score penalty if too many filler words
  const fillerPenalty = Math.min(20, communicationMetric.fillerWordCount * 2);
  const metricScore = Math.round(
    communicationMetric.speakingScore * 0.5 + 
    communicationMetric.clarityScore * 0.3 + 
    communicationMetric.pacingScore * 0.2 - 
    fillerPenalty
  );
  
  return Math.min(100, Math.max(0, Math.round(baseScore * 0.35 + metricScore * 0.65)));
}

/**
 * Calculates HR readiness score based on evaluated behavioral interviews
 */
export function calculateHRReadiness(
  hrEvaluations: HRInterviewEvaluation[],
  baseScore: number = 69
): number {
  if (hrEvaluations.length === 0) return baseScore;
  const recent = hrEvaluations[hrEvaluations.length - 1];
  return Math.round(baseScore * 0.3 + recent.overallScore * 0.7);
}

/**
 * Calculates Technical Interview readiness based on coding simulations
 */
export function calculateInterviewReadiness(
  interviewEvaluations: TechnicalInterviewEvaluation[],
  baseScore: number = 67
): number {
  if (interviewEvaluations.length === 0) return baseScore;
  const recent = interviewEvaluations[interviewEvaluations.length - 1];
  return Math.round(baseScore * 0.3 + recent.overallScore * 0.7);
}

/**
 * Returns tier classification for visual badges
 */
export function getReadinessTier(score: number): 'Ready' | 'Developing' | 'At-Risk' {
  if (score >= 75) return 'Ready';
  if (score >= 50) return 'Developing';
  return 'At-Risk';
}

/**
 * Computes difference from previous week or baseline
 */
export function getReadinessDelta(currentScore: number, previousScore: number): number {
  return currentScore - previousScore;
}

/**
 * Master recalculator that generates complete breakdown
 */
export function computeCompleteReadiness(params: {
  technical: number;
  aptitude: number;
  communication: number;
  hr: number;
  interview: number;
  previousOverall?: number;
}): ReadinessScoreBreakdown {
  const overall = calculateOverallReadiness({
    technical: params.technical,
    aptitude: params.aptitude,
    communication: params.communication,
    hr: params.hr,
    interview: params.interview
  });

  const previous = params.previousOverall ?? 64;
  const weeklyDelta = overall - previous;

  return {
    overall,
    technical: params.technical,
    aptitude: params.aptitude,
    communication: params.communication,
    hr: params.hr,
    interview: params.interview,
    weeklyDelta: weeklyDelta >= 0 ? weeklyDelta : 0,
    lastUpdated: new Date().toISOString()
  };
}
