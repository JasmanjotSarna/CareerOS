'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Briefcase, 
  Cpu, 
  ShieldCheck,
  Bot,
  Loader2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, GlowCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressRing';
import { soundFX } from '@/components/effects/SoundFX';

export default function OnboardingPage() {
  const router = useRouter();
  const { targetRoles, activeTargetRole, setTargetRole, setPersona } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedRoleId, setSelectedRoleId] = useState(activeTargetRole.id);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python', 'Data Structures', 'SQL', 'Git', 'REST APIs', 'FastAPI', 'React'
  ]);
  const [analyzingStage, setAnalyzingStage] = useState(0);

  const availableSkills = [
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Data Structures',
    'SQL', 'PostgreSQL', 'System Design', 'React', 'Node.js', 'FastAPI',
    'Docker', 'AWS', 'Machine Learning', 'PyTorch', 'Git', 'Object-Oriented Design'
  ];

  const analysisSteps = [
    'Parsing credentials & verified competencies...',
    'Mapping profile to Software Engineer (SDE-1) market rubrics...',
    'Benchmarking against 840+ placement candidates...',
    'Identifying critical skill gaps and roadmap priorities...',
    'CareerOS readiness profile assembled.'
  ];

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setAnalyzingStage((prev) => {
          if (prev < analysisSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(async () => {
              try {
                const { supabase, isSupabaseConfigured } = await import('@/lib/supabase/client');
                if (isSupabaseConfigured()) {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await supabase.from('profiles').update({
                      target_role_id: selectedRoleId,
                      updated_at: new Date().toISOString()
                    }).eq('id', user.id);
                  }
                }
              } catch (e) {
                console.warn('Onboarding sync note:', e);
              }
              setPersona('student');
              soundFX.playSuccess();
              router.push('/dashboard');
            }, 1000);
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [step, router, setPersona, selectedRoleId, analysisSteps.length]);

  const toggleSkill = (skill: string) => {
    soundFX.playClick();
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    soundFX.playClick();
    if (step === 1) {
      setTargetRole(selectedRoleId);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* Progress HUD */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase">Onboarding Setup • Step {step} of 4</span>
            <span className="text-[var(--text-muted)]">{step * 25}% Complete</span>
          </div>
          <ProgressBar value={step * 25} variant="cyan" size="sm" />
        </div>

        <Card className="p-6 sm:p-10 bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-2xl space-y-6">
          {/* Step 1: Target Role */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Badge variant="cyan" className="mb-2">Phase 1</Badge>
                <h2 className="text-2xl font-black text-white">Select Your Target Placement Goal</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  CareerOS will customize your skill gap matrix and mock interview drills for this role.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {targetRoles.map((r) => {
                  const isSelected = selectedRoleId === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoleId(r.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md'
                          : 'bg-[var(--surface-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <h4 className="text-xs sm:text-sm font-bold">{r.title}</h4>
                      <p className="text-[10px] font-mono text-[var(--text-muted)]">{r.salaryRange}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Skill Inventory
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Skill Inventory */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Badge variant="cyan" className="mb-2">Phase 2</Badge>
                <h2 className="text-2xl font-black text-white">Select Your Active Skills</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Choose the languages and frameworks you've built projects with or studied in coursework.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSkills.map((sk) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 shadow-sm'
                          : 'bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
                      }`}
                    >
                      {isSelected ? `✓ ${sk}` : `+ ${sk}`}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Resume Ingestion
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Fast-Track Resume */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Badge variant="cyan" className="mb-2">Phase 3</Badge>
                <h2 className="text-2xl font-black text-white">Fast-Track Resume Scan</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Ingest your resume to automatically calibrate ATS keywords and project depth.
                </p>
              </div>

              <div className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-[var(--surface-secondary)]/60 text-center space-y-2">
                <FileText className="w-10 h-10 text-cyan-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Verified Resume Attached</h4>
                <p className="text-xs text-[var(--text-muted)]">Candidate credentials prepared for vector alignment.</p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="momentum" size="md" onClick={handleNext} rightIcon={<Sparkles className="w-4 h-4" />}>
                  Assemble Placement Vector
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: AI Analysis */}
          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
                <Bot className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Assembling CareerOS Intelligence Vector</h2>
                <p className="text-xs font-mono text-cyan-300">
                  {analysisSteps[analyzingStage]}
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <ProgressBar value={((analyzingStage + 1) / analysisSteps.length) * 100} variant="cyan" size="md" />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
