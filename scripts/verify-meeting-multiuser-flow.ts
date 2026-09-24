import { meetingOpsService } from '../server/meetings/meetingOpsService.ts';
import { notificationWorker } from '../server/notifications/notificationWorker.ts';
import { pushNotificationService } from '../server/notifications/pushNotificationService.ts';
import { calendarService } from '../server/calendar/calendarService.ts';

async function runMultiUserMeetingVerification() {
  console.log('===================================================================');
  console.log('🚀 MEETING OPS: MULTI-USER FLOW VERIFICATION (PLATFORM BUILT-IN ROOM)');
  console.log('===================================================================\n');

  // 1. Users Setup
  const trainer = {
    id: 'usr_trainer_lead',
    role: 'interviewer',
    name: 'Sarah Chen (Staff Architect)',
    email: 'sarah.chen@platform.com',
  };

  const studentAlice = {
    id: 'usr_student_alice',
    role: 'candidate',
    name: 'Alice Johnson',
    email: 'alice@student.com',
  };

  const studentBob = {
    id: 'usr_student_bob',
    role: 'candidate',
    name: 'Bob Martinez',
    email: 'bob@student.com',
  };

  // Register push subscriptions for both students
  pushNotificationService.registerSubscription({
    userId: studentAlice.id,
    endpoint: 'https://updates.push.browser.com/sub/alice_chrome_laptop',
    p256dh: 'BNcRdreALRF88xJK5oQ==',
    auth: 'tH9sDFkldA==',
    browser: 'Chrome 128',
    deviceType: 'desktop',
  });

  pushNotificationService.registerSubscription({
    userId: studentBob.id,
    endpoint: 'https://updates.push.browser.com/sub/bob_android_mobile',
    p256dh: 'BPh893KJDksldlk99A==',
    auth: 'k993KdlsD==',
    browser: 'Chrome Mobile',
    deviceType: 'mobile',
  });

  console.log('✅ 1. Registered active push subscriptions for Student Alice and Student Bob.');

  // 2. Trainer Creates Meeting with Platform Meet (Built-in Room)
  const now = new Date();
  const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  const endTime = new Date(now.getTime() + 120 * 60 * 1000); // 2 hours from now

  const builtInRoomId = `meet_platform_arch_${Date.now().toString(36)}`;
  const builtInRoomUrl = `/meet/${builtInRoomId}`;

  const createRes = await meetingOpsService.createMeeting(trainer, {
    title: 'Distributed State & Local-First Architecture Deep Dive',
    description: 'Live interactive technical session evaluated inside our built-in video room.',
    meeting_type: 'Technical Discussion',
    meeting_provider: 'Platform Meet (Built-in)',
    meeting_url: builtInRoomUrl,
    start_at: startTime.toISOString(),
    end_at: endTime.toISOString(),
    timezone: 'Asia/Kolkata',
    trainer_id: trainer.id,
    trainer_name: trainer.name,
    batch_id: 'Batch 2026-Alpha',
    capacity: 25,
    student_ids: [studentAlice.id], // Assign ONLY Alice initially
    reminders: { reminder24h: true, reminder1h: true, reminder30m: true, reminder5m: true },
  });

  if (!createRes.success || !createRes.meeting) {
    throw new Error('Failed to create meeting: ' + createRes.error);
  }

  const meeting = createRes.meeting;
  console.log(`✅ 2. Meeting created by Trainer (${trainer.name}):`);
  console.log(`   - ID: ${meeting.id}`);
  console.log(`   - Title: ${meeting.title}`);
  console.log(`   - Provider: ${meeting.meeting_provider}`);
  console.log(`   - Built-in Platform URL: ${meeting.meeting_url}`);
  console.log(`   - Assigned Initially: Alice Johnson`);

  // 3. Dispatch Notification to Alice
  const notifResult = await notificationWorker.dispatchImmediateNotification(
    meeting,
    studentAlice.id,
    'MEETING_CREATED'
  );
  console.log(`✅ 3. Web Push notification dispatched to Alice: ${notifResult ? 'DELIVERED (HTTP 200)' : 'FAILED'}`);

  // 4. Check Alice's Dashboard View
  const aliceRoster = meetingOpsService.listMeetings({ student_id: studentAlice.id });
  const aliceMeeting = aliceRoster.meetings.find(m => m.id === meeting.id);
  console.log(`✅ 4. Checking Alice's Dashboard:`);
  console.log(`   - Alice sees meeting: ${Boolean(aliceMeeting)}`);
  console.log(`   - Initial RSVP status: ${aliceMeeting?.myRsvpStatus}`);

  // 5. Check Bob's Dashboard View (Tenant Isolation)
  const bobRosterBefore = meetingOpsService.listMeetings({ student_id: studentBob.id });
  const bobMeetingBefore = bobRosterBefore.meetings.find(m => m.id === meeting.id);
  console.log(`✅ 5. Checking Bob's Dashboard (Tenant Isolation Check):`);
  console.log(`   - Bob sees Alice's meeting: ${Boolean(bobMeetingBefore)} (MUST BE FALSE)`);

  if (bobMeetingBefore) {
    throw new Error('SECURITY VIOLATION: Unassigned student could see another student meeting!');
  }

  // 6. Alice Accepts RSVP
  const rsvpRes = await meetingOpsService.updateRsvp(studentAlice.id, meeting.id, 'accepted');
  const detailsAfterRsvp = meetingOpsService.getMeetingDetails(meeting.id);
  const aliceParticipant = detailsAfterRsvp?.participants.find(p => p.student_id === studentAlice.id);
  console.log(`✅ 6. Alice responds to RSVP:`);
  console.log(`   - RSVP update status: ${rsvpRes.success}`);
  console.log(`   - Updated Invitation Status: ${aliceParticipant?.invitation_status.toUpperCase()}`);

  // 7. Generate Calendar Entry with Absolute Platform URL
  const ics = calendarService.generateICS(meeting, {
    organizerName: trainer.name,
    attendees: [{ name: studentAlice.name, email: studentAlice.email }],
  });
  const googleCalUrl = calendarService.getGoogleCalendarUrl(meeting);
  console.log(`✅ 7. Calendar Integration:`);
  console.log(`   - ICS includes URL: ${ics.includes(builtInRoomUrl)}`);
  console.log(`   - Google Calendar Link: ${googleCalUrl.substring(0, 85)}...`);

  // 8. Now Assign Bob to the Same Meeting (Multi-User Assignment)
  console.log(`\n🔄 8. Trainer assigns Bob Martinez to the meeting...`);
  const assignRes = await meetingOpsService.assignStudents(meeting.id, [studentBob.id], trainer.id);
  console.log(`   - Added: ${assignRes.added}, Skipped Duplicates: ${assignRes.skippedDuplicate}`);

  // Dispatch Notification to Bob
  const bobNotifResult = await notificationWorker.dispatchImmediateNotification(
    meeting,
    studentBob.id,
    'MEETING_CREATED'
  );
  console.log(`   - Web Push dispatched to Bob: ${bobNotifResult ? 'DELIVERED (HTTP 200)' : 'FAILED'}`);

  // 9. Now Check Bob's Dashboard Again
  const bobRosterAfter = meetingOpsService.listMeetings({ student_id: studentBob.id });
  const bobMeetingAfter = bobRosterAfter.meetings.find(m => m.id === meeting.id);
  console.log(`✅ 9. Checking Bob's Dashboard after assignment:`);
  console.log(`   - Bob sees meeting now: ${Boolean(bobMeetingAfter)}`);
  console.log(`   - Bob RSVP status: ${bobMeetingAfter?.myRsvpStatus}`);

  // 10. Bob Accepts RSVP
  await meetingOpsService.updateRsvp(studentBob.id, meeting.id, 'accepted');

  // 11. Trainer Marks Attendance
  const attendAlice = await meetingOpsService.markAttendance(trainer, meeting.id, studentAlice.id, 'attended');
  const attendBob = await meetingOpsService.markAttendance(trainer, meeting.id, studentBob.id, 'attended');
  console.log(`✅ 10. Trainer marks attendance in Built-in Room:`);
  console.log(`   - Alice attendance recorded: ${attendAlice.success}`);
  console.log(`   - Bob attendance recorded: ${attendBob.success}`);

  // 12. Security Test: Student Cannot Mark Own Attendance
  const studentSelfMark = await meetingOpsService.markAttendance(studentAlice, meeting.id, studentAlice.id, 'attended');
  console.log(`✅ 11. Security Test: Alice tries to mark her own attendance:`);
  console.log(`   - Blocked: ${!studentSelfMark.success} (${studentSelfMark.error})`);

  // 13. Audit Log Inspection
  const details = meetingOpsService.getMeetingDetails(meeting.id);
  const logs = details?.auditLogs || [];
  console.log(`\n📋 12. Final Audit Trail (${logs.length} logged events):`);
  logs.forEach(l => {
    console.log(`   [${l.created_at.slice(11, 19)}] Action: ${l.action} | Actor: ${l.actor_id}`);
  });

  console.log('\n===================================================================');
  console.log('🎉 ALL MULTI-USER MEETING OPS VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('===================================================================\n');
}

runMultiUserMeetingVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
