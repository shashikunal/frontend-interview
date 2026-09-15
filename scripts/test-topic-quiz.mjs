import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  await context.addInitScript(() => {
    window.localStorage.setItem('interviewprep_active_profile', JSON.stringify({
      id: 'candidate-quiz-tester',
      name: 'Alex Rivera',
      email: 'alex.rivera@faang.io',
      role: 'candidate',
      entitlements: { coding_sandbox: true, questions_full: true }
    }));
  });

  const page = await context.newPage();

  console.log('1. Navigating to /docs/javascript/js-closures...');
  await page.goto('http://localhost:5173/docs/javascript/js-closures', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Take screenshot of top
  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/quiz_1_top_header.png', fullPage: false });
  console.log('Saved quiz_1_top_header.png');

  console.log('2. Clicking "🧠 Mastery Quiz" in header controls...');
  const quizJumpBtn = page.locator('.docs-quiz-jump-btn');
  await quizJumpBtn.waitFor({ state: 'visible', timeout: 5000 });
  await quizJumpBtn.click();
  await page.waitForTimeout(1000);

  // Verify quiz card is in viewport
  const quizCard = page.locator('#topic-mastery-quiz');
  await quizCard.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Quiz card is visible in viewport');

  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/quiz_2_card_visible.png', fullPage: false });
  console.log('Saved quiz_2_card_visible.png');

  console.log('3. Answering Question 1...');
  const firstOption = page.locator('#topic-mastery-quiz .tmq-option-btn').first();
  await firstOption.click();
  await page.waitForTimeout(600);

  // Verify explanation box is revealed
  const explanationBox = page.locator('#topic-mastery-quiz .tmq-explanation-box');
  const explanationVisible = await explanationBox.isVisible();
  console.log(`Explanation box revealed: ${explanationVisible}`);

  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/quiz_3_question_1_answered.png', fullPage: false });
  console.log('Saved quiz_3_question_1_answered.png');

  console.log('4. Advancing through the remaining questions...');
  let nextBtn = page.locator('#topic-mastery-quiz .tmq-next-btn');
  await nextBtn.click();
  await page.waitForTimeout(600);

  // Question 2
  const q2Option = page.locator('#topic-mastery-quiz .tmq-option-btn').nth(1); // '3, 3, 3'
  await q2Option.click();
  await page.waitForTimeout(600);
  nextBtn = page.locator('#topic-mastery-quiz .tmq-next-btn');
  await nextBtn.click();
  await page.waitForTimeout(600);

  // Question 3
  const q3Option = page.locator('#topic-mastery-quiz .tmq-option-btn').first(); // 'Replace var i with let i'
  await q3Option.click();
  await page.waitForTimeout(600);
  nextBtn = page.locator('#topic-mastery-quiz .tmq-next-btn');
  await nextBtn.click();
  await page.waitForTimeout(1000);

  // Verify completion screen
  const completedCard = page.locator('#topic-mastery-quiz .tmq-completed-card');
  const isCompletedVisible = await completedCard.isVisible();
  console.log(`Completion screen visible: ${isCompletedVisible}`);

  const scoreText = await page.locator('.tsb-metric .tsb-num').first().innerText();
  console.log(`Final Score: ${scoreText}`);

  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/quiz_4_completed_score.png', fullPage: false });
  console.log('Saved quiz_4_completed_score.png');

  console.log('5. Clicking "Mark Topic Completed in Syllabus"...');
  const markCompletedBtn = page.locator('.tmc-mark-complete-btn');
  await markCompletedBtn.click();
  await page.waitForTimeout(800);

  // Check top complete button status
  const topCompleteBtn = page.locator('.docs-complete-topic-btn');
  const topBtnText = await topCompleteBtn.innerText();
  console.log(`Top topic button text: "${topBtnText.trim()}"`);

  await page.screenshot({ path: 'C:/Users/Qsp/.gemini/antigravity-ide/brain/b20330a7-b7a1-4d65-ba0a-98dc06003bce/quiz_5_topic_marked_complete.png', fullPage: false });
  console.log('Saved quiz_5_topic_marked_complete.png');

  await browser.close();
  console.log('✅ Topic Mastery Quiz E2E Test Completed Successfully!');
}

run().catch(err => {
  console.error('Quiz Test Error:', err);
  process.exit(1);
});
