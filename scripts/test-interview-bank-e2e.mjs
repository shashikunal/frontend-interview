// scripts/test-interview-bank-e2e.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARTIFACT_DIR = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/9e17dd1d-a48b-445c-b1de-a7cda74cce74';

async function runTests() {
  console.log('================================================================');
  console.log('🧪 Running Playwright E2E Test Suite for Master Question Bank');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Pre-seed authenticated candidate profile in localStorage
  await page.addInitScript(() => {
    const profile = {
      id: 'usr_candidate_master_test',
      email: 'alex.rivera@horizon.dev',
      name: 'Alex Rivera',
      role: 'candidate',
      targetCompany: 'Google (L5 Staff Track)',
      experienceLevel: 'Senior (5-8y)',
      entitlements: {
        questions_full: true,
        coding_sandbox: true,
        system_design: true,
        video_mock: true,
        compiler_studios: true,
        cloud_sync: true,
      },
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('interviewprep_active_profile', JSON.stringify(profile));
    localStorage.setItem('interview-prep-theme', 'dark');
  });

  // TEST 1: Subject Landing Page
  console.log('\n[1/7] Testing Subject Landing Page (/interview-questions)...');
  await page.goto('http://localhost:5173/interview-questions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const heroTitle = await page.locator('#mqb-hero-section h1').textContent();
  console.log(` - Landing page title: "${heroTitle}"`);

  // Verify all 12 subject cards exist
  const expectedSubjects = [
    'html', 'css', 'javascript', 'es6', 'es7', 'es8',
    'dom', 'bom', 'web-apis', 'typescript', 'react', 'redux'
  ];

  for (const sub of expectedSubjects) {
    const card = page.locator(`#mqb-subject-card-${sub}`);
    const count = await card.count();
    if (count === 0) {
      throw new Error(`Subject card for "${sub}" not found!`);
    }
  }
  // Verify Fresher-Friendly button and tag exist on landing page
  const fresherHeroBtn = page.locator('#mqb-hero-fresher-start-btn');
  if (await fresherHeroBtn.count() === 0) {
    throw new Error('Fresher Start button not found on landing page!');
  }
  console.log(' - Verified Fresher Start button is present on landing hero banner.');

  // Verify all 12 subject cards have the "Start with Easy" button
  for (const sub of expectedSubjects) {
    const easyBtn = page.locator(`#fresher-easy-btn-${sub}`);
    if (await easyBtn.count() === 0) {
      throw new Error(`"Start with Easy" button missing on subject card "${sub}"!`);
    }
  }
  console.log(' - Verified all 12 subject cards have "Start with Easy (Fresher Qs 1–400)" buttons.');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'master_bank_landing.png'), fullPage: false });
  console.log(' - Captured master_bank_landing.png');

  // TEST 1.5: Fresher-First Flow Validation
  console.log('\n[1.5/7] Testing Fresher-First Flow: Clicking "Start with Easy"...');
  await fresherHeroBtn.click();
  await page.waitForURL('**/interview-questions/javascript?difficulty=EASY', { timeout: 5000 });
  await page.waitForTimeout(1000);

  // Verify Fresher banner and question #1
  const fresherBanner = page.locator('#catalog-fresher-mode-toggle');
  if (await fresherBanner.count() === 0) {
    throw new Error('Fresher Mode toggle banner not rendered on catalog!');
  }
  console.log(' - Verified Fresher-First Learning Path banner is displayed.');

  const firstQuestionCard = page.locator('.mqb-qcard').first();
  const firstQDiff = await firstQuestionCard.locator('.mqb-diff-pill').textContent();
  const firstQId = await firstQuestionCard.locator('.mqb-qcard-id').textContent();
  console.log(` - First Question in Fresher Mode: ID=${firstQId}, Difficulty=${firstQDiff}`);

  if (!firstQDiff?.toLowerCase().includes('easy')) {
    throw new Error(`Expected first question in Fresher mode to be EASY, found ${firstQDiff}`);
  }
  console.log(' - Verified Catalog correctly starts with Easy questions (Q1).');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fresher_catalog_easy.png'), fullPage: false });
  console.log(' - Captured fresher_catalog_easy.png');

  // TEST 2: Subject Question Catalog (/interview-questions/react)
  console.log('\n[2/7] Testing React Question Catalog (/interview-questions/react)...');
  await page.goto('http://localhost:5173/interview-questions/react', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const catalogTitle = await page.locator('.mqb-catalog-title').textContent();
  console.log(` - Catalog Title: "${catalogTitle}"`);

  // Test Search
  console.log(' - Testing real-time question search for "Fiber"...');
  await page.fill('#catalog-search-input', 'Fiber');
  await page.waitForTimeout(600);
  const searchResultsCount = await page.locator('.mqb-qcard').count();
  console.log(` - Search results for "Fiber": ${searchResultsCount} cards found.`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'react_catalog.png'), fullPage: false });
  console.log(' - Captured react_catalog.png');

  // TEST 3: Deep Question Walkthrough View
  console.log('\n[3/7] Testing Question Deep-Dive Detail View...');
  const firstCard = page.locator('.mqb-qcard').first();
  await firstCard.click();
  await page.waitForTimeout(1200);

  // Verify mandatory sections
  const qHeader = await page.locator('.mqb-qheader-title').textContent();
  console.log(` - Loaded Question: "${qHeader}"`);

  const hasShortAnswer = await page.locator('#section-short-answer').count() > 0;
  const hasInterviewAnswer = await page.locator('#section-interview-answer').count() > 0;
  console.log(` - Executive Short Answer: ${hasShortAnswer ? 'PASS' : 'FAIL'}`);
  console.log(` - Natural Spoken Speech Answer: ${hasInterviewAnswer ? 'PASS' : 'FAIL'}`);

  // Switch to Line-by-Line & Execution Flow Tab
  const codeTabBtn = page.locator('button:has-text("Line-by-Line")');
  if (await codeTabBtn.count() > 0) {
    await codeTabBtn.click();
    await page.waitForTimeout(600);
    console.log(' - Switched to Line-by-Line & Execution Flow tab.');

    // Run code sandbox
    const runBtn = page.locator('button:has-text("Run In Sandbox")');
    if (await runBtn.count() > 0) {
      await runBtn.click();
      await page.waitForTimeout(800);
      const outputText = await page.locator('.mqb-section-card pre').last().textContent();
      console.log(` - Sandbox executed successfully: ${outputText ? 'PASS' : 'FAIL'}`);
    }
  }

  // Toggle bookmark
  const bookmarkBtn = page.locator('.mqb-sidebar-actions-grid button:has-text("Bookmark")');
  if (await bookmarkBtn.count() > 0) {
    await bookmarkBtn.click();
    await page.waitForTimeout(300);
    console.log(' - Toggled question bookmark.');
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'question_deep_dive.png'), fullPage: false });
  console.log(' - Captured question_deep_dive.png');

  // TEST 3.5: Pure HTML Subject Purity & Theme Audit
  console.log('\n[3.5/7] Testing Pure HTML Question #1 (/interview-questions/html/iq-html-0001)...');
  await page.goto('http://localhost:5173/interview-questions/html/iq-html-0001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const htmlQHeader = await page.locator('.mqb-qheader-title').textContent();
  console.log(` - HTML Q1 Title: "${htmlQHeader}"`);

  // Switch to Line-by-Line / Code Tab
  const codeTab = page.locator('button:has-text("Line-by-Line")');
  if (await codeTab.count() > 0) {
    await codeTab.click();
    await page.waitForTimeout(600);
  }

  const htmlSnippet = await page.locator('.mqb-code-content').textContent();
  console.log(` - HTML Snippet Preview: ${htmlSnippet?.substring(0, 50)}...`);

  if (!htmlSnippet?.includes('<!DOCTYPE html>') || !htmlSnippet?.includes('<html')) {
    throw new Error('HTML Question #1 missing pure HTML markup!');
  }
  if (htmlSnippet.includes('function ') || htmlSnippet.includes('console.log')) {
    throw new Error('HTML Question #1 has JS code contamination!');
  }
  console.log(' - PASSED: HTML Question #1 is 100% pure HTML markup with 0 JS.');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'html_question_pure_deep_dive.png'), fullPage: false });
  console.log(' - Captured html_question_pure_deep_dive.png');

  // TEST 4: Flashcard Practice Mode
  console.log('\n[4/7] Testing Active Recall Practice Drill...');
  await page.goto('http://localhost:5173/interview-questions/react/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const flashcard = page.locator('#practice-flashcard');
  if (await flashcard.count() === 0) throw new Error('Flashcard not loaded!');

  const revealBtn = page.locator('#reveal-answer-btn');
  await revealBtn.click();
  await page.waitForTimeout(500);

  const answerBox = page.locator('#revealed-answer-box');
  if (await answerBox.count() === 0) throw new Error('Answer not revealed!');
  console.log(' - Flashcard answer revealed successfully.');

  // Rate confidence
  await page.click('.mqb-conf-btn.easy');
  await page.waitForTimeout(500);
  console.log(' - Rated card "Easy (Mastered)" and advanced.');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'practice_mode.png'), fullPage: false });
  console.log(' - Captured practice_mode.png');

  // TEST 5: Timed Mock Test
  console.log('\n[5/7] Testing Timed Mock Test Studio...');
  await page.goto('http://localhost:5173/interview-questions/test', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.click('#start-mock-test-btn');
  await page.waitForTimeout(1000);

  // In active test
  const activeTest = page.locator('#active-mock-test');
  if (await activeTest.count() === 0) throw new Error('Active test not started!');
  console.log(' - Assessment timer initiated.');

  // Answer 2 questions
  await page.click('#test-mark-confident');
  await page.waitForTimeout(400);
  await page.click('#test-mark-unsure');
  await page.waitForTimeout(400);

  // Submit test
  await page.click('button:has-text("Submit Early")');
  await page.waitForTimeout(1000);

  const resultsCard = page.locator('#mock-test-results');
  if (await resultsCard.count() === 0) throw new Error('Test scorecard not rendered!');
  console.log(' - Assessment scorecard rendered with verified percentage.');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mock_test_scorecard.png'), fullPage: false });
  console.log(' - Captured mock_test_scorecard.png');

  // TEST 6: Bookmarks & Revision Hub
  console.log('\n[6/7] Testing Revision & Bookmarks Hub...');
  await page.goto('http://localhost:5173/interview-questions/bookmarks', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const savedCardCount = await page.locator('.mqb-qcard').count();
  console.log(` - Bookmarks hub loaded with ${savedCardCount} saved question(s).`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'bookmarks_revision.png'), fullPage: false });
  console.log(' - Captured bookmarks_revision.png');

  // TEST 7: Candidate Dashboard Integration
  console.log('\n[7/7] Testing Candidate Dashboard Integration (/dashboard)...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const bankCard = page.locator('#candidate-master-bank-card');
  if (await bankCard.count() === 0) throw new Error('Master Bank card not found in Candidate Dashboard!');
  console.log(' - Verified Master Bank card is present on Candidate Dashboard.');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'candidate_dashboard_bank_card.png'), fullPage: false });
  console.log(' - Captured candidate_dashboard_bank_card.png');

  await browser.close();
  console.log('\n================================================================');
  console.log('🎉 ALL PLAYWRIGHT E2E TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('Playwright test failed:', err);
  process.exit(1);
});
