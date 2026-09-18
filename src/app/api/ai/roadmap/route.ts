import { NextRequest, NextResponse } from 'next/server';
import { callUniversalAIJson } from '@/lib/ai/universalAI';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { StudentProfile, TargetRole, SkillGap, RoadmapWeek, ReadinessScoreBreakdown } from '@/types';
import { AIService } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-roadmap-${ip}`, 25);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();
    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    const body = await req.json();
    const { action, profile, targetRole, skillGaps, readinessScore } = body as {
      action?: 'generateRoadmap' | 'nextBestAction';
      profile?: StudentProfile;
      targetRole?: TargetRole;
      skillGaps?: SkillGap[];
      readinessScore?: ReadinessScoreBreakdown;
    };

    if (action === 'nextBestAction') {
      const fallback = () => {
        return AIService.generateNextBestAction(
          readinessScore || { overall: 72, technical: 68, aptitude: 71, communication: 76, hr: 80, interview: 75, weeklyDelta: 3, lastUpdated: new Date().toISOString() },
          skillGaps || []
        );
      };

      const roleTitle = targetRole?.title || 'Software Engineer — SDE-1';
      const systemPrompt = `You are CareerOS Next-Best Action Engine.
Recommend the single most impactful learning or practice task for the student based on their weakest readiness dimension and priority skill gaps.
Return ONLY JSON matching:
{
  "title": string,
  "reason": string,
  "actionLabel": string,
  "actionRoute": string,
  "estimatedMinutes": number
}`;

      const userPrompt = `Target Role: ${roleTitle}\nReadiness: ${JSON.stringify(readinessScore || {})}\nPriority Gaps: ${JSON.stringify(skillGaps?.slice(0, 3) || [])}`;

      const nextAction = await callUniversalAIJson({
        systemPrompt,
        userPrompt,
      }).catch(() => fallback());

      return NextResponse.json(nextAction);
    }

    // Default: generateRoadmap
    if (!profile || !targetRole) {
      return NextResponse.json({ error: 'profile and targetRole are required for roadmap generation' }, { status: 400 });
    }

    const gaps = skillGaps || (await AIService.identifySkillGaps(profile, targetRole));
    const fallback = (): RoadmapWeek[] => {
      return AIService.generateRoadmap(profile, targetRole, gaps);
    };

    const systemPrompt = `You are CareerOS Personalized Career Roadmap Generator.
Synthesize a 4-week structured preparation roadmap for a university student targeting ${targetRole.title}.
Return ONLY JSON matching this TypeScript shape:
type RoadmapWeek = {
  weekNumber: number; // 1, 2, 3, 4
  title: string;
  focus: string;
  status: 'completed' | 'current' | 'upcoming';
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    skillName: string;
    category: string;
    actionType: 'practice' | 'assessment' | 'reading' | 'project';
    weekNumber: number;
    estimatedMinutes: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    status: 'pending' | 'in_progress' | 'completed';
  }>;
}[];`;

    const userPrompt = `Target Role: ${targetRole.title}\nPriority Skill Gaps:\n${gaps.map(g => `${g.skillName} (${g.priority}): Current ${g.currentLevel}% -> Required ${g.requiredLevel}%`).join('\n')}`;

    const roadmap = await callUniversalAIJson<RoadmapWeek[]>({
      systemPrompt,
      userPrompt,
    }).catch(() => fallback());

    return NextResponse.json({ roadmap });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Roadmap error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
