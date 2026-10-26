'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { soundFX } from '@/components/effects/SoundFX';
import CareerOSLogo from '@/components/brand/CareerOSLogo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const { setPersona } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
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
        soundFX.playSuccess();
        router.push(role === 'faculty' ? '/faculty/dashboard' : redirectTo);
      } else {
        throw new Error('Supabase authentication is not configured.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' = 'google') => {
    soundFX.playClick();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;
      } else {
        throw new Error('Supabase authentication is not configured.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OAuth authentication failed.';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-3">
        <CareerOSLogo href="/" size="md" imageClassName="h-9" />
        <h2 className="text-2xl font-black tracking-tight text-white">Sign in to your account</h2>
        <p className="text-xs text-[var(--text-muted)]">
          From University Student to High-Growth Job Ready.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-2xl space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
              Create student or faculty account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06090e]" />}>
      <LoginForm />
    </Suspense>
  );
}
