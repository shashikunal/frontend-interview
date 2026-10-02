import { describe, it, expect, beforeEach } from 'vitest';
import { meetingMutationTracker } from '../../src/features/meetings/services/meetingMutationTracker';
import { meetingOpsService } from '../../server/meetings/meetingOpsService';
import { getIceConfiguration } from '../../src/features/meetings/services/webrtcPeerService';
import type { MeetingRecord } from '../../server/meetings/meetingOpsTypes';

describe('Requirement 22: Delete Race Condition Protection', () => {
  beforeEach(() => {
    // Reset tracker before each test
    meetingMutationTracker.clear();
  });

  it('guarantees delayed stale GET response can NEVER resurrect a deleted meeting', async () => {
    const meeting1: MeetingRecord = {
      id: 'meet_alpha_123',
      title: 'Senior Frontend Architecture Round',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/meet_alpha_123',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'trainer_1',
      trainer_name: 'Staff Engineer',
      created_by: 'admin_1',
      status: 'SCHEDULED',
      capacity: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const meeting2: MeetingRecord = {
      id: 'meet_beta_456',
      title: 'React System Design Session',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/meet_beta_456',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'trainer_1',
      trainer_name: 'Staff Engineer',
      created_by: 'admin_1',
      status: 'SCHEDULED',
      capacity: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Simulating initial fetch or GET request start
    const oldApiResponse = [meeting1, meeting2];
    const initialSignal = meetingMutationTracker.getAbortSignal();
    expect(initialSignal.aborted).toBe(false);

    // 2. User deletes meeting1 ('meet_alpha_123')
    meetingMutationTracker.registerDelete('meet_alpha_123');

    // Confirm initial in-flight GET query signal was aborted by mutation
    expect(initialSignal.aborted).toBe(true);
    expect(meetingMutationTracker.isMeetingDeleted('meet_alpha_123')).toBe(true);
    expect(meetingMutationTracker.isMeetingDeleted('meet_beta_456')).toBe(false);

    // 3. Artificially delayed GET response arrives containing the deleted meeting
    const delayedGetResult = await new Promise<MeetingRecord[]>((resolve) => {
      setTimeout(() => {
        resolve(oldApiResponse);
      }, 50);
    });

    // 4. Client sanitizes data through Single Source of Truth mutation tracker
    const sanitizedResult = meetingMutationTracker.sanitizeMeetingList(delayedGetResult);

    // 5. Confirm deleted meeting is NOT restored!
    expect(sanitizedResult).toHaveLength(1);
    expect(sanitizedResult[0].id).toBe('meet_beta_456');
    expect(sanitizedResult.some((m) => m.id === 'meet_alpha_123')).toBe(false);
  });
});

describe('Requirements 24, 25 & 26: Idempotency & Soft-Delete Backend Enforcement', () => {
  it('enforces soft delete and excludes cancelled/deleted meetings from listing', async () => {
    const caller = { id: 'admin_test', role: 'admin', name: 'Admin Tester' };

    // Create test meeting
    const createRes = await meetingOpsService.createMeeting(caller, {
      title: 'Idempotency Verification Meeting',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/meet_idempotent_test',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'host_001',
    });

    expect(createRes.success).toBe(true);
    expect(createRes.meeting).toBeDefined();
    const created = createRes.meeting!;
    expect(created.id).toBeDefined();

    // Verify it is present in active meeting query
    const listBefore = meetingOpsService.listMeetings({ limit: 100 });
    expect(listBefore.meetings.some((m) => m.id === created.id)).toBe(true);

    // First DELETE: Soft delete applied
    const deleteRes1 = await meetingOpsService.deleteSingleMeeting(created.id, 'admin_test', 'Candidate requested cancellation');
    expect(deleteRes1.success).toBe(true);

    // Verify record in DB has soft-delete fields
    const directLookup = (meetingOpsService as any).meetings?.get(created.id);
    expect(directLookup.deleted_at).toBeDefined();
    expect(directLookup.status).toBe('CANCELLED');

    // Verify query strictly excludes it (WHERE deleted_at IS NULL)
    const listAfter = meetingOpsService.listMeetings({ limit: 100 });
    expect(listAfter.meetings.some((m) => m.id === created.id)).toBe(false);

    // Second DELETE: Must be strictly idempotent (does not error or alter state)
    const deleteRes2 = await meetingOpsService.deleteSingleMeeting(created.id, 'admin_test');
    expect(deleteRes2.success).toBe(true);
    expect(deleteRes2.message).toContain('already deleted');

    // Confirm list still does not return it
    const listAfter2 = meetingOpsService.listMeetings({ limit: 100 });
    expect(listAfter2.meetings.some((m) => m.id === created.id)).toBe(false);
  });

  it('guarantees CREATE idempotency key prevents duplicate meeting creation', async () => {
    const caller = { id: 'admin_test', role: 'admin', name: 'Admin Tester' };
    const idempotencyKey = `test_key_${Date.now()}`;

    const res1 = await meetingOpsService.createMeeting(caller, {
      title: 'Idempotent Duplicate Guard',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/meet_idem_guard_1',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'host_001',
      idempotency_key: idempotencyKey,
    } as any);

    const res2 = await meetingOpsService.createMeeting(caller, {
      title: 'Idempotent Duplicate Guard (Duplicate Attempt)',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/meet_idem_guard_2',
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'host_001',
      idempotency_key: idempotencyKey,
    } as any);

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
    expect(res1.meeting?.id).toBe(res2.meeting?.id);
    expect(res2.meeting?.idempotency_key).toBe(idempotencyKey);
  });
});

describe('Requirements 27 & 30: WebRTC State Machine & STUN/TURN Configuration', () => {
  it('provides STUN and fallback configuration dynamically from environment', () => {
    const rtcConfig = getIceConfiguration();
    expect(rtcConfig).toBeDefined();
    expect(rtcConfig.iceServers).toBeDefined();
    expect(rtcConfig.iceServers.length).toBeGreaterThanOrEqual(1);

    const hasStun = rtcConfig.iceServers.some((s) => {
      const urls = Array.isArray(s.urls) ? s.urls : [s.urls];
      return urls.some((u) => u.startsWith('stun:'));
    });
    expect(hasStun).toBe(true);
  });
});
