import React from 'react'
import { useAuth, type UserRole } from '../../context/AuthContext'
import './RoleGuard.css'

interface RoleGuardProps {
  children: React.ReactNode
  minRole?: UserRole
  fallbackTitle?: string
  fallbackMessage?: string
}

export default function RoleGuard({
  children,
  minRole = 'candidate',
  fallbackTitle = 'Staff Access Required',
  fallbackMessage = 'Please sign in to your account to access this feature.',
}: RoleGuardProps) {
  const { isAuthenticated, hasPermission, openAuthModal, user } = useAuth()

  // If user meets permissions, render children normally
  if (isAuthenticated && hasPermission(minRole)) {
    return <>{children}</>
  }

  const isAdminRequired = minRole === 'admin'

  return (
    <div className="role-guard-lock-card card-box">
      <div className="lock-icon-circle">{isAdminRequired ? '🛡️' : '🔒'}</div>
      <h3>{isAdminRequired ? 'Administrator Access Required' : fallbackTitle}</h3>
      <p className="lock-desc">
        {!isAuthenticated
          ? fallbackMessage
          : isAdminRequired
          ? `You are signed in as ${user?.email} (${user?.role?.toUpperCase()}). This console is strictly restricted to verified platform administrators.`
          : `Your account (${user?.role?.toUpperCase()}) does not have the required "${minRole.toUpperCase()}" privileges.`}
      </p>

      <div className="lock-actions-row" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!isAuthenticated ? (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => openAuthModal('user')}
            >
              🔐 User Login
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                border: 'none',
              }}
              onClick={() => openAuthModal('admin')}
            >
              🛡️ Administrator Login
            </button>
          </>
        ) : isAdminRequired ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              border: 'none',
              fontWeight: 800,
            }}
            onClick={() => openAuthModal('admin')}
          >
            🛡️ Sign In with Administrator Credentials
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openAuthModal('user')}
          >
            👤 Manage Account
          </button>
        )}
      </div>
    </div>
  )
}
