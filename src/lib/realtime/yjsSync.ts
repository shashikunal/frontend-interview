import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import type { editor } from 'monaco-editor';
import type { TypedSocket } from './socketClient';

export function toUint8Array(data: any): Uint8Array {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (data?.buffer instanceof ArrayBuffer) {
    return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength || data.buffer.byteLength);
  }
  if (Array.isArray(data)) return new Uint8Array(data);
  if (typeof data === 'string') {
    try {
      const bin = atob(data);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return arr;
    } catch (_) {}
  }
  return new Uint8Array(data || []);
}

// Global registry of Y.Docs keyed by sessionId to avoid recreating docs
const sessionDocsMap = new Map<string, Y.Doc>();

// Per-session initial-sync deferreds. Resolved when the first `yjs:sync-response`
// for the session arrives. Lets editor binding wait for the server's canonical
// state before seeding local content, so a late full-state apply cannot
// duplicate content through a live MonacoBinding (refresh doubled the starter).
const sessionSyncWaiters = new Map<string, { promise: Promise<void>; resolve: () => void }>();

function getSessionSyncWaiter(sessionId: string): { promise: Promise<void>; resolve: () => void } {
  let waiter = sessionSyncWaiters.get(sessionId);
  if (!waiter) {
    let resolve!: () => void;
    const promise = new Promise<void>((res) => { resolve = res; });
    waiter = { promise, resolve };
    sessionSyncWaiters.set(sessionId, waiter);
  }
  return waiter;
}

/**
 * Resolves when the server's first sync-response for the session has been
 * applied (or after `timeoutMs` with no connection, for offline use).
 * Call before binding Monaco so seeding never races a late full-state apply.
 */
export function waitForInitialSync(sessionId: string, timeoutMs = 1500): Promise<void> {
  const waiter = getSessionSyncWaiter(sessionId);
  if (timeoutMs <= 0) return waiter.promise;
  return Promise.race([
    waiter.promise,
    new Promise<void>((res) => setTimeout(res, timeoutMs)),
  ]);
}

/**
 * Gets or creates an isolated Y.Doc for an interview session
 */
const MAX_SESSION_DOCS = 20;

// Sessions with a live socket bridge. Eviction below never touches these,
// so an actively monitored/collaborating session cannot lose its Y.Doc.
const bridgedSessions = new Set<string>();

export function getOrCreateSessionYDoc(sessionId: string): Y.Doc {
  let doc = sessionDocsMap.get(sessionId);
  if (!doc) {
    doc = new Y.Doc();
    sessionDocsMap.set(sessionId, doc);
    // Bounded registry: evict oldest IDLE (unbridged) docs so visiting many
    // sessions in one tab cannot leak Y.Docs (and their bindings) forever.
    if (sessionDocsMap.size > MAX_SESSION_DOCS) {
      for (const key of sessionDocsMap.keys()) {
        if (key !== sessionId && !bridgedSessions.has(key)) {
          disposeSessionYDoc(key);
          break;
        }
      }
    }
  } else {
    // Refresh recency: re-insert so oldest-first eviction stays correct.
    sessionDocsMap.delete(sessionId);
    sessionDocsMap.set(sessionId, doc);
  }
  return doc;
}

/**
 * Disposes an isolated Y.Doc when no longer needed
 */
export function disposeSessionYDoc(sessionId: string): void {
  const doc = sessionDocsMap.get(sessionId);
  if (doc) {
    doc.destroy();
    sessionDocsMap.delete(sessionId);
  }
}

/**
 * Bridges a Y.Doc to a Socket.IO connection for real-time binary synchronization
 */
