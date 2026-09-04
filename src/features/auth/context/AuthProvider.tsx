import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { Session, User, Provider } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase/client'
import { authService } from '../services/auth.service'
import { profileService } from '../services/profile.service'
import { auditService } from '../services/audit.service'
import { rbacService } from '../services/rbac.service'
import { progressSyncService } from '../services/progressSync.service'
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
  const name: string = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Candidate'
  const entitlements = metadata.feature_entitlements || DEFAULT_ENTITLEMENTS[role]

  return {
    id: user.id,
    email: user.email || '',
    name,
    role,
    avatarUrl: metadata.avatar_url,
    targetCompany: metadata.target_company || 'Google',
    experienceLevel: metadata.experience_level || 'L5 (Senior 5-9y)',
    entitlements,
    permissions: [],
    createdAt: user.created_at,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [rawUser, setRawUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<AuthUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authModalMode, setAuthModalMode] = useState<'user' | 'admin'>('user')
  // Track manual role overrides so TOKEN_REFRESHED doesn't wipe them
  const roleOverrideRef = React.useRef<UserRole | null>(null)

  // Load user profile from Supabase PostgreSQL database
  const syncProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setUserProfile(null)
      roleOverrideRef.current = null
      return
    }

    try {
      const dbProfile = await profileService.getProfile(user.id)
      if (dbProfile) {
        // If admin has manually switched role, keep that override
        const effectiveRole = roleOverrideRef.current || dbProfile.role
        // Merge: always grant what DEFAULT_ENTITLEMENTS says for this role
        // (fixes stale DB profiles that have old false defaults)
        const mergedEntitlements: FeatureEntitlements = {
          ...DEFAULT_ENTITLEMENTS[effectiveRole],
          ...dbProfile.entitlements,
          // Ensure any DB false doesn't downgrade what DEFAULT says true
          ...Object.fromEntries(
            Object.entries(DEFAULT_ENTITLEMENTS[effectiveRole]).filter(([, v]) => v)
          ),
        }
        setUserProfile({ ...dbProfile, role: effectiveRole, entitlements: mergedEntitlements })
      } else {
        // No profile row exists yet — create one directly with the user's real Supabase UUID
        const metadata = user.user_metadata || {}
        const name: string = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Candidate'
        const role: UserRole = roleOverrideRef.current || (metadata.role as UserRole) || 'candidate'

        const profilePayload: AuthUserProfile = {
          id: user.id,
          email: user.email || '',
          name,
          role,
          avatarUrl: metadata.avatar_url,
          targetCompany: metadata.target_company || 'Google',
          experienceLevel: metadata.experience_level || 'L5 (Senior 5-9y)',
          entitlements: DEFAULT_ENTITLEMENTS[role],
          permissions: role === 'admin' ? ['admin:all', 'admin:users_manage'] : [],
          status: 'ACTIVE',
          createdAt: user.created_at || new Date().toISOString(),
        }

        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email || '',
            full_name: name,
            role,
            target_company: profilePayload.targetCompany,
            experience_level: profilePayload.experienceLevel,
            feature_entitlements: profilePayload.entitlements,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
        } catch (err) {
          console.warn('[AuthProvider] Direct profile upsert error:', err)
        }

        setUserProfile(profilePayload)
      }
    } catch {
      setUserProfile(buildFallbackProfile(user))
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
                setUserProfile(JSON.parse(saved))
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
      } else if (event === 'SIGNED_OUT') {
        auditService.logEvent({
          action: 'AUTH_SIGN_OUT',
          resource: 'auth.session',
        })
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
      const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'shashi'
      const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@9999'

      if (usernameInput.trim() !== ADMIN_USERNAME || passwordInput !== ADMIN_PASSWORD) {
        return { success: false, message: 'Invalid administrator credentials. Access denied.' }
      }

      setIsLoading(true)
      const adminEmail = 'admin@interviewprep.com'

      try {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: ADMIN_PASSWORD,
        })

        if (signInErr) {
          await supabase.auth.signUp({
            email: adminEmail,
            password: ADMIN_PASSWORD,
            options: {
              data: { full_name: 'Platform Administrator', role: 'admin' },
            },
          })
        } else if (signInData.session) {
          setSession(signInData.session)
          setRawUser(signInData.user)
        }
      } catch (authErr) {
        console.warn('[AuthProvider] Supabase admin auth error:', authErr)
      }

      roleOverrideRef.current = 'admin'
      const adminProfile: AuthUserProfile = {
        id: 'admin_super_user',
        email: adminEmail,
        name: 'Platform Administrator',
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
        details: { adminEmail, username: usernameInput.trim() },
      })

      return { success: true, message: 'Administrator access authenticated successfully.' }
    },
    []
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
    const result = await authService.signIn(params)
    setIsLoading(false)
    if (result.success && result.session) {
      setIsAuthModalOpen(false)
    }
    return result
  }, [])

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
      if (updates.name) dbUpdates.full_name = updates.name
      if (updates.targetCompany) dbUpdates.target_company = updates.targetCompany
      if (updates.experienceLevel) dbUpdates.experience_level = updates.experienceLevel
      if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl
      if (updates.entitlements) dbUpdates.feature_entitlements = updates.entitlements

      const res = await profileService.updateProfile(userProfile.id, dbUpdates)
      if (res.success) {
        setUserProfile(prev => (prev ? { ...prev, ...updates } : null))
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

      const list: StoredUserAccount[] = profiles.map(p => {
        const userProgress = progressMap[p.id]
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
          solvedCount: progressMap[userProfile.id]?.solvedCount || 0,
          streak: progressMap[userProfile.id]?.streak || 0,
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
