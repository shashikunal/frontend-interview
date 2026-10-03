import { supabase } from '../../../lib/supabase/client'
import type { AuditLogEntry } from '../types/auth.types'

const AUDIT_LOCAL_KEY = 'supabase_audit_logs_local'

function isValidUUID(id?: string): boolean {
  return Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
}

function getLocalAudit(): AuditLogEntry[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(AUDIT_LOCAL_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as AuditLogEntry[]) : []
  } catch {
    return []
  }
}

function appendLocalAudit(entry: AuditLogEntry): void {
  if (typeof localStorage === 'undefined') return
  try {
    const current = getLocalAudit()
    current.unshift(entry)
    localStorage.setItem(AUDIT_LOCAL_KEY, JSON.stringify(current.slice(0, 100)))
  } catch {
    // ignore
  }
}

export const auditService = {
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
}