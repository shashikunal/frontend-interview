// REST API: /api/v1/meetings/signaling
// Lightweight, ultra-reliable signaling relay for WebRTC, screen share, and peer presence
// Ensures seamless multi-participant audio/video, screen sharing, and presence
// even on serverless environments where persistent WebSockets are not available.

import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';
import { tokenService } from '../../../server/auth/tokenService.ts';

// In-memory room state ledger keyed by meetingId
if (!globalThis.__MEETING_SIGNALING_STATE__) {
  globalThis.__MEETING_SIGNALING_STATE__ = new Map();
}
const roomStates = globalThis.__MEETING_SIGNALING_STATE__;

function getRoom(meetingId) {
  if (!roomStates.has(meetingId)) {
    roomStates.set(meetingId, {
      participants: new Map(), // userId -> { userId, name, role, isHost, micState, cameraState, screenShareState, lastSeen }
      messages: [], // Array of { id, senderId, targetId, type, payload, timestamp }
      screenShare: null, // { presenterId, presenterName, dataUrl, timestamp }
    });
  }
  return roomStates.get(meetingId);
}

// Cleanup stale messages and participants (older than 30s)
function sweepStale(room) {
  const now = Date.now();
  for (const [userId, p] of room.participants.entries()) {
    if (now - p.lastSeen > 35000) {
      room.participants.delete(userId);
    }
  }
  room.messages = room.messages.filter(m => now - m.timestamp < 30000);
  if (room.screenShare && now - room.screenShare.timestamp > 20000) {
    room.screenShare = null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Authenticate Request
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  let caller = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const auth = tokenService.verifyMeetingToken(token);
    if (auth.valid && auth.claims) {
      caller = {
        id: auth.claims.userId,
        name: auth.claims.userName,
        role: auth.claims.userRole,
        meetingRole: auth.claims.meetingRole,
      };
    }
  }

  // 2. GET: Poll signaling messages and active participants
  if (req.method === 'GET') {
    const meetingId = req.query?.meetingId;
    const userId = req.query?.userId || caller?.id;

    if (!meetingId || !userId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId and userId are required.'));
    }

    const room = getRoom(meetingId);
    sweepStale(room);

    // Refresh presence lastSeen for polling user
    const existing = room.participants.get(userId);
    if (existing) {
      existing.lastSeen = Date.now();
    }

    // Extract pending messages for this user (or broadcast to all, but not from self)
    const pendingMessages = room.messages.filter(m => {
      const isForMe = !m.targetId || m.targetId === userId || m.targetId === 'ALL';
      const isFromOther = m.senderId !== userId;
      return isForMe && isFromOther;
    });

    // Remove direct 1:1 messages that were collected for this user
    room.messages = room.messages.filter(m => {
      if (m.targetId === userId) return false;
      return true;
    });

    const participantList = Array.from(room.participants.values()).map(p => ({
      id: p.userId,
      name: p.name,
      role: p.role || 'PARTICIPANT',
      isHost: p.isHost || false,
      audioEnabled: p.micState !== false,
      videoEnabled: p.cameraState !== false,
      screenShareEnabled: p.screenShareState === true,
      lastSeen: p.lastSeen,
    }));

    return res.status(200).json({
      success: true,
      meetingId,
      participants: participantList,
      messages: pendingMessages,
      screenShare: room.screenShare,
      timestamp: Date.now(),
    });
  }

  // 3. POST: Join, Heartbeat, Signal, Screen Frame, Leave
  if (req.method === 'POST') {
    const body = req.body || {};
    const {
      action = 'HEARTBEAT',
      meetingId,
      userId = caller?.id,
      userName = caller?.name || 'Participant',
      role = caller?.meetingRole || 'PARTICIPANT',
      isHost = caller?.role === 'admin' || caller?.meetingRole === 'HOST',
      micState = true,
      cameraState = true,
      screenShareState = false,
      targetUserId,
      signalType,
      payload,
      screenFrame,
    } = body;

    if (!meetingId || !userId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId and userId are required.'));
    }

    const room = getRoom(meetingId);
    sweepStale(room);

    if (action === 'JOIN' || action === 'HEARTBEAT' || action === 'UPDATE_MEDIA') {
      room.participants.set(userId, {
        userId,
        name: userName,
        role,
        isHost,
        micState,
        cameraState,
        screenShareState,
        lastSeen: Date.now(),
      });

      return res.status(200).json({
        success: true,
        meetingId,
        participantsCount: room.participants.size,
      });
    }

    if (action === 'SIGNAL') {
      if (!signalType) {
        return res.status(400).json(createErrorResponse('BadRequest', 'signalType is required for SIGNAL action.'));
      }

      const msg = {
        id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId: userId,
        senderName: userName,
        targetId: targetUserId || 'ALL',
        type: signalType,
        payload,
        timestamp: Date.now(),
      };

      room.messages.push(msg);

      return res.status(200).json({ success: true, messageId: msg.id });
    }

    if (action === 'SCREEN_FRAME') {
      if (screenFrame) {
        room.screenShare = {
          presenterId: userId,
          presenterName: userName,
          dataUrl: screenFrame,
          timestamp: Date.now(),
        };
        const p = room.participants.get(userId);
        if (p) p.screenShareState = true;
      } else {
        room.screenShare = null;
        const p = room.participants.get(userId);
        if (p) p.screenShareState = false;
      }

      return res.status(200).json({ success: true, active: !!room.screenShare });
    }

    if (action === 'LEAVE') {
      room.participants.delete(userId);
      if (room.screenShare?.presenterId === userId) {
        room.screenShare = null;
      }

      return res.status(200).json({ success: true, left: true });
    }

    return res.status(400).json(createErrorResponse('BadRequest', `Unknown action: ${action}`));
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed'));
}
