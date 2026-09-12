const fs = require('fs');

// 1. Batch 1 IDs
const cp1 = fs.readFileSync('src/components/coreprogramming/data/batches/batch01.ts', 'utf8');
const cpMatch = [...cp1.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Sample CP Batch 1 IDs:', cpMatch.slice(0, 10));

// 2. Check all batches
for (let b = 1; b <= 10; b++) {
  const pad = b < 10 ? '0' + b : '' + b;
  const p = `src/components/coreprogramming/data/batches/batch${pad}.ts`;
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const ids = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    console.log(`Batch ${pad}: ${ids.length} questions (First: ${ids[0]}, Last: ${ids[ids.length - 1]})`);
  }
}

// 3. Check Frontend JS Catalog
if (fs.existsSync('src/components/frontendjs/data/frontendJsQuestions.ts')) {
  const fjsContent = fs.readFileSync('src/components/frontendjs/data/frontendJsQuestions.ts', 'utf8');
  const fjsIds = [...fjsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`Frontend JS: ${fjsIds.length} questions (First: ${fjsIds[0]})`);
}
