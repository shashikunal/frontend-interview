import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import './AuthModal.css'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    signInWithPassword,
    signUpWithPassword,
    resetPassword,
    signInWithOAuth,
    sendOtp,
    verifyOtp,
    loginAsAdmin,
    signOut,
    user,
    isAuthenticated,
  } = useAuth()

  // Top-Level Portal: 'user' vs 'admin'
  const [portalTab, setPortalTab] = useState<'user' | 'admin'>('user')

  // User Auth Sub-Methods: 'signin' | 'signup' | 'otp' | 'reset'
  const [userAuthMethod, setUserAuthMethod] = useState<'signin' | 'signup' | 'otp' | 'reset'>('signin')

  // User Form Fields
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // OTP State
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email')
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [timer, setTimer] = useState<number>(60)

  // Admin Form Fields
  const [adminUsername, setAdminUsername] = useState<string>('')
  const [adminPassword, setAdminPassword] = useState<string>('')
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false)

  // Feedback State
  const [statusMsg, setStatusMsg] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const adminUsernameRef = useRef<HTMLInputElement>(null)

  // Sync portalTab with authModalMode whenever modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setPortalTab(authModalMode || 'user')
      setStatusMsg(null)
      if (authModalMode === 'admin') {
        setTimeout(() => adminUsernameRef.current?.focus(), 150)
      }
    }
  }, [isAuthModalOpen, authModalMode])

  // Countdown timer for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (userAuthMethod === 'otp' && otpStep === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [userAuthMethod, otpStep, timer])

  if (!isAuthModalOpen) return null

  // 1. Handle User Password Sign In / Sign Up
  const handleUserPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }
    if (password.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters long.' })
      return
    }

    setIsSubmitting(true)
    setStatusMsg(null)

    try {
      if (userAuthMethod === 'signup') {
        const res = await signUpWithPassword(email, password, fullName)
        if (res.success) {
          if (res.needsEmailConfirmation) {
            setStatusMsg({
              type: 'success',
              text: res.message || `Confirmation email sent to ${email}. Please check your inbox and verify your email.`,
            })
          } else {
            setStatusMsg({ type: 'success', text: 'Account registered and signed in successfully!' })
            setTimeout(closeAuthModal, 800)
          }
        } else {
          setStatusMsg({ type: 'error', text: res.message })
        }
      } else {
        const res = await signInWithPassword(email, password)
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'Signed in successfully!' })
          setTimeout(closeAuthModal, 600)
        } else {
          setStatusMsg({ type: 'error', text: res.message })
        }
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Authentication error.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }

    setIsSubmitting(true)
    setStatusMsg(null)

    try {
      const res = await resetPassword(email)
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message })
      } else {
        setStatusMsg({ type: 'error', text: res.message })
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to send reset instructions.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. Handle Google OAuth
  const handleGoogleOAuth = async () => {
    setIsSubmitting(true)
    setStatusMsg(null)
    try {
      const res = await signInWithOAuth('google')
      if (!res.success) {
        setStatusMsg({ type: 'error', text: res.message })
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Google OAuth failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }

    setIsSubmitting(true)
    setStatusMsg(null)

    try {
      const res = await sendOtp(email)
      if (res.success) {
        setOtpStep('otp')
        setTimer(60)
        setStatusMsg({
          type: 'success',
          text: res.message || `Verification code sent to ${email}. Check your inbox!`,
        })
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100)
      } else {
        setStatusMsg({ type: 'error', text: res.message })
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Failed to dispatch verification email.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 5. Handle Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const code = otpDigits.join('')
    if (code.length !== 6) {
      setStatusMsg({ type: 'error', text: 'Please enter all 6 digits of the OTP code.' })
      return
    }

    setIsSubmitting(true)
    setStatusMsg(null)

    try {
      const res = await verifyOtp(email, code)
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Authenticated successfully!' })
        setTimeout(closeAuthModal, 600)
      } else {
        setStatusMsg({ type: 'error', text: res.message })
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Verification failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 6. Handle Admin Authentication
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminUsername.trim() || !adminPassword) {
      setStatusMsg({ type: 'error', text: 'Please enter both administrator username and password.' })
      return
    }

    setIsSubmitting(true)
    setStatusMsg(null)

    try {
      const res = await loginAsAdmin(adminUsername, adminPassword)
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Administrator credentials verified! Opening Command Center...' })
        setTimeout(() => {
          closeAuthModal()
        }, 600)
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Invalid administrator credentials. Access denied.' })
        setAdminPassword('')
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Admin authentication failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="auth-close-btn"
          onClick={closeAuthModal}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Top-Level Portal Switcher: User Login vs Admin Login */}
        <div className="auth-portal-selector">
          <button
            type="button"
            className={`portal-tab-btn ${portalTab === 'user' ? 'active' : ''}`}
            onClick={() => {
              setPortalTab('user')
              setStatusMsg(null)
            }}
          >
            <span className="portal-tab-icon">👤</span>
            <div className="portal-tab-text">
              <span className="portal-tab-title">User Account</span>
              <span className="portal-tab-sub">Candidate / Learner</span>
            </div>
          </button>
          <button
            type="button"
            className={`portal-tab-btn admin-portal-btn ${portalTab === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setPortalTab('admin')
              setStatusMsg(null)
              setTimeout(() => adminUsernameRef.current?.focus(), 100)
            }}
          >
            <span className="portal-tab-icon">🛡️</span>
            <div className="portal-tab-text">
              <span className="portal-tab-title">Admin Portal</span>
              <span className="portal-tab-sub">Restricted Staff Access</span>
            </div>
          </button>
        </div>

        {/* Status Alerts */}
        {statusMsg && (
          <div className={`auth-alert ${statusMsg.type}`}>
            {statusMsg.type === 'error' ? '⚠️ ' : '✅ '}
            {statusMsg.text}
          </div>
        )}

        {/* ── ALREADY AUTHENTICATED OVERVIEW (If matching current portal) ── */}
        {isAuthenticated && user && portalTab === (user.role === 'admin' ? 'admin' : 'user') ? (
          <div className="auth-success-box">
            <div className="profile-summary-card">
              <div className="profile-avatar">{user.role === 'admin' ? '🛡️' : '👨‍💻'}</div>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <span className="profile-email">{user.email}</span>
                <div className={`role-pill-badge ${user.role}`}>
                  ROLE: <strong>{user.role.toUpperCase()}</strong>
                </div>
              </div>
            </div>

            <div className="permissions-overview">
              <h4>Active Feature Entitlements:</h4>
              <ul className="perms-list">
                <li>
                  {user.entitlements.questions_full ? '✅' : '🔒'}{' '}
                  <strong>22,222 Questions Bank</strong> {user.entitlements.questions_full ? '(Full Access)' : '(Restricted)'}
                </li>
                <li>
                  {user.entitlements.coding_sandbox ? '✅' : '🔒'}{' '}
                  <strong>Monaco Code Execution Sandbox</strong>
                </li>
                <li>
                  {user.entitlements.system_design ? '✅' : '🔒'}{' '}
                  <strong>System Design Architecture Blueprints</strong>
                </li>
                <li>
                  {user.entitlements.video_mock ? '✅' : '🔒'}{' '}
                  <strong>AI Video Mock Interview Simulator</strong>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={closeAuthModal}
              >
                🚀 Continue to Platform
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  signOut()
                  setStatusMsg({ type: 'info', text: 'You have been signed out.' })
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        ) : portalTab === 'admin' ? (
          /* ══════════════════════════════════════════════════════════ */
          /* 🛡️ TAB 2: ADMINISTRATOR LOGIN                             */
          /* ══════════════════════════════════════════════════════════ */
          <div className="admin-portal-panel">
            <div className="admin-portal-header">
              <span className="admin-auth-shield-badge">🛡️ RESTRICTED ACCESS</span>
              <h3>Platform Administrator Console</h3>
              <p className="auth-sub">
                Enter your administrative credentials to unlock the operations dashboard and user management controls.
              </p>
            </div>

            <form onSubmit={handleAdminAuth} className="auth-form mt-3" autoComplete="off">
              <div className="input-group">
                <label htmlFor="admin-portal-username">Administrator Username:</label>
                <div className="email-input-wrapper">
                  <span className="email-input-icon">👤</span>
                  <input
                    id="admin-portal-username"
                    ref={adminUsernameRef}
                    type="text"
                    className="auth-input visible-field"
                    placeholder="Admin username (e.g. shashi)"
                    value={adminUsername}
                    onChange={e => {
                      setAdminUsername(e.target.value)
                      setStatusMsg(null)
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="admin-portal-password">Administrator Password:</label>
                <div className="email-input-wrapper">
                  <span className="email-input-icon">🔑</span>
                  <input
                    id="admin-portal-password"
                    type={showAdminPassword ? 'text' : 'password'}
                    className="auth-input visible-field"
                    placeholder="Admin password"
                    value={adminPassword}
                    onChange={e => {
                      setAdminPassword(e.target.value)
                      setStatusMsg(null)
                    }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="pwd-toggle-btn"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    tabIndex={-1}
                  >
                    {showAdminPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn admin-submit-glow"
                disabled={isSubmitting || !adminUsername.trim() || !adminPassword}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '12px',
                  marginTop: '6px',
                }}
              >
                {isSubmitting ? 'Verifying Admin Credentials...' : '🚀 Authenticate as Administrator'}
              </button>

              <div className="admin-portal-footnote">
                <span className="footnote-icon">🔒</span>
                <span>Administrator access is recorded and audited to the system security log.</span>
              </div>
            </form>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════ */
          /* 👤 TAB 1: REGULAR USER LOGIN & SIGNUP                     */
          /* ══════════════════════════════════════════════════════════ */
          <div className="user-portal-panel">
            {/* Google OAuth */}
            <div className="oauth-buttons-row">
              <button
                type="button"
                className="btn btn-oauth-google"
                onClick={handleGoogleOAuth}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginBottom: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="divider-text" style={{ margin: '6px 0 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Or continue with email
              </span>
            </div>

            {/* METHOD SWITCHER TABS */}
            <div className="auth-method-tabs">
              <button
                type="button"
                className={`amt-btn ${userAuthMethod === 'signin' ? 'active' : ''}`}
                onClick={() => {
                  setUserAuthMethod('signin')
                  setStatusMsg(null)
                }}
              >
                🔑 Sign In
              </button>
              <button
                type="button"
                className={`amt-btn ${userAuthMethod === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setUserAuthMethod('signup')
                  setStatusMsg(null)
                }}
              >
                ✨ Register
              </button>
              <button
                type="button"
                className={`amt-btn ${userAuthMethod === 'otp' ? 'active' : ''}`}
                onClick={() => {
                  setUserAuthMethod('otp')
                  setStatusMsg(null)
                }}
              >
                📩 Email OTP
              </button>
            </div>

            {/* METHOD: SIGN IN / SIGN UP WITH PASSWORD */}
            {(userAuthMethod === 'signin' || userAuthMethod === 'signup') && (
              <form onSubmit={handleUserPasswordAuth} className="auth-form mt-3">
                {userAuthMethod === 'signup' && (
                  <div className="input-group">
                    <label htmlFor="auth-pwd-name">Full Name:</label>
                    <div className="email-input-wrapper">
                      <span className="email-input-icon">👤</span>
                      <input
                        id="auth-pwd-name"
                        type="text"
                        className="auth-input visible-field"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="auth-pwd-email">Email Address:</label>
                  <div className="email-input-wrapper">
                    <span className="email-input-icon">✉️</span>
                    <input
                      id="auth-pwd-email"
                      type="email"
                      className="auth-input visible-field"
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus={userAuthMethod === 'signin'}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="label-with-hint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="auth-pwd">Password:</label>
                    {userAuthMethod === 'signin' && (
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => {
                          setUserAuthMethod('reset')
                          setStatusMsg(null)
                        }}
                        style={{ fontSize: '0.74rem', background: 'none', border: 'none', color: 'var(--accent-bright)', cursor: 'pointer', padding: 0 }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="email-input-wrapper">
                    <span className="email-input-icon">🔒</span>
                    <input
                      id="auth-pwd"
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input visible-field"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Authenticating...'
                    : userAuthMethod === 'signup'
                    ? '✨ Create Free Account'
                    : '🔑 Sign In'}
                </button>
              </form>
            )}

            {/* METHOD: ONE-TIME PASSCODE (OTP) */}
            {userAuthMethod === 'otp' && (
              <>
                {otpStep === 'email' ? (
                  <form onSubmit={handleSendOtp} className="auth-form mt-3">
                    <div className="input-group">
                      <label htmlFor="auth-otp-email">Email Address for Instant Passcode:</label>
                      <div className="email-input-wrapper">
                        <span className="email-input-icon">✉️</span>
                        <input
                          id="auth-otp-email"
                          type="email"
                          className="auth-input visible-field"
                          placeholder="name@company.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary auth-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending Passcode...' : '📩 Send 6-Digit Email Passcode'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="auth-form mt-3">
                    <div className="email-sent-notice">
                      <span className="esn-icon">📬</span>
                      <div>
                        <strong>Verification Code Sent</strong>
                        <p>We sent a 6-digit code to <code>{email}</code>. Enter it below:</p>
                      </div>
                    </div>

                    <div
                      className="otp-boxes-row"
                      onPaste={e => {
                        e.preventDefault()
                        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                        if (pasted.length === 6) {
                          setOtpDigits(pasted.split(''))
                          otpInputRefs.current[5]?.focus()
                        }
                      }}
                    >
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => {
                            otpInputRefs.current[idx] = el
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className={`otp-digit-box ${digit ? 'filled' : ''}`}
                          value={digit}
                          onChange={e => {
                            const d = e.target.value.replace(/\D/g, '').slice(-1)
                            const next = [...otpDigits]
                            next[idx] = d
                            setOtpDigits(next)
                            if (d && idx < 5) otpInputRefs.current[idx + 1]?.focus()
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                              otpInputRefs.current[idx - 1]?.focus()
                            }
                          }}
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary auth-submit-btn"
                      disabled={isSubmitting || otpDigits.join('').length !== 6}
                    >
                      {isSubmitting ? 'Verifying...' : '⚡ Verify Code & Sign In'}
                    </button>

                    <div className="otp-actions-row">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => setOtpStep('email')}
                      >
                        ← Change Email
                      </button>

                      <button
                        type="button"
                        className="btn-link"
                        disabled={timer > 0}
                        onClick={() => handleSendOtp()}
                      >
                        {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* METHOD: PASSWORD RESET */}
            {userAuthMethod === 'reset' && (
              <form onSubmit={handlePasswordReset} className="auth-form mt-3">
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Enter your registered account email and we will send you secure instructions to reset your password.
                </p>
                <div className="input-group">
                  <label htmlFor="auth-reset-email">Registered Email Address:</label>
                  <div className="email-input-wrapper">
                    <span className="email-input-icon">✉️</span>
                    <input
                      id="auth-reset-email"
                      type="email"
                      className="auth-input visible-field"
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Reset Instructions...' : '🔄 Send Reset Link'}
                </button>

                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => {
                      setUserAuthMethod('signin')
                      setStatusMsg(null)
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--accent-bright)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
