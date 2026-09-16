const http = require('http');

const routes = [
  '/',
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
  '/coach',
  '/profile',
  '/login',
  '/signup',
  '/onboarding',
  '/faculty/dashboard',
  '/faculty/students',
  '/faculty/students/std-jasmanjot-01',
  '/faculty/students/std-rahul-02'
];

async function verifyAll() {
  console.log('--- CareerOS Route Verification ---');
  let passed = 0;
  for (const r of routes) {
    await new Promise((resolve) => {
      http.get('http://localhost:3000' + r, (res) => {
        if (res.statusCode === 200) {
          console.log(`✓ [200 OK] ${r}`);
          passed++;
        } else {
          console.log(`✗ [${res.statusCode}] ${r}`);
        }
        resolve();
      }).on('error', (err) => {
        console.log(`✗ [FAIL] ${r} - ${err.message}`);
        resolve();
      });
    });
  }
  console.log(`Verification completed: ${passed}/${routes.length} routes healthy.`);
}

verifyAll();
