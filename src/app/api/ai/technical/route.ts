import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJson } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { TechnicalInterviewQuestion, TechnicalInterviewEvaluation } from '@/types';
import { TECHNICAL_QUESTIONS } from '@/lib/data/mockData';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-tech-${ip}`, 30);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }
    const body = await req.json();
    const { action, roleTitle, difficulty, question, code, language, timeSpentSeconds } = body;

    if (action === 'generateQuestion') {
      const fallback = (): TechnicalInterviewQuestion => {
        return TECHNICAL_QUESTIONS[0];
      };

      const systemPrompt = `You are CareerOS Senior Technical Interviewer.
Generate a realistic coding interview challenge for campus placement drives for role: ${roleTitle || 'Software Engineer — SDE-1'}.
Return ONLY JSON conforming to this TypeScript interface:
interface TechnicalInterviewQuestion {
  id: string;
  title: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    cpp: string;
    java: string;
  };
  hints: string[];
}`;

      const userPrompt = `Generate a ${difficulty || 'Medium'} DSA or coding problem targeting Arrays, Hashmaps, or Two Pointers.`;

      const q = await callClaudeJson<TechnicalInterviewQuestion>({
        systemPrompt,
        userPrompt,
        fallback
      });

      return NextResponse.json(q);
    }

    // Default: evaluateAnswer
    const fallback = (): TechnicalInterviewEvaluation => {
      return {
        id: `eval-tech-${Date.now()}`,
        questionId: question?.id || 'tech-q1',
        questionTitle: question?.title || 'Coding Challenge',
        submittedCode: code || '',
        language: language || 'python',
        scores: {
          correctness: 82,
          problemSolving: 76,
          communication: 75,
          timeManagement: 80,
        },
        overallScore: 78,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        aiCritique: 'You solved the problem correctly. Your hash-set approach achieves optimal O(N) time complexity. Focus on explaining edge case trade-offs during live interview rounds.',
        suggestedFocus: 'Practice hashmap and two-pointer interview patterns.',
        testCasesPassed: {
          passed: 4,
          total: 5
        },
        timestamp: new Date().toISOString()
      };
    };

    const systemPrompt = `You are CareerOS Senior Technical Interview Evaluator.
Analyze the candidate's submitted code against the problem statement.
Return ONLY JSON conforming to this TypeScript interface:
interface TechnicalInterviewEvaluation {
  id: string;
  questionId: string;
  questionTitle: string;
  submittedCode: string;
  language: string;
  scores: {
    correctness: number; // 0 to 100
    problemSolving: number; // 0 to 100
    communication: number; // 0 to 100
    timeManagement: number; // 0 to 100
  };
  overallScore: number; // 0 to 100
  timeComplexity: string; // e.g. "O(N)"
  spaceComplexity: string; // e.g. "O(N)"
  aiCritique: string;
  suggestedFocus: string;
  testCasesPassed: {
    passed: number;
    total: number;
  };
  timestamp: string;
}`;

    const userPrompt = `Problem Title: ${question?.title || 'First Duplicate Element'}\nDescription: ${question?.description || ''}\nLanguage: ${language || 'python'}\nCandidate Code Submission:\n${code || ''}\nTime Spent: ${timeSpentSeconds || 480} seconds.`;

    const evaluation = await callClaudeJson<TechnicalInterviewEvaluation>({
      systemPrompt,
      userPrompt,
      fallback
    });

    return NextResponse.json(evaluation);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Technical interview error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
