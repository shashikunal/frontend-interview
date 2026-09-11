import * as Y from 'yjs';
import { supabase } from '../supabase/client';
import { interviewSessionService } from '../interviewSessionService';
import type { RemoteCursor } from './monacoYjsBinding';


export interface CollabUser {
  id: string;
  name: string;
  role: 'candidate' | 'admin' | 'interviewer' | 'observer';
  color: string;
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export type CollabEventCallback = (event: {
  type: 'peer_joined' | 'peer_left' | 'peers_changed' | 'execution_started' | 'execution_completed' | 'file_switched' | 'message_received';
  payload?: any;
}) => void;

/**
 * Supabase Realtime Provider for Yjs Documents
 * Enables live collaborative editing between candidate, admin, and observers over WebSockets
 * without requiring any custom long-running backend server. Vercel & Supabase Cloud compatible.
 *
 * SECURITY: Always use SupabaseYjsProvider.create() rather than new SupabaseYjsProvider().
 * The factory method verifies session access via Supabase RLS before opening the channel.
 */
export class SupabaseYjsProvider {
  public doc: Y.Doc;
  public sessionId: string;
  public currentUser: CollabUser;
  public isConnected = false;
  private channel: any = null;
  private listeners: CollabEventCallback[] = [];
  private remoteCursors: RemoteCursor[] = [];
  private onCursorsChanged: ((cursors: RemoteCursor[]) => void) | null = null;
  private isDestroyed = false;

  /**
   * Secure factory: verifies session access before opening the Realtime channel.
   * Throws an error if the current user does not have access to the given session.
   *
   * @param sessionId    - The interview session UUID to connect to
   * @param doc          - A fresh or existing Yjs Doc
   * @param currentUser  - The authenticated user's collab identity
   * @param options      - Optional cursor change callback
   * @param skipAccessCheck - Set to true only for unit tests or offline/local sessions
   */
  static async create(
    sessionId: string,
    doc: Y.Doc,
    currentUser: CollabUser,
    options?: { onCursorsChanged?: (cursors: RemoteCursor[]) => void },
    skipAccessCheck = false
  ): Promise<SupabaseYjsProvider> {
    if (!skipAccessCheck) {
      const hasAccess = await interviewSessionService.verifySessionAccess(sessionId);
      if (!hasAccess) {
        throw new Error(
          `[SupabaseYjsProvider] Access denied: user "${currentUser.id}" is not authorized for session "${sessionId}". ` +
          'Only the session candidate, assigned admin, or platform administrators may join.'
        );
      }
    }
    return new SupabaseYjsProvider(sessionId, doc, currentUser, options);
  }

  /** @deprecated Use SupabaseYjsProvider.create() for secure access-verified construction. */
  constructor(
    sessionId: string,
    doc: Y.Doc,
    currentUser: CollabUser,
    options?: {
      onCursorsChanged?: (cursors: RemoteCursor[]) => void;
    }
  ) {

    this.sessionId = sessionId;
    this.doc = doc;
    this.currentUser = currentUser;
    this.onCursorsChanged = options?.onCursorsChanged || null;

    this.initRealtimeChannel();
    this.bindDocEvents();
  }

