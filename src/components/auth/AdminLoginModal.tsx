import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase/client'
import './AdminLoginModal.css'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'shashi'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@9999'

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { switchRole } = useAuth()
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
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a short auth delay for UX
    await new Promise(r => setTimeout(r, 600))

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Authenticate with Supabase so Postgres RLS grants full permissions to fetch all real users
      try {
        const adminEmail = 'admin@interviewprep.com'
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: ADMIN_PASSWORD,
        })
        if (signInErr) {
          await supabase.auth.signUp({
            email: adminEmail,
            password: ADMIN_PASSWORD,
            options: {
              data: { full_name: 'Platform Administrator', role: 'admin' },
            },
          })
        }
      } catch (authErr) {
        console.warn('[Admin Login] Supabase auth error:', authErr)
      }

      setSuccess(true)
      setTimeout(() => {
        switchRole('admin')
        onClose()
      }, 800)
    } else {
      setError('Invalid username or password. Access denied.')
      setPassword('')
    }

    setIsLoading(false)
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
