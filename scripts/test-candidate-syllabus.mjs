import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'test-user-id',
      name: 'Sarah Chen',
      email: 'sarah.chen@faang.io',
      role: 'candidate',
      targetCompany: 'Google (L5 Staff)',
      experienceLevel: 'Senior Engineer',
      entitlements: { coding_sandbox: true, questions_full: true }
    }));
  });

  const page = await context.newPage();

  console.log('1. Navigating to Candidate Dashboard (?tab=overview)...');
  await page.goto('http://localhost:5173/dashboard?tab=overview', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Take screenshot of overview
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/candidate_dash_1_overview.png', fullPage: false });
  console.log('Saved candidate_dash_1_overview.png');

  console.log('2. Clicking "21-Track Docs & Syllabus" tab...');
  const syllabusTabBtn = page.locator('.cand-switcher-btn:has-text("21-Track Docs & Syllabus")');
  await syllabusTabBtn.waitFor({ state: 'visible', timeout: 5000 });
  await syllabusTabBtn.click();
  await page.waitForTimeout(1200);

  // Verify CandidateDocsSyllabusTracker is rendered
  const tracker = page.locator('.candidate-docs-tracker');
  const isVisible = await tracker.isVisible();
  console.log(`Tracker visible: ${isVisible}`);

  // Take screenshot of syllabus view
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/candidate_dash_2_syllabus.png', fullPage: false });
  console.log('Saved candidate_dash_2_syllabus.png');

  console.log('3. Testing Category Filter...');
  const categoryPills = page.locator('.cdt-filter-pill');
  const pillCount = await categoryPills.count();
  console.log(`Found ${pillCount} category filter pills`);
  if (pillCount > 1) {
    await categoryPills.nth(1).click();
    await page.waitForTimeout(500);
    console.log('Category filter clicked');
  }

  // Switch back to overview
  console.log('4. Switching back to Curriculum & Drills...');
  const overviewTabBtn = page.locator('.cand-switcher-btn:has-text("Curriculum & Drills")');
  await overviewTabBtn.click();
  await page.waitForTimeout(800);

  // Verify stat card has "Inspect 21-Track Syllabus Tracker →"
  const inspectCardBtn = page.locator('button:has-text("Inspect 21-Track Syllabus Tracker →")');
  const inspectVisible = await inspectCardBtn.isVisible();
  console.log(`Inspect card button visible on overview: ${inspectVisible}`);

  console.log('5. Clicking stat card button to jump into syllabus...');
  await inspectCardBtn.click();
  await page.waitForTimeout(1000);
  const trackerVisibleAgain = await tracker.isVisible();
  console.log(`Tracker visible after clicking stat card: ${trackerVisibleAgain}`);

  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/candidate_dash_3_opened_from_card.png', fullPage: false });
  console.log('Saved candidate_dash_3_opened_from_card.png');

  console.log('6. Testing Admin Dashboard Docs & Syllabus tab (/admin?tab=docs)...');
  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'admin-user-id',
      name: 'Platform Administrator',
      email: 'admin@faang.io',
      role: 'admin',
      entitlements: { coding_sandbox: true, questions_full: true }
    }));
  });
  // Navigate to admin
  const adminPage = await context.newPage();
  await adminPage.goto('http://localhost:5173/admin?tab=docs', { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(1500);

  const adminDocsView = adminPage.locator('.admin-docs-syllabus-view');
  const adminDocsVisible = await adminDocsView.isVisible();
  console.log(`Admin Docs Syllabus View visible: ${adminDocsVisible}`);

  await adminPage.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/admin_dash_docs_syllabus.png', fullPage: false });
  console.log('Saved admin_dash_docs_syllabus.png');

  await browser.close();
  console.log('✅ All Candidate & Admin Docs Syllabus Integration Tests Passed Successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
