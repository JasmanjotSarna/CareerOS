'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ChevronRight, 
  Lightbulb, 
  BrainCircuit, 
  Target,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { cn } from '@/lib/utils';

export const AIChatDrawer: React.FC = () => {
  const { 
    isAiCoachOpen, 
    toggleAiCoach, 
    aiChatMessages, 
    sendAiChatMessage, 
    studentProfile, 
    readinessScores, 
    activeTargetRole 
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiCoachOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatMessages, isAiCoachOpen]);

  if (!isAiCoachOpen) {
    return (
      <button
        onClick={() => toggleAiCoach(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-105 transition-all cursor-pointer border border-white/20 group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="tracking-wide">CareerOS AI Coach</span>
      </button>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendAiChatMessage(input.trim());
    setInput('');
  };

  const handleQuickAction = (text: string) => {
    sendAiChatMessage(text);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#0d111a] border-l border-[#202938] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-[#202938] bg-[#111722]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#111722]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">CareerOS AI Coach</h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized for {activeTargetRole.title} ({readinessScores.overall}% Ready)
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleAiCoach(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#161e2e] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Real-time Telemetry Mini Banner */}
        <div className="p-3 rounded-xl bg-[#111722] border border-[#202938] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              Strategic Intelligence Context
            </span>
            <span className="font-mono text-cyan-400 font-bold">{readinessScores.overall}% Readiness</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Current priority focus: <strong className="text-white">SQL Joins & System Design</strong>.
          </p>
        </div>

        {aiChatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col space-y-1 max-w-[85%]',
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            )}
          >
            <div
              className={cn(
                'p-3.5 rounded-2xl text-xs leading-relaxed',
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-tr-none shadow-md'
                  : 'bg-[#161e2e] border border-[#202938] text-slate-200 rounded-tl-none'
              )}
            >
              {msg.text}
            </div>

            {/* Quick Actions buttons if AI message */}
            {msg.sender === 'ai' && msg.quickActions && msg.quickActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.quickActions.map((qa, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(qa)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#111722] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/60 hover:border-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{qa}</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}

            <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast Prompts Drawer */}
      <div className="p-3 border-t border-[#202938] bg-[#111722]/50 space-y-2">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Suggested Career Questions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            'What should I study today?',
            'Why is my readiness 72%?',
            'Analyze my resume',
            'How do I practice for interviews?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#161e2e] text-slate-300 hover:text-white hover:bg-[#202938] border border-[#202938] transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#202938] bg-[#0d111a] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CareerOS about readiness, interviews, or skills..."
          className="flex-1 bg-[#111722] border border-[#202938] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
