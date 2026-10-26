import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { AIContextSnapshot } from '@/types';
import { getAIProvider } from '@/lib/ai/aiProvider';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-chat-${ip}`, 30);
    if (!rateCheck.success) {
      return new Response('Rate limit reached. Please wait a moment.', { status: 429 });
    }

    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();
    if (!auth.isAuthenticated && !auth.isDemo) {
      return new Response('Unauthorized: Session or demo access required.', { status: 401 });
    }
    const body = await req.json();
    const { message, contextSnapshot } = body as {
      message: string;
      contextSnapshot: AIContextSnapshot;
    };

    const encoder = new TextEncoder();
    const provider = getAIProvider();

    const systemPrompt = `You are CareerOS AI Career Strategist, an intelligent, analytical, and encouraging career advisor for university students.
You know the student's complete career context:
- Name: ${contextSnapshot?.studentProfile?.fullName || 'Student'}
- Degree: ${contextSnapshot?.studentProfile?.degree || 'B.Tech'} (${contextSnapshot?.studentProfile?.branch || 'CSE'}, Class of ${contextSnapshot?.studentProfile?.graduationYear || 2026})
- Target Placement Role: ${contextSnapshot?.targetRole?.title || 'Software Engineer — SDE-1'}
- Current Readiness Score: ${contextSnapshot?.readinessScore?.overall || 72}% (Technical: ${contextSnapshot?.readinessScore?.technical || 68}%, Aptitude: ${contextSnapshot?.readinessScore?.aptitude || 71}%, Communication: ${contextSnapshot?.readinessScore?.communication || 76}%, HR: ${contextSnapshot?.readinessScore?.hr || 80}%, Interview: ${contextSnapshot?.readinessScore?.interview || 75}%)
- Critical Skill Gaps: ${contextSnapshot?.skillGaps?.filter(g => g.priority === 'Critical').map(g => `${g.skillName} (${g.currentLevel}% -> ${g.requiredLevel}%)`).join(', ') || 'SQL, System Design'}
- Completed Tasks: ${contextSnapshot?.completedTasks?.length || 0} tasks completed.

Tone: Professional, direct, strategic, intelligent, and focused on placement success.
Keep answers concise, structured with bullet points where appropriate, and always suggest concrete next steps.`;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (provider.stream) {
            const model = process.env.OPENCODE_MODEL || 'big-pickle';
            const iterable = provider.stream({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message || 'What should I prioritize to reach 80% readiness?' },
              ],
              temperature: 0.7,
              maxTokens: 1024,
              stream: true,
            });
            for await (const chunk of iterable) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
            return;
          }
          // Fallback to complete if no stream
          const result = await provider.complete({
            model: process.env.OPENCODE_MODEL || 'big-pickle',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message || 'What should I prioritize to reach 80% readiness?' },
            ],
            temperature: 0.7,
            maxTokens: 1024,
          });
          controller.enqueue(encoder.encode(result.text));
          controller.close();
        } catch (err) {
          console.warn('AI provider error, falling back:', err);
          const roleTitle = contextSnapshot?.targetRole?.title || 'SDE-1';
          const topGap = contextSnapshot?.skillGaps?.[0]?.skillName || 'SQL';
          const fallbackText = `Based on your current ${contextSnapshot?.readinessScore?.overall || 72}% readiness for ${roleTitle}, your highest return on effort is closing your critical gap in ${topGap}.

Here is your strategic next step:
1. Complete the "${topGap} Practice Sprint" in Week 1 of your Roadmap.
2. Review multi-table join and indexing query plans.
3. Schedule a 15-minute Technical Mock Interview to test your problem-solving under time constraints.

Would you like to practice a technical question or dive into your roadmap now?`;
          const words = fallbackText.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise(r => setTimeout(r, 15));
          }
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no'
      }
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Chat error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
