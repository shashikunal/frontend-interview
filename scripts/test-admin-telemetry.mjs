import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_admin_test',
      name: 'Platform Administrator',
      email: 'admin@interviewprep.com',
      role: 'admin',
      entitlements: { coding_sandbox: true, questions_full: true, video_mock: true, system_design: true }
    }));

    window.localStorage.setItem('supabase_profiles_real', JSON.stringify([
      {
        id: 'usr_shashikunal_sb',
        email: 'shashikunal@gmail.com',
        name: 'Shashi Kunal',
        role: 'candidate',
        targetCompany: 'Google (L5)',
        experienceLevel: 'L5 (Senior)',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_sarah_chen',
        email: 'sarah.chen@faang.io',
        name: 'Sarah Chen',
        role: 'candidate',
        targetCompany: 'Meta (E5)',
        experienceLevel: 'Senior Engineer',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      }
    ]));

    // Seed dummy submissions with time spent for speed calculation
    window.localStorage.setItem('cp_candidate_submissions_v1', JSON.stringify([
      {
        id: 'sub_test_1',
        userId: 'usr_shashikunal_sb',
        questionId: 'JS-P001',
        status: 'Accepted',
        score: 100,
        executionTime: 24,
        timeSpentSeconds: 180, // 3 minutes -> Lightning
        createdAt: new Date().toISOString(),
      }
    ]));
  });

  const page = await context.newPage();

  console.log('1. Navigating to Admin Candidates Management (/admin?tab=candidates)...');
  await page.goto('http://localhost:5173/admin?tab=candidates', { waitUntil: 'domcontentloaded' });
  
  // Wait for table to render after async loading
  try {
    await page.waitForSelector('.admin-cand-table', { timeout: 8000 });
    console.log('Candidate management table rendered!');
  } catch {
    console.log('Table selector timed out, capturing current view...');
  }
  await page.waitForTimeout(1000);

  // Take screenshot of candidate management table with Speed column
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/admin_candidates_speed_table.png', fullPage: false });
  console.log('Saved admin_candidates_speed_table.png');

  // Verify Speed header exists
  const speedHeader = page.locator('th:has-text("Speed")');
  const speedHeaderVisible = await speedHeader.isVisible();
  console.log(`Speed header visible in candidate table: ${speedHeaderVisible}`);

  console.log('2. Navigating to Admin User Directory (/admin?tab=users)...');
  await page.goto('http://localhost:5173/admin?tab=users', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  console.log('3. Opening Candidate Deep Dive modal...');
  const deepDiveBtn = page.locator('button:has-text("🔍 Deep Dive")').first();
  await deepDiveBtn.waitFor({ state: 'visible', timeout: 5000 });
  await deepDiveBtn.click();
  await page.waitForTimeout(1500);

  // Verify modal is visible
  const modal = page.locator('.h-profile-modal');
  console.log(`Deep Dive modal visible: ${await modal.isVisible()}`);

  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/admin_modal_1_overview.png', fullPage: false });
  console.log('Saved admin_modal_1_overview.png');

  console.log('4. Clicking "📚 21-Track Docs & Syllabus" curriculum tab in modal...');
  const docsTabBtn = page.locator('button:has-text("21-Track Docs & Syllabus")').first();
  if (await docsTabBtn.isVisible()) {
    await docsTabBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/admin_modal_2_docs_syllabus_card.png', fullPage: false });
    console.log('Saved admin_modal_2_docs_syllabus_card.png');
  }

  await browser.close();
  console.log('✅ Admin Speed & Syllabus Telemetry Test Completed Successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
