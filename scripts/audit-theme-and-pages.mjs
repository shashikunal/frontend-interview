import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce';

const PAGES_TO_AUDIT = [
  { name: '1_home', url: 'http://localhost:5173/' },
  { name: '2_docs_hub', url: 'http://localhost:5173/docs' },
  { name: '3_docs_topic_closures', url: 'http://localhost:5173/docs/javascript/js-closures' },
  { name: '4_leaderboard', url: 'http://localhost:5173/leaderboard' },
  { name: '5_dashboard', url: 'http://localhost:5173/dashboard' },
  { name: '6_candidate_performance', url: 'http://localhost:5173/my-performance' },
  { name: '7_core_programming', url: 'http://localhost:5173/core-programming' },
  { name: '8_dsa_studio', url: 'http://localhost:5173/dsa' },
  { name: '9_machine_coding', url: 'http://localhost:5173/machine-coding' },
  { name: '10_admin_overview', url: 'http://localhost:5173/admin' },
  { name: '11_admin_candidates', url: 'http://localhost:5173/admin?tab=candidates' },
  { name: '12_admin_docs_syllabus', url: 'http://localhost:5173/admin?tab=docs-syllabus' },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  await context.addInitScript(() => {
    // Seed authenticated admin profile so all protected & admin routes render their full UI
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

    window.localStorage.setItem('interview_docs_progress_v1', JSON.stringify({
      completedTopics: [
        'html:html-semantic-elements',
        'javascript:javascript-closures',
        'react:react-hooks-useeffect',
        'typescript:typescript-generics'
      ],
      masteredTopics: [
        'javascript:javascript-closures'
      ]
    }));
  });

  const page = await context.newPage();
  const results = [];

  for (const item of PAGES_TO_AUDIT) {
    console.log(`Auditing ${item.name} (${item.url})...`);
    const errors = [];
    const onErr = err => errors.push(err.message || String(err));
    page.on('pageerror', onErr);

    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);

      // 1. Audit Dark Theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      });
      await page.waitForTimeout(600);
      const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const darkColor = await page.evaluate(() => getComputedStyle(document.body).color);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `audit_${item.name}_dark.png`),
      });

      // 2. Audit Light Theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.setAttribute('data-theme', 'light');
      });
      await page.waitForTimeout(600);
      const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const lightColor = await page.evaluate(() => getComputedStyle(document.body).color);

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, `audit_${item.name}_light.png`),
      });

      results.push({
        name: item.name,
        url: item.url,
        status: 'PASS',
        darkBg,
        darkColor,
        lightBg,
        lightColor,
        errorsCount: errors.length,
        errors,
      });
      console.log(`✓ ${item.name}: PASS (Dark bg: ${darkBg}, Light bg: ${lightBg})`);
    } catch (err) {
      console.error(`✗ ${item.name}: FAIL - ${err.message}`);
      results.push({
        name: item.name,
        url: item.url,
        status: 'FAIL',
        error: err.message,
      });
    } finally {
      page.off('pageerror', onErr);
    }
  }

  await browser.close();

  console.log('\n=== COMPLETE AUDIT RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error('Audit suite crashed:', err);
  process.exit(1);
});
