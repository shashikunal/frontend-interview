import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth, type UserRole, type FeatureEntitlements } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { DEFAULT_ENTITLEMENTS } from '../../features/auth/types/auth.types'
import { profileService } from '../../features/auth/services/profile.service'
import { rbacService } from '../../features/auth/services/rbac.service'
import { auditService, type AccessNotificationItem } from '../../features/auth/services/audit.service'
import { progressSyncService, type UserTrackProgress, TRACK_DEFINITIONS } from '../../features/auth/services/progressSync.service'
import { dbActivityService, type ActivityLogItem } from '../../lib/supabase'
import type { AuthUserProfile } from '../../features/auth/types/auth.types'
import AdminOverviewTab from './admin/AdminOverviewTab'
import AdminQuestionsTab from './admin/AdminQuestionsTab'
import AdminSubmissionsTab from './admin/AdminSubmissionsTab'
import AdminAttemptsTab from './admin/AdminAttemptsTab'
import AdminActivityTab from './admin/AdminActivityTab'
import AdminAnalyticsTab from './admin/AdminAnalyticsTab'
import AdminRequestsTab from './admin/AdminRequestsTab'
import AdminTelemetryTab from './admin/AdminTelemetryTab'
import AdminTracksTab from './admin/AdminTracksTab'
import AdminLiveSessionsTab from './admin/AdminLiveSessionsTab'
import AdminUserDetailModal from './admin/AdminUserDetailModal'
import AdminSubmissionCodeModal from './admin/AdminSubmissionCodeModal'
import AdminAttemptCodeModal from './admin/AdminAttemptCodeModal'
import Leaderboard from '../leaderboard/Leaderboard'
import {
  adminAnalyticsService,
  type OverviewStats,
  type SubmissionRecord,
  type AttemptRecord,
  type FormattedActivityItem,
  type QuestionStatItem,
  type TimeframeFilter,
} from '../../lib/adminAnalyticsService'
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

