import { NextRequest } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/claudeClient';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { AIContextSnapshot } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`ai-chat-${ip}`, 30);
    if (!rateCheck.success) {
      return new Response('Rate limit reached. Please wait a moment.', { status: 429 });
    }
    const body = await req.json();
    const { message, contextSnapshot } = body as {
      message: string;
      contextSnapshot: AIContextSnapshot;
    };

    const encoder = new TextEncoder();
    const client = getAnthropicClient();

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
        if (client) {
          try {
            const claudeStream = client.messages.stream({
              model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
              max_tokens: 1200,
              system: systemPrompt,
              messages: [
                {
                  role: 'user',
                  content: message || 'What should I prioritize to reach 80% readiness?'
                }
              ]
            });

            for await (const chunk of claudeStream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                controller.enqueue(encoder.encode(chunk.delta.text));
              }
            }
            controller.close();
          } catch (err) {
            console.warn('Claude stream error, falling back:', err);
            const fallback = `Based on your profile target of ${contextSnapshot?.targetRole?.title || 'SDE-1'}, your immediate blocker is SQL Joins and Indexing (current gap: 25 points). Completing Week 1 roadmap tasks and taking an assessment will elevate your readiness above 75%.`;
            controller.enqueue(encoder.encode(fallback));
            controller.close();
          }
        } else {
          // Fallback simulation when API key is not yet set
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
            await new Promise(r => setTimeout(r, 25));
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
