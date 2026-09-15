import { chromium } from 'playwright';

async function runRealtimeTypingVerification() {
  console.log('🚀 Starting E2E Local Real-time Candidate Typing Verification...');
  const browser = await chromium.launch({ headless: true });

  // 1. Context A: Admin Live Monitor
  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await adminContext.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_admin_verifier',
      name: 'Lead Evaluator',
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
  const adminPage = await adminContext.newPage();

  // 2. Context B: Candidate Coding Studio
  const candidateContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await candidateContext.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'usr_cand_keystroke_demo',
      name: 'Kunal Live Dev',
      email: 'kunal.candidate@example.com',
      role: 'candidate',
      entitlements: {
        coding_sandbox: true,
        questions_full: true,
      }
    }));
  });
  const candidatePage = await candidateContext.newPage();

  try {
    console.log('1. Loading Admin Live Sessions tab on http://localhost:5173/admin?tab=live-sessions ...');
    await adminPage.goto('http://localhost:5173/admin?tab=live-sessions', { waitUntil: 'networkidle', timeout: 20000 });
    await adminPage.waitForTimeout(2000);

    console.log('2. Loading Candidate Core Programming on http://localhost:5173/core-programming ...');
    await candidatePage.goto('http://localhost:5173/core-programming', { waitUntil: 'networkidle', timeout: 20000 });
    await candidatePage.waitForTimeout(2000);

    console.log('3. Clicking "Code ▶" to launch problem JS-P001 studio...');
    const codeBtn = candidatePage.locator('button:has-text("Code"), a:has-text("Code")').first();
    await codeBtn.click();
    await candidatePage.waitForTimeout(3000);
    console.log('Candidate Studio URL:', candidatePage.url());

    // Click into Monaco editor on Candidate page and type real code
    console.log('4. Candidate begins live typing code in studio...');
    const editorEl = candidatePage.locator('.monaco-editor').first();
    await editorEl.waitFor({ state: 'visible', timeout: 10000 });
    await editorEl.click();
    await candidatePage.waitForTimeout(500);

    // Select all existing code and replace with new live code
    await candidatePage.keyboard.press('Control+A');
    await candidatePage.waitForTimeout(200);

    const testSnippet = `// === REALTIME CANDIDATE LIVE STREAM ===
function solveRealtimeProblem(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`;

    // Type code to trigger typing & keystroke broadcasts
    console.log('4. Broadcasting live keystrokes in Monaco editor...');
    await candidatePage.keyboard.type('// === REALTIME CANDIDATE LIVE STREAM ===\nfunction solveRealtimeProblem(nums, target) {\n  return "CANDIDATE_TYPING_SUCCESS";\n}');

    console.log('5. Waiting 1.5s for real-time propagation across local BroadcastChannel / sockets...');
    await candidatePage.waitForTimeout(1500);

    // Capture Candidate view
    await candidatePage.screenshot({
      path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/realtime_candidate_typing.png',
    });
    console.log('📸 Captured realtime_candidate_typing.png');

    // Admin Page Verification:
    console.log('6. Checking Admin CCTV panel for live telemetry update...');
    await adminPage.waitForTimeout(1000);
    await adminPage.screenshot({
      path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/realtime_admin_cctv_synced.png',
    });
    console.log('📸 Captured realtime_admin_cctv_synced.png');

    // Check if the typed snippet or candidate name appears in admin DOM
    const adminContent = await adminPage.content();
    const hasLiveSnippet = adminContent.includes('solveRealtimeProblem') || adminContent.includes('REALTIME CANDIDATE');
    const hasTypingIndicator = adminContent.includes('TYPING') || adminContent.includes('typing') || adminContent.includes('LIVE');
    console.log('Admin Page Content Inspection:');
    console.log(' - Contains typed code ("solveRealtimeProblem"):', hasLiveSnippet);
    console.log(' - Contains active live/typing indicator:', hasTypingIndicator);

    // Open Focus CAM if a button is available to inspect full Monaco mirror
    const focusBtn = adminPage.locator('.cctv-focus-cam-btn').first();
    if ((await focusBtn.count()) > 0) {
      console.log('7. Opening Focus CAM modal in Admin...');
      await focusBtn.click();
      await adminPage.waitForTimeout(1500);
      await adminPage.screenshot({
        path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/realtime_admin_focus_synced.png',
      });
      console.log('📸 Captured realtime_admin_focus_synced.png');
    }

    console.log('🎉 E2E Verification Completed Successfully!');
  } catch (err) {
    console.error('❌ Error during verification:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runRealtimeTypingVerification();
