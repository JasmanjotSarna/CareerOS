-- ==============================================================================
-- CareerOS Phase 1: Production Multi-Tenant Schema, ALTERs, Backfills & RLS
-- Migration: 20260917000000_production_multitenant_schema.sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Multi-Tenancy Root: Institutions Table [NEW]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE, -- e.g. 'jecrc.ac.in'
  plan_tier TEXT NOT NULL DEFAULT 'standard' CHECK (plan_tier IN ('pilot', 'standard', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default institution for existing data
INSERT INTO public.institutions (id, name, domain, plan_tier)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Default University', 'default.edu', 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. Profiles Table [ALTER + BACKFILL]
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE RESTRICT DEFAULT 'a0000000-0000-0000-0000-000000000001';

-- Backfill existing profiles without an institution
UPDATE public.profiles 
SET institution_id = 'a0000000-0000-0000-0000-000000000001'
WHERE institution_id IS NULL;

-- Enforce NOT NULL constraint after backfill
ALTER TABLE public.profiles 
  ALTER COLUMN institution_id SET NOT NULL;

-- Update automatic user profile creation trigger to populate institution_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_institution_id UUID;
  v_email_domain TEXT;
BEGIN
  -- 1. Try to obtain institution_id from signup user metadata
  IF NEW.raw_user_meta_data->>'institution_id' IS NOT NULL THEN
    v_institution_id := (NEW.raw_user_meta_data->>'institution_id')::UUID;
  ELSE
    -- 2. Try to match institution by email domain
    v_email_domain := split_part(NEW.email, '@', 2);
    SELECT id INTO v_institution_id
    FROM public.institutions
    WHERE domain = v_email_domain
    LIMIT 1;

    -- 3. Fall back to default institution
    IF v_institution_id IS NULL THEN
      v_institution_id := 'a0000000-0000-0000-0000-000000000001'::UUID;
    END IF;
  END IF;

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
    target_role_id,
    institution_id
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
    COALESCE(NEW.raw_user_meta_data->>'target_role_id', 'role-sde-1'),
    v_institution_id
  )
  ON CONFLICT (id) DO UPDATE SET
    institution_id = COALESCE(public.profiles.institution_id, EXCLUDED.institution_id);
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. Dedicated Students Table [NEW]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  department TEXT NOT NULL DEFAULT 'CSE',
  academic_tier TEXT DEFAULT 'Tier-1',
  target_role_id TEXT REFERENCES public.target_roles(id) ON DELETE SET NULL,
  graduation_year INTEGER DEFAULT 2026,
  roll_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill: migrate existing student profiles into the dedicated students table
INSERT INTO public.students (profile_id, institution_id, department, graduation_year, target_role_id)
SELECT id, institution_id, COALESCE(branch, 'CSE'), COALESCE(graduation_year, 2026), target_role_id
FROM public.profiles
WHERE role = 'student'
ON CONFLICT (profile_id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Target Roles [ALTER + BACKFILL]
-- ------------------------------------------------------------------------------
ALTER TABLE public.target_roles 
  ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_global BOOLEAN NOT NULL DEFAULT TRUE;

-- Backfill: mark all existing seeded target roles as global templates
UPDATE public.target_roles 
SET is_global = TRUE, institution_id = NULL
WHERE is_global IS NULL;

-- ------------------------------------------------------------------------------
-- 5. Canonical Skills Catalog [NEW]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Student Skills [ALTER + BACKFILL]
-- ------------------------------------------------------------------------------
ALTER TABLE public.student_skills 
  ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(profile_id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL;

-- Backfill: map student_id from profile_id
UPDATE public.student_skills 
SET student_id = profile_id 
WHERE student_id IS NULL;

-- ------------------------------------------------------------------------------
-- 7. Resumes Table [NEW]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(profile_id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  parsed_text TEXT,
  ats_score INTEGER,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Roadmap Milestones [NEW]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(profile_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill: migrate existing roadmap_tasks into roadmap_milestones
INSERT INTO public.roadmap_milestones (student_id, title, status, completed_at, created_at)
SELECT 
  s.profile_id,
  t.title,
  t.status,
  t.completed_at,
  t.created_at
FROM public.roadmap_tasks t
JOIN public.students s ON s.profile_id = t.profile_id
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 9. Interview Sessions [NEW with Media Paths]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(profile_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('technical', 'hr', 'communication')),
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  audio_url TEXT,
  video_url TEXT,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill: migrate legacy technical_evaluations into unified interview_sessions
INSERT INTO public.interview_sessions (id, student_id, type, transcript, scores, ai_feedback, created_at)
SELECT 
  te.id,
  s.profile_id,
  'technical',
  jsonb_build_array(
    jsonb_build_object('role', 'interviewer', 'text', te.problem_title),
    jsonb_build_object('role', 'candidate', 'text', te.code_submission)
  ),
  jsonb_build_object(
    'overall', te.overall_score,
    'correctness', te.correctness_score,
    'problem_solving', te.problem_solving_score,
    'communication', te.communication_score,
    'time_management', te.time_management_score
  ),
  te.ai_assessment,
  te.timestamp
FROM public.technical_evaluations te
JOIN public.students s ON s.profile_id = te.profile_id
ON CONFLICT (id) DO NOTHING;

-- Backfill: migrate legacy hr_evaluations into unified interview_sessions
INSERT INTO public.interview_sessions (id, student_id, type, transcript, scores, ai_feedback, created_at)
SELECT 
  he.id,
  s.profile_id,
  'hr',
  jsonb_build_array(
    jsonb_build_object('role', 'interviewer', 'text', he.question_text),
    jsonb_build_object('role', 'candidate', 'text', he.transcript)
  ),
  jsonb_build_object(
    'overall', he.overall_score,
    'communication', he.communication_score,
    'confidence', he.confidence_score,
    'structure', he.structure_score,
    'culture_fit', he.culture_fit_score,
    'star_analysis', he.star_analysis
  ),
  he.feedback,
  he.timestamp
FROM public.hr_evaluations he
JOIN public.students s ON s.profile_id = he.profile_id
ON CONFLICT (id) DO NOTHING;

-- Backfill: migrate legacy communication_metrics into unified interview_sessions
INSERT INTO public.interview_sessions (id, student_id, type, transcript, scores, ai_feedback, created_at)
SELECT 
  cm.id,
  s.profile_id,
  'communication',
  CASE 
    WHEN cm.transcript IS NOT NULL AND length(cm.transcript) > 0 
    THEN jsonb_build_array(jsonb_build_object('role', 'candidate', 'text', cm.transcript))
    ELSE '[]'::jsonb 
  END,
  jsonb_build_object(
    'clarity', cm.clarity_score,
    'pacing', cm.pacing_score,
    'eye_contact', cm.eye_contact_score,
    'words_per_minute', cm.words_per_minute,
    'filler_words', cm.filler_words_detected
  ),
  cm.feedback,
  cm.timestamp
FROM public.communication_metrics cm
JOIN public.students s ON s.profile_id = cm.profile_id
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 10. Readiness Scores [ALTER + BACKFILL]
-- ------------------------------------------------------------------------------
ALTER TABLE public.readiness_scores 
  ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(profile_id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS composite NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS computed_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill readiness scores
UPDATE public.readiness_scores 
SET 
  student_id = profile_id,
  composite = overall,
  computed_at = timestamp
WHERE student_id IS NULL;

-- ------------------------------------------------------------------------------
-- 11. Faculty Interventions [NEW]
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(profile_id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. Storage Buckets (Private)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('resumes', 'resumes', false),
  ('interview-recordings', 'interview-recordings', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- ------------------------------------------------------------------------------
-- 13. Security Definer Helper Functions (search_path explicitly pinned)
-- ------------------------------------------------------------------------------

-- Helper function to return caller's institution ID
CREATE OR REPLACE FUNCTION public.get_user_institution_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT institution_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper function to check if caller is faculty/admin in a target institution
CREATE OR REPLACE FUNCTION public.is_faculty_in_institution(target_inst_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('faculty', 'admin')
      AND institution_id = target_inst_id
  );
$$;

-- ------------------------------------------------------------------------------
-- 14. Exact-Match Institution Domain Lookup Function & Privileges
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.lookup_institution_by_domain(search_domain TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  domain TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT id, name, domain
  FROM public.institutions
  WHERE domain = LOWER(TRIM(search_domain))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_institution_by_domain(TEXT) TO anon, authenticated;

-- Revoke direct table select on public.institutions from anon entirely
REVOKE ALL ON public.institutions FROM anon;
GRANT SELECT ON public.institutions TO authenticated;

-- ------------------------------------------------------------------------------
-- 15. Enable Row Level Security (RLS) on All Tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_interventions ENABLE ROW LEVEL SECURITY;

-- Drop all legacy policies from initial migration across all tables
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "target_roles_read_policy" ON public.target_roles;
DROP POLICY IF EXISTS "student_skills_select" ON public.student_skills;
DROP POLICY IF EXISTS "student_skills_all_own" ON public.student_skills;
DROP POLICY IF EXISTS "readiness_scores_select" ON public.readiness_scores;
DROP POLICY IF EXISTS "readiness_scores_insert_own" ON public.readiness_scores;
DROP POLICY IF EXISTS "roadmap_tasks_select" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "roadmap_tasks_all_own" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "technical_evaluations_select" ON public.technical_evaluations;
DROP POLICY IF EXISTS "technical_evaluations_insert_own" ON public.technical_evaluations;
DROP POLICY IF EXISTS "hr_evaluations_select" ON public.hr_evaluations;
DROP POLICY IF EXISTS "hr_evaluations_insert_own" ON public.hr_evaluations;
DROP POLICY IF EXISTS "communication_metrics_select" ON public.communication_metrics;
DROP POLICY IF EXISTS "communication_metrics_insert_own" ON public.communication_metrics;
DROP POLICY IF EXISTS "aptitude_sessions_select" ON public.aptitude_sessions;
DROP POLICY IF EXISTS "aptitude_sessions_insert_own" ON public.aptitude_sessions;
DROP POLICY IF EXISTS "career_events_select" ON public.career_events;
DROP POLICY IF EXISTS "career_events_insert_own" ON public.career_events;

-- Drop legacy un-scoped helper function from initial migration
DROP FUNCTION IF EXISTS public.is_faculty_or_admin();

-- ------------------------------------------------------------------------------
-- 16. Comprehensive Multi-Tenant RLS Policies
-- ------------------------------------------------------------------------------

-- === Table: institutions ===
-- Authenticated users read full record for their own institution
CREATE POLICY "institutions_authenticated_member_select" ON public.institutions
  FOR SELECT TO authenticated
  USING (id = public.get_user_institution_id());

-- === Table: profiles ===
-- Self select own profile
CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Same-institution faculty can select student/faculty profiles
CREATE POLICY "profiles_faculty_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_faculty_in_institution(institution_id));

-- Self insert own profile on signup
CREATE POLICY "profiles_self_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Self update own profile
CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- === Table: target_roles ===
-- Global roles readable by all; Institution custom roles readable only by that institution
CREATE POLICY "target_roles_select_policy" ON public.target_roles
  FOR SELECT TO authenticated
  USING (
    is_global = TRUE OR institution_id = public.get_user_institution_id()
  );

CREATE POLICY "target_roles_modify_faculty" ON public.target_roles
  FOR ALL TO authenticated
  USING (
    public.is_faculty_in_institution(institution_id)
  )
  WITH CHECK (
    public.is_faculty_in_institution(institution_id)
  );

-- === Table: skills ===
-- Canonical skill catalog: readable by all authenticated users
CREATE POLICY "skills_authenticated_select" ON public.skills
  FOR SELECT TO authenticated
  USING (true);

-- === Table: students ===
-- Student reads own record; Faculty reads students within their institution
CREATE POLICY "students_select_policy" ON public.students
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid() 
    OR public.is_faculty_in_institution(institution_id)
  );

-- Student can create their own student record on signup
CREATE POLICY "students_insert_own" ON public.students
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Student can update their own student record
CREATE POLICY "students_update_own" ON public.students
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- === Table: student_skills ===
-- Student owns all operations on their skill records
CREATE POLICY "student_skills_student_all" ON public.student_skills
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Same-institution faculty can read student skills
CREATE POLICY "student_skills_faculty_select" ON public.student_skills
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = student_skills.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: resumes ===
-- Student owns their resume records
CREATE POLICY "resumes_student_all" ON public.resumes
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Same-institution faculty can view student resumes
CREATE POLICY "resumes_faculty_select" ON public.resumes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = resumes.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: roadmap_milestones ===
-- Student owns all operations on their roadmap milestones
CREATE POLICY "roadmap_milestones_student_all" ON public.roadmap_milestones
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Same-institution faculty can view roadmap milestones
CREATE POLICY "roadmap_milestones_faculty_select" ON public.roadmap_milestones
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = roadmap_milestones.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: interview_sessions ===
-- Student can SELECT, INSERT, UPDATE their own sessions. NO DELETE.
CREATE POLICY "interview_sessions_student_select" ON public.interview_sessions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "interview_sessions_student_insert" ON public.interview_sessions
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "interview_sessions_student_update" ON public.interview_sessions
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Same-institution faculty can view interview sessions
CREATE POLICY "interview_sessions_faculty_select" ON public.interview_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = interview_sessions.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: readiness_scores ===
-- Student owns their readiness score records
CREATE POLICY "readiness_scores_student_all" ON public.readiness_scores
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Same-institution faculty can view student readiness scores
CREATE POLICY "readiness_scores_faculty_select" ON public.readiness_scores
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = readiness_scores.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: faculty_interventions ===
-- Student can view interventions assigned to them
CREATE POLICY "interventions_student_select" ON public.faculty_interventions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Faculty can manage their own interventions for students within their institution
-- Strictly requires faculty_id = auth.uid() in both USING and WITH CHECK to prevent impersonation
CREATE POLICY "interventions_faculty_all" ON public.faculty_interventions
  FOR ALL TO authenticated
  USING (
    faculty_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = faculty_interventions.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  )
  WITH CHECK (
    faculty_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = faculty_interventions.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- Same-institution faculty can read all interventions for students in their institution
CREATE POLICY "interventions_faculty_institution_select" ON public.faculty_interventions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = faculty_interventions.student_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: aptitude_sessions ===
CREATE POLICY "aptitude_sessions_student_all" ON public.aptitude_sessions
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "aptitude_sessions_faculty_select" ON public.aptitude_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = aptitude_sessions.profile_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Table: career_events ===
CREATE POLICY "career_events_student_all" ON public.career_events
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "career_events_faculty_select" ON public.career_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = career_events.profile_id
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- === Legacy Tables Lockdown (Migrated to roadmap_milestones & interview_sessions) ===
CREATE POLICY "roadmap_tasks_self_all" ON public.roadmap_tasks
  FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "technical_evaluations_self_all" ON public.technical_evaluations
  FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "hr_evaluations_self_all" ON public.hr_evaluations
  FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "communication_metrics_self_all" ON public.communication_metrics
  FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 17. Storage Object Policies (resumes & interview-recordings)
-- Folder convention: {student_id}/{filename}
-- ------------------------------------------------------------------------------

-- Resumes: Student upload own
CREATE POLICY "students_upload_own_resume" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'resumes' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Resumes: Student read own
CREATE POLICY "students_read_own_resume" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'resumes' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Resumes: Student update own (for re-upload / overwrite)
CREATE POLICY "students_update_own_resume" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'resumes' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'resumes' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Resumes: Faculty read same-institution student resumes
CREATE POLICY "faculty_read_resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'resumes' 
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id::text = (storage.foldername(name))[1]
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

-- Interview Recordings: Student upload own
CREATE POLICY "students_upload_own_interview_recording" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'interview-recordings' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Interview Recordings: Student read own
CREATE POLICY "students_read_own_interview_recording" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'interview-recordings' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Interview Recordings: Student update own
CREATE POLICY "students_update_own_interview_recording" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'interview-recordings' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'interview-recordings' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Interview Recordings: Faculty read same-institution student recordings
CREATE POLICY "faculty_read_interview_recordings" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'interview-recordings' 
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id::text = (storage.foldername(name))[1]
        AND public.is_faculty_in_institution(s.institution_id)
    )
  );

