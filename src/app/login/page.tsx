'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Building2, ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const { setPersona } = useApp();

  const [email, setEmail] = useState('jasmanjot.singh@jecrc.ac.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStudentDemoLogin = () => {
    document.cookie = 'careeros_demo_session=student; path=/; max-age=86400';
    document.cookie = 'careeros_persona=student; path=/; max-age=86400';
    setPersona('student');
    router.push('/dashboard');
  };

  const handleFacultyDemoLogin = () => {
    document.cookie = 'careeros_demo_session=faculty; path=/; max-age=86400';
    document.cookie = 'careeros_persona=faculty; path=/; max-age=86400';
    setPersona('faculty');
    router.push('/faculty/dashboard');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          throw error;
        }

        const role = data.user?.user_metadata?.role || 'student';
        setPersona(role === 'faculty' ? 'faculty' : 'student');
        document.cookie = `careeros_persona=${role}; path=/; max-age=86400`;
        router.push(role === 'faculty' ? '/faculty/dashboard' : redirectTo);
      } else {
        // Fallback demo mode when Supabase credentials are not yet configured
        document.cookie = 'careeros_demo_session=student; path=/; max-age=86400';
        setPersona('student');
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center mb-6">
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
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-400">
          From Student to Job-Ready.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#111722] py-8 px-4 shadow-2xl border border-[#202938] sm:rounded-2xl sm:px-10 space-y-6">
          {/* Quick 1-Click Demo Logins */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Instant 1-Click Demo Access
            </span>
            <button
              onClick={handleStudentDemoLogin}
              type="button"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-500/40 text-cyan-200 hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Student Demo (Jasmanjot)</span>
                  <span className="text-[10px] text-slate-400 block">SDE-1 Target • 72% Readiness</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleFacultyDemoLogin}
              type="button"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-500/40 text-purple-200 hover:border-purple-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Faculty Placement Demo</span>
                  <span className="text-[10px] text-slate-400 block">842 Cohort • 113 Interventions</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#202938]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111722] px-2 text-slate-500 font-mono text-[10px]">Or continue with email</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080B12] flex items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-500 mr-2" />
        <span>Loading session...</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
