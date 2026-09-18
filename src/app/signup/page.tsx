'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  School, 
  MailCheck, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { soundFX } from '@/components/effects/SoundFX';

interface InstitutionMatch {
  id: string;
  name: string;
  domain: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { updateStudentProfile, setTargetRole, targetRoles, setPersona } = useApp();

  const [signupType, setSignupType] = useState<'student' | 'faculty'>('student');

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

  const [facultyData, setFacultyData] = useState({
    fullName: 'Dr. Ramesh Sharma',
    email: 'ramesh.sharma@jecrc.ac.in',
    password: 'password123',
    university: 'JECRC University',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department / Placement Director',
    facultyInviteCode: '',
  });

  const [verifiedInstitution, setVerifiedInstitution] = useState<InstitutionMatch | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainChecked, setDomainChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [awaitingVerificationEmail, setAwaitingVerificationEmail] = useState<string | null>(null);

  const lookupDomain = useCallback(async (emailToTest: string) => {
    if (!emailToTest || !emailToTest.includes('@')) {
      setVerifiedInstitution(null);
      setDomainChecked(false);
      return;
    }

    const domain = emailToTest.split('@')[1]?.trim().toLowerCase();
    if (!domain || !domain.includes('.')) {
      setVerifiedInstitution(null);
      setDomainChecked(false);
      return;
    }

    setIsCheckingDomain(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.rpc('lookup_institution_by_domain', {
          search_domain: domain,
        });

        if (!error && Array.isArray(data) && data.length > 0) {
          const matched = data[0] as InstitutionMatch;
          setVerifiedInstitution(matched);
          setFormData((prev) => ({ ...prev, university: matched.name }));
          setFacultyData((prev) => ({ ...prev, university: matched.name }));
        } else {
          setVerifiedInstitution(null);
        }
      } else {
        if (domain.includes('jecrc')) {
          setVerifiedInstitution({
            id: 'c0000000-0000-0000-0000-000000000003',
            name: 'JECRC University',
            domain: 'jecrc.ac.in',
          });
        }
      }
    } catch {
      setVerifiedInstitution(null);
    } finally {
      setIsCheckingDomain(false);
      setDomainChecked(true);
    }
  }, []);

  const currentEmail = signupType === 'student' ? formData.email : facultyData.email;

  useEffect(() => {
    const handler = setTimeout(() => {
      lookupDomain(currentEmail);
    }, 450);
    return () => clearTimeout(handler);
  }, [currentEmail, lookupDomain]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const email = signupType === 'student' ? formData.email.trim() : facultyData.email.trim();
        const password = signupType === 'student' ? formData.password : facultyData.password;
        const fullName = signupType === 'student' ? formData.fullName.trim() : facultyData.fullName.trim();
        const university = signupType === 'student' ? formData.university.trim() : facultyData.university.trim();

        const userMetadata = signupType === 'student' ? {
          full_name: fullName,
          role: 'student',
          university,
          degree: formData.degree,
          branch: formData.branch,
          graduation_year: formData.graduationYear,
          target_role_id: formData.targetRoleId,
        } : {
          full_name: fullName,
          role: 'faculty',
          university,
          department: facultyData.department,
          designation: facultyData.designation,
        };

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userMetadata,
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          },
        });

        if (error) throw error;

        if (data.session) {
          setPersona(signupType);
          document.cookie = `careeros_persona=${signupType}; path=/; max-age=86400`;
          soundFX.playSuccess();
          router.push('/onboarding');
        } else if (data.user && !data.session) {
          setAwaitingVerificationEmail(email);
        }
      } else {
        setPersona(signupType);
        document.cookie = `careeros_persona=${signupType}; path=/; max-age=86400`;
        soundFX.playSuccess();
        router.push('/onboarding');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-[#06090e] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-mono text-xl font-extrabold tracking-tight text-white">
            Career<span className="text-cyan-400">OS</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-white">
          Create your {signupType === 'student' ? 'Student' : 'Faculty'} Account
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Continuous telemetry between university and elite employment.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="p-6 sm:p-8 bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-2xl space-y-5">
          {/* Persona Switch */}
          <div className="flex p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setSignupType('student');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                signupType === 'student' ? 'bg-cyan-500/20 text-cyan-300 shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setSignupType('faculty');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                signupType === 'faculty' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-[var(--text-muted)]'
              }`}
            >
              Faculty Portal
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {verifiedInstitution && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Institution: <strong className="text-white">{verifiedInstitution.name}</strong></span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={signupType === 'student' ? formData.fullName : facultyData.fullName}
                onChange={(e) => {
                  if (signupType === 'student') setFormData({ ...formData, fullName: e.target.value });
                  else setFacultyData({ ...facultyData, fullName: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={signupType === 'student' ? formData.email : facultyData.email}
                onChange={(e) => {
                  if (signupType === 'student') setFormData({ ...formData, email: e.target.value });
                  else setFacultyData({ ...facultyData, email: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Password</label>
              <input
                type="password"
                required
                value={signupType === 'student' ? formData.password : facultyData.password}
                onChange={(e) => {
                  if (signupType === 'student') setFormData({ ...formData, password: e.target.value });
                  else setFacultyData({ ...facultyData, password: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {signupType === 'student' && (
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Target Placement Role</label>
                <select
                  value={formData.targetRoleId}
                  onChange={(e) => setFormData({ ...formData, targetRoleId: e.target.value })}
                  className="w-full p-2.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  {targetRoles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[var(--surface-primary)] text-white">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
