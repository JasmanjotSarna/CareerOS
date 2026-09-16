const key = process.env.GEMINI_API_KEY || '';
if (!key) {
  console.error('Error: GEMINI_API_KEY environment variable is required.');
  process.exit(1);
}
async function list() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const data = await res.json();
  const generateModels = (data.models || []).filter(m => m.supportedGenerationMethods?.includes('generateContent'));
  console.log('Supported generateContent models:');
  generateModels.forEach(m => console.log(`- ${m.name}`));
}
list();
