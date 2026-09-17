import { chromium } from 'playwright';

async function auditAIVideoMock() {
  console.log('🚀 Auditing AI Video Mock Studio 2.0 pages...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_cand_audit',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      role: 'candidate',
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

  const pagesToAudit = [
    { name: 'mock_1_home', url: 'http://localhost:5173/ai-video-mock' },
    { name: 'mock_2_setup', url: 'http://localhost:5173/ai-video-mock/setup' },
    { name: 'mock_3_practice', url: 'http://localhost:5173/ai-video-mock/practice' },
    { name: 'mock_4_skills', url: 'http://localhost:5173/ai-video-mock/skills' },
    { name: 'mock_5_history', url: 'http://localhost:5173/ai-video-mock/history' },
    { name: 'mock_6_question_bank', url: 'http://localhost:5173/ai-video-mock/question-bank' },
  ];

  for (const item of pagesToAudit) {
    console.log(`Auditing ${item.name} (${item.url})...`);
    await page.goto(item.url, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(1500);

    // 1. Dark Mode screenshot
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/${item.name}_dark.png`,
    });

    // 2. Light Mode screenshot
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/${item.name}_light.png`,
    });
  }

  console.log('✅ Audit screenshots captured successfully!');
  await browser.close();
}

auditAIVideoMock();
