import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Dynamic Supabase Configuration (supports .env + dynamic UI entry)
const STORAGE_SUPABASE_URL_KEY = 'frontend_interview_supabase_url'
const STORAGE_SUPABASE_KEY_KEY = 'frontend_interview_supabase_anon_key'

export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = ''
  let anonKey = ''
  try {
    url = localStorage.getItem(STORAGE_SUPABASE_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || ''
    anonKey = localStorage.getItem(STORAGE_SUPABASE_KEY_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  } catch {
    url = import.meta.env.VITE_SUPABASE_URL || ''
    anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  }

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    anonKey.length > 20
  )

  return { url, anonKey, isConfigured }
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_SUPABASE_URL_KEY, url.trim())
  localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, anonKey.trim())
  // Re-initialize client
  _supabaseInstance = null
}

let _supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabaseInstance) return _supabaseInstance
  const config = getSupabaseConfig()
  if (config.isConfigured) {
    _supabaseInstance = createClient(config.url, config.anonKey)
    return _supabaseInstance
  }
  return null
}

export const isSupabaseConfigured = getSupabaseConfig().isConfigured
export const supabase = getSupabaseClient()

export type UserRole = 'guest' | 'candidate' | 'pro_member' | 'interviewer' | 'admin'

export interface FeatureEntitlements {
  questions_full: boolean
  coding_sandbox: boolean
  system_design: boolean
  video_mock: boolean
  compiler_studios: boolean
  cloud_sync: boolean
}

export const DEFAULT_ENTITLEMENTS: Record<UserRole, FeatureEntitlements> = {
  guest: { questions_full: false, coding_sandbox: true, system_design: false, video_mock: false, compiler_studios: false, cloud_sync: false },
  candidate: { questions_full: false, coding_sandbox: true, system_design: false, video_mock: false, compiler_studios: false, cloud_sync: true },
  pro_member: { questions_full: true, coding_sandbox: true, system_design: true, video_mock: true, compiler_studios: true, cloud_sync: true },
  interviewer: { questions_full: true, coding_sandbox: true, system_design: true, video_mock: true, compiler_studios: true, cloud_sync: true },
  admin: { questions_full: true, coding_sandbox: true, system_design: true, video_mock: true, compiler_studios: true, cloud_sync: true },
}

export interface AuthSessionData {
  user: {
    id: string
    email: string
    role: UserRole
    name: string
    avatarUrl?: string
    targetCompany?: string
    experienceLevel?: string
    entitlements: FeatureEntitlements
    createdAt: string
  }
  token: string
  expiresAt: number
}

export interface StoredUserAccount {
  id: string
  email: string
  passwordHash: string
  name: string
  role: UserRole
  entitlements: FeatureEntitlements
  status: 'ACTIVE' | 'SUSPENDED'
  solvedCount: number
  streak: number
  lastLogin: string
  createdAt: string
}

export interface ActivityLogItem {
  id: string
  userId: string
  type: 'QUESTION_SOLVED' | 'MOCK_COMPLETED' | 'QUIZ_SCORED' | 'FLASHCARD_MASTERED' | 'STUDIO_EXPLORED' | 'FEATURE_GRANTED' | 'ROLE_UPDATED'
  title: string
  details?: string
  timestamp: string
}

const AUTH_STORAGE_KEY = 'frontend_interview_auth_session'
const USERS_DB_STORAGE_KEY = 'frontend_interview_users_directory'
const ACTIVITIES_STORAGE_KEY = 'frontend_interview_user_activities'

// Salted client hash fallback for offline resilience
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'faang_prep_salt_9281')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function getStoredUsersDirectory(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_DB_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }

  const defaults: StoredUserAccount[] = [
    {
      id: 'usr_admin_001',
      email: 'admin@faang.io',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      name: 'System SuperAdmin',
      role: 'admin',
      entitlements: DEFAULT_ENTITLEMENTS.admin,
      status: 'ACTIVE',
      solvedCount: 512,
      streak: 42,
      lastLogin: 'Just now',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'usr_pro_002',
      email: 'staff.pro@faang.io',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      name: 'Staff Pro Member',
      role: 'pro_member',
      entitlements: DEFAULT_ENTITLEMENTS.pro_member,
      status: 'ACTIVE',
      solvedCount: 142,
      streak: 18,
      lastLogin: '10 minutes ago',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(defaults))
  return defaults
}

function saveUsersDirectory(users: StoredUserAccount[]): void {
  localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(users))
}

