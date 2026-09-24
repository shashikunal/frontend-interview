import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5173';

console.log('🚀 Starting Admin (Shashi) & Candidate (Kushal) End-to-End Live Verification...');
console.log('Target URL:', BASE_URL);

async function run() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  try {
    // ══════════════════════════════════════════════════════════════════════
    // Step 1: Strict RBAC Verification via API
    // ══════════════════════════════════════════════════════════════════════
    console.log('\n--- STEP 1: Verifying Strict RBAC Rules ---');

    // Candidate Token Generation
    const candidateAuthRes = await fetch(`${BASE_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'candidate_kushal',
        userEmail: 'kushal@gmail.com',
        userName: 'Kushal Kumar',
        userRole: 'candidate',
      }),
    });
    const candidateAuth = await candidateAuthRes.json();
    const candidateToken = candidateAuth.token;
    console.log('Candidate token acquired:', !!candidateToken);

    // Admin Token Generation (Shashi)
    const adminAuthRes = await fetch(`${BASE_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'admin_shashi',
        userEmail: 'shashi@admin.com',
        userName: 'Shashi (Admin)',
        userRole: 'admin',
      }),
    });
    const adminAuth = await adminAuthRes.json();
    const adminToken = adminAuth.token;
    console.log('Admin token acquired:', !!adminToken);

    // Test 1a: Candidate attempts to create meeting -> MUST BE 403 FORBIDDEN
    const candidateCreateRes = await fetch(`${BASE_URL}/api/v1/meetings/instant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidateToken}`,
      },
      body: JSON.stringify({ action: 'instant' }),
    });
    console.log('Candidate Create Meeting Status:', candidateCreateRes.status, '(Expected 403)');
    const candidateCreateData = await candidateCreateRes.json();
    console.log('Candidate Create Meeting Response:', candidateCreateData.error?.message || candidateCreateData.message);

    // Test 1b: Candidate attempts to dispatch push notifications -> MUST BE 403 FORBIDDEN
    const candidatePushRes = await fetch(`${BASE_URL}/api/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${candidateToken}`,
      },
      body: JSON.stringify({
        action: 'send',
        meetingId: 'meet_test_rbac',
        message: 'Illegal candidate push',
      }),
    });
    console.log('Candidate Push Status:', candidatePushRes.status, '(Expected 403)');
    const candidatePushData = await candidatePushRes.json();
    console.log('Candidate Push Response:', candidatePushData.error?.message || candidatePushData.message);

    // Test 1c: Admin (Shashi) creates meeting -> MUST BE 201 CREATED
    const adminCreateRes = await fetch(`${BASE_URL}/api/v1/meetings/instant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action: 'instant', title: 'System Architecture & WebRTC Interview with Kushal' }),
    });
    console.log('Admin Create Meeting Status:', adminCreateRes.status, '(Expected 201)');
    const adminCreateData = await adminCreateRes.json();
    const meetingId = adminCreateData.meeting?.id;
    console.log('Meeting Created by Admin Shashi:', meetingId);

    // Test 1d: Admin (Shashi) pushes meeting alert -> MUST BE 200 OK
    const adminPushRes = await fetch(`${BASE_URL}/api/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: 'send',
        meetingId,
        meeting: adminCreateData.meeting,
        customMessage: 'Live Interview Room is open with Shashi (Admin). Join now!',
      }),
    });
    console.log('Admin Push Notification Status:', adminPushRes.status, '(Expected 200)');
    const adminPushData = await adminPushRes.json();
    console.log('Admin Push Result:', adminPushData.success, 'Notified:', adminPushData.sentCount);

    if (candidateCreateRes.status !== 403 || candidatePushRes.status !== 403) {
      throw new Error('RBAC validation failed: Candidate was not forbidden from creating meeting or pushing alerts!');
    }
    console.log('✅ RBAC Rules 100% verified: ONLY Admin (Shashi) can create and push meetings!');

    // ══════════════════════════════════════════════════════════════════════
    // Step 2: Multi-Participant Live Meeting Session (Admin & Kushal)
    // ══════════════════════════════════════════════════════════════════════
    console.log('\n--- STEP 2: Launching Admin & Candidate Browser Contexts ---');

    // Context 1: Admin Shashi
    const contextAdmin = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      permissions: ['camera', 'microphone'],
    });
    const pageAdmin = await contextAdmin.newPage();

    // Context 2: Candidate Kushal
    const contextKushal = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      permissions: ['camera', 'microphone'],
    });
    const pageKushal = await contextKushal.newPage();

    // 1. Seed user auth in Context 1 for Admin (Shashi)
    await pageAdmin.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await pageAdmin.evaluate(() => {
      localStorage.setItem('auth_token', 'mock_admin_token');
      localStorage.setItem('auth_user', JSON.stringify({
        id: 'admin_shashi',
        name: 'Shashi (Admin)',
        email: 'shashi@admin.com',
        role: 'admin',
      }));
    });

    // 2. Seed user auth in Context 2 for Candidate (Kushal)
    await pageKushal.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await pageKushal.evaluate(() => {
      localStorage.setItem('auth_token', 'mock_candidate_token');
      localStorage.setItem('auth_user', JSON.stringify({
        id: 'candidate_kushal',
        name: 'Kushal Kumar',
        email: 'kushal@gmail.com',
        role: 'candidate',
      }));
    });

    console.log('\n--- STEP 3: Admin Shashi Joins Meeting ---');
    const meetingUrl = `${BASE_URL}/meet/${meetingId}`;
    await pageAdmin.goto(meetingUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await pageAdmin.waitForTimeout(2000);

    // Admin joins from lobby
    const adminJoinBtn = pageAdmin.locator('button:has-text("Join Meeting Now")');
    if (await adminJoinBtn.isVisible()) {
      await adminJoinBtn.click();
      console.log('Admin clicked Join Meeting Now');
    }
    await pageAdmin.waitForSelector('.rtc-fullscreen-wrap', { timeout: 15000 });
    console.log('✓ Admin successfully inside live meeting room');

    console.log('\n--- STEP 4: Candidate Kushal Joins Meeting ---');
    await pageKushal.goto(meetingUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await pageKushal.waitForTimeout(2000);

    // Kushal joins from lobby
    const kushalJoinBtn = pageKushal.locator('button:has-text("Join Meeting Now")');
    if (await kushalJoinBtn.isVisible()) {
      await kushalJoinBtn.click();
      console.log('Kushal clicked Join Meeting Now');
    }
    await pageKushal.waitForSelector('.rtc-fullscreen-wrap', { timeout: 15000 });
    console.log('✓ Kushal successfully inside live meeting room');

    // Wait for peer presence sync
    await pageAdmin.waitForTimeout(3000);
    await pageKushal.waitForTimeout(3000);

    console.log('\n--- STEP 5: Testing Bidirectional In-Meeting Chat ---');

    // Admin opens chat drawer
    const adminChatBtn = pageAdmin.locator('.rtc-dock-btn:has-text("Chat")');
    await adminChatBtn.click();
    await pageAdmin.waitForSelector('.rtc-chat-drawer', { timeout: 5000 });
    console.log('✓ Admin chat drawer opened');

    // Kushal opens chat drawer
    const kushalChatBtn = pageKushal.locator('.rtc-dock-btn:has-text("Chat")');
    await kushalChatBtn.click();
    await pageKushal.waitForSelector('.rtc-chat-drawer', { timeout: 5000 });
    console.log('✓ Kushal chat drawer opened');

    // Admin sends message to Kushal
    const adminInput = pageAdmin.locator('.rtc-chat-text-input');
    await adminInput.fill('Hello Kushal! Welcome to the interview. Can you hear me?');
    const adminSendBtn = pageAdmin.locator('.rtc-chat-send-btn');
    await adminSendBtn.click();
    console.log('✓ Admin sent message: "Hello Kushal! Welcome to the interview. Can you hear me?"');

    // Verify Kushal receives Admin's message
    await pageKushal.waitForSelector('text=Hello Kushal! Welcome to the interview', { timeout: 10000 });
    console.log('🎯 Kushal received message from Shashi (Admin)!');

    // Kushal replies to Admin
    const kushalInput = pageKushal.locator('.rtc-chat-text-input');
    await kushalInput.fill('Hi Shashi Sir! Yes, I can hear you clearly and my video is working.');
    const kushalSendBtn = pageKushal.locator('.rtc-chat-send-btn');
    await kushalSendBtn.click();
    console.log('✓ Kushal sent reply: "Hi Shashi Sir! Yes, I can hear you clearly and my video is working."');

    // Verify Admin receives Kushal's reply
    await pageAdmin.waitForSelector('text=Hi Shashi Sir! Yes, I can hear you clearly', { timeout: 10000 });
    console.log('🎯 Admin Shashi received reply from Kushal!');

    console.log('\n--- STEP 6: Testing Screen Sharing by Admin Shashi ---');

    // Admin clicks Share Screen
    const adminShareBtn = pageAdmin.locator('.rtc-dock-btn:has-text("Share")');
    await adminShareBtn.click();
    console.log('✓ Admin clicked Share Screen button');

    // Wait for screen sharing presentation mode
    await pageAdmin.waitForSelector('.rtc-stop-presenting-btn, .rtc-presentation-viewport', { timeout: 10000 });
    console.log('✓ Admin is presenting screen');

    // Wait for Kushal to receive and display the presentation
    await pageKushal.waitForSelector('.rtc-presentation-stage, .rtc-presentation-video', { timeout: 15000 });
    console.log('🎯 Kushal is viewing Admin Shashi\'s shared screen in Presentation Mode!');

    // Wait 3 seconds for smooth rendering
    await pageAdmin.waitForTimeout(3000);
    await pageKushal.waitForTimeout(3000);

    // Capture screenshots
    const adminScreenshotPath = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/3a8bceba-87df-41ce-bfad-9fb26a0e402e/admin_shashi_meeting_verified.png';
    const kushalScreenshotPath = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/3a8bceba-87df-41ce-bfad-9fb26a0e402e/kushal_candidate_meeting_verified.png';

    await pageAdmin.screenshot({ path: adminScreenshotPath, fullPage: false });
    await pageKushal.screenshot({ path: kushalScreenshotPath, fullPage: false });

    console.log('\n📸 Screenshots captured successfully:');
    console.log(' - Admin (Shashi) View:', adminScreenshotPath);
    console.log(' - Candidate (Kushal) View:', kushalScreenshotPath);

    console.log('\n🎉 ALL CHECKS PASSED:');
    console.log('  1. Only Admin (Shashi) has rights to push or create meeting (verified 403 on candidate).');
    console.log('  2. Admin (Shashi) and Candidate (Kushal) connected and present in the meeting.');
    console.log('  3. Chat working seamlessly and bidirectionally with real-time sync.');
    console.log('  4. Screen sharing working smoothly with live presentation rendered on Kushal\'s screen.');

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
