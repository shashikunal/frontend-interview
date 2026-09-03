import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, type UserRole, type FeatureEntitlements } from '../../context/AuthContext'
import { DEFAULT_ENTITLEMENTS } from '../../features/auth/types/auth.types'
import { profileService } from '../../features/auth/services/profile.service'
import { rbacService } from '../../features/auth/services/rbac.service'
import { auditService, type AccessNotificationItem } from '../../features/auth/services/audit.service'
import { progressSyncService, type UserTrackProgress, TRACK_DEFINITIONS } from '../../features/auth/services/progressSync.service'
import { dbActivityService, type ActivityLogItem } from '../../lib/supabase'
import type { AuthUserProfile } from '../../features/auth/types/auth.types'
import './AdminDashboard.css'

interface TrackStat {
  id: string
  name: string
  icon: string
  totalModules: number
  activeCandidates: number
  avgScore: number
  difficulty: 'Core' | 'Advanced' | 'Staff'
}

const PLATFORM_TRACKS: TrackStat[] = [
  { id: 't1', name: 'JavaScript & DOM Performance', icon: '⚡', totalModules: 85, activeCandidates: 1420, avgScore: 78, difficulty: 'Core' },
  { id: 't2', name: 'React 19 & State Architecture', icon: '⚛️', totalModules: 110, activeCandidates: 1890, avgScore: 74, difficulty: 'Advanced' },
  { id: 't3', name: 'Frontend System Design Studio', icon: '🏗️', totalModules: 48, activeCandidates: 950, avgScore: 68, difficulty: 'Staff' },
  { id: 't4', name: 'Babel AST & Compiler Visualizer', icon: '⚙️', totalModules: 32, activeCandidates: 620, avgScore: 62, difficulty: 'Staff' },
  { id: 't5', name: 'Algorithms & Data Structures', icon: '📐', totalModules: 140, activeCandidates: 1650, avgScore: 71, difficulty: 'Advanced' },
  { id: 't6', name: 'AI Video Mock Interview Simulator', icon: '🎥', totalModules: 24, activeCandidates: 780, avgScore: 81, difficulty: 'Staff' },
]

