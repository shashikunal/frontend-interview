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

export interface RealtimeBroadcastEventPayload {
  event_id: string;
  session_id: string;
  user_id?: string;
  event_type: string;
  sequence_number: number;
  timestamp: number;
  [key: string]: any;
}

const IDLE_TIMEOUT_MS = 45 * 1000; // 45 seconds of silence -> idle
const CODE_DEBOUNCE_MS = 250; // 250ms code throttle
const CURSOR_THROTTLE_MS = 150; // 150ms cursor throttle
const SNAPSHOT_INTERVAL_MS = 30 * 1000; // 30s DB checkpoint

function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'evt_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

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
  const sequenceNumberRef = useRef<number>(1);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCursorEmitRef = useRef<number>(0);
  const lastSavedCodeRef = useRef<string>(code);
  const isTypingRef = useRef<boolean>(false);

  // Helper to send structured, ordered broadcast event with diagnostic logging
  const sendBroadcastEvent = useCallback(
    (event: string, payload: Record<string, any>) => {
      const ch = channelRef.current;
      if (!ch || !sessionId) return;

      const seq = sequenceNumberRef.current++;
      const fullPayload: RealtimeBroadcastEventPayload = {
        event_id: generateEventId(),
        session_id: sessionId,
        user_id: user?.id,
        event_type: event,
        sequence_number: seq,
        timestamp: Date.now(),
        ...payload,
      };

      if (import.meta.env?.DEV) {
        console.log(`[Realtime] Publishing ${event} (seq #${seq}):`, fullPayload);
      }

      try {
        ch.send({
          type: 'broadcast',
          event,
          payload: fullPayload,
        });
      } catch (err) {
        if (import.meta.env?.DEV) {
          console.warn(`[Realtime] Failed to broadcast ${event}:`, err);
        }
      }
    },
    [sessionId, user?.id]
  );

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
        sendBroadcastEvent('QUESTION_OPENED', {
          sessionId,
          questionId,
          questionTitle,
          track,
          language,
          activeFile: latestFileRef.current,
          code: latestCodeRef.current,
        });

        // Broadcast initial code snapshot so Admin sees it immediately
        if (latestCodeRef.current) {
          sendBroadcastEvent('CODE_CHANGED', {
            sessionId,
            questionId,
            activeFile: latestFileRef.current,
            code: latestCodeRef.current,
            lineCount: latestCodeRef.current.split('\n').length,
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
        sendBroadcastEvent('SESSION_ENDED', { sessionId, questionId });
        ch.untrack();
        supabase.removeChannel(ch);
      } catch (_) {}

      channelRef.current = null;
      setIsConnected(false);
      setPresenceStatus('disconnected');
    };
  }, [sessionId, questionId, questionTitle, track, language, updatePresence, sendBroadcastEvent]);

  // 1. Emit Code Change
  const emitCodeChange = useCallback(
    (newCode: string, fileOverride?: string, cursor?: { line: number; column: number }) => {
      markActive();
      const curFile = fileOverride || latestFileRef.current;

      // Broadcast typing indicator start
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        sendBroadcastEvent('TYPING_STARTED', { sessionId, activeFile: curFile });
      }

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        sendBroadcastEvent('TYPING_STOPPED', { sessionId, activeFile: curFile });
      }, 1500);

      // Debounce the code broadcast
      if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);
      codeDebounceTimerRef.current = setTimeout(() => {
        const lineCount = newCode.split('\n').length;
        sendBroadcastEvent('CODE_CHANGED', {
          sessionId,
          questionId,
          activeFile: curFile,
          code: newCode,
          lineCount,
          cursor,
        });
      }, CODE_DEBOUNCE_MS);
    },
    [sessionId, questionId, markActive, sendBroadcastEvent]
  );

  // 2. Emit Cursor Movement
  const emitCursorMove = useCallback(
    (line: number, column: number) => {
      const now = Date.now();
      if (now - lastCursorEmitRef.current < CURSOR_THROTTLE_MS) return;
      lastCursorEmitRef.current = now;

      markActive();
      sendBroadcastEvent('CURSOR_MOVED', {
        sessionId,
        activeFile: latestFileRef.current,
        line,
        column,
      });
    },
    [sessionId, markActive, sendBroadcastEvent]
  );

  // 3. Emit Editor Focus / Blur
  const emitFocus = useCallback(
    (focused: boolean) => {
      markActive();
      sendBroadcastEvent(focused ? 'EDITOR_FOCUSED' : 'EDITOR_BLURRED', {
        sessionId,
        activeFile: latestFileRef.current,
        focused,
      });
    },
    [sessionId, markActive, sendBroadcastEvent]
  );

  // 4. Emit Code Run / Test Event
  const emitCodeRun = useCallback(
    (exec: CodeRunBroadcastPayload) => {
      markActive();
      sendBroadcastEvent(exec.status === 'running' ? 'TEST_STARTED' : 'TEST_COMPLETED', {
        sessionId,
        questionId,
        activeFile: latestFileRef.current,
        status: exec.status,
        passed: exec.passed ?? 0,
        total: exec.total ?? 0,
        runtimeMs: exec.runtimeMs ?? 0,
        error: exec.error,
      });
    },
    [sessionId, questionId, markActive, sendBroadcastEvent]
  );

  // 5. Emit File Switch
  const emitFileSwitch = useCallback(
    (fileName: string) => {
      latestFileRef.current = fileName;
      markActive();
      sendBroadcastEvent('FILE_OPENED', {
        sessionId,
        questionId,
        activeFile: fileName,
      });
    },
    [sessionId, questionId, markActive, sendBroadcastEvent]
  );

  // 6. Emit General Activity
  const emitActivity = useCallback(
    (message: string, type: string = 'ACTIVITY') => {
      markActive();
      sendBroadcastEvent('ACTIVITY', {
        sessionId,
        questionId,
        type,
        message,
      });
    },
    [sessionId, questionId, markActive, sendBroadcastEvent]
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
