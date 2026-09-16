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
  Bot
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { AIOrb } from '@/components/ui/AIOrb';
import { GlowCard } from '@/components/ui/GlowCard';
import { CareerButton } from '@/components/ui/CareerButton';
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
    { label: 'Diagnose SQL Joins', prompt: 'Why is my SQL Joins proficiency holding back my readiness score?' },
    { label: 'Evaluate Resume Gaps', prompt: 'What 3 bullet points should I rewrite in my resume for SDE-1?' },
    { label: 'Simulate System Design', prompt: 'Give me a 2-minute explanation checklist for caching with Redis.' },
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
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>INTELLIGENCE CONSOLE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                AI Career Strategist
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Context-aware coaching calibrated to your continuous readiness telemetry.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-slate-300">
                Connected to: {activeTargetRole.title}
              </span>
            </div>
          </div>

          {/* 1. CENTRAL AI ORB CONSOLE & PROACTIVE RECOMMENDATION */}
          <GlowCard className="p-8 bg-gradient-to-b from-slate-900 to-[#0B0F16] border border-cyan-500/30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <AIOrb 
                size={110} 
                state={isThinking ? 'thinking' : 'idle'} 
                readinessTrend={readinessScores.weeklyDelta} 
              />

              <div className="flex-1 text-center md:text-left space-y-3">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Proactive Trajectory Recommendation
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-mono leading-snug">
                  &quot;Jasmanjot, spend 35 minutes mastering B-Tree SQL indexing today to convert your 78% readiness into placement-ready 84%.&quot;
                </h3>

                <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                  <Link href="/roadmap">
                    <CareerButton variant="momentum" size="sm" rightIcon={<Zap className="w-3.5 h-3.5" />}>
                      Practice SQL Drill
                    </CareerButton>
                  </Link>
                  <Link href="/skills">
                    <CareerButton variant="secondary" size="sm">
                      Inspect Skill Gap
                    </CareerButton>
                  </Link>
                  <Link href="/interviews/technical">
                    <CareerButton variant="ghost" size="sm" rightIcon={<Code2 className="w-3.5 h-3.5" />}>
                      Start Technical Mock
                    </CareerButton>
                  </Link>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* 2. QUICK CONTEXT CHIPS */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Suggested Diagnostic Queries</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.prompt)}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold font-mono text-white group-hover:text-cyan-300 block mb-1">
                    {action.label}
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {action.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. CONVERSATIONAL LOG */}
          <GlowCard className="p-6 bg-[#0B0F16] border border-white/[0.08] flex flex-col min-h-[380px]">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {aiChatMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`p-4 rounded-2xl text-xs leading-relaxed max-w-2xl ${
                    msg.sender === 'ai' 
                      ? 'bg-slate-900/80 border border-cyan-500/20 text-slate-200' 
                      : 'bg-cyan-950/20 border border-cyan-500/30 text-cyan-100 ml-auto'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-slate-400">
                    <span className={msg.sender === 'ai' ? 'text-cyan-400 font-bold' : 'text-slate-300 font-bold'}>
                      {msg.sender === 'ai' ? 'CareerOS AI' : 'Jasmanjot'}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CareerOS AI about interview prep, skill gaps, or placement strategy..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
              />
              <CareerButton type="submit" variant="primary" size="md" rightIcon={<Send className="w-3.5 h-3.5" />}>
                Consult AI
              </CareerButton>
            </form>
          </GlowCard>
        </main>
      </div>
    </div>
  );
}
