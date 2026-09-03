import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, type FeatureEntitlements } from '../../context/AuthContext'
import './FeatureGuard.css'

interface FeatureGuardProps {
  feature: keyof FeatureEntitlements
  featureTitle?: string
  featureDesc?: string
  children: React.ReactNode
}

const FEATURE_NAMES: Record<keyof FeatureEntitlements, { title: string; desc: string }> = {
  questions_full: {
    title: 'Full 22,222 Question Bank Access',
    desc: 'Unlocks complete LeetCode & FAANG questions across all 5 experience tiers.',
  },
  coding_sandbox: {
    title: 'Interactive Monaco Sandbox',
    desc: 'Live code execution runner for JavaScript, TypeScript, and React JSX.',
  },
  system_design: {
    title: 'Interactive System Design Canvas',
    desc: '4-Tier distributed architecture studio, replay blueprints, and capacity estimators.',
  },
  video_mock: {
    title: 'AI Audio & Video Mock Interviews',
    desc: 'Timed candidate simulations with automated FAANG rubric grading.',
  },
  compiler_studios: {
    title: 'Compilers, AST & WebAssembly Studios',
    desc: 'Babel AST visualizers, WebAssembly SIMD runners, and SDUI schemas.',
  },
  cloud_sync: {
    title: 'PostgreSQL Cloud Database Sync',
    desc: 'Sync progress and activities securely across multiple devices in Supabase.',
  },
}

export default function FeatureGuard({
  feature,
  featureTitle,
  featureDesc,
  children,
}: FeatureGuardProps) {
  const { hasFeature, isAuthenticated, openAuthModal, user } = useAuth()
  const [requestSent, setRequestSent] = useState<boolean>(false)

  const isGranted = hasFeature(feature)

  if (isGranted) {
    return <>{children}</>
  }

  const meta = FEATURE_NAMES[feature] || {
    title: featureTitle || 'Restricted Feature',
    desc: featureDesc || 'This feature requires administrator entitlement.',
  }

  return (
    <div className="feature-guard-card page-enter">
      <div className="fg-lock-icon">🔒</div>
      <span className="fg-badge">ADMIN ENTITLEMENT REQUIRED</span>
      <h2>{featureTitle || meta.title}</h2>
      <p className="fg-desc">{featureDesc || meta.desc}</p>

      <div className="fg-status-box">
        <div className="fg-status-row">
          <span>Feature Key:</span>
          <code>{feature}</code>
        </div>
        <div className="fg-status-row">
          <span>Current Account:</span>
          <strong>{isAuthenticated && user ? `${user.name} (${user.role.toUpperCase()})` : 'Guest / Not Signed In'}</strong>
        </div>
        <div className="fg-status-row">
          <span>Admin Entitlement Status:</span>
          <span className="fg-locked-tag">❌ Not Granted</span>
        </div>
      </div>

      <div className="fg-actions">
        {!isAuthenticated ? (
          <button type="button" className="btn btn-primary" onClick={openAuthModal}>
            🔐 Sign In to Check Entitlements
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setRequestSent(true)}
            disabled={requestSent}
          >
            {requestSent ? '✅ Access Request Sent to Admin' : '📩 Request Admin to Enable This Feature'}
          </button>
        )}

        <Link to="/user-management" className="btn btn-secondary">
          🛡️ Open User Management &amp; RBAC Studio →
        </Link>
      </div>

      <p className="fg-note">
        💡 <strong>Admin Tip:</strong> Platform Administrators can enable or disable this feature for any specific user with 1 click inside the <Link to="/user-management">User Management Directory</Link>.
      </p>
    </div>
  )
}
