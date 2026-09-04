import React, { useState } from 'react'
import { useAuth, type FeatureEntitlements } from '../../context/AuthContext'
import { auditService } from '../../features/auth/services/audit.service'
import './FeatureGuard.css'

interface FeatureGuardProps {
  children: React.ReactNode
  feature: keyof FeatureEntitlements
  featureName: string
  fallbackMessage?: string
}

export default function FeatureGuard({
  children,
  feature,
  featureName,
  fallbackMessage,
}: FeatureGuardProps) {
  const { isAuthenticated, isLoading, hasFeature, user, openAuthModal } = useAuth()
  const [requested, setRequested] = useState<boolean>(false)

  // Still loading auth state — don't flash restriction screen
  if (isLoading) {
    return (
      <div className="feature-guard-loading">
        <div className="feature-guard-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  // If user has the feature entitlement, render content
  if (hasFeature(feature)) {
    return <>{children}</>
  }

  // ── Guest path: Not logged in ──────────────────────────────
  if (!isAuthenticated) {
    return (
      <>
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
            Free accounts get access to the full Questions Bank, Coding Sandbox &amp; more.
          </p>
        </div>
      </>
    )
  }

  // ── Authenticated but missing entitlement path ─────────────
  const handleRequestAccess = async () => {
    setRequested(true)
    await auditService.logEvent({
      userId: user?.id || 'candidate_req_user',
      action: 'FEATURE_ACCESS_REQUESTED',
      resource: feature,
      details: {
        featureName,
        userEmail: user?.email,
        userName: user?.name,
        currentRole: user?.role || 'candidate',
      },
    })
  }

  return (
    <>
      <div className="feature-guard-card">
        <div className="feature-guard-icon">🔒</div>
        <h2 className="feature-guard-title">{featureName} — Upgrade Required</h2>
        <p className="feature-guard-desc">
          {fallbackMessage ||
            `Your current plan doesn't include the "${feature}" entitlement. Upgrade to Pro or ask your Administrator to grant access.`}
        </p>

        <div className="feature-guard-actions">
          {requested ? (
            <div className="feature-guard-success">
              ✅ Access request sent to Admin! Check the notification bell 🔔.
            </div>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRequestAccess}
              >
                📩 Request Access from Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => openAuthModal('admin')}
              >
                🛡️ Admin Login
              </button>
            </>
          )}
        </div>
        <p className="feature-guard-meta">
          Signed in as <strong>{user?.email}</strong> · Role: <code>{user?.role}</code>
        </p>
      </div>
    </>
  )
}
