import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJson } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { TurnEvaluationResult } from '@/lib/interview/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-interview-turn-${ip}`, 45);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await req.json();
    const { 
      interviewType, 
      targetRole, 
      currentTopic, 
      currentDifficulty, 
      candidateAnswer, 
      history, 
      turnCount 
    } = body;

    const turnsCompleted = Number(turnCount) || 0;
    const isWrapUp = turnsCompleted >= 4; // Wrap up after 4-5 thorough adaptive turns

    // Deterministic Heuristic Fallback
    const fallback = (): TurnEvaluationResult => {
      const words = (candidateAnswer || '').trim().split(/\s+/).length;
      const isShort = words < 15;

      if (isWrapUp) {
        return {
          evaluation: {
            score: 86,
            depthScore: 84,
            feedback: 'Strong problem decomposition, clear explanation of trade-offs, and steady delivery.',
            keyStrength: 'Analytical clarity and space-time complexity mastery',
            keyWeakness: 'Could proactively highlight edge cases before being prompted'
          },
          nextAction: 'wrap_up',
          followUpQuestion: "Thank you, Jasmanjot. That concludes our simulated session. I am compiling your multidimensional evaluation and readiness report now.",
          updatedDifficulty: currentDifficulty || 'Intermediate',
          updatedTopic: currentTopic || 'Evaluation Summary',
          shouldWrapUp: true
        };
      }

      if (interviewType === 'technical') {
        if (isShort) {
          return {
            evaluation: {
              score: 72,
              depthScore: 68,
              feedback: 'Concise, but needs deeper algorithmic justification.',
              keyWeakness: 'Shallow explanation of complexity'
            },
            nextAction: 'probe_complexity',
            followUpQuestion: "Why did you choose that specific data structure over an in-place sort, and what is the exact auxiliary space complexity?",
            updatedDifficulty: currentDifficulty || 'Intermediate',
            updatedTopic: currentTopic || 'Complexity Trade-offs',
            shouldWrapUp: false
          };
        } else {
          return {
            evaluation: {
              score: 88,
              depthScore: 85,
              feedback: 'Excellent linear time trade-off and clear explanation of memory allocation.',
              keyStrength: 'Accurate complexity analysis'
            },
            nextAction: 'follow_up',
            followUpQuestion: "That's optimal. Now consider what happens if numbers can be negative or duplicate indices overlap. How would your logic adapt?",
            updatedDifficulty: currentDifficulty === 'Beginner' ? 'Intermediate' : 'Advanced',
            updatedTopic: 'Edge Cases & Constraints',
            shouldWrapUp: false
          };
        }
      } else {
        // HR / Behavioral
        return {
          evaluation: {
            score: 84,
            depthScore: 82,
            feedback: 'Good STAR situational framing. Ensure results include quantifiable business metrics.',
            keyStrength: 'Ownership and accountability under pressure'
          },
          nextAction: 'follow_up',
          followUpQuestion: "That gives clear context on the task. What specific action did you personally take to realign the timeline, and what was the measured result?",
          updatedDifficulty: currentDifficulty || 'Intermediate',
          updatedTopic: 'STAR: Action & Measurable Impact',
          shouldWrapUp: false
        };
      }
    };

    // Compact history summary (pruning context to reduce time-to-first-token)
    const prunedHistory = (history || [])
      .slice(-4)
      .map((h: any) => `${h.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${h.text}`)
      .join('\n');

    const systemPrompt = `You are CareerOS Socratic AI Interviewer conducting a live university placement simulation for role: ${targetRole || 'Software Engineer — SDE-1'}.
Interview Type: ${interviewType || 'technical'}.
Current Topic: ${currentTopic || 'Data Structures'}.
Difficulty Level: ${currentDifficulty || 'Intermediate'}.
Turn Number: ${turnsCompleted + 1}.

Analyze the candidate's latest spoken answer in the context of recent turns.
Be an authentic, intelligent interviewer:
1. If the candidate gave a shallow answer or skipped trade-offs, challenge them Socratically ("Why did you pick X over Y?").
2. If technical, probe time/space complexity or boundary edge cases.
3. If HR/behavioral, probe their personal responsibility (STAR Action) and quantifiable outcomes (STAR Result).
4. If they have answered 4+ questions well or time is up, trigger wrap_up.
5. Keep the followUpQuestion CONCISE (1 to 2 punchy, conversational sentences) so it sounds natural when vocalized.

Return ONLY a JSON object matching this TypeScript contract:
{
  "evaluation": {
    "score": number, // 0-100
    "depthScore": number, // 0-100
    "feedback": string,
    "keyStrength": string,
    "keyWeakness": string
  },
  "nextAction": "follow_up" | "probe_complexity" | "transition_topic" | "wrap_up",
  "followUpQuestion": string,
  "updatedDifficulty": "Beginner" | "Intermediate" | "Advanced",
  "updatedTopic": string,
  "shouldWrapUp": boolean
}`;

    const userPrompt = `Recent Conversation:\n${prunedHistory}\n\nCandidate's Latest Answer:\n"${candidateAnswer}"\n\nIs Final Turn (Wrap up?): ${isWrapUp}`;

    const result = await callClaudeJson<TurnEvaluationResult>({
      systemPrompt,
      userPrompt,
      fallback,
      maxTokens: 500,
      temperature: 0.3
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Turn evaluation error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