  private initRealtimeChannel() {
    const channelName = `session_collab_${this.sessionId}`;
    this.channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: this.currentUser.id },
      },
    });

    // 1. Listen for Yjs Document Updates
    this.channel.on('broadcast', { event: 'yjs-update' }, ({ payload }: { payload: { update: string; senderId: string } }) => {
      if (payload.senderId === this.currentUser.id) return;
      try {
        const update = base64ToUint8Array(payload.update);
        Y.applyUpdate(this.doc, update, 'remote');
      } catch (err) {
        console.error('[Yjs Collab] Failed to apply remote update:', err);
      }
    });

    // 2. Peer asks for initial document state
    this.channel.on('broadcast', { event: 'yjs-sync-request' }, ({ payload }: { payload: { senderId: string } }) => {
      if (payload.senderId === this.currentUser.id) return;
      // Send our state as update
      const fullUpdate = Y.encodeStateAsUpdate(this.doc);
      const b64 = uint8ArrayToBase64(fullUpdate);
      this.channel.send({
        type: 'broadcast',
        event: 'yjs-sync-response',
        payload: {
          targetId: payload.senderId,
          update: b64,
          senderId: this.currentUser.id,
        },
      });
    });

    // 3. Peer responds with document state
    this.channel.on('broadcast', { event: 'yjs-sync-response' }, ({ payload }: { payload: { targetId: string; update: string; senderId: string } }) => {
      if (payload.targetId !== this.currentUser.id) return;
      try {
        const update = base64ToUint8Array(payload.update);
        Y.applyUpdate(this.doc, update, 'remote');
      } catch (err) {
        console.error('[Yjs Collab] Failed to apply initial sync response:', err);
      }
    });

    // 4. Cursor position updates
    this.channel.on('broadcast', { event: 'cursor-update' }, ({ payload }: { payload: RemoteCursor }) => {
      if (String(payload.clientId) === this.currentUser.id) return;

      const idx = this.remoteCursors.findIndex(c => String(c.clientId) === String(payload.clientId));
      if (idx >= 0) {
        this.remoteCursors[idx] = payload;
      } else {
        this.remoteCursors.push(payload);
      }

      this.onCursorsChanged?.([...this.remoteCursors]);
    });

    // 5. Execution Broadcasts (Run / Tests)
    this.channel.on('broadcast', { event: 'execution-event' }, ({ payload }: { payload: any }) => {
      this.notifyListeners({
        type: payload.status === 'running' ? 'execution_started' : 'execution_completed',
        payload,
      });
    });

    // 6. Active File Switching Broadcast
    this.channel.on('broadcast', { event: 'file-switch-event' }, ({ payload }: { payload: any }) => {
      this.notifyListeners({
        type: 'file_switched',
        payload,
      });
    });

    // 7. Presence Tracking
    this.channel.on('presence', { event: 'sync' }, () => {
      const state = this.channel.presenceState();
      this.notifyListeners({
        type: 'peers_changed',
        payload: state,
      });
    });

    this.channel.on('presence', { event: 'join' }, ({ newPresences }: any) => {
      this.notifyListeners({
        type: 'peer_joined',
        payload: newPresences,
      });
    });

    this.channel.on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
      // Remove cursors of left peers
      const leftIds = new Set(leftPresences.map((p: any) => p.id));
      this.remoteCursors = this.remoteCursors.filter(c => !leftIds.has(String(c.clientId)));
      this.onCursorsChanged?.([...this.remoteCursors]);

      this.notifyListeners({
        type: 'peer_left',
        payload: leftPresences,
      });
    });

    // Subscribe to channel
    this.channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        this.isConnected = true;
        // Track self in presence
        await this.channel.track({
          id: this.currentUser.id,
          name: this.currentUser.name,
          role: this.currentUser.role,
          color: this.currentUser.color,
          onlineAt: new Date().toISOString(),
        });

        // Request initial state from any active peers
        this.channel.send({
          type: 'broadcast',
          event: 'yjs-sync-request',
          payload: { senderId: this.currentUser.id },
        });
      } else {
        this.isConnected = false;
      }
    });
  }

  private bindDocEvents() {
    this.doc.on('update', (update: Uint8Array, origin: any) => {
      if (origin === 'remote' || this.isDestroyed) return;
      if (!this.channel) return;

      try {
        const b64 = uint8ArrayToBase64(update);
        this.channel.send({
          type: 'broadcast',
          event: 'yjs-update',
          payload: {
            update: b64,
            senderId: this.currentUser.id,
          },
        });
      } catch (err) {
        console.error('[Yjs Collab] Failed to broadcast update:', err);
      }
    });
  }

  /**
   * Broadcasts local cursor movement to all participants
   */
  public sendCursorPosition(range: any, activeFile: string) {
    if (!this.channel || !this.isConnected) return;
    this.channel.send({
      type: 'broadcast',
      event: 'cursor-update',
      payload: {
        clientId: this.currentUser.id,
        user: {
          name: this.currentUser.name,
          role: this.currentUser.role,
          color: this.currentUser.color,
        },
        range,
        activeFile,
      },
    });
  }

  /**
   * Broadcasts code execution event so Admin / Interviewer sees test & compile results live
   */
  public broadcastExecution(executionData: {
    status: 'running' | 'success' | 'runtime_error' | 'compile_error' | 'failed';
    testsPassed?: number;
    testsTotal?: number;
    stdout?: string;
    stderr?: string;
    executionTime?: number;
  }) {
    if (!this.channel || !this.isConnected) return;
    this.channel.send({
      type: 'broadcast',
      event: 'execution-event',
      payload: {
        ...executionData,
        senderId: this.currentUser.id,
        senderName: this.currentUser.name,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Broadcasts active file switch
   */
  public broadcastFileSwitch(fileName: string) {
    if (!this.channel || !this.isConnected) return;
    this.channel.send({
      type: 'broadcast',
      event: 'file-switch-event',
      payload: {
        fileName,
        senderId: this.currentUser.id,
        senderName: this.currentUser.name,
      },
    });
  }

  public subscribe(callback: CollabEventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(event: any) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (_) {}
    }
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.channel) {
      try {
        this.channel.untrack();
        supabase.removeChannel(this.channel);
      } catch (_) {}
      this.channel = null;
    }
    this.listeners = [];
    this.remoteCursors = [];
  }
}
