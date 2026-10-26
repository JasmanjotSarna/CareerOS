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
  Save,
  Link2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { Card, GlowCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { soundFX } from '@/components/effects/SoundFX';

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
    soundFX.playSuccess();
    updateStudentProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="min-w-0 flex-1 py-8 md:px-8 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ACADEMIC & CANDIDATE CREDENTIALS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Profile & Placement Settings
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Manage your credentials, target role alignment, and verified university sync status.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Placement Cell Sync Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Left (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-white">Student Information</h3>
                  {saved && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved Successfully!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)]/50 border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-dim)] focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">University</label>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Branch</label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">CGPA</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Target Role & Sync Status (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 bg-[var(--surface-primary)] border border-[var(--border-default)] space-y-4">
                <h3 className="text-sm font-bold text-white">Active Placement Target</h3>
                <p className="text-xs text-[var(--text-muted)]">Calibrate all mock interviews and roadmap milestones against your goal.</p>

                <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-cyan-500/30 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Current Target</span>
                  <h4 className="text-base font-bold text-white">{activeTargetRole.title}</h4>
                  <p className="text-xs font-mono text-[var(--text-dim)]">{activeTargetRole.salaryRange}</p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
