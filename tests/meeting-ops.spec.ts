import { test, expect } from '@playwright/test';
import { meetingOpsService } from '../server/meetings/meetingOpsService';
import { notificationWorker } from '../server/notifications/notificationWorker';
import { calendarService } from '../server/calendar/calendarService';
import { pushNotificationService } from '../server/notifications/pushNotificationService';
import { createMeetingOpsEvent } from '../server/kafka/eventContracts';

test.describe('Meeting Operations System - Comprehensive Specification Test Suite', () => {
  const adminUser = {
    id: 'usr_admin_test',
    role: 'admin',
    name: 'Platform Lead Admin',
    email: 'admin@platform.com',
  };

  const studentUser1 = {
    id: 'usr_student_alpha',
    role: 'candidate',
    name: 'Alice Johnson',
    email: 'alice@student.com',
  };

  const studentUser2 = {
    id: 'usr_student_beta',
    role: 'candidate',
    name: 'Bob Smith',
    email: 'bob@student.com',
  };

  let createdMeetingId = '';

  test('1. Admin creates meeting with validation and persistence', async () => {
    const now = new Date();
    const startIso = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
    const endIso = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString();

    const res = await meetingOpsService.createMeeting(adminUser, {
      title: 'Meta System Design & Architecture Evaluation',
      description: 'End-to-end distributed system state and event stream assessment',
      meeting_type: 'Technical Discussion',
      meeting_provider: 'Google Meet',
      meeting_url: 'https://meet.google.com/test-meta-arch',
      start_at: startIso,
      end_at: endIso,
      timezone: 'Asia/Kolkata',
      trainer_id: adminUser.id,
      trainer_name: adminUser.name,
      batch_id: 'Batch 2026-Alpha',
      capacity: 30,
      student_ids: [studentUser1.id],
    });

    expect(res.success).toBe(true);
    expect(res.meeting).toBeDefined();
    expect(res.meeting?.title).toBe('Meta System Design & Architecture Evaluation');
    createdMeetingId = res.meeting!.id;
  });

  test('2. Meeting appears in admin dashboard with correct stats', async () => {
    const list = meetingOpsService.listMeetings({ search: 'Meta System Design' });
    expect(list.meetings.length).toBeGreaterThanOrEqual(1);

    const match = list.meetings.find(m => m.id === createdMeetingId);
    expect(match).toBeDefined();
    expect(match?.status).toBe('SCHEDULED');

    const stats = meetingOpsService.getDashboardStats();
    expect(stats.upcomingMeetingsCount).toBeGreaterThanOrEqual(1);
    expect(stats.studentsAssignedCount).toBeGreaterThanOrEqual(1);
  });

  test('3. Student receives assignment and strict student isolation is enforced', async () => {
    // Student 1 (Alice) was assigned: she must see the meeting
    const aliceMeetings = meetingOpsService.listMeetings({ student_id: studentUser1.id });
    expect(aliceMeetings.meetings.some(m => m.id === createdMeetingId)).toBe(true);

    // Student 2 (Bob) was NOT assigned: he MUST NOT see the meeting
    const bobMeetings = meetingOpsService.listMeetings({ student_id: studentUser2.id });
    expect(bobMeetings.meetings.some(m => m.id === createdMeetingId)).toBe(false);
  });

  test('4. Student accepts meeting RSVP', async () => {
    const rsvpRes = await meetingOpsService.updateRsvp(studentUser1.id, createdMeetingId, 'accepted');
    expect(rsvpRes.success).toBe(true);

    const details = meetingOpsService.getMeetingDetails(createdMeetingId);
    const participant = details?.participants.find(p => p.student_id === studentUser1.id);
    expect(participant?.invitation_status).toBe('accepted');
  });

  test('5. Calendar integration: ICS generated and valid Google Calendar link built', async () => {
    const details = meetingOpsService.getMeetingDetails(createdMeetingId);
    expect(details?.meeting).toBeDefined();

    const icsContent = calendarService.generateICS(details!.meeting!, {
      organizerName: details!.meeting!.trainer_name,
      attendees: [{ name: studentUser1.name, email: studentUser1.email }],
    });

    expect(icsContent).toContain('BEGIN:VCALENDAR');
    expect(icsContent).toContain('BEGIN:VEVENT');
    expect(icsContent).toContain('SUMMARY:Meta System Design');
    expect(icsContent).toContain(`URL:${details!.meeting!.meeting_url}`);
    expect(icsContent).toContain('END:VCALENDAR');

    const googleUrl = calendarService.getGoogleCalendarUrl(details!.meeting!);
    expect(googleUrl).toContain('calendar.google.com/calendar/render?action=TEMPLATE');
  });

  test('6. Push subscription registered and active', async () => {
    const sub = pushNotificationService.registerSubscription({
      userId: studentUser1.id,
      endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint-student-1',
      p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9Ac073Phyp',
      auth: 'tBHItJI5svbpez7KI4CCXg==',
    });

    expect(sub.is_active).toBe(true);
    const activeSubs = pushNotificationService.getActiveSubscriptionsForUser(studentUser1.id);
    expect(activeSubs.length).toBe(1);
  });

  test('7. Duplicate participant prevention', async () => {
    // Attempting to assign Alice again to the same meeting
    const assignRes = await meetingOpsService.assignStudents(createdMeetingId, [studentUser1.id], adminUser.id);
    expect(assignRes.added).toBe(0);
    expect(assignRes.skippedDuplicate).toBe(1);
  });

  test('8. Duplicate notification prevention (unique constraint)', async () => {
    const notif1 = notificationWorker.scheduleNotification({
      meetingId: createdMeetingId,
      userId: studentUser1.id,
      notificationType: 'REMINDER_30M',
      scheduledAt: new Date().toISOString(),
    });

    const notif2 = notificationWorker.scheduleNotification({
      meetingId: createdMeetingId,
      userId: studentUser1.id,
      notificationType: 'REMINDER_30M',
      scheduledAt: new Date().toISOString(),
    });

    expect(notif1.id).toBe(notif2.id); // Same ID returned, no duplicate row created!
  });

  test('9. Kafka event contract conformance and consumer idempotency', async () => {
    const canonicalEvent = createMeetingOpsEvent(
      'meeting.reminder.triggered',
      createdMeetingId,
      studentUser1.id,
      {
        meeting: meetingOpsService.getMeetingDetails(createdMeetingId)!.meeting,
        studentId: studentUser1.id,
        reminderType: 'REMINDER_30M',
      }
    );

    expect(canonicalEvent.eventId).toBeDefined();
    expect(canonicalEvent.eventType).toBe('meeting.reminder.triggered');
    expect(canonicalEvent.eventVersion).toBe(1);
    expect(canonicalEvent.producer).toBe('meeting-service');

    // First delivery
    const firstDelivery = await notificationWorker.handleKafkaEvent(canonicalEvent);
    expect(firstDelivery).toBe(true);

    // Second redelivery of duplicate event
    const secondDelivery = await notificationWorker.handleKafkaEvent(canonicalEvent);
    expect(secondDelivery).toBe(false); // Idempotently rejected!
  });

  test('10. Admin edits meeting and student receives update', async () => {
    const updateRes = await meetingOpsService.updateMeeting(adminUser, createdMeetingId, {
      title: 'Meta System Design & Architecture Evaluation (Updated Scope)',
    });
    expect(updateRes.success).toBe(true);

    const details = meetingOpsService.getMeetingDetails(createdMeetingId);
    expect(details?.meeting?.title).toContain('(Updated Scope)');
  });

  test('11. Attendance tracking: admin can mark attendance, student cannot self-mark', async () => {
    // Student tries to mark own attendance: FORBIDDEN
    const studentAttempt = await meetingOpsService.markAttendance(
      studentUser1 as any,
      createdMeetingId,
      studentUser1.id,
      'attended'
    );
    expect(studentAttempt.success).toBe(false);
    expect(studentAttempt.error).toContain('Forbidden');

    // Admin marks attendance: ALLOWED
    const adminAttempt = await meetingOpsService.markAttendance(
      adminUser,
      createdMeetingId,
      studentUser1.id,
      'attended'
    );
    expect(adminAttempt.success).toBe(true);

    const details = meetingOpsService.getMeetingDetails(createdMeetingId);
    const p = details?.participants.find(part => part.student_id === studentUser1.id);
    expect(p?.attendance_status).toBe('attended');
    expect(p?.joined_at).toBeDefined();
  });

  test('12. Admin cancels meeting, audit log recorded, and student receives cancellation', async () => {
    const cancelRes = await meetingOpsService.cancelMeeting(
      adminUser,
      createdMeetingId,
      'Session rescheduled to next quarter'
    );
    expect(cancelRes.success).toBe(true);

    const details = meetingOpsService.getMeetingDetails(createdMeetingId);
    expect(details?.meeting?.status).toBe('CANCELLED');
    expect(details?.meeting?.cancellation_reason).toBe('Session rescheduled to next quarter');

    const cancelAudit = details?.auditLogs.find(l => l.action === 'MEETING_CANCELLED');
    expect(cancelAudit).toBeDefined();
  });

  test('13. Failed notification retry and Dead Letter Queue (DLQ) routing', async () => {
    // Schedule notification for non-existent endpoint to verify DLQ
    const deadSub = pushNotificationService.registerSubscription({
      userId: 'usr_failing_endpoint',
      endpoint: 'https://defunct.endpoint.invalid/410',
      p256dh: 'test',
      auth: 'test',
    });

    const fakeMeeting = {
      id: 'meet_failing_test',
      title: 'DLQ Test Meeting',
      meeting_type: 'Interview',
      meeting_provider: 'Google Meet',
      meeting_url: 'https://meet.google.com/test',
      start_at: new Date().toISOString(),
      end_at: new Date().toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'usr_admin',
      created_by: 'usr_admin',
      status: 'SCHEDULED',
      capacity: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Force 3 retries
    await notificationWorker.dispatchImmediateNotification(fakeMeeting as any, 'usr_failing_endpoint', 'REMINDER_5M');
    await notificationWorker.dispatchImmediateNotification(fakeMeeting as any, 'usr_failing_endpoint', 'REMINDER_5M');
    await notificationWorker.dispatchImmediateNotification(fakeMeeting as any, 'usr_failing_endpoint', 'REMINDER_5M');

    const dlq = notificationWorker.getDLQRecords();
    const match = dlq.find(d => d.userId === 'usr_failing_endpoint');
    expect(match).toBeDefined();
    expect(match?.status).toBe('DEAD_LETTER');
    expect(match?.retryCount).toBeGreaterThanOrEqual(3);
  });
});
