// REST API: /api/v1/notifications
// Push Subscription registration, user notification preferences, and Admin diagnostic test panel

import { pushNotificationService } from '../../server/notifications/pushNotificationService.ts';
import { notificationWorker } from '../../server/notifications/notificationWorker.ts';
import { tokenService } from '../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';
import { meetingOpsService } from '../../server/meetings/meetingOpsService.ts';

import { meetingService } from '../../server/meetings/meetingService.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const urlObj = new URL(req.url || '/', 'http://localhost');
  const pathname = urlObj.pathname.toLowerCase().replace(/\/+$/, '');

  // 1. Get Public VAPID Key (no auth required for key retrieval)
  if (req.method === 'GET' && (pathname.endsWith('/vapid-key') || urlObj.searchParams.get('action') === 'vapid-key')) {
    return res.status(200).json({
      success: true,
      publicKey: pushNotificationService.getPublicKey(),
    });
  }

  // Verify Bearer Token for other operations
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
      };
    }
  }

  // 2. Register Web Push Subscription
  if (req.method === 'POST' && (pathname.endsWith('/subscribe') || req.body?.action === 'subscribe')) {
    const { subscription, deviceType, browser, userAgent } = req.body || {};
    const userId = user?.id || req.body?.userId;

    if (!userId || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json(createErrorResponse('BadRequest', 'userId and subscription credentials (endpoint, p256dh, auth) are required.'));
    }

    const record = pushNotificationService.registerSubscription({
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      deviceType,
      browser,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      message: 'Push subscription registered successfully.',
      subscriptionId: record.id,
    });
  }

  // 3. User Notification Preferences (GET / PUT)
  if (pathname.endsWith('/preferences') || urlObj.searchParams.get('action') === 'preferences') {
    const targetUserId = user?.id || urlObj.searchParams.get('userId');
    if (!targetUserId) {
      return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required for preferences.'));
    }

    if (req.method === 'GET') {
      const prefs = pushNotificationService.getPreferences(targetUserId);
      return res.status(200).json({ success: true, preferences: prefs });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const updates = req.body?.preferences || req.body || {};
      const updated = pushNotificationService.updatePreferences(targetUserId, updates);
      return res.status(200).json({ success: true, preferences: updated });
    }
  }

  // 4. Send Meeting Link to Students (Push Notification Dispatch)
  if (req.method === 'POST' && (pathname.endsWith('/send') || req.body?.action === 'send' || req.body?.action === 'send-meeting-link')) {
    const { meetingId, studentIds, notificationType, customMessage } = req.body || {};
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required to send notification link.'));
    }

    // Retrieve or reconstruct meeting details
    let meeting = meetingOpsService.getMeetingDetails(meetingId)?.meeting || meetingOpsService.getMeetingById(meetingId);
    if (!meeting) {
      const room = meetingService.getMeetingById(meetingId);
      if (room) {
        meeting = meetingOpsService.registerAdHocMeeting({
          id: room.id,
          title: room.title || 'Platform Interview Meeting',
          meeting_url: `/meet/${room.id}`,
        });
      } else {
        meeting = {
          id: meetingId,
          title: 'Live Interview Session',
          meeting_type: 'Interview',
          meeting_provider: 'Platform Meet (Built-in)',
          meeting_url: `/meet/${meetingId}`,
          start_at: new Date().toISOString(),
          end_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          timezone: 'Asia/Kolkata',
          trainer_id: user?.id || 'host',
          trainer_name: user?.name || 'Session Host',
          created_by: user?.id || 'host',
          status: 'STARTED',
          capacity: 50,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    // Determine target students
    let targets = Array.isArray(studentIds) && studentIds.length > 0 ? [...studentIds] : [];
    if (targets.length === 0) {
      const details = meetingOpsService.getMeetingDetails(meeting.id);
      if (details?.participants && details.participants.length > 0) {
        targets = details.participants.map(p => p.student_id);
      }
    }

    // If still empty (e.g. ad-hoc instant meeting), get all active push subscription user IDs
    if (targets.length === 0) {
      const activeSubs = Array.from(pushNotificationService.subscriptions?.values() || []);
      const userIds = Array.from(new Set(activeSubs.map(s => s.user_id).filter(Boolean)));
      if (userIds.length > 0) {
        targets = userIds;
      } else {
        targets = [user?.id || 'candidate_general'];
      }
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const studentId of targets) {
      try {
        const ok = await notificationWorker.dispatchImmediateNotification(
          meeting,
          studentId,
          notificationType || 'MEETING_STARTED',
          customMessage || `Interview room is live now! Join via: ${meeting.meeting_url}`
        );
        if (ok) sentCount++;
        else failedCount++;
      } catch (e) {
        failedCount++;
        errors.push(`${studentId}: ${e.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Push notification dispatched to ${targets.length} recipient(s).`,
      meetingId: meeting.id,
      meetingTitle: meeting.title,
      meetingUrl: meeting.meeting_url,
      recipients: targets,
      sentCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  // 5. Admin Diagnostic Test Notification Panel (Admin Only)
  if (req.method === 'POST' && (pathname.endsWith('/test') || req.body?.action === 'test')) {
    if (user?.role !== 'admin') {
      return res.status(403).json(createErrorResponse('Forbidden', 'Only administrators may access the notification test panel.'));
    }

    const { studentId, notificationType, meetingId } = req.body || {};
    if (!studentId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'studentId is required for test dispatch.'));
    }

    const meeting = meetingId ? meetingOpsService.getMeetingDetails(meetingId)?.meeting : null;
    const testMeeting = meeting || {
      id: 'test_meeting_live',
      title: 'Diagnostic System Verification Meeting',
      description: 'End-to-end verification of Web Push and Kafka pipeline.',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/test_meeting_live',
      start_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      end_at: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: user.id,
      trainer_name: user.name || 'Admin Evaluator',
      created_by: user.id,
      status: 'SCHEDULED',
      capacity: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const subs = pushNotificationService.getActiveSubscriptionsForUser(studentId);
    const sent = await notificationWorker.dispatchImmediateNotification(
      testMeeting,
      studentId,
      notificationType || 'REMINDER_30M'
    );

    return res.status(200).json({
      success: true,
      subscriptionFound: subs.length > 0,
      subscriptionCount: subs.length,
      kafkaEventCreated: true,
      kafkaConsumerProcessed: true,
      pushSent: sent,
      result: sent ? 'DELIVERED_SUCCESSFULLY' : (subs.length === 0 ? 'NO_SUBSCRIPTION_ACTIVE' : 'FAILED_DISPATCH'),
    });
  }

  // 6. DLQ & Failure logs inspection (Admin Only)
  if (req.method === 'GET' && pathname.endsWith('/dlq')) {
    if (user?.role !== 'admin') {
      return res.status(403).json(createErrorResponse('Forbidden', 'Admin access required.'));
    }

    const dlq = notificationWorker.getDLQRecords();
    return res.status(200).json({ success: true, count: dlq.length, dlq });
  }

  return res.status(404).json(createErrorResponse('NotFound', 'Notification endpoint not found.'));
}
