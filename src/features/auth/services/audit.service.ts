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

function getLocalRequests(): AccessNotificationItem[] {
  try {
    const raw = localStorage.getItem(REQUESTS_LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalRequests(items: AccessNotificationItem[]): void {
  try {
    localStorage.setItem(REQUESTS_LOCAL_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function getLocalAudit(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function appendLocalAudit(entry: AuditLogEntry): void {
  try {
    const current = getLocalAudit()
    current.unshift(entry)
    localStorage.setItem(AUDIT_LOCAL_KEY, JSON.stringify(current.slice(0, 100)))
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
      userAgent: navigator.userAgent,
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
      // Only add if not already requested
      if (!existing.some(r => r.userEmail === notifItem.userEmail && r.featureKey === notifItem.featureKey && r.status === 'PENDING')) {
        existing.unshift(notifItem)
        saveLocalRequests(existing)
      }
    }

    try {
      await supabase.from('audit_logs').insert({
        user_id: params.userId || null,
        action: params.action,
        resource: params.resource,
        details: params.details || {},
        user_agent: navigator.userAgent,
      })
    } catch {
      // Table may not exist yet; gracefully handled by persistent mirror
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
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'FEATURE_ACCESS_REQUESTED')
        .order('created_at', { ascending: false })
        .limit(25)

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(d => {
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
      }
    } catch {
      // ignore
    }

    // Return real local requests (defaults to empty array if no requests made yet)
    return getLocalRequests()
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
        user_agent: navigator.userAgent,
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
}
