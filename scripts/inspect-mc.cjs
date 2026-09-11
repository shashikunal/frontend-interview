const fs = require('fs');

const mcFile = fs.readFileSync('src/components/machinecoding/data/machineCodingCatalog.ts', 'utf8');
const idMatches = [...mcFile.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total MC Catalog Questions:', idMatches.length);
console.log('First 20 MC IDs:', idMatches.slice(0, 20));

const titleMatches = [...mcFile.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('First 20 MC Titles:', titleMatches.slice(0, 20));
