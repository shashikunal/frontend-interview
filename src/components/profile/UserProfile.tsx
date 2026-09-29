import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useRemoveAvatarMutation,
} from '../../hooks/useProfileQuery'
import { geoTelemetryService, getDeviceAndBrowserInfo, ensureIPv4, resolveCityArea, type LoginSessionTelemetry } from '../../services/geoTelemetryService'
import './UserProfile.css'

interface UserProfileProps {
  embedded?: boolean
}

export default function UserProfile({ embedded = false }: UserProfileProps) {
  const { user, isAuthenticated, signOut, openAuthModal, updatePassword, resetPassword } = useAuth()
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAdmin = user?.role === 'admin'

  // Profile Form State
  const [fullName, setFullName] = useState<string>(user?.name || '')
  const [batch, setBatch] = useState<string>(user?.batch || '2026-Alpha')
  const [batchCode, setBatchCode] = useState<string>(user?.batchCode || 'FE-2026-A')
  const [targetTrack, setTargetTrack] = useState<string>(user?.targetTrack || 'Frontend Architecture')
  const [phone, setPhone] = useState<string>(user?.phone || '')
  const [githubUrl, setGithubUrl] = useState<string>(user?.githubUrl || '')
  const [linkedinUrl, setLinkedinUrl] = useState<string>(user?.linkedinUrl || '')
  const [bio, setBio] = useState<string>(user?.bio || '')
  const [recentLogin, setRecentLogin] = useState<LoginSessionTelemetry | null>(null)

  useEffect(() => {
    if (user?.id) {
      const logs = geoTelemetryService.getUserLoginHistory(user.id)
      if (logs.length > 0) {
        const raw = logs[0]
        const ipv4 = ensureIPv4(raw.ipAddress)
        const nearestLocation = resolveCityArea(raw.city, raw.region, raw.country, raw.latitude, raw.longitude, ipv4)
        setRecentLogin({
          ...raw,
          ipAddress: ipv4,
          nearestLocation,
        })
      } else {
        geoTelemetryService.fetchCurrentGeoLocation().then(geo => {
          const { device, browser, os } = getDeviceAndBrowserInfo()
          setRecentLogin({
            id: 'log_current',
            userId: user.id,
            userEmail: user.email,
            userName: user.name || 'User',
            role: user.role,
            ipAddress: geo.ipAddress,
            latitude: geo.latitude,
            longitude: geo.longitude,
            city: geo.city,
            region: geo.region,
            country: geo.country,
            nearestLocation: geo.nearestLocation,
            device,
            browser,
            os,
            timestamp: new Date().toISOString(),
          })
        }).catch(() => {})
      }
    }
  }, [user?.id, user?.email, user?.name, user?.role])

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string>('')
  const [profileErrorMsg, setProfileErrorMsg] = useState<string>('')

  React.useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setBatch(user.batch || '2026-Alpha')
      setBatchCode(user.batchCode || 'FE-2026-A')
      setTargetTrack(user.targetTrack || 'Frontend Architecture')
      setPhone(user.phone || '')
      setGithubUrl(user.githubUrl || '')
      setLinkedinUrl(user.linkedinUrl || '')
      setBio(user.bio || '')
    }
  }, [user])

  // Password Form State
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string>('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('')
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false)

  // Password Reset Email State
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false)
  const [resetEmailLoading, setResetEmailLoading] = useState<boolean>(false)

  // TanStack Query Mutations
  const updateProfileMutation = useUpdateProfileMutation()
  const uploadAvatarMutation = useUploadAvatarMutation()
  const removeAvatarMutation = useRemoveAvatarMutation()

  // Derive Initials Fallback (e.g., "Shashi Kunal" -> "SK")
  const getInitials = (name?: string, email?: string): string => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.slice(0, 2).toUpperCase()
    }
    if (email && email.trim().length > 0) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'US'
  }

  const initials = getInitials(user?.name, user?.email)

  // Update Profile & Batch Information Handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccessMsg('')
    setProfileErrorMsg('')

    const cleanName = fullName.trim()
    if (!cleanName) {
      setProfileErrorMsg('Full Name cannot be blank.')
      return
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: cleanName,
        batch: batch.trim() || '2026-Alpha',
        batchCode: batchCode.trim() || 'FE-2026-A',
        targetTrack: targetTrack.trim() || 'Frontend Architecture',
        phone: phone.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        bio: bio.trim(),
      })
      setProfileSuccessMsg('Profile & Batch information updated successfully!')
      setTimeout(() => setProfileSuccessMsg(''), 4000)
    } catch (err: any) {
      setProfileErrorMsg(err?.message || 'Failed to update profile.')
    }
  }

  // Handle Avatar File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfileSuccessMsg('')
    setProfileErrorMsg('')

    try {
      await uploadAvatarMutation.mutateAsync(file)
      setProfileSuccessMsg('Profile avatar image updated successfully!')
      setTimeout(() => setProfileSuccessMsg(''), 4000)
    } catch (err: any) {
      setProfileErrorMsg(err?.message || 'Failed to upload avatar image.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle Remove Avatar
  const handleRemoveAvatar = async () => {
    setProfileSuccessMsg('')
    setProfileErrorMsg('')

    try {
      await removeAvatarMutation.mutateAsync()
      setProfileSuccessMsg('Profile avatar removed. Reverted to initials avatar.')
      setTimeout(() => setProfileSuccessMsg(''), 4000)
    } catch (err: any) {
      setProfileErrorMsg(err?.message || 'Failed to remove avatar.')
    }
  }

  // Update Password Handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccessMsg('')
    setPasswordErrorMsg('')

    if (!newPassword) {
      setPasswordErrorMsg('Please enter a new password.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordErrorMsg('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation password do not match.')
      return
    }

    setIsSubmittingPassword(true)
    try {
      const res = await updatePassword(newPassword)
      if (res.success) {
        setPasswordSuccessMsg('Password successfully updated!')
        setNewPassword('')
        setConfirmPassword('')
        setIsChangingPassword(false)
        setTimeout(() => setPasswordSuccessMsg(''), 5000)
      } else {
        setPasswordErrorMsg(res.message || 'Failed to update password.')
      }
    } catch (err: any) {
      setPasswordErrorMsg(err?.message || 'An error occurred while updating password.')
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  // Handle Forgot/Reset Password Email
  const handleSendResetEmail = async () => {
    if (!user?.email) return
    setResetEmailLoading(true)
    setPasswordErrorMsg('')
    try {
      const res = await resetPassword(user.email)
      if (res.success) {
        setResetEmailSent(true)
      } else {
        setPasswordErrorMsg(res.message || 'Could not send reset password email.')
      }
    } catch (err: any) {
      setPasswordErrorMsg(err?.message || 'Failed to trigger password reset.')
    } finally {
      setResetEmailLoading(false)
    }
  }

  // Guest State Banner
  if (!isAuthenticated) {
    return (
      <div className="account-workspace page-enter">
        <div className="account-header">
          <h1>ACCOUNT &amp; SECURITY</h1>
          <p className="subtitle">Sign in to your account to manage your profile, security, and avatar settings.</p>
        </div>

        <div className="account-card guest-mode-card">
          <div className="guest-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>You are currently viewing in Guest Mode. Please sign in or register to access account security settings.</p>
          <button type="button" className="btn btn-primary" onClick={() => openAuthModal('user')}>
            Sign In / Register →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`account-workspace page-enter ${embedded ? 'embedded-workspace' : ''}`}>
      {/* Page Title (Suppressed when embedded in Dashboard tab) */}
      {!embedded && (
        <div className="account-header">
          <div className="ph-badge-row">
            <span className="account-badge">🔒 ACCOUNT &amp; SECURITY</span>
          </div>
          <h1>Account &amp; Security Workspace</h1>
          <p className="subtitle">
            Manage your account profile identity, credentials, Cloudinary profile avatar, and security authentication settings.
          </p>
        </div>
      )}

      {/* Profile Banners */}
      {profileSuccessMsg && <div className="account-alert alert-success">{profileSuccessMsg}</div>}
      {profileErrorMsg && <div className="account-alert alert-danger">{profileErrorMsg}</div>}

      <div className="account-grid">
        {/* Left Column: Avatar & Quick Info */}
        <div className="account-card avatar-card">
          <div className="avatar-section">
            <div className="avatar-frame">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.name || 'Profile Avatar'}
                  className="avatar-img"
                  onError={(e) => {
                    // Hide broken image link gracefully
                    (e.target as HTMLElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="avatar-initials" title={`Initials for ${user?.name || user?.email}`}>
                  {initials}
                </div>
              )}
            </div>

            <div className="avatar-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden-file-input"
                id="avatar-file-upload"
              />
              <label
                htmlFor="avatar-file-upload"
                className={`btn btn-secondary ${uploadAvatarMutation.isPending ? 'disabled' : ''}`}
              >
                {uploadAvatarMutation.isPending ? 'Uploading to Cloudinary...' : '📷 Change Photo'}
              </label>

              {user?.avatarUrl && (
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  onClick={handleRemoveAvatar}
                  disabled={removeAvatarMutation.isPending}
                >
                  {removeAvatarMutation.isPending ? 'Removing...' : '🗑️ Remove'}
                </button>
              )}
            </div>
            <span className="avatar-hint">Supported formats: JPEG, PNG, WebP (Max 5MB)</span>
          </div>

          <div className="quick-meta-box">
            <div className="meta-row">
              <span className="meta-lbl">Account Status</span>
              <span className="meta-val badge-active">Active</span>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">User Role</span>
              <span className={`meta-val role-tag ${user?.role}`}>{user?.role?.toUpperCase()}</span>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">Assigned Batch</span>
              <span className="meta-val batch-pill">{batch || '2026-Alpha'}</span>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">Batch Code</span>
              <span className="meta-val batch-code-pill">{batchCode || 'FE-2026-A'}</span>
            </div>
            <div className="meta-row">
              <span className="meta-lbl">Member Since</span>
              <span className="meta-val">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active User'}
              </span>
            </div>
          </div>

          {/* Recent Login & Geolocation Security Telemetry Card */}
          <div className="recent-login-telemetry-card">
            <div className="rlt-header">
              <span className="rlt-title-badge">
                📍 Most Recent Login
              </span>
              <span className="rlt-session-tag">
                🟢 ACTIVE SESSION
              </span>
            </div>

            {recentLogin ? (
              <div className="rlt-body">
                <div className="rlt-row">
                  <span className="rlt-lbl">IP Address</span>
                  <span className="rlt-ip-code">{recentLogin.ipAddress}</span>
                </div>
                <div className="rlt-row">
                  <span className="rlt-lbl">Nearest City Area</span>
                  <span className="rlt-location-highlight">{recentLogin.nearestLocation}</span>
                </div>
                <div className="rlt-row">
                  <span className="rlt-lbl">Coordinates</span>
                  <span className="rlt-coords-badge">
                    {recentLogin.latitude?.toFixed(4)}° N, {recentLogin.longitude?.toFixed(4)}° E
                  </span>
                </div>
                <div className="rlt-row">
                  <span className="rlt-lbl">Device &amp; OS</span>
                  <span className="rlt-device-info">{recentLogin.device} ({recentLogin.os}, {recentLogin.browser})</span>
                </div>
                <div className="rlt-row">
                  <span className="rlt-lbl">Login Time</span>
                  <span className="rlt-time-info">
                    {new Date(recentLogin.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <span className="rlt-time-info">Detecting live IP &amp; city geolocation telemetry...</span>
            )}
          </div>
        </div>

        {/* Right Column: Personal Information & Security Forms */}
        <div className="account-main-column">
          {/* Section 1: Personal & Batch Information */}
          <div className="account-card">
            <div className="card-header-row">
              <h3>Personal &amp; Batch Profile</h3>
              <span className="section-sub">Update account identity, batch details &amp; academic metadata</span>
            </div>

            <form onSubmit={handleUpdateProfile} className="account-form">
              <div className="form-group-row">
                <div className="form-group flex-1">
                  <label htmlFor="user-full-name">Full Name</label>
                  <input
                    id="user-full-name"
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="user-phone">Phone Number</label>
                  <input
                    id="user-phone"
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user-email">Email Address (Account Identity)</label>
                <div className="email-input-wrap">
                  <input
                    id="user-email"
                    type="email"
                    className="form-control read-only"
                    value={user?.email || ''}
                    disabled
                    readOnly
                  />
                  <span className="verification-status-badge">
                    ✅ Verified Identity
                  </span>
                </div>
                <span className="form-hint">Email is linked to your Supabase Auth session and cannot be edited directly.</span>
              </div>

              {/* Batch & Cohort Allocation Section */}
              <div className="form-group-row">
                <div className="form-group flex-1">
                  <label htmlFor="user-batch">
                    Assigned Batch Name / Cohort {!isAdmin && <span className="read-only-tag">🔒 Readonly</span>}
                  </label>
                  <input
                    id="user-batch"
                    type="text"
                    className={`form-control ${!user || user.role !== 'admin' ? 'read-only' : ''}`}
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. 2026-Alpha, Batch 2026"
                    readOnly={!user || user.role !== 'admin'}
                  />
                  <span className="form-hint">
                    {user?.role === 'admin'
                      ? 'Editable as Administrator. Unique cohort name assigned to candidate.'
                      : '🔒 Assigned by Administrator. Batch allocation can only be modified by platform admins.'}
                  </span>
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="user-batch-code">
                    Batch Code ID {!isAdmin && <span className="read-only-tag">🔒 Readonly</span>}
                  </label>
                  <input
                    id="user-batch-code"
                    type="text"
                    className={`form-control ${!user || user.role !== 'admin' ? 'read-only' : ''}`}
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    placeholder="e.g. FE-2026-A, ARCH-2026"
                    readOnly={!user || user.role !== 'admin'}
                  />
                  <span className="form-hint">
                    {user?.role === 'admin'
                      ? 'Editable as Administrator. System code identifier used for automated meeting & REST API routing.'
                      : '🔒 Assigned by Administrator. Batch Code is used for automated meeting assignment.'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user-target-track">Target Career &amp; Specialization Track</label>
                <input
                  id="user-target-track"
                  type="text"
                  className="form-control"
                  value={targetTrack}
                  onChange={(e) => setTargetTrack(e.target.value)}
                  placeholder="e.g. Frontend Architecture, Machine Coding, DSA & System Design"
                />
              </div>

              <div className="form-group-row">
                <div className="form-group flex-1">
                  <label htmlFor="user-github">GitHub Profile URL</label>
                  <input
                    id="user-github"
                    type="url"
                    className="form-control"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="user-linkedin">LinkedIn Profile URL</label>
                  <input
                    id="user-linkedin"
                    type="url"
                    className="form-control"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user-bio">Bio &amp; Candidate Dossier Summary</label>
                <textarea
                  id="user-bio"
                  className="form-control"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief summary of candidate experience, core tech stack, and interview goals..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving Profile & Batch...' : 'Save Profile & Batch Metadata'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Theme & Appearance Preferences */}
          <div className="account-card">
            <div className="card-header-row">
              <h3>Theme &amp; Appearance</h3>
              <span className="section-sub">Customize workspace interface theme</span>
            </div>

            <div className="theme-selector-grid">
              <button
                type="button"
                className={`theme-option-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <span className="theme-icon">🌙</span>
                <span className="theme-name">Dark Mode</span>
                <span className="theme-desc">High contrast dark palette</span>
              </button>

              <button
                type="button"
                className={`theme-option-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <span className="theme-icon">☀️</span>
                <span className="theme-name">Light Mode</span>
                <span className="theme-desc">Clean bright workspace</span>
              </button>

              <button
                type="button"
                className={`theme-option-btn ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
              >
                <span className="theme-icon">💻</span>
                <span className="theme-name">System Auto</span>
                <span className="theme-desc">Matches OS preference</span>
              </button>
            </div>
          </div>

          {/* Section 3: Subscription & Feature Entitlements */}
          <div className="account-card">
            <div className="card-header-row">
              <h3>Subscription &amp; Feature Access</h3>
              <span className="section-sub">Active tier entitlements</span>
            </div>

            <div className="entitlements-overview">
              <div className="tier-header-badge">
                <span className="tier-icon">💎</span>
                <div>
                  <div className="tier-title">{user?.role?.toUpperCase()} TIER</div>
                  <div className="tier-sub font-mono">Role ID: {user?.role}</div>
                </div>
              </div>

              <div className="entitlements-grid">
                <div className={`entitlement-chip ${user?.entitlements?.canAccessDSAStudio ? 'granted' : 'locked'}`}>
                  <span className="chip-icon">{user?.entitlements?.canAccessDSAStudio ? '✅' : '🔒'}</span>
                  <span>DSA Question Catalog &amp; Runner</span>
                </div>
                <div className={`entitlement-chip ${user?.entitlements?.canAccessMachineCoding ? 'granted' : 'locked'}`}>
                  <span className="chip-icon">{user?.entitlements?.canAccessMachineCoding ? '✅' : '🔒'}</span>
                  <span>Machine Coding Studio</span>
                </div>
                <div className={`entitlement-chip ${user?.entitlements?.canAccessAIVideoMock ? 'granted' : 'locked'}`}>
                  <span className="chip-icon">{user?.entitlements?.canAccessAIVideoMock ? '✅' : '🔒'}</span>
                  <span>AI Video Mock Interview Suite</span>
                </div>
                <div className={`entitlement-chip ${user?.entitlements?.canAccessSystemDesign ? 'granted' : 'locked'}`}>
                  <span className="chip-icon">{user?.entitlements?.canAccessSystemDesign ? '✅' : '🔒'}</span>
                  <span>System Design &amp; MasterDocs</span>
                </div>
                <div className={`entitlement-chip ${user?.entitlements?.canAccessLiveMeetings ? 'granted' : 'locked'}`}>
                  <span className="chip-icon">{user?.entitlements?.canAccessLiveMeetings ? '✅' : '🔒'}</span>
                  <span>Realtime Meeting &amp; WebRTC Room</span>
                </div>
                <div className={`entitlement-chip ${user?.entitlements?.canAccessAdminPanel ? 'granted' : 'locked'}`}>
                  <span className="chip-icon">{user?.entitlements?.canAccessAdminPanel ? '✅' : '🔒'}</span>
                  <span>Platform Operations Control Plane</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Security & Password */}
          <div className="account-card">
            <div className="card-header-row">
              <h3>Security &amp; Password</h3>
              <span className="section-sub">Manage account credentials</span>
            </div>

            {passwordSuccessMsg && <div className="account-alert alert-success">{passwordSuccessMsg}</div>}
            {passwordErrorMsg && <div className="account-alert alert-danger">{passwordErrorMsg}</div>}

            <div className="security-status-box">
              <div className="sec-info">
                <span className="sec-label">Password</span>
                <span className="sec-mask">••••••••••••</span>
              </div>
              {!isChangingPassword ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordErrorMsg('')
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Change Password Form */}
            {isChangingPassword && (
              <form onSubmit={handleUpdatePassword} className="account-form pwd-form">
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password to confirm"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmittingPassword}
                  >
                    {isSubmittingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Email Reset Option */}
            <div className="reset-email-option">
              <span className="reset-hint">Need to reset your password via email?</span>
              {resetEmailSent ? (
                <span className="reset-sent-badge">✉️ Reset link sent to {user?.email}</span>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost-sm"
                  onClick={handleSendResetEmail}
                  disabled={resetEmailLoading}
                >
                  {resetEmailLoading ? 'Sending Email...' : 'Send Password Reset Email'}
                </button>
              )}
            </div>
          </div>

          {/* Section 5: Account Termination / Logout */}
          <div className="account-card danger-zone-card">
            <div className="card-header-row">
              <h3>Account Session</h3>
              <span className="section-sub">Sign out of active session</span>
            </div>

            <div className="signout-box">
              <p>Sign out of your active session on this device. Your state will be safely saved in Supabase Cloud.</p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => signOut()}
              >
                Sign Out of Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
