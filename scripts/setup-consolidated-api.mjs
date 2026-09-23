import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HANDLERS_DIR = path.join(ROOT, 'api', '_handlers');
const MEETINGS_HANDLERS_DIR = path.join(HANDLERS_DIR, 'meetings');

fs.mkdirSync(MEETINGS_HANDLERS_DIR, { recursive: true });

function copyAndReplace(srcRel, destRel, searchReplacePairs) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(ROOT, destRel);
  if (!fs.existsSync(src)) {
    console.warn(`File not found: ${srcRel}`);
    return;
  }
  let content = fs.readFileSync(src, 'utf8');
  for (const [s, r] of searchReplacePairs) {
    content = content.replaceAll(s, r);
  }
  fs.writeFileSync(dest, content, 'utf8');
  console.log(`Copied ${srcRel} -> ${destRel}`);
}

// 1. Copy meeting handlers
const meetingFiles = [
  'chat.js',
  'editor.js',
  'invite.js',
  'join.js',
  'lifecycle.js',
  'media-token.js',
  'recording.js',
  'whiteboard.js',
];

for (const f of meetingFiles) {
  copyAndReplace(
    `api/v1/meetings/_handlers/${f}`,
    `api/_handlers/meetings/${f}`,
    [['../../../../server/', '../../../server/']]
  );
}

// 2. Copy meetings index
copyAndReplace(
  'api/v1/meetings/index.js',
  'api/_handlers/meetings.js',
  [
    ['../../../server/', '../../server/'],
    ['./_handlers/', './meetings/'],
  ]
);

// 3. Copy other endpoints
const endpoints = [
  ['api/v1/admin/meetings.js', 'api/_handlers/admin-meetings.js', [['../../../server/', '../../server/']]],
  ['api/v1/admin/dashboard.js', 'api/_handlers/admin-dashboard.js', [['../../../server/', '../../server/']]],
  ['api/v1/admin/notifications.js', 'api/_handlers/admin-notifications.js', [['../../../server/', '../../server/']]],
  ['api/v1/admin/users.js', 'api/_handlers/admin-users.js', [['../../../server/', '../../server/']]],
  ['api/v1/auth/token.js', 'api/_handlers/auth-token.js', [['../../../server/', '../../server/']]],
  ['api/v1/chat/index.js', 'api/_handlers/chat-app.js', [['../../../server/', '../../server/']]],
  ['api/v1/audit/index.js', 'api/_handlers/audit.js', [['../../../server/', '../../server/']]],
  ['api/v1/health/index.js', 'api/_handlers/health.js', [['../../../server/', '../../server/']]],
  ['api/v1/health/dependencies.js', 'api/_handlers/health-dependencies.js', [['../../../server/', '../../server/']]],
  ['api/v1/health/kafka.js', 'api/_handlers/health-kafka.js', [['../../../server/', '../../server/']]],
  ['api/v1/health/ready.js', 'api/_handlers/health-ready.js', [['../../../server/', '../../server/']]],
  ['api/v1/health/redis.js', 'api/_handlers/health-redis.js', [['../../../server/', '../../server/']]],
  ['api/v1/metrics.js', 'api/_handlers/metrics.js', [['../../server/', '../../server/']]],
  ['api/v1/performance.js', 'api/_handlers/performance.js', [['../../server/', '../../server/']]],
  ['api/admin-auth.js', 'api/_handlers/admin-auth.js', [['../server/', '../../server/']]],
  ['api/candidate-history.js', 'api/_handlers/candidate-history.js', [['../server/', '../../server/']]],
  ['api/candidate-ai-evaluation.js', 'api/_handlers/candidate-ai-evaluation.js', [['../server/', '../../server/']]],
  ['api/send-email.js', 'api/_handlers/send-email.js', [['../server/', '../../server/']]],
  ['api/ai-feedback.js', 'api/_handlers/ai-feedback.js', [['../server/', '../../server/']]],
];

for (const [src, dest, pairs] of endpoints) {
  copyAndReplace(src, dest, pairs);
}

console.log('✅ Consolidated handlers successfully populated in api/_handlers/');
