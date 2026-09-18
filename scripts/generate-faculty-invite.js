#!/usr/bin/env node

/**
 * CareerOS — Institutional Faculty Invite Generator
 *
 * Usage:
 *   node scripts/generate-faculty-invite.js --domain jecrc.ac.in --email ramesh.sharma@jecrc.ac.in
 *   node scripts/generate-faculty-invite.js --domain apex.edu --email dean.placement@apex.edu --days 45
 *
 * Generates a cryptographically secure, single-use, email-restricted faculty invite code.
 * The code is printed to stdout ONLY and never written to disk or committed.
 */

const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
let domain = '';
let email = '';
let days = 30;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--domain' && args[i + 1]) {
    domain = args[++i].trim().toLowerCase();
  } else if (args[i] === '--email' && args[i + 1]) {
    email = args[++i].trim().toLowerCase();
  } else if (args[i] === '--days' && args[i + 1]) {
    days = parseInt(args[++i], 10) || 30;
  }
}

if (!domain || !email) {
  console.error('\nUsage: node scripts/generate-faculty-invite.js --domain <domain> --email <faculty_email> [--days <30>]\n');
  process.exit(1);
}

// Generate secure random code
const randomBytes = crypto.randomBytes(8).toString('hex').toUpperCase();
const prefix = domain.split('.')[0].toUpperCase();
const inviteCode = `INVITE-${prefix}-${randomBytes}`;

console.log('\n=============================================================');
console.log('       CAREEROS — INSTITUTIONAL FACULTY INVITE GENERATOR     ');
console.log('=============================================================');
console.log(`Target Domain:      ${domain}`);
console.log(`Restricted Email:   ${email}`);
console.log(`Validity:           ${days} days`);
console.log(`Generated Code:     ${inviteCode}`);
console.log('-------------------------------------------------------------');

const sql = `
DO $$
DECLARE
  v_inst_id UUID;
BEGIN
  SELECT id INTO v_inst_id FROM public.institutions WHERE domain = '${domain}' LIMIT 1;
  IF v_inst_id IS NULL THEN
    RAISE EXCEPTION 'Institution domain % not found in public.institutions table.', '${domain}';
  END IF;

  INSERT INTO public.institution_faculty_invites (
    institution_id,
    invite_code,
    email_restriction,
    expires_at
  ) VALUES (
    v_inst_id,
    '${inviteCode}',
    '${email}',
    NOW() + INTERVAL '${days} days'
  );
END $$;
`;

const printSqlOnly = args.includes('--print-sql');

if (printSqlOnly) {
  console.log('SQL to insert invite into database:');
  console.log(sql);
  console.log('=============================================================');
  console.log('SHARE THIS ONE-TIME INVITE WITH THE FACULTY MEMBER:');
  console.log(`  Faculty Email:  ${email}`);
  console.log(`  Invite Code:    ${inviteCode}`);
  console.log(`  Expires In:     ${days} days`);
  console.log('=============================================================\n');
  process.exit(0);
}

try {
  console.log('Connecting to remote Supabase database (in-memory execution via stdin)...');
  execSync('npx supabase db query --linked', { input: sql, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('✓ Successfully registered invite code in remote database.');
  console.log('\n=============================================================');
  console.log('SHARE THIS ONE-TIME INVITE WITH THE FACULTY MEMBER:');
  console.log(`  Faculty Email:  ${email}`);
  console.log(`  Invite Code:    ${inviteCode}`);
  console.log(`  Expires In:     ${days} days`);
  console.log('=============================================================\n');
} catch (err) {
  console.warn('⚠️ Direct CLI link execution was not available. Here is the SQL to run manually in Supabase SQL Editor:');
  console.log(sql);
  console.log('=============================================================');
  console.log('SHARE THIS ONE-TIME INVITE WITH THE FACULTY MEMBER:');
  console.log(`  Faculty Email:  ${email}`);
  console.log(`  Invite Code:    ${inviteCode}`);
  console.log(`  Expires In:     ${days} days`);
  console.log('=============================================================\n');
}
