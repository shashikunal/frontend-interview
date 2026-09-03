import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getSupabaseClient,
  getSupabaseConfig,
  saveSupabaseConfig,
  authService,
  DEFAULT_ENTITLEMENTS,
  type AuthSessionData,
  type FeatureEntitlements,
  type UserRole,
  type StoredUserAccount,
} from '../lib/supabase'
import { emailService } from '../lib/emailService'

export type { UserRole, FeatureEntitlements, StoredUserAccount }

export interface AuthUser {
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

export interface AuthContextType {
  user: AuthUser | null
  session: AuthSessionData | null
  role: UserRole
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  // Password Auth
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<{ success: boolean; needsEmailConfirmation?: boolean; message: string }>
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  // OTP Auth
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  switchRole: (newRole: UserRole) => void
  hasPermission: (minRole: UserRole) => boolean
  hasFeature: (featureKey: keyof FeatureEntitlements) => boolean
  // Admin Operations
  updateUserEntitlements: (userId: string, entitlements: FeatureEntitlements) => Promise<{ success: boolean; message: string }>
  adminUpdateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; message: string }>
  getAllUsers: () => StoredUserAccount[]
  // Dynamic Supabase Configuration
  supabaseConfig: { url: string; anonKey: string; isConfigured: boolean }
  updateSupabaseConfig: (url: string, anonKey: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  candidate: 1,
  pro_member: 2,
  interviewer: 3,
  admin: 4,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSessionData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [supabaseConfig, setSupabaseConfigState] = useState(getSupabaseConfig())

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = getSupabaseClient()
        if (client) {
          const { data } = await client.auth.getSession()
          if (data.session && data.session.user) {
            const sbUser = data.session.user
            const { data: profile } = await client.from('profiles').select('*').eq('id', sbUser.id).single()
            const role = (profile?.role as UserRole) || (sbUser.user_metadata?.role as UserRole) || 'candidate'
            const entitlements = profile?.feature_entitlements || DEFAULT_ENTITLEMENTS[role]

            setSession({
              user: {
                id: sbUser.id,
                email: sbUser.email || '',
                role,
                name: profile?.full_name || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
                entitlements,
                createdAt: sbUser.created_at,
              },
              token: data.session.access_token,
              expiresAt: (data.session.expires_at || 0) * 1000,
            })
          } else {
            setSession(authService.getStoredSession())
          }
        } else {
          setSession(authService.getStoredSession())
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [supabaseConfig])

  // Update Supabase Config dynamically
  const updateSupabaseConfig = (url: string, anonKey: string) => {
    saveSupabaseConfig(url, anonKey)
    setSupabaseConfigState(getSupabaseConfig())
  }

  // 1. Sign Up with Password
  const signUpWithPassword = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; needsEmailConfirmation?: boolean; message: string }> => {
    const cleanEmail = email.trim()
    const res = await authService.signUpWithPassword(cleanEmail, password, fullName)
    if (res.success && res.session) {
      setSession(res.session)
      await emailService.sendConfirmationEmail(cleanEmail, res.session.user.name, res.session.user.role)
    }
    return res
  }

  // 2. Sign In with Password
  const signInWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim()
    const res = await authService.signInWithPassword(cleanEmail, password)
    if (res.success && res.session) {
      setSession(res.session)
      await emailService.sendConfirmationEmail(cleanEmail, res.session.user.name, res.session.user.role)
    }
    return { success: res.success, message: res.message }
  }

  // 3. Send OTP
  const sendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim()
    return await authService.sendOtp(cleanEmail)
  }

  // 4. Verify OTP
  const verifyOtp = async (email: string, token: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim()
    const res = await authService.verifyOtp(cleanEmail, token)
    if (res.success && res.session) {
      setSession(res.session)
      await emailService.sendConfirmationEmail(cleanEmail, res.session.user.name, res.session.user.role)
    }
    return { success: res.success, message: res.message }
  }

  // 5. Sign out
  const signOut = async () => {
    await authService.signOut()
    setSession(null)
  }

  // 6. Switch role for testing authorization gates
  const switchRole = (newRole: UserRole) => {
    if (!session) {
      const mockSession: AuthSessionData = {
        user: {
          id: `usr_${Date.now()}`,
          email: `demo.${newRole}@faang.io`,
          role: newRole,
          name: `${newRole.toUpperCase()} User`,
          entitlements: { ...DEFAULT_ENTITLEMENTS[newRole] },
          createdAt: new Date().toISOString(),
        },
        token: `jwt_sb_${Math.random().toString(36).substring(2)}`,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }
      setSession(mockSession)
      localStorage.setItem('frontend_interview_auth_session', JSON.stringify(mockSession))
      return
    }

    const updated = authService.updateRole(newRole)
    if (updated) setSession({ ...updated })
  }

  // 7. Role Hierarchy checker
  const hasPermission = (minRole: UserRole): boolean => {
    const userRole = session?.user.role || 'guest'
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
  }

  // 8. Granular Feature Entitlement checker (Admin-controlled per user)
  const hasFeature = (featureKey: keyof FeatureEntitlements): boolean => {
    if (!session?.user) {
      return DEFAULT_ENTITLEMENTS.guest[featureKey] || false
    }
    if (session.user.role === 'admin') return true
    return Boolean(session.user.entitlements && session.user.entitlements[featureKey])
  }

  // 9. Admin: Update User Entitlements (1-Click Per User)
  const updateUserEntitlements = async (
    userId: string,
    entitlements: FeatureEntitlements
  ): Promise<{ success: boolean; message: string }> => {
    const res = await authService.updateUserEntitlements(userId, entitlements)
    if (res.success && session?.user.id === userId) {
      setSession({
        ...session,
        user: {
          ...session.user,
          entitlements: { ...entitlements },
        },
      })
    }
    return res
  }

  // 10. Admin: Update User Role
  const adminUpdateUserRole = async (
    userId: string,
    newRole: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    const res = await authService.adminUpdateUserRole(userId, newRole)
    if (res.success && session?.user.id === userId) {
      setSession({
        ...session,
        user: {
          ...session.user,
          role: newRole,
          entitlements: { ...DEFAULT_ENTITLEMENTS[newRole] },
        },
      })
    }
    return res
  }

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    role: session?.user.role || 'guest',
    isAuthenticated: Boolean(session?.user),
    isLoading,
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    signUpWithPassword,
    signInWithPassword,
    sendOtp,
    verifyOtp,
    signOut,
    switchRole,
    hasPermission,
    hasFeature,
    updateUserEntitlements,
    adminUpdateUserRole,
    getAllUsers: authService.getAllUsers,
    supabaseConfig,
    updateSupabaseConfig,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
