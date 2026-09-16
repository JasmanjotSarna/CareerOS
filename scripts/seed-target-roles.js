/**
 * Seed script for target roles into Supabase
 * Usage: node scripts/seed-target-roles.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('No SUPABASE_URL or keys found in .env.local; skipping remote seed execution.');
  console.log('Note: The SQL migration in supabase/migrations/20260916000000_careeros_initial_schema.sql contains the complete seed data ready for Supabase SQL Editor.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedRoles() {
  const mockDataContent = fs.readFileSync(path.join(__dirname, '../src/lib/data/mockData.ts'), 'utf8');
  const startIdx = mockDataContent.indexOf('export const TARGET_ROLES: TargetRole[] = [');
  const endIdx = mockDataContent.indexOf('export const TECHNICAL_QUESTIONS');
  const rolesBlock = mockDataContent.slice(startIdx + 'export const TARGET_ROLES: TargetRole[] = '.length, endIdx).trim().replace(/;\s*$/, '');
  const targetRoles = eval(rolesBlock);

  console.log(`Seeding ${targetRoles.length} target roles into Supabase...`);

  for (const role of targetRoles) {
    const { error } = await supabase
      .from('target_roles')
      .upsert({
        id: role.id,
        title: role.title,
        category: role.category,
        description: role.description,
        salary_range: role.salaryRange,
        market_demand: role.marketDemand,
        experience_level: role.experienceLevel,
        education_expectations: role.educationExpectations,
        experience_expectations: role.experienceExpectations,
        soft_skills: role.softSkills,
        interview_areas: role.interviewAreas,
        aptitude_areas: role.aptitudeAreas,
        communication_expectations: role.communicationExpectations,
        required_skills: role.requiredSkills
      }, { onConflict: 'id' });

    if (error) {
      console.error(`Failed to seed ${role.id}:`, error.message);
    } else {
      console.log(`✓ Seeded ${role.title} (${role.id})`);
    }
  }

  console.log('Seeding complete!');
}

seedRoles().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
