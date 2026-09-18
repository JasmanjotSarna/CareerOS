import { NextRequest, NextResponse } from 'next/server';
import { callUniversalAIJson, AIAnalysisUnavailableError } from '@/lib/ai/universalAI';
import {
  checkResumeAnalysisRateLimit,
  computeContentHash,
  getCachedAnalysis,
  setCachedAnalysis,
} from '@/lib/ai/rateLimit';
import { ResumeData, TargetRole, ExtractedSkill } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();

    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const userIdOrIp = auth.userId || ip;

    // Apply per-user rate limit
    const rateCheck = checkResumeAnalysisRateLimit(userIdOrIp);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'rate_limited',
          message: rateCheck.message || 'Rate limit reached. Please wait before uploading again.',
          reset: rateCheck.reset,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { action, resumeText, targetRole, fileName } = body as {
      action?: 'extractSkills' | 'analyzeResume';
      resumeText?: string;
      targetRole?: TargetRole;
      fileName?: string;
    };

    const textToAnalyze = (resumeText || '').trim();
    if (!textToAnalyze || textToAnalyze.length < 20) {
      return NextResponse.json(
        { error: 'Insufficient text provided for resume analysis (minimum 20 characters required).' },
        { status: 400 }
      );
    }

    // 1. Action: extractSkills
    if (action === 'extractSkills') {
      const cacheHash = computeContentHash(textToAnalyze, 'extractSkills');
      const cached = getCachedAnalysis<ExtractedSkill[]>(cacheHash);
      if (cached) {
        return NextResponse.json({ skills: cached, cached: true });
      }

      const systemPrompt = `You are CareerOS AI Skill Extraction Engine.
Analyze the candidate's resume text and extract all genuine technical competencies, programming languages, databases, cloud platforms, developer tools, libraries, frameworks, and computer science fundamentals.
For each skill, determine:
- "name": Standard canonical skill name (e.g. "React", "PostgreSQL", "Python", "Docker", "FastAPI")
- "confidence": Float between 0.1 and 1.0 reflecting how clearly the skill is demonstrated with context/projects (e.g. 0.95 if used in a production project, 0.70 if only listed in a skills list)
- "category": Categorize strictly into one of: "Programming", "Data", "Backend", "Frontend", "AI/ML", "CS Fundamentals", "Cloud/DevOps"

Return ONLY a JSON array adhering to this schema:
[
  {
    "name": "Python",
    "confidence": 0.95,
    "category": "Programming"
  }
]`;

      const userPrompt = `Candidate Resume Content:\n\n${textToAnalyze}`;

      const extractedSkills = await callUniversalAIJson<ExtractedSkill[]>({
        systemPrompt,
        userPrompt,
        temperature: 0.1,
      });

      setCachedAnalysis(cacheHash, extractedSkills);
      return NextResponse.json({ skills: extractedSkills });
    }

    // 2. Action: analyzeResume (Default)
    const role: TargetRole = targetRole || {
      id: 'role-sde-1',
      title: 'Software Engineer — SDE-1',
      category: 'Software Engineering',
      description: 'Backend microservices, clean code, scalable systems',
      salaryRange: '₹12 LPA — ₹24 LPA',
      marketDemand: 'Very High',
      experienceLevel: 'Entry Level (0-2 yrs)',
      educationExpectations: 'B.Tech CSE/IT',
      experienceExpectations: 'Projects in REST APIs & databases',
      softSkills: ['Problem Solving', 'Team Collaboration'],
      interviewAreas: ['DSA', 'System Design'],
      aptitudeAreas: ['Quantitative', 'Logical'],
      communicationExpectations: 'Clear technical articulation',
      requiredSkills: [
        { name: 'Python', category: 'Programming', requiredProficiency: 85, weight: 1, critical: true },
        { name: 'Data Structures', category: 'Programming', requiredProficiency: 85, weight: 1, critical: true },
        { name: 'SQL', category: 'Data', requiredProficiency: 80, weight: 0.9, critical: true },
        { name: 'System Design', category: 'Backend', requiredProficiency: 70, weight: 0.8, critical: true },
        { name: 'Docker', category: 'Backend', requiredProficiency: 65, weight: 0.7, critical: false },
      ],
    };

    // Check content hash cache to avoid charging/calling LLM on identical re-runs
    const analysisHash = computeContentHash(textToAnalyze, `analyzeResume::${role.id}`);
    const cachedAnalysis = getCachedAnalysis<ResumeData>(analysisHash);
    if (cachedAnalysis) {
      return NextResponse.json({ ...cachedAnalysis, cached: true });
    }

    const resolvedFileName = fileName || 'Uploaded_Resume.pdf';
    const requiredSkillNames = role.requiredSkills.map((s) => s.name);

    const systemPrompt = `You are CareerOS ATS Resume Analysis & Placement Optimization Engine.
You evaluate the candidate's actual resume against the target role: "${role.title}" (${role.category}).
You must judge the ACTUAL provided text. Do NOT invent fake projects or generic placeholder data.

Target Role Core Competencies to check:
${requiredSkillNames.join(', ')}

Return ONLY valid JSON strictly matching this schema:
{
  "fileName": "${resolvedFileName}",
  "uploadedAt": "${new Date().toISOString()}",
  "atsScore": number, // 0 to 100 overall composite score
  "scores": {
    "keywordMatch": number, // 0 to 100 based on presence of target competencies
    "impactStatements": number, // 0 to 100 based on quantifiable metrics, numbers, percentages, business impact
    "formatting": number, // 0 to 100 based on structure, readability, sectioning
    "roleAlignment": number // 0 to 100 based on fit for ${role.title}
  },
  "parsedSkills": string[], // All genuine skills found in the candidate's text
  "extractedProjects": [ // Extract 1-3 ACTUAL projects described in the resume
    {
      "title": string,
      "description": string,
      "technologies": string[]
    }
  ],
  "missingKeywords": string[], // Skills required by ${role.title} that this resume lacks
  "suggestedImprovements": [ // 2-3 specific improvements that take ACTUAL sentences from the resume and rewrite them with quantified impact and clarity
    {
      "id": "imp-1",
      "section": string,
      "original": string, // Exact or near-exact sentence from the user's resume
      "improved": string, // Action-oriented, quantified rewrite
      "explanation": string, // Why this rewrite scores higher with technical recruiters
      "applied": false
    }
  ],
  "summaryFeedback": string // 2-3 sentences evaluating the candidate's specific profile and primary steps to reach 85%+ ATS fit
}`;

    const userPrompt = `Target Role: ${role.title}
Required Competencies: ${requiredSkillNames.join(', ')}

Candidate Resume Text:
${textToAnalyze}`;

    const resumeData = await callUniversalAIJson<ResumeData>({
      systemPrompt,
      userPrompt,
      temperature: 0.15,
    });

    // Ensure metadata consistency
    resumeData.fileName = resolvedFileName;
    resumeData.uploadedAt = new Date().toISOString();

    setCachedAnalysis(analysisHash, resumeData);
    return NextResponse.json(resumeData);
  } catch (e: unknown) {
    console.error('[API /api/ai/resume Error]:', e);
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
    const message = e instanceof Error ? e.message : 'Internal resume analysis error';
    return NextResponse.json({ error: message, retryable: true }, { status: 500 });
  }
}
