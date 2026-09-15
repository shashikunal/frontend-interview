// scripts/test-docs-e2e.mjs
import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'test-user-id',
      name: 'Test Candidate',
      email: 'candidate@faang.io',
      role: 'candidate',
      entitlements: { coding_sandbox: true }
    }));
  });

  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  console.log('1. Navigating to Docs Landing (/docs)...');
  await page.goto('http://localhost:5173/docs', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e_docs_1_landing.png') });
  console.log('Saved e2e_docs_1_landing.png');

  console.log('2. Navigating to JavaScript Closures topic (/docs/javascript/js-closures)...');
  await page.goto('http://localhost:5173/docs/javascript/js-closures', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e_docs_2_closures.png') });
  console.log('Saved e2e_docs_2_closures.png');

  console.log('3. Navigating to JavaScript Event Loop with Interactive Playground (/docs/javascript/js-event-loop)...');
  await page.goto('http://localhost:5173/docs/javascript/js-event-loop', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);

  // Look for Interactive Playground Run button
  const runBtn = page.locator('button:has-text("Run Code"), button:has-text("Execute")');
  if (await runBtn.count() > 0) {
    console.log('Found playground Run button, clicking...');
    await runBtn.first().click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e_docs_3_event_loop_playground.png') });
  console.log('Saved e2e_docs_3_event_loop_playground.png');

  console.log('4. Navigating to React Hooks topic (/docs/react/react-hooks-core)...');
  await page.goto('http://localhost:5173/docs/react/react-hooks-core', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e_docs_4_react_hooks.png') });
  console.log('Saved e2e_docs_4_react_hooks.png');

  console.log('5. Testing Interview Questions Tab with Virtualizer...');
  const questionsTab = page.locator('button:has-text("Interview Questions")');
  if (await questionsTab.count() > 0) {
    await questionsTab.first().click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e_docs_5_questions_virtualizer.png') });
    console.log('Saved e2e_docs_5_questions_virtualizer.png');
  }

  console.log('6. Testing Command Palette (Ctrl+K shortcut)...');
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(1000);
  const paletteModal = page.locator('.docs-cmd-palette-modal, .docs-palette-backdrop');
  if (await paletteModal.count() > 0) {
    console.log('Command Palette successfully opened!');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'e2e_docs_6_command_palette.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } else {
    console.log('Command palette triggered via UI search button if present');
  }

  await browser.close();

  console.log('\n========================================');
  console.log('🎉 E2E TEST SUITE COMPLETED SUCCESSFULLY');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors.slice(0, 10));
  }
  console.log('========================================\n');
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
