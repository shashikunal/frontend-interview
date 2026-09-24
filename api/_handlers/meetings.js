// REST API: /api/v1/meetings
// Meeting Operations & Control Plane: Meeting List, RSVP, Attendance, Calendar, and Sub-route Router

import { meetingService } from '../../server/meetings/meetingService.ts';
import { meetingOpsService } from '../../server/meetings/meetingOpsService.ts';
import { tokenService } from '../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';
import { calendarService } from '../../server/calendar/calendarService.ts';

import chatHandler from './meetings/chat.js';
import editorHandler from './meetings/editor.js';
import inviteHandler from './meetings/invite.js';
import joinHandler from './meetings/join.js';
import lifecycleHandler from './meetings/lifecycle.js';
import mediaTokenHandler from './meetings/media-token.js';
import whiteboardHandler from './meetings/whiteboard.js';
import recordingHandler from './meetings/recording.js';
import signalingHandler from './meetings/signaling.js';
import { applySecurityHeaders } from '../../server/security/securityHeaders.ts';

export default async function handler(req, res) {
  const urlObj = new URL(req.url || '/', 'http://localhost');
  const pathname = urlObj.pathname.toLowerCase().replace(/\/+$/, '');
  const subpath = (req.query?._subpath || urlObj.searchParams.get('_subpath') || '').toLowerCase();

  // Dispatch to sub-handlers when invoked via Vercel rewrite or direct routing
  if (pathname.endsWith('/signaling') || pathname.includes('/signaling') || subpath === 'signaling') {
    return signalingHandler(req, res);
  }
  if (pathname.endsWith('/recording') || pathname.includes('/recording') || subpath === 'recording') {
    return recordingHandler(req, res);
  }
  if (pathname.endsWith('/chat') || pathname.includes('/chat') || subpath === 'chat') {
    return chatHandler(req, res);
  }
  if (pathname.endsWith('/editor') || pathname.includes('/editor') || subpath === 'editor') {
    return editorHandler(req, res);
  }
  if (pathname.endsWith('/invite') || pathname.includes('/invite') || subpath === 'invite') {
    return inviteHandler(req, res);
  }
  if (pathname.endsWith('/join') || pathname.includes('/join') || subpath === 'join') {
    return joinHandler(req, res);
  }
  if (pathname.endsWith('/lifecycle') || pathname.includes('/lifecycle') || subpath === 'lifecycle') {
    return lifecycleHandler(req, res);
  }
  if (pathname.endsWith('/media-token') || pathname.includes('/media-token') || subpath === 'media-token') {
    return mediaTokenHandler(req, res);
  }
  if (pathname.endsWith('/whiteboard') || pathname.includes('/whiteboard') || subpath === 'whiteboard') {
    return whiteboardHandler(req, res);
  }

  // Base /api/v1/meetings handler
  if (!applySecurityHeaders(req, res)) {
    return;
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Extract and verify Bearer token
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const auth = tokenService.verifyMeetingToken(token);
    if (auth.valid && auth.claims) {
      user = {
        id: auth.claims.userId,
        email: auth.claims.userEmail,
        name: auth.claims.userName,
        role: auth.claims.userRole,
        permissions: auth.claims.permissions || [],
      };
    }
  }

  // Handle unauthenticated requests
  if (!user) {
    // Allow GET /api/v1/meetings for public/candidate guest viewing
    if (req.method === 'GET') {
      user = {
        id: 'candidate_guest',
        email: 'guest@interviewprep.com',
        name: 'Candidate',
        role: 'candidate',
        permissions: ['meetings:participate'],
      };
    } else {
      return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required', 'MISSING_TOKEN'));
    }
  }

  // 1. Download ICS Calendar Event
  if (pathname.endsWith('/ics') || urlObj.searchParams.get('action') === 'ics') {
    const meetingId = urlObj.searchParams.get('meetingId') || urlObj.searchParams.get('id');
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.'));
    }
    const details = meetingOpsService.getMeetingDetails(meetingId);
    if (!details || !details.meeting) {
      return res.status(404).json(createErrorResponse('NotFound', 'Meeting not found.'));
    }
    const icsContent = calendarService.generateICS(details.meeting, {
      organizerName: details.meeting.trainer_name,
      attendees: details.participants.map(p => ({ name: p.student_name, email: p.student_email })),
    });
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${details.meeting.id}.ics"`);
    return res.status(200).send(icsContent);
  }

  // 2. Student RSVP (Accept / Decline)
  if (req.method === 'POST' && (pathname.endsWith('/rsvp') || req.body?.action === 'rsvp')) {
    const { meetingId, status } = req.body || {};
    if (!meetingId || !status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId and valid status (accepted, declined) are required.'));
    }
    const rsvpResult = await meetingOpsService.updateRsvp(user.id, meetingId, status);
    if (!rsvpResult.success) {
      return res.status(400).json(createErrorResponse('BadRequest', rsvpResult.error || 'Failed to update RSVP.'));
    }
    return res.status(200).json({ success: true, message: `RSVP recorded as ${status}.` });
  }

  // 3. Admin / Trainer Record Attendance
  if (req.method === 'POST' && (pathname.endsWith('/attendance') || req.body?.action === 'attendance')) {
    const { meetingId, studentId, attendanceStatus } = req.body || {};
    if (!meetingId || !studentId || !attendanceStatus) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId, studentId, and attendanceStatus are required.'));
    }
    const attResult = await meetingOpsService.markAttendance(user, meetingId, studentId, attendanceStatus);
    if (!attResult.success) {
      return res.status(400).json(createErrorResponse('BadRequest', attResult.error || 'Failed to record attendance.'));
    }
    return res.status(200).json({ success: true, message: 'Attendance recorded.' });
  }

  // 4. GET: List Meetings (Role-Aware Isolation)
  if (req.method === 'GET') {
    const status = urlObj.searchParams.get('status') || undefined;
    const timeframe = urlObj.searchParams.get('timeframe') || undefined;
    const search = urlObj.searchParams.get('search') || undefined;
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '20', 10);

    // If student, filter by assigned meetings, but include live/started cohort sessions
    const isPrivileged = user.role === 'admin' || user.role === 'interviewer';
    const studentFilter = !isPrivileged && user.id !== 'candidate_guest' ? user.id : undefined;

    const result = meetingOpsService.listMeetings({
      status,
      timeframe: timeframe,
      student_id: studentFilter,
      student_email: user.email,
      search,
      page,
      limit,
    });

    // Attach student participant RSVP and attendance info for student views
    const enrichedMeetings = result.meetings.map(m => {
      const details = meetingOpsService.getMeetingDetails(m.id);
      const myParticipantRecord = details?.participants.find(p => p.student_id === user.id);
      return {
        ...m,
        myRsvpStatus: myParticipantRecord?.invitation_status || 'pending',
        myAttendanceStatus: myParticipantRecord?.attendance_status || 'pending',
        googleCalendarUrl: calendarService.getGoogleCalendarUrl(m),
        outlookCalendarUrl: calendarService.getOutlookCalendarUrl(m),
        participantCount: details?.participants.length || 0,
      };
    });

    return res.status(200).json({
      success: true,
      meetings: enrichedMeetings,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }

  // 4b. POST: Create Instant Meeting (STRICT: Only Admin has rights to create meetings)
  if (req.method === 'POST' && (pathname.endsWith('/instant') || req.body?.action === 'instant' || urlObj.searchParams.get('action') === 'instant')) {
    if (user.role !== 'admin') {
      return res.status(403).json(
        createErrorResponse('Forbidden', 'Only platform administrator (shashi) has rights to create meetings.', 'FORBIDDEN')
      );
    }

    const result = await meetingOpsService.createInstantMeeting(user, req.body || {});
    if (!result.success) {
      return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Failed to create instant meeting.'));
    }
    return res.status(201).json({
      success: true,
      meeting: result.meeting,
      meetingUrl: result.meetingUrl,
    });
  }

  // 5. POST: Admin Create Meeting (STRICT: Only Admin has rights to create meetings)
  if (req.method === 'POST') {
    if (user.role !== 'admin') {
      return res.status(403).json(
        createErrorResponse('Forbidden', 'Only platform administrator (shashi) has rights to create meetings.', 'FORBIDDEN')
      );
    }

    const result = await meetingOpsService.createMeeting(user, req.body || {});
    if (!result.success) {
      return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Failed to create meeting.'));
    }

    return res.status(201).json({
      success: true,
      meeting: result.meeting,
      occurrences: result.occurrences,
    });
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed'));
}