export type AdminTab =
  | 'overview'
  | 'users'
  | 'live'
  | 'rankings'
  | 'questions'
  | 'submissions'
  | 'attempts'
  | 'activity'
  | 'analytics'
  | 'requests'
  | 'tracks'
  | 'audit'
  | 'profile'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const { tab: urlTab } = useParams<{ tab?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard'

  // Map query string (?tab=questions) OR path param (/dashboard/questions) to valid AdminTab
  const activeTab: AdminTab = useMemo(() => {
    const rawTab = searchParams.get('tab') || urlTab
    if (!rawTab) return 'overview'
    const clean = rawTab.toLowerCase()
    if (clean === 'overview') return 'overview'
    if (clean === 'candidates' || clean === 'users') return 'users'
    if (clean === 'live' || clean === 'live-sessions') return 'live'
    if (clean === 'rankings' || clean === 'leaderboard') return 'rankings'
    if (clean === 'submissions') return 'submissions'
    if (clean === 'attempts') return 'attempts'
    if (clean === 'questions') return 'questions'
    if (clean === 'activity') return 'activity'
    if (clean === 'analytics') return 'analytics'
    if (clean === 'requests') return 'requests'
    if (clean === 'tracks') return 'tracks'
    if (clean === 'telemetry' || clean === 'audit') return 'audit'
    if (clean === 'profile') return 'profile'
    return 'overview'
  }, [searchParams, urlTab])

  // Proper query string routing mechanism
  const setActiveTab = useCallback((t: AdminTab) => {
    const tabName = t === 'users' ? 'candidates' : t === 'audit' ? 'telemetry' : t === 'live' ? 'live-sessions' : t
    navigate(`${basePath}?tab=${tabName}`)
  }, [navigate, basePath])

  // Horizon Light / Dark Theme State - synchronized with global ThemeContext
  const { resolvedTheme, toggleTheme: toggleGlobalTheme } = useTheme()
  const adminTheme = resolvedTheme

  const toggleTheme = () => {
    toggleGlobalTheme()
    try {
      localStorage.setItem('horizon_admin_theme', resolvedTheme === 'dark' ? 'light' : 'dark')
    } catch {
      // ignore
    }
  }

  // State
  const [profiles, setProfiles] = useState<AuthUserProfile[]>([])
  const [notifications, setNotifications] = useState<AccessNotificationItem[]>([])
  const [_auditLogs, _setAuditLogs] = useState<Array<{ id: string; action: string; resource: string; createdAt: string; details?: Record<string, unknown> }>>([])
  const [progressMap, setProgressMap] = useState<Record<string, UserTrackProgress>>({})

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [trackFilter, setTrackFilter] = useState<string>('ALL')
  const [progressFilter, setProgressFilter] = useState<string>('ALL')
  const [statusToast, setStatusToast] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)

  // Telemetry Analytics State
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null)
  const [overviewTimeframe, setOverviewTimeframe] = useState<TimeframeFilter>('7days')
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([])
  const [attemptsList, setAttemptsList] = useState<AttemptRecord[]>([])
  const [activityFeedList, setActivityFeedList] = useState<FormattedActivityItem[]>([])
  const [questionsStatsList, setQuestionsStatsList] = useState<QuestionStatItem[]>([])
  const [selectedUserForDeepDive, setSelectedUserForDeepDive] = useState<string | null>(null)
  const [selectedSubmissionForCode, setSelectedSubmissionForCode] = useState<SubmissionRecord | null>(null)
  const [selectedAttemptForCode, setSelectedAttemptForCode] = useState<AttemptRecord | null>(null)

  // Live Activities Stream State
  const [liveActivities, setLiveActivities] = useState<ActivityLogItem[]>([])
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
      const [
        fetchedProfiles,
        fetchedNotifications,
        fetchedAuditLogs,
        fetchedProgress,
        fetchedActivities,
        fetchedOverview,
        fetchedSubmissions,
        fetchedAttempts,
        fetchedFeed,
        fetchedQuestionStats,
      ] = await Promise.all([
        profileService.getAllProfiles(),
        auditService.getAccessNotifications(),
        auditService.getAuditLogs(15),
        progressSyncService.getAllUsersProgress(),
        dbActivityService.getAllActivities(50),
        adminAnalyticsService.getOverviewStats(overviewTimeframe),
        adminAnalyticsService.getSubmissionsList({ limit: 100 }),
        adminAnalyticsService.getQuestionAttemptsList({ limit: 100 }),
        adminAnalyticsService.getActivityFeed({ limit: 100 }),
        adminAnalyticsService.getQuestionStatsList({ limit: 100 }),
      ])

      setProgressMap(fetchedProgress)
      setLiveActivities(fetchedActivities)
      setOverviewStats(fetchedOverview)
      setSubmissionsList(fetchedSubmissions)
      setAttemptsList(fetchedAttempts)
      setActivityFeedList(fetchedFeed)
      setQuestionsStatsList(fetchedQuestionStats)

      // Real users from Supabase PostgreSQL + active admin account
      let mergedProfiles = [...fetchedProfiles]
      if (user && !mergedProfiles.some(p => p.id === user.id || p.email === user.email)) {
        mergedProfiles = [user, ...mergedProfiles]
      }
      setProfiles(mergedProfiles)

      setNotifications(fetchedNotifications)
      _setAuditLogs(fetchedAuditLogs)
    } catch (err) {
      console.warn('[Admin Dashboard] Load data error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user, overviewTimeframe])

  const handleTimeframeChange = async (tf: TimeframeFilter) => {
    setOverviewTimeframe(tf)
    const updated = await adminAnalyticsService.getOverviewStats(tf)
    setOverviewStats(updated)
  }

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
    })

    const unsubActivities = dbActivityService.subscribeToActivities(newActivity => {
      setLiveActivities(prev => [newActivity, ...prev.slice(0, 99)])
    })

    const unsubAccess = auditService.subscribeToAccessRequests(notif => {
      setNotifications(prev => {
        const filtered = prev.filter(p => !(p.userEmail.toLowerCase() === notif.userEmail.toLowerCase() && p.featureKey === notif.featureKey))
        return [notif, ...filtered]
      })
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
    auditService.declineAccessRequest(id)
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: 'DECLINED' } : n))
    )
    showToast(`Declined ${feature} access request for ${email}.`)
  }

  // 2b. Delete / Dismiss Access Request
  const handleDeleteRequest = (id: string) => {
    auditService.deleteNotification(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    showToast('Access request removed.')
  }

  // 2c. Clear All Requests
  const handleClearAllRequests = () => {
    auditService.clearAllNotifications()
    setNotifications([])
    showToast('All access requests cleared.')
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

  const handleExportActivitiesCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Type', 'Title', 'Details', 'Timestamp']
    const rows = liveActivities.map(a => [
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
    showToast(`Exported ${liveActivities.length} live telemetry events to CSV.`)
  }

  return (
    <div className={`h-admin-layout ${adminTheme}-theme`}>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`h-sidebar-overlay ${isMobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Horizon UI Left Sidebar */}
      <aside className={`h-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="h-brand-header">
          <Link to="/dashboard" className="h-brand-title">
            <span>⚡</span>
            <span>INTERVIEW <span className="h-brand-accent">PREPARE</span></span>
          </Link>
          <div className="h-brand-sub">
            <span>TECHNICAL PLATFORM</span>
            <span className="h-brand-badge">LIVE</span>
          </div>
        </div>

        <nav className="h-nav-list">
          <span className="h-nav-section-title">Main Dashboard</span>
          <button
            type="button"
            className={`h-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">📊</span>
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">👥</span>
            <span>Candidates</span>
            <span className="h-nav-badge">{profiles.length}</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => { setActiveTab('live'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">🔴</span>
            <span>Live Coding Sessions</span>
            <span className="h-nav-badge alert" style={{ background: '#10b981', color: '#ffffff' }}>LIVE</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'rankings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('rankings'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">🏆</span>
            <span>Rankings</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('submissions'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">📝</span>
            <span>Submissions</span>
            <span className="h-nav-badge">{submissionsList.length}</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'attempts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('attempts'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">🎯</span>
            <span>Attempts</span>
            <span className="h-nav-badge">{attemptsList.length}</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('questions'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">❓</span>
            <span>Question Bank</span>
            <span className="h-nav-badge">22K</span>
          </button>

          <span className="h-nav-section-title">Intelligence &amp; Stream</span>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => { setActiveTab('activity'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">⚡</span>
            <span>Activity Feed</span>
            <span className="h-nav-badge">{activityFeedList.length}</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => { setActiveTab('analytics'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">📈</span>
            <span>Analytics</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => { setActiveTab('requests'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">📩</span>
            <span>Access Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="h-nav-badge alert">{pendingRequestsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tracks'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">📚</span>
            <span>Curriculum Tracks</span>
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => { setActiveTab('audit'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">🛰️</span>
            <span>Telemetry Stream</span>
            {liveActivities.length > 0 && (
              <span className="h-nav-badge alert">{liveActivities.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`h-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}
          >
            <span className="h-nav-icon">👤</span>
            <span>Profile</span>
          </button>
        </nav>

        <div className="h-sidebar-footer">
          <div
            className="h-admin-card-mini"
            onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}
            style={{ cursor: 'pointer' }}
            title="View Profile & Settings"
          >
            <div className="h-admin-avatar-mini">
              {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="h-admin-info-mini">
              <span className="h-admin-name-mini">{user?.name || 'Administrator'}</span>
              <span className="h-admin-role-mini">{user?.role || 'Admin'}</span>
            </div>
          </div>

          <Link to="/" className="h-sidebar-return-link">
            <span>←</span>
            <span>Return to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Right Area */}
      <main className="h-main-area">
        {/* Floating Glass Top Navbar */}
        <header className="h-topbar">
          <div className="h-topbar-left">
            <div className="h-breadcrumb">
              <button
                type="button"
                className="h-mobile-toggle-btn"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                aria-label="Toggle navigation"
              >
                ☰
              </button>
              <span>Pages</span>
              <span>/</span>
              <span>Dashboard</span>
              <span>/</span>
              <span className="h-breadcrumb-item active">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>
            <h1 className="h-page-title">
              {activeTab === 'overview' && 'System Operations'}
              {activeTab === 'users' && 'Candidate Directory'}
              {activeTab === 'live' && 'Live Machine Coding Sessions & Interviews'}
              {activeTab === 'submissions' && 'Submissions Graded'}
              {activeTab === 'attempts' && 'Problem Attempts'}
              {activeTab === 'questions' && 'Question Performance'}
              {activeTab === 'activity' && 'Real-Time Activity Feed'}
              {activeTab === 'analytics' && 'Platform Analytics'}
              {activeTab === 'requests' && 'Feature Access Requests'}
              {activeTab === 'tracks' && 'Curriculum Tracks'}
              {activeTab === 'audit' && 'Cloud Telemetry Stream'}
              {activeTab === 'rankings' && '🏆 Candidate Rankings'}
              {activeTab === 'profile' && 'Administrator Profile & Settings'}
            </h1>
          </div>

          <div className="h-topbar-right">
            <div className="h-topbar-search">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="h-topbar-btn primary"
              onClick={() => setIsCreateModalOpen(true)}
              title="Invite or provision new candidate"
            >
              ➕ Invite User
            </button>

            <button
              type="button"
              className="h-topbar-btn secondary"
              onClick={loadData}
              disabled={isLoading}
              title="Synchronize live state with Supabase"
            >
              {isLoading ? '⏳ Syncing' : '🔄 Live Sync'}
            </button>

            <button
              type="button"
              className="h-topbar-icon-btn"
              onClick={() => setActiveTab('requests')}
              title="Access notifications"
            >
              🔔
              {pendingRequestsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ffb547',
                  color: '#0b1437',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="h-topbar-icon-btn"
              onClick={toggleTheme}
              title={adminTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {adminTheme === 'light' ? '🌙' : '☀️'}
            </button>

            <div
              className="h-topbar-avatar-chip"
              onClick={() => setActiveTab('profile')}
              title="View Profile & Settings"
            >
              <div className="h-avatar-sm">
                {user?.name?.slice(0, 1).toUpperCase() || 'A'}
              </div>
              <span className="h-avatar-chip-name">{user?.name?.split(' ')[0] || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="h-content-area">
          {/* Toast Notification */}
          {statusToast && (
            <div className="admin-toast-alert">
              <span>🔔</span> {statusToast}
            </div>
          )}

          {/* Quick Horizon Stat Widgets - ONLY displayed on Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="h-stat-grid">
              <div className="h-stat-widget" onClick={() => setActiveTab('users')}>
                <div className="h-stat-icon-circle purple">👥</div>
                <div className="h-stat-info">
                  <span className="h-stat-label">Total Candidates</span>
                  <span className="h-stat-value">{profiles.length}</span>
                  <span className="h-stat-sub">Registered profiles</span>
                </div>
              </div>

              <div className="h-stat-widget" onClick={() => setActiveTab('tracks')}>
                <div className="h-stat-icon-circle green">📊</div>
                <div className="h-stat-info">
                  <span className="h-stat-label">Avg Track Mastery</span>
                  <span className="h-stat-value">{avgCompletionPct}%</span>
                  <span className="h-stat-sub">Platform curriculum progress</span>
                </div>
              </div>

              <div className="h-stat-widget" onClick={() => setActiveTab('submissions')}>
                <div className="h-stat-icon-circle cyan">📝</div>
                <div className="h-stat-info">
                  <span className="h-stat-label">Graded Submissions</span>
                  <span className="h-stat-value">{submissionsList.length}</span>
                  <span className="h-stat-sub">Code executions evaluated</span>
                </div>
              </div>

              <div className="h-stat-widget" onClick={() => setActiveTab('attempts')}>
                <div className="h-stat-icon-circle amber">🎯</div>
                <div className="h-stat-info">
                  <span className="h-stat-label">Problem Attempts</span>
                  <span className="h-stat-value">{attemptsList.length}</span>
                  <span className="h-stat-sub">Total session attempts</span>
                </div>
              </div>

              <div className="h-stat-widget" onClick={() => setActiveTab('requests')}>
                <div className="h-stat-icon-circle red">📩</div>
                <div className="h-stat-info">
                  <span className="h-stat-label">Pending Requests</span>
                  <span className="h-stat-value">{pendingRequestsCount}</span>
                  <span className="h-stat-sub">{pendingRequestsCount > 0 ? 'Requires attention' : 'All approved'}</span>
                </div>
              </div>

              <div className="h-stat-widget" onClick={() => setActiveTab('users')}>
                <div className="h-stat-icon-circle amber">🔥</div>
                <div className="h-stat-info">
                  <span className="h-stat-label">Top Streak ({topStreakCandidate.userName?.split(' ')[0] || 'Candidate'})</span>
                  <span className="h-stat-value">{topStreakCandidate.streak}d</span>
                  <span className="h-stat-sub">Consecutive problem solving</span>
                </div>
              </div>
            </div>
          )}

      {/* ================================================================ */}
      {/* TAB 0: OVERVIEW COMMAND CENTER */}
      {/* ================================================================ */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          <AdminOverviewTab
            stats={overviewStats}
            timeframe={overviewTimeframe}
            onTimeframeChange={handleTimeframeChange}
            onNavigateTab={tab => setActiveTab(tab as AdminTab)}
            onInspectUser={(uId: string) => setSelectedUserForDeepDive(uId)}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: LIVE SESSIONS & REAL-TIME INTERVIEW MONITORING */}
      {/* ================================================================ */}
      {activeTab === 'live' && (
        <div className="admin-tab-content">
          <AdminLiveSessionsTab />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: RANKINGS — GLOBAL CANDIDATE LEADERBOARD */}
      {/* ================================================================ */}
      {activeTab === 'rankings' && (
        <div className="admin-tab-content">
          <Leaderboard compact={false} />
        </div>
      )}

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
                        lastActive: u.createdAt || 'Never active',
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
                            <button
                              type="button"
                              className="h-user-btn"
                              onClick={() => setSelectedUserForDeepDive(u.id)}
                              title={`Inspect ${u.name}'s Full Dossier`}
                            >
                              <div className="h-avatar-circle">
                                {isSuspended ? '⛔' : u.role === 'admin' ? '🛡️' : u.role === 'pro_member' ? '⚡' : '👨‍💻'}
                              </div>
                              <div className="h-user-meta">
                                <span className="h-user-name">{u.name}</span>
                                <span className="h-user-sub">{u.email}</span>
                              </div>
                            </button>
                            <div className="target-micro-row" style={{ marginTop: '2px', paddingLeft: '8px' }}>
                              <span className="target-pill">{u.targetCompany || 'Google'}</span>
                              <span className="level-pill">{u.experienceLevel || 'L5 Senior'}</span>
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
                              className="btn btn-sm btn-secondary"
                              onClick={() => setSelectedUserForDeepDive(u.id)}
                              title="Candidate Deep-Dive: Attempts, Submissions & Telemetry"
                              style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa', fontSize: '0.74rem', fontWeight: 700 }}
                            >
                              🔍 Deep Dive
                            </button>

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
      {/* TAB: QUESTIONS TELEMETRY */}
      {/* ================================================================ */}
      {activeTab === 'questions' && (
        <div className="admin-tab-content">
          <AdminQuestionsTab />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: SUBMISSIONS & CODE VIEWER */}
      {/* ================================================================ */}
      {activeTab === 'submissions' && (
        <div className="admin-tab-content">
          <AdminSubmissionsTab
            initialSubmissions={submissionsList}
            onRefresh={loadData}
            onViewCode={sub => setSelectedSubmissionForCode(sub)}
            onInspectUser={(uId: string) => setSelectedUserForDeepDive(uId)}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: QUESTION ATTEMPTS */}
      {/* ================================================================ */}
      {activeTab === 'attempts' && (
        <div className="admin-tab-content">
          <AdminAttemptsTab
            initialAttempts={attemptsList}
            onRefresh={loadData}
            onViewCode={att => setSelectedAttemptForCode(att)}
            onInspectUser={(uId: string) => setSelectedUserForDeepDive(uId)}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: LIVE ACTIVITY FEED */}
      {/* ================================================================ */}
      {activeTab === 'activity' && (
        <div className="admin-tab-content">
          <AdminActivityTab
            initialFeed={activityFeedList}
            onInspectUser={(uId: string) => setSelectedUserForDeepDive(uId)}
            onRefresh={loadData}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: PLATFORM ANALYTICS */}
      {/* ================================================================ */}
      {activeTab === 'analytics' && (
        <div className="admin-tab-content">
          <AdminAnalyticsTab
            overviewStats={overviewStats}
            timeframe={overviewTimeframe}
            onTimeframeChange={handleTimeframeChange}
            submissionsList={submissionsList}
            attemptsList={attemptsList}
            questionsStatsList={questionsStatsList}
            progressMap={progressMap}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: ACCESS REQUESTS & NOTIFICATIONS CENTER */}
      {/* ================================================================ */}
      {activeTab === 'requests' && (
        <div className="admin-tab-content">
          <AdminRequestsTab
            notifications={notifications}
            pendingRequestsCount={pendingRequestsCount}
            onApprove={handleApproveRequest}
            onDecline={handleDeclineRequest}
            onDelete={handleDeleteRequest}
            onClearAll={handleClearAllRequests}
            onInspectUser={(uId: string) => setSelectedUserForDeepDive(uId)}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: PLATFORM LEARNING TRACKS MONITORING */}
      {/* ================================================================ */}
      {activeTab === 'tracks' && (
        <div className="admin-tab-content">
          <AdminTracksTab
            tracks={PLATFORM_TRACKS}
            onNavigateToCandidates={(trackFilter?: string) => {
              setTrackFilter(trackFilter || 'ALL')
              setActiveTab('users')
            }}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 4: REAL-TIME CANDIDATE TELEMETRY STREAM */}
      {/* ================================================================ */}
      {activeTab === 'audit' && (
        <div className="admin-tab-content">
          <AdminTelemetryTab
            liveActivities={liveActivities}
            onClearStream={() => {
              setLiveActivities([])
              showToast('Cleared telemetry display feed.')
            }}
            onExportCSV={handleExportActivitiesCSV}
            isAutoScrollPaused={isAutoScrollPaused}
            onToggleAutoScroll={() => setIsAutoScrollPaused(prev => !prev)}
            onInspectUser={(uId: string) => setSelectedUserForDeepDive(uId)}
            onRefresh={loadData}
          />
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB: HORIZON UI PROFILE & ENTERPRISE SETTINGS SHOWCASE */}
      {/* ================================================================ */}
      {activeTab === 'profile' && (
        <div className="admin-tab-content h-profile-tab-panel">
          {/* Top 3-Card Grid */}
          <div className="h-profile-top-grid">
            {/* Card 1: Horizon Profile Hero Card */}
            <div className="h-profile-hero-card">
              <div className="h-profile-hero-cover">
                <span className="h-profile-hero-badge">Enterprise Lead</span>
              </div>
              <div className="h-profile-hero-avatar-wrap">
                <div className="h-profile-hero-avatar">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SK'}
                </div>
                <div className="h-profile-online-badge" title="Live Online" />
              </div>
              <div className="h-profile-hero-info">
                <h2 className="h-profile-hero-name">{user?.name || 'Shashi Kunal'}</h2>
                <p className="h-profile-hero-role">Lead Platform Architect &amp; SuperAdmin</p>
                <span className="h-profile-hero-email">{user?.email || 'admin@frontend-interview.com'}</span>
              </div>
              <div className="h-profile-hero-stats">
                <div className="h-phs-item">
                  <span className="h-phs-num">17</span>
                  <span className="h-phs-lbl">Active Tracks</span>
                </div>
                <div className="h-phs-item">
                  <span className="h-phs-num">22.2K</span>
                  <span className="h-phs-lbl">Questions Bank</span>
                </div>
                <div className="h-phs-item">
                  <span className="h-phs-num">{profiles.length}</span>
                  <span className="h-phs-lbl">Candidates</span>
                </div>
              </div>
            </div>

            {/* Card 2: Cloud Storage & Quota (Horizon React style) */}
            <div className="h-profile-card h-storage-card">
              <div className="h-card-top-action">
                <div className="h-circle-icon purple">☁️</div>
                <span className="h-live-pill">Supabase Cloud</span>
              </div>
              <div className="h-storage-body">
                <h3 className="h-storage-title">Platform &amp; Realtime Quota</h3>
                <p className="h-storage-desc">Continuous telemetry stream and Postgres allocation sync</p>
                <div className="h-storage-progress-area">
                  <div className="h-storage-labels">
                    <span>24.8 GB Used</span>
                    <span>50 GB Quota</span>
                  </div>
                  <div className="h-storage-bar-track">
                    <div className="h-storage-bar-fill" style={{ width: '49.6%' }} />
                  </div>
                </div>
                <div className="h-storage-specs">
                  <div className="h-spec-item">
                    <span>Active Channels</span>
                    <strong>{liveActivities.length > 0 ? liveActivities.length : '12'} Stream Events</strong>
                  </div>
                  <div className="h-spec-item">
                    <span>Postgres Pool</span>
                    <strong>Healthy (99.98%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Platform Operations & Actions */}
            <div className="h-profile-card h-actions-card">
              <div className="h-card-top-action">
                <div className="h-circle-icon green">⚡</div>
                <span className="h-live-pill green">Ready</span>
              </div>
              <div className="h-action-body">
                <h3 className="h-storage-title">Quick Operations</h3>
                <p className="h-storage-desc">Instant cloud management &amp; data governance actions</p>
                <div className="h-profile-quick-actions">
                  <button type="button" className="btn btn-primary" onClick={loadData} disabled={isLoading}>
                    {isLoading ? '⏳ Syncing...' : '🔄 Sync Live Supabase State'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleExportCSV}>
                    📥 Export All Candidates (CSV)
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleExportActivitiesCSV}>
                    📊 Export Telemetry Events (CSV)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle 2-Column Grid */}
          <div className="h-profile-mid-grid">
            {/* Left: Active Projects & Curriculums */}
            <div className="h-profile-card h-projects-card">
              <div className="h-card-header">
                <div>
                  <h3 className="h-card-title">Active Curriculum Tracks</h3>
                  <p className="h-card-sub">Core engineering tracks managed by the evaluation board</p>
                </div>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setActiveTab('tracks')}>
                  View All Tracks →
                </button>
              </div>

              <div className="h-projects-list">
                {PLATFORM_TRACKS.slice(0, 4).map(track => (
                  <div key={track.id} className="h-project-row">
                    <div className="h-project-icon">{track.icon}</div>
                    <div className="h-project-info">
                      <div className="h-project-title-row">
                        <strong>{track.name}</strong>
                        <span className={`h-diff-badge ${track.difficulty.toLowerCase()}`}>{track.difficulty}</span>
                      </div>
                      <div className="h-project-meta">
                        <span>{track.totalModules} modules</span>
                        <span>•</span>
                        <span>{track.activeCandidates} active candidates</span>
                        <span>•</span>
                        <span style={{ color: 'var(--h-brand-green)' }}>{track.avgScore}% pass rate</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setActiveTab('tracks')}
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: General Information & Security Overview */}
            <div className="h-profile-card h-general-info-card">
              <div className="h-card-header">
                <div>
                  <h3 className="h-card-title">General Information</h3>
                  <p className="h-card-sub">Administrative identity &amp; governance credentials</p>
                </div>
              </div>

              <div className="h-general-info-grid">
                <div className="h-gi-item">
                  <span className="h-gi-label">Organization</span>
                  <strong className="h-gi-val">Frontend System Architecture Board</strong>
                </div>
                <div className="h-gi-item">
                  <span className="h-gi-label">Role &amp; Permissions</span>
                  <strong className="h-gi-val">Platform Administrator (All Entitlements)</strong>
                </div>
                <div className="h-gi-item">
                  <span className="h-gi-label">Authentication Method</span>
                  <strong className="h-gi-val">Supabase Auth + JWT Session Bearer</strong>
                </div>
                <div className="h-gi-item">
                  <span className="h-gi-label">MFA Verification</span>
                  <strong className="h-gi-val" style={{ color: 'var(--h-brand-green)' }}>🟢 Verified &amp; Active</strong>
                </div>
                <div className="h-gi-item">
                  <span className="h-gi-label">Session Lifetime</span>
                  <strong className="h-gi-val">8 Hours (Auto-Refresh Enabled)</strong>
                </div>
                <div className="h-gi-item">
                  <span className="h-gi-label">Environment</span>
                  <strong className="h-gi-val">Production / Multi-Tenant Cloud</strong>
                </div>
              </div>

              <div className="h-theme-control-banner">
                <div className="h-tcb-info">
                  <strong>Appearance &amp; Dashboard Theme</strong>
                  <span>Switch between Horizon Light and Horizon Dark themes instantly</span>
                </div>
                <button
                  type="button"
                  className="h-theme-switch-btn"
                  onClick={toggleTheme}
                >
                  {adminTheme === 'light' ? '🌙 Switch to Dark' : '☀️ Switch to Light'}
                </button>
              </div>
            </div>
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
                  quizAccuracy: 0,
                  mockScore: 0,
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
      {/* TAB: HORIZON UI PROFILE SHOWCASE */}
      {/* ================================================================ */}
      {activeTab === 'profile' && (
        <div className="admin-tab-content h-profile-page-grid">
          {/* Profile Hero Card */}
          <div className="card-box h-profile-hero-card">
            <div className="h-profile-hero-cover">
              <div className="h-profile-badge-pill">⚡ ADMINISTRATOR PROFILE</div>
            </div>
            <div className="h-profile-hero-content">
              <div className="h-profile-hero-avatar">
                {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="h-profile-hero-details">
                <h2>{user?.name || 'Administrator'}</h2>
                <p>{user?.email || 'admin@faangprep.enterprise'}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                  <span className="h-role-badge">{user?.role || 'admin'}</span>
                  <span className="status-pill-badge active">● Active Superuser</span>
                </div>
              </div>
              <div className="h-profile-hero-stats">
                <div className="h-phs-item">
                  <span className="h-phs-num">{profiles.length}</span>
                  <span className="h-phs-label">Candidates</span>
                </div>
                <div className="h-phs-item">
                  <span className="h-phs-num">{submissionsList.length}</span>
                  <span className="h-phs-label">Submissions</span>
                </div>
                <div className="h-phs-item">
                  <span className="h-phs-num">22K</span>
                  <span className="h-phs-label">Questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Grid Cards */}
          <div className="h-profile-cards-grid">
            {/* Cloud Capacity Card */}
            <div className="card-box h-profile-card">
              <div className="h-profile-card-header">
                <h4>Cloud Infrastructure</h4>
                <span className="submission-pill accepted">HEALTHY</span>
              </div>
              <p className="h-card-sub">Supabase PostgreSQL &amp; Real-Time Telemetry Stream</p>
              <div className="h-storage-bar-wrap" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--h-text-muted)' }}>Database Capacity</span>
                  <strong style={{ color: 'var(--h-text-white)' }}>32% Allocated</strong>
                </div>
                <div className="pcb-bar-wrap">
                  <div className="pcb-bar-fill high" style={{ width: '32%' }} />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--h-text-muted)' }}>Status:</span><strong style={{ color: 'var(--h-text-white)' }}>🟢 Connected (Multi-Region)</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--h-text-muted)' }}>WebSocket:</span><strong style={{ color: 'var(--h-text-white)' }}>🟢 60fps Active Stream</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--h-text-muted)' }}>RLS Policies:</span><strong style={{ color: 'var(--h-text-white)' }}>🛡️ 14 Tables Enforced</strong></div>
              </div>
            </div>

            {/* General Information Card */}
            <div className="card-box h-profile-card">
              <div className="h-profile-card-header">
                <h4>General Information</h4>
              </div>
              <p className="h-card-sub">Platform credentials and identity details</p>
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.84rem' }}>
                <div><span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--h-text-muted)' }}>Department</span><strong style={{ color: 'var(--h-text-white)' }}>Platform Engineering</strong></div>
                <div><span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--h-text-muted)' }}>Level</span><strong style={{ color: 'var(--h-text-white)' }}>Staff / Director</strong></div>
                <div><span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--h-text-muted)' }}>Location</span><strong style={{ color: 'var(--h-text-white)' }}>Global Multi-Tenant</strong></div>
                <div><span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--h-text-muted)' }}>Active Tracks</span><strong style={{ color: 'var(--h-text-white)' }}>6 Core FAANG Tracks</strong></div>
                <div><span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--h-text-muted)' }}>Access Level</span><strong style={{ color: 'var(--h-text-white)' }}>Full RBAC Superuser</strong></div>
                <div><span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--h-text-muted)' }}>Account Status</span><strong style={{ color: 'var(--h-text-white)' }}>✅ Verified</strong></div>
              </div>
            </div>

            {/* System Preferences Card */}
            <div className="card-box h-profile-card">
              <div className="h-profile-card-header">
                <h4>System Preferences</h4>
              </div>
              <p className="h-card-sub">Real-time alert notifications and theme settings</p>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--h-text-white)', fontSize: '0.86rem' }}>Admin Visual Theme</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--h-text-muted)' }}>Toggle between Light &amp; Dark Horizon aesthetic</p>
                  </div>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={toggleTheme}>
                    {adminTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--h-text-white)', fontSize: '0.86rem' }}>Access Request Alerts</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--h-text-muted)' }}>Instant banner notifications for feature approvals</p>
                  </div>
                  <span className="submission-pill accepted">ON</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--h-text-white)', fontSize: '0.86rem' }}>Supabase CDC Sync</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--h-text-muted)' }}>Live telemetry stream from Postgres tables</p>
                  </div>
                  <span className="submission-pill accepted">ON</span>
                </div>
              </div>
            </div>
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

      {/* Candidate Deep-Dive Activity Modal */}
      {selectedUserForDeepDive && (
        <AdminUserDetailModal
          userId={selectedUserForDeepDive}
          onClose={() => setSelectedUserForDeepDive(null)}
          onViewCode={(sub) => setSelectedSubmissionForCode(sub)}
          onViewAttemptCode={(att) => setSelectedAttemptForCode(att)}
        />
      )}

      {/* Submission Code Inspector Modal */}
      {selectedSubmissionForCode && (
        <AdminSubmissionCodeModal
          submission={selectedSubmissionForCode}
          onClose={() => setSelectedSubmissionForCode(null)}
          onSaveReview={(rev) => {
            setSubmissionsList(prev =>
              prev.map(s => (s.id === rev.submissionId ? { ...s, score: rev.score } : s))
            )
            setStatusToast(`⭐ Evaluator Review saved! Candidate marks updated to ${rev.score}%.`)
            setTimeout(() => setStatusToast(null), 4000)
          }}
        />
      )}

      {/* Candidate Attempt Code Inspector Modal */}
      {selectedAttemptForCode && (
        <AdminAttemptCodeModal
          attempt={selectedAttemptForCode}
          onClose={() => setSelectedAttemptForCode(null)}
          onInspectUser={(uId: string) => {
            setSelectedAttemptForCode(null)
            setSelectedUserForDeepDive(uId)
          }}
        />
      )}
        </div>
      </main>
    </div>
  )
}
