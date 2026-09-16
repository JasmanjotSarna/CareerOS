const fs = require('fs');
const path = require('path');

// Extract TARGET_ROLES from mockData.ts
const mockDataContent = fs.readFileSync(path.join(__dirname, '../src/lib/data/mockData.ts'), 'utf8');

// Parse TARGET_ROLES block
const startIdx = mockDataContent.indexOf('export const TARGET_ROLES: TargetRole[] = [');
const endIdx = mockDataContent.indexOf('export const TECHNICAL_QUESTIONS');
const rolesBlock = mockDataContent.slice(startIdx + 'export const TARGET_ROLES: TargetRole[] = '.length, endIdx).trim().replace(/;\s*$/, '');

let targetRoles;
try {
  // Simple eval with JS object syntax
  targetRoles = eval(rolesBlock);
} catch (e) {
  console.error('Error evaluating roles block:', e);
  process.exit(1);
}

console.log(`Parsed ${targetRoles.length} target roles.`);

const escapeSqlString = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const escapeJsonb = (obj) => {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
};

const migrationSql = `-- CareerOS Supabase Initial Schema Migration
-- Matches src/types/index.ts domain objects field-for-field
-- Includes RLS policies, Faculty access, and Auth triggers

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT DEFAULT 'JECRC University',
  degree TEXT DEFAULT 'B.Tech Computer Science & Engineering',
  branch TEXT DEFAULT 'CSE',
  graduation_year INTEGER DEFAULT 2026,
  cgpa NUMERIC(4, 2) DEFAULT 8.50,
  target_role_id TEXT DEFAULT 'role-sde-1',
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Target Roles Table (Catalog of career roles & required skill benchmarks)
CREATE TABLE IF NOT EXISTS public.target_roles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  salary_range TEXT,
  market_demand TEXT,
  experience_level TEXT,
  education_expectations TEXT,
  experience_expectations TEXT,
  soft_skills JSONB DEFAULT '[]'::jsonb,
  interview_areas JSONB DEFAULT '[]'::jsonb,
  aptitude_areas JSONB DEFAULT '[]'::jsonb,
  communication_expectations TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Student Skills Table
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_proficiency INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by TEXT,
  last_assessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, name)
);

-- 5. Roadmap Tasks Table
CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
  id TEXT PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  action_type TEXT DEFAULT 'practice',
  estimated_minutes INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'Intermediate',
  priority TEXT DEFAULT 'High',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Technical Interview Evaluations Table
CREATE TABLE IF NOT EXISTS public.technical_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  code_submission TEXT NOT NULL,
  language TEXT NOT NULL,
  correctness_score INTEGER NOT NULL,
  problem_solving_score INTEGER NOT NULL,
  communication_score INTEGER NOT NULL,
  time_management_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  strengths JSONB DEFAULT '[]'::jsonb,
  areas_to_improve JSONB DEFAULT '[]'::jsonb,
  ai_assessment TEXT,
  next_best_action TEXT,
  duration_seconds INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. HR Interview Evaluations Table
CREATE TABLE IF NOT EXISTS public.hr_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  transcript TEXT NOT NULL,
  star_analysis JSONB DEFAULT '{}'::jsonb,
  communication_score INTEGER NOT NULL,
  confidence_score INTEGER NOT NULL,
  structure_score INTEGER NOT NULL,
  culture_fit_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  feedback TEXT,
  recommended_improvement TEXT,
  duration_seconds INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Communication Metrics Table
CREATE TABLE IF NOT EXISTS public.communication_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration_seconds INTEGER NOT NULL,
  words_per_minute INTEGER NOT NULL,
  filler_words_detected JSONB DEFAULT '[]'::jsonb,
  clarity_score INTEGER NOT NULL,
  pacing_score INTEGER NOT NULL,
  eye_contact_score INTEGER NOT NULL,
  transcript TEXT,
  feedback TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Aptitude Assessment Sessions Table
CREATE TABLE IF NOT EXISTS public.aptitude_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  category_scores JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Career Events Log Table
CREATE TABLE IF NOT EXISTS public.career_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Readiness Scores Table (Historical Tracking)
CREATE TABLE IF NOT EXISTS public.readiness_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall INTEGER NOT NULL,
  technical INTEGER NOT NULL,
  aptitude INTEGER NOT NULL,
  communication INTEGER NOT NULL,
  hr INTEGER NOT NULL,
  interview INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Helper Function to Check Faculty or Admin Privileges
CREATE OR REPLACE FUNCTION public.is_faculty_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('faculty', 'admin')
  );
$$;

-- 13. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_scores ENABLE ROW LEVEL SECURITY;

-- 14. Define RLS Policies

-- target_roles: Anyone authenticated or anonymous can read target roles
CREATE POLICY "target_roles_read_policy" ON public.target_roles
  FOR SELECT USING (true);

-- profiles:
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_faculty_or_admin());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_faculty_or_admin());

-- student_skills:
CREATE POLICY "student_skills_select" ON public.student_skills
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "student_skills_all_own" ON public.student_skills
  FOR ALL USING (auth.uid() = profile_id);

-- roadmap_tasks:
CREATE POLICY "roadmap_tasks_select" ON public.roadmap_tasks
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "roadmap_tasks_all_own" ON public.roadmap_tasks
  FOR ALL USING (auth.uid() = profile_id);

-- technical_evaluations:
CREATE POLICY "technical_evaluations_select" ON public.technical_evaluations
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "technical_evaluations_insert_own" ON public.technical_evaluations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- hr_evaluations:
CREATE POLICY "hr_evaluations_select" ON public.hr_evaluations
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "hr_evaluations_insert_own" ON public.hr_evaluations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- communication_metrics:
CREATE POLICY "communication_metrics_select" ON public.communication_metrics
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "communication_metrics_insert_own" ON public.communication_metrics
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- aptitude_sessions:
CREATE POLICY "aptitude_sessions_select" ON public.aptitude_sessions
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "aptitude_sessions_insert_own" ON public.aptitude_sessions
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- career_events:
CREATE POLICY "career_events_select" ON public.career_events
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "career_events_insert_own" ON public.career_events
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- readiness_scores:
CREATE POLICY "readiness_scores_select" ON public.readiness_scores
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "readiness_scores_insert_own" ON public.readiness_scores
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 15. Automatic User Profile Creation Trigger on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    university,
    degree,
    branch,
    graduation_year,
    cgpa,
    target_role_id
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'university', 'JECRC University'),
    COALESCE(NEW.raw_user_meta_data->>'degree', 'B.Tech Computer Science & Engineering'),
    COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE'),
    COALESCE((NEW.raw_user_meta_data->>'graduation_year')::INTEGER, 2026),
    COALESCE((NEW.raw_user_meta_data->>'cgpa')::NUMERIC, 8.50),
    COALESCE(NEW.raw_user_meta_data->>'target_role_id', 'role-sde-1')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Seed Data for Target Roles (Extracted from mockData.ts)
INSERT INTO public.target_roles (
  id, title, category, description, salary_range, market_demand, experience_level,
  education_expectations, experience_expectations, soft_skills, interview_areas,
  aptitude_areas, communication_expectations, required_skills
) VALUES
${targetRoles.map(role => `(
  ${escapeSqlString(role.id)},
  ${escapeSqlString(role.title)},
  ${escapeSqlString(role.category)},
  ${escapeSqlString(role.description)},
  ${escapeSqlString(role.salaryRange)},
  ${escapeSqlString(role.marketDemand)},
  ${escapeSqlString(role.experienceLevel)},
  ${escapeSqlString(role.educationExpectations)},
  ${escapeSqlString(role.experienceExpectations)},
  ${escapeJsonb(role.softSkills)},
  ${escapeJsonb(role.interviewAreas)},
  ${escapeJsonb(role.aptitudeAreas)},
  ${escapeSqlString(role.communicationExpectations)},
  ${escapeJsonb(role.requiredSkills)}
)`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  salary_range = EXCLUDED.salary_range,
  market_demand = EXCLUDED.market_demand,
  experience_level = EXCLUDED.experience_level,
  education_expectations = EXCLUDED.education_expectations,
  experience_expectations = EXCLUDED.experience_expectations,
  soft_skills = EXCLUDED.soft_skills,
  interview_areas = EXCLUDED.interview_areas,
  aptitude_areas = EXCLUDED.aptitude_areas,
  communication_expectations = EXCLUDED.communication_expectations,
  required_skills = EXCLUDED.required_skills;
`;

const outputDir = path.join(__dirname, '../supabase/migrations');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, '20260916000000_careeros_initial_schema.sql');
fs.writeFileSync(outputPath, migrationSql, 'utf8');
console.log(`Successfully written initial schema and target_roles seed to ${outputPath}`);
