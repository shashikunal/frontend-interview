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
  fallbackMessage = 'Please sign in with your email OTP to access this feature.',
}: RoleGuardProps) {
  const { isAuthenticated, hasPermission, openAuthModal, switchRole } = useAuth()

  // If user meets permissions, render children normally
  if (isAuthenticated && hasPermission(minRole)) {
    return <>{children}</>
  }

  return (
    <div className="role-guard-lock-card card-box">
      <div className="lock-icon-circle">🔒</div>
      <h3>{fallbackTitle}</h3>
      <p className="lock-desc">
        {!isAuthenticated
          ? fallbackMessage
          : `Your current tier does not have the required "${minRole.toUpperCase()}" permissions.`}
      </p>

      <div className="lock-actions-row">
        {!isAuthenticated ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAuthModal}
          >
            🔐 Sign In with Email OTP
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => switchRole(minRole)}
          >
            ⚡ Upgrade / Switch to {minRole.toUpperCase()} (Demo)
          </button>
        )}
      </div>
    </div>
  )
}
