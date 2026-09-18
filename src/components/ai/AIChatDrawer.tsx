'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Target, 
  Compass, 
  Code2, 
  CheckCircle2, 
  CornerDownLeft,
  Loader2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundFX } from '@/components/effects/SoundFX';
import { AIStreamingVisualizer } from './AIStreamingVisualizer';
import { cn } from '@/lib/utils';

export const AIChatDrawer: React.FC = () => {
  const { 
    isAiCoachOpen, 
    toggleAiCoach, 
    aiChatMessages, 
    sendAiChatMessage, 
    activeTargetRole, 
    readinessScores 
  } = useApp();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages, isSending]);

  // Global hotkey: Command/Ctrl + J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleAiCoach();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAiCoach]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    soundFX.playClick();
    setIsSending(true);
    sendAiChatMessage(query.trim());
    setInput('');

    setTimeout(() => {
      setIsSending(false);
      soundFX.playSuccess();
    }, 900);
  };

  const quickStarters = [
    'What should I prioritize today for SDE-1?',
    'Why is my technical readiness lower than aptitude?',
    'Generate a 15-minute SQL practice roadmap.',
    'How do I frame an ATS bullet for distributed cache?'
  ];

  return (
    <AnimatePresence>
      {isAiCoachOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              soundFX.playClick();
              toggleAiCoach(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md h-full bg-[var(--surface-primary)] border-l border-[var(--border-default)] shadow-2xl flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-secondary)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    CareerOS AI Copilot
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Calibrated for {activeTargetRole.title} ({readinessScores.overall}% Ready)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  toggleAiCoach(false);
                }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-tertiary)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiChatMessages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={cn('flex flex-col', isAI ? 'items-start' : 'items-end')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed',
                        isAI
                          ? 'bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-sm'
                          : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                      )}
                    >
                      {msg.text}

                      {/* Quick action buttons if returned by AI */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] space-y-1.5">
                          <p className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Suggested Next Actions:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.quickActions.map((action, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSend(action)}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--surface-tertiary)] hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 transition-colors text-left"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-dim)] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isSending && (
                <div className="py-2">
                  <AIStreamingVisualizer
                    label="CareerOS Copilot is formulating recommendation..."
                    sublabel="Correlating target benchmark standards with student progress"
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {quickStarters.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(starter)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface-tertiary)] hover:bg-[var(--surface-floating)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-secondary)]"
            >
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-default)] focus-within:border-cyan-500 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask career strategist anything..."
                  className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
