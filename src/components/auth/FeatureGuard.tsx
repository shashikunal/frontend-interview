import React, { useState } from 'react'
import { useAuth, type FeatureEntitlements } from '../../context/AuthContext'
import { auditService } from '../../features/auth/services/audit.service'
import './RoleGuard.css'

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
  const { isAuthenticated, hasFeature, user, openAuthModal, switchRole } = useAuth()
  const [requested, setRequested] = useState<boolean>(false)

  // If user has the feature entitlement, render content
  if (hasFeature(feature)) {
    return <>{children}</>
  }

  const handleRequestAccess = async () => {
    const targetEmail = user?.email || 'candidate@faang.io'
    const targetName = user?.name || (targetEmail.includes('@') ? targetEmail.split('@')[0] : 'Candidate')

    setRequested(true)

    await auditService.logEvent({
      userId: user?.id || 'candidate_req_user',
      action: 'FEATURE_ACCESS_REQUESTED',
      resource: feature,
      details: {
        featureName,
        userEmail: targetEmail,
        userName: targetName,
        currentRole: user?.role || 'candidate',
      },
    })
  }

  return (
    <div className="role-guard-lock-card card-box" style={{ maxWidth: '640px', margin: '48px auto', textAlign: 'center', padding: '36px 28px' }}>
      <div className="lock-icon-circle" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔒</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>{featureName} Access Restricted</h2>
      <p className="lock-desc" style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
        {fallbackMessage ||
          `This module is restricted by Administrator policy. Your account (${user?.email || 'Candidate'}) currently lacks the "${feature}" entitlement.`}
      </p>

      <div className="lock-actions-row" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {requested ? (
          <div className="alert alert-success" style={{ padding: '10px 18px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success, #10b981)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
            ✅ Access request sent to Admin! Switch to Admin to view and approve in the notification bell 🔔.
          </div>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRequestAccess}
              style={{ fontWeight: 700 }}
            >
              📩 Request Access from Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => switchRole('admin')}
              style={{ fontWeight: 700 }}
            >
              ⚡ Instant Admin Unlock (Demo)
            </button>
            {!isAuthenticated && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={openAuthModal}
              >
                🔐 Sign In
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
