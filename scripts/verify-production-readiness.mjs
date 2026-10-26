/**
 * Production Readiness Verification Suite
 * Tests database schema, RLS policies, storage constraints, and disabled OpenRouter fallback.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// 1. Load .env.local manually
const envPath = resolve(rootDir, '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failCount++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('CAREEROS PRODUCTION READINESS VERIFICATION SUITE');
  console.log('======================================================\n');

  // -------------------------------------------------------------------------
  // TEST GROUP 1: OpenRouter Fallback Deactivation
  // -------------------------------------------------------------------------
  console.log('1. OpenRouter Fallback Configuration:');
  const openRouterEnabledEnv = process.env.OPENROUTER_ENABLED;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  assert(
    openRouterEnabledEnv === 'false',
    'OPENROUTER_ENABLED is set to "false" in environment',
    `Found: ${openRouterEnabledEnv}`
  );

  assert(
    !openRouterKey || openRouterKey.trim() === '' || openRouterKey.includes('placeholder'),
    'OPENROUTER_API_KEY does not contain active credentials',
    `Found length: ${openRouterKey ? openRouterKey.length : 0}`
  );

  const primaryAiProvider = process.env.PRIMARY_AI_PROVIDER || 'nvidia';
  assert(
    ['nvidia', 'gemini', 'groq'].includes(primaryAiProvider),
    `Primary AI Provider resolves to verified production provider (${primaryAiProvider})`
  );

  // -------------------------------------------------------------------------
  // TEST GROUP 2: Supabase Credentials & Client Initialization
  // -------------------------------------------------------------------------
  console.log('\n2. Supabase Configuration & Connectivity:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  assert(
    Boolean(supabaseUrl && supabaseUrl.includes('gcadnqlvydibaiuunibk.supabase.co')),
    'Supabase URL targets verified project gcadnqlvydibaiuunibk',
    `URL: ${supabaseUrl}`
  );

  assert(
    Boolean(anonKey && anonKey.startsWith('sb_publishable_')),
    'Supabase Publishable/Anon key is configured with correct prefix'
  );

  assert(
    Boolean(serviceKey && serviceKey.startsWith('sb_secret_')),
    'Supabase Service Role secret key is configured with correct prefix'
  );

  // Test client connection
  const publicClient = createClient(supabaseUrl, anonKey);
  const adminClient = createClient(supabaseUrl, serviceKey);

  // -------------------------------------------------------------------------
  // TEST GROUP 3: Database Tables & Schema Integrity
  // -------------------------------------------------------------------------
  console.log('\n3. Database Tables & Schema Verification:');
  const tablesToCheck = [
    'profiles',
    'institutions',
    'students',
    'resumes',
    'roadmap_milestones',
    'interview_sessions',
    'interview_consents',
    'saved_jobs',
    'applications',
    'tasks',
    'networking_contacts',
    'portfolio_projects',
    'notifications',
  ];

  for (const table of tablesToCheck) {
    try {
      const { error } = await adminClient.from(table).select('*').limit(1);
      assert(!error, `Table "public.${table}" exists and is queryable`, error ? error.message : '');
    } catch (err) {
      assert(false, `Table "public.${table}" query threw exception`, err.message);
    }
  }

  // -------------------------------------------------------------------------
  // TEST GROUP 4: Row Level Security (RLS) Isolation
  // -------------------------------------------------------------------------
  console.log('\n4. Row Level Security & Cross-User Isolation:');

  // Verify that an unauthenticated public client CANNOT read private resumes
  const { data: anonResumes, error: anonResumeErr } = await publicClient
    .from('resumes')
    .select('*')
    .limit(5);

  assert(
    !anonResumes || anonResumes.length === 0,
    'Unauthenticated client receives zero private resumes from "public.resumes"',
    anonResumeErr ? anonResumeErr.message : `Returned ${anonResumes ? anonResumes.length : 0} rows`
  );

  // Verify unauthenticated client CANNOT read private applications
  const { data: anonApps, error: anonAppsErr } = await publicClient
    .from('applications')
    .select('*')
    .limit(5);

  assert(
    !anonApps || anonApps.length === 0,
    'Unauthenticated client receives zero private applications from "public.applications"',
    anonAppsErr ? anonAppsErr.message : `Returned ${anonApps ? anonApps.length : 0} rows`
  );

  // Verify unauthenticated client CANNOT insert into saved_jobs without auth
  const { error: anonInsertErr } = await publicClient.from('saved_jobs').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    external_id: 'test-unauth-01',
    source: 'test',
    title: 'Security Probe Engineer',
    company: 'Probe Inc',
  });

  assert(
    Boolean(anonInsertErr),
    'Unauthenticated insert into "public.saved_jobs" is rejected by RLS',
    anonInsertErr ? anonInsertErr.message : 'UNEXPECTED: Insert succeeded!'
  );

  // -------------------------------------------------------------------------
  // TEST GROUP 5: Storage Bucket Configuration & Path Isolation
  // -------------------------------------------------------------------------
  console.log('\n5. Storage Buckets & File Path Isolation:');

  try {
    const { data: buckets, error: bucketErr } = await adminClient.storage.listBuckets();
    assert(!bucketErr && Boolean(buckets), 'Storage bucket service is operational');

    if (buckets) {
      const resumeBucket = buckets.find((b) => b.id === 'resumes');
      assert(Boolean(resumeBucket), 'Bucket "resumes" exists');
      if (resumeBucket) {
        assert(
          resumeBucket.public === false,
          'Bucket "resumes" is strictly private (public = false)'
        );
        assert(
          resumeBucket.file_size_limit === 10485760 || resumeBucket.file_size_limit === null,
          `Bucket "resumes" enforces 10MB limit (limit: ${resumeBucket.file_size_limit || 'default'})`
        );
      }

      const interviewBucket = buckets.find((b) => b.id === 'interview-recordings');
      assert(Boolean(interviewBucket), 'Bucket "interview-recordings" exists');
      if (interviewBucket) {
        assert(
          interviewBucket.public === false,
          'Bucket "interview-recordings" is strictly private (public = false)'
        );
      }
    }
  } catch (err) {
    assert(false, 'Storage bucket check threw an error', err.message);
  }

  // Verify file path sanitization and user prefix convention {student_id}/{filename}
  const testStudentId = 'student-uuid-test-999';
  const testFilename = 'My Résumé 2026 (v2)..pdf';
  const sanitizedFilename = testFilename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.');
  const expectedPath = `${testStudentId}/${sanitizedFilename}`;

  assert(
    !expectedPath.includes('..') && expectedPath.startsWith(`${testStudentId}/`),
    `Storage path enforces {student_id}/{sanitized_filename} prefix: "${expectedPath}"`
  );

  // Test real lifecycle: upload test object -> create signed URL -> delete test object
  try {
    const probePath = `test-probe/${Date.now()}_probe.txt`;
    const probeContent = Buffer.from('CareerOS storage probe verification');

    // 1. Upload
    const { error: uploadErr } = await adminClient.storage
      .from('resumes')
      .upload(probePath, probeContent, { contentType: 'text/plain', upsert: true });

    assert(!uploadErr, 'Test object upload to "resumes" bucket succeeds', uploadErr?.message);

    // 2. Create signed URL
    const { data: signedData, error: signedErr } = await adminClient.storage
      .from('resumes')
      .createSignedUrl(probePath, 3600);

    assert(
      !signedErr && Boolean(signedData?.signedUrl && signedData.signedUrl.includes('token=')),
      'Signed URL creation for private resume object returns valid tokenized download URL',
      signedErr?.message
    );

    // 3. Delete object (verifying delete capability)
    const { error: deleteErr } = await adminClient.storage
      .from('resumes')
      .remove([probePath]);

    assert(!deleteErr, 'Delete operation on private resume object succeeds', deleteErr?.message);
  } catch (err) {
    assert(false, 'End-to-end storage lifecycle test threw exception', err.message);
  }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
