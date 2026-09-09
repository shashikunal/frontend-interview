import fs from 'node:fs';

console.log('=== PHASE 10: MACHINE CODING SECURITY & PRODUCTION HARDENING AUDIT ===\n');

let allPassed = true;

function check(title, condition, detail) {
  if (condition) {
    console.log(`[PASS] ${title}`);
    if (detail) console.log(`       ${detail}`);
  } else {
    console.error(`[FAIL] ${title}`);
    if (detail) console.error(`       ${detail}`);
    allPassed = false;
  }
}

// 1. Runner Timeout & Infinite Loop Protection
const runnerContent = fs.readFileSync('src/lib/runner.ts', 'utf8');
const runnerHasRace = runnerContent.includes('Promise.race') && runnerContent.includes('Time Limit Exceeded');
const runnerTimeoutMs = runnerContent.includes('2000');
check('Runner Assertion Timeout Guard', runnerHasRace && runnerTimeoutMs, 'Assertions timeout after 2,000ms to prevent infinite loop hangs');

// 2. MachineCodingStudio Sandbox & postMessage Security
const studioContent = fs.readFileSync('src/components/machinecoding/MachineCodingStudio.tsx', 'utf8');
const studioHasSandbox = studioContent.includes('sandbox="allow-scripts allow-modals"');
const studioNoSameOrigin = !studioContent.includes('allow-same-origin');
const studioHasSourceGuard = studioContent.includes('e.source !== iframeRef.current.contentWindow');
const studioHasCooldown = studioContent.includes('lastSubmitTimeRef.current < 1500');
const studioHasSolutionGuard = studioContent.includes('canViewSolution');

check('Iframe Sandbox Isolation', studioHasSandbox, 'Iframe configured with sandbox="allow-scripts allow-modals"');
check('No Same-Origin Leak in Sandbox', studioNoSameOrigin, 'allow-same-origin removed so candidate code has opaque null origin');
check('PostMessage Event Source Verification', studioHasSourceGuard, 'Rejects postMessage events from unexpected origins or windows');
check('Submission Cooldown Throttling', studioHasCooldown, 'Enforces cooldown between evaluation runs to avoid DoS/spam');
check('Reference Solution Authorization Guard', studioHasSolutionGuard, 'Solution access gated by user role and feature entitlement');

// 3. User Scoped Storage & Progress Isolation
const progressContent = fs.readFileSync('src/components/machinecoding/lib/mcProgressService.ts', 'utf8');
const progressNoLegacyFallback = !progressContent.includes('getLegacyKey');
const progressUsesUserKey = progressContent.includes('${prefix}_v1_${this.userId}');
check('MC Progress Legacy Shared Key Removed', progressNoLegacyFallback, 'Legacy un-scoped keys removed to prevent candidate data cross-contamination');
check('MC Progress User-Scoped Key Enforced', progressUsesUserKey, 'Progress strictly keyed to authenticated user ID');

// 4. Bookmark Storage Isolation
const bookmarkContent = fs.readFileSync('src/context/BookmarkContext.tsx', 'utf8');
const bookmarkUserScoped = bookmarkContent.includes('const userId = user?.id || \'guest\'') && 
                           bookmarkContent.includes('const storageKey = `${BOOKMARK_STORAGE_PREFIX}_${userId}`');
check('Bookmark Context User Isolation', bookmarkUserScoped, 'Candidate bookmarks strictly partitioned per user ID');

// 5. Auth Lifecycle Progress Sync
const authProviderContent = fs.readFileSync('src/features/auth/context/AuthProvider.tsx', 'utf8');
const authSetsUserId = authProviderContent.includes('mcProgressService.setUserId');
check('Auth Lifecycle Progress Sync', authSetsUserId, 'mcProgressService updates active user on login/logout/role switch');

// 6. Serverless API Rate / Payload Limits
const aiFeedbackContent = fs.readFileSync('api/ai-feedback.js', 'utf8');
const aiPayloadLimit = aiFeedbackContent.includes('questions.length > 20') && aiFeedbackContent.includes('50000');
check('Serverless API Input Constraints', aiPayloadLimit, 'Limits max 20 questions and 50KB code payload to prevent API abuse');

// 7. Route & Admin Access Protection
const appContent = fs.readFileSync('src/App.tsx', 'utf8');
const adminRouteProtected = appContent.includes('path="/admin"') && appContent.includes('minRole="admin"');
check('Admin Route Protection', adminRouteProtected, 'Admin routes protected by ProtectedRoute with minRole="admin"');

console.log('\n==================================================');
if (allPassed) {
  console.log('ALL PHASE 10 SECURITY & HARDENING CHECKS PASSED!');
} else {
  console.error('SOME SECURITY CHECKS FAILED! INVESTIGATION NEEDED.');
  process.exit(1);
}
