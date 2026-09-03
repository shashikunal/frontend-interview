import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\Qsp\\.gemini\\antigravity-ide\\brain\\3a7e2ce1-9aa3-4838-bd13-911457118bde';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browserExecutable = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
  console.log('🚀 Launching browser with:', browserExecutable);
  const browser = await puppeteer.launch({
    executablePath: browserExecutable,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Log in as Candidate first
    console.log('1. Setting candidate role in browser...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const candProfile = {
        id: 'candidate_demo_user',
        email: 'candidate@faang.io',
        name: 'Alex Rivers (Candidate)',
        role: 'candidate',
        entitlements: {
          questions_full: false,
          coding_sandbox: false,
          system_design: false,
          video_mock: false,
          compiler_studios: false,
          cloud_sync: true,
        },
        permissions: [],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('interviewprep_active_profile', JSON.stringify(candProfile));
    });

    // 2. Navigate to /system-design as Candidate (Locked Screen)
    console.log('📸 2. Navigating to /system-design as Candidate...');
    await page.goto('http://localhost:5173/system-design', { waitUntil: 'networkidle0' });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_candidate_locked_feature.png') });

    // 3. Click Request Access
    console.log('📸 3. Requesting Access from Admin...');
    await page.evaluate(() => {
      const reqBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Request Access from Admin'));
      if (reqBtn) reqBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_access_request_sent.png') });

    // 4. Switch to Admin in localStorage and reload
    console.log('4. Switching to Admin profile...');
    await page.evaluate(() => {
      const adminProfile = {
        id: 'admin_super_user',
        email: 'admin@interviewprep.com',
        name: 'Platform Administrator',
        role: 'admin',
        entitlements: {
          questions_full: true,
          coding_sandbox: true,
          system_design: true,
          video_mock: true,
          compiler_studios: true,
          cloud_sync: true,
        },
        permissions: ['admin:all', 'admin:users_manage'],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('interviewprep_active_profile', JSON.stringify(adminProfile));
    });
    await page.goto('http://localhost:5173/system-design', { waitUntil: 'networkidle0' });
    await sleep(800);

    // 5. Open Admin Notification Bell
    console.log('📸 5. Opening Admin Notification Bell with 1 Pending Request...');
    await page.evaluate(() => {
      const bellBtn = document.querySelector('.admin-bell-btn');
      if (bellBtn) bellBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_admin_notification_bell_pending.png') });

    // 6. Click Approve inside Notification Bell
    console.log('📸 6. Clicking Approve...');
    await page.evaluate(() => {
      const approveBtn = document.querySelector('.abd-btn-approve');
      if (approveBtn) approveBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_admin_notification_approved.png') });

    // 7. Go to Operations Dashboard (Tab 2: Access Requests)
    console.log('📸 7. Navigating to Admin Operations Dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.evaluate(() => {
      const reqTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Access Requests'));
      if (reqTab) reqTab.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_admin_dashboard_requests.png') });

    console.log('🎉 ALL SCREENSHOTS CAPTURED WITH PERFECT VISUAL PROOF!');
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
