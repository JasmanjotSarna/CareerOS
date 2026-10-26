-- ==============================================================================
-- Migration: 20260921000000_storage_and_rls_hardening.sql
-- Description: Least-privilege storage bucket constraints, DELETE policies, and RLS hardening
-- ==============================================================================

-- 1. Storage Buckets Hardening (Size Limits & Allowed MIME Types)
-- Resumes: 10MB limit (10,485,760 bytes), PDF, DOCX, DOC, and TXT only
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  FALSE,
  10485760,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = FALSE,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]::text[];

-- Interview Recordings: 50MB limit (52,428,800 bytes), Audio and Video formats only
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'interview-recordings',
  'interview-recordings',
  FALSE,
  52428800,
  ARRAY[
    'audio/webm',
    'audio/mp4',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/webm',
    'video/mp4'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = FALSE,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'audio/webm',
    'audio/mp4',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/webm',
    'video/mp4'
  ]::text[];

-- 2. Storage Objects: Missing DELETE Policies for Students
-- Students can delete their own resumes
DROP POLICY IF EXISTS "students_delete_own_resume" ON storage.objects;
CREATE POLICY "students_delete_own_resume" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Students can delete their own interview recordings
DROP POLICY IF EXISTS "students_delete_own_interview_recording" ON storage.objects;
CREATE POLICY "students_delete_own_interview_recording" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'interview-recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Profiles: Missing Self-DELETE Policy for Account Cleanup
DROP POLICY IF EXISTS "profiles_self_delete" ON public.profiles;
CREATE POLICY "profiles_self_delete" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = auth.uid());

-- 4. Interview Consents: Missing Self-DELETE Policy
DROP POLICY IF EXISTS "interview_consents_self_delete" ON public.interview_consents;
CREATE POLICY "interview_consents_self_delete" ON public.interview_consents
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- 5. Hardened Verification: Ensure RLS is active on all workspace & profile tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interview_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.networking_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
