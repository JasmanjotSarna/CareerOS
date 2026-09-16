'use client';

import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Building, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Sliders, 
  CheckCircle2, 
  Briefcase,
  Save
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';

export default function ProfilePage() {
  const { studentProfile, updateStudentProfile, activeTargetRole, targetRoles, setTargetRole, readinessScores } = useApp();

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: studentProfile.fullName,
    email: studentProfile.email,
    university: studentProfile.university,
    branch: studentProfile.branch,
    cgpa: studentProfile.cgpa,
    graduationYear: studentProfile.graduationYear,
    linkedinUrl: studentProfile.linkedinUrl || '',
    githubUrl: studentProfile.githubUrl || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
                Academic & Career Credentials
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Student Profile & Placement Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage your credentials, target role alignment, and university placement sync status.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>JECRC Placement Cell Sync Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Profile Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#111722] border border-[#202938] rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#202938]">
                <h3 className="text-base font-bold text-white">Student Information</h3>
                {saved && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved Successfully!
                  </span>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">University</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Branch / Major</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Current CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Graduation Batch</label>
                    <input
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Target Role</label>
                  <select
                    value={activeTargetRole.id}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {targetRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Readiness Weights & Verified Skills (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Central Readiness Weight Config */}
              <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Readiness Engine Weight Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Centralized mathematical model calibrating your score (100% total).
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs">
                  {[
                    { label: 'Technical Problem Solving', weight: '35%', color: 'bg-cyan-400', value: readinessScores.technical },
                    { label: 'Aptitude & Logic', weight: '20%', color: 'bg-blue-400', value: readinessScores.aptitude },
                    { label: 'Communication Pacing', weight: '15%', color: 'bg-purple-400', value: readinessScores.communication },
                    { label: 'HR & Behavioral Framing', weight: '15%', color: 'bg-indigo-400', value: readinessScores.hr },
                    { label: 'Technical Interview Simulation', weight: '15%', color: 'bg-emerald-400', value: readinessScores.interview },
                  ].map((w) => (
                    <div key={w.label} className="p-2.5 rounded-xl bg-[#0d111a] border border-[#202938] flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">{w.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Current: {w.value}%</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                        {w.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Competencies */}
              <div className="p-6 rounded-2xl bg-[#111722] border border-[#202938] space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Verified Placement Skills</h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {studentProfile.skills.filter(s => s.verified).length} verified
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {studentProfile.skills.map((s) => (
                    <span
                      key={s.name}
                      className="px-2.5 py-1 rounded-lg bg-[#0d111a] border border-[#202938] text-xs text-slate-300 font-mono"
                    >
                      {s.name} ({s.currentProficiency}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
