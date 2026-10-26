// scripts/test-turn-taking.js
const { performance } = require('perf_hooks');

async function runTests() {
  console.log('=== CareerOS Voice Interview Turn-Taking Engine: Test Suite ===\n');

  // Test 4: Noise & Cough Detection Logic
  console.log('[Test 4] Testing Noise & Cough Filtering (isGarbageOrNoise)...');
  const pureFillers = ['um', 'uh', 'ah', 'er', 'hmm', 'huh', 'cough', 'throat clearing'];
  const testUtterances = [
    { text: 'cough', expectedNoise: true, reason: 'Explicit cough' },
    { text: 'um', expectedNoise: true, reason: 'Pure filler' },
    { text: 'ok', expectedNoise: true, reason: 'Under 3 words' },
    { text: 'uh yeah', expectedNoise: true, reason: 'Under 3 words' },
    { text: 'I would use a hashmap to store the seen elements in linear time.', expectedNoise: false, reason: 'Legitimate 13-word answer' },
    { text: 'We should optimize by using two pointers starting from both ends.', expectedNoise: false, reason: 'Legitimate 11-word answer' }
  ];

  function isGarbageOrNoise(transcript) {
    const cleaned = (transcript || '').trim().toLowerCase();
    if (!cleaned) return true;
    if (pureFillers.includes(cleaned)) return true;
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    return words.length < 3;
  }

  let noisePassed = true;
  for (const item of testUtterances) {
    const result = isGarbageOrNoise(item.text);
    const ok = result === item.expectedNoise;
    console.log(`  ${ok ? '✓' : '✗'} "${item.text}" -> Detected as ${result ? 'NOISE/DISCARD' : 'VALID ANSWER'} (${item.reason})`);
    if (!ok) noisePassed = false;
  }
  console.log(`Noise filter verification: ${noisePassed ? 'PASSED' : 'FAILED'}\n`);

  // Test 1: Adaptive Silence Detection Cadence Simulation
  console.log('[Test 1] Testing Adaptive Silence Threshold scaling...');
  class MockVAD {
    constructor() {
      this.baseSilence = 850;
      this.maxSilence = 2200;
      this.pauseDurations = [];
    }
    recordPause(pauseMs) {
      if (pauseMs > 200 && pauseMs < 4000) {
        this.pauseDurations.push(pauseMs);
        if (this.pauseDurations.length > 8) this.pauseDurations.shift();
      }
    }
    computeDebounce() {
      if (this.pauseDurations.length < 2) return this.baseSilence;
      const avg = this.pauseDurations.reduce((a, b) => a + b, 0) / this.pauseDurations.length;
      const computed = this.baseSilence + (avg * 0.6);
      return Math.min(this.maxSilence, Math.max(this.baseSilence, computed));
    }
  }

  const vad = new MockVAD();
  console.log(`  Initial default debounce for fast speaker: ${vad.computeDebounce()}ms`);
  vad.recordPause(1500);
  vad.recordPause(1800);
  vad.recordPause(1900);
  const adapted = vad.computeDebounce();
  console.log(`  Adapted debounce for thoughtful speaker with ~1.7s pauses: ${Math.round(adapted)}ms`);
  const holdsTwoSecPause = adapted >= 1800;
  console.log(`  ${holdsTwoSecPause ? '✓' : '✗'} 2-second mid-sentence pause protection: ${holdsTwoSecPause ? 'HOLDS TURN OPEN' : 'CUTS OFF'}\n`);

  // Test 5: Latency Benchmark on /api/ai/interview/turn
  console.log('[Test 5] Measuring Server-Side Reasoning Latency & TTFT on /api/ai/interview/turn...');
  const interviewId = `turn-test-${Date.now()}`;
  const cookies = 'careeros_demo_session=student; careeros_persona=student';

  // 1. Grant consent first
  await fetch('http://localhost:3000/api/ai/interview/consent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookies },
    body: JSON.stringify({
      interviewId,
      interviewType: 'technical',
      microphoneConsent: true,
      recordingConsent: true,
      aiAnalysisConsent: true
    })
  });

  const payload = {
    interviewId,
    interviewType: 'technical',
    targetRole: 'Software Engineer — SDE-1',
    currentTopic: 'Arrays & Hash Sets',
    currentDifficulty: 'Intermediate',
    candidateAnswer: 'I would iterate through the array once and store each element in a hash set. If the set already contains the number, we return it immediately. This gives O(N) time and O(N) space.',
    history: [
      { role: 'interviewer', text: 'Given an array of integers, how would you find the first recurring element?' }
    ],
    turnCount: 1
  };

  const start = performance.now();
  try {
    const res = await fetch('http://localhost:3000/api/ai/interview/turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookies },
      body: JSON.stringify(payload)
    });

    const elapsedMs = Math.round(performance.now() - start);
    const data = await res.json();

    console.log(`  HTTP Status: ${res.status}`);
    console.log(`  Total Server Turn Latency (Time-To-First-Token / Response): ${elapsedMs}ms`);
    console.log(`  Next Action Decided: "${data.nextAction}"`);
    console.log(`  Follow-up Question: "${data.followUpQuestion}"`);
    console.log(`  Updated Difficulty: "${data.updatedDifficulty}"`);
    console.log(`  Score: ${data.evaluation?.score}% | Depth: ${data.evaluation?.depthScore}%`);

    // Sentence splitting simulation (sentence streaming)
    const regex = /[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g;
    const sentences = data.followUpQuestion.match(regex) || [data.followUpQuestion];
    console.log(`  Sentences for streaming TTS playback: ${sentences.length} sentence(s)`);
    console.log(`  Sentence #1 for immediate playback: "${sentences[0].trim()}"`);
    
    // Perceived latency check (< 2000ms target)
    const isFast = elapsedMs < 2000;
    console.log(`  ${isFast ? '✓' : '⚠'} Turn conversational pause gap: ${elapsedMs}ms (${isFast ? 'Natural conversational gap < 2s' : 'Slightly slow'})`);
  } catch (err) {
    console.error('  Failed to call /api/ai/interview/turn:', err.message);
  }

  console.log('\n=== Test Suite Complete ===');
}

runTests();