export function bridgeYDocWithSocket(
  sessionId: string,
  ydoc: Y.Doc,
  socket: TypedSocket,
  getActiveFile: () => string,
  onRemoteApply?: (applying: boolean) => void
): () => void {
  // 1. Local changes produce Yjs binary updates -> emit to Socket.IO room
  const handleDocUpdate = (update: Uint8Array, origin: any) => {
    if (origin === 'remote') return;
    if (socket.connected) {
      socket.emit('yjs:update', {
        sessionId,
        update: Array.from(update),
        fileId: getActiveFile(),
        timestamp: Date.now(),
      });
    }
  };

  bridgedSessions.add(sessionId);
  ydoc.on('update', handleDocUpdate);

  // 2. Incoming remote updates from other clients in room -> apply to local Y.Doc
  const handleRemoteUpdate = (data: { sessionId: string; update: any; fileId?: string }) => {
    if (data.sessionId !== sessionId || !data.update) return;
    try {
      const uint8 = toUint8Array(data.update);
      onRemoteApply?.(true);
      Y.applyUpdate(ydoc, uint8, 'remote');
      onRemoteApply?.(false);
    } catch (err) {
      onRemoteApply?.(false);
      console.warn(`[Yjs Sync] Error applying remote update for session ${sessionId}:`, err);
    }
  };

  // 3. Full state synchronization payload
  const handleSyncResponse = (data: { sessionId: string; docState: any }) => {
    if (data.sessionId !== sessionId || !data.docState) return;
    try {
      const uint8 = toUint8Array(data.docState);
      onRemoteApply?.(true);
      Y.applyUpdate(ydoc, uint8, 'remote');
      onRemoteApply?.(false);
    } catch (err) {
      onRemoteApply?.(false);
      console.warn(`[Yjs Sync] Error applying full sync for session ${sessionId}:`, err);
    } finally {
      // Unblock any pending editor bind: initial server state is now applied,
      // so binding/adopting the doc cannot be doubled by a later apply.
      getSessionSyncWaiter(sessionId).resolve();
    }
  };

  socket.on('yjs:update', handleRemoteUpdate);
  socket.on('yjs:sync-response', handleSyncResponse);

  // Request initial sync with local state vector if connected
  const requestSync = () => {
    if (socket.connected) {
      const sv = Y.encodeStateVector(ydoc);
      socket.emit('yjs:sync-request', { sessionId, stateVector: Array.from(sv) });
    }
  };

  requestSync();
  socket.on('connect', requestSync);

  return () => {
    ydoc.off('update', handleDocUpdate);
    socket.off('yjs:update', handleRemoteUpdate);
    socket.off('yjs:sync-response', handleSyncResponse);
    socket.off('connect', requestSync);
    bridgedSessions.delete(sessionId);
  };
}

/**
 * Binds a Monaco editor instance to a specific Y.Text file within a Y.Doc
 */
export function bindMonacoToYDoc(
  ydoc: Y.Doc,
  fileId: string,
  editorInstance: editor.IStandaloneCodeEditor,
  initialContent?: string,
  isReadOnly: boolean = false
): MonacoBinding | null {
  const model = editorInstance.getModel();
  if (!model) return null;

  const ytext = ydoc.getText(fileId);

  // Determine the correct initial content for the editor:
  // Priority: server-synced ytext content > provided initialContent > empty
  if (ytext.length > 0) {
    // Server already has content (from Y.Doc sync) - use it as source of truth
    const ytextValue = ytext.toString();
    if (model.getValue() !== ytextValue) {
      model.setValue(ytextValue);
    }
  } else if (!isReadOnly && initialContent && initialContent.trim().length > 0) {
    // No server content yet. Set model first, then ytext.
    // This prevents MonacoBinding from seeing two separate insertions
    // (one from ytext.insert and one from model.setValue) causing duplication.
    if (model.getValue() !== initialContent) {
      if (model.getValue().trim().length === 0) {
        model.setValue(initialContent);
      } else {
        // Model holds live (possibly user-typed) content that arrived while
        // the session was resolving: NEVER overwrite it with the seed, or
        // in-flight keystrokes are lost. Adopt the model into ytext instead.
        ytext.insert(0, model.getValue());
        try {
          console.log(`[YJS-STUDENT] Binding initialized for file ${fileId} (${ytext.length} chars)`);
          return new MonacoBinding(ytext, model, new Set([editorInstance]));
        } catch (err) {
          console.warn('[Yjs Monaco] Failed to bind Monaco editor to Y.Text:', err);
          return null;
        }
      }
    }
    // Now insert into empty ytext - MonacoBinding will see model and ytext already match
    ytext.insert(0, initialContent);
  } else if (isReadOnly && initialContent && initialContent.trim().length > 0) {
    if (model.getValue() !== initialContent) {
      model.setValue(initialContent);
    }
  }

  try {
    const binding = new MonacoBinding(
      ytext,
      model,
      new Set([editorInstance])
    );
    if (isReadOnly) {
      console.log(`[YJS-ADMIN] Monaco binding active for file ${fileId} (${ytext.length} chars)`);
    } else {
      console.log(`[YJS-STUDENT] Binding initialized for file ${fileId} (${ytext.length} chars)`);
    }
    return binding;
  } catch (err) {
    console.warn('[Yjs Monaco] Failed to bind Monaco editor to Y.Text:', err);
    return null;
  }
}
