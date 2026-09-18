-- ==============================================================================
-- Migration: 20260918000000_faculty_invites_and_hardened_trigger.sql
-- Description: Faculty Invite Tokens, Strict Email Binding, and Hardened handle_new_user
-- ==============================================================================

-- 1. Canonical Institutions Seeds (Apex & JECRC)
INSERT INTO public.institutions (id, name, domain) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'Apex Institute of Technology', 'apex.edu'),
  ('c0000000-0000-0000-0000-000000000003', 'JECRC University', 'jecrc.ac.in')
ON CONFLICT (domain) DO NOTHING;

-- 2. Dedicated Table for Institutional Faculty Invite Tokens
CREATE TABLE IF NOT EXISTS public.institution_faculty_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  email_restriction TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast trigger lookup
CREATE INDEX IF NOT EXISTS idx_faculty_invites_lookup 
  ON public.institution_faculty_invites (invite_code, email_restriction)
  WHERE used_at IS NULL;

-- 3. Row Level Security on institution_faculty_invites
ALTER TABLE public.institution_faculty_invites ENABLE ROW LEVEL SECURITY;

-- Faculty / Admin can view invites for their own institution
DROP POLICY IF EXISTS faculty_invites_select ON public.institution_faculty_invites;
CREATE POLICY faculty_invites_select
  ON public.institution_faculty_invites
  FOR SELECT
  TO authenticated
  USING (
    institution_id = (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Faculty / Admin can issue invites for their own institution
DROP POLICY IF EXISTS faculty_invites_insert ON public.institution_faculty_invites;
CREATE POLICY faculty_invites_insert
  ON public.institution_faculty_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    institution_id = (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Faculty / Admin who created the invite can revoke / expire it early
DROP POLICY IF EXISTS faculty_invites_update ON public.institution_faculty_invites;
CREATE POLICY faculty_invites_update
  ON public.institution_faculty_invites
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND institution_id = (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    AND institution_id = (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

GRANT ALL ON public.institution_faculty_invites TO authenticated;
REVOKE ALL ON public.institution_faculty_invites FROM anon;

-- 4. Hardened handle_new_user() Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_requested_role TEXT;
  v_role TEXT;
  v_institution_id UUID;
  v_invite_code TEXT;
  v_email_domain TEXT;
  v_invite_record RECORD;
BEGIN
  v_requested_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));

  -- =========================================================================
  -- 1. ROLE DETERMINATION & FACULTY ELEVATION GUARD
  -- NOTE: Exception strings prefixed with "Registration rejected: " are parsed
  -- and displayed directly to users by the regex matcher in src/app/signup/page.tsx (L193-207).
  -- Do not alter this prefix without updating the client parser.
  -- =========================================================================
  IF v_requested_role IN ('faculty', 'admin') THEN
    v_invite_code := TRIM(COALESCE(NEW.raw_user_meta_data->>'faculty_invite_code', ''));
    
    IF v_invite_code = '' THEN
      RAISE EXCEPTION 'Registration rejected: A valid institutional faculty invite code is required to register as faculty.';
    END IF;

    -- Validate invite code server-side against institution_faculty_invites
    SELECT * INTO v_invite_record
    FROM public.institution_faculty_invites
    WHERE invite_code = v_invite_code
      AND used_at IS NULL
      AND expires_at > NOW()
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Registration rejected: Invalid or expired faculty invite code.';
    END IF;

    -- Enforce strict email restriction binding (case-insensitive)
    IF LOWER(TRIM(v_invite_record.email_restriction)) <> LOWER(TRIM(NEW.email)) THEN
      RAISE EXCEPTION 'Registration rejected: This invite code is restricted to email %', v_invite_record.email_restriction;
    END IF;

    -- Verified: Grant faculty role and bind to invite's institution
    v_role := 'faculty';
    v_institution_id := v_invite_record.institution_id;

    -- Mark invite code as consumed
    UPDATE public.institution_faculty_invites
    SET used_at = NOW(),
        used_by = NEW.id
    WHERE id = v_invite_record.id;

  ELSE
    -- Student signups can NEVER self-elevate
    v_role := 'student';

    -- Resolve institution via email domain or default fallback
    v_email_domain := SPLIT_PART(NEW.email, '@', 2);
    SELECT id INTO v_institution_id
    FROM public.institutions
    WHERE domain = v_email_domain
    LIMIT 1;

    IF v_institution_id IS NULL THEN
      -- Fall back to default institution
      v_institution_id := 'a0000000-0000-0000-0000-000000000001'::UUID;
    END IF;
  END IF;

  -- =========================================================================
  -- 2. INSERT PROFILES RECORD
  -- =========================================================================
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'university', 'Default University'),
    COALESCE(NEW.raw_user_meta_data->>'degree', 'B.Tech'),
    COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE'),
    COALESCE((NEW.raw_user_meta_data->>'graduation_year')::INTEGER, 2026),
    COALESCE((NEW.raw_user_meta_data->>'cgpa')::NUMERIC, 8.50),
    COALESCE(NEW.raw_user_meta_data->>'target_role_id', 'role-sde-1'),
    v_institution_id
  )
  ON CONFLICT (id) DO UPDATE SET
    institution_id = EXCLUDED.institution_id,
    role = EXCLUDED.role;

  -- =========================================================================
  -- 3. INSERT DEDICATED STUDENT RECORD (FOR STUDENTS ONLY)
  -- =========================================================================
  IF v_role = 'student' THEN
    INSERT INTO public.students (
      profile_id,
      institution_id,
      department,
      graduation_year,
      target_role_id
    )
    VALUES (
      NEW.id,
      v_institution_id,
      COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE'),
      COALESCE((NEW.raw_user_meta_data->>'graduation_year')::INTEGER, 2026),
      COALESCE(NEW.raw_user_meta_data->>'target_role_id', 'role-sde-1')
    )
    ON CONFLICT (profile_id) DO UPDATE SET
      institution_id = EXCLUDED.institution_id,
      target_role_id = COALESCE(EXCLUDED.target_role_id, public.students.target_role_id);
  END IF;

  RETURN NEW;
END;
$$;
