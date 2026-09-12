import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { profileService } from '../../../auth/services/profile.service';
import { authService } from '../../../auth/services/auth.service';
import { codingHistoryService, formatDurationSec } from '../../services/codingHistoryService';
import { hiringEvaluationService } from '../../services/hiringEvaluationService';
import QuestionHistoryDetailModal from '../student/QuestionHistoryDetailModal';
import type {
  CodingAttempt,
  UserPerformanceSummary,
  HiringEvaluationHistoryItem,
  HiringStatus,
} from '../../types/history.types';
import './AdminCandidatePerformancePage.css';

// Track category normalization helpers
const normalizeTrackCategory = (slug?: string | null): string | null => {
  if (!slug) return null;
  const s = slug.toLowerCase().replace(/_/g, '-');
  if (s === 'machine-coding' || s === 'mc' || s === 'machine_coding') return 'MACHINE_CODING';
  if (s === 'leetcode' || s === 'dsa' || s === 'algorithms') return 'DSA';
  if (s === 'core-programming' || s === 'core' || s === 'core_programming' || s === 'javascript') return 'CORE_PROGRAMMING';
  return slug.toUpperCase();
};


const getTrackMeta = (categoryKey: string) => {
  const c = categoryKey.toUpperCase();
  if (c === 'MACHINE_CODING') {
    return {
      title: 'Machine Level Coding',
      shortTitle: 'Machine Coding',
      icon: '⚡',
      badgeClass: 'mc',
      description: 'Frontend component architecture, DOM interfaces, state management, and full UI implementation.',
    };
  }
  if (c === 'DSA') {
    return {
      title: 'LeetCode / DSA Algorithms',
      shortTitle: 'LeetCode / DSA',
      icon: '🧠',
      badgeClass: 'dsa',
      description: 'Algorithms, data structures, complexity analysis, dynamic programming, and logic puzzles.',
    };
  }
  if (c === 'CORE_PROGRAMMING') {
    return {
      title: 'Core Programming',
      shortTitle: 'Core Programming',
      icon: '💻',
      badgeClass: 'cp',
      description: 'JavaScript & TypeScript core mechanics, closures, prototypes, event loop, and asynchronous engines.',
    };
  }
  return {
    title: categoryKey.replace(/_/g, ' '),
    shortTitle: categoryKey.replace(/_/g, ' '),
    icon: '📂',
    badgeClass: 'custom',
    description: 'Technical assessment track questions, submissions, and code inspection.',
  };
};

