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
  const browser = await puppeteer.launch({
    executablePath: browserExecutable,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();

  try {
    // 1. Log in as Admin
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const signInBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Sign In') || b.textContent?.includes('Candidate'));
      if (signInBtn) signInBtn.click();
    });
    await sleep(500);
    await page.evaluate(() => {
      const adminBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Admin (Full)'));
      if (adminBtn) adminBtn.click();
    });
    await sleep(800);

    // 2. Go to /dashboard as Admin
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await sleep(800);

    // Click on Tab 2: Access Requests
    await page.evaluate(() => {
      const reqTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Access Requests'));
      if (reqTab) reqTab.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_admin_requests_panel.png') });
    console.log('Saved admin requests tab screenshot.');
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
