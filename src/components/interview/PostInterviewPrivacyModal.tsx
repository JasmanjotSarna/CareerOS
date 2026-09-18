'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Trash2, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { soundFX } from '@/components/effects/SoundFX';

interface PostInterviewPrivacyModalProps {
  isOpen: boolean;
  interviewType: 'technical' | 'hr';
  transcript?: string;
  onClose: () => void;
  onDataDeleted?: () => void;
}

export function PostInterviewPrivacyModal({
  isOpen,
  interviewType,
  transcript = '',
  onClose,
  onDataDeleted,
}: PostInterviewPrivacyModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadTranscript = () => {
    soundFX.playClick();
    const blob = new Blob([transcript || 'CareerOS Interview Transcript\nTimestamp: ' + new Date().toISOString()], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careeros_${interviewType}_transcript_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    soundFX.playSuccess();
  };

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to permanently delete this interview session transcript and recording? This cannot be undone.')) {
      return;
    }

    soundFX.playClick();
    setIsDeleting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/ai/interview/consent?interviewType=${interviewType}&deleteData=true`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete data');

      soundFX.playSuccess();
      setStatusMessage({ type: 'success', text: 'Interview transcript and recording permanently deleted.' });
      if (onDataDeleted) onDataDeleted();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed.';
      setStatusMessage({ type: 'error', text: msg });
      soundFX.playPulse();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWithdrawConsent = async () => {
    soundFX.playClick();
    setIsWithdrawing(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/ai/interview/consent?interviewType=${interviewType}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to withdraw consent');

      soundFX.playSuccess();
      setStatusMessage({ type: 'success', text: 'Active interview consent withdrawn successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Consent withdrawal failed.';
      setStatusMessage({ type: 'error', text: msg });
      soundFX.playPulse();
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 z-10 space-y-6 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Privacy & Interview Data Controls</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation */}
          <div className="text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
            <p>
              In accordance with CareerOS data ownership principles, you have full control over your recorded session media and generated transcripts:
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-3">
            {/* 1. Download Transcript */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">Download Transcript</span>
                <span className="text-[11px] text-[var(--text-muted)] block">Save a local copy of full dialogue and code</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleDownloadTranscript} leftIcon={<Download className="w-3.5 h-3.5" />}>
                Export
              </Button>
            </div>

            {/* 2. Withdraw Consent */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">Withdraw Active Consent</span>
                <span className="text-[11px] text-[var(--text-muted)] block">Revokes authorization for future sessions</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWithdrawConsent}
                isLoading={isWithdrawing}
              >
                Withdraw
              </Button>
            </div>

            {/* 3. Delete Session Data */}
            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-rose-300 block">Permanently Delete Data</span>
                <span className="text-[11px] text-[var(--text-muted)] block">Deletes audio recordings and evaluations</span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteData}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </Button>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-end">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
