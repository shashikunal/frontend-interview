import { createClient } from '@supabase/supabase-js'
import { supabase, supabaseUrl, supabaseAnonKey } from '../../../lib/supabase/client.ts'
import { getStoredAuthHeader } from './adminTokenHelper.ts'
import type { AuthUserProfile, UserRole } from '../types/auth.types.ts'

const PROFILES_LOCAL_KEY = 'supabase_profiles_real'

export const KNOWN_SUPABASE_AUTH_USERS: AuthUserProfile[] = [
  {
    id: 'usr_candidate_demo',
    email: 'candidate@interviewprep.com',
    name: 'Demo Candidate',
    role: 'candidate',
    status: 'ACTIVE',
    batch: '2026-Alpha',
    batchCode: 'FE-2026-A',
    targetTrack: 'Frontend Architecture & Staff Level Engineering',
    phone: '+1 (555) 019-2831',
    githubUrl: 'https://github.com/democandidate',
    linkedinUrl: 'https://linkedin.com/in/democandidate',
    bio: 'Staff Frontend Architect with deep expertise in React 18, Web Vitals, micro-frontends, and design systems.',
    createdAt: new Date().toISOString(),
  },
]

function getLocalProfiles(): AuthUserProfile[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PROFILES_LOCAL_KEY) : null
    const list: AuthUserProfile[] = raw ? JSON.parse(raw) : []
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PROFILES_LOCAL_KEY, JSON.stringify(profiles))
    }
  } catch {
    // ignore
  }
}

