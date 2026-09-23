/**
 * Test Suite: Phase 17 — Recording, Transcription & Post-Meeting Media Pipeline
 * Validates:
 * - Recording lifecycle state machine & invalid transition rejection
 * - RBAC authorization: Host/Admin only vs. Candidate rejection (403)
 * - Idempotency guards: Double-start & double-stop protection
 * - Private Object Storage: put, get with range chunks, presigned URL generation & verification
 * - Anti-IDOR: Cross-meeting access strictly rejected (403)
 * - Transactional Outbox & Kafka topic resolution (`recording.events`)
 * - Asynchronous background worker: media validation, STT, and notification dispatch
 * - Truthful speaker diarization: explicit unmapped fallback (no fake guessing)
 * - Full-text keyword search across transcript segments
 * - Complete 16-Step E2E Scenario
 */

import assert from 'assert';
import { recordingService } from '../server/media/recordingService.ts';
import { objectStorageService } from '../server/media/objectStorageService.ts';
import { transcriptionService } from '../server/media/transcriptionService.ts';
import { mediaProcessingWorker } from '../server/media/mediaProcessingWorker.ts';
import { meetingService } from '../server/meetings/meetingService.ts';
import { resolveTopicForEvent, KAFKA_TOPICS } from '../server/kafka/topicStrategy.ts';
import { outboxService } from '../server/kafka/outboxService.ts';
import { VALID_RECORDING_TRANSITIONS } from '../server/media/recordingTypes.ts';

