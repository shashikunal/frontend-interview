// REST API: /api/v1/meetings/editor
// Media & Realtime Plane: In-Meeting Collaborative Monaco Code Editor & Sandbox
// Handles code sync, language switching, template loading, host locking, and execution

import { tokenService } from '../../../../server/auth/tokenService.ts';
import { editorService, BUILTIN_PROBLEM_TEMPLATES } from '../../../../server/meetings/editorService.ts';
import { createErrorResponse } from '../../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Authenticate Caller
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required for code editor.', 'MISSING_TOKEN'));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(createErrorResponse('Unauthorized', auth.error || 'Invalid session token.', auth.errorCode || 'UNAUTHORIZED'));
  }

  const caller = {
    id: auth.claims.userId,
    email: auth.claims.userEmail,
    name: auth.claims.userName,
    role: auth.claims.userRole,
    meetingRole: auth.claims.meetingRole,
    permissions: auth.claims.permissions || [],
  };

  // 2. Handle GET: Retrieve Editor Document Snapshot
  if (req.method === 'GET') {
    const meetingId = req.query?.meetingId || auth.claims.meetingId;
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId query parameter is required.', 'MISSING_MEETING_ID'));
    }

    const document = editorService.getOrCreateDocument(meetingId);
    return res.status(200).json({
      success: true,
      document,
      templates: BUILTIN_PROBLEM_TEMPLATES,
    });
  }

  // 3. Handle POST: Modify Document State or Execute Code
  if (req.method === 'POST') {
    const { action = 'SYNC_CODE', meetingId, code, language, readOnly, templateId, cursorLine, cursorColumn } = req.body || {};
    const targetMeetingId = meetingId || auth.claims.meetingId;

    if (!targetMeetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'MISSING_MEETING_ID'));
    }

    try {
      if (action === 'SYNC_CODE') {
        if (typeof code !== 'string') {
          return res.status(400).json(createErrorResponse('BadRequest', 'Code string is required.', 'INVALID_CODE'));
        }
        const document = editorService.syncCode(targetMeetingId, code, caller.id, caller.name);
        return res.status(200).json({ success: true, document });
      }

      if (action === 'SET_LANGUAGE') {
        if (!language) {
          return res.status(400).json(createErrorResponse('BadRequest', 'Language is required.', 'INVALID_LANGUAGE'));
        }
        const document = editorService.setLanguage(targetMeetingId, language, caller.id, caller.name, req.body?.replaceCodeWithStarter);
        return res.status(200).json({ success: true, document });
      }

      if (action === 'TOGGLE_LOCK') {
        if (typeof readOnly !== 'boolean') {
          return res.status(400).json(createErrorResponse('BadRequest', 'Boolean readOnly flag is required.', 'INVALID_LOCK_STATE'));
        }
        const document = editorService.toggleLock(targetMeetingId, readOnly, caller.id, caller.name, caller.meetingRole);
        return res.status(200).json({ success: true, document });
      }

      if (action === 'LOAD_TEMPLATE') {
        if (!templateId) {
          return res.status(400).json(createErrorResponse('BadRequest', 'templateId is required.', 'INVALID_TEMPLATE_ID'));
        }
        const result = editorService.loadTemplate(targetMeetingId, templateId, caller.id, caller.name);
        return res.status(200).json({ success: true, ...result });
      }

      if (action === 'RESET_CODE') {
        const document = editorService.resetCode(targetMeetingId, caller.id, caller.name);
        return res.status(200).json({ success: true, document });
      }

      if (action === 'PRESENCE_UPDATE') {
        const document = editorService.updatePresence(targetMeetingId, caller.id, caller.name, cursorLine, cursorColumn);
        return res.status(200).json({ success: true, document });
      }

      if (action === 'RUN_CODE') {
        const result = editorService.executeCode(targetMeetingId, caller.id, caller.name, code);
        return res.status(200).json({ success: true, result });
      }

      return res.status(400).json(createErrorResponse('BadRequest', `Unknown editor action "${action}".`, 'UNKNOWN_ACTION'));
    } catch (actionError) {
      const errMsg = actionError instanceof Error ? actionError.message : String(actionError);
      return res.status(400).json(createErrorResponse('BadRequest', errMsg, 'EDITOR_ACTION_FAILED'));
    }
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Only GET and POST are supported.', 'METHOD_NOT_ALLOWED'));
}
