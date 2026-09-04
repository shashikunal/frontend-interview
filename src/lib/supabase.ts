import { supabase } from './supabase/client'
import type {
  UserRole,
  FeatureEntitlements,
  StoredUserAccount,
} from '../features/auth/types/auth.types'
import { DEFAULT_ENTITLEMENTS } from '../features/auth/types/auth.types'

export { supabase }
export type { UserRole, FeatureEntitlements, StoredUserAccount }
export { DEFAULT_ENTITLEMENTS }

export type ActivityType =
  | 'QUESTION_SOLVED'
  | 'MOCK_COMPLETED'
  | 'QUIZ_SCORED'
  | 'FLASHCARD_MASTERED'
  | 'STUDIO_EXPLORED'
  | 'FEATURE_GRANTED'
  | 'ROLE_UPDATED'
  | 'TRACK_SWITCHED'
  | 'AUTH_SIGN_IN'
  | 'FEATURE_REQUESTED'

export interface ActivityLogItem {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  type: ActivityType
  title: string
  details?: string
  timestamp: string
}

const LOCAL_ACTIVITIES_KEY = 'supabase_live_activities_real'

function getLocalActivities(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalActivities(items: ActivityLogItem[]): void {
  try {
    localStorage.setItem(LOCAL_ACTIVITIES_KEY, JSON.stringify(items.slice(0, 100)))
  } catch {
    // ignore
  }
}

// ─── Singleton channel for activity broadcasting ───────────────────────────
// We create the channel once and subscribe, then reuse it for all sends.
// Creating a new channel per send is incorrect Supabase Realtime usage.
let _activityChannel: ReturnType<typeof supabase.channel> | null = null

function getActivityChannel() {
  if (!_activityChannel) {
    _activityChannel = supabase.channel('platform_activity_stream', {
      config: { broadcast: { self: true } },
    })
    _activityChannel.subscribe()
  }
  return _activityChannel
}

// Activity Service using Supabase & Realtime Broadcast
export const dbActivityService = {
  logActivity: async (item: Omit<ActivityLogItem, 'id' | 'timestamp'>): Promise<ActivityLogItem> => {
    const fullItem: ActivityLogItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: item.userId,
      userName: item.userName || 'Candidate',
      userEmail: item.userEmail || 'candidate@interviewprep.io',
      type: item.type,
      title: item.title,
      details: item.details,
      timestamp: new Date().toISOString(),
    }

    // 1. Mirror locally for instant offline/multi-tab persistence
    const current = getLocalActivities()
    current.unshift(fullItem)
    saveLocalActivities(current)

    // 2. Dispatch window event for immediate in-process listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('platform_live_activity', { detail: fullItem }))
    }

    // 3. Write to Supabase table (schema: id auto-generated UUID, no user_name/user_email cols)
    try {
      await supabase.from('user_activities').insert({
        user_id: item.userId,
        type: item.type,
        title: item.title,
        details: item.details || '',
      })
    } catch {
      // ignore — table may not exist yet
    }

    // 4. Broadcast on persistent singleton channel
    try {
      await getActivityChannel().send({
        type: 'broadcast',
        event: 'live_user_activity',
        payload: fullItem,
      })
    } catch {
      // ignore
    }

    return fullItem
  },

  getAllActivities: async (limit: number = 40): Promise<ActivityLogItem[]> => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          userId: String(d.user_id),
          userName: (d.user_name as string) || 'Candidate',
          userEmail: (d.user_email as string) || undefined,
          type: d.type as ActivityType,
          title: String(d.title),
          details: String(d.details || ''),
          timestamp: String(d.created_at || new Date().toISOString()),
        }))
      }
    } catch {
      // ignore
    }

    return getLocalActivities().slice(0, limit)
  },

  getRecentActivities: async (userId?: string): Promise<ActivityLogItem[]> => {
    if (!userId) return []

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          userId: String(d.user_id),
          type: d.type as ActivityType,
          title: String(d.title),
          details: String(d.details || ''),
          timestamp: String(d.created_at),
        }))
      }
    } catch {
      // ignore
    }

    return getLocalActivities().filter(a => a.userId === userId).slice(0, 30)
  },

  subscribeToActivities: (onActivity: (item: ActivityLogItem) => void) => {
    // 1. Use the persistent singleton channel for Realtime subscription
    const channel = getActivityChannel()
    channel.on('broadcast', { event: 'live_user_activity' }, payload => {
      if (payload && payload.payload) {
        onActivity(payload.payload as ActivityLogItem)
      }
    })

    // 2. Window custom event listener for in-app events
    const customHandler = (e: Event) => {
      const detail = (e as CustomEvent<ActivityLogItem>).detail
      if (detail) onActivity(detail)
    }
    window.addEventListener('platform_live_activity', customHandler)

    // 3. Storage event listener for multi-tab sync
    const storageHandler = (e: StorageEvent) => {
      if (e.key === LOCAL_ACTIVITIES_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed) && parsed.length > 0) {
            onActivity(parsed[0])
          }
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('platform_live_activity', customHandler)
      window.removeEventListener('storage', storageHandler)
      // Note: don't remove the singleton channel — it should stay alive
    }
  },
}
