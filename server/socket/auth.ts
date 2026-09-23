import type { Socket } from 'socket.io';
import { supabase } from '../../src/lib/supabase/client.ts';
import { tokenService } from '../auth/tokenService.ts';
import type { AuthenticatedUser, ClientToServerEvents, ServerToClientEvents, SocketData } from './types.js';

type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export async function authenticateSocket(
  socket: CustomSocket,
  next: (err?: Error) => void
): Promise<void> {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization
        ? socket.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
        : null);

    if (!token) {
      // In development, only permit non-privileged guest candidate if explicitly requested; NEVER permit unverified admin
      if (process.env.NODE_ENV !== 'production' && socket.handshake.auth?.devUser) {
        const devUser = socket.handshake.auth?.devUser || {};
        if (devUser.role === 'admin' || devUser.id?.includes('admin')) {
          return next(new Error('Authentication failed: Administrative access requires a verified cryptographic token.'));
        }
        socket.data.user = {
          id: devUser.id || `guest_${socket.id.slice(0, 8)}`,
          email: devUser.email || 'candidate@dev.local',
          role: 'candidate',
          name: devUser.name || 'Candidate',
        };
        socket.data.role = 'candidate';
        socket.data.subscribedSessions = new Set();
        return next();
      }

      return next(new Error('Authentication failed: Missing access token'));
    }

    // 1. Try verify as meeting JWT token
    const meetingAuth = tokenService.verifyMeetingToken(token);
    if (meetingAuth.valid && meetingAuth.claims) {
      const authUser: AuthenticatedUser = {
        id: meetingAuth.claims.userId,
        email: meetingAuth.claims.userEmail,
        role: (meetingAuth.claims.userRole as any) || 'candidate',
        name: meetingAuth.claims.userName,
      };
      socket.data.user = authUser;
      socket.data.role = authUser.role;
      socket.data.subscribedSessions = new Set();
      return next();
    }

    // 2. Fallback: Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return next(new Error(`Authentication failed: ${authError?.message || 'Invalid user token'}`));
    }

    // 2. Fetch role from profiles table
    let role: 'candidate' | 'admin' | 'interviewer' | 'observer' = 'candidate';
    let fullName = user.email ? user.email.split('@')[0] : 'Candidate';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        if (profile.role === 'admin') role = 'admin';
        else if (profile.role === 'interviewer') role = 'interviewer';
        if (profile.full_name) fullName = profile.full_name;
      }
    } catch (_) {}

    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role,
      name: fullName,
    };

    socket.data.user = authUser;
    socket.data.role = role;
    socket.data.subscribedSessions = new Set();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Socket.IO Auth] Authenticated user ${authUser.name} (${authUser.id}) with role: ${authUser.role}`);
    }

    next();
  } catch (err) {
    next(new Error(err instanceof Error ? err.message : 'Internal authentication error'));
  }
}
