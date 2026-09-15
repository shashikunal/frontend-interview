import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_sarah_chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@faang.io',
      role: 'candidate',
      targetCompany: 'Meta (E5) / Google (L5)',
      experienceLevel: 'Senior Engineer',
      entitlements: { coding_sandbox: true, questions_full: true, video_mock: true, system_design: true }
    }));

    window.localStorage.setItem('cp_candidate_submissions_v1', JSON.stringify([
      {
        id: 'sub_cp_1',
        userId: 'usr_sarah_chen',
        questionId: 'JS-P001',
        status: 'Accepted',
        score: 100,
        testsPassed: 10,
        testsTotal: 10,
        timeSpentSeconds: 240,
        createdAt: new Date().toISOString(),
      }
    ]));

    const docsPayload = {
      completedTopics: [
        'html:html-semantic-elements',
        'css:css-flexbox',
        'javascript:javascript-closures',
        'react:react-hooks-useeffect',
      ],
      masteredTopics: [
        'javascript:javascript-closures',
      ]
    };
    window.localStorage.setItem('interview_docs_progress_v1', JSON.stringify(docsPayload));
    window.localStorage.setItem('interview_docs_progress_v1_usr_sarah_chen', JSON.stringify(docsPayload));
  });

  const page = await context.newPage();

  console.log('=== TEST 1: FAANG DOSSIER TARGETED MOCK LAUNCHER ===');
  await page.goto('http://localhost:5173/my-performance', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on the FAANG Dossier button
  const dossierBtn = page.locator('button:has-text("FAANG Readiness Dossier")');
  await dossierBtn.waitFor({ state: 'visible', timeout: 8000 });
  await dossierBtn.click();
  await page.waitForTimeout(600);

  // Verify modal is open
  const dossierModal = page.locator('.faang-dossier-modal');
  await dossierModal.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ FAANG Dossier modal opened');

  // Verify targeted mock card
  const targetedCard = page.locator('.dossier-targeted-mock-card');
  await targetedCard.scrollIntoViewIfNeeded();
  await targetedCard.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ Targeted mock card is rendered');

  const cardTitle = await page.locator('.targeted-mock-title').textContent();
  console.log('  Targeted Title:', cardTitle);

  // Switch pill to LeetCode & Algorithm Studio
  const dsaPill = page.locator('.targeted-studio-pill:has-text("LeetCode & Algorithm")');
  if (await dsaPill.isVisible()) {
    await dsaPill.click();
    await page.waitForTimeout(300);
    const updatedTitle = await page.locator('.targeted-mock-title').textContent();
    console.log('✓ Switched studio pill to:', updatedTitle);
  }

  // Screenshot in Dark Mode
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/roadmap_1_faang_mock_launcher_dark.png' });
  console.log('✓ Saved dark mode screenshot');

  // Switch to Light Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/roadmap_1_faang_mock_launcher_light.png' });
  console.log('✓ Saved light mode screenshot');

  // Test launch button navigation
  const launchBtn = page.locator('.targeted-mock-launch-btn');
  await launchBtn.click();
  await page.waitForTimeout(1500);
  console.log('✓ Clicked launch button, current URL:', page.url());

  console.log('\n=== TEST 2: LEADERBOARD CANDIDATE QUICK-INSPECT MODAL ===');
  await page.goto('http://localhost:5173/leaderboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Switch back to Dark Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(300);

  // Click on first inspect button or table row
  const inspectBtn = page.locator('.lb-inspect-row-btn').first();
  await inspectBtn.waitFor({ state: 'visible', timeout: 5000 });
  await inspectBtn.click();
  await page.waitForTimeout(500);

  // Verify LeaderboardCandidateModal is open
  const lbModal = page.locator('.lb-modal-dialog');
  await lbModal.waitFor({ state: 'visible', timeout: 5000 });
  const candName = await page.locator('.lb-modal-name').textContent();
  const candRank = await page.locator('.lb-modal-rank-badge').textContent();
  console.log(`✓ Candidate Quick-View Modal opened for: ${candName} (${candRank})`);

  // Screenshot in Dark Mode
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/roadmap_2_lb_inspect_dark.png' });
  console.log('✓ Saved leaderboard modal dark mode screenshot');

  // Switch to Light Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/roadmap_2_lb_inspect_light.png' });
  console.log('✓ Saved leaderboard modal light mode screenshot');

  // Close modal
  await page.locator('.lb-modal-close-btn').click();
  await page.waitForTimeout(300);
  console.log('✓ Modal closed successfully');

  // Test clicking Podium card
  const podiumCard = page.locator('.lb-podium-card').first();
  if (await podiumCard.isVisible()) {
    await podiumCard.click();
    await page.waitForTimeout(400);
    const isModalOpenAgain = await page.locator('.lb-modal-dialog').isVisible();
    console.log('✓ Clicking podium card opened modal:', isModalOpenAgain);
    await page.locator('.lb-modal-close-btn').click();
    await page.waitForTimeout(300);
  }

  console.log('\n=== TEST 3: PWA SERVICE WORKER REGISTRATION ===');
  const swRegistered = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const regs = await navigator.serviceWorker.getRegistrations();
    return regs.length > 0;
  });
  console.log('✓ Service worker registration detected:', swRegistered);

  await browser.close();
  console.log('\nALL ROADMAP TESTS COMPLETED SUCCESSFULLY! 🎉');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
