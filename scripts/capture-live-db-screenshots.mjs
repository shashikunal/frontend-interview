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
  console.log('🚀 Launching browser for Live DB Screenshots with:', browserExecutable);
  const browser = await puppeteer.launch({
    executablePath: browserExecutable,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Home Page
    console.log('📸 1. Navigating to Home...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await sleep(600);

    // 2. Set Candidate profile in session
    console.log('Setting Candidate profile in session...');
    await page.evaluate(() => {
      const candProfile = {
        id: 'candidate_real_usr',
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

    // 3. Navigate to /system-design (Candidate Restricted Screen)
    console.log('📸 2. Navigating to /system-design (Locked Screen)...');
    await page.goto('http://localhost:5173/system-design', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_live_candidate_locked.png') });

    // 4. Click "Request Access from Admin"
    console.log('📸 3. Submitting 1-Click Access Request...');
    await page.evaluate(() => {
      const reqBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Request Access from Admin'));
      if (reqBtn) reqBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_live_request_dispatched.png') });

    // 5. Switch to Admin Profile
    console.log('Switching to Admin profile...');
    await page.evaluate(() => {
      const adminProfile = {
        id: 'admin_real_usr',
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

    // 6. Open Notification Bell showing the pending request
    console.log('📸 4. Opening Admin Notification Bell...');
    await page.evaluate(() => {
      const bellBtn = document.querySelector('.admin-bell-btn');
      if (bellBtn) bellBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_live_admin_bell_pending.png') });

    // 7. Click Approve
    console.log('📸 5. Approving Request in Dropdown...');
    await page.evaluate(() => {
      const approveBtn = document.querySelector('.abd-btn-approve');
      if (approveBtn) approveBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_live_admin_approved.png') });

    // 8. Operations Dashboard (Tab 2: Access Requests)
    console.log('📸 6. Navigating to Operations Dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.evaluate(() => {
      const reqTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Access Requests'));
      if (reqTab) reqTab.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_live_admin_dashboard.png') });

    // 9. User Management Studio
    console.log('📸 7. Navigating to User Management & RBAC Studio...');
    await page.goto('http://localhost:5173/user-management', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_live_user_management.png') });

    console.log('🎉 ALL LIVE DB SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
