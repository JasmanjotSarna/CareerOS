import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJson } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { StudentProfile, TargetRole, SuitabilityAnalysis, SkillGap } from '@/types';
import { AIService } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-suitability-${ip}`, 30);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }
    const body = await req.json();
    const { action, profile, targetRole } = body as {
      action?: 'suitability' | 'skillGaps' | 'jobRequirements';
      profile?: StudentProfile;
      targetRole?: TargetRole;
    };

    if (!targetRole) {
      return NextResponse.json({ error: 'targetRole is required' }, { status: 400 });
    }

    if (action === 'skillGaps') {
      if (!profile) {
        return NextResponse.json({ error: 'profile is required for skillGaps' }, { status: 400 });
      }
      const fallback = (): SkillGap[] => {
        return AIService.identifySkillGaps(profile, targetRole);
      };

      const systemPrompt = `You are CareerOS AI Skill Gap Engine.
Analyze the student's current proficiency vs the required proficiencies for the target role.
Return ONLY an array of objects adhering to this TypeScript interface:
interface SkillGap {
  skillName: string;
  category: string;
  currentLevel: number; // 0 to 100
  requiredLevel: number; // 0 to 100
  gap: number; // requiredLevel - currentLevel (max(0, diff))
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  reason: string;
}`;

      const userPrompt = `Target Role: ${targetRole.title}\nRequired Skills: ${JSON.stringify(targetRole.requiredSkills)}\nStudent Skills: ${JSON.stringify(profile.skills)}`;

      const gaps = await callClaudeJson<SkillGap[]>({
        systemPrompt,
        userPrompt,
        fallback
      });

      return NextResponse.json({ gaps });
    }

    if (action === 'jobRequirements') {
      const fallback = () => AIService.analyzeJobRequirements(targetRole);

      const systemPrompt = `You are CareerOS Job Requirement Analyst. Return high-level requirement breakdown JSON.`;
      const userPrompt = `Target Role: ${JSON.stringify(targetRole)}`;

      const analysis = await callClaudeJson({
        systemPrompt,
        userPrompt,
        fallback
      });

      return NextResponse.json(analysis);
    }

    // Default: calculateJobSuitability
    if (!profile) {
      return NextResponse.json({ error: 'profile is required for suitability analysis' }, { status: 400 });
    }

    const fallback = (): SuitabilityAnalysis => {
      return AIService.calculateJobSuitability(profile, targetRole);
    };

    const systemPrompt = `You are CareerOS Job Suitability Evaluation Engine.
Benchmark candidate against target role specifications.
Return ONLY JSON adhering to this TypeScript interface:
interface SuitabilityAnalysis {
  overallMatch: number; // 0 to 100
  skillsScore: number; // 0 to 100
  educationScore: number; // 0 to 100
  projectsScore: number; // 0 to 100
  experienceScore: number; // 0 to 100
  resumeAlignmentScore: number; // 0 to 100
  strongMatches: string[];
  missingSkills: string[];
  roleInsights: string;
  recommendedFocus: string;
}`;

    const userPrompt = `Candidate Profile:
Name: ${profile.fullName}
Degree: ${profile.degree} (${profile.branch})
CGPA: ${profile.cgpa}
Skills: ${profile.skills.map(s => `${s.name}: ${s.currentProficiency}%`).join(', ')}

Target Role: ${targetRole.title} (${targetRole.category})
Required Skills: ${targetRole.requiredSkills.map(s => `${s.name}: ${s.requiredProficiency}% (Critical: ${s.critical})`).join(', ')}
Education Expectations: ${targetRole.educationExpectations}`;

    const suitability = await callClaudeJson<SuitabilityAnalysis>({
      systemPrompt,
      userPrompt,
      fallback
    });

    return NextResponse.json(suitability);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Suitability error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
