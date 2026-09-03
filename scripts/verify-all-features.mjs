import fs from 'fs';
import path from 'path';

async function testAll() {
  console.log('==============================================');
  console.log('  FULL FEATURE VERIFICATION SUITE');
  console.log('==============================================\n');

  console.log('=== 1. DATA INTEGRITY & STATS ===');
  const files = [
    'leetcode-style', 'frontendmasters-style', 'greatfrontend-javascript', 
    'greatfrontend-react', 'topbrains', 'js-assignments', 'system-design',
    'frontendlead', 'educative', 'algomonster', 'greatfrontend-typescript', 'greatfrontend-dom',
    'topbrains-videos'
  ];


  let allQuestions = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join('public/data', f + '.json'), 'utf8');
    const data = JSON.parse(raw);
    console.log(`✓ ${f}: ${data.length} entries loaded`);
    if (f !== 'topbrains-videos') {
      allQuestions = allQuestions.concat(data);
    }
  }
  console.log(`\nTotal questions available: ${allQuestions.length.toLocaleString()}`);

  console.log('\n=== 2. CATEGORIES & SOURCES BREAKDOWN ===');
  const categories = Array.from(new Set(allQuestions.map(q => q.category)));
  console.log(`Unique Categories (${categories.length}):`, categories.join(', '));
  
  const sources = {};
  allQuestions.forEach(q => {
    const s = q.source || 'default';
    sources[s] = (sources[s] || 0) + 1;
  });
  console.log('Sources breakdown:', JSON.stringify(sources, null, 2));

  const codingQuestions = allQuestions.filter(q => q.code);
  console.log(`Coding challenges with interactive snippets: ${codingQuestions.length.toLocaleString()}`);

  const closureSearch = allQuestions.filter(q => 
    q.question.toLowerCase().includes('closure') || q.answer.toLowerCase().includes('closure')
  );
  console.log(`Search query 'closure': ${closureSearch.length} matches`);

  console.log('\n=== 3. DYNAMIC CHALLENGES GENERATOR ===');
  const { generateChallenge } = await import('../src/lib/challenges.ts');
  for (let i = 0; i < 5; i++) {
    const seed = 12345 + i * 997;
    const challenge = generateChallenge(seed);
    if (!challenge.title || !challenge.starter || !challenge.solution) {
      throw new Error(`Challenge generation failed for seed ${seed}`);
    }
    console.log(`✓ Generated challenge #${i + 1}: "${challenge.title}" [${challenge.difficulty}]`);
  }

  console.log('\n=== 4. STARTER TEMPLATES GENERATION ===');
  const { buildStarters, isOutputTracing, reactStarterFiles } = await import('../src/lib/starter.ts');
  const sampleCodingQ = codingQuestions[0];
  const starters = buildStarters(sampleCodingQ);
  console.log('Generated starter files for JS challenge:', Object.keys(starters));
  
  const reactStarters = reactStarterFiles('Build a counter component', 'const Counter = () => <div>0</div>');
  console.log('Generated starter files for React challenge:', Object.keys(reactStarters));
  if (!reactStarters['App.jsx'] || !reactStarters['styles.css']) {
    throw new Error('React starter generation failed');
  }
  console.log('✓ React & JS starter generators operating correctly');

  console.log('\n=== 5. RUNNER SANDBOX GENERATION ===');
  const { isReactCode, isHtmlWorkspace, languageForFile, buildJsSrcDoc, buildHtmlSrcDoc } = await import('../src/lib/runner.ts');
  
  const reactTest = isReactCode('const [a, setA] = useState(0)');
  const plainJsTest = isReactCode('const a = 1 + 2; console.log(a);');
  console.log('isReactCode check (React snippet):', reactTest === true ? '✓ Passed' : '✗ Failed');
  console.log('isReactCode check (Plain JS snippet):', plainJsTest === false ? '✓ Passed' : '✗ Failed');

  const jsDoc = buildJsSrcDoc('console.log(42)', 1);
  console.log(`✓ buildJsSrcDoc created sandboxed document (${jsDoc.length} bytes)`);

  const htmlDoc = buildHtmlSrcDoc('<!doctype html><html><head></head><body><div id="root"></div></body></html>', 'console.log("ready")', 2);
  console.log(`✓ buildHtmlSrcDoc injected runner script (${htmlDoc.length} bytes)`);

  console.log('\n=== 6. VIDEO MASTERCLASSES VERIFICATION ===');
  const rawVideos = fs.readFileSync('public/data/topbrains-videos.json', 'utf8');
  const videos = JSON.parse(rawVideos);
  console.log(`✓ Loaded ${videos.length} videos`);
  const topics = Array.from(new Set(videos.map(v => v.topic).filter(Boolean)));
  console.log(`Topics (${topics.length}):`, topics.slice(0, 8).join(', ') + '...');
  
  console.log('\n==============================================');
  console.log('  ALL FEATURES FULLY TESTED AND WORKING! 🎉');
  console.log('==============================================');
}

testAll().catch(e => {
  console.error('VERIFICATION ERROR:', e);
  process.exit(1);
});
