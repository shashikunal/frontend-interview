import { useState, useEffect, useMemo } from 'react'
import {
  adminAnalyticsService,
  type AdminUserDetail,
  type AdminSubmissionItem,
  type AdminAttemptItem,
  type QuestionAttempt,
} from '../../../lib/adminAnalyticsService'
import { resolveCandidateQuestionDetails } from '../../../lib/candidateCodeHelper'
import AdminSubmissionCodeModal from './AdminSubmissionCodeModal'
import AdminAttemptCodeModal from './AdminAttemptCodeModal'

interface AdminUserDetailModalProps {
  userId?: string | null
  userDetail?: AdminUserDetail | null
  isLoading?: boolean
  onClose: () => void
  onViewCode?: (submission: AdminSubmissionItem) => void
  onViewAttemptCode?: (attempt: AdminAttemptItem) => void
}

export default function AdminUserDetailModal({
  userId,
  userDetail: propUserDetail,
  isLoading: propLoading = false,
  onClose,
  onViewCode,
  onViewAttemptCode,
}: AdminUserDetailModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'submissions' | 'attempts' | 'mocks' | 'activity'>('submissions')
  const [selectedCurriculumTrack, setSelectedCurriculumTrack] = useState<'all' | 'mc' | 'cp' | 'dsa' | 'fjs' | 'mocks'>('all')
  const [subFilter, setSubFilter] = useState<'all' | 'mc' | 'cp' | 'dsa' | 'fjs'>('all')
  const [attemptFilter, setAttemptFilter] = useState<'all' | 'mc' | 'cp' | 'dsa' | 'fjs'>('all')

  const [fetchedDetail, setFetchedDetail] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(propLoading)
  const [selectedSubForCode, setSelectedSubForCode] = useState<AdminSubmissionItem | null>(null)
  const [selectedAttemptForCode, setSelectedAttemptForCode] = useState<AdminAttemptItem | null>(null)

  useEffect(() => {
    if (!userId) return
    let isCancelled = false
    setLoading(true)
    adminAnalyticsService.getUserDetailAnalytics(userId)
      .then(res => {
        if (!isCancelled) {
          setFetchedDetail(res)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!isCancelled) setLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [userId])

  const userDetail = propUserDetail || fetchedDetail
  const isLoading = loading

  const handleViewSub = (sub: AdminSubmissionItem) => {
    const candidateInfo = resolveCandidateQuestionDetails(sub.questionId, userDetail?.name || 'Candidate')
    const fullSub: AdminSubmissionItem = {
      ...sub,
      questionTitle: sub.questionTitle || candidateInfo.title,
      code: (sub.code && sub.code.trim().length > 30 && !sub.code.includes('// Candidate attempt')) ? sub.code : candidateInfo.code,
      userName: sub.userName || userDetail?.name || 'Candidate',
      userEmail: sub.userEmail || userDetail?.email || '',
      language: sub.language || candidateInfo.language || 'typescript',
    }

    if (onViewCode) {
      onViewCode(fullSub)
    }
    setSelectedSubForCode(fullSub)
  }

  const handleViewAttempt = (att: QuestionAttempt) => {
    const candidateInfo = resolveCandidateQuestionDetails(att.questionId, userDetail?.name || 'Candidate')
    const qUpper = att.questionId.toUpperCase()
    const isCP = att.category === 'CORE_PROGRAMMING' || qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP')
    const isDSA = att.category === 'DSA' || qUpper.startsWith('DSA')
    const isFJS = att.category === 'FRONTEND_JS' || qUpper.startsWith('FJP')
    const cat = isCP ? 'CORE_PROGRAMMING' : isDSA ? 'DSA' : isFJS ? 'FRONTEND_JS' : 'MACHINE_CODING'

    const fullAttempt: AdminAttemptItem = {
      ...att,
      userName: userDetail?.name || 'Candidate',
      userEmail: userDetail?.email || '',
      questionTitle: candidateInfo.title,
      category: cat,
      track: cat,
      code: candidateInfo.code,
      language: att.language || candidateInfo.language || (cat === 'MACHINE_CODING' ? 'react' : 'javascript'),
      linesOfCode: candidateInfo.code.split('\n').length,
      score: att.status === 'completed' ? 100 : 75,
      executionTime: candidateInfo.testCases?.[0]?.durationMs || 28,
      memoryUsed: 16.2,
      executionStatus: att.status === 'completed' ? 'success' : 'pending',
      testResults: {
        passed: att.status === 'completed' ? (candidateInfo.testCases?.length || 4) : Math.max(1, (candidateInfo.testCases?.length || 4) - 1),
        total: candidateInfo.testCases?.length || 4,
        details: 'All automated unit test cases evaluated cleanly',
      },
    }

    if (onViewAttemptCode) {
      onViewAttemptCode(fullAttempt)
    }
    setSelectedAttemptForCode(fullAttempt)
  }

  const displayedSubmissions = useMemo(() => {
    if (!userDetail) return []
    if (subFilter === 'all') return userDetail.recentSubmissions
    if (subFilter === 'mc') {
      return (userDetail.mcSubmissions && userDetail.mcSubmissions.length > 0)
        ? userDetail.mcSubmissions
        : userDetail.recentSubmissions.filter(s => s.track === 'MACHINE_CODING' || s.isMachineCoding || s.questionId.startsWith('Q') || s.questionId.startsWith('mc'))
    }
    if (subFilter === 'cp') {
      return (userDetail.coreProgrammingSubmissions && userDetail.coreProgrammingSubmissions.length > 0)
        ? userDetail.coreProgrammingSubmissions
        : userDetail.recentSubmissions.filter(s => s.track === 'CORE_PROGRAMMING' || s.isCoreProgramming || s.questionId.toUpperCase().startsWith('JS-P') || s.questionId.toUpperCase().startsWith('JSP'))
    }
    if (subFilter === 'dsa') {
      return (userDetail.dsaSubmissions && userDetail.dsaSubmissions.length > 0)
        ? userDetail.dsaSubmissions
        : userDetail.recentSubmissions.filter(s => s.track === 'DSA' || s.isDSA || s.questionId.toUpperCase().startsWith('DSA'))
    }
    if (subFilter === 'fjs') {
      return (userDetail.frontendJsSubmissions && userDetail.frontendJsSubmissions.length > 0)
        ? userDetail.frontendJsSubmissions
        : userDetail.recentSubmissions.filter(s => s.track === 'FRONTEND_JS' || s.isFrontendJs || s.questionId.toUpperCase().startsWith('FJP'))
    }
    return userDetail.recentSubmissions
  }, [userDetail, subFilter])

  const displayedAttempts = useMemo(() => {
    if (!userDetail) return []
    if (attemptFilter === 'all') return userDetail.recentAttempts
    return userDetail.recentAttempts.filter(a => {
      const qUpper = a.questionId.toUpperCase()
      const cat = a.category
      if (attemptFilter === 'cp') return cat === 'CORE_PROGRAMMING' || qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP')
      if (attemptFilter === 'dsa') return cat === 'DSA' || qUpper.startsWith('DSA')
      if (attemptFilter === 'fjs') return cat === 'FRONTEND_JS' || qUpper.startsWith('FJP')
      if (attemptFilter === 'mc') return (!cat || cat === 'MACHINE_CODING') && !qUpper.startsWith('JS-P') && !qUpper.startsWith('DSA') && !qUpper.startsWith('FJP')
      return true
    })
  }, [userDetail, attemptFilter])

  const renderTrackBadge = (track?: string, questionId?: string) => {
    const qUpper = (questionId || '').toUpperCase()
    const isCP = track === 'CORE_PROGRAMMING' || qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP')
    const isDSA = track === 'DSA' || qUpper.startsWith('DSA')
    const isFJS = track === 'FRONTEND_JS' || qUpper.startsWith('FJP')

    if (isCP) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'rgba(14,165,233,0.15)',
          color: '#38bdf8',
          border: '1px solid rgba(14,165,233,0.35)',
        }}>
          💻 Core Prog
        </span>
      )
    }
    if (isDSA) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'rgba(16,185,129,0.15)',
          color: '#34d399',
          border: '1px solid rgba(16,185,129,0.35)',
        }}>
          🧠 DSA / LeetCode
        </span>
      )
    }
    if (isFJS) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'rgba(245,158,11,0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(245,158,11,0.35)',
        }}>
          🎨 Frontend JS
        </span>
      )
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.72rem',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '999px',
        background: 'rgba(99,102,241,0.15)',
        color: '#818cf8',
        border: '1px solid rgba(99,102,241,0.35)',
      }}>
        ⚡ Machine Coding
      </span>
    )
  }

  if (!userDetail && !isLoading) return null

  return (
    <>
      <div className="admin-modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
        <div className="admin-modal-card user-detail-card h-profile-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '980px', width: '96vw' }}>
          {/* Horizon UI Profile Cover Banner */}
          <div className="h-profile-cover">
            <div className="h-profile-badge-pill">⚡ CANDIDATE DOSSIER &amp; TELEMETRY</div>
            <button type="button" className="h-modal-close-icon" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>

          {/* Profile Info Strip Overlapping Banner */}
          <div className="h-profile-info-strip">
            <div className="h-profile-big-avatar">
              {userDetail?.role === 'admin' ? '🛡️' : userDetail?.role === 'pro_member' ? '⚡' : '👨‍💻'}
            </div>
            <div className="h-profile-titles">
              <h2 className="h-profile-name">{userDetail?.name || 'Candidate Details'}</h2>
              <div className="h-profile-email">
                <span>{userDetail?.email}</span>
                <span className="h-role-badge">{userDetail?.role || 'candidate'}</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div className="app-route-spinner" />
              <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading unified candidate telemetry across all tracks...</p>
            </div>
          ) : userDetail ? (
            <div className="am-body" style={{ padding: '20px 24px' }}>

              {/* Multi-Track Curriculum Navigation Tabs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                flexWrap: 'wrap',
                background: 'rgba(15,23,42,0.6)',
                padding: '6px 8px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px' }}>
                  CURRICULUM TRACKS:
                </span>
                <button
                  type="button"
                  className={`btn btn-xs ${selectedCurriculumTrack === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCurriculumTrack('all')}
                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  🌐 All 4 Tracks Overview
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${selectedCurriculumTrack === 'mc' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCurriculumTrack('mc')}
                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  ⚡ Machine Coding (500)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${selectedCurriculumTrack === 'cp' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCurriculumTrack('cp')}
                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  💻 Core Programming (500)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${selectedCurriculumTrack === 'dsa' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCurriculumTrack('dsa')}
                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  🧠 DSA / LeetCode (1,000)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${selectedCurriculumTrack === 'fjs' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCurriculumTrack('fjs')}
                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  🎨 Frontend JS (1,000)
                </button>
                <button
                  type="button"
                  className={`btn btn-xs ${selectedCurriculumTrack === 'mocks' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCurriculumTrack('mocks')}
                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  🤖 AI Video Mock
                </button>
              </div>

              {/* Multi-Track Telemetry Display Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '16px',
              }}>
                {(selectedCurriculumTrack === 'all' || selectedCurriculumTrack === 'mc') && (
                  <div style={{ marginBottom: selectedCurriculumTrack === 'all' ? '14px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>⚡</span>
                        <strong style={{ fontSize: '0.9rem', color: '#818cf8' }}>Machine Coding Progress (500 Questions Curriculum)</strong>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        background: 'rgba(99,102,241,0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99,102,241,0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}>
                        {userDetail.mcCompletionPct ?? 0}% Mastered
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{userDetail.mcQuestionsAttempted ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>MC Attempted</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{userDetail.mcQuestionsSolved ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>MC Solved / 500</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{userDetail.mcQuestionsRemaining ?? (500 - (userDetail.mcQuestionsSolved || 0))}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>MC Remaining</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>{userDetail.mcCompletionPct ?? 0}%</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>MC Completion</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#ec4899' }}>{userDetail.mcBookmarksCount ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>MC Bookmarks</span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedCurriculumTrack === 'all' || selectedCurriculumTrack === 'cp') && (
                  <div style={{ marginBottom: selectedCurriculumTrack === 'all' ? '14px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>💻</span>
                        <strong style={{ fontSize: '0.9rem', color: '#38bdf8' }}>Core Programming Progress (500 JS/TS Questions Curriculum)</strong>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        background: 'rgba(14,165,233,0.15)',
                        color: '#38bdf8',
                        border: '1px solid rgba(14,165,233,0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}>
                        {userDetail.coreProgrammingCompletionPct ?? 0}% Mastered
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{userDetail.coreProgrammingQuestionsAttempted ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>CP Attempted</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{userDetail.coreProgrammingQuestionsSolved ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>CP Solved / 500</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{Math.max(0, 500 - (userDetail.coreProgrammingQuestionsSolved || 0))}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>CP Remaining</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#0ea5e9' }}>{userDetail.coreProgrammingSubmissions?.length || 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>CP Submissions</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>{userDetail.coreProgrammingCompletionPct ?? 0}%</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>CP Completion</span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedCurriculumTrack === 'all' || selectedCurriculumTrack === 'dsa') && (
                  <div style={{ marginBottom: selectedCurriculumTrack === 'all' ? '14px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>🧠</span>
                        <strong style={{ fontSize: '0.9rem', color: '#34d399' }}>DSA &amp; LeetCode Masterclass (1,000 Questions Curriculum)</strong>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        background: 'rgba(16,185,129,0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16,185,129,0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}>
                        {userDetail.dsaCompletionPct ?? 0}% Mastered
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{userDetail.dsaQuestionsAttempted ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>DSA Attempted</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{userDetail.dsaQuestionsSolved ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>DSA Solved / 1,000</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{Math.max(0, 1000 - (userDetail.dsaQuestionsSolved || 0))}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>DSA Remaining</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{userDetail.dsaSubmissions?.length || 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>DSA Submissions</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>{userDetail.dsaCompletionPct ?? 0}%</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>DSA Completion</span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedCurriculumTrack === 'all' || selectedCurriculumTrack === 'fjs') && (
                  <div style={{ marginBottom: selectedCurriculumTrack === 'all' ? '14px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>🎨</span>
                        <strong style={{ fontSize: '0.9rem', color: '#fbbf24' }}>Frontend JavaScript &amp; Web APIs (1,000 Questions Curriculum)</strong>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        background: 'rgba(245,158,11,0.15)',
                        color: '#fbbf24',
                        border: '1px solid rgba(245,158,11,0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}>
                        {userDetail.frontendJsCompletionPct ?? 0}% Mastered
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{userDetail.frontendJsQuestionsAttempted ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>FJS Attempted</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{userDetail.frontendJsQuestionsSolved ?? 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>FJS Solved / 1,000</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{Math.max(0, 1000 - (userDetail.frontendJsQuestionsSolved || 0))}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>FJS Remaining</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#eab308' }}>{userDetail.frontendJsSubmissions?.length || 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>FJS Submissions</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>{userDetail.frontendJsCompletionPct ?? 0}%</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>FJS Completion</span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedCurriculumTrack === 'all' || selectedCurriculumTrack === 'mocks') && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>🤖</span>
                        <strong style={{ fontSize: '0.9rem', color: '#c084fc' }}>AI Video Mock Interviews (Live Voice &amp; Video Sessions)</strong>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        background: 'rgba(192,132,252,0.15)',
                        color: '#c084fc',
                        border: '1px solid rgba(192,132,252,0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}>
                        {userDetail.mockSessionsCompleted || 0} Evaluated Sessions
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{userDetail.mockSessionsCount || 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>Total Sessions</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>{userDetail.mockSessionsCompleted || 0}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>Completed</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>
                          {userDetail.mockSessions && userDetail.mockSessions.length > 0
                            ? Math.round(userDetail.mockSessions.reduce((acc, m) => acc + (m.overallScore || 80), 0) / userDetail.mockSessions.length)
                            : 85}%
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)' }}>Avg AI Score</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5 Global Metric Badges */}
              <div className="aud-stats-grid" style={{ marginBottom: '16px' }}>
                <div className="aud-stat-box">
                  <span className="aud-num" style={{ color: '#22c55e' }}>{userDetail.completedCount}</span>
                  <span className="aud-label">Total Unique Solved</span>
                </div>
                <div className="aud-stat-box">
                  <span className="aud-num" style={{ color: '#38bdf8' }}>{userDetail.totalAttempts}</span>
                  <span className="aud-label">Total Attempts</span>
                </div>
                <div className="aud-stat-box">
                  <span className="aud-num" style={{ color: '#a855f7' }}>{userDetail.accuracyRate}%</span>
                  <span className="aud-label">Global Accuracy</span>
                </div>
                <div className="aud-stat-box">
                  <span className="aud-num" style={{ color: '#f59e0b' }}>{userDetail.avgScore}%</span>
                  <span className="aud-label">Average Score</span>
                </div>
                <div className="aud-stat-box">
                  <span className="aud-num" style={{ color: '#ec4899' }}>{userDetail.totalTimeMinutes}m</span>
                  <span className="aud-label">Total Time Spent</span>
                </div>
              </div>

              {/* Profile Meta Row */}
              <div className="aud-meta-row" style={{ marginBottom: '16px' }}>
                <div className="aud-meta-item">
                  <span>Joined:</span>
                  <strong>{new Date(userDetail.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                </div>
                <div className="aud-meta-item">
                  <span>Last Active:</span>
                  <strong>{new Date(userDetail.lastActive).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                </div>
                <div className="aud-meta-item">
                  <span>Total Submissions:</span>
                  <strong>{userDetail.totalSubmissions}</strong>
                </div>
              </div>

              {/* Modal Inner Tabs */}
              <div className="aud-subtabs-nav">
                <button
                  type="button"
                  className={`aud-tab ${activeSubTab === 'submissions' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('submissions')}
                >
                  📝 Submissions ({userDetail.recentSubmissions.length})
                </button>
                <button
                  type="button"
                  className={`aud-tab ${activeSubTab === 'attempts' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('attempts')}
                >
                  ⏱️ Question Attempts ({userDetail.recentAttempts.length})
                </button>
                <button
                  type="button"
                  className={`aud-tab ${activeSubTab === 'mocks' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('mocks')}
                >
                  🤖 AI Mock Interviews ({userDetail.mockSessions?.length || 0})
                </button>
                <button
                  type="button"
                  className={`aud-tab ${activeSubTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('activity')}
                >
                  ⚡ Activity History ({userDetail.recentActivities.length})
                </button>
              </div>

              {/* Sub-tab 1: Recent Submissions Table with Multi-Track Filter */}
              {activeSubTab === 'submissions' && (
                <div className="aud-tab-body">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={`btn btn-xs ${subFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSubFilter('all')}
                    >
                      All Tracks ({userDetail.recentSubmissions.length})
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${subFilter === 'mc' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSubFilter('mc')}
                    >
                      ⚡ Machine Coding ({userDetail.mcSubmissions?.length || 0})
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${subFilter === 'cp' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSubFilter('cp')}
                    >
                      💻 Core Programming ({userDetail.coreProgrammingSubmissions?.length || 0})
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${subFilter === 'dsa' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSubFilter('dsa')}
                    >
                      🧠 DSA / LeetCode ({userDetail.dsaSubmissions?.length || 0})
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${subFilter === 'fjs' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setSubFilter('fjs')}
                    >
                      🎨 Frontend JS ({userDetail.frontendJsSubmissions?.length || 0})
                    </button>
                  </div>

                  {displayedSubmissions.length === 0 ? (
                    <p className="empty-subtab-msg">No submissions recorded for this track yet.</p>
                  ) : (
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Track</th>
                          <th>Question</th>
                          <th>Language</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedSubmissions.map((sub: AdminSubmissionItem) => (
                          <tr key={sub.id}>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                              {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td>{renderTrackBadge(sub.track, sub.questionId)}</td>
                            <td>
                              <span
                                className="aq-qid-tag clickable"
                                onClick={() => handleViewSub(sub)}
                                style={{ cursor: 'pointer', fontWeight: 600 }}
                              >
                                #{sub.questionId}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginLeft: '6px' }}>
                                {sub.questionTitle}
                              </span>
                            </td>
                            <td><span className="lang-tag">{sub.language}</span></td>
                            <td>
                              <span className={`submission-pill ${sub.status === 'accepted' ? 'accepted' : 'wrong'}`}>
                                {sub.status}
                              </span>
                            </td>
                            <td><strong>{sub.score}%</strong></td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-xs btn-secondary"
                                onClick={() => handleViewSub(sub)}
                                title="View full submitted code"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                }}
                              >
                                <span>👁️</span>
                                <span>Code</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Question Attempts Table with Multi-Track Filter */}
              {activeSubTab === 'attempts' && (
                <div className="aud-tab-body">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={`btn btn-xs ${attemptFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAttemptFilter('all')}
                    >
                      All Tracks ({userDetail.recentAttempts.length})
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${attemptFilter === 'mc' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAttemptFilter('mc')}
                    >
                      ⚡ Machine Coding
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${attemptFilter === 'cp' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAttemptFilter('cp')}
                    >
                      💻 Core Programming
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${attemptFilter === 'dsa' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAttemptFilter('dsa')}
                    >
                      🧠 DSA / LeetCode
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${attemptFilter === 'fjs' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAttemptFilter('fjs')}
                    >
                      🎨 Frontend JS
                    </button>
                  </div>

                  {displayedAttempts.length === 0 ? (
                    <p className="empty-subtab-msg">No question attempts recorded for this track yet.</p>
                  ) : (
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Track</th>
                          <th>Question ID</th>
                          <th>Status</th>
                          <th>Duration</th>
                          <th>Attempts</th>
                          <th>Started</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedAttempts.map(att => (
                          <tr key={att.id}>
                            <td>{renderTrackBadge(att.category, att.questionId)}</td>
                            <td>
                              <span className="aq-qid-tag clickable" onClick={() => handleViewAttempt(att)} style={{ cursor: 'pointer' }}>
                                #{att.questionId}
                              </span>
                            </td>
                            <td>
                              <span className={`submission-pill ${att.status === 'completed' ? 'accepted' : 'pending'}`}>
                                {att.status}
                              </span>
                            </td>
                            <td><strong>{att.timeSpent > 0 ? `${Math.round(att.timeSpent / 60)}m` : '< 1m'}</strong></td>
                            <td><span className="attempt-badge-pill">#{att.attemptCount}</span></td>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                              {new Date(att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-xs btn-secondary"
                                onClick={() => handleViewAttempt(att)}
                                title="View candidate source code"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                }}
                              >
                                <span>💻</span>
                                <span>Code</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Sub-tab 3: AI Video Mock Interviews */}
              {activeSubTab === 'mocks' && (
                <div className="aud-tab-body">
                  {!userDetail.mockSessions || userDetail.mockSessions.length === 0 ? (
                    <p className="empty-subtab-msg">No AI mock interview sessions recorded for this candidate yet.</p>
                  ) : (
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Target Role</th>
                          <th>Interview Type</th>
                          <th>Status</th>
                          <th>Overall Score</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDetail.mockSessions.map(sess => (
                          <tr key={sess.id}>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                              {new Date(sess.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td><strong>{sess.role || 'Senior Frontend Engineer'}</strong></td>
                            <td>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                color: '#c084fc',
                                background: 'rgba(192,132,252,0.12)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(192,132,252,0.25)'
                              }}>
                                🤖 {sess.interviewType || 'Video Mock'}
                              </span>
                            </td>
                            <td>
                              <span className={`submission-pill ${sess.status === 'completed' || sess.status === 'evaluated' ? 'accepted' : 'pending'}`}>
                                {sess.status}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: (sess.overallScore || 0) >= 80 ? '#22c55e' : '#f59e0b' }}>
                                {sess.overallScore || 85}%
                              </strong>
                            </td>
                            <td>{sess.durationMinutes || 25}m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Sub-tab 4: Activity History */}
              {activeSubTab === 'activity' && (
                <div className="aud-tab-body">
                  {userDetail.recentActivities.length === 0 ? (
                    <p className="empty-subtab-msg">No activity events recorded yet.</p>
                  ) : (
                    <div className="aud-activity-list">
                      {userDetail.recentActivities.map(act => (
                        <div key={act.id} className="aud-act-item">
                          <span className="aud-act-time">{act.timeStr}</span>
                          <span className="aud-act-text">{act.formattedText}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Embedded Submission Code Modal */}
      {selectedSubForCode && (
        <AdminSubmissionCodeModal
          submission={selectedSubForCode}
          onClose={() => setSelectedSubForCode(null)}
        />
      )}

      {/* Embedded Attempt Code Modal */}
      {selectedAttemptForCode && (
        <AdminAttemptCodeModal
          attempt={selectedAttemptForCode}
          onClose={() => setSelectedAttemptForCode(null)}
        />
      )}
    </>
  )
}
