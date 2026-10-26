'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  FileCheck, 
  Send,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { FacultySidebar } from '@/components/navigation/FacultySidebar';
import { AIInsight } from '@/components/ai/AIInsight';
import { cn } from '@/lib/utils';

export default function FacultyStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const { facultyStudents, triggerIntervention } = useApp();

  const student = facultyStudents.find(s => s.id === studentId) || facultyStudents[0];

  const handleIntervene = () => {
    triggerIntervention(student.id, 'Mandatory 1-on-1 counseling booked with placement head.');
    alert(`Targeted intervention dispatched for ${student.name}! Remedial roadmap and mentor meeting notification sent.`);
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col">
      <TopNav />

      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        <FacultySidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Breadcrumb / Back */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/faculty/students" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student Cohort</span>
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{student.name}</span>
          </div>

          {/* Student Header Card */}
          <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-600/20">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-white">{student.name}</h1>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    student.status === 'Ready' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                    student.status === 'Developing' ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40' :
                    'bg-rose-950 text-rose-400 border-rose-500/40'
                  )}>
                    {student.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Roll No: <span className="font-mono text-slate-300">{student.rollNumber}</span> • {student.branch} ({student.degree})
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Target: <strong className="text-white">{student.targetRole}</strong></span>
                  <span>•</span>
                  <span>Days to Drive: <strong className="text-amber-400 font-mono">{student.daysToDrive}d</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleIntervene}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Mentor Intervention</span>
              </button>
            </div>
          </div>

          {/* AI Priority Recommendation */}
          <AIInsight
            title="CareerOS Placement Dean Recommendation"
            badge="Personalized Diagnostic"
            variant="violet"
          >
            {student.aiRecommendedAction}
          </AIInsight>

          {/* Readiness Score Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-[#111722] border border-purple-500/30">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Readiness</span>
              <span className="text-3xl font-black font-mono text-purple-400 mt-1 block">
                {student.overallReadiness}%
              </span>
              <span className="text-[10px] text-slate-500">Placement Benchmark</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111722] border border-[#202938]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Technical Score</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {student.technicalReadiness}%
              </span>
              <span className="text-[10px] text-slate-500">DSA & Frameworks</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111722] border border-[#202938]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Aptitude Score</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {student.aptitudeReadiness}%
              </span>
              <span className="text-[10px] text-slate-500">Quant & Reasoning</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111722] border border-[#202938]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Communication</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {student.communicationReadiness}%
              </span>
              <span className="text-[10px] text-slate-500">Pacing & Clarity</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111722] border border-[#202938]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Resume ATS Match</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {student.resumeAtsScore}%
              </span>
              <span className="text-[10px] text-slate-500">Keyword Qualified</span>
            </div>
          </div>

          {/* Deep-Dive Grid: Roadmap Progress + Identified Deficits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Roadmap Progress */}
            <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Roadmap Engagement</h3>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {student.roadmapProgress}% Complete
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track how actively the student is executing assigned weekly preparation sprints.
              </p>

              <div className="h-2 w-full bg-[#080b12] rounded-full overflow-hidden border border-[#202938]">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                  style={{ width: `${student.roadmapProgress}%` }}
                />
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Sprint Week 1: Core Database Mastery</span>
                  <span className="text-emerald-400 font-semibold">Completed ✓</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sprint Week 2: Hashmaps & Two-Pointer DSA</span>
                  <span className="text-cyan-400 font-semibold">In Progress →</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sprint Week 3: System Design Fundamentals</span>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Critical Deficits */}
            <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Key Deficits Requiring Counseling</h3>
                <span className="text-xs font-mono font-bold text-rose-400">Primary Gap</span>
              </div>
              <p className="text-xs text-slate-400">
                Main bottleneck identified by CareerOS AI for this candidate:
              </p>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                <span className="text-xs font-bold text-rose-300 block">{student.mainGap}</span>
                <p className="text-[11px] text-slate-300">
                  Recommended action: Schedule mandatory practice drill with department placement mentor before the drive in {student.daysToDrive} days.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Placement Cell Mentor: Prof. Anita Saxena</span>
                <span className="text-cyan-400 underline cursor-pointer">Notify Mentor</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
