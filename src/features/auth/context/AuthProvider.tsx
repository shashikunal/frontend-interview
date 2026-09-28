import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { Session, User, Provider } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase/client'
import { authService } from '../services/auth.service'
import { profileService } from '../services/profile.service'
import { auditService } from '../services/audit.service'
import { rbacService } from '../services/rbac.service'
import { progressSyncService } from '../services/progressSync.service'
import { trackingService } from '../../../lib/trackingService'
import { geoTelemetryService } from '../../../services/geoTelemetryService'
import type {
  AuthContextValue,
  AuthUserProfile,
  UserRole,
  FeatureEntitlements,
  SignUpCredentials,
  SignInCredentials,
  AuthActionResult,
  StoredUserAccount,
} from '../types/auth.types'
import { DEFAULT_ENTITLEMENTS } from '../types/auth.types'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  candidate: 1,
  pro_member: 2,
  interviewer: 3,
  admin: 4,
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function buildFallbackProfile(user: User | null): AuthUserProfile | null {
  if (!user) return null

  const metadata = user.user_metadata || {}
  const role: UserRole = (metadata.role as UserRole) || 'candidate'
  const name: string = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User'
  const entitlements = metadata.feature_entitlements || DEFAULT_ENTITLEMENTS[role]

  return {
    id: user.id,
    email: user.email || '',
    name,
    role,
    avatarUrl: metadata.avatar_url,
    avatarPublicId: metadata.avatar_public_id,
    entitlements,
    permissions: [],
    createdAt: user.created_at,
  }
}

