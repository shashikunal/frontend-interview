import { useEffect, useRef, useCallback, useState } from 'react';
import { getSharedInterviewSocket, type TypedSocket } from '../lib/realtime/socketClient';
import type { PresenceStatus } from '../../server/socket/types';

export interface UseInterviewSocketOptions {
  sessionId?: string | null;
  questionId: string;
  questionTitle: string;
  track: 'core-programming' | 'dsa' | 'frontend-js' | 'machine-coding';
  language?: string;
  activeFile?: string;
  code?: string;
  user?: { id?: string; name?: string; email?: string } | null;
}

export interface CodeRunPayload {
  status: 'running' | 'success' | 'failed' | 'error';
  passed?: number;
  total?: number;
  runtimeMs?: number;
  error?: string;
  output?: string;
}

const CODE_DEBOUNCE_MS = 200;
const CURSOR_THROTTLE_MS = 150;
const HEARTBEAT_INTERVAL_MS = 25 * 1000;

export function useInterviewSocket({
  sessionId,
  questionId,
  questionTitle,
  track,
  language = 'javascript',
  activeFile = 'solution.js',
  code = '',
  user,
}: UseInterviewSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus>('disconnected');

  const socketRef = useRef<TypedSocket | null>(null);
  const codeVersionRef = useRef<number>(1);
  const codeDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCursorEmitRef = useRef<number>(0);
  const isTypingRef = useRef<boolean>(false);

  const latestCodeRef = useRef(code);
  latestCodeRef.current = code;
  const latestFileRef = useRef(activeFile);
  latestFileRef.current = activeFile;

  // Initialize socket and join room
  useEffect(() => {
    if (!sessionId) {
      setIsConnected(false);
      setPresenceStatus('disconnected');
      return;
    }

    let isMounted = true;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    async function init() {
      const socket = await getSharedInterviewSocket(user);
      if (!isMounted) return;
      socketRef.current = socket;

      function join() {
        if (!sessionId) return;
        socket.emit('session:join', {
          sessionId,
          questionId,
          questionTitle,
          language,
          initialCode: latestCodeRef.current,
        }, (ack) => {
          if (ack?.success) {
            setIsConnected(true);
            setPresenceStatus('online');
          }
        });
      }

      socket.on('connect', () => {
        setIsConnected(true);
        setPresenceStatus('online');
        join();
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        setPresenceStatus('reconnecting');
      });

      if (socket.connected) {
        setIsConnected(true);
        setPresenceStatus('online');
        join();
      }

      // Heartbeat interval
      heartbeatInterval = setInterval(() => {
        if (socket.connected && sessionId) {
          socket.emit('session:heartbeat', { sessionId, status: 'online' });
        }
      }, HEARTBEAT_INTERVAL_MS);
    }

    void init();

    return () => {
      isMounted = false;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      const s = socketRef.current;
      if (s && sessionId) {
        try {
          s.emit('session:leave', { sessionId });
        } catch (_) {}
      }
      setIsConnected(false);
      setPresenceStatus('disconnected');
    };
  }, [sessionId, questionId, questionTitle, language, user]);

  // ── Emit Code Change (with typing indicator) ──────────────────────────────
  const emitCodeChange = useCallback(
    (newCode: string, fileOverride?: string, cursor?: { line: number; column: number }) => {
      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      const curFile = fileOverride || latestFileRef.current;

      // 1. Send typing started event
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        socket.emit('student:typing', {
          sessionId,
          isTyping: true,
          fileId: curFile,
          timestamp: Date.now(),
        });
      }

      // Auto clear typing state after 1.5s silence
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        socket.emit('student:typing', {
          sessionId,
          isTyping: false,
          fileId: curFile,
          timestamp: Date.now(),
        });
      }, 1500);

      // 2. Debounce code broadcast
      if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);
      codeDebounceTimerRef.current = setTimeout(() => {
        const v = ++codeVersionRef.current;
        const lineCount = newCode.split('\n').length;

        socket.emit('student:code-change', {
          sessionId,
          fileId: curFile,
          language,
          code: newCode,
          lineCount,
          cursor,
          version: v,
          timestamp: Date.now(),
        });
      }, CODE_DEBOUNCE_MS);
    },
    [sessionId, language]
  );

  // ── Emit Cursor Movement ──────────────────────────────────────────────────
  const emitCursorMove = useCallback(
    (line: number, column: number) => {
      const now = Date.now();
      if (now - lastCursorEmitRef.current < CURSOR_THROTTLE_MS) return;
      lastCursorEmitRef.current = now;

      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      socket.emit('student:cursor-change', {
        sessionId,
        fileId: latestFileRef.current,
        line,
        column,
        timestamp: now,
      });
    },
    [sessionId]
  );

  // ── Emit Focus / Blur ─────────────────────────────────────────────────────
  const emitFocus = useCallback(
    (focused: boolean) => {
      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      socket.emit('student:activity', {
        sessionId,
        type: focused ? 'EDITOR_FOCUSED' : 'EDITOR_BLURRED',
        message: focused ? 'Focused code editor' : 'Navigated away from editor',
        timestamp: Date.now(),
      });
    },
    [sessionId]
  );

  // ── Emit Code Run / Test Event ────────────────────────────────────────────
  const emitCodeRun = useCallback(
    (exec: CodeRunPayload) => {
      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      if (exec.status === 'running') {
        socket.emit('student:run-start', {
          sessionId,
          questionId,
          language,
          timestamp: Date.now(),
        });
      } else {
        socket.emit('student:run-result', {
          sessionId,
          questionId,
          status: exec.status,
          passed: exec.passed ?? 0,
          total: exec.total ?? 0,
          runtimeMs: exec.runtimeMs,
          output: exec.output,
          error: exec.error,
          timestamp: Date.now(),
        });
      }
    },
    [sessionId, questionId, language]
  );

  // ── Emit File Switch ──────────────────────────────────────────────────────
  const emitFileSwitch = useCallback(
    (fileName: string) => {
      latestFileRef.current = fileName;
      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      socket.emit('student:file-change', {
        sessionId,
        fileId: fileName,
        timestamp: Date.now(),
      });
    },
    [sessionId]
  );

  // ── Emit Question Switch ──────────────────────────────────────────────────
  const emitQuestionChange = useCallback(
    (newQuestionId: string, newTitle: string) => {
      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      socket.emit('student:question-change', {
        sessionId,
        questionId: newQuestionId,
        questionTitle: newTitle,
        track,
        timestamp: Date.now(),
      });
    },
    [sessionId, track]
  );

  // ── Emit General Activity ─────────────────────────────────────────────────
  const emitActivity = useCallback(
    (message: string, type: string = 'ACTIVITY') => {
      const socket = socketRef.current;
      if (!socket || !sessionId) return;

      socket.emit('student:activity', {
        sessionId,
        type,
        message,
        timestamp: Date.now(),
      });
    },
    [sessionId]
  );

  return {
    isConnected,
    presenceStatus,
    emitCodeChange,
    emitCursorMove,
    emitFocus,
    emitCodeRun,
    emitFileSwitch,
    emitQuestionChange,
    emitActivity,
  };
}
