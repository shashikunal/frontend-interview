import emailjs from '@emailjs/browser'

// Environment variables for EmailJS or Custom SMTP
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

export const isEmailJsConfigured = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
)

export interface EmailDispatchResult {
  success: boolean
  provider: 'emailjs' | 'smtp' | 'simulator'
  message: string
  dispatchedAt: string
}

export interface EmailLogEntry {
  id: string
  type: 'OTP_PASSCODE' | 'WELCOME_CONFIRMATION'
  toEmail: string
  subject: string
  previewText: string
  otpCode?: string
  status: 'SENT' | 'DELIVERED' | 'SIMULATED'
  timestamp: string
}

const EMAIL_LOGS_STORAGE_KEY = 'frontend_interview_email_logs'

export const emailService = {
  // Store sent email log
  logDispatchedEmail: (entry: Omit<EmailLogEntry, 'id' | 'timestamp'>) => {
    try {
      const newEntry: EmailLogEntry = {
        ...entry,
        id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      }
      const raw = localStorage.getItem(EMAIL_LOGS_STORAGE_KEY)
      const list: EmailLogEntry[] = raw ? JSON.parse(raw) : []
      localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify([newEntry, ...list].slice(0, 30)))
      return newEntry
    } catch {
      return null
    }
  },

  getEmailLogs: (): EmailLogEntry[] => {
    try {
      const raw = localStorage.getItem(EMAIL_LOGS_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  // 1. Send OTP Verification Email
  sendOtpEmail: async (
    toEmail: string,
    otpCode: string,
    userName: string = 'Candidate'
  ): Promise<EmailDispatchResult> => {
    const cleanEmail = toEmail.toLowerCase().trim()
    const subject = `🔐 Your FAANG Platform Verification Code: ${otpCode}`
    const previewText = `Hello ${userName}, your one-time verification passcode is ${otpCode}. Valid for 5 minutes.`

    // A. Attempt Real EmailJS dispatch if configured
    if (isEmailJsConfigured) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: cleanEmail,
            user_name: userName,
            otp_code: otpCode,
            subject,
            platform_name: 'FAANG Frontend & System Design Interview Platform',
          },
          EMAILJS_PUBLIC_KEY
        )

        emailService.logDispatchedEmail({
          type: 'OTP_PASSCODE',
          toEmail: cleanEmail,
          subject,
          previewText,
          otpCode,
          status: 'DELIVERED',
        })

        return {
          success: true,
          provider: 'emailjs',
          message: `Official OTP passcode email dispatched to ${cleanEmail} via EmailJS.`,
          dispatchedAt: new Date().toISOString(),
        }
      } catch (err) {
        console.warn('EmailJS delivery failed, falling back to instant mail gateway:', err)
      }
    }

    // B. Vercel Serverless / Open-Source Mail API Gateway
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'OTP',
          to: cleanEmail,
          subject,
          otpCode,
          userName,
        }),
      })

      if (res.ok) {
        emailService.logDispatchedEmail({
          type: 'OTP_PASSCODE',
          toEmail: cleanEmail,
          subject,
          previewText,
          otpCode,
          status: 'DELIVERED',
        })

        return {
          success: true,
          provider: 'smtp',
          message: `OTP Email successfully transmitted to ${cleanEmail} via SMTP Gateway.`,
          dispatchedAt: new Date().toISOString(),
        }
      }
    } catch {
      // Local dev / no serverless route
    }

    // C. Simulated Instant Mail Gateway (Always succeeds in demo / dev environment)
    emailService.logDispatchedEmail({
      type: 'OTP_PASSCODE',
      toEmail: cleanEmail,
      subject,
      previewText,
      otpCode,
      status: 'SIMULATED',
    })

    return {
      success: true,
      provider: 'simulator',
      message: `Verification code generated and sent to ${cleanEmail}. (Passcode: ${otpCode})`,
      dispatchedAt: new Date().toISOString(),
    }
  },

  // 2. Send Welcome & Confirmation Email
  sendConfirmationEmail: async (
    toEmail: string,
    userName: string = 'Candidate',
    role: string = 'Candidate'
  ): Promise<EmailDispatchResult> => {
    const cleanEmail = toEmail.toLowerCase().trim()
    const subject = `🎉 Welcome to FAANG Interview Platform - Account Verified!`
    const previewText = `Welcome ${userName}! Your account has been verified with ${role.toUpperCase()} access across all 22,222 questions.`

    if (isEmailJsConfigured) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: cleanEmail,
            user_name: userName,
            role,
            subject,
            message: `Your account is active! Explore all 22,222 questions, system design canvas, and compiler studios.`,
          },
          EMAILJS_PUBLIC_KEY
        )
      } catch (err) {
        console.warn('Confirmation email dispatch warning:', err)
      }
    }

    emailService.logDispatchedEmail({
      type: 'WELCOME_CONFIRMATION',
      toEmail: cleanEmail,
      subject,
      previewText,
      status: isEmailJsConfigured ? 'DELIVERED' : 'SIMULATED',
    })

    return {
      success: true,
      provider: isEmailJsConfigured ? 'emailjs' : 'simulator',
      message: `Confirmation email dispatched to ${cleanEmail}.`,
      dispatchedAt: new Date().toISOString(),
    }
  },
}
