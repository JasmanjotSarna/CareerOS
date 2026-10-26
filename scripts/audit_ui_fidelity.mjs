const pages = [
  '/',
  '/dashboard',
  '/coach',
  '/jobs',
  '/applications',
  '/resume',
  '/interviews/technical',
  '/interviews/hr',
  '/skills',
  '/roadmap',
  '/portfolio',
  '/networking',
  '/tasks',
  '/analytics',
  '/settings',
  '/suitability',
  '/progress',
  '/login',
  '/signup',
  '/onboarding'
];

async function auditPages() {
  console.log('=====================================================');
  console.log('   CareerOS UI Fidelity & Component Audit Report     ');
  console.log('=====================================================\n');

  let passedPages = 0;
  const issues = [];

  for (const page of pages) {
    try {
      const res = await fetch(`http://localhost:3000${page}`, {
        headers: {
          'Cookie': 'careeros_demo_session=student; careeros_persona=student',
          'Connection': 'close'
        },
        redirect: 'manual'
      });

      const status = res.status;
      const html = await res.text();

      if (status !== 200 && status !== 307) {
        issues.push({ page, type: 'HTTP_ERROR', detail: `Status ${status}` });
        continue;
      }

      passedPages++;

      // Check key visual & functional markers in the rendered HTML
      const hasNavigation = html.includes('nav') || html.includes('StudentSidebar') || html.includes('TopNav') || html.includes('Dashboard');
      const hasHeading = /<h[1-3]/i.test(html);
      const hasInteractiveButtons = /<button/i.test(html) || /<a /i.test(html);
      const hasDarkCanvas = html.includes('bg-[var(--bg-canvas)]') || html.includes('min-h-screen');

      // Check for generic or broken patterns
      const hasUndefinedText = html.includes('undefined') || html.includes('NaN');
      const hasGenericLorem = html.includes('Lorem ipsum');

      console.log(`✓ [${status}] ${page.padEnd(24)} | Length: ${html.length.toString().padStart(6)} bytes | Nav: ${hasNavigation} | H1-3: ${hasHeading} | Buttons: ${hasInteractiveButtons}`);

      if (hasUndefinedText) {
        // Find context around undefined
        const match = html.match(/.{0,30}(?:undefined|NaN).{0,30}/);
        issues.push({ page, type: 'UNRESOLVED_TEXT', detail: match ? match[0] : 'Found undefined/NaN in DOM' });
      }

      if (hasGenericLorem) {
        issues.push({ page, type: 'PLACEHOLDER_LOREM', detail: 'Found raw Lorem ipsum text in production path' });
      }

    } catch (err) {
      issues.push({ page, type: 'FETCH_FAIL', detail: err.message });
      console.error(`✗ [ERR] ${page}: ${err.message}`);
    }
  }

  console.log(`\nAudit finished: ${passedPages}/${pages.length} pages verified.`);
  if (issues.length > 0) {
    console.log('\n--- Issues Discovered ---');
    issues.forEach(i => console.log(`• [${i.page}] ${i.type}: ${i.detail}`));
  } else {
    console.log('\n✓ Zero missing templates or unrendered undefined text across all audited screens.');
  }

  return issues;
}

auditPages().catch(console.error);
