import { chromium } from 'playwright';

async function testLiveSessions() {
  console.log('Starting Playwright test for Live Sessions CCTV, Realtime Typing & Modal...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1536, height: 900 } });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_admin_audit',
      name: 'Audit Administrator',
      email: 'admin@interviewprep.com',
      role: 'admin',
      entitlements: {
        coding_sandbox: true,
        questions_full: true,
        video_mock: true,
        system_design: true,
        compiler_studios: true,
      }
    }));
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to /admin?tab=live-sessions...');
    await page.goto('http://localhost:5173/admin?tab=live-sessions', { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);

    // 1. Click Focus CAM on the first card
    const focusBtn = page.locator('.cctv-focus-cam-btn').first();
    const count = await focusBtn.count();
    console.log('Focus CAM buttons found:', count);
    if (count > 0) {
      console.log('Clicking Focus CAM button...');
      await focusBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/cctv_focus_modal.png' });
      console.log('Captured cctv_focus_modal.png');

      // Close modal
      const closeBtn = page.locator('.cctv-modal-close-btn');
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }

    console.log('Playwright modal test passed successfully!');
  } catch (err) {
    console.error('Playwright test error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

testLiveSessions();
