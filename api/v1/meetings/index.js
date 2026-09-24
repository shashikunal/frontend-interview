// REST API: /api/v1/meetings
// Direct and serverless handler delegating to _handlers/meetings.js

import meetingsHandler from '../../_handlers/meetings.js';

export default async function handler(req, res) {
  return meetingsHandler(req, res);
}