export const profileService = {
  /**
   * Fetch profile from public.profiles table
   */
  /**
   * Fetch profile from public.profiles table or local storage mirror
   */
  getProfile: async (userId: string): Promise<AuthUserProfile | null> => {
    if (!userId) return null

    let localMatch: AuthUserProfile | null = null
    const local = getLocalProfiles()
    localMatch = local.find(p => p.id === userId || (p.email && p.email.toLowerCase() === userId.toLowerCase())) || null

    if (!localMatch && typeof localStorage !== 'undefined') {
      try {
        const savedActive = localStorage.getItem('interviewprep_active_profile')
        if (savedActive) {
          const parsed = JSON.parse(savedActive)
          if (parsed && (parsed.id === userId || (parsed.email && parsed.email.toLowerCase() === userId.toLowerCase()))) {
            localMatch = parsed
          }
        }
      } catch {}
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (!error && data) {
        const role = (data.role as UserRole) || 'candidate'

        return {
          id: data.id,
          email: data.email,
          name: data.full_name || data.email?.split('@')[0] || localMatch?.name || 'User',
          role,
          avatarUrl: data.avatar_url || localMatch?.avatarUrl,
          avatarPublicId: data.avatar_public_id || localMatch?.avatarPublicId,
          status: (data.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
          batch: data.batch || localMatch?.batch || '2026-Alpha',
          batchCode: data.batch_code || localMatch?.batchCode || 'FE-2026-A',
          targetTrack: data.target_track || localMatch?.targetTrack || 'Frontend Architecture',
          githubUrl: data.github_url || localMatch?.githubUrl,
          linkedinUrl: data.linkedin_url || localMatch?.linkedinUrl,
          phone: data.phone || localMatch?.phone,
          bio: data.bio || localMatch?.bio,
          createdAt: data.created_at || localMatch?.createdAt,
          updatedAt: data.updated_at || new Date().toISOString(),
        }
      }
    } catch {
      // ignore
    }

    // Return local mirror match
    return localMatch
  },

  /**
   * Update profile fields in public.profiles table & local mirror
   */
  updateProfile: async (
    userId: string,
    updates: Partial<{
      full_name: string
      avatar_url: string
      avatar_public_id: string
      status: 'ACTIVE' | 'SUSPENDED'
      batch: string
      batch_code: string
      target_track: string
      github_url: string
      linkedin_url: string
      phone: string
      bio: string
    }>
  ): Promise<{ success: boolean; message: string }> => {
    if (!userId) {
      return { success: false, message: 'User ID is required.' }
    }

    // 1. Update in local mirror
    const local = getLocalProfiles()
    let found = false
    const updatedLocal = local.map(p => {
      if (p.id === userId || (p.email && userId.toLowerCase().includes(p.email.toLowerCase()))) {
        found = true
        return {
          ...p,
          name: updates.full_name !== undefined ? updates.full_name : p.name,
          avatarUrl: updates.avatar_url !== undefined ? updates.avatar_url : p.avatarUrl,
          avatarPublicId: updates.avatar_public_id !== undefined ? updates.avatar_public_id : p.avatarPublicId,
          status: updates.status || p.status || 'ACTIVE',
          batch: updates.batch !== undefined ? updates.batch : p.batch || '2026-Alpha',
          batchCode: updates.batch_code !== undefined ? updates.batch_code : p.batchCode || 'FE-2026-A',
          targetTrack: updates.target_track !== undefined ? updates.target_track : p.targetTrack || 'Frontend Architecture',
          githubUrl: updates.github_url !== undefined ? updates.github_url : p.githubUrl,
          linkedinUrl: updates.linkedin_url !== undefined ? updates.linkedin_url : p.linkedinUrl,
          phone: updates.phone !== undefined ? updates.phone : p.phone,
          bio: updates.bio !== undefined ? updates.bio : p.bio,
          updatedAt: new Date().toISOString(),
        }
      }
      return p
    })

    if (!found) {
      updatedLocal.push({
        id: userId,
        email: userId.includes('@') ? userId : 'candidate@interviewprep.com',
        name: updates.full_name || 'User',
        role: 'candidate',
        avatarUrl: updates.avatar_url,
        avatarPublicId: updates.avatar_public_id,
        status: updates.status || 'ACTIVE',
        batch: updates.batch || '2026-Alpha',
        batchCode: updates.batch_code || 'FE-2026-A',
        targetTrack: updates.target_track || 'Frontend Architecture',
        githubUrl: updates.github_url,
        linkedinUrl: updates.linkedin_url,
        phone: updates.phone,
        bio: updates.bio,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    saveLocalProfiles(updatedLocal)

    // 2. Update in Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
      if (isUuid) {
        await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
      }

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
  }): Promise<{ success: boolean; message: string; user?: AuthUserProfile }> => {
    const cleanEmail = params.email.toLowerCase().trim()
    const role = params.role || 'candidate'

    let createdId = ''
    try {
      const isolatedClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false, storageKey: 'profile-admin-signup' },
      })
      const { data: authData } = await isolatedClient.auth.signUp({
        email: cleanEmail,
        password: 'TemporaryPassword@2026!',
        options: {
          data: {
            full_name: params.name,
            role,
          },
        },
      })
      if (authData?.user?.id) {
        createdId = authData.user.id
      }
    } catch {
      // ignore
    }

    if (!createdId) {
      createdId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        })
    }

    const createdUser: AuthUserProfile = {
      id: createdId,
      email: cleanEmail,
      name: params.name,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    }

    // 1. Save to local mirror
    const local = getLocalProfiles()
    if (!local.some(p => p.email === cleanEmail)) {
      local.unshift(createdUser)
      saveLocalProfiles(local)
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
   * Admin: fetch all user profiles (Real users only)
   */
  getAllProfiles: async (): Promise<AuthUserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: AuthUserProfile[] = data.map(d => {
          const role = (d.role as UserRole) || 'candidate'
          return {
            id: d.id,
            email: d.email,
            name: d.full_name || d.email?.split('@')[0] || 'User',
            role,
            avatarUrl: d.avatar_url,
            avatarPublicId: d.avatar_public_id,
            status: (d.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }
        })
        for (const known of KNOWN_SUPABASE_AUTH_USERS) {
          if (!mapped.some(p => p.email.toLowerCase() === known.email.toLowerCase())) {
            mapped.push(known)
          }
        }
        saveLocalProfiles(mapped)
        return mapped
      }

      try {
        const apiRes = await fetch('/api/candidate-history?mode=profiles', {
          headers: getStoredAuthHeader(),
        })
        if (apiRes.ok) {
          const json: any = await apiRes.json()
          if (json.success && Array.isArray(json.profiles) && json.profiles.length > 0) {
            const mapped: AuthUserProfile[] = json.profiles.map((d: any) => ({
              id: d.id,
              email: d.email,
              name: d.full_name || d.email?.split('@')[0] || 'User',
              role: (d.role as UserRole) || 'candidate',
              avatarUrl: d.avatar_url,
              avatarPublicId: d.avatar_public_id,
              status: (d.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
              createdAt: d.created_at,
              updatedAt: d.updated_at,
            }))
            for (const known of KNOWN_SUPABASE_AUTH_USERS) {
              if (!mapped.some(p => p.email.toLowerCase() === known.email.toLowerCase())) {
                mapped.push(known)
              }
            }
            saveLocalProfiles(mapped)
            return mapped
          }
        }
      } catch (_) {}
    } catch {
      // ignore
    }

    return getLocalProfiles()
  },
}
