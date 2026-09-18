// scripts/test_privacy_compliance.mjs
// CareerOS Privacy, Consent & Compliance Verification Suite

import { 
  recordConsent, 
  verifyInterviewConsent, 
  withdrawConsent,
  CURRENT_CONSENT_VERSION,
  CURRENT_PRIVACY_POLICY_VERSION
} from '../src/lib/ai/consentService.ts';

const BASE_URL = 'http://localhost:3000';
const COOKIES = 'careeros_demo_session=student; careeros_persona=student';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

function pass(name) {
  console.log(`${colors.green}  ✓ PASS:${colors.reset} ${name}`);
}

function fail(name, details) {
  console.error(`${colors.red}  ✗ FAIL:${colors.reset} ${name}`);
  if (details) console.error(`    ${colors.yellow}${details}${colors.reset}`);
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  CareerOS Privacy, Consent & Compliance Test Suite  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  let total = 0;
  let passed = 0;

  // TEST 1: Service Unit Level - Missing mic consent blocked
  total++;
  try {
    await recordConsent({
      userId: 'test-user-1',
      interviewType: 'technical',
      cameraConsent: true,
      microphoneConsent: false, // MISSING
      recordingConsent: true,
      aiAnalysisConsent: true,
      improvementConsent: false
    });
    fail('Service rejects missing microphone consent', 'Expected error but got success');
  } catch (e) {
    if (e.message.includes('Microphone consent is required')) {
      pass('Service rejects missing microphone consent');
      passed++;
    } else {
      fail('Service rejects missing microphone consent', e.message);
    }
  }

  // TEST 2: Service Unit Level - Missing AI analysis consent blocked
  total++;
  try {
    await recordConsent({
      userId: 'test-user-2',
      interviewType: 'technical',
      cameraConsent: true,
      microphoneConsent: true,
      recordingConsent: true,
      aiAnalysisConsent: false, // MISSING
      improvementConsent: false
    });
    fail('Service rejects missing AI analysis consent', 'Expected error but got success');
  } catch (e) {
    if (e.message.includes('AI analysis consent is required')) {
      pass('Service rejects missing AI analysis consent');
      passed++;
    } else {
      fail('Service rejects missing AI analysis consent', e.message);
    }
  }

  // TEST 3: Service Unit Level - Outdated consent version blocked
  total++;
  try {
    const testInterviewId = `interview-outdated-${Date.now()}`;
    const outdatedRecord = await recordConsent({
      userId: 'test-user-outdated',
      interviewId: testInterviewId,
      interviewType: 'technical',
      cameraConsent: true,
      microphoneConsent: true,
      recordingConsent: true,
      aiAnalysisConsent: true,
      improvementConsent: false
    });

    // Artificially modify the stored version to simulate an older policy
    outdatedRecord.consentVersion = 'v0.8.0';

    const check = await verifyInterviewConsent({
      userId: 'test-user-outdated',
      interviewId: testInterviewId
    });

    if (!check.valid && check.code === 'CONSENT_VERSION_MISMATCH') {
      pass('Version enforcement: Validates current version policy (' + CURRENT_CONSENT_VERSION + ') and rejects outdated version');
      passed++;
    } else {
      fail('Version enforcement: Older version check failed', JSON.stringify(check));
    }
  } catch (e) {
    fail('Version enforcement check error', e.message);
  }

  // TEST 4: API Endpoint - Turn API Blocked Without Prior Consent (HTTP 403)
  total++;
  try {
    const unconsentedInterviewId = `unconsented-test-${Date.now()}`;
    const res = await fetch(`${BASE_URL}/api/ai/interview/turn`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewId: unconsentedInterviewId,
        interviewType: 'technical',
        targetRole: 'Software Engineer',
        candidateAnswer: 'I would use a hash set to track seen numbers in linear time.',
        history: [],
        turnCount: 0
      })
    });

    const data = await res.json();
    if (res.status === 403 && (data.error === 'consent_required' || data.code === 'CONSENT_MISSING')) {
      pass('Turn API enforces server-side consent: returns HTTP 403 consent_required');
      passed++;
    } else {
      fail('Turn API blocks unconsented interview', `Status: ${res.status}, Response: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    fail('Turn API unconsented call failed', e.message);
  }

  // TEST 5: API Endpoint - Missing Mic Consent in Consent Route (HTTP 400)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/ai/interview/consent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewType: 'technical',
        cameraConsent: true,
        microphoneConsent: false, // MISSING
        recordingConsent: true,
        aiAnalysisConsent: true
      })
    });
    const data = await res.json();
    if (res.status === 400 && data.error.includes('Microphone consent is required')) {
      pass('Consent API rejects missing microphone consent with HTTP 400');
      passed++;
    } else {
      fail('Consent API rejects missing mic', `Status: ${res.status}`);
    }
  } catch (e) {
    fail('Consent API missing mic check failed', e.message);
  }

  // TEST 6: API Endpoint - Successful Consent Recording with Audio-Only Mode
  total++;
  const validInterviewId = `valid-interview-${Date.now()}`;
  try {
    const res = await fetch(`${BASE_URL}/api/ai/interview/consent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewId: validInterviewId,
        interviewType: 'technical',
        cameraConsent: false, // Candidate opted for Audio-Only
        microphoneConsent: true,
        recordingConsent: true,
        aiAnalysisConsent: true,
        improvementConsent: false // Optional unselected
      })
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.consentVersion === CURRENT_CONSENT_VERSION) {
      pass('Consent API successfully records granular consent with Audio-Only option');
      passed++;
    } else {
      fail('Consent API record valid consent', `Status: ${res.status}, data: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    fail('Consent API recording error', e.message);
  }

  // TEST 7: API Endpoint - Turn API Succeeds After Valid Server Consent
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/ai/interview/turn`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewId: validInterviewId,
        interviewType: 'technical',
        targetRole: 'Software Engineer',
        currentTopic: 'Arrays & Hash Sets',
        currentDifficulty: 'Intermediate',
        candidateAnswer: 'I would iterate through the array once and store each element in a hash set. If an element already exists in the set, I return it immediately. This gives O(n) time and O(n) space.',
        history: [
          { role: 'interviewer', text: 'How would you find the first duplicate in an array?' }
        ],
        turnCount: 1
      })
    });

    const data = await res.json();
    if (res.status === 200 && data.followUpQuestion && data.evaluation) {
      pass('Turn API successfully executes AI turn analysis after verified consent');
      passed++;
    } else {
      fail('Turn API valid execution', `Status: ${res.status}, data: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    fail('Turn API call with valid consent failed', e.message);
  }

  // TEST 8: API Endpoint - Mid-Interview Consent Withdrawal Immediately Revokes Access
  total++;
  try {
    // 8a. Withdraw consent
    const withdrawRes = await fetch(`${BASE_URL}/api/ai/interview/consent`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewId: validInterviewId,
        interviewType: 'technical',
        deleteData: false
      })
    });
    const withdrawData = await withdrawRes.json();

    // 8b. Subsequent turn call must be blocked immediately
    const turnRes = await fetch(`${BASE_URL}/api/ai/interview/turn`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewId: validInterviewId,
        interviewType: 'technical',
        targetRole: 'Software Engineer',
        candidateAnswer: 'Another thought on complexity...',
        history: [],
        turnCount: 2
      })
    });
    const turnData = await turnRes.json();

    if (withdrawRes.status === 200 && turnRes.status === 403 && (turnData.error === 'consent_required' || turnData.code === 'CONSENT_WITHDRAWN')) {
      pass('Consent withdrawal takes effect immediately: subsequent AI turns return HTTP 403');
      passed++;
    } else {
      fail('Consent withdrawal revocation', `Withdraw Status: ${withdrawRes.status}, Turn Status: ${turnRes.status}, Turn Data: ${JSON.stringify(turnData)}`);
    }
  } catch (e) {
    fail('Consent withdrawal test failed', e.message);
  }

  // TEST 9: API Endpoint - Permanent Data Deletion Execution
  total++;
  try {
    const deleteRes = await fetch(`${BASE_URL}/api/ai/interview/consent`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': COOKIES 
      },
      body: JSON.stringify({
        interviewId: validInterviewId,
        interviewType: 'technical',
        deleteData: true // Permanent deletion requested
      })
    });
    const deleteData = await deleteRes.json();

    if (deleteRes.status === 200 && deleteData.success && deleteData.dataDeleted) {
      pass('Post-Interview Data Deletion: executes server-side removal of recordings & transcripts');
      passed++;
    } else {
      fail('Data deletion check', `Status: ${deleteRes.status}, Data: ${JSON.stringify(deleteData)}`);
    }
  } catch (e) {
    fail('Data deletion test failed', e.message);
  }

  // TEST 10: Cross-User Authorization - Unauthorized user cannot access another user's consent
  total++;
  try {
    const ownerSessionId = `cross-user-${Date.now()}`;
    await recordConsent({
      userId: 'legitimate-user-A',
      interviewId: ownerSessionId,
      interviewType: 'technical',
      cameraConsent: true,
      microphoneConsent: true,
      recordingConsent: true,
      aiAnalysisConsent: true,
      improvementConsent: false
    });

    // An unauthorized user tries to verify or use User A's interviewId
    const unauthorizedCheck = await verifyInterviewConsent({
      userId: 'attacker-user-B',
      interviewId: ownerSessionId
    });

    if (!unauthorizedCheck.valid && unauthorizedCheck.message?.includes('Unauthorized')) {
      pass('Security: Cross-user authorization strictly blocks unauthorized access to another user\'s consent');
      passed++;
    } else {
      fail('Cross-user authorization check failed', JSON.stringify(unauthorizedCheck));
    }
  } catch (e) {
    fail('Cross-user authorization test error', e.message);
  }

  // TEST 11: Camera requirement check when strictly required
  total++;
  try {
    const audioOnlySessionId = `audio-only-${Date.now()}`;
    await recordConsent({
      userId: 'audio-only-user',
      interviewId: audioOnlySessionId,
      interviewType: 'technical',
      cameraConsent: false, // AUDIO ONLY
      microphoneConsent: true,
      recordingConsent: true,
      aiAnalysisConsent: true
    });

    // Check with requireCamera = true
    const cameraCheck = await verifyInterviewConsent({
      userId: 'audio-only-user',
      interviewId: audioOnlySessionId,
      requireCamera: true
    });

    if (!cameraCheck.valid && cameraCheck.code === 'CAMERA_REQUIRED') {
      pass('Granular purposes: Rejects missing camera consent when video is strictly required');
      passed++;
    } else {
      fail('Camera requirement check failed', JSON.stringify(cameraCheck));
    }
  } catch (e) {
    fail('Camera requirement test error', e.message);
  }

  // Summary
  console.log(`\n${colors.bold}----------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}Results: ${passed}/${total} Privacy & Compliance Tests Passed (${Math.round((passed/total)*100)}%)${colors.reset}`);
  console.log(`${colors.bold}----------------------------------------------------${colors.reset}\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
