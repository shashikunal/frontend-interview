import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { getAdminInterviewSocket, type TypedSocket } from '../lib/realtime/socketClient';
import { toUint8Array, getOrCreateSessionYDoc } from '../lib/realtime/yjsSync';
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
    output?: string;
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
      const adminDevUser = {
        id: user?.id ? `admin_${user.id}` : 'admin_local_dev',
        email: user?.email || 'admin@interview.local',
        role: 'admin',
        name: user?.name || 'Administrator',
      };
      const socket = await getAdminInterviewSocket(adminDevUser);
      if (!isMounted) return;
      socketRef.current = socket;

      function subscribeAll() {
        sessionIds.forEach(sid => {
          if (!sid) return;
          socket.emit('monitor:subscribe', { sessionId: sid }, (ack) => {
            if (ack?.success) {
              if (ack.state) {
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
              if (ack.docState) {
                const ydoc = getOrCreateSessionYDoc(sid);
                try {
                  Y.applyUpdate(ydoc, toUint8Array(ack.docState), 'remote');
                  console.log(`[YJS-ADMIN] Hydrated Y.Doc from monitor:subscribe docState for ${sid} (${ack.docState.length} bytes)`);
                } catch (err) {
                  console.warn(`[YJS-ADMIN] Failed applying ack.docState for ${sid}:`, err);
                }
              }
            }
          });
          // Request full Y.Doc sync
          socket.emit('yjs:sync-request', { sessionId: sid });
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
        if (data.sessionId && data.code !== undefined) {
          const ydoc = getOrCreateSessionYDoc(data.sessionId);
          const ytext = ydoc.getText(data.fileId || 'solution.js');
          if (ytext.toString() !== data.code) {
            ydoc.transact(() => {
              ytext.delete(0, ytext.length);
              ytext.insert(0, data.code);
            }, 'code-change-sync');
          }
        }

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

      // 2b. student:keystroke (Zero-Latency Character-by-Character Fastpath)
      socket.on('student:keystroke', (data: any) => {
        if (data.sessionId && data.code !== undefined) {
          const ydoc = getOrCreateSessionYDoc(data.sessionId);
          const ytext = ydoc.getText(data.fileId || 'solution.js');
          if (ytext.toString() !== data.code) {
            ydoc.transact(() => {
              ytext.delete(0, ytext.length);
              ytext.insert(0, data.code);
            }, 'keystroke-sync');
          }
        }

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
              lineCount: data.code ? data.code.split('\n').length : 1,
              activeFile: data.fileId || cur?.activeFile || 'solution.js',
              cursor: data.cursor ? { ...data.cursor, at: Date.now() } : cur?.cursor || null,
              presence: 'online',
              lastSeenAt: data.timestamp || Date.now(),
              isTyping: true,
            },
          };
        });

        const t = typingTimersRef.current.get(data.sessionId);
        if (t) clearTimeout(t);
        typingTimersRef.current.set(
          data.sessionId,
          setTimeout(() => {
            setTelemetryMap(prev => prev[data.sessionId] ? { ...prev, [data.sessionId]: { ...prev[data.sessionId], isTyping: false } } : prev);
          }, 1500)
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

      // 11. yjs:update (Live binary CRDT keystrokes into local Y.Doc)
      socket.on('yjs:update', (data: any) => {
        if (!data?.sessionId || !data?.update) return;
        console.log(`[YJS-ADMIN] Yjs update received for session ${data.sessionId}`);
        const ydoc = getOrCreateSessionYDoc(data.sessionId);
        try {
          Y.applyUpdate(ydoc, toUint8Array(data.update), 'remote');
          console.log(`[YJS-ADMIN] Y.applyUpdate completed for session ${data.sessionId}`);
        } catch (err) {
          console.warn(`[Admin Monitor Yjs] Failed to apply update for ${data.sessionId}:`, err);
        }

        const file = data.fileId || 'solution.js';
        const liveCode = ydoc.getText(file).toString();

        setTelemetryMap(prev => {
          const cur = prev[data.sessionId];
          if (!cur) return prev;
          return {
            ...prev,
            [data.sessionId]: {
              ...cur,
              code: liveCode,
              activeFile: file,
              lineCount: liveCode ? liveCode.split('\n').length : 1,
              isTyping: true,
              presence: 'online',
              lastSeenAt: data.timestamp || Date.now(),
            },
          };
        });

        // Auto clear typing state after 1.8s
        const t = typingTimersRef.current.get(data.sessionId);
        if (t) clearTimeout(t);
        typingTimersRef.current.set(
          data.sessionId,
          setTimeout(() => {
            setTelemetryMap(prev => prev[data.sessionId] ? { ...prev, [data.sessionId]: { ...prev[data.sessionId], isTyping: false } } : prev);
          }, 1800)
        );
      });

      // 12. yjs:sync-response (Full Y.Doc recovery on reconnect / first subscribe)
      socket.on('yjs:sync-response', (data: any) => {
        if (!data?.sessionId || !data?.docState) return;
        const ydoc = getOrCreateSessionYDoc(data.sessionId);
        try {
          Y.applyUpdate(ydoc, toUint8Array(data.docState), 'remote');
        } catch (err) {
          console.warn(`[Admin Monitor Yjs] Failed to apply sync for ${data.sessionId}:`, err);
        }

        setTelemetryMap(prev => {
          const cur = prev[data.sessionId];
          if (!cur) return prev;
          const liveCode = ydoc.getText(cur.activeFile || 'solution.js').toString();
          return {
            ...prev,
            [data.sessionId]: {
              ...cur,
              code: liveCode || cur.code,
              lineCount: (liveCode || cur.code).split('\n').length,
            },
          };
        });
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

  const getYDoc = useCallback((sessionId: string) => {
    return getOrCreateSessionYDoc(sessionId);
  }, []);

  return {
    isConnected,
    telemetryMap,
    getYDoc,
  };
}
