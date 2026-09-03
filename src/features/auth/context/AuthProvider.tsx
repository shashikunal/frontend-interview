import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { Session, User, Provider } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase/client'
import { authService } from '../services/auth.service'
import { profileService } from '../services/profile.service'
import { auditService } from '../services/audit.service'
import { rbacService } from '../services/rbac.service'
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

  // Load user profile from Supabase PostgreSQL database
  const syncProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setUserProfile(null)
      return
    }

    try {
      const dbProfile = await profileService.getProfile(user.id)
      if (dbProfile) {
        setUserProfile(dbProfile)
      } else {
        setUserProfile(buildFallbackProfile(user))
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
          await syncProfile(currentSession?.user ?? null)
        }
      } catch (err) {
        console.warn('[Supabase Auth] Session restoration failed:', err)
        if (isMounted) {
          setSession(null)
          setRawUser(null)
          setUserProfile(null)
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
  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), [])
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), [])

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
      setUserProfile(prev => {
        if (!prev) {
          return {
            id: 'demo_user',
            email: 'candidate@faang.io',
            name: 'Demo Candidate',
            role: newRole,
            entitlements: DEFAULT_ENTITLEMENTS[newRole],
            permissions: [],
            createdAt: new Date().toISOString(),
          }
        }
        return {
          ...prev,
          role: newRole,
          entitlements: DEFAULT_ENTITLEMENTS[newRole],
        }
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

  const getAllUsers = useCallback((): StoredUserAccount[] => {
    return [
      {
        id: userProfile?.id || 'usr_current',
        email: userProfile?.email || 'user@faang.io',
        name: userProfile?.name || 'Current User',
        role: userProfile?.role || 'candidate',
        entitlements: userProfile?.entitlements || DEFAULT_ENTITLEMENTS.candidate,
        status: 'ACTIVE',
        solvedCount: 24,
        streak: 7,
        lastLogin: 'Active now',
        createdAt: userProfile?.createdAt || new Date().toISOString(),
      },
    ]
  }, [userProfile])

  const value: AuthContextValue = useMemo(
    () => ({
      user: userProfile,
      rawUser,
      session,
      role: userProfile?.role || 'guest',
      permissions: userProfile?.permissions || [],
      isAuthenticated: Boolean(session && userProfile),
      isLoading,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
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
      openAuthModal,
      closeAuthModal,
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
