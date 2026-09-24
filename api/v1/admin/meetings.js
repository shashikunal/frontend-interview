// REST API: /api/v1/admin/meetings
// Direct and serverless handler delegating to _handlers/admin-meetings.js

import adminMeetingsHandler from '../../_handlers/admin-meetings.js';

export default async function handler(req, res) {
  return adminMeetingsHandler(req, res);
}
