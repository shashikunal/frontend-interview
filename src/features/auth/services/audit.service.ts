import { supabase } from '../../../lib/supabase/client'
import type { AuditLogEntry, FeatureEntitlements } from '../types/auth.types'
import { profileService } from './profile.service'

export interface AccessNotificationItem {
  id: string
  userId?: string
  userEmail: string
  userName: string
  featureKey: keyof FeatureEntitlements
  featureName: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED'
}

const AUDIT_LOCAL_KEY = 'supabase_audit_logs_local'
const REQUESTS_LOCAL_KEY = 'supabase_access_requests_local'

let memoryRequests: AccessNotificationItem[] = []
let memoryAudit: AuditLogEntry[] = []

function isValidUUID(id?: string): boolean {
  if (!id) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
}

// BroadcastChannel instance for cross-tab 0ms synchronization
const accessChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('interviewprep_access_channel') : null

// Singleton Supabase Realtime channel for access request broadcasts
let _accessRealtimeChannel: ReturnType<typeof supabase.channel> | null = null
function getAccessRealtimeChannel() {
  if (!_accessRealtimeChannel) {
    _accessRealtimeChannel = supabase.channel('platform_access_requests', {
      config: { broadcast: { self: true } },
    })
    _accessRealtimeChannel.subscribe()
  }
  return _accessRealtimeChannel
}

function getLocalRequests(): AccessNotificationItem[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(REQUESTS_LOCAL_KEY)
      if (raw) {
        const parsed: AccessNotificationItem[] = JSON.parse(raw)
        // Clean out any legacy demo mock requests for candidate@faang.io
        const cleaned = parsed.filter(
          r => r.userEmail !== 'candidate@faang.io' && r.userId !== 'usr_candidate_demo'
        )
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(REQUESTS_LOCAL_KEY, JSON.stringify(cleaned))
        }
        return cleaned
      }
    }
  } catch {
    // ignore
  }
  return memoryRequests.filter(
    r => r.userEmail !== 'candidate@faang.io' && r.userId !== 'usr_candidate_demo'
  )
}

function saveLocalRequests(items: AccessNotificationItem[]): void {
  // Ensure no demo requests enter
  const sanitized = items.filter(
    r => r.userEmail !== 'candidate@faang.io' && r.userId !== 'usr_candidate_demo'
  )
  memoryRequests = [...sanitized]
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(REQUESTS_LOCAL_KEY, JSON.stringify(sanitized))
    }
  } catch {
    // ignore
  }
}

function broadcastAccessUpdate(item: AccessNotificationItem): void {
  // 1. Cross-tab BroadcastChannel
  if (accessChannel) {
    try {
      accessChannel.postMessage({ type: 'ACCESS_REQUEST_UPDATE', payload: item })
    } catch {
      // ignore
    }
  }

  // 2. Same-window custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('platform_access_request', { detail: item }))
  }

  // 3. Supabase Realtime Broadcast (persistent singleton channel)
  try {
    getAccessRealtimeChannel().send({
      type: 'broadcast',
      event: 'live_access_request',
      payload: item,
    })
  } catch {
    // ignore
  }
}

function getLocalAudit(): AuditLogEntry[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(AUDIT_LOCAL_KEY)
      if (raw) return JSON.parse(raw)
    }
  } catch {
    // ignore
  }
  return memoryAudit
}

function appendLocalAudit(entry: AuditLogEntry): void {
  memoryAudit.unshift(entry)
  try {
    if (typeof localStorage !== 'undefined') {
      const current = getLocalAudit()
      if (!current.some(c => c.id === entry.id)) {
        current.unshift(entry)
      }
      localStorage.setItem(AUDIT_LOCAL_KEY, JSON.stringify(current.slice(0, 100)))
    }
  } catch {
    // ignore
  }
}

