import { useEffect, useRef, useCallback, useState } from 'react';
import { getSharedInterviewSocket, type TypedSocket } from '../lib/realtime/socketClient';
import { getOrCreateSessionYDoc, bridgeYDocWithSocket, bindMonacoToYDoc, waitForInitialSync } from '../lib/realtime/yjsSync';
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
  const boundSessionRef = useRef<string | null>(null);
  // Bumps whenever a bind is staged or an active binding is torn down, so the
  // sync-gated auto-bind below re-evaluates even when ydoc/sessionId are
  // unchanged (e.g. navigating back to a question whose session still exists:
  // the socket-effect cleanup destroys the old binding and a new bind is due).
  const [bindRequestId, setBindRequestId] = useState(0);
  const pendingEditorRef = useRef<any>(null);
  const pendingFileRef = useRef<string | null>(null);
  const latestFileRef = useRef<string>(activeFile);
  const latestCodeRef = useRef<string>(code);
  const sessionIdRef = useRef<string | null>(sessionId);
  // Flag to prevent re-emitting socket events when Monaco onChange fires due to Yjs sync
  const isYjsSyncingRef = useRef<boolean>(false);

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

  // Stable scalar for effect deps: the parent passes a fresh `user` object identity
  // on every render, which would re-run the socket effect and stack duplicate
  // connect/disconnect listeners on the SHARED socket. Depend on the id only.
  const userId = user?.id || null;

  // Initialize socket and join room
  useEffect(() => {
    let isMounted = true;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    let unbridgeYDoc: (() => void) | null = null;
    let handleConnect: (() => void) | null = null;
    let handleDisconnect: (() => void) | null = null;
    let boundSocket: TypedSocket | null = null;

    if (!sessionId || !ydoc) {
      setIsConnected(false);
      setPresenceStatus('disconnected');
      return;
    }

    async function init() {
      const socket = await getSharedInterviewSocket(userId ? { id: userId } : undefined);
      if (!isMounted) return;
      socketRef.current = socket;
      boundSocket = socket;

      // Bridge Yjs document updates with Socket.IO room
      // Pass onRemoteApply callback to set isYjsSyncingRef during remote updates,
      // preventing emitCodeChange from re-emitting when Monaco onChange fires due to Yjs sync.
      unbridgeYDoc = bridgeYDocWithSocket(
        sessionId!,
        ydoc!,
        socket,
        () => latestFileRef.current,
        (applying) => { isYjsSyncingRef.current = applying; }
      );

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

      // Named handlers so cleanup can socket.off() them. The socket is SHARED
      // across mounts; anonymous listeners without off() accumulate on every
      // question switch / refresh and each fires join()/setState again.
      handleConnect = () => {
        if (!isMounted) return;
        setIsConnected(true);
        setPresenceStatus('online');
        join();
      };
      handleDisconnect = () => {
        if (!isMounted) return;
        setIsConnected(false);
        setPresenceStatus('reconnecting');
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

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
      if (boundSocket) {
        if (handleConnect) boundSocket.off('connect', handleConnect);
        if (handleDisconnect) boundSocket.off('disconnect', handleDisconnect);
      }
      // Destroy this mount's Monaco binding so a remount (question switch,
      // StrictMode) cannot leave two bindings/UndoManagers on one model.
      // The Y.Doc itself is intentionally kept (admin may view the same session).
      if (monacoBindingRef.current) {
        try {
          monacoBindingRef.current.destroy();
        } catch (_) {}
        monacoBindingRef.current = null;
        // A teardown with a staged editor due a re-bind (e.g. back-navigation
        // reuses the session): wake the sync-gated auto-bind below.
        setBindRequestId(id => id + 1);
      }
      boundSessionRef.current = null;
      pendingEditorRef.current = null;
      pendingFileRef.current = null;

      const s = socketRef.current;
      if (s && sessionId) {
        try {
          s.emit('session:leave', { sessionId });
        } catch (_) {}
      }
      setIsConnected(false);
      setPresenceStatus('disconnected');
    };
  }, [sessionId, questionId, questionTitle, language, userId, ydoc]);

  // ── Emit Code Change (with immediate typing indicator & fast 25ms broadcast) ──
  const emitCodeChange = useCallback(
    (newCode: string, fileOverride?: string, cursor?: { line: number; column: number }) => {
      // Skip if this change is from Yjs remote sync (not user typing)
      if (isYjsSyncingRef.current) return;

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

      // NOTE: We do NOT manually write to ydoc here.
      // MonacoBinding automatically keeps ytext in sync with the Monaco model.
      // Writing to ydoc here would trigger ytext→model update→onChange→emitCodeChange infinite loop.

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

  // ── Bind Monaco Editor to Yjs Document ────────────────────────────────────
  // deferToSync (opt-in): stage the editor for the sync-gated auto-bind below
  // and NEVER bind immediately. Binding a fresh editor to a STALE session doc
  // with stale code (question navigation remounts before the new session
  // resolves) clobbers the correct model via model.setValue(stale). Callers
  // that pass true get exactly one bind, to the current synced session.
  // Default false preserves existing behavior for all other callers.
  const bindMonacoEditor = useCallback(
    (editorInstance: any, fileOverride?: string, deferToSync?: boolean) => {
      if (editorInstance) pendingEditorRef.current = editorInstance;
      if (fileOverride) pendingFileRef.current = fileOverride;

      if (!ydoc || !editorInstance) {
        console.log(`[YJS-STUDENT] Storing editor reference; awaiting ydoc for session: ${sessionId}`);
        return;
      }

      if (deferToSync) {
        if (import.meta.env?.DEV) {
          console.debug(`[YJS-STUDENT] Bind deferred to post-sync auto-bind for session: ${sessionId}`);
        }
        setBindRequestId(id => id + 1);
        return null;
      }

      const targetFile = fileOverride || pendingFileRef.current || latestFileRef.current;

      // Clean up previous binding if it belongs to a different session
      if (monacoBindingRef.current && boundSessionRef.current !== sessionId) {
        try {
          monacoBindingRef.current.destroy();
        } catch (_) {}
        monacoBindingRef.current = null;
      }
      if (monacoBindingRef.current) return monacoBindingRef.current;

      const binding = bindMonacoToYDoc(
        ydoc,
        targetFile,
        editorInstance,
        latestCodeRef.current
      );
      monacoBindingRef.current = binding;
      boundSessionRef.current = sessionId ?? null;

      // NOTE: We do NOT attach onDidChangeModelContent here.
      // MonacoBinding already syncs editor→ytext automatically.
      // Attaching it here AND in the auto-bind useEffect caused double-firing.
      // Socket keystroke emission is handled via handleCodeChange in the Editor's onChange prop.

      console.log(`[YJS-STUDENT] Monaco editor successfully bound to session ${sessionId} (${targetFile})`);
      return binding;
    },
    [ydoc, sessionId]
  );

  // Auto-bind as soon as ydoc becomes available if editor was already mounted.
  // Skips when bindMonacoEditor() already bound this mount: creating a second
  // MonacoBinding on the same model/Y.Text yields two competing UndoManagers,
  // so one Ctrl+Z performs two undos.
  // Binds only AFTER the server's initial sync is applied (or a short timeout
  // offline): binding an empty doc and seeding locally, then applying a late
  // full-state sync through the live binding, duplicated the starter on refresh.
  useEffect(() => {
    if (!ydoc || !pendingEditorRef.current) return;
    if (monacoBindingRef.current && boundSessionRef.current === sessionId) return;
    let cancelled = false;
    const targetSessionId = sessionId;

    void waitForInitialSync(targetSessionId ?? '', 1500).then(() => {
      if (cancelled) return;
      if (!pendingEditorRef.current) return;
      // Session may have changed while waiting: only bind the current one.
      if (targetSessionId !== sessionIdRef.current && sessionIdRef.current !== null) return;
      if (monacoBindingRef.current && boundSessionRef.current === targetSessionId) return;

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
      boundSessionRef.current = targetSessionId ?? null;

      // NOTE: Do NOT attach onDidChangeModelContent here.
      // MonacoBinding handles editor→ytext sync. Socket emission is via handleCodeChange.
      // Adding a listener here would cause double-firing with the one in bindMonacoEditor.

      console.log(`[YJS-STUDENT] Auto-bound Monaco editor on Y.Doc availability for session ${targetSessionId} (${targetFile})`);
    });

    return () => { cancelled = true; };
  }, [ydoc, sessionId, bindRequestId]);

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
