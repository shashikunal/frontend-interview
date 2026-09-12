import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { interviewSessionService } from '../lib/interviewSessionService';

export interface UseRealtimeStudentBroadcastOptions {
  sessionId?: string | null;
  questionId: string;
  questionTitle: string;
  track: 'core-programming' | 'dsa' | 'frontend-js' | 'machine-coding';
  language?: string;
  activeFile?: string;
  code?: string;
  user?: { id?: string; name?: string; email?: string } | null;
}

export interface CodeRunBroadcastPayload {
  status: 'running' | 'success' | 'failed' | 'error';
  passed?: number;
  total?: number;
  runtimeMs?: number;
  error?: string;
}

const IDLE_TIMEOUT_MS = 45 * 1000; // 45 seconds of silence -> idle
const CODE_DEBOUNCE_MS = 250; // 250ms code throttle
const CURSOR_THROTTLE_MS = 150; // 150ms cursor throttle
const SNAPSHOT_INTERVAL_MS = 30 * 1000; // 30s DB checkpoint

export function useRealtimeStudentBroadcast({
  sessionId,
  questionId,
  questionTitle,
  track,
  language = 'javascript',
  activeFile = 'solution.js',
  code = '',
  user,
}: UseRealtimeStudentBroadcastOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState<'online' | 'idle' | 'disconnected'>('disconnected');

  const channelRef = useRef<any>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCursorEmitRef = useRef<number>(0);
  const lastSavedCodeRef = useRef<string>(code);
  const isTypingRef = useRef<boolean>(false);

  // Keep state refs up to date
  const latestCodeRef = useRef(code);
  latestCodeRef.current = code;
  const latestFileRef = useRef(activeFile);
  latestFileRef.current = activeFile;

  // Track presence helper
  const updatePresence = useCallback(
    async (status: 'online' | 'idle') => {
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      try {
        await ch.track({
          userId: user?.id || 'anon_candidate',
          name: user?.name || 'Candidate',
          email: user?.email || '',
          role: 'candidate',
          track,
          language,
          questionId,
          questionTitle,
          activeFile: latestFileRef.current,
          status,
          lastActiveAt: new Date().toISOString(),
        });
        setPresenceStatus(status);
      } catch (_) {}
    },
    [sessionId, user?.id, user?.name, user?.email, track, language, questionId, questionTitle]
  );

  // Mark activity (resets idle timer)
  const markActive = useCallback(() => {
    if (presenceStatus !== 'online') {
      void updatePresence('online');
    }

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      void updatePresence('idle');
    }, IDLE_TIMEOUT_MS);
  }, [presenceStatus, updatePresence]);

  // Connect to Supabase Realtime channel
  useEffect(() => {
    if (!sessionId) {
      setIsConnected(false);
      setPresenceStatus('disconnected');
      return;
    }

    const channelName = `interview:${sessionId}`;
    const ch = supabase.channel(channelName, {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: user?.id || `cand_${Date.now().toString(36)}` },
      },
    });

    channelRef.current = ch;

    ch.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        await updatePresence('online');

        // Broadcast initial question open event
        ch.send({
          type: 'broadcast',
          event: 'QUESTION_OPENED',
          payload: {
            sessionId,
            questionId,
            questionTitle,
            track,
            language,
            activeFile: latestFileRef.current,
            code: latestCodeRef.current,
            timestamp: Date.now(),
          },
        });

        // Broadcast initial code snapshot so Admin sees it immediately
        if (latestCodeRef.current) {
          ch.send({
            type: 'broadcast',
            event: 'CODE_CHANGED',
            payload: {
              sessionId,
              questionId,
              activeFile: latestFileRef.current,
              code: latestCodeRef.current,
              lineCount: latestCodeRef.current.split('\n').length,
              timestamp: Date.now(),
            },
          });
        }
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        setPresenceStatus('disconnected');
      }
    });

    // Start initial idle timer
    idleTimerRef.current = setTimeout(() => {
      void updatePresence('idle');
    }, IDLE_TIMEOUT_MS);

    // Periodic 30s snapshot checkpoint to Postgres
    const snapshotInterval = setInterval(() => {
      if (sessionId && latestCodeRef.current !== lastSavedCodeRef.current) {
        lastSavedCodeRef.current = latestCodeRef.current;
        void interviewSessionService.saveSnapshot(
          sessionId,
          { [latestFileRef.current]: latestCodeRef.current },
          'Autosave Checkpoint'
        );
      }
    }, SNAPSHOT_INTERVAL_MS);

    return () => {
      clearInterval(snapshotInterval);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);

      try {
        ch.send({
          type: 'broadcast',
          event: 'SESSION_ENDED',
          payload: { sessionId, questionId, timestamp: Date.now() },
        });
        ch.untrack();
        supabase.removeChannel(ch);
      } catch (_) {}

      channelRef.current = null;
      setIsConnected(false);
      setPresenceStatus('disconnected');
    };
  }, [sessionId, questionId, questionTitle, track, language, updatePresence]);

  // 1. Emit Code Change
  const emitCodeChange = useCallback(
    (newCode: string, fileOverride?: string, cursor?: { line: number; column: number }) => {
      markActive();
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      const curFile = fileOverride || latestFileRef.current;

      // Broadcast typing indicator start
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        ch.send({
          type: 'broadcast',
          event: 'TYPING_STARTED',
          payload: { sessionId, activeFile: curFile, timestamp: Date.now() },
        });
      }

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        ch.send({
          type: 'broadcast',
          event: 'TYPING_STOPPED',
          payload: { sessionId, activeFile: curFile, timestamp: Date.now() },
        });
      }, 1500);

      // Debounce the code broadcast
      if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);
      codeDebounceTimerRef.current = setTimeout(() => {
        const lineCount = newCode.split('\n').length;
        ch.send({
          type: 'broadcast',
          event: 'CODE_CHANGED',
          payload: {
            sessionId,
            questionId,
            activeFile: curFile,
            code: newCode,
            lineCount,
            cursor,
            timestamp: Date.now(),
          },
        });
      }, CODE_DEBOUNCE_MS);
    },
    [sessionId, questionId, markActive]
  );

  // 2. Emit Cursor Movement
  const emitCursorMove = useCallback(
    (line: number, column: number) => {
      const now = Date.now();
      if (now - lastCursorEmitRef.current < CURSOR_THROTTLE_MS) return;
      lastCursorEmitRef.current = now;

      markActive();
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      ch.send({
        type: 'broadcast',
        event: 'CURSOR_MOVED',
        payload: {
          sessionId,
          activeFile: latestFileRef.current,
          line,
          column,
          timestamp: now,
        },
      });
    },
    [sessionId, markActive]
  );

  // 3. Emit Editor Focus / Blur
  const emitFocus = useCallback(
    (focused: boolean) => {
      markActive();
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      ch.send({
        type: 'broadcast',
        event: focused ? 'EDITOR_FOCUSED' : 'EDITOR_BLURRED',
        payload: {
          sessionId,
          activeFile: latestFileRef.current,
          focused,
          timestamp: Date.now(),
        },
      });
    },
    [sessionId, markActive]
  );

  // 4. Emit Code Run / Test Event
  const emitCodeRun = useCallback(
    (exec: CodeRunBroadcastPayload) => {
      markActive();
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      ch.send({
        type: 'broadcast',
        event: exec.status === 'running' ? 'TEST_STARTED' : 'TEST_COMPLETED',
        payload: {
          sessionId,
          questionId,
          activeFile: latestFileRef.current,
          status: exec.status,
          passed: exec.passed ?? 0,
          total: exec.total ?? 0,
          runtimeMs: exec.runtimeMs ?? 0,
          error: exec.error,
          timestamp: Date.now(),
        },
      });
    },
    [sessionId, questionId, markActive]
  );

  // 5. Emit File Switch
  const emitFileSwitch = useCallback(
    (fileName: string) => {
      latestFileRef.current = fileName;
      markActive();
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      ch.send({
        type: 'broadcast',
        event: 'FILE_OPENED',
        payload: {
          sessionId,
          questionId,
          activeFile: fileName,
          timestamp: Date.now(),
        },
      });
    },
    [sessionId, questionId, markActive]
  );

  // 6. Emit General Activity
  const emitActivity = useCallback(
    (message: string, type: string = 'ACTIVITY') => {
      markActive();
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      ch.send({
        type: 'broadcast',
        event: 'ACTIVITY',
        payload: {
          sessionId,
          questionId,
          type,
          message,
          timestamp: Date.now(),
        },
      });
    },
    [sessionId, questionId, markActive]
  );

  return {
    isConnected,
    presenceStatus,
    emitCodeChange,
    emitCursorMove,
    emitFocus,
    emitCodeRun,
    emitFileSwitch,
    emitActivity,
  };
}
