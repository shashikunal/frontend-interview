import React from 'react'
import { useAuth } from '../../context/AuthContext'
import './FeatureGuard.css'

interface FeatureGuardProps {
  children: React.ReactNode
  featureName: string
}

export default function FeatureGuard({ children, featureName }: FeatureGuardProps) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth()

  // Still loading auth state — don't flash restriction screen
  if (isLoading) {
    return (
      <div className="feature-guard-loading">
        <div className="feature-guard-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  // Signed-in candidates get full access to every module
  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="feature-guard-card">
      <div className="feature-guard-icon">🔐</div>
      <h2 className="feature-guard-title">Sign In to Access {featureName}</h2>
      <p className="feature-guard-desc">
        Create a free account or sign in to unlock the <strong>{featureName}</strong> module and track your progress across all FAANG prep areas.
      </p>
      <div className="feature-guard-actions">
        <button
          type="button"
          className="btn btn-primary feature-guard-btn-main"
          onClick={() => openAuthModal('user')}
        >
          🚀 User Sign In / Register
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => openAuthModal('admin')}
        >
          🛡️ Admin Login
        </button>
      </div>
      <p className="feature-guard-hint">
        Every account gets full access to all modules.
      </p>
    </div>
  )
}