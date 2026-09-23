// REST API: /api/v1/meetings/recording
// Phase 17: Recording, Media Storage, Presigned URLs & Transcript Retrieval

import { recordingService } from '../../../server/media/recordingService.ts';
import { transcriptionService } from '../../../server/media/transcriptionService.ts';
import { objectStorageService } from '../../../server/media/objectStorageService.ts';
import { tokenService } from '../../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';
import { applySecurityHeaders } from '../../../server/security/securityHeaders.ts';

export default async function handler(req, res) {
  if (!applySecurityHeaders(req, res)) {
    return;
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const urlObj = new URL(req.url || '/', 'http://localhost');
  const action = (req.query?.action || urlObj.searchParams.get('action') || (req.body?.action || '')).toUpperCase();

  // 1. Unauthenticated/Presigned Media Stream (HTTP Range Request)
  if (req.method === 'GET' && action === 'STREAM') {
    const key = req.query?.key || urlObj.searchParams.get('key');
    const expires = parseInt(req.query?.expires || urlObj.searchParams.get('expires') || '0', 10);
    const signature = req.query?.signature || urlObj.searchParams.get('signature');

    if (!key || !expires || !signature) {
      return res.status(401).json(createErrorResponse('Unauthorized', 'Missing signature parameters', 'INVALID_SIGNATURE'));
    }

    const isValid = objectStorageService.validatePresignedSignature(key, expires, signature);
    if (!isValid) {
      return res.status(403).json(createErrorResponse('Forbidden', 'Expired or invalid presigned signature', 'SIGNATURE_EXPIRED'));
    }

    // Parse HTTP Range header if present
    const rangeHeader = req.headers?.range || req.headers?.Range;
    let rangeOptions;
    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace('bytes=', '').split('-');
      rangeOptions = {
        start: parseInt(parts[0], 10),
        end: parts[1] ? parseInt(parts[1], 10) : undefined,
      };
    }

    const mediaResult = await objectStorageService.getObject(key, rangeOptions);
    if (!mediaResult) {
      return res.status(404).json(createErrorResponse('NotFound', 'Recording file not found in storage', 'FILE_NOT_FOUND'));
    }

    res.setHeader('Content-Type', mediaResult.contentType);
    res.setHeader('Accept-Ranges', 'bytes');

    if (mediaResult.isPartial && mediaResult.contentRange) {
      res.setHeader('Content-Range', mediaResult.contentRange);
      res.setHeader('Content-Length', mediaResult.contentLength);
      return res.status(206).send(mediaResult.buffer);
    }

    res.setHeader('Content-Length', mediaResult.contentLength);
    return res.status(200).send(mediaResult.buffer);
  }

  // 2. Authenticated Endpoints: Verify Bearer Token
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required', 'MISSING_TOKEN'));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(createErrorResponse('Unauthorized', auth.error || 'Invalid token', auth.errorCode || 'UNAUTHORIZED'));
  }

  const user = {
    id: auth.claims.userId,
    email: auth.claims.userEmail,
    name: auth.claims.userName,
    role: auth.claims.userRole,
    meetingRole: auth.claims.meetingRole,
    permissions: auth.claims.permissions || [],
  };

  // 3. POST Actions: START / STOP
  if (req.method === 'POST') {
    const { meetingId, recordingId, resolution } = req.body || {};

    if (action === 'START') {
      if (!meetingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required', 'MISSING_PARAM'));
      }
      const startResult = await recordingService.startRecording(user, { meetingId, resolution });
      if (!startResult.success) {
        const status = startResult.code === 'FORBIDDEN' ? 403 : 400;
        return res.status(status).json(createErrorResponse(startResult.code || 'Error', startResult.error || 'Failed', startResult.code));
      }
      return res.status(201).json({ success: true, recording: startResult.recording });
    }

    if (action === 'STOP') {
      if (!meetingId || !recordingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId and recordingId are required', 'MISSING_PARAM'));
      }
      const stopResult = await recordingService.stopRecording(user, { recordingId, meetingId });
      if (!stopResult.success) {
        const status = stopResult.code === 'FORBIDDEN' ? 403 : stopResult.code === 'RECORDING_NOT_FOUND' ? 404 : 400;
        return res.status(status).json(createErrorResponse(stopResult.code || 'Error', stopResult.error || 'Failed', stopResult.code));
      }
      return res.status(200).json({ success: true, recording: stopResult.recording });
    }

    return res.status(400).json(createErrorResponse('BadRequest', 'Unknown POST action. Use START or STOP.', 'INVALID_ACTION'));
  }

  // 4. GET Actions: LIST, ACCESS, TRANSCRIPT, SEARCH_TRANSCRIPT
  if (req.method === 'GET') {
    const meetingId = req.query?.meetingId || urlObj.searchParams.get('meetingId');
    const recordingId = req.query?.recordingId || urlObj.searchParams.get('recordingId');

    if (action === 'LIST') {
      if (!meetingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required', 'MISSING_PARAM'));
      }
      const listResult = recordingService.getRecordingsForMeeting(user, meetingId);
      return res.status(200).json(listResult);
    }

    if (action === 'ACCESS') {
      if (!recordingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'recordingId is required', 'MISSING_PARAM'));
      }
      const accessResult = recordingService.getRecordingAccess(user, recordingId);
      if (!accessResult.success) {
        const status = accessResult.code === 'FORBIDDEN_CROSS_MEETING_ACCESS' ? 403 : accessResult.code === 'NOT_FOUND' ? 404 : 400;
        return res.status(status).json(createErrorResponse(accessResult.code || 'Error', accessResult.error || 'Failed', accessResult.code));
      }
      return res.status(200).json(accessResult);
    }

    if (action === 'TRANSCRIPT') {
      if (!recordingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'recordingId is required', 'MISSING_PARAM'));
      }
      // IDOR check: verify access to recording first
      const accessCheck = recordingService.getRecordingAccess(user, recordingId);
      if (!accessCheck.success) {
        const status = accessCheck.code === 'FORBIDDEN_CROSS_MEETING_ACCESS' ? 403 : 404;
        return res.status(status).json(createErrorResponse(accessCheck.code || 'Error', accessCheck.error || 'Failed', accessCheck.code));
      }

      const transcript = transcriptionService.getTranscriptForRecording(recordingId);
      if (!transcript) {
        return res.status(200).json({ success: true, status: 'PROCESSING', transcript: null });
      }
      return res.status(200).json({ success: true, status: transcript.status, transcript });
    }

    if (action === 'SEARCH_TRANSCRIPT') {
      const q = req.query?.q || urlObj.searchParams.get('q') || '';
      if (!meetingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required', 'MISSING_PARAM'));
      }
      const matches = transcriptionService.searchTranscript(meetingId, q);
      return res.status(200).json({ success: true, matches, count: matches.length });
    }

    return res.status(400).json(createErrorResponse('BadRequest', 'Unknown GET action.', 'INVALID_ACTION'));
  }

  // 5. DELETE Action: Delete recording
  if (req.method === 'DELETE') {
    const recordingId = req.query?.recordingId || urlObj.searchParams.get('recordingId') || req.body?.recordingId;
    if (!recordingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'recordingId is required', 'MISSING_PARAM'));
    }
    const delResult = await recordingService.deleteRecording(user, recordingId);
    if (!delResult.success) {
      const status = delResult.code === 'FORBIDDEN' ? 403 : delResult.code === 'NOT_FOUND' ? 404 : 400;
      return res.status(status).json(createErrorResponse(delResult.code || 'Error', delResult.error || 'Failed', delResult.code));
    }
    return res.status(200).json({ success: true, message: 'Recording deleted successfully' });
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
}
