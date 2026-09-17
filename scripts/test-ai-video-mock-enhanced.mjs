import { chromium } from 'playwright';

async function testEnhancedNavbar() {
  console.log('🚀 Testing Enhanced AI Video Mock Navbar & Aesthetics...');
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

  // 1. Visit /ai-video-mock
  await page.goto('http://localhost:5173/ai-video-mock', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(1000);

  // Set Dark Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  });
  await page.waitForTimeout(400);

  // Click "Mock Types" dropdown
  const mockTypesBtn = page.locator('button:has-text("Mock Types")');
  await mockTypesBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/mock_nav_dropdown_dark.png',
  });
  console.log('📸 Captured mock_nav_dropdown_dark.png');

  // Click "Practice & Skills" dropdown
  const practiceBtn = page.locator('button:has-text("Practice & Skills")');
  await practiceBtn.click();
  await page.waitForTimeout(500);

  // Set Light Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  });
  await page.waitForTimeout(400);

  await page.screenshot({
    path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/mock_nav_dropdown_light.png',
  });
  console.log('📸 Captured mock_nav_dropdown_light.png');

  // 2. Test Mobile Viewport (390 x 844 iPhone 12 / standard mobile)
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/ai-video-mock', { waitUntil: 'networkidle', timeout: 25000 });
  await mobilePage.waitForTimeout(1000);

  // Open mobile menu
  const mobileToggle = mobilePage.locator('.ai-vm-mobile-toggle');
  await mobileToggle.click();
  await mobilePage.waitForTimeout(500);

  await mobilePage.screenshot({
    path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/mock_nav_mobile.png',
  });
  console.log('📸 Captured mock_nav_mobile.png');

  await browser.close();
  console.log('✅ AI Video Mock Navbar verification completed successfully!');
}

testEnhancedNavbar().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
