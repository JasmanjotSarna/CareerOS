const key = process.env.GEMINI_API_KEY || '';
if (!key) {
  console.error('Error: GEMINI_API_KEY environment variable is required.');
  process.exit(1);
}
async function testModel(modelName) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Return valid JSON only: {"status": "ok", "model": "' + modelName + '"}' }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });
    const data = await res.json();
    console.log(`[${modelName}] status:`, res.status);
    if (!res.ok) {
      console.log(`[${modelName}] error body:`, JSON.stringify(data));
    } else {
      console.log(`[${modelName}] output:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
    }
  } catch (err) {
    console.error(`[${modelName}] fetch error:`, err.message);
  }
}

async function run() {
  await testModel('gemini-flash-latest');
  await testModel('gemini-3.6-flash');
  await testModel('gemini-flash-lite-latest');
}
run();
