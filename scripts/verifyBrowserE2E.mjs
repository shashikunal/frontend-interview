// scripts/verifyBrowserE2E.mjs
import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/8cf89aca-6c89-44b4-9194-cd9f5500dc31';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Set candidate profile before loading
  await page.addInitScript(() => {
    const candProfile = {
      id: 'usr_candidate_demo',
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
    localStorage.setItem('interviewprep_active_profile', JSON.stringify(candProfile));
    localStorage.setItem('interview-prep-theme', 'light');
  });

  console.log('1. Navigating to Core Programming Catalog...');
  await page.goto('http://localhost:5173/core-programming', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cp_catalog_perfect.png'), fullPage: false });
  console.log('Saved cp_catalog_perfect.png');

  console.log('2. Navigating to JS-P001 workspace...');
  await page.goto('http://localhost:5173/core-programming/js-p001-reverse-a-string-reversestring', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Click Reset to ensure starter code is loaded or clean
  const resetBtn = page.locator('button:has-text("Reset")');
  if (await resetBtn.count() > 0) {
    await resetBtn.first().click();
    await page.waitForTimeout(500);
  }

  // Click Run Code
  console.log('3. Running code for JS-P001...');
  const runBtn = page.locator('button:has-text("Run Code")');
  if (await runBtn.count() > 0) {
    await runBtn.first().click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'jsp001_run_passed.png') });
  console.log('Saved jsp001_run_passed.png');

  // Switch to Editorial tab
  console.log('4. Checking Editorial tab...');
  const editorialTab = page.locator('button:has-text("Editorial")');
  if (await editorialTab.count() > 0) {
    await editorialTab.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'jsp001_editorial.png') });
    console.log('Saved jsp001_editorial.png');
  }

  // Switch to Hints tab
  console.log('5. Checking Hints tab...');
  const hintsTab = page.locator('button:has-text("Hints")');
  if (await hintsTab.count() > 0) {
    await hintsTab.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'jsp001_hints.png') });
    console.log('Saved jsp001_hints.png');
  }

  // Open Problem List Drawer
  console.log('6. Opening Problem List Drawer...');
  const drawerBtn = page.locator('button:has-text("Problem List")');
  if (await drawerBtn.count() > 0) {
    await drawerBtn.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'jsp001_drawer.png') });
    console.log('Saved jsp001_drawer.png');
  }

  // Navigate to JS-P500
  console.log('7. Navigating to JS-P500...');
  await page.goto('http://localhost:5173/core-programming/js-p500-bloom-filter-membership-testing-createbloomfilter', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'jsp500_workspace.png') });
  console.log('Saved jsp500_workspace.png');

  await browser.close();
  console.log('E2E Browser verification complete!');
}

main().catch(err => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});
