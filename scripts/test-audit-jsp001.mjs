import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1536, height: 900 } });
  const page = await context.newPage();

  // Admin login if required
  await page.goto('http://localhost:5173/core-programming', { waitUntil: 'networkidle' });
  const adminBtn = page.locator('button:has-text("Admin Login")');
  if (await adminBtn.count() > 0) {
    await adminBtn.first().click();
    await page.waitForTimeout(600);
    await page.locator('input[type="text"]').first().fill('shashi');
    await page.locator('input[type="password"]').first().fill('Admin@9999');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  // 1. Screenshot JS-P001 workspace
  await page.goto('http://localhost:5173/core-programming/question/JS-P001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/8cf89aca-6c89-44b4-9194-cd9f5500dc31/audit_jsp001_initial.png', fullPage: false });

  // 2. Screenshot Machine Coding workspace
  await page.goto('http://localhost:5173/machine-coding?id=Q001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/8cf89aca-6c89-44b4-9194-cd9f5500dc31/audit_mc_q001.png', fullPage: false });

  // 3. Screenshot DSA workspace
  await page.goto('http://localhost:5173/dsa', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Find first question link or click first problem in DSA
  const firstDsa = page.locator('a[href*="/dsa/question/"], a[href*="/dsa/DSA-"], button:has-text("Solve"), button:has-text("Code")');
  if (await firstDsa.count() > 0) {
    await firstDsa.first().click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/8cf89aca-6c89-44b4-9194-cd9f5500dc31/audit_dsa_workspace.png', fullPage: false });
  }

  await browser.close();
})();
