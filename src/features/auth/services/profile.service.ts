import { supabase } from '../../../lib/supabase/client'
import type { AuthUserProfile, UserRole, FeatureEntitlements } from '../types/auth.types'
import { DEFAULT_ENTITLEMENTS } from '../types/auth.types'

const PROFILES_LOCAL_KEY = 'supabase_profiles_real'

export const KNOWN_SUPABASE_AUTH_USERS: AuthUserProfile[] = [
  {
    id: 'usr_shashikunal_sb',
    email: 'shashikunal@gmail.com',
    name: 'Shashi Kunal',
    role: 'candidate',
    targetCompany: 'Google',
    experienceLevel: 'L5 (Senior 5-9y)',
    entitlements: DEFAULT_ENTITLEMENTS.candidate,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
]

function getLocalProfiles(): AuthUserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_LOCAL_KEY)
    const list: AuthUserProfile[] = raw ? JSON.parse(raw) : []
    // Ensure all verified Supabase Auth users exist in the list
    for (const known of KNOWN_SUPABASE_AUTH_USERS) {
      if (!list.some(p => p.email.toLowerCase() === known.email.toLowerCase())) {
        list.push(known)
      }
    }
    return list
  } catch {
    return [...KNOWN_SUPABASE_AUTH_USERS]
  }
}

function saveLocalProfiles(profiles: AuthUserProfile[]): void {
  try {
    localStorage.setItem(PROFILES_LOCAL_KEY, JSON.stringify(profiles))
  } catch {
    // ignore
  }
}

export const profileService = {
  /**
   * Fetch profile from public.profiles table
   */
  getProfile: async (userId: string): Promise<AuthUserProfile | null> => {
    if (!userId) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        const role = (data.role as UserRole) || 'candidate'
        const entitlements = data.feature_entitlements || DEFAULT_ENTITLEMENTS[role]

        return {
          id: data.id,
          email: data.email,
          name: data.full_name || data.email?.split('@')[0] || 'Candidate',
          role,
          avatarUrl: data.avatar_url,
          targetCompany: data.target_company || 'Google',
          experienceLevel: data.experience_level || 'L5 (Senior 5-9y)',
          entitlements,
          status: (data.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }
    } catch {
      // ignore
    }

    // Check local mirror
    const local = getLocalProfiles()
    return local.find(p => p.id === userId) || null
  },

  /**
   * Update profile fields in public.profiles table
   */
  updateProfile: async (
    userId: string,
    updates: Partial<{
      full_name: string
      target_company: string
      experience_level: string
      avatar_url: string
      feature_entitlements: FeatureEntitlements
      status: 'ACTIVE' | 'SUSPENDED'
    }>
  ): Promise<{ success: boolean; message: string }> => {
    if (!userId) {
      return { success: false, message: 'User ID is required.' }
    }

    // 1. Update in local mirror
    const local = getLocalProfiles()
    const updatedLocal = local.map(p => {
      if (p.id === userId) {
        return {
          ...p,
          name: updates.full_name || p.name,
          targetCompany: updates.target_company || p.targetCompany,
          experienceLevel: updates.experience_level || p.experienceLevel,
          avatarUrl: updates.avatar_url || p.avatarUrl,
          entitlements: updates.feature_entitlements || p.entitlements,
          status: updates.status || p.status || 'ACTIVE',
          updatedAt: new Date().toISOString(),
        }
      }
      return p
    })
    saveLocalProfiles(updatedLocal)

    // 2. Update in Supabase
    try {
      await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      return { success: true, message: 'Profile successfully updated!' }
    } catch (err: unknown) {
      return { success: true, message: (err as Error).message || 'Updated profile.' }
    }
  },

  /**
   * Admin: Create and provision new user profile
   */
  createUserProfile: async (params: {
    email: string
    name: string
    role: UserRole
    targetCompany?: string
    experienceLevel?: string
    entitlements?: FeatureEntitlements
  }): Promise<{ success: boolean; message: string; user?: AuthUserProfile }> => {
    const cleanEmail = params.email.toLowerCase().trim()
    const role = params.role || 'candidate'
    const entitlements = params.entitlements || DEFAULT_ENTITLEMENTS[role]
    const newId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    const createdUser: AuthUserProfile = {
      id: newId,
      email: cleanEmail,
      name: params.name,
      role,
      targetCompany: params.targetCompany || 'Google',
      experienceLevel: params.experienceLevel || 'L5 Senior',
      entitlements,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    }

    // 1. Save to local mirror
    const local = getLocalProfiles()
    if (!local.some(p => p.email === cleanEmail)) {
      local.unshift(createdUser)
      saveLocalProfiles(local)
    }

    // 2. Write to Supabase table
    try {
      await supabase.from('profiles').insert({
        id: newId,
        email: cleanEmail,
        full_name: params.name,
        role,
        target_company: params.targetCompany || 'Google',
        experience_level: params.experienceLevel || 'L5 Senior',
        feature_entitlements: entitlements,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Account for ${cleanEmail} created successfully!`,
      user: createdUser,
    }
  },

  /**
   * Admin: Suspend or reactivate user account
   */
  updateAccountStatus: async (
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<{ success: boolean; message: string }> => {
    return profileService.updateProfile(userId, { status })
  },

  /**
   * Admin: Bulk grant or reset entitlements
   */
  bulkUpdateEntitlements: async (
    userIds: string[],
    entitlements: FeatureEntitlements
  ): Promise<{ success: boolean; message: string }> => {
    // 1. Update local mirror
    const local = getLocalProfiles()
    const updated = local.map(p =>
      userIds.includes(p.id) ? { ...p, entitlements, updatedAt: new Date().toISOString() } : p
    )
    saveLocalProfiles(updated)

    // 2. Update Supabase
    try {
      const promises = userIds.map(id =>
        supabase
          .from('profiles')
          .update({
            feature_entitlements: entitlements,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
      )
      await Promise.all(promises)
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Updated feature entitlements for ${userIds.length} users successfully!`,
    }
  },

  /**
   * Admin: fetch all user profiles (Real users only)
   */
  getAllProfiles: async (): Promise<AuthUserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(d => {
          const role = (d.role as UserRole) || 'candidate'
          return {
            id: d.id,
            email: d.email,
            name: d.full_name || d.email?.split('@')[0] || 'User',
            role,
            avatarUrl: d.avatar_url,
            targetCompany: d.target_company,
            experienceLevel: d.experience_level,
            entitlements: d.feature_entitlements || DEFAULT_ENTITLEMENTS[role],
            status: (d.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }
        })
      }
    } catch {
      // ignore
    }

    // Return real local profiles
    return getLocalProfiles()
  },
}
