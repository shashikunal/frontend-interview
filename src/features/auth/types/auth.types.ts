import type { User, Session, Provider } from '@supabase/supabase-js'

export type UserRole = 'guest' | 'candidate' | 'interviewer' | 'admin'

export interface AuthUserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  avatarPublicId?: string
  permissions?: string[]
  status?: 'ACTIVE' | 'SUSPENDED'
  batch?: string
  batchCode?: string
  targetTrack?: string
  githubUrl?: string
  linkedinUrl?: string
  phone?: string
  bio?: string
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
  status: 'ACTIVE' | 'SUSPENDED'
  batch?: string
  batchCode?: string
  targetTrack?: string
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
  updateProfile: (updates: Partial<AuthUserProfile>) => Promise<{ success: boolean; message: string }>
  // Compatibility helpers
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<{ success: boolean; needsEmailConfirmation?: boolean; message: string }>
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  adminUpdateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; message: string }>
  getAllUsers: () => Promise<StoredUserAccount[]>
}