import { mcProgressService } from '../../../components/machinecoding/lib/mcProgressService'
import { docsProgressService } from '../../interview-docs/services/docsProgressService'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [rawUser, setRawUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authModalMode, setAuthModalMode] = useState<'user' | 'admin'>('user')
  // Track manual role overrides so TOKEN_REFRESHED doesn't wipe them
  const roleOverrideRef = React.useRef<UserRole | null>(null)

  // Synchronize candidate isolation across Machine Coding & Docs syllabus progress
  useEffect(() => {
    const effectiveUserId = userProfile?.id || session?.user?.id || null
    mcProgressService.setUserId(effectiveUserId)
    docsProgressService.setUserId(effectiveUserId)
  }, [userProfile?.id, session?.user?.id])

  // Load user profile from Supabase PostgreSQL database
  const syncProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setUserProfile(null)
      roleOverrideRef.current = null
      return
    }

    try {
      const dbProfile = await profileService.getProfile(user.id)
      let savedActive: Partial<AuthUserProfile> | null = null
      try {
        const rawSaved = typeof localStorage !== 'undefined' ? localStorage.getItem('interviewprep_active_profile') : null
        if (rawSaved) savedActive = JSON.parse(rawSaved)
      } catch {}

      if (dbProfile) {
        // If admin has manually switched role, keep that override
        const effectiveRole = roleOverrideRef.current || dbProfile.role
        // Merge: always grant what DEFAULT_ENTITLEMENTS says for this role
        const mergedEntitlements: FeatureEntitlements = {
          ...DEFAULT_ENTITLEMENTS[effectiveRole],
          ...dbProfile.entitlements,
          ...Object.fromEntries(
            Object.entries(DEFAULT_ENTITLEMENTS[effectiveRole]).filter(([, v]) => v)
          ),
        }
        const finalProfile: AuthUserProfile = {
          ...dbProfile,
          role: effectiveRole,
          entitlements: mergedEntitlements,
          avatarUrl: dbProfile.avatarUrl || savedActive?.avatarUrl,
          avatarPublicId: dbProfile.avatarPublicId || savedActive?.avatarPublicId,
          batch: dbProfile.batch || savedActive?.batch || '2026-Alpha',
          batchCode: dbProfile.batchCode || savedActive?.batchCode || 'FE-2026-A',
        }
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('interviewprep_active_profile', JSON.stringify(finalProfile))
          }
        } catch {}
        setUserProfile(finalProfile)
      } else {
        // No profile row exists yet — create one directly with the user's real Supabase UUID
        const metadata = user.user_metadata || {}
        const name: string = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User'
        const role: UserRole = roleOverrideRef.current || (metadata.role as UserRole) || 'candidate'

        const profilePayload: AuthUserProfile = {
          id: user.id,
          email: user.email || '',
          name,
          role,
          avatarUrl: savedActive?.avatarUrl || metadata.avatar_url,
          avatarPublicId: savedActive?.avatarPublicId || metadata.avatar_public_id,
          entitlements: DEFAULT_ENTITLEMENTS[role],
          permissions: role === 'admin' ? ['admin:all', 'admin:users_manage'] : [],
          status: 'ACTIVE',
          batch: savedActive?.batch || '2026-Alpha',
          batchCode: savedActive?.batchCode || 'FE-2026-A',
          createdAt: user.created_at || new Date().toISOString(),
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)
        if (isUuid) {
          try {
            const { error: upsertError } = await supabase.from('profiles').upsert({
              id: user.id,
              email: user.email || '',
              full_name: name,
              role,
              feature_entitlements: profilePayload.entitlements,
              is_active: true,
              updated_at: new Date().toISOString(),
            })
            if (upsertError && import.meta.env?.DEV) {
              console.warn('[CORE] profile upsert', { code: (upsertError as { code?: string }).code, message: upsertError.message })
            }
          } catch (err) {
            console.warn('[AuthProvider] Direct profile upsert error:', err)
          }
        }

        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('interviewprep_active_profile', JSON.stringify(profilePayload))
          }
        } catch {}
        setUserProfile(profilePayload)
      }
    } catch {
      const fallback = buildFallbackProfile(user)
      try {
        if (fallback && typeof localStorage !== 'undefined') {
          localStorage.setItem('interviewprep_active_profile', JSON.stringify(fallback))
        }
      } catch {}
      setUserProfile(fallback)
    }
  }, [])

  // 1. Initial Session Restoration & Listener
  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (isMounted) {
          const currentSession = data.session
          setSession(currentSession)
          setRawUser(currentSession?.user ?? null)
          if (currentSession?.user) {
            await syncProfile(currentSession.user)
          } else {
            try {
              const saved = localStorage.getItem('interviewprep_active_profile')
              if (saved) {
                const parsed = JSON.parse(saved)
                setUserProfile(parsed)
                if (parsed?.role === 'admin') {
                  fetch('/api/admin-auth?action=session')
                    .then(r => r.json())
                    .then(sessData => {
                      if (sessData.success && sessData.session?.access_token) {
                        supabase.auth.setSession({
                          access_token: sessData.session.access_token,
                          refresh_token: sessData.session.refresh_token,
                        })
                      }
                    })
                    .catch(() => {})
                }
              }
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.warn('[Supabase Auth] Session restoration failed:', err)
        if (isMounted) {
          setSession(null)
          setRawUser(null)
          try {
            const saved = localStorage.getItem('interviewprep_active_profile')
            if (saved) {
              setUserProfile(JSON.parse(saved))
            } else {
              setUserProfile(null)
            }
          } catch {
            setUserProfile(null)
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      setRawUser(newSession?.user ?? null)

      // TOKEN_REFRESHED / USER_UPDATED: don't re-sync profile from DB —
      // it would overwrite any manual switchRole() override the user made.
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setIsLoading(false)
        return
      }

      await syncProfile(newSession?.user ?? null)
      setIsLoading(false)

      if (event === 'SIGNED_IN' && newSession?.user) {
        auditService.logEvent({
          userId: newSession.user.id,
          action: 'AUTH_SIGN_IN',
          resource: 'auth.session',
          details: { email: newSession.user.email },
        })
        trackingService.trackActivity('login', 'user', newSession.user.id, {
          email: newSession.user.email,
        })
        geoTelemetryService.recordLoginSession({
          id: newSession.user.id,
          email: newSession.user.email || 'user@interviewprep.com',
          name: newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0],
          role: userProfile?.role || 'candidate',
        }).catch(() => {})
      } else if (event === 'SIGNED_OUT') {
        auditService.logEvent({
          action: 'AUTH_SIGN_OUT',
          resource: 'auth.session',
        })
        trackingService.trackActivity('logout', 'user', undefined)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [syncProfile])

  // 2. Auth Actions
  const openAuthModal = useCallback((mode: 'user' | 'admin' = 'user') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }, [])
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), [])

  const loginAsAdmin = useCallback(
    async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; message: string }> => {
      const trimmedUser = usernameInput.trim()
      if (!trimmedUser || !passwordInput) {
        return { success: false, message: 'Please enter both administrator username and password.' }
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: trimmedUser, password: passwordInput }),
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || !result.success) {
          setIsLoading(false)
          return { success: false, message: result.error || 'Invalid administrator credentials. Access denied.' }
        }

        const adminEmail = result.user?.email || (trimmedUser.includes('@') ? trimmedUser : 'admin@interviewprep.com')
        const adminName = result.user?.name || (trimmedUser.includes('@') ? trimmedUser.split('@')[0] : 'Platform Administrator')

        // Optional Supabase session synchronization for Postgres RLS policies
        if (result.session?.access_token) {
          try {
            await supabase.auth.setSession({
              access_token: result.session.access_token,
              refresh_token: result.session.refresh_token,
            })
            setSession(result.session)
            setRawUser(result.session.user)
          } catch (authErr) {
            console.warn('[AuthProvider] Supabase setSession notice:', authErr)
          }
        }

        roleOverrideRef.current = 'admin'
        const adminProfile: AuthUserProfile = {
          id: result.user?.id || 'admin_super_user',
          email: adminEmail,
          name: adminName,
          role: 'admin',
          entitlements: DEFAULT_ENTITLEMENTS.admin,
          permissions: ['admin:all', 'admin:users_manage', 'admin:billing', 'admin:audit'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        }

        try {
          localStorage.setItem('interviewprep_active_profile', JSON.stringify(adminProfile))
        } catch {
          // ignore
        }

        setUserProfile(adminProfile)
        setIsLoading(false)
        setIsAuthModalOpen(false)

        await auditService.logEvent({
          action: 'ADMIN_SIGN_IN',
          resource: 'admin.auth',
          details: { adminEmail, username: trimmedUser },
        })

        geoTelemetryService.recordLoginSession({
          id: adminProfile.id,
          email: adminProfile.email,
          name: adminProfile.name,
          role: 'admin',
        }).catch(() => {})

        return { success: true, message: 'Administrator login successful.' }
      } catch (err: any) {
        setIsLoading(false)
        return { success: false, message: err?.message || 'Server connection failed during administrator authentication.' }
      }
    },
    [auditService]
  )

  const signUp = useCallback(async (params: SignUpCredentials): Promise<AuthActionResult> => {
    setIsLoading(true)
    const result = await authService.signUp(params)
    setIsLoading(false)
    if (result.success && result.session) {
      setIsAuthModalOpen(false)
    }
    return result
  }, [])

  const signIn = useCallback(async (params: SignInCredentials): Promise<AuthActionResult> => {
    setIsLoading(true)
    const cleanEmail = params.email.toLowerCase().trim()
    const isAdminCredential = cleanEmail === 'admin' || cleanEmail === 'admin@interviewprep.com' || cleanEmail.includes('admin')

    if (isAdminCredential) {
      const adminRes = await loginAsAdmin(params.email, params.password)
      setIsLoading(false)
      if (adminRes.success) {
        setIsAuthModalOpen(false)
        return { success: true, message: 'Welcome back, Administrator!' }
      }
    }

    const result = await authService.signIn(params)
    setIsLoading(false)
    if (result.success && result.session) {
      setIsAuthModalOpen(false)
    }
    return result
  }, [loginAsAdmin])

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    roleOverrideRef.current = null
    try {
      localStorage.removeItem('interviewprep_active_profile')
    } catch {
      // ignore
    }
    await authService.signOut()
    setSession(null)
    setRawUser(null)
    setUserProfile(null)
    setIsLoading(false)
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<AuthActionResult> => {
    return await authService.resetPassword(email)
  }, [])

  const updatePassword = useCallback(async (newPassword: string): Promise<AuthActionResult> => {
    return await authService.updatePassword(newPassword)
  }, [])

  const signInWithOAuth = useCallback(async (provider: Provider): Promise<AuthActionResult> => {
    return await authService.signInWithOAuth(provider)
  }, [])

  const sendOtp = useCallback(async (email: string) => {
    return await authService.signInWithOtp(email)
  }, [])

  const verifyOtp = useCallback(async (email: string, token: string) => {
    const res = await authService.verifyOtp(email, token)
    if (res.success && res.session) {
      setIsAuthModalOpen(false)
    }
    return res
  }, [])

  const switchRole = useCallback(
    (newRole: UserRole) => {
      // Persist the override so syncProfile won't wipe it on token refresh
      roleOverrideRef.current = newRole
      setUserProfile(prev => {
        let profile: AuthUserProfile
        if (!prev) {
          profile = {
            id: newRole === 'admin' ? 'admin_super_user' : 'user_candidate',
            email: newRole === 'admin' ? 'admin@interviewprep.com' : 'candidate@interviewprep.com',
            name: newRole === 'admin' ? 'Platform Administrator' : 'Candidate',
            role: newRole,
            entitlements: DEFAULT_ENTITLEMENTS[newRole],
            permissions: newRole === 'admin' ? ['admin:all', 'admin:users_manage'] : [],
            createdAt: new Date().toISOString(),
          }
        } else {
          profile = {
            ...prev,
            role: newRole,
            email: newRole === 'admin' && prev.email.includes('candidate') ? 'admin@interviewprep.com' : prev.email,
            name: newRole === 'admin' && prev.name.includes('Candidate') ? 'Platform Administrator' : prev.name,
            entitlements: DEFAULT_ENTITLEMENTS[newRole],
            permissions: newRole === 'admin' ? ['admin:all', 'admin:users_manage'] : prev.permissions,
          }
        }
        try {
          localStorage.setItem('interviewprep_active_profile', JSON.stringify(profile))
        } catch {
          // ignore
        }
        return profile
      })
    },
    []
  )

  const hasPermission = useCallback(
    (minRoleOrPermission: UserRole | string): boolean => {
      const currentRole = userProfile?.role || 'guest'

      if (minRoleOrPermission in ROLE_HIERARCHY) {
        return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[minRoleOrPermission as UserRole]
      }

      if (currentRole === 'admin') return true
      return Boolean(userProfile?.permissions?.includes(minRoleOrPermission))
    },
    [userProfile]
  )

  const hasFeature = useCallback(
    (featureKey: keyof FeatureEntitlements): boolean => {
      if (!userProfile) return Boolean(DEFAULT_ENTITLEMENTS.guest[featureKey])
      return Boolean(userProfile.entitlements?.[featureKey])
    },
    [userProfile]
  )

  const updateProfile = useCallback(
    async (updates: Partial<AuthUserProfile>): Promise<{ success: boolean; message: string }> => {
      if (!userProfile) return { success: false, message: 'Not signed in.' }

      const dbUpdates: Record<string, unknown> = {}
      if (updates.name !== undefined) dbUpdates.full_name = updates.name
      if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl
      if (updates.avatarPublicId !== undefined) dbUpdates.avatar_public_id = updates.avatarPublicId
      if (updates.entitlements !== undefined) dbUpdates.feature_entitlements = updates.entitlements
      if (updates.batch !== undefined) dbUpdates.batch = updates.batch
      if (updates.batchCode !== undefined) dbUpdates.batch_code = updates.batchCode
      if (updates.targetTrack !== undefined) dbUpdates.target_track = updates.targetTrack
      if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl
      if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio

      const res = await profileService.updateProfile(userProfile.id, dbUpdates as any)
      if (res.success) {
        setUserProfile(prev => {
          if (!prev) return null
          const nextProfile = { ...prev, ...updates }
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('interviewprep_active_profile', JSON.stringify(nextProfile))
            }
          } catch {}
          return nextProfile
        })
      }
      return res
    },
    [userProfile]
  )

  // Compatibility helpers for existing UI components
  const signUpWithPassword = useCallback(
    async (email: string, password: string, fullName: string) => {
      const res = await signUp({ email, password, fullName })
      return {
        success: res.success,
        needsEmailConfirmation: res.needsEmailConfirmation,
        message: res.message,
      }
    },
    [signUp]
  )

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const res = await signIn({ email, password })
      return {
        success: res.success,
        message: res.message,
      }
    },
    [signIn]
  )

  const updateUserEntitlements = useCallback(async (userId: string, entitlements: FeatureEntitlements) => {
    const res = await rbacService.updateEntitlements(userId, entitlements)
    if (userProfile && userProfile.id === userId) {
      setUserProfile(prev => (prev ? { ...prev, entitlements } : null))
    }
    return res
  }, [userProfile])

  const adminUpdateUserRole = useCallback(async (userId: string, newRole: UserRole) => {
    const res = await rbacService.assignUserRole(userId, newRole)
    if (userProfile && userProfile.id === userId) {
      switchRole(newRole)
    }
    return res
  }, [userProfile, switchRole])

  const getAllUsers = useCallback(async (): Promise<StoredUserAccount[]> => {
    try {
      const [profiles, progressMap] = await Promise.all([
        profileService.getAllProfiles(),
        progressSyncService.getAllUsersProgress().catch(() => ({})),
      ])

      const progressRecord = progressMap as Record<string, any>
      const list: StoredUserAccount[] = profiles.map(p => {
        const userProgress = progressRecord[p.id]
        return {
          id: p.id,
          email: p.email,
          name: p.name,
          role: p.role,
          entitlements: p.entitlements,
          status: p.status || 'ACTIVE',
          solvedCount: userProgress?.solvedCount || 0,
          streak: userProgress?.streak || 0,
          lastLogin: userProgress?.lastActive ? new Date(userProgress.lastActive).toLocaleDateString() : 'Active recently',
          createdAt: p.createdAt || new Date().toISOString(),
        }
      })

      // If current admin user is active and not yet in the Supabase profiles list, merge admin
      if (userProfile && !list.some(u => u.id === userProfile.id || u.email === userProfile.email)) {
        list.unshift({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          entitlements: userProfile.entitlements,
          status: userProfile.status || 'ACTIVE',
          solvedCount: progressRecord[userProfile.id]?.solvedCount || 0,
          streak: progressRecord[userProfile.id]?.streak || 0,
          lastLogin: 'Active now',
          createdAt: userProfile.createdAt || new Date().toISOString(),
        })
      }

      return list
    } catch (err) {
      console.warn('[AuthProvider] getAllUsers error:', err)
      return []
    }
  }, [userProfile])

  const value: AuthContextValue = useMemo(
    () => ({
      user: userProfile,
      rawUser,
      session,
      role: userProfile?.role || 'guest',
      permissions: userProfile?.permissions || [],
      isAuthenticated: Boolean(userProfile),
      isLoading,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      loginAsAdmin,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      signInWithOAuth,
      sendOtp,
      verifyOtp,
      switchRole,
      hasPermission,
      hasFeature,
      updateProfile,
      signUpWithPassword,
      signInWithPassword,
      updateUserEntitlements,
      adminUpdateUserRole,
      getAllUsers,
    }),
    [
      userProfile,
      rawUser,
      session,
      isLoading,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      loginAsAdmin,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      signInWithOAuth,
      sendOtp,
      verifyOtp,
      switchRole,
      hasPermission,
      hasFeature,
      updateProfile,
      signUpWithPassword,
      signInWithPassword,
      updateUserEntitlements,
      adminUpdateUserRole,
      getAllUsers,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
