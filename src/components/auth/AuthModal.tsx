import React, { useState, useRef, useEffect } from 'react'
import { useAuth, type UserRole } from '../../context/AuthContext'
import './AuthModal.css'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithPassword,
    signUpWithPassword,
    sendOtp,
    verifyOtp,
    switchRole,
    user,
    isAuthenticated,
    supabaseConfig,
    updateSupabaseConfig,
  } = useAuth()

  // Auth Mode: 'password' vs 'otp'
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  // Password Submode: 'signin' vs 'signup'
  const [passwordMode, setPasswordMode] = useState<'signin' | 'signup'>('signin')

  // Form Fields
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // OTP State
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email')
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [timer, setTimer] = useState<number>(60)

  // Supabase Project Keys Config Drawer
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false)
  const [sbUrlInput, setSbUrlInput] = useState<string>(supabaseConfig.url)
  const [sbKeyInput, setSbKeyInput] = useState<string>(supabaseConfig.anonKey)

  // Feedback State
  const [statusMsg, setStatusMsg] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Reset modal state on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setStatusMsg(null)
      if (!isAuthenticated) {
        setOtpStep('email')
        setOtpDigits(['', '', '', '', '', ''])
      }
    }
  }, [isAuthModalOpen, isAuthenticated])

  // Countdown timer for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (authMethod === 'otp' && otpStep === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [authMethod, otpStep, timer])

  if (!isAuthModalOpen) return null

  // 1. Handle Real Password Sign Up / Sign In
  const handlePasswordAuth = async (e: React.FormEvent) => {
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
      if (passwordMode === 'signup') {
        const res = await signUpWithPassword(email, password, fullName)
        if (res.success) {
          if (res.needsEmailConfirmation) {
            setStatusMsg({
              type: 'success',
              text: res.message || `Official confirmation email sent to ${email}. Please check your inbox and click the verification link.`,
            })
          } else {
            setStatusMsg({ type: 'success', text: 'Account registered and signed in successfully!' })
          }
        } else {
          setStatusMsg({ type: 'error', text: res.message })
        }
      } else {
        const res = await signInWithPassword(email, password)
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'Signed in successfully! Session verified.' })
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

  // 2. Handle Send OTP
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
          text: res.message || `Verification code sent to ${email}. Check your email inbox!`,
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

  // 3. Handle Verify OTP
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
        setStatusMsg({ type: 'success', text: 'Authentication verified successfully!' })
      } else {
        setStatusMsg({ type: 'error', text: res.message })
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: (err as Error).message || 'Verification failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. Handle Save Supabase Project Keys
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sbUrlInput || !sbKeyInput) {
      setStatusMsg({ type: 'error', text: 'Please enter both Supabase URL and Anon Key.' })
      return
    }
    updateSupabaseConfig(sbUrlInput, sbKeyInput)
    setShowConfigDrawer(false)
    setStatusMsg({ type: 'success', text: 'Supabase Cloud credentials saved and active!' })
  }

  // 5. Quick Role Switcher
  const handleQuickLogin = (demoRole: UserRole, demoEmail: string) => {
    switchRole(demoRole)
    setEmail(demoEmail)
    setStatusMsg({ type: 'success', text: `Switched to ${demoRole.toUpperCase()} account!` })
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

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-badge">🛡️ SUPABASE &amp; CLOUD AUTH</div>
          <h2>{isAuthenticated ? 'Your Account Session' : 'Sign in to Platform'}</h2>
          <p className="auth-sub">
            {isAuthenticated
              ? `Signed in as ${user?.name} (${user?.email})`
              : 'Sign in with your Email & Password or Email OTP passcode.'}
          </p>

          <div className="engine-indicator">
            <span className={`engine-pill ${supabaseConfig.isConfigured ? 'supabase' : 'mock'}`}>
              {supabaseConfig.isConfigured ? '🟢 Supabase Cloud Auth Active' : '⚡ Local Auth &amp; Session Engine'}
            </span>
            <button
              type="button"
              className="config-toggle-link"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            >
              ⚙️ {supabaseConfig.isConfigured ? 'Edit Keys' : 'Connect Supabase Project'}
            </button>
          </div>
        </div>

        {/* Supabase Connection Drawer */}
        {showConfigDrawer && (
          <form onSubmit={handleSaveConfig} className="supabase-config-drawer">
            <div className="scd-top">
              <strong>Connect Your Live Supabase Project</strong>
              <span>Get these from Supabase Dashboard ➔ Project Settings ➔ API</span>
            </div>
            <div className="input-group">
              <label>Supabase Project URL:</label>
              <input
                type="url"
                className="sim-input"
                placeholder="https://your-project.supabase.co"
                value={sbUrlInput}
                onChange={e => setSbUrlInput(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Supabase Public Anon Key:</label>
              <input
                type="text"
                className="sim-input"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={sbKeyInput}
                onChange={e => setSbKeyInput(e.target.value)}
                required
              />
            </div>
            <div className="scd-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                💾 Connect &amp; Save Keys
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowConfigDrawer(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Status Alerts */}
        {statusMsg && (
          <div className={`auth-alert ${statusMsg.type}`}>
            {statusMsg.type === 'error' ? '⚠️ ' : '✅ '}
            {statusMsg.text}
          </div>
        )}

        {/* If Authenticated: Show Session & Entitlements Overview */}
        {isAuthenticated && user ? (
          <div className="auth-success-box">
            <div className="profile-summary-card">
              <div className="profile-avatar">👨‍💻</div>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <span className="profile-email">{user.email}</span>
                <div className="role-pill-badge">
                  ROLE: <strong>{user.role.toUpperCase()}</strong>
                </div>
              </div>
            </div>

            <div className="permissions-overview">
              <h4>Active Feature Entitlements (Admin-Controlled):</h4>
              <ul className="perms-list">
                <li>
                  {user.entitlements.questions_full ? '✅' : '🔒'}{' '}
                  <strong>22,222 Questions Bank</strong> {user.entitlements.questions_full ? '(Full Access)' : '(Restricted to 500)'}
                </li>
                <li>
                  {user.entitlements.coding_sandbox ? '✅' : '🔒'}{' '}
                  <strong>Monaco Code Execution Sandbox</strong>
                </li>
                <li>
                  {user.entitlements.system_design ? '✅' : '🔒'}{' '}
                  <strong>Interactive System Design Canvas &amp; Blueprints</strong>
                </li>
                <li>
                  {user.entitlements.video_mock ? '✅' : '🔒'}{' '}
                  <strong>AI Video Mock Interviews with Audio Rubrics</strong>
                </li>
                <li>
                  {user.entitlements.compiler_studios ? '✅' : '🔒'}{' '}
                  <strong>Compilers, AST &amp; WebAssembly Studios</strong>
                </li>
              </ul>
            </div>

            <div className="role-switcher-row">
              <span>Switch Testing Role:</span>
              <div className="switch-buttons">
                {(['candidate', 'pro_member', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`btn btn-sm ${user.role === r ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => switchRole(r)}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary auth-submit-btn"
              onClick={closeAuthModal}
            >
              🚀 Continue to Platform
            </button>
          </div>
        ) : (
          <>
            {/* METHOD SWITCHER TABS */}
            <div className="auth-method-tabs">
              <button
                type="button"
                className={`amt-btn ${authMethod === 'password' ? 'active' : ''}`}
                onClick={() => setAuthMethod('password')}
              >
                🔑 Email &amp; Password
              </button>
              <button
                type="button"
                className={`amt-btn ${authMethod === 'otp' ? 'active' : ''}`}
                onClick={() => setAuthMethod('otp')}
              >
                📩 One-Time Passcode (OTP)
              </button>
            </div>

            {/* METHOD 1: EMAIL & PASSWORD */}
            {authMethod === 'password' && (
              <div className="password-auth-container">
                <div className="password-mode-toggle">
                  <button
                    type="button"
                    className={`pmt-btn ${passwordMode === 'signin' ? 'active' : ''}`}
                    onClick={() => {
                      setPasswordMode('signin')
                      setStatusMsg(null)
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`pmt-btn ${passwordMode === 'signup' ? 'active' : ''}`}
                    onClick={() => {
                      setPasswordMode('signup')
                      setStatusMsg(null)
                    }}
                  >
                    Create Account (Sign Up)
                  </button>
                </div>

                <form onSubmit={handlePasswordAuth} className="auth-form mt-3">
                  {passwordMode === 'signup' && (
                    <div className="input-group">
                      <label htmlFor="auth-pwd-name">Full Name:</label>
                      <div className="email-input-wrapper">
                        <span className="email-input-icon">👤</span>
                        <input
                          id="auth-pwd-name"
                          type="text"
                          className="auth-input visible-field"
                          placeholder="Sarah Connor"
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
                        autoFocus={passwordMode === 'signin'}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="label-with-hint">
                      <label htmlFor="auth-pwd">Password:</label>
                      {passwordMode === 'signin' && (
                        <span className="pwd-hint">Admin demo: <code>admin123</code></span>
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
                      : passwordMode === 'signup'
                      ? '✨ Create Account (Supabase)'
                      : '🔑 Sign In with Password'}
                  </button>
                </form>
              </div>
            )}

            {/* METHOD 2: ONE-TIME PASSCODE (OTP) */}
            {authMethod === 'otp' && (
              <>
                {otpStep === 'email' ? (
                  <form onSubmit={handleSendOtp} className="auth-form mt-3">
                    <div className="input-group">
                      <label htmlFor="auth-otp-email">Email Address:</label>
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
                      {isSubmitting ? 'Sending OTP via Supabase...' : '📩 Send 6-Digit Passcode (OTP)'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="auth-form mt-3">
                    <div className="email-sent-notice">
                      <span className="esn-icon">📬</span>
                      <div>
                        <strong>Check your email inbox</strong>
                        <p>We sent a 6-digit passcode to <code>{email}</code>. Enter it below.</p>
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
                      {isSubmitting ? 'Verifying with Supabase...' : '⚡ Verify Passcode &amp; Sign In'}
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
                        {timer > 0 ? `Resend in ${timer}s` : 'Resend Passcode'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* Quick Demo Instant Logins */}
            <div className="quick-demo-section">
              <div className="divider-text">
                <span>OR 1-CLICK INSTANT DEMO ROLES</span>
              </div>
              <div className="demo-roles-grid">
                <button
                  type="button"
                  className="demo-role-btn candidate"
                  onClick={() => handleQuickLogin('candidate', 'candidate@faang.io')}
                >
                  <span className="dr-icon">👨‍💻</span>
                  <div>
                    <strong>Candidate</strong>
                    <small>Standard Free Tier</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="demo-role-btn pro"
                  onClick={() => handleQuickLogin('pro_member', 'staff.pro@faang.io')}
                >
                  <span className="dr-icon">⚡</span>
                  <div>
                    <strong>Pro Member</strong>
                    <small>All 22,222 Questions</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="demo-role-btn admin"
                  onClick={() => handleQuickLogin('admin', 'admin@faang.io')}
                >
                  <span className="dr-icon">🔒</span>
                  <div>
                    <strong>Admin</strong>
                    <small>Full Platform Control</small>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
