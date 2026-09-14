import fs from 'fs';

async function parseGuides() {
  const res = await fetch('https://developer.mozilla.org/en-US/docs/Web/HTML');
  const t = await res.text();
  const guideIdx = t.indexOf('id="guides"');
  const refIdx = t.indexOf('id="reference"');
  console.log('--- GUIDES SECTION ---');
  console.log(t.slice(guideIdx, refIdx));
  console.log('--- REFERENCE SECTION ---');
  console.log(t.slice(refIdx, refIdx + 1500));
}

parseGuides().catch(console.error);
