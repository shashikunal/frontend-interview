import { useEffect, useRef, useState, useCallback } from 'react';
import { getSharedInterviewSocket, type TypedSocket } from '../lib/realtime/socketClient';
import type { SessionStatePayload, PresenceStatus } from '../../server/socket/types';

export interface LiveTelemetryItem {
  sessionId: string;
  isTyping: boolean;
  activeFile: string;
  code: string;
  lineCount: number;
  cursor: { line: number; column: number; at: number } | null;
  focused: boolean;
  presence: PresenceStatus;
  lastSeenAt: number;
  lastExecution: {
    status: 'running' | 'success' | 'failed' | 'error';
    passed?: number;
    total?: number;
    runtimeMs?: number;
    error?: string;
    timestamp: number;
  } | null;
  activityHistory: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: number;
  }>;
}

export function useAdminMonitorSocket(sessionIds: string[], user?: any) {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetryMap, setTelemetryMap] = useState<Record<string, LiveTelemetryItem>>({});
  const socketRef = useRef<TypedSocket | null>(null);
  const typingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Push activity helper
  const pushActivity = useCallback((sessionId: string, type: string, message: string, timestamp: number = Date.now()) => {
    setTelemetryMap(prev => {
      const cur = prev[sessionId];
      const existing = cur?.activityHistory || [];
      const updated = [{ id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, type, message, timestamp }, ...existing].slice(0, 50);
      return {
        ...prev,
        [sessionId]: {
          ...(cur || {
            sessionId,
            isTyping: false,
            activeFile: 'solution.js',
            code: '',
            lineCount: 1,
            cursor: null,
            focused: true,
            presence: 'online',
            lastSeenAt: Date.now(),
            lastExecution: null,
            activityHistory: [],
          }),
          activityHistory: updated,
          lastSeenAt: timestamp,
        },
      };
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const socket = await getSharedInterviewSocket(user);
      if (!isMounted) return;
      socketRef.current = socket;

      function subscribeAll() {
        sessionIds.forEach(sid => {
          if (!sid) return;
          socket.emit('monitor:subscribe', { sessionId: sid }, (ack) => {
            if (ack?.success && ack.state) {
              const s = ack.state;
              setTelemetryMap(prev => ({
                ...prev,
                [s.sessionId]: {
                  sessionId: s.sessionId,
                  isTyping: s.isTyping,
                  activeFile: s.activeFile,
                  code: s.code,
                  lineCount: s.code ? s.code.split('\n').length : 1,
                  cursor: s.cursor ? { ...s.cursor, at: Date.now() } : null,
                  focused: true,
                  presence: s.presence,
                  lastSeenAt: s.lastActivityAt,
                  lastExecution: s.lastExecution || null,
                  activityHistory: s.activityHistory || [],
                },
              }));
            }
          });
        });
      }

      socket.on('connect', () => {
        setIsConnected(true);
        subscribeAll();
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      if (socket.connected) {
        setIsConnected(true);
        subscribeAll();
      }

      // ── Event Handlers ───────────────────────────────────────────────────

      // 1. session:state (Full initial / resynchronized state)
      socket.on('session:state', (state: SessionStatePayload) => {
        setTelemetryMap(prev => ({
          ...prev,
          [state.sessionId]: {
            sessionId: state.sessionId,
            isTyping: state.isTyping,
            activeFile: state.activeFile,
            code: state.code,
            lineCount: state.code ? state.code.split('\n').length : 1,
            cursor: state.cursor ? { ...state.cursor, at: Date.now() } : null,
            focused: true,
            presence: state.presence,
            lastSeenAt: state.lastActivityAt,
            lastExecution: state.lastExecution || null,
            activityHistory: state.activityHistory || [],
          },
        }));
      });

      // 2. student:code-change
      socket.on('student:code-change', (data) => {
        setTelemetryMap(prev => {
          const cur = prev[data.sessionId];
          return {
            ...prev,
            [data.sessionId]: {
              ...(cur || {
                sessionId: data.sessionId,
                activeFile: data.fileId || 'solution.js',
                lineCount: 1,
                focused: true,
                lastExecution: null,
                activityHistory: [],
              }),
              code: data.code,
              lineCount: data.lineCount || data.code.split('\n').length,
              activeFile: data.fileId || cur?.activeFile || 'solution.js',
              cursor: data.cursor ? { ...data.cursor, at: Date.now() } : cur?.cursor || null,
              presence: 'online',
              lastSeenAt: data.timestamp || Date.now(),
              isTyping: true,
            },
          };
        });

        // Clear typing indicator after 1.8s
        const t = typingTimersRef.current.get(data.sessionId);
        if (t) clearTimeout(t);
        typingTimersRef.current.set(
          data.sessionId,
          setTimeout(() => {
            setTelemetryMap(prev => prev[data.sessionId] ? { ...prev, [data.sessionId]: { ...prev[data.sessionId], isTyping: false } } : prev);
          }, 1800)
        );
      });

      // 3. student:typing
      socket.on('student:typing', (data) => {
        setTelemetryMap(prev => prev[data.sessionId] ? {
          ...prev,
          [data.sessionId]: {
            ...prev[data.sessionId],
            isTyping: data.isTyping,
            presence: 'online',
            lastSeenAt: data.timestamp,
          },
        } : prev);
      });

      // 4. student:cursor-change
      socket.on('student:cursor-change', (data) => {
        setTelemetryMap(prev => prev[data.sessionId] ? {
          ...prev,
          [data.sessionId]: {
            ...prev[data.sessionId],
            cursor: { line: data.line, column: data.column, at: Date.now() },
            activeFile: data.fileId || prev[data.sessionId].activeFile,
            presence: 'online',
            lastSeenAt: data.timestamp,
          },
        } : prev);
      });

      // 5. student:file-change
      socket.on('student:file-change', (data) => {
        setTelemetryMap(prev => prev[data.sessionId] ? {
          ...prev,
          [data.sessionId]: {
            ...prev[data.sessionId],
            activeFile: data.fileId,
            presence: 'online',
            lastSeenAt: data.timestamp,
          },
        } : prev);
        pushActivity(data.sessionId, 'FILE_OPENED', `Switched to ${data.fileId}`, data.timestamp);
      });

      // 6. student:question-change
      socket.on('student:question-change', (data) => {
        pushActivity(data.sessionId, 'QUESTION_CHANGED', `Opened ${data.questionTitle || data.questionId}`, data.timestamp);
      });

      // 7. student:run-start
      socket.on('student:run-start', (data) => {
        setTelemetryMap(prev => prev[data.sessionId] ? {
          ...prev,
          [data.sessionId]: {
            ...prev[data.sessionId],
            lastExecution: { status: 'running', timestamp: data.timestamp },
            presence: 'online',
            lastSeenAt: data.timestamp,
          },
        } : prev);
        pushActivity(data.sessionId, 'RUN_START', 'Code execution started', data.timestamp);
      });

      // 8. student:run-result
      socket.on('student:run-result', (data) => {
        setTelemetryMap(prev => prev[data.sessionId] ? {
          ...prev,
          [data.sessionId]: {
            ...prev[data.sessionId],
            lastExecution: {
              status: data.status,
              passed: data.passed,
              total: data.total,
              runtimeMs: data.runtimeMs,
              error: data.error,
              timestamp: data.timestamp,
            },
            presence: 'online',
            lastSeenAt: data.timestamp,
          },
        } : prev);
        const msg = data.status === 'success'
          ? `Passed all ${data.total} tests (${data.runtimeMs || 0}ms)`
          : `Failed: ${data.passed}/${data.total} tests passed`;
        pushActivity(data.sessionId, 'RUN_RESULT', msg, data.timestamp);
      });

      // 9. student:status
      socket.on('student:status', (data) => {
        setTelemetryMap(prev => prev[data.sessionId] ? {
          ...prev,
          [data.sessionId]: {
            ...prev[data.sessionId],
            presence: data.presence,
            lastSeenAt: data.timestamp,
          },
        } : prev);
      });

      // 10. student:activity
      socket.on('student:activity', (data) => {
        pushActivity(data.sessionId, data.type, data.message, data.timestamp);
      });
    }

    void init();

    return () => {
      isMounted = false;
      typingTimersRef.current.forEach(t => clearTimeout(t));
      const s = socketRef.current;
      if (s) {
        sessionIds.forEach(sid => {
          try { s.emit('monitor:unsubscribe', { sessionId: sid }); } catch (_) {}
        });
      }
    };
  }, [sessionIds.join(','), pushActivity, user]);

  return {
    isConnected,
    telemetryMap,
  };
}
