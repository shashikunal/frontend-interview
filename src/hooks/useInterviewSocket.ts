import { useEffect, useRef, useCallback, useState } from 'react';
import { getSharedInterviewSocket, type TypedSocket } from '../lib/realtime/socketClient';
import { getOrCreateSessionYDoc, bridgeYDocWithSocket, bindMonacoToYDoc } from '../lib/realtime/yjsSync';
import type { MonacoBinding } from 'y-monaco';
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

const CODE_DEBOUNCE_MS = 25;
const CURSOR_THROTTLE_MS = 16;
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
  const monacoBindingRef = useRef<MonacoBinding | null>(null);
  const pendingEditorRef = useRef<any>(null);
  const pendingFileRef = useRef<string | null>(null);
  const latestFileRef = useRef<string>(activeFile);
  const latestCodeRef = useRef<string>(code);
  const sessionIdRef = useRef<string | null>(sessionId);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    latestFileRef.current = activeFile;
  }, [activeFile]);

  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  // Derived Y.Doc instance for this session room
  const ydoc = sessionId ? getOrCreateSessionYDoc(sessionId) : null;

  // Initialize socket and join room
  useEffect(() => {
    let isMounted = true;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    let unbridgeYDoc: (() => void) | null = null;

    if (!sessionId || !ydoc) {
      setIsConnected(false);
      setPresenceStatus('disconnected');
      return;
    }

    async function init() {
      const socket = await getSharedInterviewSocket(user);
      if (!isMounted) return;
      socketRef.current = socket;

      // Bridge Yjs document updates with Socket.IO room
      unbridgeYDoc = bridgeYDocWithSocket(sessionId!, ydoc!, socket, () => latestFileRef.current);

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
            if (ack.docState && ydoc) {
              try {
                Y.applyUpdate(ydoc, toUint8Array(ack.docState), 'remote');
              } catch (err) {
                console.warn('[useInterviewSocket] Failed applying initial docState from server:', err);
              }
            }
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
      if (unbridgeYDoc) unbridgeYDoc();

      const s = socketRef.current;
      if (s && sessionId) {
        try {
          s.emit('session:leave', { sessionId });
        } catch (_) {}
      }
      setIsConnected(false);
      setPresenceStatus('disconnected');
    };
  }, [sessionId, questionId, questionTitle, language, user, ydoc]);

  // ── Emit Code Change (with immediate typing indicator & fast 25ms broadcast) ──
  const emitCodeChange = useCallback(
    (newCode: string, fileOverride?: string, cursor?: { line: number; column: number }) => {
      const socket = socketRef.current;
      const currentSessionId = sessionIdRef.current || sessionId;
      if (!socket || !currentSessionId) return;

      const curFile = fileOverride || latestFileRef.current;

      // 1. Send typing started event immediately
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        socket.emit('student:typing', {
          sessionId: currentSessionId,
          isTyping: true,
          fileId: curFile,
          timestamp: Date.now(),
        });
      }

      // 2. Immediately emit cursor change if cursor was provided with keystroke
      if (cursor) {
        socket.emit('student:cursor-change', {
          sessionId: currentSessionId,
          fileId: curFile,
          line: cursor.line,
          column: cursor.column,
          timestamp: Date.now(),
        });
      }

      // 3. ZERO-LATENCY FASTPATH: Emit student:keystroke immediately without debounce
      socket.emit('student:keystroke', {
        sessionId: currentSessionId,
        fileId: curFile,
        code: newCode,
        cursor: cursor || null,
        timestamp: Date.now(),
      });

      // 4. Update local Y.Doc text if needed to trigger CRDT updates
      if (ydoc) {
        const ytext = ydoc.getText(curFile);
        if (ytext.toString() !== newCode) {
          ydoc.transact(() => {
            ytext.delete(0, ytext.length);
            ytext.insert(0, newCode);
          }, 'student-keystroke');
        }
      }

      // Auto clear typing state after 1.5s silence
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        socket.emit('student:typing', {
          sessionId: currentSessionId,
          isTyping: false,
          fileId: curFile,
          timestamp: Date.now(),
        });
      }, 1500);

      // 5. Fast 25ms debounce for full code snapshot broadcast
      if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);
      codeDebounceTimerRef.current = setTimeout(() => {
        const v = ++codeVersionRef.current;
        const lineCount = newCode.split('\n').length;

        socket.emit('student:code-change', {
          sessionId: currentSessionId,
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
    [sessionId, language, ydoc]
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

  // ── Bind Monaco Editor to Yjs Document ────────────────────────────────────
  const bindMonacoEditor = useCallback(
    (editorInstance: any, fileOverride?: string) => {
      if (editorInstance) pendingEditorRef.current = editorInstance;
      if (fileOverride) pendingFileRef.current = fileOverride;

      if (!ydoc || !editorInstance) {
        console.log(`[YJS-STUDENT] Storing editor reference; awaiting ydoc for session: ${sessionId}`);
        return;
      }

      const targetFile = fileOverride || pendingFileRef.current || latestFileRef.current;

      // Clean up previous binding if existing
      if (monacoBindingRef.current) {
        try {
          monacoBindingRef.current.destroy();
        } catch (_) {}
        monacoBindingRef.current = null;
      }

      const binding = bindMonacoToYDoc(
        ydoc,
        targetFile,
        editorInstance,
        latestCodeRef.current
      );
      monacoBindingRef.current = binding;

      // Attach instantaneous 0ms character-by-character keystroke emitter
      if (editorInstance?.onDidChangeModelContent) {
        editorInstance.onDidChangeModelContent(() => {
          const s = socketRef.current;
          const sid = sessionIdRef.current || sessionId;
          if (s && s.connected && sid) {
            const m = editorInstance.getModel();
            const pos = editorInstance.getPosition();
            if (m) {
              s.emit('student:keystroke', {
                sessionId: sid,
                fileId: targetFile,
                code: m.getValue(),
                cursor: pos ? { line: pos.lineNumber, column: pos.column } : null,
                timestamp: Date.now(),
              });
            }
          }
        });
      }

      console.log(`[YJS-STUDENT] Monaco editor successfully bound to session ${sessionId} (${targetFile})`);
      return binding;
    },
    [ydoc, sessionId]
  );

  // Auto-bind as soon as ydoc becomes available if editor was already mounted
  useEffect(() => {
    if (!ydoc || !pendingEditorRef.current) return;
    const targetFile = pendingFileRef.current || latestFileRef.current || 'solution.js';
    const editorInstance = pendingEditorRef.current;

    if (monacoBindingRef.current) {
      try {
        monacoBindingRef.current.destroy();
      } catch (_) {}
      monacoBindingRef.current = null;
    }

    const binding = bindMonacoToYDoc(
      ydoc,
      targetFile,
      editorInstance,
      latestCodeRef.current
    );
    monacoBindingRef.current = binding;

    // Attach instantaneous 0ms character-by-character keystroke emitter
    if (editorInstance?.onDidChangeModelContent) {
      editorInstance.onDidChangeModelContent(() => {
        const s = socketRef.current;
        const sid = sessionIdRef.current || sessionId;
        if (s && s.connected && sid) {
          const m = editorInstance.getModel();
          const pos = editorInstance.getPosition();
          if (m) {
            s.emit('student:keystroke', {
              sessionId: sid,
              fileId: targetFile,
              code: m.getValue(),
              cursor: pos ? { line: pos.lineNumber, column: pos.column } : null,
              timestamp: Date.now(),
            });
          }
        }
      });
    }

    console.log(`[YJS-STUDENT] Auto-bound Monaco editor on Y.Doc availability for session ${sessionId} (${targetFile})`);
  }, [ydoc, sessionId]);

  return {
    isConnected,
    presenceStatus,
    ydoc,
    bindMonacoEditor,
    emitCodeChange,
    emitCursorMove,
    emitFocus,
    emitCodeRun,
    emitFileSwitch,
    emitQuestionChange,
    emitActivity,
  };
}
