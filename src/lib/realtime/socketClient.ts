import { io, Socket } from 'socket.io-client';
import { supabase } from '../supabase/client';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../server/socket/types';

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let sharedSocket: TypedSocket | null = null;
let currentToken: string | null = null;

export async function getSupabaseToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

export function createInterviewSocket(token?: string | null, devUser?: any): TypedSocket {
  const effectiveToken = token || currentToken;

  // Determine socket endpoint:
  // In browser, empty string or window.location.origin connects to same origin
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const socket: TypedSocket = io(origin, {
    path: '/api/socket',
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling'],
    auth: {
      token: effectiveToken,
      devUser,
    },
  });

  socket.on('connect', () => {
    if (import.meta.env?.DEV) {
      console.log(`[Socket.IO Client] Connected to server (id: ${socket.id})`);
    }
  });

  socket.on('connect_error', (err) => {
    if (import.meta.env?.DEV) {
      console.warn(`[Socket.IO Client] Connection error: ${err.message}`);
    }
  });

  socket.on('disconnect', (reason) => {
    if (import.meta.env?.DEV) {
      console.log(`[Socket.IO Client] Disconnected: ${reason}`);
    }
  });

  return socket;
}

export async function getSharedInterviewSocket(devUser?: any): Promise<TypedSocket> {
  const token = await getSupabaseToken();
  if (sharedSocket && sharedSocket.connected && currentToken === token) {
    return sharedSocket;
  }

  if (sharedSocket) {
    try {
      sharedSocket.disconnect();
    } catch (_) {}
  }

  currentToken = token;
  sharedSocket = createInterviewSocket(token, devUser);
  return sharedSocket;
}
