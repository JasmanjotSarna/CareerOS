'use client';

import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { AIInsight } from '@/components/ai/AIInsight';
import { cn } from '@/lib/utils';

export default function ResumePage() {
  const { resumeData, updateResumeBullet, uploadResumeText, activeTargetRole } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customResumeText, setCustomResumeText] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCustomResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customResumeText.trim()) return;
    setIsUploading(true);
    await uploadResumeText(customResumeText);
    setIsUploading(false);
    setShowUploadModal(false);
    setCustomResumeText('');
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <StudentSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Recruitment Intelligence
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                ATS Resume Optimization
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Calibrated against applicant tracking system (ATS) filters for {activeTargetRole.title}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#161e2e] hover:bg-[#202938] border border-[#202938] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paste / Upload Resume Text</span>
              </button>

              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {resumeData.fileName}
              </span>
            </div>
          </div>

          {/* AI ATS Recommendation Callout */}
          <AIInsight
            title="CareerOS ATS Parser Feedback"
            badge="Scoring Calibrated"
            variant="cyan"
          >
            {resumeData.summaryFeedback}
          </AIInsight>

          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Resume Preview (6 cols) */}
            <div className="lg:col-span-6 bg-[#111722] border border-[#202938] rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#202938]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Parsed Document View</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Format: Clean Single-Column</span>
              </div>

              {/* Simulated Rendered Resume Content */}
              <div className="p-5 rounded-xl bg-[#080b12] border border-[#202938] text-xs space-y-4 text-slate-300 font-sans">
                {/* Header */}
                <div className="text-center pb-3 border-b border-[#202938]">
                  <h3 className="text-base font-bold text-white tracking-wide">JASMANJOT SINGH</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Jaipur, India • jasmanjot.singh@jecrc.ac.in • +91 98765 43210 • github.com/jasmanjot
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-cyan-400 block tracking-wider">EDUCATION</span>
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>JECRC University — B.Tech Computer Science (AI & ML)</span>
                    <span className="font-mono text-slate-400">2022 - 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-400">CGPA: 8.64 / 10.0 • Relevant Coursework: Data Structures, OS, DBMS</p>
                </div>

                {/* Technical Skills */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-cyan-400 block tracking-wider">TECHNICAL SKILLS</span>
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-white">Languages:</strong> Python, C++, SQL, JavaScript <br />
                    <strong className="text-white">Frameworks & Tools:</strong> FastAPI, React, Git, Docker, PostgreSQL
                  </p>
                </div>

                {/* Experience & Projects */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-bold text-cyan-400 block tracking-wider">PROJECTS & EXPERIENCE</span>
                  <div className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>Order Processing Microservice</span>
                      <span className="font-mono text-slate-400">FastAPI, PostgreSQL</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      • Architected RESTful API backend handling 1,200 requests/sec with PostgreSQL connection pooling.
                    </p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between font-semibold text-slate-200">
                      <span>Campus Placement Telemetry Model</span>
                      <span className="font-mono text-slate-400">PyTorch, Python</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      • Engineered recommendation model predicting student placement fit with 89% precision across 840 records.
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing Keywords Injection Pill Box */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    Missing Keywords Detected for SDE-1
                  </span>
                  <span className="text-[10px] text-slate-400">Add to bullet points</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {resumeData.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: ATS Score & AI Suggestions (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* ATS Score Overview Card */}
              <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Score</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black font-mono text-cyan-400">
                        {resumeData.atsScore}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    {resumeData.atsScore >= 80 ? 'ATS Highly Qualified' : 'Optimization Recommended'}
                  </span>
                </div>

                {/* Section Scores */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#0d111a] border border-[#202938]">
                    <span className="text-[10px] text-slate-400 block">Keyword Match</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">{resumeData.scores.keywordMatch}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d111a] border border-[#202938]">
                    <span className="text-[10px] text-slate-400 block">Impact Statements</span>
                    <span className="text-lg font-bold font-mono text-purple-400">{resumeData.scores.impactStatements}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d111a] border border-[#202938]">
                    <span className="text-[10px] text-slate-400 block">Formatting & Syntax</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{resumeData.scores.formatting}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d111a] border border-[#202938]">
                    <span className="text-[10px] text-slate-400 block">Role Alignment</span>
                    <span className="text-lg font-bold font-mono text-blue-400">{resumeData.scores.roleAlignment}%</span>
                  </div>
                </div>
              </div>

              {/* Suggested Bullet Improvements with Accept & Apply */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    AI Quantified Bullet Rewrites
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-semibold">
                    {resumeData.suggestedImprovements.length} available
                  </span>
                </div>

                {resumeData.suggestedImprovements.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#111722] border border-emerald-500/40 text-center space-y-2">
                    <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-sm">All Bullet Improvements Applied!</h4>
                    <p className="text-xs text-slate-400">
                      Your resume now features quantified metrics and high-priority SDE-1 keywords.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumeData.suggestedImprovements.map((imp) => (
                      <div
                        key={imp.id}
                        className="p-4 rounded-xl bg-[#111722] border border-[#202938] space-y-3 hover:border-cyan-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-cyan-400">{imp.section}</span>
                          <span className="text-[10px] text-slate-500">{imp.explanation}</span>
                        </div>

                        {/* Before */}
                        <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs">
                          <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Current Bullet:</span>
                          <p className="text-slate-300 italic">&quot;{imp.original}&quot;</p>
                        </div>

                        {/* After */}
                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">AI Optimized Rewrite:</span>
                          <p className="text-emerald-200 font-medium">&quot;{imp.improved}&quot;</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => copyToClipboard(imp.improved, imp.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#161e2e] hover:bg-[#202938] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedId === imp.id ? 'Copied!' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => updateResumeBullet(imp.id, true)}
                            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-600/30 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Apply & Boost Score (+4 pts)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Resume Upload / Paste Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#111722] border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between pb-2 border-b border-[#202938]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    Paste or Ingest Custom Resume Text
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Paste resume text to trigger full AI skill extraction, ATS keyword matching, and live suitability recalculation.
                </p>

                <form onSubmit={handleCustomResumeUpload} className="space-y-4">
                  <textarea
                    value={customResumeText}
                    onChange={(e) => setCustomResumeText(e.target.value)}
                    rows={8}
                    placeholder="Paste resume sections (Skills, Projects, Education, Work Experience)..."
                    className="w-full p-3.5 bg-[#080b12] border border-[#202938] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 rounded-xl bg-[#161e2e] text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-cyan-600/30"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Parsing & Benchmarking...</span>
                        </>
                      ) : (
                        <span>Ingest & Recalculate</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
