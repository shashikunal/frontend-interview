import { describe, it, expect, beforeEach } from 'vitest';
import { pushNotificationService } from '../../server/notifications/pushNotificationService.ts';
import { notificationWorker } from '../../server/notifications/notificationWorker.ts';
import type { MeetingRecord } from '../../server/meetings/meetingOpsTypes.ts';

describe('Push Notification & Delivery Verification', () => {
  beforeEach(() => {
    // Reset subscriptions for isolation
    (pushNotificationService as any).subscriptions?.clear();
  });

  it('exposes a valid VAPID public key', () => {
    const key = pushNotificationService.getPublicKey();
    expect(key).toBeDefined();
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(50);
  });

  it('registers and retrieves active subscriptions for a user', () => {
    const sub = pushNotificationService.registerSubscription({
      userId: 'cand_101',
      endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/test_sub_endpoint_101',
      p256dh: 'test_p256dh_sample_key_123',
      auth: 'test_auth_secret_456',
      deviceType: 'desktop',
      browser: 'chrome',
    });

    expect(sub.id).toBeDefined();
    expect(sub.user_id).toBe('cand_101');
    expect(sub.is_active).toBe(true);

    const activeSubs = pushNotificationService.getActiveSubscriptionsForUser('cand_101');
    expect(activeSubs).toHaveLength(1);
    expect(activeSubs[0].endpoint).toBe(sub.endpoint);
  });

  it('marks subscription inactive upon deregistration or expiration', () => {
    const endpoint = 'https://updates.push.services.mozilla.com/wpush/v2/test_sub_endpoint_102';
    pushNotificationService.registerSubscription({
      userId: 'cand_102',
      endpoint,
      p256dh: 'p256dh_key',
      auth: 'auth_secret',
    });

    expect(pushNotificationService.getActiveSubscriptionsForUser('cand_102')).toHaveLength(1);

    pushNotificationService.markSubscriptionInactive(endpoint, 'HTTP 410 Gone');
    expect(pushNotificationService.getActiveSubscriptionsForUser('cand_102')).toHaveLength(0);
  });

  it('allows user preference customization', () => {
    const initialPrefs = pushNotificationService.getPreferences('cand_103');
    expect(initialPrefs.push_notifications).toBe(true);

    const updated = pushNotificationService.updatePreferences('cand_103', {
      push_notifications: false,
    });
    expect(updated.push_notifications).toBe(false);

    // Should honor disabled preferences
    const res = pushNotificationService.getPreferences('cand_103');
    expect(res.push_notifications).toBe(false);
  });

  it('handles immediate notification dispatch gracefully even when no browser push is subscribed yet', async () => {
    const mockMeeting: MeetingRecord = {
      id: 'meet_test_push_999',
      title: 'Full-Stack Performance Architecture Review',
      description: 'System design and caching',
      meeting_type: 'Interview',
      meeting_provider: 'Platform Meet (Built-in)',
      meeting_url: '/meet/meet_test_push_999',
      start_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      end_at: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      timezone: 'Asia/Kolkata',
      trainer_id: 'trainer_1',
      trainer_name: 'Lead Evaluator',
      created_by: 'admin_1',
      status: 'SCHEDULED',
      capacity: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // User has no web push subscription registered yet
    const ok = await notificationWorker.dispatchImmediateNotification(
      mockMeeting,
      'cand_without_browser_push',
      'MEETING_STARTED',
      'Session started!'
    );

    // Should succeed gracefully by queuing in-app alert without routing to DLQ poison queue
    expect(ok).toBe(true);
    const notifications = notificationWorker.listNotifications('meet_test_push_999');
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].status).toBe('sent');
  });
});
