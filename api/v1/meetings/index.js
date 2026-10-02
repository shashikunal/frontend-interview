// REST API: /api/v1/meetings
// Direct and serverless handler delegating to _handlers/meetings.js

import { applySecurityHeaders } from '../../../server/security/securityHeaders.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';
import recordingHandler from '../../_handlers/meetings/recording.js';
import chatHandler from '../../_handlers/meetings/chat.js';
import meetingsHandler from '../../_handlers/meetings.js';

export default async function handler(req, res) {
  if (!applySecurityHeaders(req, res)) {
    return;
  }

  const urlObj = new URL(req.url || '/', 'http://localhost');
  const pathname = urlObj.pathname.toLowerCase().replace(/\/+$/, '');
  const subpath = (req.query?._subpath || urlObj.searchParams.get('_subpath') || '').toLowerCase();

  if (pathname.endsWith('/recording') || pathname.includes('/recording') || subpath === 'recording') {
    return recordingHandler(req, res);
  }
  if (pathname.endsWith('/chat') || pathname.includes('/chat') || subpath === 'chat') {
    return chatHandler(req, res);
  }

  return meetingsHandler(req, res);
}
