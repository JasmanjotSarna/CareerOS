const routes = [
  '/',
  '/login',
  '/signup',
  '/onboarding',
  '/dashboard',
  '/suitability',
  '/skills',
  '/roadmap',
  '/resume',
  '/interviews/technical',
  '/interviews/hr',
  '/communication',
  '/aptitude',
  '/progress',
  '/profile',
  '/coach',
  '/faculty/dashboard',
  '/faculty/students',
];

async function checkRoutes() {
  console.log('--- Verifying CareerOS Pages ---');
  let failures = 0;
  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, {
        headers: {
          // Send demo cookies so protected routes return 200 instead of redirect
          'Cookie': 'careeros_demo_session=faculty; careeros_persona=faculty'
        },
        redirect: 'manual'
      });
      const status = res.status;
      if (status >= 200 && status < 400) {
        console.log(`✓ [${status}] ${route}`);
      } else {
        console.error(`✗ [${status}] ${route}`);
        failures++;
      }
    } catch (err) {
      console.error(`✗ [ERR] ${route}: ${err.message}`);
      failures++;
    }
  }

  console.log('\n--- Verifying AI Route Handlers (POST Validation / Fallback) ---');
  const mockTargetRole = {
    id: 'sde-1',
    title: 'Software Engineer — SDE-1',
    category: 'Engineering',
    requiredSkills: [
      { name: 'Python', requiredProficiency: 80, critical: true, category: 'Programming' },
      { name: 'SQL', requiredProficiency: 75, critical: true, category: 'Data' }
    ],
    educationExpectations: "Bachelor's in CS or equivalent",
    interviewAreas: ['Technical Coding', 'System Design', 'HR'],
    salaryRange: '$80,000 - $110,000'
  };

  const mockProfile = {
    fullName: 'Jasmanjot Singh',
    degree: 'B.Tech Computer Science',
    branch: 'CSE',
    cgpa: 8.8,
    skills: [
      { name: 'Python', currentProficiency: 85, category: 'Programming', verified: true },
      { name: 'SQL', currentProficiency: 70, category: 'Data', verified: true }
    ]
  };

  const aiRoutes = [
    { url: '/api/ai/resume', body: { action: 'extractSkills', resumeText: 'Proficient in Python, React, and SQL.' } },
    { url: '/api/ai/suitability', body: { action: 'jobRequirements', targetRole: mockTargetRole } },
    { url: '/api/ai/roadmap', body: { action: 'nextBestAction', readinessScore: { overall: 72, technical: 68, communication: 75 }, targetRole: mockTargetRole } },
    { url: '/api/ai/technical', body: { action: 'generateQuestion', roleTitle: 'Software Engineer — SDE-1', difficulty: 'Medium' } },
    { url: '/api/ai/hr', body: { action: 'generateQuestion', category: 'Behavioral', experienceLevel: 'fresher' } },
    { url: '/api/ai/communication', body: { transcript: 'I think that, like, we should definitely optimize our database queries.', targetDurationSeconds: 60 } },
    { url: '/api/ai/faculty', body: { studentName: 'Test Student', riskFactors: ['Low readiness in DSA'], targetRole: 'Software Engineer — SDE-1' } },
  ];

  for (const item of aiRoutes) {
    try {
      const res = await fetch(`http://localhost:3000${item.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'careeros_demo_session=student; careeros_persona=student'
        },
        body: JSON.stringify(item.body)
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        console.log(`✓ [${res.status}] ${item.url} -> returned valid data:`, Object.keys(data).join(', '));
      } else {
        console.error(`✗ [${res.status}] ${item.url}:`, data);
        failures++;
      }
    } catch (err) {
      console.error(`✗ [ERR] ${item.url}: ${err.message}`);
      failures++;
    }
  }

  console.log(`\nVerification finished with ${failures} failure(s).`);
  process.exit(failures > 0 ? 1 : 0);
}

checkRoutes();
