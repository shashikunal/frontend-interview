import { supabase } from '../../../lib/supabase/client'
import { formatAuthError } from '../utils/auth.errors'
import type {
  SignUpCredentials,
  SignInCredentials,
  AuthActionResult,
  UserRole,
} from '../types/auth.types'
import type { Session, User, Provider } from '@supabase/supabase-js'

export const authService = {
  /**
   * Register a new user with Supabase Auth
   */
  signUp: async ({ email, password, fullName }: SignUpCredentials): Promise<AuthActionResult> => {
    const cleanEmail = email.toLowerCase().trim()
    const name = fullName.trim() || cleanEmail.split('@')[0]
    const role: UserRole = cleanEmail.includes('admin')
      ? 'admin'
      : cleanEmail.includes('pro')
      ? 'pro_member'
      : 'candidate'

    try {
      const { data, error } = await supabase.auth.signUp({
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
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      if (data.user && !data.session) {
        return {
          success: true,
          needsEmailConfirmation: true,
          user: data.user,
          message: `Confirmation email sent to ${cleanEmail}. Please verify your email inbox.`,
        }
      }

      return {
        success: true,
        session: data.session,
        user: data.user,
        message: 'Account registered and signed in successfully!',
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Sign in with Supabase Auth email + password
   */
  signIn: async ({ email, password }: SignInCredentials): Promise<AuthActionResult> => {
    const cleanEmail = email.toLowerCase().trim()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      return {
        success: true,
        session: data.session,
        user: data.user,
        message: 'Signed in successfully!',
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Send Password Reset Email
   */
  resetPassword: async (email: string): Promise<AuthActionResult> => {
    const cleanEmail = email.toLowerCase().trim()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/profile?reset=true`,
      })

      if (error) {
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      return {
        success: true,
        message: `Password reset instructions sent to ${cleanEmail}. Check your inbox.`,
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Update authenticated user's password
   */
  updatePassword: async (newPassword: string): Promise<AuthActionResult> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      return {
        success: true,
        user: data.user,
        message: 'Password successfully updated!',
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Sign In with OAuth Provider (Google, GitHub, etc.)
   */
  signInWithOAuth: async (provider: Provider): Promise<AuthActionResult> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })

      if (error) {
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      return {
        success: true,
        message: `Redirecting to ${provider.toUpperCase()} authentication...`,
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Send Email OTP / Magic Link
   */
  signInWithOtp: async (email: string): Promise<AuthActionResult> => {
    const cleanEmail = email.toLowerCase().trim()
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (error) {
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      return {
        success: true,
        message: `OTP verification code sent to ${cleanEmail}. Check your email.`,
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Verify Email OTP
   */
  verifyOtp: async (email: string, token: string): Promise<AuthActionResult> => {
    const cleanEmail = email.toLowerCase().trim()
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: token.trim(),
        type: 'email',
      })

      if (error) {
        return {
          success: false,
          message: formatAuthError(error),
        }
      }

      return {
        success: true,
        session: data.session,
        user: data.user,
        message: 'OTP verified successfully with Supabase!',
      }
    } catch (err) {
      return {
        success: false,
        message: formatAuthError(err),
      }
    }
  },

  /**
   * Sign out current user from Supabase Auth
   */
  signOut: async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('[Supabase Auth] Sign out error:', err)
    }
  },

  /**
   * Retrieve current active session
   */
  getSession: async (): Promise<Session | null> => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (err) {
      console.warn('[Supabase Auth] Failed to fetch session:', err)
      return null
    }
  },

  /**
   * Retrieve current authenticated user
   */
  getUser: async (): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (err) {
      console.warn('[Supabase Auth] Failed to fetch user:', err)
      return null
    }
  },
}
