/**
 * Browser Web Push Client Service
 * Strictly requests notification permission on explicit user interaction.
 * Registers Service Worker, acquires PushSubscription, and syncs with backend.
 */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface PushStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
}

export class PushClientService {
  /**
   * Check browser push notification support and current permission status
   */
  public async getStatus(): Promise<PushStatus> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return {
        isSupported: false,
        permission: 'default',
        isSubscribed: false,
        subscription: null,
      };
    }

    const permission = Notification.permission;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      return {
        isSupported: true,
        permission,
        isSubscribed: !!sub,
        subscription: sub,
      };
    } catch {
      return {
        isSupported: true,
        permission,
        isSubscribed: false,
        subscription: null,
      };
    }
  }

  /**
   * Request push permission and subscribe
   * MUST be invoked in response to a user action (e.g. click 'Enable Push Notifications')
   */
  public async subscribeUser(userId: string): Promise<{ success: boolean; message: string }> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, message: 'Web Push is not supported in this browser.' };
    }

    try {
      // 1. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, message: 'Notification permission was denied or dismissed.' };
      }

      // 2. Fetch VAPID public key
      const keyRes = await fetch('/api/v1/notifications/vapid-key').catch(() => null);
      let publicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      if (keyRes && keyRes.ok) {
        const keyJson = await keyRes.json();
        if (keyJson.publicKey) publicKey = keyJson.publicKey;
      }

      // 3. Register or verify service worker
      await navigator.serviceWorker.register('/sw.js');
      const registration = await navigator.serviceWorker.ready;

      // 4. Subscribe with PushManager
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey as unknown as BufferSource,
        });
      }

      // 5. Send subscription to backend
      const rawSub = subscription.toJSON();
      const sendRes = await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscription: rawSub,
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: /Edg/i.test(navigator.userAgent)
            ? 'edge'
            : /Chrome/i.test(navigator.userAgent)
            ? 'chrome'
            : /Firefox/i.test(navigator.userAgent)
            ? 'firefox'
            : 'safari',
          userAgent: navigator.userAgent,
        }),
      });

      if (!sendRes.ok) {
        throw new Error(`Server returned HTTP ${sendRes.status} during subscription registration.`);
      }

      return { success: true, message: 'Push notifications enabled successfully!' };
    } catch (err: any) {
      console.error('[PushClientService] Subscription error:', err);
      return { success: false, message: err.message || 'Failed to subscribe to push notifications.' };
    }
  }

  /**
   * Unsubscribe from browser push
   */
  public async unsubscribeUser(): Promise<boolean> {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        return true;
      }
    } catch (err) {
      console.error('[PushClientService] Unsubscribe error:', err);
    }
    return false;
  }

  /**
   * Display a native OS notification and service worker notification
   */
  public async displayLocalNotification(payload: {
    title: string;
    body: string;
    url?: string;
    meetingId?: string;
  }): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // 1. Send to Service Worker
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: {
            title: payload.title,
            body: payload.body,
            data: { url: payload.url || `/meet/${payload.meetingId}`, meetingId: payload.meetingId },
          },
        });
      }
    } catch (err) {
      console.warn('[PushClientService] SW notification error:', err);
    }

    // 2. Direct Window Notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(payload.title, {
          body: payload.body,
          icon: '/favicon.svg',
          tag: `meeting-${payload.meetingId || Date.now()}`,
          data: { url: payload.url, meetingId: payload.meetingId },
        });
        notif.onclick = () => {
          window.focus();
          if (payload.url) {
            window.location.href = payload.url;
          } else if (payload.meetingId) {
            window.location.href = `/meet/${payload.meetingId}`;
          }
          notif.close();
        };
        return true;
      } catch (err) {
        console.warn('[PushClientService] Window notification fallback error:', err);
      }
    }
    return false;
  }

  /**
   * Send meeting link to students via backend push notification API
   * and broadcast to all student tabs
   */
  public async sendMeetingPushNotification(params: {
    meetingId: string;
    studentIds?: string[];
    customMessage?: string;
  }): Promise<{ success: boolean; message: string; recipientsCount?: number }> {
    try {
      const res = await fetch('/api/v1/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-meeting-link',
          meetingId: params.meetingId,
          studentIds: params.studentIds,
          customMessage: params.customMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch push notification');
      }

      // Broadcast across tabs so students with active sessions get immediate alert
      const alertPayload = {
        type: 'MEETING_PUSH_DISPATCHED',
        meetingId: params.meetingId,
        meetingTitle: data.meetingTitle || 'Live Interview Meeting',
        title: `🟢 Live Meeting Started: Join Now!`,
        body: params.customMessage || `Your interviewer has started the session. Click to join!`,
        url: data.meetingUrl || `/meet/${params.meetingId}`,
        meetingUrl: data.meetingUrl || `/meet/${params.meetingId}`,
        customMessage: params.customMessage,
        timestamp: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('last_active_meeting_alert', JSON.stringify(alertPayload));
        } catch (_) {}

        if ('BroadcastChannel' in window) {
          try {
            const channel = new BroadcastChannel('meet_notifications_channel');
            channel.postMessage(alertPayload);
            channel.close();
          } catch (bcErr) {
            console.warn('[PushClientService] BroadcastChannel post error:', bcErr);
          }
        }
      }

      return {
        success: true,
        message: data.message || `Push notification dispatched!`,
        recipientsCount: data.recipients?.length || 0,
      };
    } catch (err: any) {
      console.error('[PushClientService] Send push notification error:', err);
      return { success: false, message: err.message || 'Failed to send push notification.' };
    }
  }

  /**
   * Fetch the currently active meeting alert from backend serverless notification ledger
   */
  public async getActiveMeetingNotification(): Promise<{
    id?: string;
    meetingId: string;
    meetingTitle: string;
    meetingUrl: string;
    customMessage?: string;
    trainerName?: string;
    timestamp: string;
  } | null> {
    try {
      const res = await fetch('/api/v1/notifications', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.activeLiveMeeting) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('last_active_meeting_alert', JSON.stringify(data.activeLiveMeeting));
          } catch (_) {}
        }
        return data.activeLiveMeeting;
      }

      // Check cached fallback
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('last_active_meeting_alert');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - new Date(parsed.timestamp).getTime() < 2 * 3600 * 1000) {
              return parsed;
            }
          }
        } catch (_) {}
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Start lightweight background polling for active meeting notifications (every 4s)
   * This bridges cross-device and cross-browser live meeting alert distribution.
   */
  public startPolling(callback: (alert: any) => void, intervalMs: number = 4000): () => void {
    let active = true;
    let lastNotifiedId = '';

    const check = async () => {
      if (!active) return;
      try {
        const alert = await this.getActiveMeetingNotification();
        if (alert && alert.meetingId) {
          const alertKey = `${alert.meetingId}_${alert.timestamp}`;
          if (alertKey !== lastNotifiedId) {
            lastNotifiedId = alertKey;
            this.displayLocalNotification({
              title: alert.meetingTitle ? `🟢 Live Meeting: ${alert.meetingTitle}` : '🟢 Live Meeting Started!',
              body: alert.customMessage || 'Your interview meeting is now live. Click to join!',
              url: alert.meetingUrl || `/meet/${alert.meetingId}`,
              meetingId: alert.meetingId,
            });
            callback(alert);
          }
        }
      } catch (_) {}
    };

    check();
    const timer = setInterval(check, intervalMs);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }

  /**
   * Listen for real-time meeting notification broadcasts
   */
  public onNotificationReceived(callback: (event: any) => void): () => void {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return () => {};
    }

    const channel = new BroadcastChannel('meet_notifications_channel');
    const handler = (msg: MessageEvent) => {
      if (msg.data && msg.data.type === 'MEETING_PUSH_DISPATCHED') {
        // Automatically trigger native notification if allowed
        this.displayLocalNotification({
          title: msg.data.title,
          body: msg.data.body,
          url: msg.data.url || msg.data.meetingUrl,
          meetingId: msg.data.meetingId,
        });
        callback(msg.data);
      }
    };

    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
  }
}

export const pushClientService = new PushClientService();
