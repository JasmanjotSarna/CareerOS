import { NextRequest, NextResponse } from 'next/server';
import { callUniversalAIJson, AIAnalysisUnavailableError } from '@/lib/ai/universalAI';
import { checkRateLimit, computeContentHash, getCachedAnalysis, setCachedAnalysis } from '@/lib/ai/rateLimit';
import { StudentProfile, TargetRole, SuitabilityAnalysis, SkillGap } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-suitability-${ip}`, 45);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'rate_limited',
          message: rateCheck.message || 'Too many requests. Please wait a moment.',
        },
        { status: 429 }
      );
    }

    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();
    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
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

    // 0. Action: jobRequirements
    if (action === 'jobRequirements') {
      const criticalCount = (targetRole.requiredSkills || []).filter(s => s.critical).length;
      return NextResponse.json({
        roleTitle: targetRole.title,
        category: targetRole.category,
        totalCompetencies: (targetRole.requiredSkills || []).length,
        criticalCompetencies: criticalCount,
        educationExpectation: targetRole.educationExpectations,
        interviewRounds: targetRole.interviewAreas,
        salaryExpectation: targetRole.salaryRange
      });
    }

    // 1. Action: skillGaps
    if (action === 'skillGaps') {
      if (!profile) {
        return NextResponse.json({ error: 'profile is required for skillGaps' }, { status: 400 });
      }

      const cacheKey = computeContentHash(
        JSON.stringify({ skills: profile.skills, role: targetRole.id }),
        'skillGaps'
      );
      const cached = getCachedAnalysis<SkillGap[]>(cacheKey);
      if (cached) {
        return NextResponse.json({ gaps: cached, cached: true });
      }

      const systemPrompt = `You are CareerOS AI Skill Gap & Diagnostic Engine.
Evaluate the student's verified skills against the required competencies for: "${targetRole.title}".
SEMANTIC MATCHING RULES:
1. Recognize technology equivalents & synonyms (e.g. "React.js" = "React", "Postgres" = "PostgreSQL", "Node" = "Node.js", "K8s" = "Kubernetes", "AWS" = "Amazon Web Services", "Golang" = "Go").
2. For each requirement, determine student's effective proficiency (0 to 100) based on direct skills or semantic equivalents.
3. Compute gap = Math.max(0, requiredLevel - currentLevel).
4. Assign priority:
   - "Critical": if the skill is critical for the target role AND gap > 20
   - "High": if gap > 20 or critical
   - "Medium": if gap between 10 and 20
   - "Low": if gap <= 10
5. Provide a role-specific reason and concrete recommended action for closing the gap.

Return ONLY a JSON array strictly conforming to this schema:
[
  {
    "skillName": string,
    "category": string,
    "currentLevel": number,
    "requiredLevel": number,
    "gap": number,
    "priority": "Critical" | "High" | "Medium" | "Low",
    "reason": string,
    "recommendedAction": string
  }
]`;

      const userPrompt = `Target Role: ${targetRole.title} (${targetRole.category})
Required Skills:
${JSON.stringify(targetRole.requiredSkills, null, 2)}

Student Skills:
${JSON.stringify(profile.skills, null, 2)}`;

      const gaps = await callUniversalAIJson<SkillGap[]>({
        systemPrompt,
        userPrompt,
        temperature: 0.15,
      });

      setCachedAnalysis(cacheKey, gaps);
      return NextResponse.json({ gaps });
    }

    // 2. Action: calculateJobSuitability (Default)
    if (!profile) {
      return NextResponse.json({ error: 'profile is required for suitability analysis' }, { status: 400 });
    }

    const cacheKey = computeContentHash(
      JSON.stringify({
        skills: profile.skills,
        cgpa: profile.cgpa,
        role: targetRole.id,
      }),
      'suitability'
    );
    const cached = getCachedAnalysis<SuitabilityAnalysis>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const systemPrompt = `You are CareerOS Job Suitability Evaluation Engine.
Benchmark candidate against target role specifications using deep SEMANTIC understanding.

CRITICAL EVALUATION GUIDELINES:
1. SEMANTIC EQUIVALENCE: Treat synonyms and framework derivatives as matches (e.g. "React.js" and "React", "Postgres" and "PostgreSQL", "FastAPI" and "REST APIs", "PyTorch" and "Deep Learning").
2. CONTEXTUAL SKILLS: Infer implied competencies from candidate skills (e.g. knowing Docker + Kubernetes demonstrates Container Orchestration & DevOps; knowing Git + multi-developer projects demonstrates Team Collaboration & Version Control).
3. Compute honest, multi-dimensional scores (0-100):
   - skills: alignment with target technical competencies
   - experience: depth of demonstrated knowledge for entry/associate level
   - education: candidate CGPA (${profile.cgpa || 8.0}/10) & degree alignment with ${targetRole.educationExpectations || 'B.Tech CSE/IT'}
   - projects: alignment of candidate profile with ${targetRole.experienceExpectations || 'production backend projects'}
   - resume: overall profile readiness
   - overallMatch: weighted composite (skills 40%, experience 20%, projects 20%, education 10%, resume 10%)

Return ONLY a valid JSON object with exactly these keys:
{
  "overallMatch": 0,
  "roleId": "${targetRole.id}",
  "roleTitle": "${targetRole.title}",
  "breakdown": {
    "skills": 0,
    "experience": 0,
    "education": 0,
    "projects": 0,
    "resume": 0
  },
  "strongMatches": [],
  "missingSkills": [],
  "criticalGaps": [],
  "aiSummary": "",
  "improvementTip": ""
}
All numeric scores must be integers from 0 to 100. strongMatches, missingSkills, and criticalGaps must be arrays of short competency names. aiSummary must be 2 sentences. improvementTip must be 1 concrete action. Do not include comments, markdown, or any text outside the JSON object.`;

    const userPrompt = `Target Role: ${targetRole.title} (${targetRole.category})
Salary Range: ${targetRole.salaryRange}
Required Competencies:
${JSON.stringify(targetRole.requiredSkills, null, 2)}

Candidate Profile:
- Degree & Branch: ${profile.degree || 'B.Tech'} ${profile.branch || 'CSE'}, CGPA: ${profile.cgpa || 8.0}
- Skills:
${JSON.stringify(profile.skills, null, 2)}`;

    const analysis = await callUniversalAIJson<SuitabilityAnalysis>({
      systemPrompt,
      userPrompt,
      temperature: 0.15,
    });

    setCachedAnalysis(cacheKey, analysis);
    return NextResponse.json(analysis);
  } catch (e: unknown) {
    console.error('[API /api/ai/suitability Error]:', e);
    if (e instanceof AIAnalysisUnavailableError) {
      return NextResponse.json(
        {
          error: 'analysis_unavailable',
          message: e.message,
          retryable: true,
        },
        { status: 503 }
      );
    }
    const message = e instanceof Error ? e.message : 'Internal suitability analysis error';
    return NextResponse.json({ error: message, retryable: true }, { status: 500 });
  }
}