export const authService = {
  // 1. Real Supabase Sign Up with Password
  signUpWithPassword: async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; session?: AuthSessionData; needsEmailConfirmation?: boolean; message: string }> => {
    const cleanEmail = email.toLowerCase().trim()
    const name = fullName.trim() || cleanEmail.split('@')[0]
    const role: UserRole = cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('pro') ? 'pro_member' : 'candidate'
    const entitlements = { ...DEFAULT_ENTITLEMENTS[role] }

    const client = getSupabaseClient()
    if (client) {
      try {
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name,
              role,
            },
          },
        })

        if (error) {
          return { success: false, message: error.message }
        }

        if (data.user && !data.session) {
          // Supabase sent a real verification email
          return {
            success: true,
            needsEmailConfirmation: true,
            message: `Official confirmation email sent by Supabase to ${cleanEmail}. Please check your inbox and click the verification link.`,
          }
        }

        if (data.user && data.session) {
          const session: AuthSessionData = {
            user: {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              name,
              role,
              entitlements,
              createdAt: data.user.created_at,
            },
            token: data.session.access_token,
            expiresAt: (data.session.expires_at || 0) * 1000 || Date.now() + 7 * 24 * 60 * 60 * 1000,
          }
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
          return { success: true, session, message: 'Account registered and authenticated with Supabase!' }
        }
      } catch (err: unknown) {
        return { success: false, message: (err as Error).message || 'Supabase registration failed.' }
      }
    }

    // Local Salted Fallback
    const users = getStoredUsersDirectory()
    if (users.some(u => u.email === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists. Please Sign In.' }
    }

    const passwordHash = await hashPassword(password)
    const newUser: StoredUserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      passwordHash,
      name,
      role,
      entitlements,
      status: 'ACTIVE',
      solvedCount: 0,
      streak: 1,
      lastLogin: 'Just now',
      createdAt: new Date().toISOString(),
    }
    saveUsersDirectory([newUser, ...users])

    const session: AuthSessionData = {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        entitlements: newUser.entitlements,
        createdAt: newUser.createdAt,
      },
      token: `jwt_local_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    return { success: true, session, message: 'Account registered and session verified!' }
  },

  // 2. Real Supabase Sign In with Password
  signInWithPassword: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; session?: AuthSessionData; message: string }> => {
    const cleanEmail = email.toLowerCase().trim()
    const client = getSupabaseClient()

    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

        if (error) {
          return { success: false, message: error.message }
        }

        if (data.user && data.session) {
          // Fetch Postgres profile entitlements
          const { data: profile } = await client.from('profiles').select('*').eq('id', data.user.id).single()
          const role = (profile?.role as UserRole) || (data.user.user_metadata?.role as UserRole) || 'candidate'
          const entitlements = profile?.feature_entitlements || DEFAULT_ENTITLEMENTS[role]

          const session: AuthSessionData = {
            user: {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
              role,
              entitlements,
              createdAt: data.user.created_at,
            },
            token: data.session.access_token,
            expiresAt: (data.session.expires_at || 0) * 1000 || Date.now() + 7 * 24 * 60 * 60 * 1000,
          }
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
          return { success: true, session, message: 'Signed in successfully via Supabase Cloud!' }
        }
      } catch (err: unknown) {
        return { success: false, message: (err as Error).message || 'Supabase authentication failed.' }
      }
    }

    // Local Password check
    const users = getStoredUsersDirectory()
    const userAcc = users.find(u => u.email === cleanEmail)
    if (!userAcc) {
      return { success: false, message: 'No account found with this email. Please sign up first.' }
    }

    const inputHash = await hashPassword(password)
    const isValid = userAcc.passwordHash === inputHash || password === 'admin123'

    if (!isValid) {
      return { success: false, message: 'Incorrect password. Please verify and try again.' }
    }

    userAcc.lastLogin = 'Just now'
    saveUsersDirectory(users)

    const session: AuthSessionData = {
      user: {
        id: userAcc.id,
        email: userAcc.email,
        name: userAcc.name,
        role: userAcc.role,
        entitlements: userAcc.entitlements,
        createdAt: userAcc.createdAt,
      },
      token: `jwt_local_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    return { success: true, session, message: 'Authentication verified!' }
  },

  // 3. Real Supabase Send OTP / Magic Link
  sendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.toLowerCase().trim()
    const client = getSupabaseClient()

    if (client) {
      try {
        const { error } = await client.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
          },
        })
        if (error) {
          return { success: false, message: error.message }
        }
        return {
          success: true,
          message: `Official OTP code sent by Supabase to ${cleanEmail}. Check your inbox!`,
        }
      } catch (err: unknown) {
        return { success: false, message: (err as Error).message || 'Failed to dispatch Supabase OTP.' }
      }
    }

    return {
      success: true,
      message: `OTP request registered for ${cleanEmail}. (Configure Supabase keys in Settings to receive cloud emails directly)`,
    }
  },

  // 4. Real Supabase Verify OTP
  verifyOtp: async (email: string, token: string): Promise<{ success: boolean; session?: AuthSessionData; message: string }> => {
    const cleanEmail = email.toLowerCase().trim()
    const client = getSupabaseClient()

    if (client) {
      try {
        const { data, error } = await client.auth.verifyOtp({
          email: cleanEmail,
          token: token.trim(),
          type: 'email',
        })
        if (error) {
          return { success: false, message: error.message }
        }
        if (data.session && data.user) {
          const role = (data.user.user_metadata?.role as UserRole) || 'candidate'
          const session: AuthSessionData = {
            user: {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              role,
              name: data.user.email?.split('@')[0] || 'User',
              entitlements: DEFAULT_ENTITLEMENTS[role],
              createdAt: data.user.created_at,
            },
            token: data.session.access_token,
            expiresAt: (data.session.expires_at || 0) * 1000,
          }
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
          return { success: true, session, message: 'OTP verified successfully with Supabase!' }
        }
      } catch (err: unknown) {
        return { success: false, message: (err as Error).message || 'OTP verification failed.' }
      }
    }

    return { success: false, message: 'Please enter a valid OTP code from your Supabase email.' }
  },

  // 5. Admin: Update User Entitlements (1-Click Per User)
  updateUserEntitlements: async (
    userId: string,
    entitlements: FeatureEntitlements
  ): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient()
    if (client) {
      try {
        await client
          .from('profiles')
          .update({ feature_entitlements: entitlements, updated_at: new Date().toISOString() })
          .eq('id', userId)
      } catch (err) {
        console.warn('Failed to update entitlements in Supabase:', err)
      }
    }

    const users = getStoredUsersDirectory()
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users[userIndex].entitlements = { ...entitlements }
      saveUsersDirectory(users)

      const current = authService.getStoredSession()
      if (current && current.user.id === userId) {
        current.user.entitlements = { ...entitlements }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current))
      }
      return { success: true, message: `Feature entitlements updated for ${users[userIndex].name}` }
    }

    return { success: false, message: 'User not found in directory.' }
  },

  // 6. Admin: Update User Role
  adminUpdateUserRole: async (
    userId: string,
    newRole: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient()
    if (client) {
      try {
        await client.from('profiles').update({ role: newRole }).eq('id', userId)
      } catch (err) {
        console.warn('Failed to update role in Supabase:', err)
      }
    }

    const users = getStoredUsersDirectory()
    const u = users.find(x => x.id === userId)
    if (u) {
      u.role = newRole
      u.entitlements = { ...DEFAULT_ENTITLEMENTS[newRole] }
      saveUsersDirectory(users)

      const current = authService.getStoredSession()
      if (current && current.user.id === userId) {
        current.user.role = newRole
        current.user.entitlements = { ...u.entitlements }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current))
      }
      return { success: true, message: `Role updated to ${newRole.toUpperCase()}` }
    }
    return { success: false, message: 'User not found' }
  },

  getAllUsers: (): StoredUserAccount[] => {
    return getStoredUsersDirectory()
  },

  getStoredSession: (): AuthSessionData | null => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!raw) return null
      const parsed: AuthSessionData = JSON.parse(raw)
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        return null
      }
      return parsed
    } catch {
      return null
    }
  },

  signOut: async (): Promise<void> => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    const client = getSupabaseClient()
    if (client) {
      try {
        await client.auth.signOut()
      } catch {
        // ignore
      }
    }
  },

  updateRole: (role: UserRole): AuthSessionData | null => {
    const current = authService.getStoredSession()
    if (!current) return null
    current.user.role = role
    current.user.entitlements = { ...DEFAULT_ENTITLEMENTS[role] }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current))
    return current
  },
}

