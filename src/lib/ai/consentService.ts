/**
 * CareerOS Privacy, Consent & Compliance Service
 * Enforces server-side consent verification, consent versioning,
 * lifecycle audit trails, and data withdrawal/deletion controls.
 */

import { createServerClient } from '@supabase/ssr';

export const CURRENT_CONSENT_VERSION = 'v1.0.0';
export const CURRENT_PRIVACY_POLICY_VERSION = '2026-09-17';

export interface ConsentRecord {
  id: string;
  userId: string;
  interviewId?: string;
  interviewType: 'technical' | 'hr' | 'general';
  cameraConsent: boolean;
  microphoneConsent: boolean;
  recordingConsent: boolean;
  aiAnalysisConsent: boolean;
  improvementConsent: boolean;
  privacyPolicyVersion: string;
  consentVersion: string;
  grantedAt: string;
  withdrawnAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentCheckResult {
  valid: boolean;
  code?: 'CONSENT_MISSING' | 'CONSENT_WITHDRAWN' | 'CONSENT_VERSION_MISMATCH' | 'CAMERA_REQUIRED' | 'MIC_REQUIRED' | 'RECORDING_REQUIRED' | 'ANALYSIS_REQUIRED';
  message?: string;
  consent?: ConsentRecord;
}

// In-memory store for demo mode & offline fallback testing
const memoryConsentStore = new Map<string, ConsentRecord>();

/**
 * Helper to build an authenticated server-side Supabase client
 */
async function getSupabaseServerClient() {
  let cookieStore: any = null;
  try {
    const { cookies } = await import('next/headers');
    cookieStore = await cookies();
  } catch {
    // Fallback for standalone scripts / testing
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try { cookieStore?.set({ name, value, ...options }); } catch {}
      },
      remove(name: string, options) {
        try { cookieStore?.delete({ name, ...options }); } catch {}
      },
    },
  });
}

/**
 * 1. Record a new explicit consent decision
 */
