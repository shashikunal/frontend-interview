const http = require('http');

async function main() {
  console.log('Testing /api/system-status...');
  const resStatus = await fetch('http://localhost:5173/api/system-status');
  console.log('Status HTTP:', resStatus.status);
  const statusData = await resStatus.json();
  console.log('Status Data:', JSON.stringify(statusData, null, 2));

  console.log('\nTesting /api/ollama/generate via proxy...');
  const genPayload = {
    model: 'llama3.2:latest',
    prompt: 'Evaluate this interview answer: "Debouncing delays function execution until after a specified silence period. Throttling limits function execution to once per time window." Return JSON with numericScore (0-10) and feedback summary.',
    stream: false,
    format: 'json'
  };

  const start = Date.now();
  const resGen = await fetch('http://localhost:5173/api/ollama/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(genPayload)
  });
  const elapsed = Date.now() - start;
  console.log(`Ollama HTTP: ${resGen.status} (took ${elapsed}ms)`);
  const genData = await resGen.json();
  console.log('Ollama Response snippet:\n', genData.response.slice(0, 300));
  console.log('\n✅ Verification of Ollama proxy and generation successful!');
}

main().catch(err => {
  console.error('Error testing:', err);
  process.exit(1);
});
