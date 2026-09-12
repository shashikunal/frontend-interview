import { io, Socket } from 'socket.io-client';
import { supabase } from '../supabase/client';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../server/socket/types';

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

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

export function getLocalCandidate(): { id: string; name: string; email: string; role: string } {
  try {
    let gid = localStorage.getItem('interview_candidate_id');
    if (!gid) {
      gid = `guest_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('interview_candidate_id', gid);
    }
    return {
      id: gid,
      name: `Candidate (${gid.slice(-4).toUpperCase()})`,
      email: `${gid}@interview.local`,
      role: 'candidate',
    };
  } catch {
    return {
      id: 'guest_student',
      name: 'Candidate',
      email: 'candidate@interview.local',
      role: 'candidate',
    };
  }
}

let sharedCandidateSocket: TypedSocket | null = null;
let sharedAdminSocket: TypedSocket | null = null;
let currentCandidateToken: string | null = null;
let currentAdminToken: string | null = null;

export async function getSharedInterviewSocket(devUser?: any): Promise<TypedSocket> {
  const token = await getSupabaseToken();
  const effectiveUser = devUser || (!token ? getLocalCandidate() : undefined);

  if (sharedCandidateSocket && sharedCandidateSocket.connected && currentCandidateToken === token) {
    return sharedCandidateSocket;
  }

  if (sharedCandidateSocket) {
    try {
      sharedCandidateSocket.disconnect();
    } catch (_) {}
  }

  currentCandidateToken = token;
  sharedCandidateSocket = createInterviewSocket(token, effectiveUser);
  return sharedCandidateSocket;
}

export async function getAdminInterviewSocket(devUser?: any): Promise<TypedSocket> {
  const token = await getSupabaseToken();
  const effectiveUser = devUser || {
    id: 'admin_local_dev',
    email: 'admin@interview.local',
    role: 'admin',
    name: 'Administrator',
  };

  if (sharedAdminSocket && sharedAdminSocket.connected && currentAdminToken === token) {
    return sharedAdminSocket;
  }

  if (sharedAdminSocket) {
    try {
      sharedAdminSocket.disconnect();
    } catch (_) {}
  }

  currentAdminToken = token;
  sharedAdminSocket = createInterviewSocket(token, effectiveUser);
  return sharedAdminSocket;
}

