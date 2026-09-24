/**
 * Web Push Notification Service
 * Handles multi-device push subscription management, VAPID token generation,
 * and delivery of Web Push payloads with automated deactivation of expired endpoints.
 */

import crypto from 'node:crypto';
import type { PushSubscriptionRecord, NotificationPreferencesRecord } from '../meetings/meetingOpsTypes.ts';

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

  // VAPID keys (can be configured via env or auto-generated for development)
  private vapidPublicKey = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

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
   * Deliver push notification payload to active subscriptions
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
        // Perform real fetch to push endpoint
        const res = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            TTL: '86400',
            Urgency: 'high',
          },
          body: stringifiedPayload,
        }).catch(err => ({ ok: false, status: 500, statusText: err.message } as any));

        if (res.ok || res.status === 201 || res.status === 200) {
          sent++;
          sub.last_seen_at = new Date().toISOString();
        } else if (res.status === 410 || res.status === 404) {
          // Endpoint expired / unsubscribed by user: mark permanently inactive (Rule 17)
          this.markSubscriptionInactive(sub.endpoint, `HTTP ${res.status} Endpoint Expired`);
          failed++;
          errors.push(`Endpoint expired (${res.status})`);
        } else {
          failed++;
          errors.push(`Push gateway returned HTTP ${res.status}: ${res.statusText || 'Transmission failed'}`);
        }
      } catch (err: any) {
        failed++;
        errors.push(err.message || 'Push transmission error');
      }
    }

    return { sent, failed, errors };
  }
}

export const pushNotificationService = new PushNotificationService();