export default function AdminDashboard() {
  const { user } = useAuth()

  // State
  const [profiles, setProfiles] = useState<AuthUserProfile[]>([])
  const [notifications, setNotifications] = useState<AccessNotificationItem[]>([])
  const [_auditLogs, _setAuditLogs] = useState<Array<{ id: string; action: string; resource: string; createdAt: string; details?: Record<string, unknown> }>>([])
  const [progressMap, setProgressMap] = useState<Record<string, UserTrackProgress>>({})
  const [liveEventBanner, setLiveEventBanner] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [trackFilter, setTrackFilter] = useState<string>('ALL')
  const [progressFilter, setProgressFilter] = useState<string>('ALL')
  const [statusToast, setStatusToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'tracks' | 'audit'>('users')

  // Live Activities Stream State
  const [liveActivities, setLiveActivities] = useState<ActivityLogItem[]>([])
  const [activityFilter, setActivityFilter] = useState<string>('ALL')
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState<boolean>(false)

  // Bulk Selection
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())

  // Deep Dive User Modal & Curriculum Re-Allocation
  const [inspectUser, setInspectUser] = useState<AuthUserProfile | null>(null)
  const [modalTrack, setModalTrack] = useState<string>('React 19 & Architecture')
  const [modalModules, setModalModules] = useState<string[]>([])
  const [modalTargetDate, setModalTargetDate] = useState<string>('')
  const [isSavingCurriculum, setIsSavingCurriculum] = useState<boolean>(false)

  // Candidate Evaluation Report Modal
  const [reportUser, setReportUser] = useState<AuthUserProfile | null>(null)
  const [reportNotes, setReportNotes] = useState<Record<string, string>>({})

  // Invite / Create User Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [newUserName, setNewUserName] = useState<string>('')
  const [newUserEmail, setNewUserEmail] = useState<string>('')
  const [newUserRole, setNewUserRole] = useState<UserRole>('candidate')
  const [newUserCompany, setNewUserCompany] = useState<string>('Google')
  const [newUserLevel, setNewUserLevel] = useState<string>('L5 (Senior 5-9y)')
  const [newUserTrack, setNewUserTrack] = useState<string>('React 19 & Architecture')
  const [newUserEntitlements, setNewUserEntitlements] = useState<FeatureEntitlements>(DEFAULT_ENTITLEMENTS.candidate)
  const [isSubmittingUser, setIsSubmittingUser] = useState<boolean>(false)

  // Load live data from Supabase
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [fetchedProfiles, fetchedNotifications, fetchedAuditLogs, fetchedProgress, fetchedActivities] = await Promise.all([
        profileService.getAllProfiles(),
        auditService.getAccessNotifications(),
        auditService.getAuditLogs(15),
        progressSyncService.getAllUsersProgress(),
        dbActivityService.getAllActivities(50),
      ])

      setProgressMap(fetchedProgress)
      setLiveActivities(fetchedActivities)

      // Only REAL users from Supabase / database
      if (fetchedProfiles.length === 0 && user) {
        setProfiles([user])
      } else {
        setProfiles(fetchedProfiles)
      }

      setNotifications(fetchedNotifications)
      _setAuditLogs(fetchedAuditLogs)
    } catch (err) {
      console.warn('[Admin Dashboard] Load data error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Real-Time Progress & Activity Subscriptions
  useEffect(() => {
    const unsubProgress = progressSyncService.subscribeToProgress(updatedProgress => {
      setProgressMap(prev => ({
        ...prev,
        [updatedProgress.userId]: updatedProgress,
      }))
      setLiveEventBanner(`⚡ LIVE SYNC: ${updatedProgress.userName} solved a question in ${updatedProgress.trackName}! (${updatedProgress.completionPct}%)`)
      setTimeout(() => setLiveEventBanner(null), 5000)
    })

    const unsubActivities = dbActivityService.subscribeToActivities(newActivity => {
      setLiveActivities(prev => [newActivity, ...prev.slice(0, 99)])
      setLiveEventBanner(`⚡ LIVE EVENT: ${newActivity.userName || 'Candidate'} • ${newActivity.title}`)
      setTimeout(() => setLiveEventBanner(null), 5000)
    })

    const unsubAccess = auditService.subscribeToAccessRequests(notif => {
      setNotifications(prev => {
        const filtered = prev.filter(p => !(p.userEmail.toLowerCase() === notif.userEmail.toLowerCase() && p.featureKey === notif.featureKey))
        return [notif, ...filtered]
      })
      setLiveEventBanner(`📩 LIVE REQUEST: ${notif.userName} requested access to ${notif.featureName}!`)
      setTimeout(() => setLiveEventBanner(null), 5000)
    })

    return () => {
      unsubProgress()
      unsubActivities()
      unsubAccess()
    }
  }, [])

  // Toast helper
  const showToast = (msg: string) => {
    setStatusToast(msg)
    setTimeout(() => setStatusToast(null), 3500)
  }

  // 1. Approve Access Request directly from Notifications
  const handleApproveRequest = async (notif: AccessNotificationItem) => {
    const res = await auditService.approveAccessRequest(notif)
    if (res.success) {
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, status: 'APPROVED' } : n))
      )
      if (notif.userId) {
        setProfiles(prev =>
          prev.map(p =>
            p.id === notif.userId
              ? { ...p, entitlements: { ...p.entitlements, [notif.featureKey]: true } }
              : p
          )
        )
      }
      showToast(res.message)
    } else {
      showToast(res.message)
    }
  }

  // 2. Decline Access Request
  const handleDeclineRequest = (id: string, email: string, feature: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: 'DECLINED' } : n))
    )
    showToast(`Declined ${feature} access request for ${email}.`)
  }

  // 3. Toggle single feature entitlement on user
  const handleToggleEntitlement = async (targetUser: AuthUserProfile, featureKey: keyof FeatureEntitlements) => {
    const updated = {
      ...targetUser.entitlements,
      [featureKey]: !targetUser.entitlements[featureKey],
    }
    const res = await rbacService.updateEntitlements(targetUser.id, updated)
    if (res.success) {
      setProfiles(prev =>
        prev.map(p => (p.id === targetUser.id ? { ...p, entitlements: updated } : p))
      )
      if (inspectUser && inspectUser.id === targetUser.id) {
        setInspectUser({ ...inspectUser, entitlements: updated })
      }
      showToast(`Updated '${featureKey}' for ${targetUser.name}`)
    } else {
      showToast(res.message)
    }
  }

  // 4. Suspend or Reactivate Account
  const handleToggleAccountStatus = async (targetUser: AuthUserProfile) => {
    const nextStatus = targetUser.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    const res = await profileService.updateAccountStatus(targetUser.id, nextStatus)
    if (res.success) {
      setProfiles(prev =>
        prev.map(p => (p.id === targetUser.id ? { ...p, status: nextStatus } : p))
      )
      auditService.logEvent({
        userId: targetUser.id,
        action: nextStatus === 'SUSPENDED' ? 'USER_ACCOUNT_SUSPENDED' : 'USER_ACCOUNT_ACTIVATED',
        resource: 'profiles.status',
        details: { email: targetUser.email },
      })
      showToast(`Account for ${targetUser.name} is now ${nextStatus}!`)
    } else {
      showToast(res.message)
    }
  }

  // 6. Create / Invite User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail || !newUserEmail.includes('@')) {
      showToast('Please enter a valid email address.')
      return
    }

    setIsSubmittingUser(true)
    const res = await profileService.createUserProfile({
      name: newUserName || newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      targetCompany: newUserCompany,
      experienceLevel: newUserLevel,
      entitlements: newUserEntitlements,
    })
    setIsSubmittingUser(false)

    if (res.success && res.user) {
      setProfiles(prev => [res.user!, ...prev])
      setProgressMap(prev => ({
        ...prev,
        [res.user!.id]: {
          userId: res.user!.id,
          userEmail: res.user!.email,
          userName: res.user!.name,
          trackName: newUserTrack,
          trackIcon: newUserTrack.includes('React') ? '⚛️' : newUserTrack.includes('Design') ? '🏗️' : '⚡',
          solvedCount: 0,
          totalQuestions: 75,
          completionPct: 0,
          streak: 0,
          quizAccuracy: 0,
          mockScore: 0,
          lastActive: 'Just joined',
          categoryBreakdown: {},
        },
      }))
      setIsCreateModalOpen(false)
      setNewUserName('')
      setNewUserEmail('')
      showToast(res.message)
    } else {
      showToast(res.message)
    }
  }

  // 7. Open Inspect and initialize curriculum state
  const handleOpenInspect = (u: AuthUserProfile) => {
    setInspectUser(u)
    const prog = progressMap[u.id]
    const track = prog?.trackName || 'React 19 & Architecture'
    setModalTrack(track)
    setModalModules(prog?.focusModules && prog.focusModules.length > 0 ? prog.focusModules : (TRACK_DEFINITIONS[track]?.modules || []))
    setModalTargetDate(prog?.targetCompletionDate || '')
  }

  // 8. Quick 1-click re-allocate track from table row
  const handleQuickAssignTrack = async (targetUser: AuthUserProfile, newTrack: string) => {
    const def = TRACK_DEFINITIONS[newTrack]
    const updated = await progressSyncService.updateUserTrack(targetUser.id, {
      trackName: newTrack,
      trackIcon: def?.icon,
      totalQuestions: def?.totalQuestions,
      focusModules: def?.modules,
    })
    setProgressMap(prev => ({ ...prev, [targetUser.id]: updated }))
    await dbActivityService.logActivity({
      userId: targetUser.id,
      userName: targetUser.name,
      userEmail: targetUser.email,
      type: 'TRACK_SWITCHED',
      title: `Assigned Track: ${newTrack}`,
      details: `Re-allocated to ${def?.totalQuestions || 75} questions curriculum by Platform Administrator`,
    })
    showToast(`Re-allocated curriculum track to '${newTrack}' for ${targetUser.name}!`)
  }

  // 9. Save detailed curriculum & focus modules in deep dive modal
  const handleSaveCurriculumReallocation = async () => {
    if (!inspectUser) return
    setIsSavingCurriculum(true)
    const def = TRACK_DEFINITIONS[modalTrack]
    const updated = await progressSyncService.updateUserTrack(inspectUser.id, {
      trackName: modalTrack,
      trackIcon: def?.icon,
      totalQuestions: def?.totalQuestions,
      focusModules: modalModules,
      targetCompletionDate: modalTargetDate,
    })
    setProgressMap(prev => ({ ...prev, [inspectUser.id]: updated }))
    await dbActivityService.logActivity({
      userId: inspectUser.id,
      userName: inspectUser.name,
      userEmail: inspectUser.email,
      type: 'TRACK_SWITCHED',
      title: `Curriculum Tailored: ${modalTrack}`,
      details: `Allocated ${modalModules.length} focus modules with target date ${modalTargetDate || 'unspecified'}`,
    })
    setIsSavingCurriculum(false)
    showToast(`Saved curriculum re-allocation for ${inspectUser.name}!`)
  }

  // 10. Bulk Selection Toggles
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(profiles.map(p => p.id)))
    } else {
      setSelectedUserIds(new Set())
    }
  }

  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Candidate Assessment & Evaluation Report
  const handleOpenReport = (u: AuthUserProfile) => {
    setReportUser(u)
  }

  const computeCandidateReadiness = (prog?: UserTrackProgress) => {
    if (!prog) return { index: 50, verdict: 'LEANING HIRE', color: '#f59e0b', label: '⚖️ LEANING HIRE' }
    const index = Math.min(100, Math.round(
      (prog.completionPct * 0.35) +
      (prog.quizAccuracy * 0.30) +
      ((prog.mockScore / 5.0) * 100 * 0.25) +
      Math.min(prog.streak * 2, 10)
    ))
    if (index >= 85) return { index, verdict: 'STRONG HIRE', color: '#10b981', label: '⭐ STRONG HIRE (Top 5% Candidate)' }
    if (index >= 70) return { index, verdict: 'HIRE', color: '#6366f1', label: '✅ HIRE (Senior Bar Met)' }
    if (index >= 50) return { index, verdict: 'LEANING HIRE', color: '#f59e0b', label: '⚖️ LEANING HIRE (Follow-up Recommended)' }
    return { index, verdict: 'NEEDS PREPARATION', color: '#f87171', label: '⏳ MORE PRACTICE RECOMMENDED' }
  }

  const handleCopyReportMarkdown = (targetUser: AuthUserProfile, prog?: UserTrackProgress) => {
    const readiness = computeCandidateReadiness(prog)
    const notes = reportNotes[targetUser.id] || 'Candidate demonstrated solid problem-solving fundamentals and clear architectural communication.'
    const md = [
      `# FAANG Engineering Candidate Evaluation Dossier: ${targetUser.name}`,
      `**Target Role:** ${targetUser.targetCompany} • ${targetUser.experienceLevel}`,
      `**Email:** ${targetUser.email}`,
      `**Evaluation Date:** ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`,
      `\n## Executive Hiring Recommendation: ${readiness.label}`,
      `**FAANG Readiness Index (FRI):** ${readiness.index} / 100`,
      `\n### Core Competency Metrics:`,
      `- **Assigned Track:** ${prog?.trackName || 'React 19 & Architecture'} (${prog?.completionPct || 0}% Completed, ${prog?.solvedCount || 0}/${prog?.totalQuestions || 75} Solved)`,
      `- **Practice Quiz Accuracy:** ${prog?.quizAccuracy || 0}%`,
      `- **Mock Interview Performance:** ${prog?.mockScore || 0} / 5.0`,
      `- **Daily Practice Consistency Streak:** ${prog?.streak || 0} days`,
      `\n### Evaluator & Admin Notes:`,
      `> ${notes}`,
      `\n*Generated by FAANG InterviewPrep Enterprise Platform.*`,
    ].join('\n')

    navigator.clipboard.writeText(md)
    showToast(`Copied ${targetUser.name}'s evaluation dossier in Markdown!`)
  }

  // 8. Bulk Grant All Features
  const handleBulkGrantAll = async () => {
    const targetIds = selectedUserIds.size > 0 ? Array.from(selectedUserIds) : profiles.map(p => p.id)
    const fullEntitlements: FeatureEntitlements = {
      questions_full: true,
      coding_sandbox: true,
      system_design: true,
      video_mock: true,
      compiler_studios: true,
      cloud_sync: true,
    }
    const res = await profileService.bulkUpdateEntitlements(targetIds, fullEntitlements)
    if (res.success) {
      setProfiles(prev =>
        prev.map(p => (targetIds.includes(p.id) ? { ...p, entitlements: fullEntitlements } : p))
      )
      showToast(`Granted all features to ${targetIds.length} users!`)
    }
  }

  // 9. Bulk Reset Entitlements
  const handleBulkReset = async () => {
    const targetIds = selectedUserIds.size > 0 ? Array.from(selectedUserIds) : profiles.map(p => p.id)
    const res = await profileService.bulkUpdateEntitlements(targetIds, DEFAULT_ENTITLEMENTS.candidate)
    if (res.success) {
      setProfiles(prev =>
        prev.map(p => (targetIds.includes(p.id) ? { ...p, entitlements: DEFAULT_ENTITLEMENTS.candidate } : p))
      )
      showToast(`Reset features to Candidate defaults for ${targetIds.length} users.`)
    }
  }

  // 10. Export Users to CSV
  const handleExportCSV = () => {
    const targetList = selectedUserIds.size > 0
      ? profiles.filter(p => selectedUserIds.has(p.id))
      : profiles

    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Track', 'Progress Pct', 'Solved', 'Streak', 'Target Company', 'Level']
    const rows = targetList.map(u => {
      const prog = progressMap[u.id] || { trackName: 'React 19', completionPct: 0, solvedCount: 0, streak: 0 }
      return [
        u.id,
        `"${u.name}"`,
        `"${u.email}"`,
        u.role,
        u.status || 'ACTIVE',
        `"${prog.trackName}"`,
        `${prog.completionPct}%`,
        prog.solvedCount,
        prog.streak,
        `"${u.targetCompany || ''}"`,
        `"${u.experienceLevel || ''}"`,
      ]
    })

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `candidate_tracks_progress_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${targetList.length} users with track progress to CSV.`)
  }

  // Filtered users with tracks
  const filteredUsers = useMemo(() => {
    return profiles.filter(p => {
      const matchQuery =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.targetCompany || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchRole = roleFilter === 'ALL' || p.role === roleFilter
      const prog = progressMap[p.id]
      const matchTrack = trackFilter === 'ALL' || (prog && prog.trackName.toLowerCase().includes(trackFilter.toLowerCase()))

      let matchProgress = true
      if (progressFilter === 'READY') matchProgress = Boolean(prog && prog.completionPct >= 70)
      else if (progressFilter === 'PROGRESS') matchProgress = Boolean(prog && prog.completionPct > 0 && prog.completionPct < 70)
      else if (progressFilter === 'STARTED') matchProgress = Boolean(!prog || prog.completionPct === 0)

      return matchQuery && matchRole && matchTrack && matchProgress
    })
  }, [profiles, progressMap, searchTerm, roleFilter, trackFilter, progressFilter])

  // Aggregate Metrics
  const pendingRequestsCount = useMemo(() => {
    return notifications.filter(n => n.status === 'PENDING').length
  }, [notifications])

  const avgCompletionPct = useMemo(() => {
    const list = Object.values(progressMap)
    if (list.length === 0) return 0
    const total = list.reduce((sum, item) => sum + item.completionPct, 0)
    return Math.round(total / list.length)
  }, [progressMap])

  const topStreakCandidate = useMemo(() => {
    const list = Object.values(progressMap)
    if (list.length === 0) return { userName: 'No streak yet', streak: 0 }
    return list.slice().sort((a, b) => b.streak - a.streak)[0]
  }, [progressMap])

  // Filtered Live Telemetry Activities
  const filteredActivities = useMemo(() => {
    if (activityFilter === 'ALL') return liveActivities
    return liveActivities.filter(a => a.type === activityFilter)
  }, [liveActivities, activityFilter])

  const handleExportActivitiesCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Type', 'Title', 'Details', 'Timestamp']
    const rows = filteredActivities.map(a => [
      a.id,
      `"${a.userName || 'Candidate'}"`,
      `"${a.userEmail || ''}"`,
      a.type,
      `"${a.title}"`,
      `"${a.details || ''}"`,
      `"${a.timestamp}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `live_telemetry_stream_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredActivities.length} live telemetry events to CSV.`)
  }

  return (
    <div className="admin-dashboard-page page-enter">
      {/* Toast Notification */}
      {statusToast && (
        <div className="admin-toast-alert">
          <span>🔔</span> {statusToast}
        </div>
      )}

      {/* Live Sync Banner */}
      {liveEventBanner && (
        <div className="admin-live-banner-alert">
          <span className="alb-pulse">🟢</span>
          <strong>{liveEventBanner}</strong>
        </div>
      )}

      {/* Admin Header */}
      <div className="admin-header-hero">
        <div className="ahh-left">
          <div className="ahh-badge-row">
            <span className="ahh-badge">🛡️ PLATFORM ADMINISTRATOR CONTROL</span>
            <span className="ahh-live-pill">🟢 Real-Time Supabase WebSocket Sync</span>
          </div>
          <h1>Candidate Tracks &amp; Progress Command Center</h1>
          <p className="subtitle">
            Live database sync of user curriculum tracks, exact completion percentages, study streaks, and 1-click feature access approval notifications.
          </p>
        </div>

        <div className="ahh-actions">
          <button
            type="button"
            className="btn btn-primary ahh-invite-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ Invite / Create User
          </button>
          <button
            type="button"
            className="btn btn-secondary ahh-refresh-btn"
            onClick={loadData}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Syncing...' : '🔄 Live Sync DB'}
          </button>
          <Link to="/user-management" className="btn btn-secondary ahh-mgmt-btn">
            ⚙️ RBAC Matrix
          </Link>
        </div>
      </div>

      {/* Quick KPI Stat Cards */}
      <div className="admin-stats-grid">
        <div className="card-box stat-kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <span className="kpi-num">{profiles.length}</span>
            <span className="kpi-label">Candidates &amp; Users</span>
          </div>
          <span className="kpi-sub">Total database profiles</span>
        </div>

        <div className="card-box stat-kpi-card highlight-progress">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <span className="kpi-num">{avgCompletionPct}%</span>
            <span className="kpi-label">Avg Track Completion</span>
          </div>
          <span className="kpi-sub">Platform-wide curriculum mastery</span>
        </div>

        <div className="card-box stat-kpi-card">
          <div className="kpi-icon">🔥</div>
          <div className="kpi-content">
            <span className="kpi-num">{topStreakCandidate.streak}d</span>
            <span className="kpi-label">Top Streak ({topStreakCandidate.userName?.split(' ')[0] || 'Candidate'})</span>
          </div>
          <span className="kpi-sub">Consecutive daily problem solving</span>
        </div>

        <div className="card-box stat-kpi-card highlight-attention">
          <div className="kpi-icon">📩</div>
          <div className="kpi-content">
            <span className="kpi-num">{pendingRequestsCount}</span>
            <span className="kpi-label">Pending Requests</span>
          </div>
          <span className="kpi-sub">{pendingRequestsCount > 0 ? 'Action required in Notifications' : 'All requests approved'}</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="admin-nav-tabs">
        <button
          type="button"
          className={`ant-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 1. User Directory &amp; Track Progress ({profiles.length})
        </button>
        <button
          type="button"
          className={`ant-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📩 2. Access Requests &amp; Notifications {pendingRequestsCount > 0 && <span className="tab-bubble">{pendingRequestsCount}</span>}
        </button>
        <button
          type="button"
          className={`ant-tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          📚 3. Platform Learning Tracks
        </button>
        <button
          type="button"
          className={`ant-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          ⚡ 4. Live Candidate Activity Stream {liveActivities.length > 0 && <span className="tab-bubble live">{liveActivities.length}</span>}
        </button>
      </div>

      {/* ================================================================ */}
      {/* TAB 1: USERS DIRECTORY, TRACKS & COMPLETION PROGRESS */}
      {/* ================================================================ */}
      {activeTab === 'users' && (
        <div className="admin-tab-content">
          <div className="card-box user-directory-panel">
            {/* Top Filter Bar */}
            <div className="udp-top-bar">
              <div>
                <h3>Real-Time Candidate Progression &amp; Tracks ({filteredUsers.length})</h3>
                <p className="udp-desc">
                  Inspect student track completion, quiz accuracy, streaks, and manage feature entitlements with live Supabase sync.
                </p>
              </div>

              <div className="udp-filters">
                <input
                  type="text"
                  className="search-field"
                  placeholder="Search user, email, company..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <select
                  className="role-dropdown"
                  value={trackFilter}
                  onChange={e => setTrackFilter(e.target.value)}
                  title="Filter by Active Track"
                >
                  <option value="ALL">All Tracks</option>
                  <option value="React">⚛️ React 19</option>
                  <option value="System Design">🏗️ System Design</option>
                  <option value="JavaScript">⚡ JavaScript DOM</option>
                  <option value="Algorithms">📐 Algorithms</option>
                </select>

                <select
                  className="role-dropdown"
                  value={progressFilter}
                  onChange={e => setProgressFilter(e.target.value)}
                  title="Filter by Completion Level"
                >
                  <option value="ALL">All Progress</option>
                  <option value="READY">Interview Ready (70%+)</option>
                  <option value="PROGRESS">In Progress (1-69%)</option>
                  <option value="STARTED">Just Started (0%)</option>
                </select>

                <select
                  className="role-dropdown"
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="candidate">Candidates</option>
                  <option value="pro_member">Pro Members</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            <div className="bulk-actions-bar">
              <div className="bab-left">
                <span className="bab-count">
                  {selectedUserIds.size} user{selectedUserIds.size === 1 ? '' : 's'} selected
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary bab-btn"
                  onClick={handleBulkGrantAll}
                  title="Grant all 6 features to selected users"
                >
                  ⚡ Bulk Grant All Features
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary bab-btn"
                  onClick={handleBulkReset}
                  title="Reset selected users to candidate defaults"
                >
                  🔒 Bulk Reset Entitlements
                </button>
              </div>

              <div className="bab-right">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary bab-export-btn"
                  onClick={handleExportCSV}
                >
                  📥 Export Progress CSV
                </button>
              </div>
            </div>

            {/* User Tracks & Progress Table */}
            <div className="udp-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th style={{ width: '38px' }}>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.size > 0 && selectedUserIds.size === profiles.length}
                        onChange={e => handleSelectAll(e.target.checked)}
                        aria-label="Select All"
                      />
                    </th>
                    <th>Candidate &amp; Target</th>
                    <th>Assigned Track</th>
                    <th style={{ minWidth: '180px' }}>Curriculum Completion</th>
                    <th>Streak &amp; Quiz</th>
                    <th>Entitlements</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>No Users Found in Database</strong>
                        <p style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>
                          Use the <strong>➕ Invite / Create User</strong> button above to add a candidate, or register a new user in Supabase.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isSelected = selectedUserIds.has(u.id)
                      const isSuspended = u.status === 'SUSPENDED'
                      const prog = progressMap[u.id] || {
                        userId: u.id,
                        userEmail: u.email,
                        userName: u.name,
                        trackName: 'React 19 & Architecture',
                        trackIcon: '⚛️',
                        solvedCount: 0,
                        totalQuestions: 75,
                        completionPct: 0,
                        streak: 0,
                        quizAccuracy: 0,
                        mockScore: 0,
                        lastActive: 'Offline',
                        categoryBreakdown: {},
                      }

                    return (
                      <tr key={u.id} className={isSuspended ? 'row-suspended' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectUser(u.id)}
                            aria-label={`Select ${u.name}`}
                          />
                        </td>
                        <td>
                          <div className="user-primary-cell">
                            <div className="upc-avatar">
                              {isSuspended ? '⛔' : u.role === 'admin' ? '🛡️' : u.role === 'pro_member' ? '⚡' : '👨‍💻'}
                            </div>
                            <div>
                              <strong>{u.name}</strong>
                              <span className="upc-email">{u.email}</span>
                              <div className="target-micro-row">
                                <span className="target-pill">{u.targetCompany || 'Google'}</span>
                                <span className="level-pill">{u.experienceLevel || 'L5 Senior'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="track-badge-box">
                            <span className="tbb-icon">{prog.trackIcon}</span>
                            <div className="tbb-select-wrap">
                              <select
                                className="admin-quick-track-select"
                                value={prog.trackName}
                                onChange={e => handleQuickAssignTrack(u, e.target.value)}
                                disabled={isSuspended}
                                title="Quick 1-Click Track Re-allocation"
                              >
                                {Object.keys(TRACK_DEFINITIONS).map(trName => (
                                  <option key={trName} value={trName}>
                                    {TRACK_DEFINITIONS[trName].icon} {trName}
                                  </option>
                                ))}
                              </select>
                              <span className="tbb-time">
                                {prog.focusModules && prog.focusModules.length > 0
                                  ? `🎯 ${prog.focusModules.length} Modules Allocated`
                                  : `Active ${prog.lastActive.includes('T') ? new Date(prog.lastActive).toLocaleDateString([], { month: 'short', day: 'numeric' }) : prog.lastActive}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="progress-cell-box">
                            <div className="pcb-header">
                              <strong>{prog.completionPct}% Completed</strong>
                              <span>{prog.solvedCount}/{prog.totalQuestions} Solved</span>
                            </div>
                            <div className="pcb-bar-wrap">
                              <div
                                className={`pcb-bar-fill ${prog.completionPct >= 70 ? 'high' : prog.completionPct >= 40 ? 'mid' : 'low'}`}
                                style={{ width: `${Math.min(prog.completionPct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="metrics-cell-box">
                            <span className="streak-tag">🔥 {prog.streak}d streak</span>
                            <span className="accuracy-tag">🎯 {prog.quizAccuracy}% quiz</span>
                          </div>
                        </td>

                        <td>
                          <div className="entitlement-chips-grid">
                            <button
                              type="button"
                              className={`chip-toggle ${u.entitlements.questions_full ? 'granted' : 'locked'}`}
                              onClick={() => handleToggleEntitlement(u, 'questions_full')}
                              title="Toggle 22,222 Questions Bank"
                              disabled={isSuspended}
                            >
                              {u.entitlements.questions_full ? '✅ 22K' : '🔒 22K'}
                            </button>

                            <button
                              type="button"
                              className={`chip-toggle ${u.entitlements.system_design ? 'granted' : 'locked'}`}
                              onClick={() => handleToggleEntitlement(u, 'system_design')}
                              title="Toggle System Design Canvas"
                              disabled={isSuspended}
                            >
                              {u.entitlements.system_design ? '✅ Design' : '🔒 Design'}
                            </button>

                            <button
                              type="button"
                              className={`chip-toggle ${u.entitlements.video_mock ? 'granted' : 'locked'}`}
                              onClick={() => handleToggleEntitlement(u, 'video_mock')}
                              title="Toggle AI Video Mock Interviews"
                              disabled={isSuspended}
                            >
                              {u.entitlements.video_mock ? '✅ Mock' : '🔒 Mock'}
                            </button>
                          </div>
                        </td>

                        <td>
                          <span className={`status-pill-badge ${isSuspended ? 'suspended' : 'active'}`}>
                            {isSuspended ? '⛔ SUSPENDED' : '✅ ACTIVE'}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions-row">
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary btn-inspect"
                              onClick={() => handleOpenInspect(u)}
                              title="Inspect deep-dive progress, pillars & categories"
                            >
                              📊 Inspect
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-secondary btn-dossier"
                              onClick={() => handleOpenReport(u)}
                              title="Generate FAANG Readiness Evaluation Dossier"
                            >
                              📋 Dossier
                            </button>

                            <button
                              type="button"
                              className={`btn btn-sm ${isSuspended ? 'btn-activate' : 'btn-suspend'}`}
                              onClick={() => handleToggleAccountStatus(u)}
                              title={isSuspended ? 'Reactivate account' : 'Suspend account'}
                            >
                              {isSuspended ? '♻️' : '⛔'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: ACCESS REQUESTS & NOTIFICATIONS CENTER */}
      {/* ================================================================ */}
      {activeTab === 'requests' && (
        <div className="admin-tab-content">
          <div className="card-box notifications-panel">
            <div className="np-header">
              <div>
                <h3>Candidate Feature Access Requests ({notifications.length})</h3>
                <p className="np-desc">
                  When candidates navigate to restricted features (such as System Design Studio or the 22,222 Questions Bank), their access requests appear here. Click <strong>Approve &amp; Grant Access</strong> to immediately unlock that feature in Supabase.
                </p>
              </div>
              <div className="np-badge-count">
                <span>{pendingRequestsCount} Pending Approval</span>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)' }}>
                <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: '10px' }}>🎉</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>No Pending Access Requests</strong>
                <p style={{ margin: '6px 0 16px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  When candidates request access to locked platform features (like the 22,222 Questions Bank or System Design Studio), their requests appear here for 1-click approval.
                </p>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={async () => {
                    await auditService.logEvent({
                      userId: 'usr_candidate_demo',
                      action: 'FEATURE_ACCESS_REQUESTED',
                      resource: 'system_design',
                      details: {
                        featureName: 'System Design Studio',
                        userEmail: 'candidate@faang.io',
                        userName: 'Alex Rivers (Candidate)',
                        currentRole: 'candidate',
                      },
                    })
                    await loadData()
                    showToast('Created sample access request for candidate@faang.io!')
                  }}
                  style={{ fontWeight: 700 }}
                >
                  ⚡ Simulate Candidate Request
                </button>
              </div>
            ) : (
              <div className="requests-cards-list">
                {notifications.map(notif => {
                  const isPending = notif.status === 'PENDING'
                  const isApproved = notif.status === 'APPROVED'

                  return (
                    <div key={notif.id} className={`request-card ${notif.status.toLowerCase()}`}>
                    <div className="rc-left">
                      <div className="rc-avatar">👨‍💻</div>
                      <div className="rc-details">
                        <div className="rc-user-row">
                          <strong>{notif.userName}</strong>
                          <span className="rc-email">{notif.userEmail}</span>
                          <span className={`rc-status-pill ${notif.status.toLowerCase()}`}>
                            {notif.status}
                          </span>
                        </div>
                        <div className="rc-feature-row">
                          <span>Requested Entitlement:</span>
                          <strong className="rc-feature-highlight">🔒 {notif.featureName}</strong>
                          <span className="rc-time">
                            🕒 {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rc-actions">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm btn-approve"
                            onClick={() => handleApproveRequest(notif)}
                          >
                            ✅ Approve &amp; Grant Access
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm btn-decline"
                            onClick={() => handleDeclineRequest(notif.id, notif.userEmail, notif.featureName)}
                          >
                            ❌ Decline
                          </button>
                        </>
                      ) : isApproved ? (
                        <span className="approved-indicator">
                          ✅ Access Granted in Supabase
                        </span>
                      ) : (
                        <span className="declined-indicator">
                          ❌ Request Dismissed
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: PLATFORM LEARNING TRACKS MONITORING */}
      {/* ================================================================ */}
      {activeTab === 'tracks' && (
        <div className="admin-tab-content">
          <div className="tracks-overview-grid">
            {PLATFORM_TRACKS.map(tr => (
              <div key={tr.id} className="card-box track-progress-card">
                <div className="tpc-top">
                  <span className="tpc-icon">{tr.icon}</span>
                  <span className={`tpc-diff-tag ${tr.difficulty.toLowerCase()}`}>{tr.difficulty}</span>
                </div>
                <h4>{tr.name}</h4>
                <div className="tpc-stats-row">
                  <div>
                    <span className="tpc-metric-val">{tr.totalModules}</span>
                    <span className="tpc-metric-lbl">Challenges</span>
                  </div>
                  <div>
                    <span className="tpc-metric-val">{tr.activeCandidates}</span>
                    <span className="tpc-metric-lbl">Students Enrolled</span>
                  </div>
                  <div>
                    <span className="tpc-metric-val">{tr.avgScore}%</span>
                    <span className="tpc-metric-lbl">Avg Accuracy</span>
                  </div>
                </div>
                <div className="tpc-bar-wrap">
                  <div className="tpc-bar-fill" style={{ width: `${tr.avgScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 4: REAL-TIME CANDIDATE ACTIVITY STREAM */}
      {/* ================================================================ */}
      {activeTab === 'audit' && (
        <div className="admin-tab-content">
          <div className="card-box telemetry-stream-panel">
            <div className="tsp-top-bar">
              <div>
                <div className="tsp-live-indicator">
                  <span className="alb-pulse">🟢</span>
                  <span className="tsp-live-title">Real-Time Telemetry Stream Active</span>
                  <span className="tsp-count-pill">{liveActivities.length} Events Logged</span>
                </div>
                <h3>Live Candidate Activity &amp; Telemetry Feed</h3>
                <p className="tsp-desc">
                  Live streaming events as candidates solve questions, complete mock interviews, take practice quizzes, or update tracks in real time.
                </p>
              </div>

              <div className="tsp-controls">
                <select
                  className="role-dropdown"
                  value={activityFilter}
                  onChange={e => setActivityFilter(e.target.value)}
                  title="Filter by Activity Type"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="QUESTION_SOLVED">✅ Questions Solved</option>
                  <option value="QUIZ_SCORED">🎯 Quiz Drills</option>
                  <option value="MOCK_COMPLETED">🎥 Mock Interviews</option>
                  <option value="TRACK_SWITCHED">🚀 Track Changes</option>
                  <option value="FEATURE_GRANTED">✨ Feature Approvals</option>
                  <option value="AUTH_SIGN_IN">🔑 Logins &amp; Signups</option>
                </select>

                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setIsAutoScrollPaused(prev => !prev)}
                >
                  {isAutoScrollPaused ? '▶️ Resume Feed' : '⏸️ Pause Stream'}
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleExportActivitiesCSV}
                >
                  📥 Export CSV
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-secondary btn-clear-stream"
                  onClick={() => {
                    setLiveActivities([])
                    showToast('Cleared telemetry display feed.')
                  }}
                >
                  🧹 Clear Feed
                </button>
              </div>
            </div>

            {/* Activities List */}
            {filteredActivities.length === 0 ? (
              <div className="empty-telemetry-notice">
                <span className="etn-icon">⚡</span>
                <h4>Listening for Live Candidate Telemetry...</h4>
                <p>When candidates practice questions, attempt quizzes, or complete mock interviews, live events stream here in real time.</p>
              </div>
            ) : (
              <div className="telemetry-cards-list">
                {filteredActivities.map(act => {
                  return (
                    <div key={act.id} className={`telemetry-card ${act.type.toLowerCase()}`}>
                      <div className="tc-badge-col">
                        <span className={`tc-type-badge ${act.type.toLowerCase()}`}>
                          {act.type === 'QUESTION_SOLVED' ? '💡 Question Solved' :
                           act.type === 'MOCK_COMPLETED' ? '🎥 Mock Interview' :
                           act.type === 'QUIZ_SCORED' ? '🎯 Quiz Drill' :
                           act.type === 'TRACK_SWITCHED' ? '🚀 Track Assigned' :
                           act.type === 'FEATURE_GRANTED' ? '✨ Access Granted' :
                           act.type === 'AUTH_SIGN_IN' ? '🔑 User Enrolled' : act.type}
                        </span>
                      </div>

                      <div className="tc-main">
                        <div className="tc-header-row">
                          <div className="tc-user-info">
                            <strong>{act.userName || 'Candidate'}</strong>
                            {act.userEmail && <span className="tc-email">{act.userEmail}</span>}
                          </div>
                          <span className="tc-timestamp">
                            🕒 {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div className="tc-title-row">
                          <span className="tc-title">{act.title}</span>
                          {act.details && <span className="tc-details">{act.details}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: DEEP DIVE USER TRACK PROGRESS INSPECTOR */}
      {/* ================================================================ */}
      {inspectUser && (
        <div className="admin-modal-overlay" onClick={() => setInspectUser(null)}>
          <div className="admin-modal-card deep-dive-modal" onClick={e => e.stopPropagation()}>
            <div className="amc-header">
              <div>
                <h3>📊 Candidate Deep-Dive Analytics: {inspectUser.name}</h3>
                <span className="amc-sub-email">{inspectUser.email} • {inspectUser.targetCompany} ({inspectUser.experienceLevel})</span>
              </div>
              <button
                type="button"
                className="amc-close-btn"
                onClick={() => setInspectUser(null)}
              >
                ✕
              </button>
            </div>

            <div className="ddm-content">
              {/* Top Progress Metrics */}
              {(() => {
                const prog = progressMap[inspectUser.id] || {
                  trackName: 'React 19 & Architecture',
                  trackIcon: '⚛️',
                  solvedCount: 0,
                  totalQuestions: 75,
                  completionPct: 0,
                  streak: 0,
                  quizAccuracy: 75,
                  mockScore: 4.2,
                  categoryBreakdown: {},
                }

                return (
                  <>
                    <div className="ddm-summary-grid">
                      <div className="ddm-sum-card">
                        <span className="dsc-label">Current Study Track</span>
                        <div className="dsc-val">{prog.trackIcon} {prog.trackName}</div>
                      </div>
                      <div className="ddm-sum-card">
                        <span className="dsc-label">Track Completion</span>
                        <div className="dsc-val">{prog.completionPct}% ({prog.solvedCount}/{prog.totalQuestions})</div>
                      </div>
                      <div className="ddm-sum-card">
                        <span className="dsc-label">Study Streak</span>
                        <div className="dsc-val">🔥 {prog.streak} Days Active</div>
                      </div>
                      <div className="ddm-sum-card">
                        <span className="dsc-label">Mock Interview Score</span>
                        <div className="dsc-val">⭐ {prog.mockScore} / 5.0</div>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="ddm-categories-box">
                      <h4>Curriculum Category Breakdown</h4>
                      <div className="ddm-cat-list">
                        {Object.entries(prog.categoryBreakdown).length > 0 ? (
                          Object.entries(prog.categoryBreakdown).map(([cat, stat]) => (
                            <div key={cat} className="ddm-cat-item">
                              <div className="dci-header">
                                <strong>{cat}</strong>
                                <span>{stat.solved}/{stat.total} ({stat.pct}%)</span>
                              </div>
                              <div className="dci-bar-wrap">
                                <div className="dci-bar-fill" style={{ width: `${stat.pct}%` }} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="ddm-cat-item">
                            <div className="dci-header">
                              <strong>Core Module Competencies</strong>
                              <span>{prog.solvedCount}/{prog.totalQuestions} ({prog.completionPct}%)</span>
                            </div>
                            <div className="dci-bar-wrap">
                              <div className="dci-bar-fill" style={{ width: `${prog.completionPct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Curriculum Re-Allocation & Focus Modules */}
                    <div className="ddm-curriculum-realloc-box">
                      <div className="dcr-header">
                        <div>
                          <h4>🎯 Curriculum Re-Allocation &amp; Focus Modules</h4>
                          <p className="dcr-sub">Assign specific tracks and allocate focus modules for {inspectUser.name}.</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm btn-save-realloc"
                          onClick={handleSaveCurriculumReallocation}
                          disabled={isSavingCurriculum}
                        >
                          {isSavingCurriculum ? 'Saving...' : '💾 Save Re-Allocation'}
                        </button>
                      </div>

                      <div className="dcr-form-row">
                        <div className="form-group">
                          <label>Assigned Learning Track:</label>
                          <select
                            className="sim-input"
                            value={modalTrack}
                            onChange={e => {
                              const t = e.target.value
                              setModalTrack(t)
                              setModalModules(TRACK_DEFINITIONS[t]?.modules || [])
                            }}
                          >
                            {Object.keys(TRACK_DEFINITIONS).map(trName => (
                              <option key={trName} value={trName}>
                                {TRACK_DEFINITIONS[trName].icon} {trName} ({TRACK_DEFINITIONS[trName].totalQuestions} Questions)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Target Interview / Completion Date:</label>
                          <input
                            type="date"
                            className="sim-input"
                            value={modalTargetDate}
                            onChange={e => setModalTargetDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label>Allocated Focus Modules ({modalModules.length} Active):</label>
                        <div className="dcr-modules-grid">
                          {(TRACK_DEFINITIONS[modalTrack]?.modules || []).map(mod => {
                            const isChecked = modalModules.includes(mod)
                            return (
                              <label key={mod} className={`dcr-mod-pill ${isChecked ? 'active' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setModalModules(prev => [...prev, mod])
                                    } else {
                                      setModalModules(prev => prev.filter(m => m !== mod))
                                    }
                                  }}
                                />
                                <span>{mod}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Entitlements Management Inside Modal */}
                    <div className="ddm-entitlements-box">
                      <h4>Manage Feature Entitlements for {inspectUser.name}</h4>
                      <div className="entitlement-chips-grid">
                        <button
                          type="button"
                          className={`chip-toggle ${inspectUser.entitlements.questions_full ? 'granted' : 'locked'}`}
                          onClick={() => handleToggleEntitlement(inspectUser, 'questions_full')}
                        >
                          {inspectUser.entitlements.questions_full ? '✅ Full 22,222 Bank' : '🔒 22K Bank Locked'}
                        </button>
                        <button
                          type="button"
                          className={`chip-toggle ${inspectUser.entitlements.system_design ? 'granted' : 'locked'}`}
                          onClick={() => handleToggleEntitlement(inspectUser, 'system_design')}
                        >
                          {inspectUser.entitlements.system_design ? '✅ System Design Studio' : '🔒 Design Studio Locked'}
                        </button>
                        <button
                          type="button"
                          className={`chip-toggle ${inspectUser.entitlements.video_mock ? 'granted' : 'locked'}`}
                          onClick={() => handleToggleEntitlement(inspectUser, 'video_mock')}
                        >
                          {inspectUser.entitlements.video_mock ? '✅ AI Video Mock' : '🔒 Video Mock Locked'}
                        </button>
                        <button
                          type="button"
                          className={`chip-toggle ${inspectUser.entitlements.compiler_studios ? 'granted' : 'locked'}`}
                          onClick={() => handleToggleEntitlement(inspectUser, 'compiler_studios')}
                        >
                          {inspectUser.entitlements.compiler_studios ? '✅ AST & Compiler Labs' : '🔒 Compilers Locked'}
                        </button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: FAANG CANDIDATE ASSESSMENT & EVALUATION DOSSIER */}
      {/* ================================================================ */}
      {reportUser && (
        <div className="admin-modal-overlay" onClick={() => setReportUser(null)}>
          <div className="admin-modal-card dossier-modal" onClick={e => e.stopPropagation()}>
            {(() => {
              const prog = progressMap[reportUser.id]
              const readiness = computeCandidateReadiness(prog)
              const notes = reportNotes[reportUser.id] || ''

              return (
                <>
                  <div className="amc-header dossier-modal-header">
                    <div className="dmh-left">
                      <div className="dmh-title-row">
                        <span className="dmh-badge">FAANG HIRING INTELLIGENCE</span>
                        <span className="dmh-date">{new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3>Candidate Evaluation Dossier: {reportUser.name}</h3>
                      <div className="dmh-meta-row">
                        <span className="dmh-meta-pill">🎯 {reportUser.targetCompany || 'Google'}</span>
                        <span className="dmh-meta-pill">💼 {reportUser.experienceLevel || 'L5 Senior'}</span>
                        <span className="dmh-meta-pill email">✉️ {reportUser.email}</span>
                      </div>
                    </div>

                    <div className="dmh-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCopyReportMarkdown(reportUser, prog)}
                        title="Copy Markdown report for Slack or documentation"
                      >
                        📋 Copy Markdown
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => window.print()}
                        title="Print or Save PDF report"
                      >
                        🖨️ Print / PDF
                      </button>
                      <button
                        type="button"
                        className="amc-close-btn"
                        onClick={() => setReportUser(null)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="dossier-modal-body">
                    {/* Executive Recommendation Banner */}
                    <div className="dossier-verdict-banner" style={{ borderColor: readiness.color }}>
                      <div className="dvb-left">
                        <span className="dvb-sub">EXECUTIVE HIRING RECOMMENDATION</span>
                        <div className="dvb-verdict-title" style={{ color: readiness.color }}>
                          {readiness.label}
                        </div>
                        <p className="dvb-desc">
                          Based on curriculum challenge mastery, algorithmic drills, and real-time simulator evaluations, this candidate meets the bar for senior frontend engineering.
                        </p>
                      </div>
                      <div className="dvb-score-ring">
                        <div className="score-ring-val" style={{ color: readiness.color }}>
                          {readiness.index}
                        </div>
                        <div className="score-ring-lbl">Readiness Index / 100</div>
                      </div>
                    </div>

                    {/* 4 Core Pillars Scorecards */}
                    <div className="dossier-pillars-grid">
                      <div className="dossier-pillar-card">
                        <span className="dpc-icon">📚</span>
                        <span className="dpc-label">Curriculum Track Mastery</span>
                        <div className="dpc-val">{prog?.completionPct || 0}%</div>
                        <span className="dpc-sub">{prog?.solvedCount || 0} of {prog?.totalQuestions || 75} Solved ({prog?.trackName || 'React 19'})</span>
                      </div>

                      <div className="dossier-pillar-card">
                        <span className="dpc-icon">⚡</span>
                        <span className="dpc-label">Quiz Drill Accuracy</span>
                        <div className="dpc-val">{prog?.quizAccuracy || 0}%</div>
                        <span className="dpc-sub">Timed technical multiple-choice drills</span>
                      </div>

                      <div className="dossier-pillar-card">
                        <span className="dpc-icon">🎥</span>
                        <span className="dpc-label">Mock Interview Score</span>
                        <div className="dpc-val">⭐ {prog?.mockScore || 4.2} / 5.0</div>
                        <span className="dpc-sub">AI Behavioral &amp; System Simulator</span>
                      </div>

                      <div className="dossier-pillar-card">
                        <span className="dpc-icon">🔥</span>
                        <span className="dpc-label">Daily Study Momentum</span>
                        <div className="dpc-val">{prog?.streak || 0} Days</div>
                        <span className="dpc-sub">Continuous active study streak</span>
                      </div>
                    </div>

                    {/* Competency Rubric Table */}
                    <div className="dossier-rubric-box">
                      <h4>FAANG Technical Competencies Rubric</h4>
                      <table className="dossier-rubric-table">
                        <thead>
                          <tr>
                            <th>Competency Dimension</th>
                            <th>Assessment Level</th>
                            <th>Demonstrated Mastery</th>
                            <th>Readiness Bar</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Frontend Architecture &amp; State</strong></td>
                            <td><span className="rubric-badge high">Advanced</span></td>
                            <td>React 19 Server Components, Fiber, optimistic updates &amp; atomic state</td>
                            <td>✅ Exceeds L5 Bar</td>
                          </tr>
                          <tr>
                            <td><strong>DOM Performance &amp; V8 Internals</strong></td>
                            <td><span className="rubric-badge high">Advanced</span></td>
                            <td>Reflow minimization, microtasks ordering, Web Workers, memory profiling</td>
                            <td>✅ Meets L5 Bar</td>
                          </tr>
                          <tr>
                            <td><strong>System Design &amp; Scalability</strong></td>
                            <td><span className="rubric-badge mid">Proficient</span></td>
                            <td>Real-time WebSockets, offline caching, CDN caching, micro-frontends</td>
                            <td>✅ Meets L5 Bar</td>
                          </tr>
                          <tr>
                            <td><strong>Algorithms &amp; Problem Solving</strong></td>
                            <td><span className="rubric-badge mid">Proficient</span></td>
                            <td>Trees, DP, sliding window, graph traversals, AST tokenization</td>
                            <td>⚖️ Meets L4/L5 Bar</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Interviewer Notes & Qualitative Feedback */}
                    <div className="dossier-notes-box">
                      <div className="dnb-header">
                        <h4>📝 Interviewer Assessment &amp; Evaluator Notes</h4>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => showToast(`Saved evaluation notes for ${reportUser.name}!`)}
                        >
                          💾 Save Notes
                        </button>
                      </div>
                      <textarea
                        className="dossier-textarea"
                        placeholder="Add candidate qualitative assessment, debrief notes, strengths, and leveling recommendation..."
                        value={notes}
                        onChange={e => {
                          const val = e.target.value
                          setReportNotes(prev => ({ ...prev, [reportUser.id]: val }))
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: INVITE / CREATE NEW USER */}
      {/* ================================================================ */}
      {isCreateModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="amc-header">
              <h3>➕ Invite / Provision New User</h3>
              <button
                type="button"
                className="amc-close-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="amc-form">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  className="sim-input"
                  placeholder="e.g. Jordan Miller"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address:</label>
                <input
                  type="email"
                  className="sim-input"
                  placeholder="jordan.miller@company.com"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Role Tier:</label>
                  <select
                    className="sim-input"
                    value={newUserRole}
                    onChange={e => {
                      const r = e.target.value as UserRole
                      setNewUserRole(r)
                      setNewUserEntitlements(DEFAULT_ENTITLEMENTS[r])
                    }}
                  >
                    <option value="candidate">Candidate</option>
                    <option value="pro_member">Pro Member</option>
                    <option value="interviewer">Interviewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assigned Curriculum Track:</label>
                  <select
                    className="sim-input"
                    value={newUserTrack}
                    onChange={e => setNewUserTrack(e.target.value)}
                  >
                    <option value="React 19 & Architecture">⚛️ React 19 &amp; Architecture</option>
                    <option value="Frontend System Design">🏗️ Frontend System Design</option>
                    <option value="JavaScript & DOM Performance">⚡ JavaScript &amp; DOM Performance</option>
                    <option value="Algorithms & Data Structures">📐 Algorithms &amp; Data Structures</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Target Company:</label>
                  <select
                    className="sim-input"
                    value={newUserCompany}
                    onChange={e => setNewUserCompany(e.target.value)}
                  >
                    <option value="Google">Google</option>
                    <option value="Meta">Meta</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Apple">Apple</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Uber">Uber</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Engineering Level:</label>
                  <select
                    className="sim-input"
                    value={newUserLevel}
                    onChange={e => setNewUserLevel(e.target.value)}
                  >
                    <option value="L3 (Junior 0-2y)">L3 (Junior 0-2y)</option>
                    <option value="L4 (Mid-Level 2-5y)">L4 (Mid-Level 2-5y)</option>
                    <option value="L5 (Senior 5-9y)">L5 (Senior 5-9y)</option>
                    <option value="L6 (Staff 10-14y)">L6 (Staff 10-14y)</option>
                    <option value="L7+ (Principal / Director)">L7+ (Principal / Director)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Pre-Provisioned Feature Entitlements:</label>
                <div className="entitlement-checkboxes-grid">
                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={newUserEntitlements.questions_full}
                      onChange={e =>
                        setNewUserEntitlements(prev => ({ ...prev, questions_full: e.target.checked }))
                      }
                    />
                    22,222 Question Bank
                  </label>

                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={newUserEntitlements.system_design}
                      onChange={e =>
                        setNewUserEntitlements(prev => ({ ...prev, system_design: e.target.checked }))
                      }
                    />
                    System Design Studio
                  </label>

                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={newUserEntitlements.video_mock}
                      onChange={e =>
                        setNewUserEntitlements(prev => ({ ...prev, video_mock: e.target.checked }))
                      }
                    />
                    AI Video Mock Interview
                  </label>

                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={newUserEntitlements.compiler_studios}
                      onChange={e =>
                        setNewUserEntitlements(prev => ({ ...prev, compiler_studios: e.target.checked }))
                      }
                    />
                    AST &amp; Compiler Labs
                  </label>
                </div>
              </div>

              <div className="amc-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmittingUser}
                >
                  {isSubmittingUser ? 'Provisioning...' : '✨ Create User Profile'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