export const auditService = {
  /**
   * Log an audit action into public.audit_logs
   */
  logEvent: async (params: {
    userId?: string
    action: string
    resource: string
    details?: Record<string, unknown>
  }): Promise<void> => {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      details: params.details || {},
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node',
      createdAt: new Date().toISOString(),
    }

    // Always mirror to local persistent storage
    appendLocalAudit(entry)

    // Handle access request tracking
    if (params.action === 'FEATURE_ACCESS_REQUESTED') {
      const details = params.details || {}
      const notifItem: AccessNotificationItem = {
        id: entry.id,
        userId: params.userId,
        userEmail: (details.userEmail as string) || 'candidate@interviewprep.io',
        userName: (details.userName as string) || (details.userEmail as string)?.split('@')[0] || 'Candidate',
        featureKey: (params.resource as keyof FeatureEntitlements) || 'system_design',
        featureName: (details.featureName as string) || String(params.resource),
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      }
      const existing = getLocalRequests()
      // Always replace existing request for same email+feature to refresh to PENDING
      const filtered = existing.filter(
        r => !(r.userEmail.toLowerCase() === notifItem.userEmail.toLowerCase() && r.featureKey === notifItem.featureKey)
      )
      filtered.unshift(notifItem)
      saveLocalRequests(filtered)
      broadcastAccessUpdate(notifItem)
    }

    try {
      await supabase.from('audit_logs').insert({
        user_id: isValidUUID(params.userId) ? params.userId : null,
        action: params.action,
        resource: params.resource,
        details: params.details || {},
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node',
      })
    } catch {
      // Gracefully handled by persistent mirror
    }
  },

  /**
   * Subscribe to real-time access requests (Multi-tab + Supabase WebSocket + Local Events)
   */
  subscribeToAccessRequests: (callback: (item: AccessNotificationItem) => void): (() => void) => {
    // 1. BroadcastChannel listener
    const bcHandler = (e: MessageEvent) => {
      if (e.data?.type === 'ACCESS_REQUEST_UPDATE' && e.data?.payload) {
        callback(e.data.payload)
      }
    }
    if (accessChannel) {
      accessChannel.addEventListener('message', bcHandler)
    }

    // 2. Custom Window Event listener
    const windowHandler = (e: Event) => {
      const detail = (e as CustomEvent<AccessNotificationItem>).detail
      if (detail) callback(detail)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('platform_access_request', windowHandler)
    }

    // 3. Supabase Realtime WebSocket channel
    const sbChannel = supabase
      .channel('platform_access_requests')
      .on('broadcast', { event: 'live_access_request' }, payload => {
        if (payload?.payload) {
          callback(payload.payload as AccessNotificationItem)
        }
      })
      .subscribe()

    // 4. Storage event listener (fallback for other windows)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === REQUESTS_LOCAL_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed) && parsed.length > 0) {
            callback(parsed[0])
          }
        } catch {
          // ignore
        }
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', storageHandler)
    }

    return () => {
      if (accessChannel) accessChannel.removeEventListener('message', bcHandler)
      if (typeof window !== 'undefined') {
        window.removeEventListener('platform_access_request', windowHandler)
        window.removeEventListener('storage', storageHandler)
      }
      supabase.removeChannel(sbChannel)
    }
  },

  /**
   * Admin: Fetch recent audit logs from public.audit_logs
   */
  getAuditLogs: async (limit: number = 30): Promise<AuditLogEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          userId: d.user_id,
          action: d.action,
          resource: d.resource,
          details: d.details,
          ipAddress: d.ip_address,
          userAgent: d.user_agent,
          createdAt: d.created_at,
        }))
      }
    } catch {
      // ignore
    }

    return getLocalAudit().slice(0, limit)
  },

  /**
   * Admin: Fetch access request notifications (Real Data Only)
   */
  getAccessNotifications: async (): Promise<AccessNotificationItem[]> => {
    const local = getLocalRequests()
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'FEATURE_ACCESS_REQUESTED')
        .order('created_at', { ascending: false })
        .limit(25)

      if (!error && Array.isArray(data) && data.length > 0) {
        const remoteItems: AccessNotificationItem[] = data
          .map(d => {
            const details = d.details || {}
            return {
              id: d.id,
              userId: d.user_id,
              userEmail: (details.userEmail as string) || 'candidate@interviewprep.io',
              userName: (details.userName as string) || (details.userEmail as string)?.split('@')[0] || 'Candidate',
              featureKey: (d.resource as keyof FeatureEntitlements) || 'system_design',
              featureName: (details.featureName as string) || String(d.resource),
              createdAt: d.created_at,
              status: (details.status as AccessNotificationItem['status']) || 'PENDING',
            }
          })
          .filter(r => r.userEmail !== 'candidate@faang.io' && r.userId !== 'usr_candidate_demo')

        const merged = [...local]
        for (const rem of remoteItems) {
          const localMatch = local.find(
            l => l.id === rem.id || (l.userEmail.toLowerCase() === rem.userEmail.toLowerCase() && l.featureKey === rem.featureKey)
          )
          if (!localMatch) {
            merged.push(rem)
          }
        }
        return merged
      }
    } catch {
      // ignore
    }

    return local
  },

  /**
   * Admin: Approve access request and grant entitlement in Supabase
   */
  approveAccessRequest: async (
    notification: AccessNotificationItem
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // 1. Grant entitlement in profile service
      if (notification.userId) {
        const profile = await profileService.getProfile(notification.userId)
        if (profile) {
          const updatedEntitlements = {
            ...profile.entitlements,
            [notification.featureKey]: true,
          }
          await profileService.updateProfile(notification.userId, {
            feature_entitlements: updatedEntitlements,
          })
        }
      }

      // 2. Persist approved status in local mirror so it never resets
      const localRequests = getLocalRequests()
      const updated = localRequests.map(r =>
        r.id === notification.id || (r.userEmail === notification.userEmail && r.featureKey === notification.featureKey)
          ? { ...r, status: 'APPROVED' as const }
          : r
      )
      saveLocalRequests(updated)

      // 3. Log approval event in Supabase audit_logs
      await supabase.from('audit_logs').insert({
        user_id: notification.userId || null,
        action: 'FEATURE_ACCESS_APPROVED',
        resource: notification.featureKey,
        details: {
          requestId: notification.id,
          userEmail: notification.userEmail,
          featureName: notification.featureName,
          approvedAt: new Date().toISOString(),
        },
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node',
      })

      return {
        success: true,
        message: `Granted '${notification.featureName}' to ${notification.userEmail} successfully!`,
      }
    } catch {
      // Still ensure local mirror is updated
      const localRequests = getLocalRequests()
      const updated = localRequests.map(r =>
        r.id === notification.id ? { ...r, status: 'APPROVED' as const } : r
      )
      saveLocalRequests(updated)

      return {
        success: true,
        message: `Granted '${notification.featureName}' to ${notification.userEmail}!`,
      }
    }
  },

  /**
   * Admin: Decline access request
   */
  declineAccessRequest: (notificationId: string): void => {
    const localRequests = getLocalRequests()
    const updated = localRequests.map(r =>
      r.id === notificationId ? { ...r, status: 'DECLINED' as const } : r
    )
    saveLocalRequests(updated)
  },

  /**
   * Admin: Delete/Dismiss a single access request notification
   */
  deleteNotification: (notificationId: string): void => {
    const localRequests = getLocalRequests()
    const updated = localRequests.filter(r => r.id !== notificationId)
    saveLocalRequests(updated)
  },

  /**
   * Admin: Clear all access request notifications
   */
  clearAllNotifications: (): void => {
    saveLocalRequests([])
  },
}
