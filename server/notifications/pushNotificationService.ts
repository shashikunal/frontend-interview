/**
 * Web Push Notification Service
 * Handles multi-device push subscription management, VAPID token generation,
 * and delivery of Web Push payloads with automated deactivation of expired endpoints.
 */

import crypto from 'node:crypto';
import webpush from 'web-push';
import type { PushSubscriptionRecord, NotificationPreferencesRecord } from '../meetings/meetingOpsTypes.ts';

const DEFAULT_VAPID_PUBLIC = 'BGrIcbnrrjYMJvWBShMKbxG4Ub_6oeKhZnMqvgni_IDFSgXFJqRSVFP0y6PDiUcOKTfMabG1o3hz7GtEU0fW_oE';
const DEFAULT_VAPID_PRIVATE = 'tjlyrsH5ZqhrwrTqEF33u0rpD8j8Uhl0tmGOQDEaRGg';
const DEFAULT_VAPID_SUBJECT = 'mailto:admin@interviewprep.com';

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data: {
    meetingId?: string;
    meetingUrl?: string;
    url?: string;
    notificationType: string;
    timestamp: string;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class PushNotificationService {
  // In-memory mirror for fast delivery and fallback
  private subscriptions: Map<string, PushSubscriptionRecord> = new Map();
  private preferences: Map<string, NotificationPreferencesRecord> = new Map();

  private vapidPublicKey = process.env.VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC;
  private vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || DEFAULT_VAPID_PRIVATE;
  private vapidSubject = process.env.VAPID_SUBJECT || DEFAULT_VAPID_SUBJECT;

  constructor() {
    this.initVapid();
  }

  private initVapid(): void {
    try {
      webpush.setVapidDetails(this.vapidSubject, this.vapidPublicKey, this.vapidPrivateKey);
    } catch (e: any) {
      console.warn('[PushNotificationService] Failed to initialize VAPID credentials:', e?.message);
    }
  }

  public getPublicKey(): string {
    return this.vapidPublicKey;
  }

  /**
   * Register or update a browser push subscription
   * Preserves multiple devices per user (Chrome, Edge, Mobile)
   */
  public registerSubscription(params: {
    userId: string;
    endpoint: string;
    p256dh: string;
    auth: string;
    deviceType?: string;
    browser?: string;
    userAgent?: string;
  }): PushSubscriptionRecord {
    const existing = Array.from(this.subscriptions.values()).find(s => s.endpoint === params.endpoint);
    const now = new Date().toISOString();

    if (existing) {
      existing.user_id = params.userId;
      existing.p256dh = params.p256dh;
      existing.auth = params.auth;
      existing.is_active = true;
      existing.last_seen_at = now;
      existing.updated_at = now;
      return existing;
    }

    const sub: PushSubscriptionRecord = {
      id: crypto.randomUUID(),
      user_id: params.userId,
      endpoint: params.endpoint,
      p256dh: params.p256dh,
      auth: params.auth,
      device_type: params.deviceType || 'desktop',
      browser: params.browser || 'chrome',
      user_agent: params.userAgent,
      is_active: true,
      last_seen_at: now,
      created_at: now,
      updated_at: now,
    };

    this.subscriptions.set(sub.id, sub);
    return sub;
  }

  /**
   * Get all active subscriptions for a user
   */
  public getActiveSubscriptionsForUser(userId: string): PushSubscriptionRecord[] {
    return Array.from(this.subscriptions.values()).filter(
      s => s.user_id === userId && s.is_active
    );
  }

  /**
   * Mark a subscription inactive when browser returns 404 or 410 Gone
   */
  public markSubscriptionInactive(endpoint: string, reason?: string): void {
    for (const sub of this.subscriptions.values()) {
      if (sub.endpoint === endpoint) {
        sub.is_active = false;
        sub.updated_at = new Date().toISOString();
        console.warn(`[PushNotificationService] Marked subscription ${sub.id} inactive (${reason || 'Endpoint defunct'})`);
      }
    }
  }

  /**
   * Get user notification preferences
   */
  public getPreferences(userId: string): NotificationPreferencesRecord {
    const existing = this.preferences.get(userId);
    if (existing) return existing;

    const defaultPrefs: NotificationPreferencesRecord = {
      user_id: userId,
      meeting_notifications: true,
      reminder_24h: true,
      reminder_1h: true,
      reminder_30m: true,
      reminder_5m: true,
      email_notifications: true,
      push_notifications: true,
      updated_at: new Date().toISOString(),
    };
    this.preferences.set(userId, defaultPrefs);
    return defaultPrefs;
  }

  /**
   * Update user notification preferences
   */
  public updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferencesRecord>
  ): NotificationPreferencesRecord {
    const current = this.getPreferences(userId);
    const updated: NotificationPreferencesRecord = {
      ...current,
      ...updates,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };
    this.preferences.set(userId, updated);
    return updated;
  }

  /**
   * Deliver push notification payload to active subscriptions via RFC 8291 / 8292 Web Push
   */
  public async sendPushNotification(
    userId: string,
    payload: PushPayload
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const prefs = this.getPreferences(userId);
    if (!prefs.push_notifications || !prefs.meeting_notifications) {
      return { sent: 0, failed: 0, errors: ['User has disabled push notifications in preferences'] };
    }

    const subs = this.getActiveSubscriptionsForUser(userId);
    if (subs.length === 0) {
      return { sent: 0, failed: 0, errors: ['No active push subscriptions found for user'] };
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    const stringifiedPayload = JSON.stringify(payload);

    for (const sub of subs) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const res = await webpush.sendNotification(pushSubscription, stringifiedPayload, {
          TTL: 86400,
          urgency: 'high',
        });

        if (res.statusCode === 201 || res.statusCode === 200) {
          sent++;
          sub.last_seen_at = new Date().toISOString();
        } else {
          sent++;
        }
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          this.markSubscriptionInactive(sub.endpoint, `HTTP ${err.statusCode} Endpoint Expired`);
          failed++;
          errors.push(`Endpoint expired (${err.statusCode})`);
        } else {
          failed++;
          errors.push(err.message || 'Push transmission error');
        }
      }
    }

    return { sent, failed, errors };
  }
}

export const pushNotificationService = new PushNotificationService();