export default function AdminCandidatePerformancePage() {
  const { userId, attemptId, trackKey } = useParams<{ userId: string; attemptId?: string; sessionId?: string; trackKey?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const queryTrack = searchParams.get('track');
  const activeTrackSlug = trackKey || queryTrack;
  const activeTrackCategory = normalizeTrackCategory(activeTrackSlug);

  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    targetCompany?: string;
    experienceLevel?: string;
    joinedDate?: string;
  } | null>(null);

  const [summary, setSummary] = useState<UserPerformanceSummary | null>(null);
  const [attempts, setAttempts] = useState<CodingAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily-activity' | 'code-history' | 'hiring'>(() => {
    if (attemptId) return 'code-history';
    return 'overview';
  });

  // Daily & Weekly Time Breakdown State
  const [timeViewMode, setTimeViewMode] = useState<'daily' | 'weekly'>('daily');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [dailySearchTerm, setDailySearchTerm] = useState('');
  const [dailyCategoryFilter, setDailyCategoryFilter] = useState('ALL');
  const [dailyStatusFilter, setDailyStatusFilter] = useState('ALL');

  useEffect(() => {
    if (!isAdmin && activeTab === 'hiring') {
      setActiveTab('overview');
    }
  }, [isAdmin, activeTab]);

  const toggleDayExpansion = (date: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: prev[date] === undefined ? false : !prev[date],
    }));
  };

  const isDayExpanded = (date: string, index: number) => {
    if (expandedDays[date] !== undefined) {
      return expandedDays[date];
    }
    return index < 4; // Default expand top 4 days
  };

  const toggleWeekExpansion = (weekKey: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekKey]: prev[weekKey] === undefined ? false : !prev[weekKey],
    }));
  };

  const isWeekExpanded = (weekKey: string, index: number) => {
    if (expandedWeeks[weekKey] !== undefined) {
      return expandedWeeks[weekKey];
    }
    return index < 3; // Default expand top 3 weeks
  };

  const handleExpandAllDays = () => {
    if (!summary?.dailyActivity) return;
    const next: Record<string, boolean> = {};
    summary.dailyActivity.forEach(d => { next[d.date] = true; });
    setExpandedDays(next);
    if (summary?.weeklyActivity) {
      const nextW: Record<string, boolean> = {};
      summary.weeklyActivity.forEach(w => { nextW[w.weekKey] = true; });
      setExpandedWeeks(nextW);
    }
  };

  const handleCollapseAllDays = () => {
    if (!summary?.dailyActivity) return;
    const next: Record<string, boolean> = {};
    summary.dailyActivity.forEach(d => { next[d.date] = false; });
    setExpandedDays(next);
    if (summary?.weeklyActivity) {
      const nextW: Record<string, boolean> = {};
      summary.weeklyActivity.forEach(w => { nextW[w.weekKey] = false; });
      setExpandedWeeks(nextW);
    }
  };

  // Dedicated Track Question History State
  const [trackSearchTerm, setTrackSearchTerm] = useState('');
  const [trackDifficultyFilter, setTrackDifficultyFilter] = useState('ALL');
  const [trackStatusFilter, setTrackStatusFilter] = useState('ALL');
  const [trackLanguageFilter, setTrackLanguageFilter] = useState('ALL');
  const [trackSortOption, setTrackSortOption] = useState<'latest' | 'score' | 'attempts' | 'title'>('latest');
  const [trackPage, setTrackPage] = useState(1);
  const trackPageSize = 15;

  // Code inspection modal state
  const [inspectingAttempt, setInspectingAttempt] = useState<CodingAttempt | null>(null);

  // Raw Code tab inspection state
  const [selectedAttempt, setSelectedAttempt] = useState<CodingAttempt | null>(null);
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Hiring Evaluation State
  const [hiringStatus, setHiringStatus] = useState<HiringStatus>('Pending');
  const [overallRating, setOverallRating] = useState<number>(3);
  const [rubricProblemSolving, setRubricProblemSolving] = useState<number>(3);
  const [rubricCodeQuality, setRubricCodeQuality] = useState<number>(3);
  const [rubricCommunication, setRubricCommunication] = useState<number>(3);
  const [rubricArchitecture, setRubricArchitecture] = useState<number>(3);
  const [recommendation, setRecommendation] = useState('');
  const [notes, setNotes] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [finalComments, setFinalComments] = useState('');
  const [evaluationHistory, setEvaluationHistory] = useState<HiringEvaluationHistoryItem[]>([]);
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [evaluationSaveMessage, setEvaluationSaveMessage] = useState<string | null>(null);

  // Password Reset Action State
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetToast, setPasswordResetToast] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const [profile, sum, history, currentEval, evalHist] = await Promise.all([
          profileService.getProfile(userId!),
          codingHistoryService.getUserPerformanceSummary(userId!),
          codingHistoryService.getUserCodingHistory(userId!),
          hiringEvaluationService.getEvaluation(userId!),
          hiringEvaluationService.getEvaluationHistory(userId!),
        ]);

        if (isMounted) {
          if (profile) {
            setCandidateProfile({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              targetCompany: profile.targetCompany,
              experienceLevel: profile.experienceLevel,
              joinedDate: profile.createdAt,
            });
          } else {
            setCandidateProfile({
              id: userId!,
              name: 'Candidate',
              email: `${userId!.slice(0, 8)}@candidate.com`,
              role: 'candidate',
            });
          }

          setSummary(sum);
          setAttempts(history);
          setEvaluationHistory(evalHist);

          if (currentEval) {
            setHiringStatus(currentEval.status);
            setOverallRating(currentEval.overallRating);
            if (currentEval.rubricProblemSolving) setRubricProblemSolving(currentEval.rubricProblemSolving);
            if (currentEval.rubricCodeQuality) setRubricCodeQuality(currentEval.rubricCodeQuality);
            if (currentEval.rubricCommunication) setRubricCommunication(currentEval.rubricCommunication);
            if (currentEval.rubricArchitecture) setRubricArchitecture(currentEval.rubricArchitecture);
            setRecommendation(currentEval.recommendation || '');
            setNotes(currentEval.notes || '');
            setStrengths(currentEval.strengths || '');
            setWeaknesses(currentEval.weaknesses || '');
            setFinalComments(currentEval.finalComments || '');
          }

          if (history.length > 0) {
            if (attemptId) {
              const matched = history.find(a => a.id === attemptId || a.sessionId === attemptId);
              if (matched) {
                setSelectedAttempt(matched);
                setActiveTab('code-history');
              } else {
                setSelectedAttempt(history[0]);
              }
            } else {
              setSelectedAttempt(history[0]);
            }
          }
        }
      } catch (err) {
        console.warn('[AdminCandidatePerformancePage] Error loading candidate data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [userId, attemptId]);

  // Handle Save Evaluation
  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSavingEvaluation(true);
    setEvaluationSaveMessage(null);
    try {
      await hiringEvaluationService.saveEvaluation({
        candidateId: userId,
        status: hiringStatus,
        overallRating,
        rubricProblemSolving,
        rubricCodeQuality,
        rubricCommunication,
        rubricArchitecture,
        recommendation,
        notes,
        strengths,
        weaknesses,
        finalComments,
        evaluatedBy: 'admin',
        evaluatorName: 'Platform Administrator',
      });

      const updatedHistory = await hiringEvaluationService.getEvaluationHistory(userId);
      setEvaluationHistory(updatedHistory);
      setEvaluationSaveMessage('Hiring evaluation and audit history successfully recorded!');
      setTimeout(() => setEvaluationSaveMessage(null), 4000);
    } catch (err: any) {
      setEvaluationSaveMessage(`Failed to save evaluation: ${err.message || 'Error'}`);
    } finally {
      setSavingEvaluation(false);
    }
  };

  // Trigger Supabase authenticated password reset
  const handleTriggerPasswordReset = async () => {
    if (!candidateProfile?.email) return;
    setResettingPassword(true);
    setPasswordResetToast(null);
    try {
      const res = await authService.resetPassword(candidateProfile.email);
      if (res.success) {
        setPasswordResetToast(`Password reset link dispatched to ${candidateProfile.email}`);
      } else {
        setPasswordResetToast(`Notice: ${res.message}`);
      }
    } catch (err: any) {
      setPasswordResetToast(`Error initiating password reset: ${err.message || 'Network error'}`);
    } finally {
      setResettingPassword(false);
      setTimeout(() => setPasswordResetToast(null), 6000);
    }
  };

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    attempts.forEach(att => {
      if (att.category) set.add(att.category);
    });
    return Array.from(set);
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    return attempts.filter(att => {
      const matchSearch =
        !historySearchTerm ||
        att.questionTitle.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        att.questionId.toLowerCase().includes(historySearchTerm.toLowerCase());
      const matchCat =
        historyCategoryFilter === 'ALL' || att.category.toUpperCase() === historyCategoryFilter.toUpperCase();
      return matchSearch && matchCat;
    });
  }, [attempts, historySearchTerm, historyCategoryFilter]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [historySearchTerm, historyCategoryFilter]);

  const totalAttemptsCount = filteredAttempts.length;
  const totalPages = Math.max(1, Math.ceil(totalAttemptsCount / pageSize));
  const paginatedAttempts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAttempts.slice(start, start + pageSize);
  }, [filteredAttempts, currentPage, pageSize]);

  const handleSelectAttempt = (att: CodingAttempt) => {
    setSelectedAttempt(att);
    navigate(`/admin/candidates/${userId}/performance/coding/${att.id}`, { replace: true });
  };

  // Dedicated Track Question Grouping & Metrics
  const trackMeta = useMemo(() => {
    if (!activeTrackCategory) return null;
    return getTrackMeta(activeTrackCategory);
  }, [activeTrackCategory]);

  const trackAttempts = useMemo(() => {
    if (!activeTrackCategory) return [];
    return attempts.filter(
      att => att.category?.toUpperCase() === activeTrackCategory.toUpperCase()
    );
  }, [attempts, activeTrackCategory]);

  const trackQuestionRows = useMemo(() => {
    if (!activeTrackCategory) return [];
    const map = new Map<string, CodingAttempt[]>();
    trackAttempts.forEach(att => {
      const qid = att.questionId;
      if (!map.has(qid)) {
        map.set(qid, []);
      }
      map.get(qid)!.push(att);
    });

    const rows: {
      questionId: string;
      questionTitle: string;
      category: string;
      difficulty: string;
      language: string;
      status: string;
      score: number;
      percentage: number;
      durationSeconds: number;
      createdAt: string;
      attemptsCount: number;
      latestAttempt: CodingAttempt;
      bestAttempt: CodingAttempt;
    }[] = [];

    map.forEach((qAttempts, qid) => {
      const sorted = [...qAttempts].sort((a, b) => a.attemptNumber - b.attemptNumber);
      const latest = sorted[sorted.length - 1];
      const hasSolved = sorted.some(a => {
        const s = (a.status || '').toLowerCase();
        return s === 'solved' || s === 'accepted' || (a.score || 0) >= 80;
      });
      const bestScore = Math.max(...sorted.map(a => a.score || 0));
      const bestAttempt = sorted.find(a => (a.score || 0) === bestScore) || latest;
      const totalQDuration = sorted.reduce((acc, a) => acc + (a.durationSeconds || 0), 0);

      rows.push({
        questionId: qid,
        questionTitle: latest.questionTitle || qid,
        category: latest.category || activeTrackCategory || 'CODING',
        difficulty: latest.difficulty || 'Medium',
        language: latest.language || 'javascript',
        status: hasSolved ? 'Solved' : (latest.status || 'Attempted'),
        score: bestScore,
        percentage: bestScore,
        durationSeconds: totalQDuration > 0 ? totalQDuration : (latest.durationSeconds || 0),
        createdAt: latest.createdAt,
        attemptsCount: sorted.length,
        latestAttempt: latest,
        bestAttempt,
      });
    });

    return rows;
  }, [trackAttempts, activeTrackCategory]);

  const filteredTrackQuestions = useMemo(() => {
    return trackQuestionRows.filter(row => {
      const matchSearch =
        !trackSearchTerm ||
        row.questionTitle.toLowerCase().includes(trackSearchTerm.toLowerCase()) ||
        row.questionId.toLowerCase().includes(trackSearchTerm.toLowerCase());

      const matchDiff =
        trackDifficultyFilter === 'ALL' ||
        row.difficulty.toLowerCase() === trackDifficultyFilter.toLowerCase();

      const matchStatus =
        trackStatusFilter === 'ALL' ||
        row.status.toLowerCase() === trackStatusFilter.toLowerCase();

      const matchLang =
        trackLanguageFilter === 'ALL' ||
        row.language.toLowerCase() === trackLanguageFilter.toLowerCase();

      return matchSearch && matchDiff && matchStatus && matchLang;
    }).sort((a, b) => {
      if (trackSortOption === 'score') return b.score - a.score;
      if (trackSortOption === 'attempts') return b.attemptsCount - a.attemptsCount;
      if (trackSortOption === 'title') return a.questionTitle.localeCompare(b.questionTitle);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [trackQuestionRows, trackSearchTerm, trackDifficultyFilter, trackStatusFilter, trackLanguageFilter, trackSortOption]);

  useEffect(() => {
    setTrackPage(1);
  }, [trackSearchTerm, trackDifficultyFilter, trackStatusFilter, trackLanguageFilter, trackSortOption, activeTrackCategory]);

  const trackTotalQuestions = trackQuestionRows.length;
  const trackSolvedQuestions = trackQuestionRows.filter(r => r.status.toLowerCase() === 'solved').length;
  const trackSuccessRate = trackTotalQuestions > 0 ? Math.round((trackSolvedQuestions / trackTotalQuestions) * 100) : 0;
  const trackAvgScore = trackTotalQuestions > 0 ? Math.round(trackQuestionRows.reduce((acc, r) => acc + r.score, 0) / trackTotalQuestions) : 0;
  const trackTotalSubmissions = trackAttempts.length;
  const trackTotalPages = Math.max(1, Math.ceil(filteredTrackQuestions.length / trackPageSize));
  const paginatedTrackQuestions = useMemo(() => {
    const start = (trackPage - 1) * trackPageSize;
    return filteredTrackQuestions.slice(start, start + trackPageSize);
  }, [filteredTrackQuestions, trackPage, trackPageSize]);

  // Daily breakdown filtering
  const filteredDailyActivity = useMemo(() => {
    if (!summary?.dailyActivity) return [];
    if (!dailySearchTerm && dailyCategoryFilter === 'ALL' && dailyStatusFilter === 'ALL') {
      return summary.dailyActivity;
    }

    return summary.dailyActivity
      .map(day => {
        const matchingQuestions = day.questions.filter(q => {
          const matchSearch =
            !dailySearchTerm ||
            q.questionTitle.toLowerCase().includes(dailySearchTerm.toLowerCase()) ||
            q.questionId.toLowerCase().includes(dailySearchTerm.toLowerCase());
          const matchCat =
            dailyCategoryFilter === 'ALL' ||
            q.category?.toUpperCase() === dailyCategoryFilter.toUpperCase();
          const matchStatus =
            dailyStatusFilter === 'ALL' ||
            q.status?.toLowerCase() === dailyStatusFilter.toLowerCase();
          return matchSearch && matchCat && matchStatus;
        });

        return {
          ...day,
          questions: matchingQuestions,
        };
      })
      .filter(day => day.questions.length > 0);
  }, [summary?.dailyActivity, dailySearchTerm, dailyCategoryFilter, dailyStatusFilter]);

  const renderDailyActivityList = () => {
    if (!summary?.dailyActivity || summary.dailyActivity.length === 0) {
      return (
        <div className="admin-perf-empty-state">
          <span className="admin-perf-empty-icon">📅</span>
          <h4>No Daily Activity Records</h4>
          <p>No historical coding submissions recorded for this candidate.</p>
        </div>
      );
    }

    if (filteredDailyActivity.length === 0) {
      return (
        <div className="admin-perf-empty-state">
          <span className="admin-perf-empty-icon">🔍</span>
          <h4>No Matching Daily Problems</h4>
          <p>Try adjusting your search query or filter selections.</p>
        </div>
      );
    }

    return (
      <div className="admin-perf-daily-list">
        {filteredDailyActivity.map((day, dayIdx) => {
          const isExpanded = isDayExpanded(day.date, dayIdx);
          return (
            <div key={day.date} className={`admin-perf-daily-card ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="admin-perf-daily-header"
                onClick={() => toggleDayExpansion(day.date)}
                role="button"
                tabIndex={0}
                title="Click to toggle question details for this day"
              >
                <div className="admin-perf-daily-header-left">
                  <div className="admin-perf-daily-icon">📅</div>
                  <div className="admin-perf-daily-title-wrap">
                    <div className="admin-perf-daily-title-row">
                      <h4 className="admin-perf-daily-date">{day.displayDate}</h4>
                      <span className="admin-perf-daily-dow-badge">{day.dayOfWeek}</span>
                      {dayIdx === 0 && <span className="admin-perf-relative-badge latest">Latest Activity</span>}
                    </div>
                    <div className="admin-perf-daily-time-window">
                      Active Window:{' '}
                      {new Date(day.firstActivityAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}{' '}
                      –{' '}
                      {new Date(day.lastActivityAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      {' '}({day.totalAttempts} submissions across {day.uniqueQuestionsCount} questions)
                    </div>
                  </div>
                </div>

                <div className="admin-perf-daily-header-right">
                  <div className="admin-perf-daily-metric-pill time">
                    <span className="pill-icon">⏱️</span>
                    <span className="pill-val">{day.totalCodingTimeFormatted}</span>
                    <span className="pill-lbl">Time Spent</span>
                  </div>

                  <div className="admin-perf-daily-metric-pill solved">
                    <span className="pill-icon">✅</span>
                    <span className="pill-val">{day.questionsSolvedCount} / {day.uniqueQuestionsCount}</span>
                    <span className="pill-lbl">Solved</span>
                  </div>

                  <div className="admin-perf-daily-metric-pill score">
                    <span className="pill-icon">📊</span>
                    <span className="pill-val">{day.averageScore}%</span>
                    <span className="pill-lbl">Avg Score</span>
                  </div>

                  <div className="admin-perf-daily-metric-pill attempts">
                    <span className="pill-icon">📝</span>
                    <span className="pill-val">{day.totalAttempts}</span>
                    <span className="pill-lbl">Attempts</span>
                  </div>

                  <div className="admin-perf-daily-chevron">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="admin-perf-daily-body">
                  <div className="admin-perf-daily-table-wrap">
                    <table className="admin-perf-table admin-perf-daily-table">
                      <thead>
                        <tr>
                          <th>Problem / ID</th>
                          <th>Category</th>
                          <th>Difficulty</th>
                          <th>Time Spent</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Attempts</th>
                          <th>Submitted At</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.questions.map((q) => (
                          <tr key={`${day.date}-${q.questionId}`}>
                            <td>
                              <div className="admin-perf-q-title-wrap">
                                <span className="admin-perf-q-title">{q.questionTitle}</span>
                                <span className="admin-perf-q-id">{q.questionId}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`admin-perf-track-badge ${
                                q.category === 'MACHINE_CODING' ? 'mc' : q.category === 'DSA' ? 'dsa' : 'cp'
                              }`}>
                                {q.category === 'MACHINE_CODING' ? '⚡ Machine Coding' : q.category === 'DSA' ? '🧠 LeetCode' : '💻 Core Prog'}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-perf-diff-badge ${q.difficulty?.toLowerCase() || 'medium'}`}>
                                {q.difficulty || 'Medium'}
                              </span>
                            </td>
                            <td>
                              <strong className="text-amber" style={{ fontSize: '0.95rem' }}>
                                {q.durationFormatted}
                              </strong>
                            </td>
                            <td>
                              <span className={`admin-perf-status-badge ${q.status.toLowerCase()}`}>
                                {q.status}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: q.score >= 80 ? 'var(--admin-perf-success)' : 'inherit' }}>
                                {q.score}%
                              </strong>
                            </td>
                            <td>
                              <span className="admin-perf-attempts-pill">
                                {q.totalAttemptsOnQuestion} {q.totalAttemptsOnQuestion === 1 ? 'attempt' : 'attempts'}
                              </span>
                            </td>
                            <td>
                              {new Date(q.submittedAt).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="admin-perf-inspect-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectingAttempt(q.attempt);
                                }}
                                title="Open Monaco Code Inspector with test cases"
                              >
                                Inspect Code →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyActivityList = () => {
    if (!summary?.weeklyActivity || summary.weeklyActivity.length === 0) {
      return (
        <div className="admin-perf-empty-state">
          <span className="admin-perf-empty-icon">📆</span>
          <h4>No Weekly Activity Records</h4>
          <p>No historical weekly coding activity found for this candidate.</p>
        </div>
      );
    }

    return (
      <div className="admin-perf-weekly-list">
        {summary.weeklyActivity.map((week, weekIdx) => {
          const isExpanded = isWeekExpanded(week.weekKey, weekIdx);
          return (
            <div key={week.weekKey} className={`admin-perf-weekly-card ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="admin-perf-weekly-header"
                onClick={() => toggleWeekExpansion(week.weekKey)}
                role="button"
                tabIndex={0}
                title="Click to toggle weekly breakdown"
              >
                <div className="admin-perf-daily-header-left">
                  <div className="admin-perf-daily-icon">📆</div>
                  <div className="admin-perf-daily-title-wrap">
                    <div className="admin-perf-daily-title-row">
                      <h4 className="admin-perf-daily-date">{week.displayWeek}</h4>
                      {weekIdx === 0 && <span className="admin-perf-relative-badge latest">Latest Week</span>}
                    </div>
                    <div className="admin-perf-daily-time-window">
                      {week.activeDaysCount} active {week.activeDaysCount === 1 ? 'day' : 'days'} ({week.startDate} – {week.endDate}) · {week.totalAttempts} total submissions
                    </div>
                  </div>
                </div>

                <div className="admin-perf-daily-header-right">
                  <div className="admin-perf-daily-metric-pill time">
                    <span className="pill-icon">⏱️</span>
                    <span className="pill-val">{week.totalCodingTimeFormatted}</span>
                    <span className="pill-lbl">Time Spent</span>
                  </div>

                  <div className="admin-perf-daily-metric-pill solved">
                    <span className="pill-icon">✅</span>
                    <span className="pill-val">{week.questionsSolvedCount} / {week.uniqueQuestionsCount}</span>
                    <span className="pill-lbl">Solved</span>
                  </div>

                  <div className="admin-perf-daily-metric-pill score">
                    <span className="pill-icon">📊</span>
                    <span className="pill-val">{week.averageScore}%</span>
                    <span className="pill-lbl">Avg Score</span>
                  </div>

                  <div className="admin-perf-daily-metric-pill attempts">
                    <span className="pill-icon">📝</span>
                    <span className="pill-val">{week.totalAttempts}</span>
                    <span className="pill-lbl">Submissions</span>
                  </div>

                  <div className="admin-perf-daily-chevron">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="admin-perf-weekly-body">
                  <div className="admin-perf-week-days-summary-grid">
                    {week.days.map((day) => (
                      <div
                        key={day.date}
                        className="admin-perf-week-day-card"
                        onClick={() => toggleDayExpansion(day.date)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="day-card-head">
                          <span className="day-name">{day.dayOfWeek}</span>
                          <span className="day-date">{day.formattedDateShort}</span>
                        </div>
                        <div className="day-time-badge text-amber">{day.totalCodingTimeFormatted}</div>
                        <div className="day-metric-sub">
                          <span>{day.questionsSolvedCount} solved</span>
                          <span>·</span>
                          <span>{day.totalAttempts} attempts</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Render the day cards inside this week */}
                  <div className="admin-perf-week-days-container">
                    {week.days.map((day, dIdx) => {
                      const dayExpanded = isDayExpanded(day.date, dIdx);
                      return (
                        <div key={day.date} className={`admin-perf-daily-card nested ${dayExpanded ? 'expanded' : ''}`}>
                          <div
                            className="admin-perf-daily-header nested-header"
                            onClick={() => toggleDayExpansion(day.date)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="admin-perf-daily-header-left">
                              <div className="admin-perf-daily-title-wrap">
                                <div className="admin-perf-daily-title-row">
                                  <h4 className="admin-perf-daily-date" style={{ fontSize: '0.96rem' }}>{day.displayDate}</h4>
                                  <span className="admin-perf-daily-dow-badge">{day.dayOfWeek}</span>
                                </div>
                              </div>
                            </div>
                            <div className="admin-perf-daily-header-right">
                              <div className="admin-perf-daily-metric-pill time" style={{ padding: '5px 10px' }}>
                                <span className="pill-val" style={{ fontSize: '0.9rem' }}>{day.totalCodingTimeFormatted}</span>
                              </div>
                              <div className="admin-perf-daily-metric-pill solved" style={{ padding: '5px 10px' }}>
                                <span className="pill-val" style={{ fontSize: '0.85rem' }}>{day.questionsSolvedCount} / {day.uniqueQuestionsCount} Solved</span>
                              </div>
                              <div className="admin-perf-daily-chevron">{dayExpanded ? '▲' : '▼'}</div>
                            </div>
                          </div>
                          {dayExpanded && (
                            <div className="admin-perf-daily-body">
                              <div className="admin-perf-daily-table-wrap">
                                <table className="admin-perf-table admin-perf-daily-table">
                                  <thead>
                                    <tr>
                                      <th>Problem / ID</th>
                                      <th>Category</th>
                                      <th>Time Spent</th>
                                      <th>Status</th>
                                      <th>Score</th>
                                      <th>Attempts</th>
                                      <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {day.questions.map((q) => (
                                      <tr key={`${day.date}-${q.questionId}`}>
                                        <td>
                                          <div className="admin-perf-q-title-wrap">
                                            <span className="admin-perf-q-title">{q.questionTitle}</span>
                                            <span className="admin-perf-q-id">{q.questionId}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <span className={`admin-perf-track-badge ${
                                            q.category === 'MACHINE_CODING' ? 'mc' : q.category === 'DSA' ? 'dsa' : 'cp'
                                          }`}>
                                            {q.category === 'MACHINE_CODING' ? '⚡ Machine Coding' : q.category === 'DSA' ? '🧠 LeetCode' : '💻 Core Prog'}
                                          </span>
                                        </td>
                                        <td>
                                          <strong className="text-amber">{q.durationFormatted}</strong>
                                        </td>
                                        <td>
                                          <span className={`admin-perf-status-badge ${q.status.toLowerCase()}`}>{q.status}</span>
                                        </td>
                                        <td>
                                          <strong style={{ color: q.score >= 80 ? 'var(--admin-perf-success)' : 'inherit' }}>{q.score}%</strong>
                                        </td>
                                        <td>
                                          <span className="admin-perf-attempts-pill">{q.totalAttemptsOnQuestion} attempts</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                          <button
                                            type="button"
                                            className="admin-perf-inspect-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setInspectingAttempt(q.attempt);
                                            }}
                                          >
                                            Inspect Code →
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`admin-perf-page ${resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        <div className="admin-perf-loading">
          <div className="admin-perf-spinner" />
          <p>Loading candidate dossier and synchronized historical records...</p>
        </div>
      </div>
    );
  }

  if (!candidateProfile) {
    return (
      <div className={`admin-perf-page ${resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        <div className="admin-perf-error">
          <h2>Candidate Not Found</h2>
          <p>The candidate profile for user ID "{userId}" could not be located.</p>
          <button
            className="admin-perf-btn-primary"
            onClick={() => navigate(isAdmin ? '/admin?tab=candidates' : '/dashboard')}
          >
            {isAdmin ? '← Back to Candidate Directory' : '← Back to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  const basePath = window.location.pathname.startsWith('/admin/users')
    ? `/admin/users/${userId}/performance`
    : window.location.pathname.startsWith('/candidates')
    ? `/candidates/${userId}/performance`
    : `/admin/candidates/${userId}/performance`;

  return (
    <div className={`admin-perf-page ${resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      {/* Top Header & Breadcrumbs */}
      <div className="admin-perf-header">
        <div className="admin-perf-breadcrumb">
          <button
            type="button"
            className="admin-perf-back-btn"
            onClick={() => navigate(isAdmin ? '/admin?tab=candidates' : '/dashboard')}
          >
            {isAdmin ? '← Back to Candidate Management' : '← Back to Dashboard'}
          </button>
          <span className="admin-perf-sep">/</span>
          {activeTrackCategory ? (
            <>
              <button
                type="button"
                className="admin-perf-back-btn"
                onClick={() => navigate(basePath)}
              >
                Candidate Dossier ({candidateProfile.name})
              </button>
              <span className="admin-perf-sep">/</span>
              <span className="admin-perf-current">{trackMeta?.title} Question History</span>
            </>
          ) : (
            <span className="admin-perf-current">Candidate Dossier &amp; Full Performance</span>
          )}
        </div>

        <div className="admin-perf-title-row">
          <div className="admin-perf-user-info">
            <div className="admin-perf-avatar">
              {candidateProfile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="admin-perf-name-badge">
                <h1>{candidateProfile.name}</h1>
                {isAdmin && (
                  <span className={`admin-perf-status-tag status-${hiringStatus.toLowerCase()}`}>
                    {hiringStatus}
                  </span>
                )}
                <span className="admin-perf-role-tag">{candidateProfile.role}</span>
              </div>
              <p className="admin-perf-meta-sub">
                <span>📧 {candidateProfile.email}</span>
                {candidateProfile.targetCompany && <span>🎯 Target: {candidateProfile.targetCompany}</span>}
                {candidateProfile.experienceLevel && <span>💼 {candidateProfile.experienceLevel}</span>}
                <span>🆔 {candidateProfile.id}</span>
              </p>
            </div>
          </div>

          <div className="admin-perf-header-actions">
            {isAdmin && (
              <button
                type="button"
                className="admin-perf-btn-secondary"
                onClick={handleTriggerPasswordReset}
                disabled={resettingPassword}
              >
                {resettingPassword ? 'Sending Link...' : '🔑 Send Password Reset Link'}
              </button>
            )}
            <button
              type="button"
              className="admin-perf-theme-toggle-btn"
              onClick={toggleTheme}
              title={resolvedTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {passwordResetToast && (
          <div className="admin-perf-toast">{passwordResetToast}</div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-perf-nav-tabs">
          <button
            type="button"
            className={`admin-perf-tab ${!activeTrackCategory && activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              navigate(basePath);
              setActiveTab('overview');
            }}
          >
            📊 Performance Scorecard &amp; Metrics
          </button>
          <button
            type="button"
            className={`admin-perf-tab ${activeTrackCategory === 'MACHINE_CODING' ? 'active' : ''}`}
            onClick={() => navigate(`${basePath}/track/machine-coding`)}
          >
            ⚡ Machine Coding ({summary?.categoryStats?.MACHINE_CODING?.questionsAttempted || 0})
          </button>
          <button
            type="button"
            className={`admin-perf-tab ${activeTrackCategory === 'DSA' ? 'active' : ''}`}
            onClick={() => navigate(`${basePath}/track/dsa`)}
          >
            🧠 LeetCode / DSA ({summary?.categoryStats?.DSA?.questionsAttempted || 0})
          </button>
          <button
            type="button"
            className={`admin-perf-tab ${activeTrackCategory === 'CORE_PROGRAMMING' ? 'active' : ''}`}
            onClick={() => navigate(`${basePath}/track/core-programming`)}
          >
            💻 Core Programming ({summary?.categoryStats?.CORE_PROGRAMMING?.questionsAttempted || 0})
          </button>
          <button
            type="button"
            className={`admin-perf-tab ${!activeTrackCategory && activeTab === 'daily-activity' ? 'active' : ''}`}
            onClick={() => {
              navigate(basePath);
              setActiveTab('daily-activity');
            }}
          >
            📅 Daily &amp; Weekly Activity ({summary?.dailyActivity?.length || 0} Days)
          </button>
          {isAdmin && (
            <button
              type="button"
              className={`admin-perf-tab ${!activeTrackCategory && activeTab === 'hiring' ? 'active' : ''}`}
              onClick={() => {
                navigate(basePath);
                setActiveTab('hiring');
              }}
            >
              ⚖️ Hiring Evaluation &amp; Rubric
            </button>
          )}
          <button
            type="button"
            className={`admin-perf-tab ${!activeTrackCategory && activeTab === 'code-history' ? 'active' : ''}`}
            onClick={() => {
              navigate(basePath);
              setActiveTab('code-history');
            }}
          >
            💻 Raw Submission Logs ({attempts.length})
          </button>
        </div>
      </div>

      {/* DEDICATED TRACK QUESTIONS HISTORY VIEW */}
      {activeTrackCategory && trackMeta && (
        <div className="admin-perf-content admin-perf-track-view">
          {/* Track Hero Banner */}
          <div className="admin-perf-track-hero">
            <div className="admin-perf-track-hero-left">
              <div className="admin-perf-track-hero-icon">{trackMeta.icon}</div>
              <div className="admin-perf-track-hero-info">
                <h2>
                  <span>{trackMeta.title}</span>
                  <span className={`admin-perf-track-badge ${trackMeta.badgeClass}`}>
                    {trackMeta.shortTitle}
                  </span>
                </h2>
                <p>{trackMeta.description}</p>
              </div>
            </div>

            <div className="admin-perf-track-switcher">
              <button
                type="button"
                className={`admin-perf-track-switch-btn ${activeTrackCategory === 'MACHINE_CODING' ? 'active' : ''}`}
                onClick={() => navigate(`${basePath}/track/machine-coding`)}
              >
                ⚡ Machine Coding ({summary?.categoryStats?.MACHINE_CODING?.questionsAttempted || 0})
              </button>
              <button
                type="button"
                className={`admin-perf-track-switch-btn ${activeTrackCategory === 'DSA' ? 'active' : ''}`}
                onClick={() => navigate(`${basePath}/track/dsa`)}
              >
                🧠 LeetCode / DSA ({summary?.categoryStats?.DSA?.questionsAttempted || 0})
              </button>
              <button
                type="button"
                className={`admin-perf-track-switch-btn ${activeTrackCategory === 'CORE_PROGRAMMING' ? 'active' : ''}`}
                onClick={() => navigate(`${basePath}/track/core-programming`)}
              >
                💻 Core Programming ({summary?.categoryStats?.CORE_PROGRAMMING?.questionsAttempted || 0})
              </button>
              <button
                type="button"
                className="admin-perf-track-switch-btn dossier-btn"
                onClick={() => navigate(basePath)}
              >
                📊 Scorecard Overview
              </button>
            </div>
          </div>

          {/* Track Metrics KPI Strip */}
          <div className="admin-perf-kpi-grid">
            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Unique Questions Solved</span>
              <span className="admin-perf-kpi-val text-emerald">
                {trackSolvedQuestions}
              </span>
              <span className="admin-perf-kpi-sub">
                out of {trackTotalQuestions} unique attempted
              </span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Track Success Rate</span>
              <span className="admin-perf-kpi-val text-blue">
                {trackTotalQuestions > 0 ? `${trackSuccessRate}%` : 'No activity yet'}
              </span>
              <span className="admin-perf-kpi-sub">solved vs unique attempted</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Total Submissions / Attempts</span>
              <span className="admin-perf-kpi-val text-purple">
                {trackTotalSubmissions}
              </span>
              <span className="admin-perf-kpi-sub">across all {trackTotalQuestions} questions</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Average Score</span>
              <span className="admin-perf-kpi-val text-amber">
                {trackTotalQuestions > 0 ? `${trackAvgScore}%` : '0%'}
              </span>
              <span className="admin-perf-kpi-sub">evaluated execution score</span>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="admin-perf-track-filter-bar">
            <div className="admin-perf-track-filter-inputs">
              <input
                type="text"
                className="admin-perf-track-search"
                placeholder={`Search ${trackMeta.shortTitle} by question title or ID (e.g. JS-P001)...`}
                value={trackSearchTerm}
                onChange={e => setTrackSearchTerm(e.target.value)}
              />
              <select
                className="admin-perf-track-select"
                value={trackDifficultyFilter}
                onChange={e => setTrackDifficultyFilter(e.target.value)}
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                className="admin-perf-track-select"
                value={trackStatusFilter}
                onChange={e => setTrackStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Failed">Failed</option>
              </select>
              <select
                className="admin-perf-track-select"
                value={trackLanguageFilter}
                onChange={e => setTrackLanguageFilter(e.target.value)}
              >
                <option value="ALL">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="react">React</option>
              </select>
              <select
                className="admin-perf-track-select"
                value={trackSortOption}
                onChange={e => setTrackSortOption(e.target.value as any)}
              >
                <option value="latest">Sort: Latest Submission</option>
                <option value="score">Sort: Highest Score</option>
                <option value="attempts">Sort: Most Attempts</option>
                <option value="title">Sort: Question Title (A-Z)</option>
              </select>
            </div>

            {(trackSearchTerm || trackDifficultyFilter !== 'ALL' || trackStatusFilter !== 'ALL' || trackLanguageFilter !== 'ALL') && (
              <button
                type="button"
                className="admin-perf-btn-secondary"
                onClick={() => {
                  setTrackSearchTerm('');
                  setTrackDifficultyFilter('ALL');
                  setTrackStatusFilter('ALL');
                  setTrackLanguageFilter('ALL');
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>

          {/* Questions Table */}
          {filteredTrackQuestions.length === 0 ? (
            <div className="admin-perf-track-table-card">
              <div className="admin-perf-empty-state">
                <div className="admin-perf-empty-icon">{trackMeta.icon}</div>
                <h4>No {trackMeta.title} Questions Found</h4>
                <p>
                  {trackTotalQuestions === 0
                    ? `Candidate ${candidateProfile.name} has not submitted any code for ${trackMeta.title} yet.`
                    : 'No questions matched your current filter criteria.'}
                </p>
                {trackTotalQuestions === 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="admin-perf-btn-primary"
                      onClick={() => navigate(`${basePath}/track/core-programming`)}
                    >
                      View Core Programming ({summary?.categoryStats?.CORE_PROGRAMMING?.questionsAttempted || 0} Questions) →
                    </button>
                    <button
                      type="button"
                      className="admin-perf-btn-secondary"
                      onClick={() => navigate(basePath)}
                    >
                      Return to Scorecard
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="admin-perf-track-table-card">
              <div className="admin-perf-table-responsive">
                <table className="admin-perf-track-table">
                  <thead>
                    <tr>
                      <th style={{ width: '38%' }}>Problem &amp; Identifier</th>
                      <th style={{ width: '10%' }}>Difficulty</th>
                      <th style={{ width: '10%' }}>Status</th>
                      <th style={{ width: '8%' }}>Score</th>
                      <th style={{ width: '10%' }}>Attempts</th>
                      <th style={{ width: '8%' }}>Duration</th>
                      <th style={{ width: '12%' }}>Last Submitted</th>
                      <th style={{ width: '14%', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrackQuestions.map(row => (
                      <tr
                        key={row.questionId}
                        className="admin-perf-track-row"
                        onClick={() => setInspectingAttempt(row.bestAttempt || row.latestAttempt)}
                      >
                        <td>
                          <div className="admin-perf-q-title-wrap">
                            <span className="admin-perf-q-title">{row.questionTitle}</span>
                            <span className="admin-perf-q-id">{row.questionId}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`diff-tag diff-${row.difficulty.toLowerCase()}`}>
                            {row.difficulty}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-perf-status-badge ${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: row.score >= 80 ? 'var(--admin-perf-success)' : 'inherit' }}>
                            {row.score}%
                          </strong>
                        </td>
                        <td>
                          <span className="admin-perf-attempts-pill">
                            {row.attemptsCount} {row.attemptsCount === 1 ? 'attempt' : 'attempts'}
                          </span>
                        </td>
                        <td>
                          {row.durationSeconds > 0
                            ? formatDurationSec(row.durationSeconds)
                            : '—'}
                        </td>
                        <td>
                          {new Date(row.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="admin-perf-inspect-btn"
                            onClick={e => {
                              e.stopPropagation();
                              setInspectingAttempt(row.bestAttempt || row.latestAttempt);
                            }}
                          >
                            Inspect Code →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              {trackTotalPages > 1 && (
                <div className="admin-perf-pagination" style={{ padding: '16px 20px' }}>
                  <button
                    type="button"
                    disabled={trackPage <= 1}
                    onClick={() => setTrackPage(p => Math.max(1, p - 1))}
                    className="admin-perf-page-btn"
                  >
                    ← Prev
                  </button>
                  <span className="admin-perf-page-indicator">
                    Showing {(trackPage - 1) * trackPageSize + 1}–{Math.min(trackPage * trackPageSize, filteredTrackQuestions.length)} of {filteredTrackQuestions.length} Questions (Page {trackPage} of {trackTotalPages})
                  </span>
                  <button
                    type="button"
                    disabled={trackPage >= trackTotalPages}
                    onClick={() => setTrackPage(p => Math.min(trackTotalPages, p + 1))}
                    className="admin-perf-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: OVERVIEW & METRICS */}
      {!activeTrackCategory && activeTab === 'overview' && summary && (
        <div className="admin-perf-content">
          {/* Top 6 Summary KPI Cards */}
          <div className="admin-perf-kpi-grid">
            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Unique Questions Solved</span>
              <span className="admin-perf-kpi-val text-emerald">
                {summary.uniqueSolved}
              </span>
              <span className="admin-perf-kpi-sub">
                out of {summary.uniqueAttempted} unique attempted
              </span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Platform Success Rate</span>
              <span className="admin-perf-kpi-val text-blue">
                {summary.uniqueAttempted > 0 ? `${summary.successRate}%` : 'No activity yet'}
              </span>
              <span className="admin-perf-kpi-sub">solved vs unique attempted</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Total Submissions / Attempts</span>
              <span className="admin-perf-kpi-val text-purple">
                {summary.totalAttempts}
              </span>
              <span className="admin-perf-kpi-sub">across all categories</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Total Coding Time</span>
              <span className="admin-perf-kpi-val text-amber">
                {summary.totalCodingTimeSeconds > 0
                  ? formatDurationSec(summary.totalCodingTimeSeconds)
                  : '0m'}
              </span>
              <span className="admin-perf-kpi-sub">
                across {summary.dailyActivity?.length || 0} active days ({summary.totalAttempts} submissions)
              </span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">AI Video Mock Interviews</span>
              <span className="admin-perf-kpi-val text-cyan">
                {summary.aiMockStats.hasActivity
                  ? `${summary.aiMockStats.completedSessions} Completed`
                  : 'No activity yet'}
              </span>
              <span className="admin-perf-kpi-sub">{summary.aiMockStats.message}</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Mentor Mock Interviews</span>
              <span className="admin-perf-kpi-val text-indigo">
                {summary.mentorMockStats.hasActivity
                  ? `${summary.mentorMockStats.completedSessions} Completed`
                  : 'No activity yet'}
              </span>
              <span className="admin-perf-kpi-sub">{summary.mentorMockStats.message}</span>
            </div>
          </div>

          {/* 5 Track Performance Cards */}
          <h3 className="admin-perf-section-title">Track Performance Breakdown (Real DB Sync)</h3>
          <div className="admin-perf-track-grid">
            {/* Machine Coding */}
            {(() => {
              const mc = summary.categoryStats.MACHINE_CODING;
              return (
                <div
                  className="admin-perf-track-card clickable"
                  onClick={() => navigate(`${basePath}/track/machine-coding`)}
                  role="button"
                  tabIndex={0}
                  title="Click to inspect Machine Level Coding question history"
                >
                  <div className="admin-perf-track-head">
                    <span className="admin-perf-track-badge mc">Machine Level Coding</span>
                    <span className="admin-perf-track-score">
                      {mc.hasActivity ? `${mc.successRate}% Success` : 'No data available'}
                    </span>
                  </div>
                  {mc.hasActivity ? (
                    <div className="admin-perf-track-stats">
                      <div className="admin-perf-track-stat-row">
                        <span>Unique Solved:</span>
                        <strong>{mc.questionsSolved} / {mc.questionsAttempted}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Total Attempts:</span>
                        <strong>{mc.totalAttempts}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Average Score:</span>
                        <strong>{mc.averageScore}%</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-perf-track-empty">
                      <span>ℹ️</span> No Machine Coding activity yet
                    </div>
                  )}
                  <div className="admin-perf-track-action-footer">
                    <span className="admin-perf-track-link">
                      Inspect Question History ({mc.questionsAttempted} {mc.questionsAttempted === 1 ? 'question' : 'questions'}) →
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* LeetCode / DSA */}
            {(() => {
              const dsa = summary.categoryStats.DSA;
              return (
                <div
                  className="admin-perf-track-card clickable"
                  onClick={() => navigate(`${basePath}/track/dsa`)}
                  role="button"
                  tabIndex={0}
                  title="Click to inspect LeetCode / DSA question history"
                >
                  <div className="admin-perf-track-head">
                    <span className="admin-perf-track-badge dsa">LeetCode / DSA</span>
                    <span className="admin-perf-track-score">
                      {dsa.hasActivity ? `${dsa.successRate}% Success` : 'No data available'}
                    </span>
                  </div>
                  {dsa.hasActivity ? (
                    <div className="admin-perf-track-stats">
                      <div className="admin-perf-track-stat-row">
                        <span>Unique Solved:</span>
                        <strong>{dsa.questionsSolved} / {dsa.questionsAttempted}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Total Attempts:</span>
                        <strong>{dsa.totalAttempts}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Average Score:</span>
                        <strong>{dsa.averageScore}%</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-perf-track-empty">
                      <span>ℹ️</span> No LeetCode / DSA activity yet
                    </div>
                  )}
                  <div className="admin-perf-track-action-footer">
                    <span className="admin-perf-track-link">
                      Inspect Question History ({dsa.questionsAttempted} {dsa.questionsAttempted === 1 ? 'question' : 'questions'}) →
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Core Programming */}
            {(() => {
              const cp = summary.categoryStats.CORE_PROGRAMMING;
              return (
                <div
                  className="admin-perf-track-card clickable"
                  onClick={() => navigate(`${basePath}/track/core-programming`)}
                  role="button"
                  tabIndex={0}
                  title="Click to inspect Core Programming question history"
                >
                  <div className="admin-perf-track-head">
                    <span className="admin-perf-track-badge cp">Core Programming</span>
                    <span className="admin-perf-track-score">
                      {cp.hasActivity ? `${cp.successRate}% Success` : 'No data available'}
                    </span>
                  </div>
                  {cp.hasActivity ? (
                    <div className="admin-perf-track-stats">
                      <div className="admin-perf-track-stat-row">
                        <span>Unique Solved:</span>
                        <strong>{cp.questionsSolved} / {cp.questionsAttempted}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Total Attempts:</span>
                        <strong>{cp.totalAttempts}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Average Score:</span>
                        <strong>{cp.averageScore}%</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-perf-track-empty">
                      <span>ℹ️</span> No Core Programming activity yet
                    </div>
                  )}
                  <div className="admin-perf-track-action-footer">
                    <span className="admin-perf-track-link">
                      Inspect Question History ({cp.questionsAttempted} {cp.questionsAttempted === 1 ? 'question' : 'questions'}) →
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Dynamic / Custom Tracks if any */}
            {Object.entries(summary.categoryStats)
              .filter(([key]) => !['MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING'].includes(key))
              .map(([key, stat]) => (
                <div key={key} className="admin-perf-track-card">
                  <div className="admin-perf-track-head">
                    <span className="admin-perf-track-badge custom">{stat.categoryName}</span>
                    <span className="admin-perf-track-score">
                      {stat.hasActivity ? `${stat.successRate}% Success` : 'No data available'}
                    </span>
                  </div>
                  {stat.hasActivity ? (
                    <div className="admin-perf-track-stats">
                      <div className="admin-perf-track-stat-row">
                        <span>Unique Solved:</span>
                        <strong>{stat.questionsSolved} / {stat.questionsAttempted}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Total Attempts:</span>
                        <strong>{stat.totalAttempts}</strong>
                      </div>
                      <div className="admin-perf-track-stat-row">
                        <span>Average Score:</span>
                        <strong>{stat.averageScore}%</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-perf-track-empty">
                      <span>ℹ️</span> No {stat.categoryName} activity yet
                    </div>
                  )}
                </div>
              ))}

            {/* AI Mock */}
            <div className="admin-perf-track-card">
              <div className="admin-perf-track-head">
                <span className="admin-perf-track-badge ai">AI Video Mock Interview</span>
                <span className="admin-perf-track-score">
                  {summary.aiMockStats.hasActivity
                    ? `${summary.aiMockStats.averageScore} Avg Score`
                    : 'No data available'}
                </span>
              </div>
              {summary.aiMockStats.hasActivity ? (
                <div className="admin-perf-track-stats">
                  <div className="admin-perf-track-stat-row">
                    <span>Total Sessions:</span>
                    <strong>{summary.aiMockStats.totalSessions}</strong>
                  </div>
                  <div className="admin-perf-track-stat-row">
                    <span>Highest Score:</span>
                    <strong>{summary.aiMockStats.highestScore}</strong>
                  </div>
                  {summary.aiMockStats.improvementPercentage !== null && (
                    <div className="admin-perf-track-stat-row">
                      <span>Improvement:</span>
                      <strong className="text-emerald">
                        {summary.aiMockStats.improvementPercentage > 0 ? '+' : ''}
                        {summary.aiMockStats.improvementPercentage}%
                      </strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-perf-track-empty">
                  <span>ℹ️</span> No AI Mock history yet
                </div>
              )}
            </div>

            {/* Mentor Mock */}
            <div className="admin-perf-track-card">
              <div className="admin-perf-track-head">
                <span className="admin-perf-track-badge mentor">Mentor Mock Interview</span>
                <span className="admin-perf-track-score">
                  {summary.mentorMockStats.hasActivity
                    ? `${summary.mentorMockStats.averageScore} Avg Score`
                    : 'No data available'}
                </span>
              </div>
              {summary.mentorMockStats.hasActivity ? (
                <div className="admin-perf-track-stats">
                  <div className="admin-perf-track-stat-row">
                    <span>Total Sessions:</span>
                    <strong>{summary.mentorMockStats.totalSessions}</strong>
                  </div>
                </div>
              ) : (
                <div className="admin-perf-track-empty">
                  <span>ℹ️</span> No Mentor Mock history yet
                </div>
              )}
            </div>
          </div>

          {/* Daily Activity & Time Log Section */}
          <div className="admin-perf-daily-section" style={{ marginTop: '36px' }}>
            <div className="admin-perf-section-header-flex">
              <div>
                <h3 className="admin-perf-section-title" style={{ marginBottom: '4px' }}>
                  {timeViewMode === 'daily' ? '📅 Daily Activity & Time Log' : '📆 Weekly Activity & Time Log'} ({timeViewMode === 'daily' ? `${summary.dailyActivity?.length || 0} Active Days` : `${summary.weeklyActivity?.length || 0} Calendar Weeks`} · {formatDurationSec(summary.totalCodingTimeSeconds)})
                </h3>
                <p className="admin-perf-section-subtitle">
                  Audited {timeViewMode === 'daily' ? 'day-by-day' : 'week-by-week'} active coding time, questions attempted and solved, and direct code inspection for each problem.
                </p>
              </div>
              <div className="admin-perf-section-actions">
                <div className="admin-perf-time-toggle-group">
                  <button
                    type="button"
                    className={`admin-perf-time-toggle-btn ${timeViewMode === 'daily' ? 'active' : ''}`}
                    onClick={() => setTimeViewMode('daily')}
                  >
                    📅 Daily-wise ({summary.dailyActivity?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`admin-perf-time-toggle-btn ${timeViewMode === 'weekly' ? 'active' : ''}`}
                    onClick={() => setTimeViewMode('weekly')}
                  >
                    📆 Weekly-wise ({summary.weeklyActivity?.length || 0})
                  </button>
                </div>
                <button
                  type="button"
                  className="admin-perf-btn-secondary"
                  onClick={handleExpandAllDays}
                  style={{ marginRight: '8px' }}
                >
                  Expand All
                </button>
                <button
                  type="button"
                  className="admin-perf-btn-secondary"
                  onClick={handleCollapseAllDays}
                >
                  Collapse All
                </button>
              </div>
            </div>

            {timeViewMode === 'daily' ? renderDailyActivityList() : renderWeeklyActivityList()}
          </div>
        </div>
      )}

      {/* DEDICATED TAB: DAILY ACTIVITY & TIME BREAKDOWN */}
      {!activeTrackCategory && activeTab === 'daily-activity' && summary && (
        <div className="admin-perf-content admin-perf-daily-tab-content">
          {/* Daily Hero Banner */}
          <div className="admin-perf-track-hero">
            <div className="admin-perf-track-hero-left">
              <div className="admin-perf-track-hero-icon">{timeViewMode === 'daily' ? '📅' : '📆'}</div>
              <div className="admin-perf-track-hero-info">
                <h2>
                  <span>{timeViewMode === 'daily' ? 'Daily Activity & Time Log' : 'Weekly Activity & Time Log'}</span>
                  <span className="admin-perf-track-badge latest">
                    {timeViewMode === 'daily' ? `${summary.dailyActivity?.length || 0} Days Recorded` : `${summary.weeklyActivity?.length || 0} Weeks Recorded`}
                  </span>
                </h2>
                <p>
                  Comprehensive {timeViewMode === 'daily' ? 'day-by-day' : 'week-by-week'} breakdown of candidate time investment, problems worked on, submission attempts, and evaluated code.
                </p>
              </div>
            </div>

            <div className="admin-perf-section-actions">
              <div className="admin-perf-time-toggle-group">
                <button
                  type="button"
                  className={`admin-perf-time-toggle-btn ${timeViewMode === 'daily' ? 'active' : ''}`}
                  onClick={() => setTimeViewMode('daily')}
                >
                  📅 Daily-wise ({summary.dailyActivity?.length || 0} Days)
                </button>
                <button
                  type="button"
                  className={`admin-perf-time-toggle-btn ${timeViewMode === 'weekly' ? 'active' : ''}`}
                  onClick={() => setTimeViewMode('weekly')}
                >
                  📆 Weekly-wise ({summary.weeklyActivity?.length || 0} Weeks)
                </button>
              </div>
              <button
                type="button"
                className="admin-perf-btn-secondary"
                onClick={handleExpandAllDays}
                style={{ marginRight: '8px' }}
              >
                Expand All
              </button>
              <button
                type="button"
                className="admin-perf-btn-secondary"
                onClick={handleCollapseAllDays}
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Daily KPI Strip */}
          <div className="admin-perf-kpi-grid">
            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Total Time Invested</span>
              <span className="admin-perf-kpi-val text-amber">
                {formatDurationSec(summary.totalCodingTimeSeconds)}
              </span>
              <span className="admin-perf-kpi-sub">across {summary.dailyActivity?.length || 0} active days</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">{timeViewMode === 'daily' ? 'Active Days' : 'Calendar Weeks'}</span>
              <span className="admin-perf-kpi-val text-blue">
                {timeViewMode === 'daily' ? `${summary.dailyActivity?.length || 0} Days` : `${summary.weeklyActivity?.length || 0} Weeks`}
              </span>
              <span className="admin-perf-kpi-sub">
                {timeViewMode === 'daily'
                  ? `Avg ${formatDurationSec(Math.round(summary.totalCodingTimeSeconds / (summary.dailyActivity?.length || 1)))} / day`
                  : `Avg ${formatDurationSec(Math.round(summary.totalCodingTimeSeconds / (summary.weeklyActivity?.length || 1)))} / week`}
              </span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Total Unique Solved</span>
              <span className="admin-perf-kpi-val text-emerald">
                {summary.uniqueSolved}
              </span>
              <span className="admin-perf-kpi-sub">out of {summary.uniqueAttempted} unique attempted</span>
            </div>

            <div className="admin-perf-kpi-card">
              <span className="admin-perf-kpi-label">Total Submissions</span>
              <span className="admin-perf-kpi-val text-purple">
                {summary.totalAttempts}
              </span>
              <span className="admin-perf-kpi-sub">evaluated execution attempts</span>
            </div>
          </div>

          {/* Daily Filter Bar (in daily mode) */}
          {timeViewMode === 'daily' && (
            <div className="admin-perf-track-filter-bar" style={{ marginBottom: '20px' }}>
              <div className="admin-perf-track-filter-inputs">
                <input
                  type="text"
                  className="admin-perf-track-search"
                  placeholder="Search daily questions by title or problem ID (e.g. JS-P030, Q001)..."
                  value={dailySearchTerm}
                  onChange={e => setDailySearchTerm(e.target.value)}
                />
                <select
                  className="admin-perf-track-select"
                  value={dailyCategoryFilter}
                  onChange={e => setDailyCategoryFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  <option value="MACHINE_CODING">⚡ Machine Coding</option>
                  <option value="DSA">🧠 LeetCode / DSA</option>
                  <option value="CORE_PROGRAMMING">💻 Core Programming</option>
                </select>
                <select
                  className="admin-perf-track-select"
                  value={dailyStatusFilter}
                  onChange={e => setDailyStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Solved">✅ Solved Only</option>
                  <option value="Attempted">⏳ Attempted / In Progress</option>
                </select>
              </div>
            </div>
          )}

          {/* Daily Activity List */}
          {timeViewMode === 'daily' ? renderDailyActivityList() : renderWeeklyActivityList()}
        </div>
      )}

      {/* TAB 2: HIRING EVALUATION & RUBRIC */}
      {isAdmin && !activeTrackCategory && activeTab === 'hiring' && (
        <div className="admin-perf-content">
          <div className="admin-perf-evaluation-layout">
            <form onSubmit={handleSaveEvaluation} className="admin-perf-eval-form">
              <div className="admin-perf-form-section">
                <h3>⚖️ Official Hiring Recommendation</h3>
                <p className="admin-perf-section-desc">
                  Set candidate verdict. All changes are written to the durable audit trail and strictly protected from student access.
                </p>

                <div className="admin-perf-status-selector">
                  {(['Hire', 'Consider', 'Reject', 'Pending'] as HiringStatus[]).map(status => (
                    <button
                      key={status}
                      type="button"
                      className={`admin-perf-verdict-btn verdict-${status.toLowerCase()} ${hiringStatus === status ? 'active' : ''}`}
                      onClick={() => setHiringStatus(status)}
                    >
                      {status === 'Hire' && '✅ Hire'}
                      {status === 'Consider' && '🟡 Consider'}
                      {status === 'Reject' && '❌ Reject'}
                      {status === 'Pending' && '⏳ Pending'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-perf-form-section">
                <h3>⭐ Structured Evaluation Rubric (1 - 5 Scale)</h3>
                <div className="admin-perf-rubric-grid">
                  <div className="admin-perf-rubric-item">
                    <label>Overall Technical Competency: {overallRating} / 5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={overallRating}
                      onChange={e => setOverallRating(Number(e.target.value))}
                    />
                  </div>

                  <div className="admin-perf-rubric-item">
                    <label>Problem Solving &amp; Algorithmic Thinking: {rubricProblemSolving} / 5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={rubricProblemSolving}
                      onChange={e => setRubricProblemSolving(Number(e.target.value))}
                    />
                  </div>

                  <div className="admin-perf-rubric-item">
                    <label>Code Quality, Cleanliness &amp; Robustness: {rubricCodeQuality} / 5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={rubricCodeQuality}
                      onChange={e => setRubricCodeQuality(Number(e.target.value))}
                    />
                  </div>

                  <div className="admin-perf-rubric-item">
                    <label>Software Architecture &amp; System Design: {rubricArchitecture} / 5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={rubricArchitecture}
                      onChange={e => setRubricArchitecture(Number(e.target.value))}
                    />
                  </div>

                  <div className="admin-perf-rubric-item">
                    <label>Technical Communication &amp; Articulation: {rubricCommunication} / 5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={rubricCommunication}
                      onChange={e => setRubricCommunication(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-perf-form-section">
                <h3>📝 Evaluator Assessment Notes</h3>
                <div className="admin-perf-input-group">
                  <label>Executive Recommendation / Summary</label>
                  <input
                    type="text"
                    placeholder="e.g., Strongly recommend for Senior Frontend position"
                    value={recommendation}
                    onChange={e => setRecommendation(e.target.value)}
                  />
                </div>

                <div className="admin-perf-notes-grid">
                  <div className="admin-perf-input-group">
                    <label>Key Technical Strengths</label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Strong grasp of closure mechanisms, exceptional async error handling"
                      value={strengths}
                      onChange={e => setStrengths(e.target.value)}
                    />
                  </div>

                  <div className="admin-perf-input-group">
                    <label>Identified Weaknesses / Gaps</label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Needs more practice with dynamic programming memoization"
                      value={weaknesses}
                      onChange={e => setWeaknesses(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-perf-input-group">
                  <label>Internal Technical Interview Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed interview observations, code walk assessment, questions asked..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <div className="admin-perf-input-group">
                  <label>Final Hiring Decision Justification &amp; Leveling</label>
                  <textarea
                    rows={3}
                    placeholder="Salary band recommendation, team placement, seniority level justification..."
                    value={finalComments}
                    onChange={e => setFinalComments(e.target.value)}
                  />
                </div>
              </div>

              {evaluationSaveMessage && (
                <div
                  className={`admin-perf-save-banner ${
                    evaluationSaveMessage.includes('Failed') ? 'error' : 'success'
                  }`}
                >
                  {evaluationSaveMessage}
                </div>
              )}

              <div className="admin-perf-form-actions">
                <button
                  type="submit"
                  disabled={savingEvaluation}
                  className="admin-perf-btn-primary"
                >
                  {savingEvaluation ? 'Saving Assessment...' : '💾 Persist Hiring Evaluation to Audit Log'}
                </button>
              </div>
            </form>

            {/* Preserved Evaluation Audit History */}
            <div className="admin-perf-audit-sidebar">
              <h3>📜 Evaluation Audit History</h3>
              <p className="admin-perf-section-desc">
                Preserves all prior ratings and decisions. Nothing is erased.
              </p>

              {evaluationHistory.length === 0 ? (
                <div className="admin-perf-audit-empty">
                  No previous evaluations recorded for this candidate.
                </div>
              ) : (
                <div className="admin-perf-audit-list">
                  {evaluationHistory.map(item => (
                    <div key={item.id} className="admin-perf-audit-card">
                      <div className="admin-perf-audit-head">
                        <span className={`admin-perf-status-tag status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                        <span className="admin-perf-audit-rating">⭐ {item.overallRating}/5</span>
                      </div>
                      <p className="admin-perf-audit-rec">
                        {item.recommendation || 'No recommendation specified'}
                      </p>
                      {item.notes && (
                        <p className="admin-perf-audit-notes">"{item.notes}"</p>
                      )}
                      <div className="admin-perf-audit-foot">
                        <span>By {item.evaluatorName || item.evaluatedBy || 'Admin'}</span>
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE CODE HISTORY */}
      {!activeTrackCategory && activeTab === 'code-history' && (
        <div className="admin-perf-content">
          <div className="admin-perf-code-layout">
            {/* Left list of attempts */}
            <div className="admin-perf-code-sidebar">
              <div className="admin-perf-code-filter-row">
                <input
                  type="text"
                  placeholder="Filter question title/id..."
                  value={historySearchTerm}
                  onChange={e => setHistorySearchTerm(e.target.value)}
                  className="admin-perf-search-input"
                />
                <select
                  value={historyCategoryFilter}
                  onChange={e => setHistoryCategoryFilter(e.target.value)}
                  className="admin-perf-filter-select"
                >
                  <option value="ALL">All Tracks</option>
                  <option value="MACHINE_CODING">Machine Coding</option>
                  <option value="DSA">LeetCode / DSA</option>
                  <option value="CORE_PROGRAMMING">Core Programming</option>
                  {availableCategories
                    .filter(cat => !['MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING'].includes(cat))
                    .map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, ' ')}
                      </option>
                    ))}
                </select>
              </div>

              <div className="admin-perf-count-bar">
                <span>
                  Showing {totalAttemptsCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, totalAttemptsCount)} of {totalAttemptsCount} attempts
                </span>
              </div>

              <div className="admin-perf-attempt-list">
                {paginatedAttempts.length === 0 ? (
                  <div className="admin-perf-empty-attempts">
                    No attempts found matching criteria.
                  </div>
                ) : (
                  paginatedAttempts.map(att => (
                    <div
                      key={att.id}
                      className={`admin-perf-attempt-item ${selectedAttempt?.id === att.id ? 'active' : ''}`}
                      onClick={() => handleSelectAttempt(att)}
                    >
                      <div className="admin-perf-attempt-item-top">
                        <span className="admin-perf-attempt-qid">{att.questionId}</span>
                        <span className={`admin-perf-status-badge ${att.status.toLowerCase()}`}>
                          {att.status}
                        </span>
                      </div>
                      <div className="admin-perf-attempt-title">{att.questionTitle}</div>
                      <div className="admin-perf-attempt-meta">
                        <span>Attempt #{att.attemptNumber}</span>
                        <span>{att.category}</span>
                        <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="admin-perf-pagination">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="admin-perf-page-btn"
                  >
                    ← Prev
                  </button>
                  <span className="admin-perf-page-indicator">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="admin-perf-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Right Monaco Code Inspector */}
            <div className="admin-perf-code-viewer-panel">
              {selectedAttempt ? (
                <div className="admin-perf-editor-container">
                  <div className="admin-perf-editor-head">
                    <div>
                      <h2>
                        {selectedAttempt.questionId}: {selectedAttempt.questionTitle}
                      </h2>
                      <p className="admin-perf-editor-sub">
                        <span>Attempt #{selectedAttempt.attemptNumber}</span>
                        <span>Language: {selectedAttempt.language}</span>
                        <span>Score: {selectedAttempt.score}%</span>
                        {selectedAttempt.durationSeconds > 0 && (
                          <span>Duration: {selectedAttempt.durationSeconds}s</span>
                        )}
                        <span>Submitted: {new Date(selectedAttempt.createdAt).toLocaleString()}</span>
                      </p>
                    </div>
                    <span className={`admin-perf-status-badge large ${selectedAttempt.status.toLowerCase()}`}>
                      {selectedAttempt.status}
                    </span>
                  </div>

                  <div className="admin-perf-monaco-wrap">
                    <Editor
                      height="460px"
                      language={
                        selectedAttempt.language === 'react' || selectedAttempt.language === 'typescript'
                          ? 'typescript'
                          : 'javascript'
                      }
                      value={selectedAttempt.code || '// No code recorded for this attempt.'}
                      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 13,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on',
                      }}
                    />
                  </div>

                  {/* Test case feedback */}
                  <div className="admin-perf-test-feedback">
                    {selectedAttempt.testCasesPassed !== null && selectedAttempt.totalTestCases !== null && (
                      <div className="admin-perf-feedback-row">
                        <strong>Test Cases Passed:</strong>{' '}
                        <span>
                          {selectedAttempt.testCasesPassed} / {selectedAttempt.totalTestCases}
                        </span>
                      </div>
                    )}
                    {selectedAttempt.executionResult && (
                      <div className="admin-perf-feedback-row">
                        <strong>Execution Result:</strong>{' '}
                        <span>{selectedAttempt.executionResult}</span>
                      </div>
                    )}
                    {selectedAttempt.errorMessage && (
                      <div className="admin-perf-feedback-row error">
                        <strong>Runtime Error:</strong>{' '}
                        <pre>{selectedAttempt.errorMessage}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="admin-perf-no-selection">
                  <p>Select an attempt from the left panel to inspect the submitted code in Monaco.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question History Detail Modal (Monaco Code Inspector) */}
      {inspectingAttempt && (
        <QuestionHistoryDetailModal
          attempt={inspectingAttempt}
          userId={userId!}
          onClose={() => setInspectingAttempt(null)}
        />
      )}
    </div>
  );
}
