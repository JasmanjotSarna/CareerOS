'use client';

import React, { useState, useRef } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Copy,
  Upload,
  RefreshCw,
  ShieldCheck,
  FileUp,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { StatMetric } from '@/components/ui/StatMetric';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing, ProgressBar } from '@/components/ui/ProgressRing';
import { Modal } from '@/components/ui/Modal';
import { soundFX } from '@/components/effects/SoundFX';

export default function ResumePage() {
  const { resumeData, updateResumeBullet, uploadResumeText, setResumeData, activeTargetRole } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customResumeText, setCustomResumeText] = useState('');
  
  // Progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'parsing' | 'benchmarking' | 'complete' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max allowed size is 10MB.`);
      setSelectedFile(null);
      return;
    }

    const validExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setUploadError('Invalid format. Please upload PDF, DOCX, or TXT.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleResumeFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && uploadMode === 'file') return;
    if (!customResumeText.trim() && uploadMode === 'text') return;

    setUploadError(null);
    setUploadPhase('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    if (uploadMode === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    } else {
      formData.append('text', customResumeText.trim());
    }
    formData.append('targetRoleId', activeTargetRole.id);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(percent);
          if (percent >= 100) {
            setUploadPhase('parsing');
          }
        }
      });

      const responsePromise = new Promise<{ success: boolean; resumeData: typeof resumeData; error?: string }>((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const parsed = JSON.parse(xhr.responseText);
                resolve(parsed);
              } catch {
                reject(new Error('Failed to parse server response.'));
              }
            } else {
              try {
                const errJson = JSON.parse(xhr.responseText);
                reject(new Error(errJson.error || `Upload failed with HTTP ${xhr.status}`));
              } catch {
                reject(new Error(`Server error: HTTP ${xhr.status}`));
              }
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload.'));
      });

      xhr.open('POST', '/api/resume/upload');
      xhr.send(formData);

      const result = await responsePromise;

      if (result.success && result.resumeData) {
        setUploadPhase('complete');
        setResumeData(result.resumeData);
        soundFX.playSuccess();
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadPhase('idle');
          setSelectedFile(null);
          setCustomResumeText('');
        }, 1200);
      } else {
        throw new Error(result.error || 'Resume parsing failed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      console.warn('Resume upload error:', msg);
      setUploadPhase('error');
      setUploadError(msg);
      soundFX.playPulse();
    }
  };

  const handleAcceptBullet = (id: string) => {
    soundFX.playClick();
    updateResumeBullet(id, true);
    soundFX.playSuccess();
  };

  const handleRejectBullet = (id: string) => {
    soundFX.playClick();
    updateResumeBullet(id, false);
  };

  const atsScore = resumeData.atsScore || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ATS RESUME OPTIMIZATION ENGINE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Resume Ingestion & ATS Match
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Calibrated against {activeTargetRole.title} applicant tracking system parsers.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => {
                soundFX.playClick();
                setShowUploadModal(true);
              }}
            >
              Upload New Resume
            </Button>
          </div>

          {/* Top Scorecard Banner */}
          <GlowCard glowColor="cyan" className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Score Dial */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-2 md:border-r border-[var(--border-subtle)] md:pr-8">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  Composite ATS Score
                </span>
                <div className="flex items-center gap-4">
                  <ProgressRing value={atsScore} size={80} strokeWidth={7} variant="cyan" />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {atsScore >= 80 ? 'ATS Optimized' : atsScore >= 60 ? 'Competitive' : 'Needs Optimization'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{resumeData.fileName || 'Uploaded_Resume.pdf'}</p>
                  </div>
                </div>
              </div>

              {/* Vector Breakdown */}
              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Keywords</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">{resumeData.scores.keywordMatch}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Impact Metrics</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">{resumeData.scores.impactStatements}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Formatting</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">{resumeData.scores.formatting}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Role Fit</span>
                  <span className="text-lg font-mono font-bold text-cyan-400 mt-1 block">{resumeData.scores.roleAlignment}%</span>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Missing Keywords & Suggested Bullet Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: AI Bullet Improvements (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  AI High-Impact Bullet Rewrites
                </h3>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {resumeData.suggestedImprovements.length} Pending
                </span>
              </div>

              {resumeData.suggestedImprovements.length === 0 ? (
                <Card className="p-8 text-center bg-[var(--surface-primary)] border border-[var(--border-subtle)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">All Bullet Suggestions Applied</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Your experience bullets contain quantified metrics and action verbs.</p>
                </Card>
              ) : (
                resumeData.suggestedImprovements.map((imp) => (
                  <Card key={imp.id} className="p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">{imp.section}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">+4 ATS Points</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15 text-xs text-red-200">
                        <span className="text-[9px] font-mono text-red-400 uppercase block font-bold mb-0.5">Original</span>
                        {imp.original}
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-emerald-200">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase block font-bold mb-0.5">Optimized (Quantified)</span>
                        {imp.improved}
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] italic">
                      Why: {imp.explanation}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRejectBullet(imp.id)}
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                        onClick={() => handleAcceptBullet(imp.id)}
                      >
                        Accept Improvement
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Right: Missing Keywords & Extracted Skills (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-3">
                <h3 className="text-sm font-bold text-white">Missing Target Keywords</h3>
                <p className="text-xs text-[var(--text-muted)]">High-frequency terms recruiters look for:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeData.missingKeywords.length > 0 ? (
                    resumeData.missingKeywords.map((kw, i) => (
                      <Badge key={i} variant="momentum" className="text-[10px]">
                        + {kw}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 font-mono">No critical keywords missing!</span>
                  )}
                </div>
              </Card>

              <Card className="p-5 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-3">
                <h3 className="text-sm font-bold text-white">Parsed Technical Competencies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.parsedSkills.map((sk, i) => (
                    <Badge key={i} variant="neutral" className="text-[10px]">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Upload Resume Modal */}
          {showUploadModal && (
            <Modal
              isOpen={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              title="Upload & Parse Resume"
              description="Upload your PDF or paste resume text for instant ATS scoring."
            >
              <form onSubmit={handleResumeFileUpload} className="space-y-4">
                <div className="flex gap-2 p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      uploadMode === 'file' ? 'bg-cyan-500/20 text-cyan-300' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    File Upload (PDF/DOCX)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('text')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      uploadMode === 'text' ? 'bg-cyan-500/20 text-cyan-300' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Raw Text
                  </button>
                </div>

                {uploadMode === 'file' ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 rounded-2xl border-2 border-dashed border-[var(--border-default)] hover:border-cyan-400/60 bg-[var(--surface-secondary)]/50 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <FileUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">
                      {selectedFile ? selectedFile.name : 'Click or drag resume file here'}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">PDF, DOCX, or TXT up to 10MB</p>
                  </div>
                ) : (
                  <textarea
                    value={customResumeText}
                    onChange={(e) => setCustomResumeText(e.target.value)}
                    placeholder="Paste resume markdown or plain text here..."
                    rows={6}
                    className="w-full p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-default)] text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-cyan-500"
                  />
                )}

                {uploadError && (
                  <p className="text-xs text-rose-400">{uploadError}</p>
                )}

                {uploadPhase !== 'idle' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-cyan-300">
                      <span>{uploadPhase === 'parsing' ? 'AI Ingesting Skills...' : 'Uploading...'}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <ProgressBar value={uploadProgress} variant="cyan" size="sm" />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    isLoading={uploadPhase === 'uploading' || uploadPhase === 'parsing'}
                  >
                    Analyze Resume
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
}
