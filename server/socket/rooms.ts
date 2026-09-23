import { supabase } from '../../src/lib/supabase/client.ts';
import type { AuthenticatedUser } from './types.js';

export function getInterviewRoom(sessionId: string): string {
  return `interview:${sessionId.trim()}`;
}

export function getMeetingRoom(meetingId: string): string {
  return `meeting:${meetingId.trim()}`;
}

export function getAppChatConversationRoom(conversationId: string): string {
  return `app:chat:conv:${conversationId.trim()}`;
}

export function getAppChatUserRoom(userId: string): string {
  return `app:chat:user:${userId.trim()}`;
}

import { meetingService } from '../meetings/meetingService.ts';

/**
 * Validates if the user is authorized to participate in the meeting.
 */
export async function canAccessMeeting(user: AuthenticatedUser, meetingId: string): Promise<boolean> {
  if (!meetingId || !user) return false;
  // Admins and interviewers can access any meeting
  if (user.role === 'admin' || user.role === 'interviewer') {
    return true;
  }

  const meeting = meetingService.getMeetingById(meetingId);
  if (!meeting) return false;
  if (meeting.status === 'CANCELLED' || meeting.status === 'ENDED') {
    return false;
  }

  if (meeting.hostId === user.id) {
    return true;
  }

  return true;
}

/**
 * Validates if the user is authorized to participate in the interview session as a candidate.
 * Prevents candidate A from accessing candidate B's session room.
 */
export async function canJoinSession(user: AuthenticatedUser, sessionId: string): Promise<boolean> {
  // Admins can join any session
  if (user.role === 'admin' || user.role === 'interviewer') {
    return true;
  }

  // Candidate can only join their own interview session
  try {
    const { data: session } = await supabase
      .from('interview_sessions')
      .select('candidate_id')
      .eq('id', sessionId)
      .maybeSingle();

    if (session && session.candidate_id === user.id) {
      return true;
    }
  } catch (err) {
    console.error('[canJoinSession] Database verification error:', err);
  }

  // In development, allow joining if user is demo/test candidate
  if (process.env.NODE_ENV !== 'production' && user.role === 'candidate') {
    return true;
  }

  return false;
}

/**
 * Validates if the user is authorized to monitor a session.
 * Only administrators and authorized interviewers can monitor.
 */
export async function canMonitorSession(user: AuthenticatedUser, _sessionId: string): Promise<boolean> {
  if (user.role === 'admin' || user.role === 'interviewer') {
    return true;
  }

  // Development fallback for admin testing
  if (process.env.NODE_ENV !== 'production') {
    if (user.id?.includes('admin')) {
      return true;
    }
  }

  return false;
}
