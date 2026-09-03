import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  minRole?: UserRole
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  minRole,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, openAuthModal } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
          <p>Verifying authentication session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Open auth modal for convenience and redirect
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ marginBottom: '8px' }}>Sign In Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Please sign in to your account to access this page.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAuthModal}
          >
            🔐 Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  if (minRole && !hasPermission(minRole)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}
