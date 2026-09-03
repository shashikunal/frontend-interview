import type { AuthError } from '@supabase/supabase-js'

export function formatAuthError(error: AuthError | Error | unknown): string {
  if (!error) return 'An unknown authentication error occurred.'

  if (typeof error === 'string') return error

  const msg = (error as { message?: string }).message || ''

  if (msg.includes('Invalid login credentials') || msg.includes('invalid_grant')) {
    return 'Invalid email or password. Please check your credentials.'
  }
  if (msg.includes('User already registered') || msg.includes('user_already_exists')) {
    return 'An account with this email already exists. Please sign in.'
  }
  if (msg.includes('Email not confirmed')) {
    return 'Your email has not been verified yet. Please check your inbox for the confirmation email.'
  }
  if (msg.includes('Password should be at least')) {
    return 'Password is too weak. Must be at least 6 characters.'
  }
  if (msg.includes('Rate limit') || msg.includes('over_email_send_rate_limit')) {
    return 'Too many attempts. Please wait a few moments before trying again.'
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'Network connection error. Please verify your internet connection.'
  }

  return msg || 'Authentication request failed. Please try again.'
}
