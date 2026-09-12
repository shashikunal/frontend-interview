const fs = require('fs');

const content = fs.readFileSync('src/components/machinecoding/data/machineCodingCatalog.ts', 'utf8');
const cats = [...content.matchAll(/"category":\s*"([^"]+)"/g)].map(m => m[1]);
const catCounts = {};
for (const c of cats) {
  catCounts[c] = (catCounts[c] || 0) + 1;
}
console.log('Total MC Catalog items found:', cats.length);
console.log('Categories in MACHINE_CODING_CATALOG:', catCounts);
