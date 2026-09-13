import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import './AdminLoginModal.css'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

// Admin credentials are authenticated securely via /api/admin-auth on the server side.


export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { loginAsAdmin } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setUsername('')
      setPassword('')
      setError('')
      setSuccess(false)
      setTimeout(() => usernameRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const res = await loginAsAdmin(username, password)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 800)
    } else {
      setError(res.message || 'Invalid administrator credentials. Access denied.')
      setIsLoading(false)
    }
  }


  return (
    <div className="adm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Admin Login">

        {/* Header */}
        <div className="adm-header">
          <div className="adm-badge">
            <span className="adm-badge-icon">🛡️</span>
          </div>
          <h2 className="adm-title">Admin Access</h2>
          <p className="adm-subtitle">Enter your administrator credentials to continue</p>
          <button className="adm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {success ? (
          <div className="adm-success">
            <div className="adm-success-icon">✅</div>
            <p>Access granted! Loading Admin Dashboard...</p>
          </div>
        ) : (
          <form className="adm-form" onSubmit={handleSubmit} autoComplete="off">
            {/* Username */}
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-username">Username</label>
              <div className="adm-input-wrap">
                <span className="adm-input-icon">👤</span>
                <input
                  id="adm-username"
                  ref={usernameRef}
                  type="text"
                  className="adm-input"
                  placeholder="Admin username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  autoComplete="off"
                  spellCheck={false}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="adm-field">
              <label className="adm-label" htmlFor="adm-password">Password</label>
              <div className="adm-input-wrap">
                <span className="adm-input-icon">🔑</span>
                <input
                  id="adm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="adm-input"
                  placeholder="Admin password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="adm-toggle-pw"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="adm-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="adm-submit"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <span className="adm-spinner" />
              ) : (
                '🚀 Unlock Admin Dashboard'
              )}
            </button>

            <p className="adm-hint">
              This access is restricted to platform administrators only.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
