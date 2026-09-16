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
  Bot
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const { targetRoles, activeTargetRole, setTargetRole, studentProfile, setPersona } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedRoleId, setSelectedRoleId] = useState(activeTargetRole.id);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python', 'Data Structures', 'SQL', 'Git', 'REST APIs', 'FastAPI', 'React'
  ]);
  const [resumeUploaded, setResumeUploaded] = useState(true);
  const [analyzingStage, setAnalyzingStage] = useState(0);

  const availableSkills = [
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Data Structures',
    'SQL', 'PostgreSQL', 'System Design', 'React', 'Node.js', 'FastAPI',
    'Docker', 'AWS', 'Machine Learning', 'PyTorch', 'Git', 'Object-Oriented Design'
  ];

  const analysisSteps = [
    'Parsing resume and verifying credentials...',
    'Extracting technical and framework competencies...',
    'Mapping profile to Software Engineer (SDE-1) market rubrics...',
    'Benchmarking against 840+ placement candidates...',
    'Identifying critical skill gaps and roadmap priorities...',
    'CareerOS readiness profile assembled.'
  ];

  // Animated analysis effect on Step 4
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
                console.warn('Onboarding Supabase sync note:', e);
              }
              setPersona('student');
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
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
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
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto w-full relative z-10 space-y-8">
        {/* Step Indicator Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-2xl bg-white shadow-xl border border-slate-200">
              <Image
                src="/brand/careeros-logo.png"
                alt="CareerOS — From Student to Job-Ready"
                width={160}
                height={46}
                className="object-contain h-9 w-auto"
                priority
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111722] border border-[#202938] text-xs text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Calibration Wizard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {step === 1 && 'Step 1: Where do you want to go?'}
            {step === 2 && 'Step 2: Tell us where you are.'}
            {step === 3 && 'Step 3: Upload your resume.'}
            {step === 4 && 'CareerOS is analyzing your profile...'}
          </h2>
          <p className="text-xs text-slate-400">
            {step === 1 && 'Select your target engineering or analytics placement role.'}
            {step === 2 && 'Select the technologies and fundamentals you currently know.'}
            {step === 3 && 'Our AI parses projects, internships, and quantified achievements.'}
            {step === 4 && 'Constructing your neural readiness map and 4-week roadmap.'}
          </p>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-[#161e2e] rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Target Role Selection */}
        {step === 1 && (
          <div className="bg-[#111722] border border-[#202938] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {targetRoles.map((role) => {
                const isSelected = selectedRoleId === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={cn(
                      'p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2',
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/80 to-purple-950/50 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                        : 'bg-[#0d111a] border-[#202938] hover:border-slate-600'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-cyan-400">{role.category}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <h4 className="text-sm font-bold text-white">{role.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{role.description}</p>
                    <div className="text-[11px] font-mono text-slate-300 font-semibold pt-1">
                      {role.salaryRange}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Next: Select Current Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Skill Selection */}
        {step === 2 && (
          <div className="bg-[#111722] border border-[#202938] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="text-xs text-slate-400">
              Click to toggle the skills you are comfortable with. Don&apos;t worry about gaps—CareerOS will map them automatically.
            </div>

            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => {
                const isChecked = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    type="button"
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                      isChecked
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                        : 'bg-[#0d111a] border-[#202938] text-slate-400 hover:text-white'
                    )}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl bg-[#161e2e] text-slate-300 font-semibold text-xs border border-[#202938] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Upload Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Resume Upload */}
        {step === 3 && (
          <div className="bg-[#111722] border border-[#202938] rounded-2xl p-6 shadow-2xl space-y-5 text-center">
            <div className="border-2 border-dashed border-cyan-500/40 rounded-2xl p-8 bg-[#0d111a] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Jasmanjot_Singh_SDE1_Resume.pdf</h4>
                <p className="text-xs text-slate-400 mt-1">Preloaded sample resume (PDF, 240 KB)</p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Neural Parsing</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 rounded-xl bg-[#161e2e] text-slate-300 font-semibold text-xs border border-[#202938] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Cpu className="w-4 h-4" />
                <span>Trigger CareerOS AI Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Animated AI Analysis Sequence */}
        {step === 4 && (
          <div className="bg-[#111722] border border-cyan-500/40 rounded-2xl p-8 shadow-2xl space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Neural Evaluation in Progress</h3>
                <p className="text-xs text-cyan-400 font-mono">Calibrating against SDE-1 standards...</p>
              </div>
            </div>

            <div className="space-y-3">
              {analysisSteps.map((s, index) => {
                const isPassed = index < analyzingStage;
                const isCurrent = index === analyzingStage;

                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-3 text-xs transition-all duration-300',
                      isPassed ? 'text-slate-200' : isCurrent ? 'text-cyan-400 font-semibold' : 'text-slate-600'
                    )}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{s}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d111a] border border-[#202938] text-[11px] text-slate-400 text-center">
              Generating your personalized dashboard and readiness score...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
