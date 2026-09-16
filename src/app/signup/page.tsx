'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const { updateStudentProfile, setTargetRole, targetRoles, setPersona } = useApp();

  const [formData, setFormData] = useState({
    fullName: 'Jasmanjot Singh',
    email: 'jasmanjot.singh@jecrc.ac.in',
    password: 'password123',
    university: 'JECRC University',
    degree: 'B.Tech',
    branch: 'CSE (AI & Machine Learning)',
    graduationYear: 2026,
    targetRoleId: 'role-sde-1',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password.trim(),
          options: {
            data: {
              full_name: formData.fullName.trim(),
              role: 'student',
              university: formData.university.trim(),
              degree: formData.degree,
              branch: formData.branch.trim(),
              graduation_year: Number(formData.graduationYear),
              target_role_id: formData.targetRoleId,
            },
          },
        });

        if (error) {
          throw error;
        }

        // Set role cookie
        document.cookie = 'careeros_persona=student; path=/; max-age=86400';
      } else {
        document.cookie = 'careeros_demo_session=student; path=/; max-age=86400';
      }

      // Update in-memory profile and target role
      updateStudentProfile({
        fullName: formData.fullName,
        email: formData.email,
        university: formData.university,
        degree: formData.degree,
        branch: formData.branch,
        graduationYear: Number(formData.graduationYear),
        targetRoleId: formData.targetRoleId,
      });
      setTargetRole(formData.targetRoleId);
      setPersona('student');

      router.push('/onboarding');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center mb-5">
          <div className="px-4 py-2 rounded-2xl bg-white shadow-xl border border-slate-200 hover:scale-105 transition-transform">
            <Image
              src="/brand/careeros-logo.png"
              alt="CareerOS — From Student to Job-Ready"
              width={180}
              height={52}
              className="object-contain h-10 w-auto"
              priority
            />
          </div>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Student Account</h2>
        <p className="mt-1 text-xs text-slate-400">
          From Student to Job-Ready.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-[#111722] py-8 px-6 shadow-2xl border border-[#202938] sm:rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">University / College</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Degree</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="M.Tech">M.Tech / M.E.</option>
                  <option value="BCA">BCA / MCA</option>
                  <option value="B.Sc CS">B.Sc Computer Science</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Branch / Specialization</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Graduation Year</label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={2026}>2026 (Final Year)</option>
                  <option value={2027}>2027 (Pre-Final Year)</option>
                  <option value={2025}>2025 (Immediate Placement)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Target Job Role</label>
              <select
                value={formData.targetRoleId}
                onChange={(e) => setFormData({ ...formData, targetRoleId: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {targetRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Continue to AI Onboarding</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
