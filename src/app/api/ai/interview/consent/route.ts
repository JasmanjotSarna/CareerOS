import { NextRequest, NextResponse } from 'next/server';
import { 
  recordConsent, 
  verifyInterviewConsent, 
  withdrawConsent,
  CURRENT_CONSENT_VERSION,
  CURRENT_PRIVACY_POLICY_VERSION
} from '@/lib/ai/consentService';
import { checkRateLimit } from '@/lib/ai/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
    const rateCheck = checkRateLimit(`consent-post-${ip}`, 30);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();

    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      interviewId,
      interviewType = 'technical',
      cameraConsent,
      microphoneConsent,
      recordingConsent,
      aiAnalysisConsent,
      improvementConsent = false
    } = body;

    // Strict validation: Required checkboxes cannot be bypassed
    if (!microphoneConsent) {
      return NextResponse.json(
        { error: 'Microphone consent is required to participate in spoken interview sessions.' },
        { status: 400 }
      );
    }
    if (!aiAnalysisConsent) {
      return NextResponse.json(
        { error: 'AI analysis consent is required to receive real-time scoring and feedback.' },
        { status: 400 }
      );
    }

    const userId = auth.userId || 'demo-student';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const consent = await recordConsent({
      userId,
      interviewId,
      interviewType,
      cameraConsent: Boolean(cameraConsent),
      microphoneConsent: Boolean(microphoneConsent),
      recordingConsent: Boolean(recordingConsent),
      aiAnalysisConsent: Boolean(aiAnalysisConsent),
      improvementConsent: Boolean(improvementConsent),
      ipHash: ip,
      userAgent
    });

    return NextResponse.json({
      success: true,
      consentId: consent.id,
      consentVersion: consent.consentVersion,
      privacyPolicyVersion: consent.privacyPolicyVersion,
      grantedAt: consent.grantedAt,
      consent,
      message: 'Interview privacy consent recorded successfully.'
    });
  } catch (err: unknown) {
    console.error('[API /api/ai/interview/consent POST Error]:', err);
    const msg = err instanceof Error ? err.message : 'Failed to record consent.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();

    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('interviewId') || undefined;
    const interviewType = (searchParams.get('interviewType') as 'technical' | 'hr') || 'technical';

    const userId = auth.userId || 'demo-student';

    const result = await verifyInterviewConsent({
      userId,
      interviewId,
      interviewType
    });

    return NextResponse.json({
      hasConsent: result.valid,
      code: result.code,
      message: result.message,
      consent: result.consent || null,
      currentVersions: {
        consentVersion: CURRENT_CONSENT_VERSION,
        privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION
      }
    });
  } catch (err: unknown) {
    console.error('[API /api/ai/interview/consent GET Error]:', err);
    const msg = err instanceof Error ? err.message : 'Failed to retrieve consent status.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { getAIAuthContext } = await import('@/lib/ai/aiAuth');
    const auth = await getAIAuthContext();

    if (!auth.isAuthenticated && !auth.isDemo) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    let bodyData: any = {};
    try {
      bodyData = await req.json();
    } catch {
      // Empty or non-JSON body is valid, fall back to URL searchParams
    }

    const { searchParams } = new URL(req.url);
    const consentId = bodyData.consentId || searchParams.get('consentId') || undefined;
    const interviewId = bodyData.interviewId || searchParams.get('interviewId') || undefined;
    const interviewType = (bodyData.interviewType || searchParams.get('interviewType') as 'technical' | 'hr') || undefined;
    const deleteData = bodyData.deleteData === true || searchParams.get('deleteData') === 'true';

    const userId = auth.userId || 'demo-student';

    const result = await withdrawConsent({
      userId,
      consentId,
      interviewId,
      interviewType,
      deleteAssociatedData: deleteData
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('[API /api/ai/interview/consent DELETE Error]:', err);
    const msg = err instanceof Error ? err.message : 'Failed to withdraw consent.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
