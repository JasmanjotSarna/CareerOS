import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJson } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { FacultyStudentSummary, CohortKPIs } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-faculty-${ip}`, 30);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();
    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'faculty') {
      return NextResponse.json({ error: 'Forbidden: Faculty credentials required.' }, { status: 403 });
    }
    const body = await req.json();
    const { student, cohortKPIs } = body as {
      student: FacultyStudentSummary;
      cohortKPIs?: CohortKPIs;
    };

    const fallback = () => {
      const isAtRisk = (student?.overallReadiness || 65) < 60;
      return {
        recommendation: isAtRisk
          ? `Mandatory 1-on-1 placement counseling and assign remedial workshop sprint in ${student?.mainGap || 'SQL & Core CS'}.`
          : `Fast-track for Tier-1 campus placement drive interviews in ${student?.targetRole || 'Software Engineer'}.`,
        urgency: isAtRisk ? ('High' as const) : ('Low' as const),
        rationale: `Student readiness is at ${student?.overallReadiness || 65}% with ${student?.daysToDrive || 45} days remaining before drive commencement.`,
        suggestedActionPlan: [
          `Schedule 20-minute diagnostic session on ${student?.mainGap || 'Technical fundamentals'}`,
          'Enroll candidate into targeted peer-mentorship cohort',
          'Review updated ATS resume before final recruiter dispatch'
        ]
      };
    };

    const systemPrompt = `You are CareerOS University Placement Director Intelligence.
Generate a targeted placement intervention recommendation for a faculty officer regarding an individual student.
Return ONLY JSON matching:
{
  "recommendation": string,
  "urgency": "High" | "Medium" | "Low",
  "rationale": string,
  "suggestedActionPlan": string[]
}`;

    const userPrompt = `Student Data:
Name: ${student?.name || 'Student'}
Target Role: ${student?.targetRole || 'SDE-1'}
Overall Readiness: ${student?.overallReadiness || 60}% (Technical: ${student?.technicalReadiness || 55}%, Aptitude: ${student?.aptitudeReadiness || 60}%)
Main Gap: ${student?.mainGap || 'SQL'}
Days to Placement Drive: ${student?.daysToDrive || 45}
Cohort Average: ${cohortKPIs?.overallReadiness || 58}%`;

    const intervention = await callClaudeJson({
      systemPrompt,
      userPrompt,
      fallback
    });

    return NextResponse.json(intervention);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Faculty intervention error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