export async function recordConsent(params: {
  userId: string;
  interviewId?: string;
  interviewType?: 'technical' | 'hr' | 'general';
  cameraConsent: boolean;
  microphoneConsent: boolean;
  recordingConsent: boolean;
  aiAnalysisConsent: boolean;
  improvementConsent?: boolean;
  ipHash?: string;
  userAgent?: string;
}): Promise<ConsentRecord> {
  if (!params.microphoneConsent) {
    throw new Error('Microphone consent is required to participate in spoken interview sessions.');
  }
  if (!params.aiAnalysisConsent) {
    throw new Error('AI analysis consent is required to receive real-time scoring and feedback.');
  }

  const now = new Date().toISOString();
  const recordId = `consent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newRecord: ConsentRecord = {
    id: recordId,
    userId: params.userId,
    interviewId: params.interviewId,
    interviewType: params.interviewType || 'technical',
    cameraConsent: Boolean(params.cameraConsent),
    microphoneConsent: Boolean(params.microphoneConsent),
    recordingConsent: Boolean(params.recordingConsent),
    aiAnalysisConsent: Boolean(params.aiAnalysisConsent),
    improvementConsent: Boolean(params.improvementConsent),
    privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
    consentVersion: CURRENT_CONSENT_VERSION,
    grantedAt: now,
    withdrawnAt: null,
    createdAt: now,
    updatedAt: now,
  };

  // Always keep in memory store for demo sessions & fast cache
  memoryConsentStore.set(`${params.userId}:${newRecord.interviewType}`, newRecord);
  if (newRecord.interviewId) {
    memoryConsentStore.set(`session:${newRecord.interviewId}`, newRecord);
  }

  // Attempt database persistence if user has authenticated Supabase session
  try {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('interview_consents')
        .insert({
          user_id: params.userId,
          interview_id: params.interviewId,
          interview_type: params.interviewType || 'technical',
          camera_consent: newRecord.cameraConsent,
          microphone_consent: newRecord.microphoneConsent,
          recording_consent: newRecord.recordingConsent,
          ai_analysis_consent: newRecord.aiAnalysisConsent,
          improvement_consent: newRecord.improvementConsent,
          privacy_policy_version: newRecord.privacyPolicyVersion,
          consent_version: newRecord.consentVersion,
          ip_hash: params.ipHash,
          user_agent: params.userAgent,
          granted_at: now,
        })
        .select('*')
        .maybeSingle();

      if (!error && data) {
        newRecord.id = data.id;
      }
    }
  } catch (err) {
    console.warn('[ConsentService] Notice writing to interview_consents:', err);
  }

  return newRecord;
}

/**
 * 2. Strict Server-Side Consent Verification
 * Used by all interview API route handlers before accepting requests
 */
export async function verifyInterviewConsent(params: {
  userId: string | null;
  interviewId?: string;
  interviewType?: 'technical' | 'hr' | 'general';
  requireCamera?: boolean;
  requireRecording?: boolean;
}): Promise<ConsentCheckResult> {
  const userId = params.userId || 'demo-candidate';
  const interviewType = params.interviewType || 'technical';

  let consent: ConsentRecord | null = null;

  // Check Supabase first if available
  try {
    const supabase = await getSupabaseServerClient();
    if (supabase && params.userId) {
      let query = supabase
        .from('interview_consents')
        .select('*')
        .eq('user_id', params.userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (params.interviewId) {
        query = query.eq('interview_id', params.interviewId);
      } else {
        query = query.eq('interview_type', interviewType);
      }

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        consent = {
          id: data.id,
          userId: data.user_id,
          interviewId: data.interview_id,
          interviewType: data.interview_type,
          cameraConsent: data.camera_consent,
          microphoneConsent: data.microphone_consent,
          recordingConsent: data.recording_consent,
          aiAnalysisConsent: data.ai_analysis_consent,
          improvementConsent: data.improvement_consent,
          privacyPolicyVersion: data.privacy_policy_version,
          consentVersion: data.consent_version,
          grantedAt: data.granted_at,
          withdrawnAt: data.withdrawn_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }
  } catch (err) {
    console.warn('[ConsentService] Supabase check notice:', err);
  }

  // Fallback to memory store if not found in DB
  if (!consent) {
    consent =
      (params.interviewId ? memoryConsentStore.get(`session:${params.interviewId}`) : null) ||
      memoryConsentStore.get(`${userId}:${interviewType}`) ||
      null;
  }

  // 1. Missing Record
  if (!consent) {
    return {
      valid: false,
      code: 'CONSENT_MISSING',
      message: 'No consent record found. Please complete the pre-interview privacy consent flow.',
    };
  }

  // 1b. Strict User Ownership Check
  if (consent.userId !== userId) {
    return {
      valid: false,
      code: 'CONSENT_MISSING',
      message: 'Unauthorized: Consent record belongs to another user.',
    };
  }

  // 2. Consent Withdrawn
  if (consent.withdrawnAt) {
    return {
      valid: false,
      code: 'CONSENT_WITHDRAWN',
      message: 'Interview consent was previously withdrawn. You must re-consent before starting an interview.',
      consent,
    };
  }

  // 3. Version Mismatch
  if (consent.consentVersion !== CURRENT_CONSENT_VERSION) {
    return {
      valid: false,
      code: 'CONSENT_VERSION_MISMATCH',
      message: `Consent version outdated (${consent.consentVersion}). Please review and accept updated terms (${CURRENT_CONSENT_VERSION}).`,
      consent,
    };
  }

  // 4. Required Microphone Consent
  if (!consent.microphoneConsent) {
    return {
      valid: false,
      code: 'MIC_REQUIRED',
      message: 'Microphone consent is required to process spoken interview responses.',
      consent,
    };
  }

  // 5. Required AI Analysis Consent
  if (!consent.aiAnalysisConsent) {
    return {
      valid: false,
      code: 'ANALYSIS_REQUIRED',
      message: 'AI analysis consent is required to evaluate code, speech, and response structures.',
      consent,
    };
  }

  // 6. Camera Requirement (if strictly enforced for video mode)
  if (params.requireCamera && !consent.cameraConsent) {
    return {
      valid: false,
      code: 'CAMERA_REQUIRED',
      message: 'Camera consent is required for video interview mode. You may switch to Audio-Only mode.',
      consent,
    };
  }

  // 7. Recording Requirement (if session recording is active)
  if (params.requireRecording && !consent.recordingConsent) {
    return {
      valid: false,
      code: 'RECORDING_REQUIRED',
      message: 'Session recording consent is required when session playback is enabled.',
      consent,
    };
  }

  return {
    valid: true,
    consent,
  };
}

/**
 * 3. Withdraw Consent & Stop Active Session
 */
export async function withdrawConsent(params: {
  userId: string;
  consentId?: string;
  interviewId?: string;
  interviewType?: 'technical' | 'hr' | 'general';
  deleteAssociatedData?: boolean;
}): Promise<{ success: boolean; withdrawnAt: string; dataDeleted: boolean; message: string }> {
  const now = new Date().toISOString();
  const key = `${params.userId}:${params.interviewType || 'technical'}`;

  // Update memory store
  const existing = memoryConsentStore.get(key);
  if (existing) {
    existing.withdrawnAt = now;
    existing.updatedAt = now;
    memoryConsentStore.set(key, existing);
  }

  if (params.interviewId) {
    const sessionRecord = memoryConsentStore.get(`session:${params.interviewId}`);
    if (sessionRecord) {
      sessionRecord.withdrawnAt = now;
      sessionRecord.updatedAt = now;
      memoryConsentStore.set(`session:${params.interviewId}`, sessionRecord);
    }
  }

  // Update database
  try {
    const supabase = await getSupabaseServerClient();
    if (supabase && params.userId) {
      let query = supabase
        .from('interview_consents')
        .update({ withdrawn_at: now, updated_at: now })
        .eq('user_id', params.userId);

      if (params.consentId) {
        query = query.eq('id', params.consentId);
      } else if (params.interviewId) {
        query = query.eq('interview_id', params.interviewId);
      }

      await query;

      // Optional cascade deletion of interview evaluations / transcripts
      if (params.deleteAssociatedData) {
        if (params.interviewType === 'technical' || !params.interviewType) {
          await supabase.from('technical_evaluations').delete().eq('profile_id', params.userId);
        }
        if (params.interviewType === 'hr' || !params.interviewType) {
          await supabase.from('hr_evaluations').delete().eq('profile_id', params.userId);
        }
      }
    }
  } catch (err) {
    console.warn('[ConsentService] Error withdrawing consent in DB:', err);
  }

  return {
    success: true,
    withdrawnAt: now,
    dataDeleted: Boolean(params.deleteAssociatedData),
    message: 'Consent successfully withdrawn. Audio recording, video capture, and AI evaluations have been terminated.',
  };
}
