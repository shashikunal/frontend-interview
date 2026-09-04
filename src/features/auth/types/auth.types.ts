import type { User, Session, Provider } from '@supabase/supabase-js'

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
  guest: { questions_full: false, coding_sandbox: false, system_design: false, video_mock: false, compiler_studios: false, cloud_sync: false },
  candidate: { questions_full: true, coding_sandbox: true, system_design: false, video_mock: false, compiler_studios: false, cloud_sync: true },
  pro_member: { questions_full: true, coding_sandbox: true, system_design: true, video_mock: true, compiler_studios: true, cloud_sync: true },
  interviewer: { questions_full: true, coding_sandbox: true, system_design: true, video_mock: true, compiler_studios: true, cloud_sync: true },
  admin: { questions_full: true, coding_sandbox: true, system_design: true, video_mock: true, compiler_studios: true, cloud_sync: true },
}

export interface AuthUserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  targetCompany?: string
  experienceLevel?: string
  entitlements: FeatureEntitlements
  permissions?: string[]
  status?: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt?: string
}

export interface RoleDefinition {
  id: UserRole
  name: string
  description: string
  hierarchyLevel: number
}

export interface PermissionDefinition {
  id: string
  name: string
  module: string
  description: string
}

export interface AuditLogEntry {
  id: string
  userId?: string
  action: string
  resource: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface ResetPasswordCredentials {
  email: string
}

export interface UpdatePasswordCredentials {
  newPassword: string
}

export interface AuthActionResult {
  success: boolean
  message: string
  needsEmailConfirmation?: boolean
  session?: Session | null
  user?: User | null
}

export interface StoredUserAccount {
  id: string
  email: string
  name: string
  role: UserRole
  entitlements: FeatureEntitlements
  status: 'ACTIVE' | 'SUSPENDED'
  solvedCount: number
  streak: number
  lastLogin: string
  createdAt: string
}

export interface AuthContextValue {
  user: AuthUserProfile | null
  rawUser: User | null
  session: Session | null
  role: UserRole
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalMode: 'user' | 'admin'
  openAuthModal: (mode?: 'user' | 'admin') => void
  closeAuthModal: () => void
  loginAsAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (params: SignUpCredentials) => Promise<AuthActionResult>
  signIn: (params: SignInCredentials) => Promise<AuthActionResult>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthActionResult>
  updatePassword: (newPassword: string) => Promise<AuthActionResult>
  signInWithOAuth: (provider: Provider) => Promise<AuthActionResult>
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; message: string }>
  switchRole: (newRole: UserRole) => void
  hasPermission: (minRoleOrPermission: UserRole | string) => boolean
  hasFeature: (featureKey: keyof FeatureEntitlements) => boolean
  updateProfile: (updates: Partial<AuthUserProfile>) => Promise<{ success: boolean; message: string }>
  // Compatibility helpers
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<{ success: boolean; needsEmailConfirmation?: boolean; message: string }>
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  updateUserEntitlements: (userId: string, entitlements: FeatureEntitlements) => Promise<{ success: boolean; message: string }>
  adminUpdateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; message: string }>
  getAllUsers: () => Promise<StoredUserAccount[]>
}
