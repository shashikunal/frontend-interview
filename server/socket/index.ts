import crypto from 'crypto';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Http2SecureServer } from 'http2';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types.js';
import { authenticateSocket } from './auth.js';
import { getInterviewRoom, getMeetingRoom, canJoinSession, canMonitorSession, canAccessMeeting, getAppChatConversationRoom, getAppChatUserRoom } from './rooms.js';
import { sessionStateManager } from './sessionState.js';
import { chatService } from '../meetings/chatService.ts';
import { meetingService } from '../meetings/meetingService.ts';
import { meetingPresenceService } from '../meetings/meetingPresenceService.ts';
import { tokenService } from '../auth/tokenService.ts';
import { appChatService } from '../chat/appChatService.ts';
import { redisPresenceService } from '../chat/redisPresenceService.ts';
import { activeWebSocketConnectionsGauge } from '../observability/metrics.ts';
import { logger } from '../observability/logger.ts';
import { isOriginAllowed } from '../security/securityHeaders.ts';

let ioInstance: SocketIOServer<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData> | null = null;

export function initSocketServer(server: HTTPServer | Http2SecureServer): SocketIOServer<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData> {
  if (ioInstance) {
    return ioInstance;
  }

  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(server as any, {
    path: '/api/socket',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    cors: {
      origin: (requestOrigin, callback) => {
        if (!requestOrigin || isOriginAllowed(requestOrigin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS origin not allowed'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    maxHttpBufferSize: 1e6, // 1MB payload ceiling
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // 1. Authenticate every connection
  io.use(authenticateSocket);

  // 2. Connection lifecycle
  io.on('connection', (socket) => {
    const user = socket.data.user;
    activeWebSocketConnectionsGauge.inc();
    logger.debug(`[Socket.IO] Client connected: ${socket.id}`, {
      userId: user?.id,
      role: user?.role,
    });

    // ── Phase 7: Application Chat Presence & User Room ────────────────────
    if (user?.id) {
      const userRoom = getAppChatUserRoom(user.id);
      socket.join(userRoom);

      const { statusChanged, presence } = redisPresenceService.registerConnection(user.id, socket.id);
      if (statusChanged) {
        io.emit('app:chat:presence:update', {
          userId: user.id,
          status: 'ONLINE',
          lastSeen: presence.lastSeen,
        });
      }
    }

    // ── Candidate: session:join ───────────────────────────────────────────
    socket.on('session:join', async (data: any, callback?: any) => {
      const { sessionId, questionId, questionTitle, language, initialCode } = data;
      if (!sessionId) {
        callback?.({ success: false, error: 'Missing sessionId' });
        return;
      }

      // Check authorization: prevent cross-student room access
      const authorized = await canJoinSession(user, sessionId);
      if (!authorized) {
        console.warn(`[Socket.IO Security] Unauthorized session:join attempt by ${user?.id} on ${sessionId}`);
        socket.emit('error', { message: 'Unauthorized session access', code: 'FORBIDDEN' });
        callback?.({ success: false, error: 'Unauthorized session access' });
        return;
      }

      console.log(`[SOCKET-SERVER] session authorized for session ${sessionId} by user ${user?.name}`);
      const room = getInterviewRoom(sessionId);
      await socket.join(room);
      socket.data.sessionId = sessionId;
      console.log(`[SOCKET-SERVER] room joined: ${room}`);

      // Initialize or get current session state
      let state = await sessionStateManager.getState(sessionId);
      if (!state) {
        state = sessionStateManager.initOrUpdate({
          sessionId,
          candidateId: user.id,
          candidateName: user.name,
          questionId: questionId || '',
          questionTitle: questionTitle || '',
          language: language || 'javascript',
          code: initialCode || '',
          presence: 'online',
        });
      } else {
        state.presence = 'online';
        if (questionId) state.questionId = questionId;
        if (questionTitle) state.questionTitle = questionTitle;
      }

      // Initialize server-side Yjs document
      sessionStateManager.getOrCreateYDoc(sessionId, initialCode || state.code, 'solution.js');

      sessionStateManager.recordActivity(sessionId, 'SESSION_STARTED', `${user.name} joined session`);

      // Notify monitors in this room
      socket.to(room).emit('student:status', {
        sessionId,
        presence: 'online',
        timestamp: Date.now(),
      });

      socket.to(room).emit('student:activity', {
        sessionId,
        type: 'JOINED',
        message: `${user.name} connected to interview`,
        timestamp: Date.now(),
      });

      const docState = sessionStateManager.getYDocState(sessionId, initialCode, 'solution.js');
      callback?.({ success: true, state, docState: Array.from(docState) });
      socket.emit('session:state', state);

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Socket.IO] User ${user.name} joined room ${room}`);
      }
    });

    // ── Candidate: session:leave ──────────────────────────────────────────
    socket.on('session:leave', ({ sessionId }: { sessionId: string }) => {
      const room = getInterviewRoom(sessionId);
      socket.leave(room);
      sessionStateManager.setPresence(sessionId, 'disconnected');
      socket.to(room).emit('student:status', {
        sessionId,
        presence: 'disconnected',
        timestamp: Date.now(),
      });
    });

    // ── Candidate: session:heartbeat ──────────────────────────────────────
    socket.on('session:heartbeat', ({ sessionId, status }: { sessionId: string; status?: any }) => {
      sessionStateManager.setPresence(sessionId, status || 'online');
      const room = getInterviewRoom(sessionId);
      socket.to(room).emit('student:status', {
        sessionId,
        presence: status || 'online',
        timestamp: Date.now(),
      });
    });

    // ── Candidate: student:typing ─────────────────────────────────────────
    socket.on('student:typing', (data: any) => {
      const room = getInterviewRoom(data.sessionId);
      socket.to(room).emit('student:typing', data);
    });

    // ── Candidate: student:code-change (THE CRITICAL PATH) ─────────────────
    socket.on('student:code-change', (data: any) => {
      const updated = sessionStateManager.updateCode(data);
      const room = getInterviewRoom(data.sessionId);

      // Immediately broadcast live keystrokes to admin monitor in room
      socket.to(room).emit('student:code-change', {
        ...data,
        version: updated.codeVersion,
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Socket.IO Relay] code-change on ${data.sessionId} (${data.code.length} chars, v${updated.codeVersion})`);
      }
    });

    // ── Candidate: student:keystroke (Zero-Latency Character-by-Character Relay) ──
    socket.on('student:keystroke', (data: any) => {
      if (!data?.sessionId) return;
      const room = getInterviewRoom(data.sessionId);
      socket.to(room).emit('student:keystroke', data);
    });

    // ── Candidate: student:cursor-change ──────────────────────────────────
    socket.on('student:cursor-change', (data: any) => {
      const room = getInterviewRoom(data.sessionId);
      socket.to(room).emit('student:cursor-change', data);
    });

    // ── Candidate: student:file-change ────────────────────────────────────
    socket.on('student:file-change', (data: any) => {
      const room = getInterviewRoom(data.sessionId);
      sessionStateManager.recordActivity(data.sessionId, 'FILE_OPENED', `Switched to ${data.fileId}`, data.timestamp);
      socket.to(room).emit('student:file-change', data);
    });

    // ── Candidate: student:question-change ────────────────────────────────
    socket.on('student:question-change', (data: any) => {
      const room = getInterviewRoom(data.sessionId);
      sessionStateManager.initOrUpdate({
        sessionId: data.sessionId,
        questionId: data.questionId,
        questionTitle: data.questionTitle,
      });
      sessionStateManager.recordActivity(data.sessionId, 'QUESTION_CHANGED', `Opened ${data.questionTitle || data.questionId}`, data.timestamp);
      socket.to(room).emit('student:question-change', data);
    });

    // ── Candidate: student:run-start ──────────────────────────────────────
    socket.on('student:run-start', (data: any) => {
      const room = getInterviewRoom(data.sessionId);
      sessionStateManager.recordActivity(data.sessionId, 'RUN_START', 'Started code execution', data.timestamp);
      socket.to(room).emit('student:run-start', data);
    });

    // ── Candidate: student:run-result ─────────────────────────────────────
    socket.on('student:run-result', (data: any) => {
      const room = getInterviewRoom(data.sessionId);
      const current = sessionStateManager.initOrUpdate({
        sessionId: data.sessionId,
        lastExecution: {
          status: data.status,
          passed: data.passed,
          total: data.total,
          runtimeMs: data.runtimeMs,
          output: data.output,
          error: data.error,
          timestamp: data.timestamp,
        },
      });

      const summary = data.status === 'success'
        ? `Passed all ${data.total} tests (${data.runtimeMs || 0}ms)`
        : `Failed: ${data.passed}/${data.total} passed`;

      sessionStateManager.recordActivity(data.sessionId, 'RUN_RESULT', summary, data.timestamp);
      socket.to(room).emit('student:run-result', data);
      socket.to(room).emit('session:state', current);
    });

    // ── Candidate: student:activity ───────────────────────────────────────
    socket.on('student:activity', (data: any) => {
      sessionStateManager.recordActivity(data.sessionId, data.type, data.message, data.timestamp);
      const room = getInterviewRoom(data.sessionId);
      socket.to(room).emit('student:activity', data);
    });

    // ── Admin: monitor:subscribe ──────────────────────────────────────────
    socket.on('monitor:subscribe', async ({ sessionId }: { sessionId: string }, callback?: any) => {
      if (!sessionId) {
        callback?.({ success: false, error: 'Missing sessionId' });
        return;
      }

      // Authorize admin
      const isAuthorizedAdmin = await canMonitorSession(user, sessionId);
      if (!isAuthorizedAdmin) {
        console.warn(`[Socket.IO Security] Non-admin ${user?.id} attempted monitor:subscribe on ${sessionId}`);
        socket.emit('error', { message: 'Unauthorized monitoring access', code: 'FORBIDDEN' });
        callback?.({ success: false, error: 'Forbidden: Admin authorization required' });
        return;
      }

      const room = getInterviewRoom(sessionId);
      await socket.join(room);
      socket.data.subscribedSessions.add(sessionId);

      // Hydrate / retrieve latest session state and Yjs document state
      const state = await sessionStateManager.getState(sessionId);
      const docState = sessionStateManager.getYDocState(sessionId, state?.code, state?.activeFile || 'solution.js');

      socket.emit('monitor:ack', { sessionId, connectedAt: Date.now() });
      if (state) {
        socket.emit('session:state', state);
      }
      socket.emit('yjs:sync-response', { sessionId, docState });
      callback?.({ success: true, state: state || undefined, docState });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Socket.IO Monitor] Admin ${user.name} subscribed to room ${room} (Yjs docState size: ${docState.length} bytes)`);
      }
    });

    // ── Yjs: yjs:update (Incremental Binary Relay) ────────────────────────
    socket.on('yjs:update', (data: any) => {
      if (!data?.sessionId || !data?.update) return;
      const room = getInterviewRoom(data.sessionId);
      console.log(`[SOCKET-SERVER] Yjs update received for session ${data.sessionId} (${data.fileId})`);

      // Apply update to server in-memory Y.Doc (updates internal code text & schedules debounced checkpoint)
      const res = sessionStateManager.applyYjsUpdate(data.sessionId, data.update, data.fileId || 'solution.js');

      // Relay strictly within this session room
      socket.to(room).emit('yjs:update', data);
      console.log(`[SOCKET-SERVER] Yjs update forwarded to room ${room} (${res.length} chars)`);
    });

    // ── Yjs: yjs:sync-request (Full State Resync) ─────────────────────────
    socket.on('yjs:sync-request', (data: any, callback?: any) => {
      if (!data?.sessionId) return;
      const docState = sessionStateManager.getYDocState(data.sessionId, undefined, 'solution.js', data?.stateVector);
      const response = { sessionId: data.sessionId, docState: Array.from(docState) };
      callback?.(response);
      socket.emit('yjs:sync-response', response);
    });

    // ── Admin: monitor:unsubscribe ────────────────────────────────────────
    socket.on('monitor:unsubscribe', ({ sessionId }: { sessionId: string }) => {
      const room = getInterviewRoom(sessionId);
      socket.leave(room);
      socket.data.subscribedSessions.delete(sessionId);
    });

    // ══════════════════════════════════════════════════════════════════════
    // ── Phase 6: Meeting Chat Real-Time Handlers ─────────────────────────
    // ══════════════════════════════════════════════════════════════════════

    // ── Meeting: Join Meeting Room ────────────────────────────────────────
    socket.on('meeting:join', async (data: { meetingId: string; meetingToken?: string }, callback?: any) => {
      const { meetingId, meetingToken } = data || {};
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId' });
        return;
      }

      // Verify meeting access authorization
      const hasAccess = await canAccessMeeting(socket.data.user, meetingId);
      if (!hasAccess) {
        callback?.({ success: false, error: 'Unauthorized to join meeting' });
        return;
      }

      // Resolve meeting role from token if provided
      let callerMeetingRole = (socket.data.user?.role === 'admin' ? 'HOST' : 'PARTICIPANT') as any;
      if (meetingToken) {
        const verified = tokenService.verifyMeetingToken(meetingToken);
        if (verified.valid && verified.claims?.meetingRole) {
          callerMeetingRole = verified.claims.meetingRole;
        }
      }
      socket.data.role = callerMeetingRole === 'HOST' ? 'admin' : 'candidate';

      // Authoritative presence registration (validates user is not kicked/blacklisted)
      const regResult = meetingPresenceService.registerParticipant(meetingId, {
        userId: socket.data.user.id,
        socketId: socket.id,
        displayName: socket.data.user.name,
        role: callerMeetingRole,
      });

      if (!regResult.success) {
        callback?.({ success: false, error: regResult.error });
        return;
      }

      const room = getMeetingRoom(meetingId);
      await socket.join(room);
      socket.data.meetingId = meetingId;
      if (!socket.data.subscribedMeetings) {
        socket.data.subscribedMeetings = new Set();
      }
      socket.data.subscribedMeetings.add(meetingId);

      const meeting = meetingService.getMeetingById(meetingId);
      const allowChat = meeting?.settings?.allowChat !== false;

      // Broadcast new participant to room
      socket.to(room).emit('meeting:participant:joined', regResult.participant);

      // Broadcast system message to room: participant joined
      const joinMsg = chatService.sendSystemMessage(
        meetingId,
        `${socket.data.user.name} joined the meeting.`,
        { type: 'PARTICIPANT_JOINED', userId: socket.data.user.id }
      );
      socket.to(room).emit('meeting:chat:system', joinMsg);

      callback?.({
        success: true,
        allowChat,
        participants: meetingPresenceService.getRoomParticipants(meetingId),
      });
    });

    // ── Meeting: Leave Meeting Room ───────────────────────────────────────
    socket.on('meeting:leave', ({ meetingId }: { meetingId: string }) => {
      if (!meetingId) return;
      const room = getMeetingRoom(meetingId);
      socket.leave(room);
      if (socket.data.subscribedMeetings) {
        socket.data.subscribedMeetings.delete(meetingId);
      }

      meetingPresenceService.removeParticipantBySocket(socket.id);
      socket.to(room).emit('meeting:participant:left', {
        meetingId,
        userId: socket.data.user.id,
        socketId: socket.id,
      });

      const leaveMsg = chatService.sendSystemMessage(
        meetingId,
        `${socket.data.user.name} left the meeting.`,
        { type: 'PARTICIPANT_LEFT', userId: socket.data.user.id }
      );
      socket.to(room).emit('meeting:chat:system', leaveMsg);
    });

    // ── Meeting: Chat Send Message ────────────────────────────────────────
    socket.on('meeting:chat:send', async (data: any, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId', code: 'MISSING_MEETING_ID' });
        return;
      }

      const caller = {
        id: socket.data.user.id,
        email: socket.data.user.email || 'candidate@dev.local',
        name: socket.data.user.name,
        role: (socket.data.user.role === 'admin' ? 'admin' : 'candidate') as any,
        meetingRole: (socket.data.user.role === 'admin' ? 'HOST' : 'PARTICIPANT') as any,
        permissions: [] as string[],
      };

      const result = chatService.sendMessage(caller, {
        meetingId,
        content: data?.content,
        messageType: data?.messageType,
        codeLanguage: data?.codeLanguage,
        replyToMessageId: data?.replyToMessageId,
        correlationId: data?.correlationId,
      });

      if (!result.success) {
        socket.emit('meeting:chat:error', {
          code: result.code || 'SEND_FAILED',
          message: result.error || 'Failed to send message',
          correlationId: data?.correlationId,
        });
        callback?.(result);
        return;
      }

      const room = getMeetingRoom(meetingId);
      // Broadcast to all participants in meeting room
      io.to(room).emit('meeting:chat:message', result.message);
      callback?.({ success: true, message: result.message });
    });

    // ── Meeting: Chat Delete Message ──────────────────────────────────────
    socket.on('meeting:chat:delete', (data: { meetingId: string; messageId: string }, callback?: any) => {
      const { meetingId, messageId } = data || {};
      if (!meetingId || !messageId) {
        callback?.({ success: false, error: 'Missing meetingId or messageId', code: 'BAD_REQUEST' });
        return;
      }

      const caller = {
        id: socket.data.user.id,
        email: socket.data.user.email || 'candidate@dev.local',
        name: socket.data.user.name,
        role: (socket.data.user.role === 'admin' ? 'admin' : 'candidate') as any,
        meetingRole: (socket.data.user.role === 'admin' ? 'HOST' : 'PARTICIPANT') as any,
        permissions: [] as string[],
      };

      const result = chatService.deleteMessage(caller, messageId);
      if (!result.success) {
        callback?.(result);
        return;
      }

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:chat:deleted', {
        meetingId,
        messageId,
        deletedBy: socket.data.user.id,
      });
      callback?.({ success: true });
    });

    // ── Meeting: Chat Add/Toggle Reaction ─────────────────────────────────
    socket.on('meeting:chat:reaction', (data: { meetingId: string; messageId: string; emoji: string }, callback?: any) => {
      const { meetingId, messageId, emoji } = data || {};
      if (!meetingId || !messageId || !emoji) {
        callback?.({ success: false, error: 'Missing reaction fields' });
        return;
      }

      const result = chatService.addReaction(socket.data.user.id, {
        meetingId,
        messageId,
        emoji,
      });

      if (result.success && result.reactions) {
        const room = getMeetingRoom(meetingId);
        io.to(room).emit('meeting:chat:reaction', {
          meetingId,
          messageId,
          reactions: result.reactions,
        });
      }
      callback?.(result);
    });

    // ── Meeting: Chat Toggle (Host Enable/Disable) ────────────────────────
    socket.on('meeting:chat:toggle', (data: { meetingId: string; allowChat: boolean }, callback?: any) => {
      const { meetingId, allowChat } = data || {};
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId' });
        return;
      }

      const caller = {
        id: socket.data.user.id,
        email: socket.data.user.email || 'candidate@dev.local',
        name: socket.data.user.name,
        role: (socket.data.user.role === 'admin' ? 'admin' : 'candidate') as any,
        meetingRole: (socket.data.user.role === 'admin' ? 'HOST' : 'PARTICIPANT') as any,
        permissions: [] as string[],
      };

      const result = chatService.toggleChat(caller, meetingId, allowChat);
      if (!result.success) {
        callback?.(result);
        return;
      }

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:chat:status', {
        meetingId,
        allowChat: !!result.allowChat,
        updatedBy: socket.data.user.id,
      });
      if (result.systemMessage) {
        io.to(room).emit('meeting:chat:system', result.systemMessage);
      }
      callback?.({ success: true, allowChat: result.allowChat });
    });

    // ── Meeting: Host Announcement ────────────────────────────────────────
    socket.on('meeting:chat:announce', (data: { meetingId: string; content: string; correlationId?: string }, callback?: any) => {
      const { meetingId, content, correlationId } = data || {};
      if (!meetingId || !content) {
        callback?.({ success: false, error: 'Missing announcement fields' });
        return;
      }

      const caller = {
        id: socket.data.user.id,
        email: socket.data.user.email || 'candidate@dev.local',
        name: socket.data.user.name,
        role: (socket.data.user.role === 'admin' ? 'admin' : 'candidate') as any,
        meetingRole: (socket.data.user.role === 'admin' ? 'HOST' : 'PARTICIPANT') as any,
        permissions: [] as string[],
      };

      const result = chatService.sendAnnouncement(caller, meetingId, content, correlationId);
      if (!result.success) {
        callback?.(result);
        return;
      }

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:chat:announcement', result.message);
      callback?.({ success: true, message: result.message });
    });

    // ── Meeting: Reconnect Sync ───────────────────────────────────────────
    socket.on('meeting:chat:sync', (data: { meetingId: string; sinceTimestamp?: string }, callback?: any) => {
      const { meetingId, sinceTimestamp } = data || {};
      if (!meetingId) {
        callback?.({ success: false, messages: [] });
        return;
      }

      const messages = chatService.getMessagesSince(
        socket.data.user.id,
        meetingId,
        sinceTimestamp || new Date(0).toISOString()
      );
      callback?.({ success: true, messages });
    });

    // ══════════════════════════════════════════════════════════════════════
    // ── Phase 16: Advanced Meeting Collaboration & Media Handlers ─────────
    // ══════════════════════════════════════════════════════════════════════

    // ── Update Participant Media State (Mic, Cam, Screen, Network) ─────────
    socket.on('meeting:participant:state', (data: any, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId' });
        return;
      }

      const updated = meetingPresenceService.updateParticipantState(meetingId, socket.data.user.id, {
        micState: data.micState,
        cameraState: data.cameraState,
        screenShareState: data.screenShareState,
        connectionState: data.connectionState,
        connectionQuality: data.connectionQuality,
      });

      if (updated) {
        const room = getMeetingRoom(meetingId);
        socket.to(room).emit('meeting:participant:updated', updated);
      }
      callback?.({ success: !!updated });
    });

    // ── Raise Hand ────────────────────────────────────────────────────────
    socket.on('meeting:hand:raise', (data: { meetingId: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId' });
        return;
      }

      const updated = meetingPresenceService.raiseHand(meetingId, socket.data.user.id);
      if (updated) {
        const room = getMeetingRoom(meetingId);
        io.to(room).emit('meeting:hand:raised', {
          meetingId,
          userId: socket.data.user.id,
          handRaisedAt: updated.handRaisedAt || new Date().toISOString(),
        });
      }
      callback?.({ success: !!updated });
    });

    // ── Lower Hand ────────────────────────────────────────────────────────
    socket.on('meeting:hand:lower', (data: { meetingId: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId' });
        return;
      }

      const updated = meetingPresenceService.lowerHand(meetingId, socket.data.user.id);
      if (updated) {
        const room = getMeetingRoom(meetingId);
        io.to(room).emit('meeting:hand:lowered', {
          meetingId,
          userId: socket.data.user.id,
        });
      }
      callback?.({ success: !!updated });
    });

    // ── Host Lower Participant's Hand ─────────────────────────────────────
    socket.on('meeting:hand:host-lower', (data: { meetingId: string; targetUserId: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId || !data?.targetUserId) {
        callback?.({ success: false, error: 'Missing meetingId or targetUserId' });
        return;
      }

      const res = meetingPresenceService.hostLowerHand(meetingId, socket.data.user.id, data.targetUserId);
      if (!res.success) {
        callback?.({ success: false, error: res.error });
        return;
      }

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:hand:lowered', {
        meetingId,
        userId: data.targetUserId,
      });
      callback?.({ success: true });
    });

    // ── Send Ephemeral Reaction (Rate-Limited, Controlled Allowlist) ───────
    socket.on('meeting:reaction', (data: { meetingId: string; emoji: string; correlationId?: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId || !data?.emoji) {
        callback?.({ success: false, error: 'Missing meetingId or emoji' });
        return;
      }

      const check = meetingPresenceService.validateReaction(socket.data.user.id, data.emoji);
      if (!check.allowed) {
        callback?.({ success: false, error: check.error });
        return;
      }

      const reactionPayload = {
        meetingId,
        reactionId: `rx_${crypto.randomUUID().slice(0, 8)}`,
        userId: socket.data.user.id,
        userName: socket.data.user.name,
        emoji: data.emoji,
        timestamp: Date.now(),
      };

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:reaction:broadcast', reactionPayload);
      callback?.({ success: true });
    });

    // ── Host: Remote Mute Request ─────────────────────────────────────────
    socket.on('meeting:host:mute-participant', (data: { meetingId: string; targetUserId: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId || !data?.targetUserId) {
        callback?.({ success: false, error: 'Missing meetingId or targetUserId' });
        return;
      }

      const res = meetingPresenceService.hostRequestMute(meetingId, socket.data.user.id, data.targetUserId);
      if (!res.success) {
        callback?.({ success: false, error: res.error });
        return;
      }

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:host:mute-requested', {
        meetingId,
        targetUserId: data.targetUserId,
        requestedBy: socket.data.user.id,
      });
      callback?.({ success: true });
    });

    // ── Host: Remove Participant ──────────────────────────────────────────
    socket.on('meeting:host:remove-participant', (data: { meetingId: string; targetUserId: string; reason?: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId || !data?.targetUserId) {
        callback?.({ success: false, error: 'Missing meetingId or targetUserId' });
        return;
      }

      const res = meetingPresenceService.hostRemoveParticipant(meetingId, socket.data.user.id, data.targetUserId);
      if (!res.success) {
        callback?.({ success: false, error: res.error });
        return;
      }

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:participant:removed', {
        meetingId,
        targetUserId: data.targetUserId,
        reason: data.reason || 'Removed by host',
      });

      // Target socket leaves room if connected
      if (res.targetSocketId) {
        const targetSocket = io.sockets.sockets.get(res.targetSocketId);
        targetSocket?.leave(room);
      }

      callback?.({ success: true });
    });

    // ── Host: End Meeting For All ─────────────────────────────────────────
    socket.on('meeting:host:end-meeting', async (data: { meetingId: string; reason?: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId) {
        callback?.({ success: false, error: 'Missing meetingId' });
        return;
      }

      const caller = {
        id: socket.data.user.id,
        email: socket.data.user.email || 'host@dev.local',
        name: socket.data.user.name,
        role: (socket.data.user.role === 'admin' ? 'admin' : 'candidate') as any,
        meetingRole: (socket.data.user.role === 'admin' ? 'HOST' : 'PARTICIPANT') as any,
        permissions: [] as string[],
      };

      const trans = meetingService.transitionStatus(caller, meetingId, 'ENDED', data.reason || 'Host ended meeting');
      if (!trans.success && trans.code !== 'INVALID_TRANSITION') {
        callback?.({ success: false, error: trans.error });
        return;
      }

      meetingPresenceService.terminateRoom(meetingId);

      const room = getMeetingRoom(meetingId);
      io.to(room).emit('meeting:ended', {
        meetingId,
        reason: data.reason || 'Meeting ended by host',
      });

      callback?.({ success: true });
    });

    // ── Sync State Snapshot (Reconnect Reconciliation) ────────────────────
    socket.on('meeting:sync-state', (data: { meetingId: string }, callback?: any) => {
      const meetingId = data?.meetingId || socket.data.meetingId;
      if (!meetingId) {
        callback?.({ success: false, participants: [] });
        return;
      }

      const participants = meetingPresenceService.getRoomParticipants(meetingId);
      callback?.({ success: true, participants });
    });

    // ── Phase 7: Application Chat Events ──────────────────────────────────

    // Subscribe to conversations or join room
    socket.on('app:chat:subscribe', (data: { conversationIds?: string[] }, callback?: any) => {
      const convIds = data?.conversationIds || [];
      for (const id of convIds) {
        if (appChatService.isMember(id, user.id)) {
          socket.join(getAppChatConversationRoom(id));
        }
      }
      callback?.({ success: true });
    });

    socket.on('app:chat:join', (data: { conversationId: string }, callback?: any) => {
      const { conversationId } = data || {};
      if (!conversationId) {
        callback?.({ success: false, error: 'Missing conversationId' });
        return;
      }
      if (!appChatService.isMember(conversationId, user.id)) {
        callback?.({ success: false, error: 'Access denied: not an active member' });
        return;
      }
      socket.join(getAppChatConversationRoom(conversationId));
      callback?.({ success: true });
    });

    socket.on('app:chat:leave', (data: { conversationId: string }) => {
      if (data?.conversationId) {
        socket.leave(getAppChatConversationRoom(data.conversationId));
      }
    });

    // Send Application Chat Message
    socket.on('app:chat:message:send', async (data: any, callback?: any) => {
      const { conversationId, content, clientMessageId, metadata } = data || {};
      if (!conversationId || !content) {
        callback?.({ success: false, error: 'Missing required fields', code: 'BAD_REQUEST' });
        return;
      }

      const result = await appChatService.sendMessage(
        { id: user.id, name: user.name },
        { conversationId, content, clientMessageId, metadata }
      );

      if (!result.success || !result.message) {
        callback?.(result);
        return;
      }

      const convRoom = getAppChatConversationRoom(conversationId);
      // 1. Broadcast to active conversation room
      io.to(convRoom).emit('app:chat:message:created', result.message);

      // 2. Also emit to user rooms of participants for real-time conversation list updates
      const partsMap = appChatService.participants.get(conversationId);
      if (partsMap) {
        for (const p of partsMap.values()) {
          if (!p.leftAt) {
            io.to(getAppChatUserRoom(p.userId)).emit('app:chat:message:created', result.message);
          }
        }
      }

      callback?.({ success: true, message: result.message, reused: result.reused });
    });

    // Delete Message
    socket.on('app:chat:message:delete', (data: { conversationId: string; messageId: string }, callback?: any) => {
      const { conversationId, messageId } = data || {};
      if (!conversationId || !messageId) {
        callback?.({ success: false, error: 'Missing conversationId or messageId', code: 'BAD_REQUEST' });
        return;
      }

      const result = appChatService.deleteMessage(user.id, conversationId, messageId);
      if (!result.success) {
        callback?.(result);
        return;
      }

      const convRoom = getAppChatConversationRoom(conversationId);
      io.to(convRoom).emit('app:chat:message:deleted', {
        conversationId,
        messageId,
        deletedBy: user.id,
      });

      callback?.({ success: true });
    });

    // Read Message / Mark Read
    socket.on('app:chat:message:read', (data: { conversationId: string; messageId?: string }, callback?: any) => {
      const { conversationId, messageId } = data || {};
      if (!conversationId) {
        callback?.({ success: false, error: 'Missing conversationId', code: 'BAD_REQUEST' });
        return;
      }

      const result = appChatService.markConversationRead(conversationId, user.id, messageId);
      if (!result.success) {
        callback?.(result);
        return;
      }

      const convRoom = getAppChatConversationRoom(conversationId);
      io.to(convRoom).emit('app:chat:message:read', {
        conversationId,
        userId: user.id,
        lastReadMessageId: result.lastReadMessageId!,
        lastReadAt: result.lastReadAt!,
      });

      callback?.({ success: true, lastReadMessageId: result.lastReadMessageId, lastReadAt: result.lastReadAt });
    });

    // Typing Indicators
    socket.on('app:chat:typing:start', (data: { conversationId: string }) => {
      const { conversationId } = data || {};
      if (!conversationId || !appChatService.isMember(conversationId, user.id)) return;

      const started = redisPresenceService.startTyping(
        conversationId,
        user.id,
        user.name,
        (cId, uId, uName) => {
          io.to(getAppChatConversationRoom(cId)).emit('app:chat:typing:update', {
            conversationId: cId,
            userId: uId,
            userName: uName,
            isTyping: false,
          });
        }
      );

      if (started) {
        socket.to(getAppChatConversationRoom(conversationId)).emit('app:chat:typing:update', {
          conversationId,
          userId: user.id,
          userName: user.name,
          isTyping: true,
        });
      }
    });

    socket.on('app:chat:typing:stop', (data: { conversationId: string }) => {
      const { conversationId } = data || {};
      if (!conversationId) return;

      redisPresenceService.stopTyping(conversationId, user.id);
      socket.to(getAppChatConversationRoom(conversationId)).emit('app:chat:typing:update', {
        conversationId,
        userId: user.id,
        userName: user.name,
        isTyping: false,
      });
    });

    // Presence Subscription Query
    socket.on('app:chat:presence:subscribe', (data: { userIds: string[] }, callback?: any) => {
      const presences = redisPresenceService.getPresences(data?.userIds || []);
      callback?.({ success: true, presences });
    });

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      activeWebSocketConnectionsGauge.dec();
      logger.debug(`[Socket.IO] Client disconnected: ${socket.id}`, {
        userId: user?.id,
      });

      if (socket.data.sessionId) {
        const room = getInterviewRoom(socket.data.sessionId);
        sessionStateManager.setPresence(socket.data.sessionId, 'disconnected');
        socket.to(room).emit('student:status', {
          sessionId: socket.data.sessionId,
          presence: 'disconnected',
          timestamp: Date.now(),
        });
      }

      // Meeting participant presence cleanup
      const removedMeeting = meetingPresenceService.removeParticipantBySocket(socket.id);
      if (removedMeeting) {
        const meetRoom = getMeetingRoom(removedMeeting.meetingId);
        socket.to(meetRoom).emit('meeting:participant:left', {
          meetingId: removedMeeting.meetingId,
          userId: removedMeeting.participant.userId,
          socketId: socket.id,
        });
      }

      // Application Chat multi-tab presence cleanup
      if (user?.id) {
        const { statusChanged, presence } = redisPresenceService.unregisterConnection(user.id, socket.id);
        if (statusChanged) {
          io.emit('app:chat:presence:update', {
            userId: user.id,
            status: 'OFFLINE',
            lastSeen: presence.lastSeen,
          });
        }
      }
    });
  });

  ioInstance = io;
  return io;
}
