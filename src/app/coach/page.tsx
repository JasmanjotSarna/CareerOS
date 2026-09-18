'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Send, 
  Sparkles, 
  Target, 
  ArrowRight, 
  Zap, 
  Code2, 
  FileText, 
  Mic,
  Bot,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { AIOrb } from '@/components/ui/AIOrb';
import { AIStreamingVisualizer } from '@/components/ai/AIStreamingVisualizer';
import { Card, GlowCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { soundFX } from '@/components/effects/SoundFX';

export default function CoachPage() {
  const { 
    aiChatMessages, 
    sendAiChatMessage, 
    studentProfile, 
    readinessScores, 
    activeTargetRole 
  } = useApp();

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickActions = [
    { label: 'Diagnose SQL Joins Deficit', prompt: 'Why is my SQL Joins proficiency holding back my readiness score?' },
    { label: 'Evaluate Resume ATS Alignment', prompt: 'What 3 bullet points should I rewrite in my resume for SDE-1?' },
    { label: 'System Design Checklist', prompt: 'Give me a 2-minute explanation checklist for caching with Redis.' },
    { label: 'STAR Framework Check', prompt: 'Review my situational framing for difficult team deadlines.' }
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    soundFX.playClick();
    setIsThinking(true);
    sendAiChatMessage(query.trim());
    setInput('');

    setTimeout(() => {
      setIsThinking(false);
      soundFX.playSuccess();
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>INTELLIGENCE STRATEGIST CONSOLE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Career Strategist
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Context-aware strategic coaching calibrated to your continuous readiness telemetry.
              </p>
            </div>

            <Badge variant="cyan">
              Connected: {activeTargetRole.title} ({readinessScores.overall}% Ready)
            </Badge>
          </div>

          {/* Central AI Orb Console & Proactive Recommendation */}
          <GlowCard glowColor="cyan" className="p-6 sm:p-8 bg-gradient-to-b from-[var(--surface-primary)] to-[var(--surface-secondary)] border border-cyan-500/30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <AIOrb 
                size={100} 
                state={isThinking ? 'thinking' : 'idle'} 
                readinessTrend={readinessScores.weeklyDelta} 
              />

              <div className="flex-1 text-center md:text-left space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Proactive Trajectory Recommendation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Focus on Week 1 SQL & Database Milestones
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Completing your database optimization drill will raise your technical score by +4% and push your overall readiness past the 75% placement gateway.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Quick Action Prompt Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[var(--text-dim)] font-bold tracking-wider">
              Diagnostic Prompts
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickActions.map((qa, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(qa.prompt)}
                  className="p-3 rounded-xl bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-subtle)] hover:border-cyan-500/40 text-left text-xs font-semibold text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{qa.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat Feed */}
          <Card className="p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-4">
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {aiChatMessages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAI
                          ? 'bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-sm'
                          : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      {msg.text}

                      {msg.quickActions && (
                        <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] space-y-1">
                          <p className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Next Steps:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.quickActions.map((qa, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSend(qa)}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--surface-tertiary)] hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 transition-colors text-left"
                              >
                                {qa}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="py-2">
                  <AIStreamingVisualizer
                    label="CareerOS AI Coach is synthesizing your guidance..."
                    sublabel="Evaluating code repository benchmarks and interview patterns"
                  />
                </div>
              )}
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CareerOS AI Strategist anything..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-default)] text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-cyan-500"
              />
              <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-4 h-4" />}>
                Send
              </Button>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}
