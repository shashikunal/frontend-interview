import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Http2SecureServer } from 'http2';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types.js';
import { authenticateSocket } from './auth.js';
import { getInterviewRoom, canJoinSession, canMonitorSession } from './rooms.js';
import { sessionStateManager } from './sessionState.js';

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
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // 1. Authenticate every connection
  io.use(authenticateSocket);

  // 2. Connection lifecycle
  io.on('connection', (socket) => {
    const user = socket.data.user;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Socket.IO] Client connected: ${socket.id} (${user?.name} / ${user?.role})`);
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

      const room = getInterviewRoom(sessionId);
      await socket.join(room);
      socket.data.sessionId = sessionId;

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

      callback?.({ success: true, state });
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

      // Hydrate / retrieve latest session state
      const state = await sessionStateManager.getState(sessionId);

      socket.emit('monitor:ack', { sessionId, connectedAt: Date.now() });
      if (state) {
        socket.emit('session:state', state);
      }
      callback?.({ success: true, state: state || undefined });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Socket.IO Monitor] Admin ${user.name} subscribed to room ${room}`);
      }
    });

    // ── Admin: monitor:unsubscribe ────────────────────────────────────────
    socket.on('monitor:unsubscribe', ({ sessionId }: { sessionId: string }) => {
      const room = getInterviewRoom(sessionId);
      socket.leave(room);
      socket.data.subscribedSessions.delete(sessionId);
    });

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Socket.IO] Client disconnected: ${socket.id} (${user?.name})`);
      }

      if (socket.data.sessionId) {
        const room = getInterviewRoom(socket.data.sessionId);
        sessionStateManager.setPresence(socket.data.sessionId, 'disconnected');
        socket.to(room).emit('student:status', {
          sessionId: socket.data.sessionId,
          presence: 'disconnected',
          timestamp: Date.now(),
        });
      }
    });
  });

  ioInstance = io;
  return io;
}