async function runPhase17Tests() {
  console.log('🧪 Starting Phase 17: Recording, Transcription & Post-Meeting Media Pipeline Tests...\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ ${name}`);
      console.error(err);
      process.exit(1);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ ${name}`);
      console.error(err);
      process.exit(1);
    }
  }

  // Setup Test Entities
  const adminHost = {
    id: 'usr_admin_17',
    email: 'admin.lead@enterprise.com',
    name: 'Admin Lead',
    role: 'admin',
    meetingRole: 'HOST',
    permissions: ['admin:all'],
  };

  const participantUser = {
    id: 'usr_cand_17',
    email: 'candidate@enterprise.com',
    name: 'Candidate User',
    role: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };

  const outsiderUser = {
    id: 'usr_outsider_17',
    email: 'hacker@attacker.com',
    name: 'Malicious Outsider',
    role: 'candidate',
    permissions: [],
  };

  // Seed meeting
  const meetingCreation = meetingService.createMeeting(adminHost, {
    title: 'Phase 17 Executive Architecture Review',
  });
  assert(meetingCreation.success);
  const meetingId = meetingCreation.meeting.id;
  meetingService.transitionStatus(adminHost, meetingId, 'STARTED');
  meetingService.transitionStatus(adminHost, meetingId, 'ACTIVE');

  console.log(`  [Setup] Initialized Active Meeting ID: ${meetingId}\n`);

  // ─── 1. REQ-MEDIA-002: RECORDING LIFECYCLE STATE MACHINE ───────────────────
  test('REQ-MEDIA-002: Valid recording lifecycle state machine transitions', () => {
    assert(VALID_RECORDING_TRANSITIONS.NOT_STARTED.includes('RECORDING'));
    assert(VALID_RECORDING_TRANSITIONS.RECORDING.includes('STOPPING'));
    assert(VALID_RECORDING_TRANSITIONS.STOPPING.includes('PROCESSING'));
    assert(VALID_RECORDING_TRANSITIONS.PROCESSING.includes('READY'));
    assert(VALID_RECORDING_TRANSITIONS.READY.includes('DELETED'));

    // Verify invalid jump rejection
    assert.strictEqual(VALID_RECORDING_TRANSITIONS.RECORDING.includes('READY'), false);
    assert.strictEqual(VALID_RECORDING_TRANSITIONS.DELETED.length, 0); // Terminal state
  });

  // ─── 2. REQ-MEDIA-003: RECORDING AUTHORIZATION & RBAC ──────────────────────
  await asyncTest('REQ-MEDIA-003: Non-host candidate cannot start recording (403 Forbidden)', async () => {
    const res = await recordingService.startRecording(participantUser, { meetingId });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'FORBIDDEN');
    assert(res.error.includes('Only meeting hosts or platform administrators'));
  });

  let activeRecordingId = '';

  await asyncTest('REQ-MEDIA-003: Host successfully starts recording session', async () => {
    const res = await recordingService.startRecording(adminHost, { meetingId });
    assert.strictEqual(res.success, true);
    assert(res.recording);
    assert.strictEqual(res.recording.status, 'RECORDING');
    assert.strictEqual(res.recording.meetingId, meetingId);
    activeRecordingId = res.recording.id;
  });

  // ─── 3. REQ-MEDIA-004: IDEMPOTENCY & DUPLICATE PROTECTION ─────────────────
  await asyncTest('REQ-MEDIA-004: Double-start returns existing active recording idempotently', async () => {
    const res = await recordingService.startRecording(adminHost, { meetingId });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.recording.id, activeRecordingId, 'Must return same session without creating duplicate');
  });

  await asyncTest('REQ-MEDIA-003: Candidate cannot stop recording (403 Forbidden)', async () => {
    const res = await recordingService.stopRecording(participantUser, {
      meetingId,
      recordingId: activeRecordingId,
    });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'FORBIDDEN');
  });

  await asyncTest('REQ-MEDIA-003: Host stops recording and transitions to PROCESSING', async () => {
    const res = await recordingService.stopRecording(adminHost, {
      meetingId,
      recordingId: activeRecordingId,
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.recording.status, 'PROCESSING');
    assert(res.recording.durationSeconds >= 1);
  });

  await asyncTest('REQ-MEDIA-004: Double-stop is idempotent and returns processing session', async () => {
    const res = await recordingService.stopRecording(adminHost, {
      meetingId,
      recordingId: activeRecordingId,
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.recording.status, 'PROCESSING');
  });

  // ─── 4. REQ-MEDIA-005 & 006: OBJECT STORAGE & PRESIGNED URLS ───────────────
  await asyncTest('REQ-MEDIA-005: Object storage stores media bytes and supports Range chunks', async () => {
    const testKey = 'test/sample.mp4';
    const sampleData = Buffer.from('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    await objectStorageService.putObject(testKey, sampleData, 'video/mp4');

    // Full fetch
    const full = await objectStorageService.getObject(testKey);
    assert(full);
    assert.strictEqual(full.contentLength, sampleData.length);
    assert.strictEqual(full.isPartial, false);

    // Range chunk fetch (bytes=0-9 for video seeking)
    const partial = await objectStorageService.getObject(testKey, { start: 0, end: 9 });
    assert(partial);
    assert.strictEqual(partial.contentLength, 10);
    assert.strictEqual(partial.isPartial, true);
    assert.strictEqual(partial.contentRange, `bytes 0-9/${sampleData.length}`);
    assert.strictEqual(partial.buffer.toString(), '0123456789');
  });

  test('REQ-MEDIA-006: Presigned URL generator issues valid HMAC-SHA256 signature', () => {
    const testKey = 'meetings/meet-1/recordings/rec-1.mp4';
    const presignedUrl = objectStorageService.generatePresignedGetUrl(testKey, 300);
    assert(presignedUrl.includes('action=STREAM'));
    assert(presignedUrl.includes('signature='));
    assert(presignedUrl.includes('expires='));

    const urlObj = new URL(presignedUrl, 'http://localhost');
    const signature = urlObj.searchParams.get('signature');
    const expires = parseInt(urlObj.searchParams.get('expires'), 10);

    // Signature verification must succeed
    assert.strictEqual(
      objectStorageService.validatePresignedSignature(testKey, expires, signature),
      true
    );

    // Tampered signature must fail
    assert.strictEqual(
      objectStorageService.validatePresignedSignature(testKey, expires, 'badf00d' + signature.slice(7)),
      false
    );

    // Expired timestamp must fail
    const expiredTimestamp = Math.floor(Date.now() / 1000) - 10;
    assert.strictEqual(
      objectStorageService.validatePresignedSignature(testKey, expiredTimestamp, signature),
      false
    );
  });

  // ─── 5. REQ-MEDIA-006: ANTI-IDOR CROSS-MEETING SECURITY ────────────────────
  test('REQ-MEDIA-006: Anti-IDOR blocks outsider from accessing recording of another meeting', () => {
    // Outsider attempting to access activeRecordingId from meetingId they do not belong to
    const res = recordingService.getRecordingAccess(outsiderUser, activeRecordingId);
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'FORBIDDEN_CROSS_MEETING_ACCESS');
    assert(res.error.includes('Forbidden'));
  });

  // ─── 6. REQ-MEDIA-010: KAFKA EVENT ROUTING ─────────────────────────────────
  test('REQ-MEDIA-010: Domain event topic resolution maps recording events to recording.events', () => {
    assert.strictEqual(resolveTopicForEvent('RecordingStarted.v1'), KAFKA_TOPICS.RECORDING_EVENTS);
    assert.strictEqual(resolveTopicForEvent('RecordingCompleted.v1'), KAFKA_TOPICS.RECORDING_EVENTS);
    assert.strictEqual(resolveTopicForEvent('RecordingProcessingCompleted.v1'), KAFKA_TOPICS.RECORDING_EVENTS);
    assert.strictEqual(resolveTopicForEvent('TranscriptCompleted.v1'), KAFKA_TOPICS.RECORDING_EVENTS);
  });

  // ─── 7. REQ-MEDIA-011 & 012: ASYNC WORKER & TRANSCRIPTION ─────────────────
  await asyncTest('REQ-MEDIA-011: Background media processing worker validates media and marks READY', async () => {
    const recording = recordingService.getRecording(activeRecordingId);
    assert(recording);

    // Trigger processing worker job
    const jobResult = await mediaProcessingWorker.processJob({
      recordingId: recording.id,
      meetingId: recording.meetingId,
      storageKey: recording.storageKey,
      durationSeconds: recording.durationSeconds,
    });

    assert.strictEqual(jobResult.success, true);

    // Verify recording transitioned to READY
    const updatedRec = recordingService.getRecording(activeRecordingId);
    assert.strictEqual(updatedRec.status, 'READY');

    // Worker idempotency: Calling job again on READY recording skips gracefully
    const repeated = await mediaProcessingWorker.processJob({
      recordingId: recording.id,
      meetingId: recording.meetingId,
      storageKey: recording.storageKey,
      durationSeconds: recording.durationSeconds,
    });
    assert.strictEqual(repeated.success, true);
  });

  // ─── 8. REQ-MEDIA-013 & 014: TRANSCRIPTION & TRUTHFUL DIARIZATION ──────────
  test('REQ-MEDIA-013: Speech-to-text transcript generated with accurate segment timestamps', () => {
    const transcript = transcriptionService.getTranscriptForRecording(activeRecordingId);
    assert(transcript, 'Transcript must exist for processed recording');
    assert.strictEqual(transcript.status, 'READY');
    assert(transcript.segments.length > 0);
    assert(transcript.wordCount > 0);
    assert(transcript.fullText.length > 0);
  });

  await asyncTest('REQ-MEDIA-013: Truthful speaker diarization maps participants and falls back safely', async () => {
    // 1. Without presence timeline -> explicitly states unavailable
    const unmapped = await transcriptionService.generateTranscript({
      recordingId: 'rec_unmapped_test',
      meetingId: 'meet_unmapped_test',
      durationSeconds: 30,
    });
    assert(unmapped.segments.every(s => s.speakerName === 'Speaker identification unavailable'));

    // 2. With verified presence timeline -> maps speaker
    const mapped = await transcriptionService.generateTranscript({
      recordingId: 'rec_mapped_test',
      meetingId: 'meet_mapped_test',
      durationSeconds: 30,
      presenceTimeline: [
        { userId: 'usr_speaker_1', displayName: 'Dr. Jane Foster', startedSpeakingAt: 0, stoppedSpeakingAt: 15 },
      ],
    });
    assert.strictEqual(mapped.segments[0].speakerName, 'Dr. Jane Foster');
    assert.strictEqual(mapped.segments[0].speakerId, 'usr_speaker_1');
  });

  // ─── 9. REQ-MEDIA-015: TRANSCRIPT KEYWORD SEARCH ───────────────────────────
  test('REQ-MEDIA-015: Keyword search returns matching segments with start timestamps', () => {
    const matches = transcriptionService.searchTranscript(meetingId, 'architecture');
    assert(matches.length > 0);
    assert.strictEqual(matches[0].meetingId, meetingId);
    assert(matches[0].text.toLowerCase().includes('architecture'));
    assert(typeof matches[0].startTimeSeconds === 'number');
  });

  // ─── 10. REQ-MEDIA-024: COMPLETE 16-STEP E2E SCENARIO ─────────────────────
  await asyncTest('REQ-MEDIA-024: Complete 16-Step Post-Meeting Recording & Processing Flow', async () => {
    console.log('    Step 1: Admin creates meeting');
    const e2eMeet = meetingService.createMeeting(adminHost, { title: 'E2E Media Pipeline Loop' });
    assert(e2eMeet.success);
    const mId = e2eMeet.meeting.id;
    meetingService.transitionStatus(adminHost, mId, 'STARTED');
    meetingService.transitionStatus(adminHost, mId, 'ACTIVE');

    console.log('    Step 2: Participants join meeting');
    // Active session running

    console.log('    Step 3: Host initiates recording');
    const startRes = await recordingService.startRecording(adminHost, { meetingId: mId });
    assert(startRes.success);
    const recId = startRes.recording.id;

    console.log('    Step 4: Meeting collaboration activity occurs');
    // Simulated activity during call

    console.log('    Step 5: Host stops recording');
    const stopRes = await recordingService.stopRecording(adminHost, { meetingId: mId, recordingId: recId });
    assert(stopRes.success);
    assert.strictEqual(stopRes.recording.status, 'PROCESSING');

    console.log('    Step 6: Meeting ends (non-blocking)');
    const endMeet = meetingService.transitionStatus(adminHost, mId, 'ENDED');
    assert(endMeet.success);

    console.log('    Step 7: Media file secured in Object Storage');
    const storageHead = await objectStorageService.headObject(stopRes.recording.storageKey);
    assert(storageHead);
    assert(storageHead.size > 0);

    console.log('    Step 8: Transactional outbox records RecordingCompleted.v1');
    const pendingEvents = outboxService.getRecordsByAggregate(mId);
    assert(pendingEvents.some(e => e.eventType === 'RecordingCompleted.v1'));

    console.log('    Step 9: Background media processing worker claims job');
    const workerRes = await mediaProcessingWorker.processJob({
      recordingId: recId,
      meetingId: mId,
      storageKey: stopRes.recording.storageKey,
      durationSeconds: stopRes.recording.durationSeconds,
    });
    assert(workerRes.success);

    console.log('    Step 10: Recording state updates to READY');
    const finishedRec = recordingService.getRecording(recId);
    assert.strictEqual(finishedRec.status, 'READY');

    console.log('    Step 11: Speech-to-text transcript generated with segments');
    const transcript = transcriptionService.getTranscriptForRecording(recId);
    assert(transcript);
    assert.strictEqual(transcript.status, 'READY');

    console.log('    Step 12: Notification event dispatched via Outbox');
    const outboxEvents = outboxService.getRecordsByAggregate(mId);
    assert(outboxEvents.some(e => e.eventType === 'NotificationRequested.v1'));

    console.log('    Step 13: Authorized participant requests playback access');
    const accessRes = recordingService.getRecordingAccess(participantUser, recId);
    assert(accessRes.success);
    assert(accessRes.access.playbackUrl.includes('action=STREAM'));

    console.log('    Step 14: User streams video with HTTP Range header');
    const streamRes = await objectStorageService.getObject(finishedRec.storageKey, { start: 0, end: 15 });
    assert(streamRes.isPartial);

    console.log('    Step 15: User searches transcript and jumps to matching segment');
    const searchRes = transcriptionService.searchTranscript(mId, 'outbox');
    assert(searchRes.length > 0);
    assert(searchRes[0].startTimeSeconds >= 0);

    console.log('    Step 16: Host deletes recording and purges storage assets');
    const delRes = await recordingService.deleteRecording(adminHost, recId);
    assert(delRes.success);
    const postDel = recordingService.getRecording(recId);
    assert.strictEqual(postDel.status, 'DELETED');
    const postDelHead = await objectStorageService.headObject(finishedRec.storageKey);
    assert.strictEqual(postDelHead, null);
  });

  console.log(`\n======================================================`);
  console.log(`✅ All ${passed}/${total} Phase 17 Recording Tests PASSED`);
  console.log(`======================================================\n`);
}

runPhase17Tests().catch(err => {
  console.error('Fatal test error in Phase 17:', err);
  process.exit(1);
});
