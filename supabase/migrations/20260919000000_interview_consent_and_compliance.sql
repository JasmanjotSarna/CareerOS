-- ==============================================================================
-- Migration: 20260919000000_interview_consent_and_compliance.sql
-- Description: Persistent consent records and audit trail for AI Interview sessions
-- Version: v1.0.0
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.interview_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_id TEXT, -- Optional linkage to specific interview session token
  interview_type TEXT NOT NULL DEFAULT 'technical' CHECK (interview_type IN ('technical', 'hr', 'general')),
  
  -- Distinct granular consent purposes (NO single blanket checkbox)
  camera_consent BOOLEAN NOT NULL DEFAULT FALSE,
  microphone_consent BOOLEAN NOT NULL DEFAULT FALSE,
  recording_consent BOOLEAN NOT NULL DEFAULT FALSE,
  ai_analysis_consent BOOLEAN NOT NULL DEFAULT FALSE,
  improvement_consent BOOLEAN NOT NULL DEFAULT FALSE, -- Optional anonymized model benchmarking
  
  -- Versioning & Auditability
  privacy_policy_version TEXT NOT NULL DEFAULT '2026-09-17',
  consent_version TEXT NOT NULL DEFAULT 'v1.0.0',
  ip_hash TEXT,
  user_agent TEXT,
  
  -- Lifecycle timestamps
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  withdrawn_at TIMESTAMPTZ, -- Populated if candidate revokes consent
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for fast server-side lookups
CREATE INDEX IF NOT EXISTS idx_interview_consents_user_id ON public.interview_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_consents_lookup ON public.interview_consents(user_id, consent_version, withdrawn_at);

-- Row Level Security (RLS)
ALTER TABLE public.interview_consents ENABLE ROW LEVEL SECURITY;

-- 1. Candidates can only read their own consent records
CREATE POLICY "Users can view their own consents"
  ON public.interview_consents FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Candidates can insert their own consent records
CREATE POLICY "Users can insert their own consents"
  ON public.interview_consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Candidates can update (e.g. withdraw) their own consent records
CREATE POLICY "Users can update their own consents"
  ON public.interview_consents FOR UPDATE
  USING (auth.uid() = user_id);
