import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });

  await context.addInitScript(() => {
    // Seed authenticated candidate
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_sarah_chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@faang.io',
      role: 'candidate',
      targetCompany: 'Meta (E5) / Google (L5)',
      experienceLevel: 'Senior Engineer',
      entitlements: { coding_sandbox: true, questions_full: true, video_mock: true, system_design: true }
    }));

    // Seed mock submissions across studios
    window.localStorage.setItem('cp_candidate_submissions_v1', JSON.stringify([
      {
        id: 'sub_cp_1',
        userId: 'usr_sarah_chen',
        questionId: 'JS-P001',
        status: 'Accepted',
        score: 100,
        testsPassed: 10,
        testsTotal: 10,
        executionTime: 18,
        timeSpentSeconds: 240, // 4 mins -> Lightning
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'sub_cp_2',
        userId: 'usr_sarah_chen',
        questionId: 'JS-P002',
        status: 'Accepted',
        score: 95,
        testsPassed: 9,
        testsTotal: 10,
        executionTime: 25,
        timeSpentSeconds: 310,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ]));

    // Seed LeetCode / DSA submission
    window.localStorage.setItem('dsa_candidate_submissions_v1', JSON.stringify([
      {
        id: 'sub_dsa_1',
        userId: 'usr_sarah_chen',
        questionId: 'DSA001',
        status: 'Accepted',
        score: 90,
        executionTime: 12,
        timeSpentSeconds: 420,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      }
    ]));

    // Seed Machine Coding submissions
    window.localStorage.setItem('mc_candidate_submissions_v1', JSON.stringify([
      {
        id: 'sub_mc_1',
        userId: 'usr_sarah_chen',
        questionId: 'MC-001',
        status: 'Accepted',
        score: 92,
        timeSpentSeconds: 900, // 15 mins
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ]));

    // Seed Frontend JS submissions
    window.localStorage.setItem('fjp_submissions_v1', JSON.stringify([
      {
        id: 'sub_fjs_1',
        userId: 'usr_sarah_chen',
        questionId: 'FJP-001',
        status: 'Accepted',
        score: 95,
        timeSpentSeconds: 300,
        createdAt: new Date(Date.now() - 21600000).toISOString(),
      }
    ]));

    // Seed 21-Track Docs Syllabus Progress
    const docsPayload = {
      completedTopics: [
        'html:html-semantic-elements',
        'html:html-accessibility-aria',
        'css:css-flexbox',
        'css:css-grid-layout',
        'javascript:javascript-closures',
        'javascript:javascript-event-loop',
        'javascript:javascript-prototypes',
        'react:react-hooks-useeffect',
        'react:react-concurrency-fiber',
        'typescript:typescript-generics'
      ],
      masteredTopics: [
        'javascript:javascript-closures',
        'react:react-hooks-useeffect'
      ]
    };
    window.localStorage.setItem('interview_docs_progress_v1', JSON.stringify(docsPayload));
    window.localStorage.setItem('interview_docs_progress_v1_usr_sarah_chen', JSON.stringify(docsPayload));
  });

  const page = await context.newPage();

  console.log('1. Navigating to Candidate Performance (/my-performance)...');
  await page.goto('http://localhost:5173/my-performance', { waitUntil: 'domcontentloaded' });

  // Wait for header and dossier button
  console.log('2. Waiting for header and FAANG Dossier button...');
  await page.waitForSelector('#open-faang-dossier-btn', { timeout: 10000 });

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'dossier_0_perf_header.png'),
  });
  console.log('Captured dossier_0_perf_header.png');

  // Click FAANG Dossier button
  console.log('3. Clicking FAANG Readiness Dossier button...');
  await page.click('#open-faang-dossier-btn');

  // Wait for modal to open
  await page.waitForSelector('.faang-dossier-modal', { timeout: 5000 });
  await page.waitForTimeout(600); // Animation stabilize

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'dossier_1_modal_open.png'),
  });
  console.log('Captured dossier_1_modal_open.png');

  // Scroll inside modal body to show 4-Studio table & split telemetry
  const modalBody = await page.$('.faang-dossier-body');
  if (modalBody) {
    await page.evaluate(() => {
      const el = document.querySelector('.faang-dossier-body');
      if (el) el.scrollTop = 250;
    });
    await page.waitForTimeout(300);
  }

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'dossier_2_4studio_matrix.png'),
  });
  console.log('Captured dossier_2_4studio_matrix.png');

  // Switch to Formatted Markdown tab
  console.log('4. Switching to Formatted Markdown tab...');
  const mdTabBtn = await page.$('button.faang-tab-pill:has-text("Markdown")');
  if (mdTabBtn) {
    await mdTabBtn.click();
    await page.waitForTimeout(400);

    // Verify textarea has markdown content
    const mdContent = await page.$eval('.faang-markdown-textarea', el => el.value);
    console.log(`Markdown content generated (${mdContent.length} characters)`);

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'dossier_3_markdown_preview.png'),
    });
    console.log('Captured dossier_3_markdown_preview.png');
  }

  await browser.close();
  console.log('Test completed successfully!');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
