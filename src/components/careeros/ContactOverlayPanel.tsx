'use client';

import React, { useState, useEffect } from 'react';

export type OfferPath = 'students' | 'colleges' | 'together';

interface ContactOverlayPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialPath?: OfferPath;
}

export function ContactOverlayPanel({
  isOpen,
  onClose,
  initialPath = 'students',
}: ContactOverlayPanelProps) {
  const [selectedPath, setSelectedPath] = useState<OfferPath>(initialPath);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [prevPath, setPrevPath] = useState<OfferPath>(initialPath);
  if (initialPath !== prevPath) {
    setPrevPath(initialPath);
    setSelectedPath(initialPath);
  }

  // Handle ESC key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CareerOS Contact and Early Access"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Sliding Drawer Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-[#0B132B] border-l border-white/10 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto select-none animate-slide-left text-[#F8F9FA]"
      >
        <div>
          {/* Header with Close Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4361EE]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#94A3B8]">
                CareerOS Inquiries
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors"
            >
              Close [Esc]
            </button>
          </div>

          <div className="mt-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              {selectedPath === 'students'
                ? 'Get Early Access for Students'
                : selectedPath === 'colleges'
                ? 'Talk to Us About Your College'
                : 'Plan an Integrated Rollout'}
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {selectedPath === 'students'
                ? 'Self-serve access for students and job-seekers. Benchmark your readiness, find missing skills, and prepare for campus and off-campus drives.'
                : selectedPath === 'colleges'
                ? 'For placement cells and college leadership. Track cohort readiness across technical, aptitude, and HR dimensions with early intervention alerts.'
                : 'Equip your entire college cohort with student accounts while providing your placement department with aggregate cohort analytics.'}
            </p>
          </div>

          {/* Three Paths Switcher */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setSelectedPath('students');
                setSubmitted(false);
              }}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                selectedPath === 'students'
                  ? 'bg-[#4361EE] text-white border-[#4361EE]'
                  : 'bg-[#1E293B]/40 border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              For Students
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPath('colleges');
                setSubmitted(false);
              }}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                selectedPath === 'colleges'
                  ? 'bg-[#4361EE] text-white border-[#4361EE]'
                  : 'bg-[#1E293B]/40 border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              For Colleges
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPath('together');
                setSubmitted(false);
              }}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                selectedPath === 'together'
                  ? 'bg-[#4361EE] text-white border-[#4361EE]'
                  : 'bg-[#1E293B]/40 border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              Together
            </button>
          </div>

          {/* Form Content */}
          {submitted ? (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3">
              <p className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Thank you, {name || 'there'}!
              </p>
              <p className="text-xs text-[#E2E8F0] leading-relaxed">
                Your request has been received under the <strong className="text-white capitalize">{selectedPath}</strong> track. We will get in touch directly to set up your access.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-medium text-emerald-400 underline hover:text-emerald-300"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] block">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B]/60 border border-white/10 text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu or name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B]/60 border border-white/10 text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE]/50"
                />
              </div>

              {(selectedPath === 'colleges' || selectedPath === 'together') && (
                <div className="space-y-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] block">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Engineering & Technology College"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B]/60 border border-white/10 text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE]/50"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] block">
                  Message / Context
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Target roles, batch size, or any specific questions..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B]/60 border border-white/10 text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE]/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#4361EE] hover:bg-[#3451db] text-white font-semibold text-sm transition-all active:scale-[0.98] mt-2 shadow-md"
              >
                {selectedPath === 'students'
                  ? 'Get Early Access →'
                  : selectedPath === 'colleges'
                  ? 'Request College Walkthrough →'
                  : 'Plan Rollout →'}
              </button>
            </form>
          )}
        </div>

        {/* Bottom Trust Note */}
        <div className="pt-6 border-t border-white/10 text-xs text-[#94A3B8] space-y-1">
          <p>• No spam. Direct contact regarding your access.</p>
          <p>• Founder contact: <a href="mailto:jasmanjotsinghsarna@gmail.com" className="text-white hover:underline">jasmanjotsinghsarna@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
