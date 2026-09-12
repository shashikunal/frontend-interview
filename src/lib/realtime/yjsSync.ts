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

/**
 * Gets or creates an isolated Y.Doc for an interview session
 */
export function getOrCreateSessionYDoc(sessionId: string): Y.Doc {
  let doc = sessionDocsMap.get(sessionId);
  if (!doc) {
    doc = new Y.Doc();
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
  getActiveFile: () => string
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

  ydoc.on('update', handleDocUpdate);

  // 2. Incoming remote updates from other clients in room -> apply to local Y.Doc
  const handleRemoteUpdate = (data: { sessionId: string; update: any; fileId?: string }) => {
    if (data.sessionId !== sessionId || !data.update) return;
    try {
      const uint8 = toUint8Array(data.update);
      Y.applyUpdate(ydoc, uint8, 'remote');
    } catch (err) {
      console.warn(`[Yjs Sync] Error applying remote update for session ${sessionId}:`, err);
    }
  };

  // 3. Full state synchronization payload
  const handleSyncResponse = (data: { sessionId: string; docState: any }) => {
    if (data.sessionId !== sessionId || !data.docState) return;
    try {
      const uint8 = toUint8Array(data.docState);
      Y.applyUpdate(ydoc, uint8, 'remote');
    } catch (err) {
      console.warn(`[Yjs Sync] Error applying full sync for session ${sessionId}:`, err);
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

  // If ytext already has content from Y.Doc sync, ensure model matches ytext
  if (ytext.length > 0) {
    if (model.getValue() !== ytext.toString()) {
      model.setValue(ytext.toString());
    }
  } else if (!isReadOnly && initialContent && initialContent.trim().length > 0) {
    // Only student initializes empty ytext if no server sync was applied
    ytext.insert(0, initialContent);
  } else if (initialContent && initialContent.trim().length > 0) {
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
