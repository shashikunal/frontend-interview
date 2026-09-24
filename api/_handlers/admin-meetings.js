// REST API: /api/v1/admin/meetings
// Meeting Operations Control Center: Complete Meeting CRUD, Participant Roster,
// Attendance, RSVP, Recurrence, Calendar Generation, and Real-Time Telemetry.
// Strictly enforces ADMIN / Trainer authorization via JWT Bearer token.

import { meetingOpsService } from '../../server/meetings/meetingOpsService.ts';
import { tokenService } from '../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../server/observability/correlation.ts';
import { calendarService } from '../../server/calendar/calendarService.ts';
import { notificationWorker } from '../../server/notifications/notificationWorker.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Verify Bearer Token
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      createErrorResponse('Unauthorized', 'Authentication required. Bearer token missing.', 'MISSING_TOKEN', correlation.correlationId)
    );
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(
      createErrorResponse('Unauthorized', auth.error || 'Invalid or expired token.', auth.errorCode || 'UNAUTHORIZED', correlation.correlationId)
    );
  }

  const user = {
    id: auth.claims.userId,
    email: auth.claims.userEmail,
    name: auth.claims.userName,
    role: auth.claims.userRole,
  };

  // Strict RBAC: Admin only
  if (user.role !== 'admin') {
    return res.status(403).json(
      createErrorResponse('Forbidden', 'Only platform administrator (shashi) has rights.', 'FORBIDDEN', correlation.correlationId)
    );
  }

  const urlObj = new URL(req.url || '/', 'http://localhost');

  // 2. GET: List Meetings, Inspect Single Meeting, or Download ICS
  if (req.method === 'GET') {
    const meetingId = urlObj.searchParams.get('meetingId') || urlObj.searchParams.get('id');

    // Download ICS Calendar File
    if (meetingId && urlObj.searchParams.get('format') === 'ics') {
      const details = meetingOpsService.getMeetingDetails(meetingId);
      if (!details || !details.meeting) {
        return res.status(404).json(createErrorResponse('NotFound', 'Meeting not found.', 'NOT_FOUND', correlation.correlationId));
      }
      const ics = calendarService.generateICS(details.meeting, {
        organizerName: details.meeting.trainer_name,
        attendees: details.participants.map(p => ({ name: p.student_name, email: p.student_email })),
      });
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${details.meeting.id}.ics"`);
      return res.status(200).send(ics);
    }

    // Single Meeting Details with Roster, Audit Logs, and Notifications
    if (meetingId) {
      const details = meetingOpsService.getMeetingDetails(meetingId);
      if (!details) {
        return res.status(404).json(
          createErrorResponse('NotFound', `Meeting '${meetingId}' not found.`, 'MEETING_NOT_FOUND', correlation.correlationId)
        );
      }
      const googleCalUrl = details.meeting ? calendarService.getGoogleCalendarUrl(details.meeting) : null;
      return res.status(200).json({
        success: true,
        data: details,
        googleCalendarUrl: googleCalUrl,
        correlationId: correlation.correlationId,
      });
    }

    // Paginated & Filtered Meeting List
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);
    const status = urlObj.searchParams.get('status') || undefined;
    const batchId = urlObj.searchParams.get('batchId') || urlObj.searchParams.get('batch_id') || undefined;
    const trainerId = urlObj.searchParams.get('trainerId') || urlObj.searchParams.get('trainer_id') || undefined;
    const timeframe = (urlObj.searchParams.get('timeframe') || undefined);
    const search = urlObj.searchParams.get('search') || undefined;

    try {
      const result = meetingOpsService.listMeetings({
        page,
        limit,
        status,
        timeframe: timeframe,
        batch_id: batchId,
        trainer_id: trainerId,
        search,
      });

      const stats = meetingOpsService.getDashboardStats();

      return res.status(200).json({
        success: true,
        meetings: result.meetings,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        dashboardStats: stats,
        correlationId: correlation.correlationId,
      });
    } catch (err) {
      return res.status(500).json(
        createErrorResponse('InternalServerError', err.message || 'Failed to list meetings.', 'INTERNAL_ERROR', correlation.correlationId)
      );
    }
  }

  // 3. POST: Actions (Create, Update, Cancel, Assign, Attendance, Send Notification)
  if (req.method === 'POST') {
    const action = req.body?.action || (req.body?.targetStatus ? 'transition' : 'create');

    // Create Instant Meeting (Google Meet Style)
    if (action === 'instant' || action === 'create_instant') {
      const result = await meetingOpsService.createInstantMeeting(user, req.body);
      if (!result.success) {
        return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Failed to create instant meeting.', 'CREATE_FAILED', correlation.correlationId));
      }
      return res.status(201).json({
        success: true,
        meeting: result.meeting,
        meetingUrl: result.meetingUrl,
        correlationId: correlation.correlationId,
      });
    }

    // Create Meeting
    if (action === 'create') {
      const result = await meetingOpsService.createMeeting(user, req.body);
      if (!result.success) {
        return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Failed to create meeting.', 'CREATE_FAILED', correlation.correlationId));
      }
      return res.status(201).json({
        success: true,
        meeting: result.meeting,
        occurrences: result.occurrences,
        correlationId: correlation.correlationId,
      });
    }

    // Update Meeting
    if (action === 'update') {
      const { meetingId, updates } = req.body;
      if (!meetingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'INVALID_PARAMETERS', correlation.correlationId));
      }
      const result = await meetingOpsService.updateMeeting(user, meetingId, updates || req.body);
      if (!result.success) {
        return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Update failed.', 'UPDATE_FAILED', correlation.correlationId));
      }
      return res.status(200).json({ success: true, meeting: result.meeting, correlationId: correlation.correlationId });
    }

    // Cancel Meeting
    if (action === 'cancel') {
      const { meetingId, reason, scope } = req.body;
      if (!meetingId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'INVALID_PARAMETERS', correlation.correlationId));
      }
      const result = await meetingOpsService.cancelMeeting(user, meetingId, reason, scope);
      if (!result.success) {
        return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Cancellation failed.', 'CANCEL_FAILED', correlation.correlationId));
      }
      return res.status(200).json({ success: true, correlationId: correlation.correlationId });
    }

    // Assign Students
    if (action === 'assign_students') {
      const { meetingId, studentIds } = req.body;
      if (!meetingId || !Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId and studentIds array are required.', 'INVALID_PARAMETERS', correlation.correlationId));
      }
      const resAssign = await meetingOpsService.assignStudents(meetingId, studentIds, user.id);
      return res.status(200).json({ success: true, ...resAssign, correlationId: correlation.correlationId });
    }

    // Mark Attendance
    if (action === 'mark_attendance') {
      const { meetingId, studentId, attendanceStatus } = req.body;
      if (!meetingId || !studentId || !attendanceStatus) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId, studentId, and attendanceStatus are required.', 'INVALID_PARAMETERS', correlation.correlationId));
      }
      const resAtt = await meetingOpsService.markAttendance(user, meetingId, studentId, attendanceStatus);
      if (!resAtt.success) {
        return res.status(400).json(createErrorResponse('BadRequest', resAtt.error || 'Failed to mark attendance.', 'ATTENDANCE_FAILED', correlation.correlationId));
      }
      return res.status(200).json({ success: true, correlationId: correlation.correlationId });
    }

    // Send Notification Trigger
    if (action === 'send_notification') {
      const { meetingId, studentId, notificationType } = req.body;
      if (!meetingId || !studentId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'meetingId and studentId are required.', 'INVALID_PARAMETERS', correlation.correlationId));
      }
      const details = meetingOpsService.getMeetingDetails(meetingId);
      if (!details?.meeting) {
        return res.status(404).json(createErrorResponse('NotFound', 'Meeting not found.', 'NOT_FOUND', correlation.correlationId));
      }
      const sent = await notificationWorker.dispatchImmediateNotification(details.meeting, studentId, notificationType || 'REMINDER_30M');
      return res.status(200).json({ success: true, pushSent: sent, correlationId: correlation.correlationId });
    }

    // Duplicate Meeting
    if (action === 'duplicate') {
      const { meetingId } = req.body;
      const details = meetingOpsService.getMeetingDetails(meetingId);
      if (!details?.meeting) {
        return res.status(404).json(createErrorResponse('NotFound', 'Meeting not found.', 'NOT_FOUND', correlation.correlationId));
      }
      const now = new Date();
      const newStart = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      const newEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

      const dupResult = await meetingOpsService.createMeeting(user, {
        title: `${details.meeting.title} (Copy)`,
        description: details.meeting.description,
        meeting_type: details.meeting.meeting_type,
        meeting_provider: details.meeting.meeting_provider,
        meeting_url: details.meeting.meeting_url,
        start_at: newStart,
        end_at: newEnd,
        timezone: details.meeting.timezone,
        trainer_id: details.meeting.trainer_id,
        trainer_name: details.meeting.trainer_name,
        batch_id: details.meeting.batch_id,
        capacity: details.meeting.capacity,
        student_ids: details.participants.map(p => p.student_id),
      });

      return res.status(201).json({ success: true, meeting: dupResult.meeting, correlationId: correlation.correlationId });
    }

    // Default Legacy Transition
    const { meetingId, targetStatus, reason } = req.body || {};
    if (meetingId && targetStatus) {
      const updates = { status: targetStatus };
      const updRes = await meetingOpsService.updateMeeting(user, meetingId, updates);
      return res.status(updRes.success ? 200 : 400).json({ ...updRes, correlationId: correlation.correlationId });
    }

    return res.status(400).json(createErrorResponse('BadRequest', 'Unknown action or invalid parameters.', 'BAD_REQUEST', correlation.correlationId));
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED', correlation.correlationId));
}
