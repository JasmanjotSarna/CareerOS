'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mic, 
  Video, 
  HardDrive, 
  Brain, 
  Sparkles, 
  AlertCircle, 
  Check, 
  X, 
  ArrowRight,
  Info,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { soundFX } from '@/components/effects/SoundFX';

export interface ConsentPreferences {
  microphoneConsent: boolean;
  cameraConsent: boolean;
  recordingConsent: boolean;
  aiAnalysisConsent: boolean;
  improvementConsent: boolean;
}

interface PreInterviewConsentModalProps {
  isOpen: boolean;
  interviewType: 'technical' | 'hr';
  roleTitle: string;
  onConsentGranted: (prefs: ConsentPreferences) => void;
  onCancel: () => void;
}

export function PreInterviewConsentModal({
  isOpen,
  interviewType,
  roleTitle,
  onConsentGranted,
  onCancel,
}: PreInterviewConsentModalProps) {
  // Granular separate consent states (UNCHECKED by default - NO pre-checked dark patterns)
  const [microphoneConsent, setMicrophoneConsent] = useState(false);
  const [cameraConsent, setCameraConsent] = useState(false);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [aiAnalysisConsent, setAiAnalysisConsent] = useState(false);
  const [improvementConsent, setImprovementConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Minimum required for interview participation: mic + AI analysis
  const canProceed = microphoneConsent && aiAnalysisConsent && recordingConsent;

  const handleSubmit = async () => {
    if (!canProceed) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    soundFX.playClick();

    try {
      const res = await fetch('/api/ai/interview/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType,
          microphoneConsent,
          cameraConsent,
          recordingConsent,
          aiAnalysisConsent,
          improvementConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register consent on server.');
      }

      soundFX.playSuccess();
      onConsentGranted({
        microphoneConsent,
        cameraConsent,
        recordingConsent,
        aiAnalysisConsent,
        improvementConsent,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Consent recording failed. Please try again.';
      setErrorMessage(msg);
      soundFX.playPulse();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Interview Privacy, Data & Consent Notice
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Target Role: {roleTitle} • Policy Version: 2026-09-17 (v1.0.0)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="text-[var(--text-muted)] hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
            {/* Plain English Disclosures */}
            <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] space-y-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase tracking-wider text-[10px] font-mono">
                <Info className="w-3.5 h-3.5" />
                How CareerOS Protects Your Interview Privacy
              </div>
              <p>
                CareerOS conducts simulated interviews to calibrate your placement readiness. We believe in complete transparency:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-[var(--text-muted)]">
                <li>
                  <strong className="text-white">Data Minimization:</strong> We evaluate <span className="text-cyan-300">only observable performance</span> (code correctness, response structure, communication clarity, problem-solving). We <strong className="text-rose-300">NEVER</strong> perform emotion recognition, biometric tracking, or psychological profiling.
                </li>
                <li>
                  <strong className="text-white">Storage & Retention:</strong> Audio/video recordings are stored in private, student-isolated encrypted buckets and automatically deleted after 30 days or immediately upon your request.
                </li>
                <li>
                  <strong className="text-white">Withdrawal & Deletion:</strong> You can withdraw consent mid-interview or delete all transcripts and audio at any time from your Privacy Controls.
                </li>
              </ul>
            </div>

            {/* Granular Consent Checkboxes */}
            <div className="space-y-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Required Consent Decisions (Select individually)
              </p>

              {/* 1. Microphone */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  microphoneConsent
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                    : 'bg-[var(--surface-secondary)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={microphoneConsent}
                  onChange={(e) => {
                    soundFX.playClick();
                    setMicrophoneConsent(e.target.checked);
                  }}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400" /> Microphone Use & Speech Input
                    </span>
                    <Badge variant="cyan" className="text-[9px] py-0 px-1">Required</Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Allow CareerOS to capture spoken answers for real-time speech-to-text transcription during the interview.
                  </p>
                </div>
              </label>

              {/* 2. Camera */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  cameraConsent
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                    : 'bg-[var(--surface-secondary)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={cameraConsent}
                  onChange={(e) => {
                    soundFX.playClick();
                    setCameraConsent(e.target.checked);
                  }}
                  className="mt-0.5 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500/30"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-indigo-400" /> Camera Video Stream
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Optional (Audio-Only if unchecked)</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Enables local video preview to simulate realistic face-to-face interview presence. You can proceed without camera in Audio-Only mode.
                  </p>
                </div>
              </label>

              {/* 3. Recording */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  recordingConsent
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-[var(--surface-secondary)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={recordingConsent}
                  onChange={(e) => {
                    soundFX.playClick();
                    setRecordingConsent(e.target.checked);
                  }}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500/30"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-amber-400" /> Session Recording & Storage
                    </span>
                    <Badge variant="momentum" className="text-[9px] py-0 px-1">Required</Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Save audio recording in your private storage bucket for post-session playback and report verification.
                  </p>
                </div>
              </label>

              {/* 4. AI Analysis */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  aiAnalysisConsent
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                    : 'bg-[var(--surface-secondary)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={aiAnalysisConsent}
                  onChange={(e) => {
                    soundFX.playClick();
                    setAiAnalysisConsent(e.target.checked);
                  }}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-cyan-400" /> AI Transcript Evaluation
                    </span>
                    <Badge variant="cyan" className="text-[9px] py-0 px-1">Required</Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Authorize the Socratic AI model to grade problem-solving correctness, algorithm complexity, and STAR behavioral answers.
                  </p>
                </div>
              </label>

              {/* 5. Optional Model Improvement */}
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    improvementConsent
                      ? 'bg-purple-500/10 border-purple-500/40 text-white'
                      : 'bg-[var(--surface-secondary)]/40 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={improvementConsent}
                    onChange={(e) => {
                      soundFX.playClick();
                      setImprovementConsent(e.target.checked);
                    }}
                    className="mt-0.5 rounded border-slate-700 text-purple-500 focus:ring-purple-500/30"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Optional: Anonymized Benchmark Improvement
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Strictly Optional</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Help improve question quality and difficulty calibration. Data is stripped of all personal identifiers before aggregation. Never required to use CareerOS.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Footer Action Controls */}
          <div className="p-5 border-t border-[var(--border-subtle)] bg-[var(--surface-secondary)] flex items-center justify-between gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
              Cancel & Return
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={!canProceed || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleSubmit}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Consent & Continue to Device Check
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
