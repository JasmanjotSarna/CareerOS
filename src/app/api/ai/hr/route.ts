import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJson } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { HRInterviewQuestion, HRInterviewEvaluation } from '@/types';
import { HR_QUESTIONS } from '@/lib/data/mockData';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-hr-${ip}`, 30);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();
    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    const body = await req.json();
    const { action, category, question, transcript } = body;

    if (action === 'generateQuestion') {
      const fallback = (): HRInterviewQuestion => {
        if (category) {
          const found = HR_QUESTIONS.find(q => q.category === category);
          if (found) return found;
        }
        return HR_QUESTIONS[0];
      };

      const systemPrompt = `You are CareerOS HR Placement Director.
Generate a behavioral interview question for campus placement candidates.
Return ONLY JSON conforming to this TypeScript shape:
interface HRInterviewQuestion {
  id: string;
  question: string;
  category: 'Problem Solving' | 'Conflict Resolution' | 'Leadership' | 'Failure & Adaptability' | 'Company Fit';
  contextTip: string;
}`;

      const userPrompt = `Generate a realistic behavioral interview prompt targeting ${category || 'Leadership'}.`;

      const q = await callClaudeJson<HRInterviewQuestion>({
        systemPrompt,
        userPrompt,
        fallback
      });

      return NextResponse.json(q);
    }

    // Default: evaluateAnswer
    const fallback = (): HRInterviewEvaluation => {
      const studentAnswer = transcript || '';
      const wordCount = studentAnswer.trim().split(/\s+/).length;
      const hasNumbers = /\d+/.test(studentAnswer);

      return {
        id: `hr-eval-${Date.now()}`,
        questionId: 'hr-q1',
        question: question || 'Tell me about a challenging project and how you handled unexpected setbacks.',
        studentAnswer,
        scores: {
          clarity: Math.min(92, Math.max(65, wordCount > 50 ? 85 : 68)),
          structure: 80,
          confidence: 76,
          specificity: hasNumbers ? 85 : 65,
        },
        overallScore: hasNumbers ? 82 : 74,
        starFrameworkScore: {
          situation: 85,
          task: 72,
          action: 80,
          result: hasNumbers ? 88 : 65,
        },
        aiFeedback: hasNumbers
          ? 'Great quantitative results backing your STAR structure.'
          : 'Good structure, but add measurable outcomes to demonstrate business impact.',
        suggestedRewrite: 'Conclude with explicit metrics on performance improvement or delivery speed.',
        timestamp: new Date().toISOString()
      };
    };

    const systemPrompt = `You are CareerOS Behavioral Interview Coach.
Evaluate the student's spoken/transcribed behavioral answer using the STAR method (Situation, Task, Action, Result).
Return ONLY JSON matching this TypeScript interface:
interface HRInterviewEvaluation {
  id: string;
  questionId: string;
  question: string;
  studentAnswer: string;
  scores: {
    clarity: number; // 0 to 100
    structure: number; // 0 to 100
    confidence: number; // 0 to 100
    specificity: number; // 0 to 100
  };
  overallScore: number; // 0 to 100
  starFrameworkScore: {
    situation: number; // 0 to 100
    task: number; // 0 to 100
    action: number; // 0 to 100
    result: number; // 0 to 100
  };
  aiFeedback: string;
  suggestedRewrite: string;
  timestamp: string;
}`;

    const userPrompt = `Question: ${question || 'Behavioral Question'}\nStudent Transcript:\n${transcript || ''}`;

    const evaluation = await callClaudeJson<HRInterviewEvaluation>({
      systemPrompt,
      userPrompt,
      fallback
    });

    return NextResponse.json(evaluation);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'HR evaluation error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