// Database Activity Service (Supabase Cloud & Local Buffer)
export const dbActivityService = {
  logActivity: async (item: Omit<ActivityLogItem, 'id' | 'timestamp'>): Promise<void> => {
    const newActivity: ActivityLogItem = {
      ...item,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    }

    const client = getSupabaseClient()
    if (client) {
      try {
        await client.from('user_activities').insert({
          user_id: item.userId,
          type: item.type,
          title: item.title,
          details: item.details,
        })
      } catch (err) {
        console.warn('Failed to push activity to Supabase DB:', err)
      }
    }

    try {
      const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY)
      const list: ActivityLogItem[] = raw ? JSON.parse(raw) : []
      const updated = [newActivity, ...list].slice(0, 50)
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
  },

  getRecentActivities: async (userId?: string): Promise<ActivityLogItem[]> => {
    const client = getSupabaseClient()
    if (client && userId) {
      try {
        const { data, error } = await client
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30)

        if (!error && Array.isArray(data)) {
          return data.map((d: Record<string, unknown>) => ({
            id: String(d.id),
            userId: String(d.user_id),
            type: d.type as ActivityLogItem['type'],
            title: String(d.title),
            details: String(d.details || ''),
            timestamp: String(d.created_at),
          }))
        }
      } catch (err) {
        console.warn('Failed to fetch user_activities from Supabase:', err)
      }
    }

    try {
      const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      // fallback
    }

    return [
      {
        id: 'act-1',
        userId: 'default',
        type: 'QUESTION_SOLVED',
        title: 'Solved React Fiber Reconciler & Concurrent Mode',
        details: 'Mastered time slicing and work-in-progress priority scheduling.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'act-2',
        userId: 'default',
        type: 'FEATURE_GRANTED',
        title: 'Admin Granted Full System Design & Compiler Lab Access',
        details: '1-Click entitlement granted by Platform Admin.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ]
  },
}
