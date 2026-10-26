const resumeSarah = `
Sarah Lin
Email: sarah.lin@example.com | GitHub: github.com/sarahlin

PROFESSIONAL SUMMARY
Passionate Frontend and Full-Stack Developer with 2 years of hands-on experience building reactive user interfaces in React.js, TypeScript, Next.js, and Node.js.

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, HTML5, CSS3, Python
- Frameworks & Libraries: React.js, Next.js, Redux Toolkit, Tailwind CSS, Express.js, SQL
- Developer Tools: Git, GitHub, Webpack, Vite, Jest, Cypress, Vercel

PROJECTS
Collaborative Whiteboard Application (React.js, TypeScript, WebSockets)
- Developed real-time collaborative canvas allowing multiple simultaneous users to draw and annotate.
- Built WebSocket event dispatcher handling 50 concurrent browser sessions with minimal latency.
- Implemented state synchronization using Redux Toolkit to prevent race conditions.

E-Commerce Storefront (Next.js, Tailwind, Stripe)
- Created responsive e-commerce web application with server-side rendering in Next.js for high SEO ranking.
- Integrated Stripe checkout API with client-side form validation using Zod.
- Wrote unit tests in Jest achieving 82% code coverage on core payment utility functions.
`;

const mockTargetRole = {
  id: 'role-sde-1',
  title: 'Software Engineer — SDE-1',
  category: 'Software Engineering',
  requiredSkills: [
    { name: 'Python', category: 'Programming', requiredProficiency: 85, weight: 1, critical: true },
    { name: 'Data Structures', category: 'Programming', requiredProficiency: 85, weight: 1, critical: true },
    { name: 'SQL', category: 'Data', requiredProficiency: 80, weight: 0.9, critical: true },
    { name: 'React', category: 'Frontend', requiredProficiency: 80, weight: 0.8, critical: false },
  ]
};

async function testResumeApi() {
  console.log('--- Testing Real Resume Processing via /api/ai/resume ---');

  // Test 1: Extract Skills
  const extractRes = await fetch('http://localhost:3000/api/ai/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'careeros_demo_session=student; careeros_persona=student'
    },
    body: JSON.stringify({
      action: 'extractSkills',
      resumeText: resumeSarah
    })
  });

  const extractData = await extractRes.json();
  console.log('1. Extract Skills Status:', extractRes.status);
  console.log('   Extracted Skills Count:', extractData.skills?.length || 0);
  console.log('   Sample Skills:', (extractData.skills || []).slice(0, 8).map(s => typeof s === 'string' ? s : s.name).join(', '));

  // Test 2: Full Resume Analysis
  const analyzeRes = await fetch('http://localhost:3000/api/ai/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'careeros_demo_session=student; careeros_persona=student'
    },
    body: JSON.stringify({
      action: 'analyzeResume',
      resumeText: resumeSarah,
      targetRole: mockTargetRole
    })
  });

  const analyzeData = await analyzeRes.json();
  console.log('\n2. Analyze Resume Status:', analyzeRes.status);
  console.log('   ATS Overall Score:', analyzeData.atsScore || analyzeData.overallScore || 'N/A');
  console.log('   Key Strengths:', analyzeData.strengths?.length || 0);
  console.log('   Identified Gaps:', analyzeData.gaps?.length || 0);
  console.log('   Response Keys:', Object.keys(analyzeData).join(', '));

  if (extractRes.ok && (analyzeRes.ok || analyzeRes.status === 200)) {
    console.log('\n✓ Resume Studio API verification PASSED.');
    process.exit(0);
  } else {
    console.error('\n✗ Resume Studio API verification FAILED.');
    process.exit(1);
  }
}

testResumeApi().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
