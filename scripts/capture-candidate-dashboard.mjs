import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Qsp\\.gemini\\antigravity-ide\\brain\\1fb3feab-21e9-497d-a187-67945a6c9109';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
  console.log('🚀 Launching Chromium with Playwright...');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to candidate dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });

    // Set candidate user profile and theme in localStorage
    await page.evaluate(() => {
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
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await page.reload({ waitUntil: 'networkidle' });
    await sleep(1000);

    // 1. Capture Light Mode Hero Viewport
    console.log('📸 1. Capturing candidate dashboard (Light Mode - Viewport)...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dashboard_candidate_light.png') });

    // 2. Capture Light Mode Full Page
    console.log('📸 2. Capturing candidate dashboard (Light Mode - Full Page)...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dashboard_candidate_light_full.png'), fullPage: true });

    // 3. Switch to Dark Mode
    console.log('📸 3. Capturing candidate dashboard (Dark Mode)...');
    await page.evaluate(() => {
      localStorage.setItem('interview-prep-theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dashboard_candidate_dark.png') });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dashboard_candidate_dark_full.png'), fullPage: true });

    console.log('✅ All screenshots captured successfully in artifact directory!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
