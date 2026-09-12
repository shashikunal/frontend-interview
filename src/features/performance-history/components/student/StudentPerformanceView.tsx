import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { codingHistoryService } from '../../services/codingHistoryService';
import type { CodingAttempt, UserPerformanceSummary } from '../../types/history.types';
import QuestionHistoryDetailModal from './QuestionHistoryDetailModal';
import './StudentPerformanceView.css';

interface StudentPerformanceViewProps {
  userId?: string;
  isReadOnly?: boolean;
}

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

export default function StudentPerformanceView({ userId: propUserId }: StudentPerformanceViewProps) {
  const { user } = useAuth();
  const effectiveUserId = propUserId || user?.id || 'guest_student';

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<UserPerformanceSummary | null>(null);
  const [attempts, setAttempts] = useState<CodingAttempt[]>([]);

  // Navigation & Track Selection State
  const [activeTrackCategory, setActiveTrackCategory] = useState<string | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'overview' | 'table' | 'daily' | 'weekly' | 'timeline'>('overview');

  // Dedicated Track Filter & Pagination State
  const [trackSearchTerm, setTrackSearchTerm] = useState('');
  const [trackDifficultyFilter, setTrackDifficultyFilter] = useState('ALL');
  const [trackStatusFilter, setTrackStatusFilter] = useState('ALL');
  const [trackPage, setTrackPage] = useState(1);
  const [trackPageSize, setTrackPageSize] = useState(15);

  // Daily & Weekly Expansion State
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  // Daily Search & Filter State
  const [dailySearchTerm, setDailySearchTerm] = useState('');
  const [dailyCategoryFilter, setDailyCategoryFilter] = useState('ALL');
  const [dailyStatusFilter, setDailyStatusFilter] = useState('ALL');

  // Timeline Search & Filter State
  const [timelineSearchTerm, setTimelineSearchTerm] = useState('');
  const [timelineCategoryFilter, setTimelineCategoryFilter] = useState('ALL');
  const [timelineStatusFilter, setTimelineStatusFilter] = useState('ALL');

  // Question History Table Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');

  // Detail Modal State
  const [selectedAttempt, setSelectedAttempt] = useState<CodingAttempt | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [sum, history] = await Promise.all([
          codingHistoryService.getUserPerformanceSummary(effectiveUserId),
          codingHistoryService.getUserCodingHistory(effectiveUserId),
        ]);
        if (isMounted) {
          setSummary(sum);
          setAttempts(history);
        }
      } catch (err) {
        console.warn('[StudentPerformanceView] Error loading data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [effectiveUserId]);

  const toggleDayExpansion = (date: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: prev[date] === undefined ? false : !prev[date],
    }));
  };

  const isDayExpanded = (date: string, index: number) => {
    if (expandedDays[date] !== undefined) return expandedDays[date];
    return index < 3;
  };

  const toggleWeekExpansion = (weekKey: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekKey]: prev[weekKey] === undefined ? false : !prev[weekKey],
    }));
  };

  const isWeekExpanded = (weekKey: string, index: number) => {
    if (expandedWeeks[weekKey] !== undefined) return expandedWeeks[weekKey];
    return index < 2;
  };

  const handleExpandAll = () => {
    if (summary?.dailyActivity) {
      const nextD: Record<string, boolean> = {};
      summary.dailyActivity.forEach(d => { nextD[d.date] = true; });
      setExpandedDays(nextD);
    }
    if (summary?.weeklyActivity) {
      const nextW: Record<string, boolean> = {};
      summary.weeklyActivity.forEach(w => { nextW[w.weekKey] = true; });
      setExpandedWeeks(nextW);
    }
  };

  const handleCollapseAll = () => {
    if (summary?.dailyActivity) {
      const nextD: Record<string, boolean> = {};
      summary.dailyActivity.forEach(d => { nextD[d.date] = false; });
      setExpandedDays(nextD);
    }
    if (summary?.weeklyActivity) {
      const nextW: Record<string, boolean> = {};
      summary.weeklyActivity.forEach(w => { nextW[w.weekKey] = false; });
      setExpandedWeeks(nextW);
    }
  };

  // Distinct questions list with true latest attempt representation
  const questionRows = useMemo(() => {
    const qMap = new Map<string, CodingAttempt[]>();
    attempts.forEach(att => {
      const qid = att.questionId;
      if (!qMap.has(qid)) {
        qMap.set(qid, []);
      }
      qMap.get(qid)!.push(att);
    });

    const rows: Array<CodingAttempt & { attemptsCount: number }> = [];
    qMap.forEach(attemptsForQ => {
      attemptsForQ.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      attemptsForQ.forEach((att, idx) => {
        att.attemptNumber = idx + 1;
      });
      const latest = attemptsForQ[attemptsForQ.length - 1];
      rows.push({
        ...latest,
        attemptsCount: attemptsForQ.length,
      });
    });

    return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [attempts]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    attempts.forEach(att => {
      if (att.category) set.add(att.category);
    });
    return Array.from(set);
  }, [attempts]);

  // Filtered Questions for Question History Table
  const filteredQuestionRows = useMemo(() => {
    return questionRows.filter(row => {
      const searchMatch =
        !searchTerm ||
        row.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.questionId.toLowerCase().includes(searchTerm.toLowerCase());

      const catMatch =
        categoryFilter === 'ALL' ||
        row.category.toUpperCase() === categoryFilter.toUpperCase();

      const diffMatch =
        difficultyFilter === 'ALL' ||
        row.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      const statusMatch =
        statusFilter === 'ALL' ||
        row.status.toLowerCase() === statusFilter.toLowerCase();

      const langMatch =
        languageFilter === 'ALL' ||
        row.language.toLowerCase() === languageFilter.toLowerCase();

      return searchMatch && catMatch && diffMatch && statusMatch && langMatch;
    });
  }, [questionRows, searchTerm, categoryFilter, difficultyFilter, statusFilter, languageFilter]);

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

    return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      return matchSearch && matchDiff && matchStatus;
    });
  }, [trackQuestionRows, trackSearchTerm, trackDifficultyFilter, trackStatusFilter]);

  const trackTotalQuestions = trackQuestionRows.length;
  const trackSolvedQuestions = trackQuestionRows.filter(q => q.status.toLowerCase() === 'solved').length;
  const trackTotalSubmissions = trackAttempts.length;
  const trackSuccessRate = trackTotalQuestions > 0 ? Math.round((trackSolvedQuestions / trackTotalQuestions) * 100) : 0;
  const trackAvgScore = trackTotalQuestions > 0 ? Math.round(trackQuestionRows.reduce((acc, q) => acc + q.score, 0) / trackTotalQuestions) : 0;

  const trackTotalPages = Math.max(1, Math.ceil(filteredTrackQuestions.length / trackPageSize));
  const paginatedTrackQuestions = useMemo(() => {
    const start = (trackPage - 1) * trackPageSize;
    return filteredTrackQuestions.slice(start, start + trackPageSize);
  }, [filteredTrackQuestions, trackPage, trackPageSize]);

  // Dynamically Filtered Daily Activity
  const filteredDailyActivity = useMemo(() => {
    if (!summary?.dailyActivity) return [];
    return summary.dailyActivity.map(day => {
      const filteredQuestions = day.questions.filter(q => {
        const matchSearch = !dailySearchTerm ||
          q.questionTitle.toLowerCase().includes(dailySearchTerm.toLowerCase()) ||
          q.questionId.toLowerCase().includes(dailySearchTerm.toLowerCase());
        const matchCat = dailyCategoryFilter === 'ALL' || q.category.toUpperCase() === dailyCategoryFilter.toUpperCase();
        const matchStat = dailyStatusFilter === 'ALL' || q.status.toLowerCase() === dailyStatusFilter.toLowerCase();
        return matchSearch && matchCat && matchStat;
      });
      return {
        ...day,
        questions: filteredQuestions,
      };
    }).filter(day => {
      if (dailySearchTerm || dailyCategoryFilter !== 'ALL' || dailyStatusFilter !== 'ALL') {
        return day.questions.length > 0;
      }
      return true;
    });
  }, [summary?.dailyActivity, dailySearchTerm, dailyCategoryFilter, dailyStatusFilter]);

  // Dynamically Filtered Timeline Log
  const filteredTimelineAttempts = useMemo(() => {
    return attempts.filter(att => {
      const matchSearch = !timelineSearchTerm ||
        att.questionTitle.toLowerCase().includes(timelineSearchTerm.toLowerCase()) ||
        att.questionId.toLowerCase().includes(timelineSearchTerm.toLowerCase());
      const matchCat = timelineCategoryFilter === 'ALL' || att.category.toUpperCase() === timelineCategoryFilter.toUpperCase();
      const matchStat = timelineStatusFilter === 'ALL' || att.status.toLowerCase() === timelineStatusFilter.toLowerCase();
      return matchSearch && matchCat && matchStat;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [attempts, timelineSearchTerm, timelineCategoryFilter, timelineStatusFilter]);

  const timelineGroups = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const today: CodingAttempt[] = [];
    const yesterday: CodingAttempt[] = [];
    const thisWeek: CodingAttempt[] = [];
    const older: CodingAttempt[] = [];

    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    filteredTimelineAttempts.forEach(att => {
      const attDate = new Date(att.createdAt);
      const attDateStr = att.createdAt ? att.createdAt.split('T')[0] : '';
      if (attDateStr === todayStr) {
        today.push(att);
      } else if (attDateStr === yesterdayStr) {
        yesterday.push(att);
      } else if (attDate >= weekAgo) {
        thisWeek.push(att);
      } else {
        older.push(att);
      }
    });

    return { today, yesterday, thisWeek, older };
  }, [filteredTimelineAttempts]);

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'solved' || s === 'accepted') return <span className="perf-tag tag-solved">Solved</span>;
    if (s === 'partial') return <span className="perf-tag tag-partial">Partial</span>;
    if (s === 'failed') return <span className="perf-tag tag-failed">Failed</span>;
    return <span className="perf-tag tag-attempted">Attempted</span>;
  };

  const getCategoryBadge = (cat: string) => {
    const c = (cat || '').toUpperCase();
    if (c === 'MACHINE_CODING') return <span className="cat-pill cat-mc">Machine Coding</span>;
    if (c === 'DSA') return <span className="cat-pill cat-dsa">LeetCode / DSA</span>;
    return <span className="cat-pill cat-cp">Core Programming</span>;
  };

  const getDifficultyBadge = (diff: string) => {
    const d = (diff || 'Medium').toLowerCase();
    return <span className={`diff-pill diff-${d}`}>{diff || 'Medium'}</span>;
  };

  const renderTimelineCard = (att: CodingAttempt) => (
    <div
      key={att.id}
      className="perf-timeline-card"
      onClick={() => setSelectedAttempt(att)}
    >
      <div className="time-col">
        <div className="time-col-date">
          {new Date(att.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <div className="time-col-clock">
          {new Date(att.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      <div className="content-col">
        <div className="top-row">
          <div className="perf-q-title-wrap">
            <span className="perf-q-title">{att.questionTitle}</span>
            <span className="perf-q-id">{att.questionId}</span>
          </div>
          {getStatusBadge(att.status)}
        </div>
        <div className="bottom-row">
          <span>{getCategoryBadge(att.category)}</span>
          <span className="stat">{att.percentage}% score</span>
          <span className="stat">Attempt #{att.attemptNumber}</span>
          {att.durationSeconds > 0 && (
            <span className="stat text-amber">⏱️ {formatDuration(att.durationSeconds)}</span>
          )}
          <button
            type="button"
            className="perf-action-btn"
            style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: '0.78rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAttempt(att);
            }}
          >
            Inspect Code →
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="perf-view-loading">
        <div className="perf-spinner" />
        <p>Loading candidate coding history &amp; performance metrics...</p>
      </div>
    );
  }

  const mcStat = summary?.categoryStats.MACHINE_CODING;
  const dsaStat = summary?.categoryStats.DSA;
  const cpStat = summary?.categoryStats.CORE_PROGRAMMING;

  return (
    <div className="perf-container">
      {/* Header Banner */}
      <div className="perf-header-banner">
        <div>
          <h1 className="perf-main-title">My Performance &amp; Coding History</h1>
          <p className="perf-main-subtitle">
            Durable candidate metrics, multi-attempt code records, and technical competency progress.
          </p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="perf-nav-tabs" role="tablist" aria-label="Performance Sections">
        <button
          type="button"
          role="tab"
          aria-selected={!activeTrackCategory && activeViewTab === 'overview'}
          className={`perf-nav-tab ${!activeTrackCategory && activeViewTab === 'overview' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory(null); setActiveViewTab('overview'); }}
        >
          <span className="perf-tab-icon">📊</span>
          <span className="perf-tab-text">Overview</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTrackCategory === 'MACHINE_CODING'}
          className={`perf-nav-tab ${activeTrackCategory === 'MACHINE_CODING' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory('MACHINE_CODING'); }}
        >
          <span className="perf-tab-icon">⚡</span>
          <span className="perf-tab-text">Machine Coding</span>
          <span className="perf-tab-badge">{mcStat?.questionsAttempted || 0}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTrackCategory === 'DSA'}
          className={`perf-nav-tab ${activeTrackCategory === 'DSA' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory('DSA'); }}
        >
          <span className="perf-tab-icon">🧠</span>
          <span className="perf-tab-text">LeetCode / DSA</span>
          <span className="perf-tab-badge">{dsaStat?.questionsAttempted || 0}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTrackCategory === 'CORE_PROGRAMMING'}
          className={`perf-nav-tab ${activeTrackCategory === 'CORE_PROGRAMMING' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory('CORE_PROGRAMMING'); }}
        >
          <span className="perf-tab-icon">💻</span>
          <span className="perf-tab-text">Core Programming</span>
          <span className="perf-tab-badge">{cpStat?.questionsAttempted || 0}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!activeTrackCategory && activeViewTab === 'table'}
          className={`perf-nav-tab ${!activeTrackCategory && activeViewTab === 'table' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory(null); setActiveViewTab('table'); }}
        >
          <span className="perf-tab-icon">📋</span>
          <span className="perf-tab-text">Question History</span>
          <span className="perf-tab-badge">{questionRows.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!activeTrackCategory && activeViewTab === 'daily'}
          className={`perf-nav-tab ${!activeTrackCategory && activeViewTab === 'daily' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory(null); setActiveViewTab('daily'); }}
        >
          <span className="perf-tab-icon">📅</span>
          <span className="perf-tab-text">Daily Activity</span>
          <span className="perf-tab-badge">{summary?.dailyActivity?.length || 0}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!activeTrackCategory && activeViewTab === 'weekly'}
          className={`perf-nav-tab ${!activeTrackCategory && activeViewTab === 'weekly' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory(null); setActiveViewTab('weekly'); }}
        >
          <span className="perf-tab-icon">📆</span>
          <span className="perf-tab-text">Weekly Activity</span>
          <span className="perf-tab-badge">{summary?.weeklyActivity?.length || 0}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!activeTrackCategory && activeViewTab === 'timeline'}
          className={`perf-nav-tab ${!activeTrackCategory && activeViewTab === 'timeline' ? 'active' : ''}`}
          onClick={() => { setActiveTrackCategory(null); setActiveViewTab('timeline'); }}
        >
          <span className="perf-tab-icon">⏳</span>
          <span className="perf-tab-text">Timeline Log</span>
          <span className="perf-tab-badge">{attempts.length}</span>
        </button>
      </div>

      {/* DEDICATED TRACK QUESTIONS HISTORY VIEW */}
      {activeTrackCategory && trackMeta && (
        <div className="perf-track-view">
          {/* Track Hero Banner */}
          <div className="perf-track-hero">
            <div className="perf-track-hero-left">
              <div className="perf-track-hero-icon">{trackMeta.icon}</div>
              <div className="perf-track-hero-info">
                <h2>
                  <span>{trackMeta.title}</span>
                  <span className={`perf-track-badge ${trackMeta.badgeClass}`}>
                    {trackMeta.shortTitle}
                  </span>
                </h2>
                <p>{trackMeta.description}</p>
              </div>
            </div>

            <div className="perf-track-switcher">
              <button
                type="button"
                className={`perf-track-switch-btn ${activeTrackCategory === 'MACHINE_CODING' ? 'active' : ''}`}
                onClick={() => setActiveTrackCategory('MACHINE_CODING')}
              >
                ⚡ Machine Coding ({summary?.categoryStats?.MACHINE_CODING?.questionsAttempted || 0})
              </button>
              <button
                type="button"
                className={`perf-track-switch-btn ${activeTrackCategory === 'DSA' ? 'active' : ''}`}
                onClick={() => setActiveTrackCategory('DSA')}
              >
                🧠 LeetCode / DSA ({summary?.categoryStats?.DSA?.questionsAttempted || 0})
              </button>
              <button
                type="button"
                className={`perf-track-switch-btn ${activeTrackCategory === 'CORE_PROGRAMMING' ? 'active' : ''}`}
                onClick={() => setActiveTrackCategory('CORE_PROGRAMMING')}
              >
                💻 Core Programming ({summary?.categoryStats?.CORE_PROGRAMMING?.questionsAttempted || 0})
              </button>
              <button
                type="button"
                className="perf-track-switch-btn overview-btn"
                onClick={() => { setActiveTrackCategory(null); setActiveViewTab('overview'); }}
              >
                📊 Scorecard Overview
              </button>
            </div>
          </div>

          {/* Track Metrics KPI Strip */}
          <div className="perf-summary-grid" style={{ marginBottom: '24px' }}>
            <div className="perf-card">
              <div className="perf-card-icon">✅</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Unique Questions Solved</span>
                <div className="perf-card-value text-green">{trackSolvedQuestions}</div>
                <span className="perf-card-sub">out of {trackTotalQuestions} unique attempted</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">📈</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Track Success Rate</span>
                <div className="perf-card-value text-blue">{trackTotalQuestions > 0 ? `${trackSuccessRate}%` : 'No activity yet'}</div>
                <span className="perf-card-sub">solved vs unique attempted</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">📝</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Total Submissions / Attempts</span>
                <div className="perf-card-value">{trackTotalSubmissions}</div>
                <span className="perf-card-sub">across all {trackTotalQuestions} questions</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">⭐</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Average Score</span>
                <div className="perf-card-value text-amber">{trackTotalQuestions > 0 ? `${trackAvgScore}%` : '0%'}</div>
                <span className="perf-card-sub">evaluated execution score</span>
              </div>
            </div>
          </div>

          {/* Track Filter Bar */}
          <div className="perf-filter-bar" style={{ marginBottom: '20px' }}>
            <div className="perf-search-input-wrap">
              <input
                type="text"
                className="perf-search-input"
                placeholder={`Search ${trackMeta.shortTitle} problems by title or ID...`}
                value={trackSearchTerm}
                onChange={e => {
                  setTrackSearchTerm(e.target.value);
                  setTrackPage(1);
                }}
              />
              {trackSearchTerm && (
                <button type="button" className="perf-clear-search" onClick={() => setTrackSearchTerm('')}>✕</button>
              )}
            </div>

            <div className="perf-dropdown-filters">
              <select
                className="perf-select"
                value={trackDifficultyFilter}
                onChange={e => {
                  setTrackDifficultyFilter(e.target.value);
                  setTrackPage(1);
                }}
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                className="perf-select"
                value={trackStatusFilter}
                onChange={e => {
                  setTrackStatusFilter(e.target.value);
                  setTrackPage(1);
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted / In Progress</option>
              </select>

              <select
                className="perf-select"
                value={trackPageSize}
                onChange={e => {
                  setTrackPageSize(Number(e.target.value));
                  setTrackPage(1);
                }}
              >
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Track Questions Table */}
          {filteredTrackQuestions.length === 0 ? (
            <div className="perf-empty-state">
              <div className="perf-empty-icon">{trackMeta.icon}</div>
              <h4>No {trackMeta.title} Questions Found</h4>
              <p>
                {trackTotalQuestions === 0
                  ? `You have not submitted any code for ${trackMeta.title} yet.`
                  : 'No questions matched your current filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="perf-table-responsive">
              <table className="perf-table">
                <thead>
                  <tr>
                    <th>Problem Name &amp; ID</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Attempts</th>
                    <th>Duration</th>
                    <th>Last Submitted (Date &amp; Time)</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrackQuestions.map(row => (
                    <tr
                      key={row.questionId}
                      className="perf-table-row"
                      onClick={() => setSelectedAttempt(row.bestAttempt || row.latestAttempt)}
                    >
                      <td>
                        <div className="perf-q-title-wrap">
                          <span className="perf-q-title">{row.questionTitle}</span>
                          <span className="perf-q-id">{row.questionId}</span>
                        </div>
                      </td>
                      <td>{getDifficultyBadge(row.difficulty)}</td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td>
                        <strong style={{ color: row.score >= 80 ? 'var(--green, #10b981)' : 'inherit' }}>
                          {row.score}%
                        </strong>
                      </td>
                      <td>
                        <span className="perf-pill">{row.attemptsCount} {row.attemptsCount === 1 ? 'attempt' : 'attempts'}</span>
                      </td>
                      <td>{row.durationSeconds > 0 ? formatDuration(row.durationSeconds) : '—'}</td>
                      <td>
                        <div className="perf-date-time-cell">
                          <span className="cell-date">
                            {new Date(row.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="cell-time">
                            {new Date(row.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="perf-action-btn"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedAttempt(row.bestAttempt || row.latestAttempt);
                          }}
                        >
                          Inspect Code →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Bar */}
              {trackTotalPages > 1 && (
                <div className="perf-pagination">
                  <button
                    type="button"
                    disabled={trackPage <= 1}
                    onClick={() => setTrackPage(p => Math.max(1, p - 1))}
                    className="perf-page-btn"
                  >
                    ← Prev
                  </button>
                  <span className="perf-page-indicator">
                    Showing {(trackPage - 1) * trackPageSize + 1}–{Math.min(trackPage * trackPageSize, filteredTrackQuestions.length)} of {filteredTrackQuestions.length} Questions (Page {trackPage} of {trackTotalPages})
                  </span>
                  <button
                    type="button"
                    disabled={trackPage >= trackTotalPages}
                    onClick={() => setTrackPage(p => Math.min(trackTotalPages, p + 1))}
                    className="perf-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* OVERVIEW SCORECARD & CATEGORY CARDS (Rendered when not in dedicated track view) */}
      {!activeTrackCategory && (
        <>
          {/* Top 6 Summary Cards */}
          <div className="perf-summary-grid">
            <div className="perf-card">
              <div className="perf-card-icon">⭐</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Average Score</span>
                <div className="perf-card-value text-amber">
                  {summary && summary.totalAttempts > 0
                    ? `${Math.round(
                        Object.values(summary.categoryStats)
                          .filter(c => c.hasActivity)
                          .reduce((acc, c, _, arr) => acc + c.averageScore / arr.length, 0) || 0
                      )}%`
                    : 'No activity yet'}
                </div>
                <span className="perf-card-sub">Across evaluated attempts</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">✅</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Unique Solved</span>
                <div className="perf-card-value text-green">{summary?.uniqueSolved ?? 0}</div>
                <span className="perf-card-sub">Verified passing solutions</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">🎯</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Attempted</span>
                <div className="perf-card-value">{summary?.uniqueAttempted ?? 0}</div>
                <span className="perf-card-sub">Distinct problems tackled</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">📈</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Success Rate</span>
                <div className="perf-card-value text-blue">
                  {summary && summary.uniqueAttempted > 0 ? `${summary.successRate}%` : 'No activity yet'}
                </div>
                <span className="perf-card-sub">Solved / Attempted ratio</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">⏱️</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Total Coding Time</span>
                <div className="perf-card-value">
                  {summary && summary.totalCodingTimeSeconds > 0
                    ? formatDuration(summary.totalCodingTimeSeconds)
                    : '0m'}
                </div>
                <span className="perf-card-sub">Across {summary?.dailyActivity?.length || 0} active days</span>
              </div>
            </div>

            <div className="perf-card">
              <div className="perf-card-icon">📝</div>
              <div className="perf-card-content">
                <span className="perf-card-label">Total Submissions</span>
                <div className="perf-card-value">{summary?.totalAttempts ?? 0}</div>
                <span className="perf-card-sub">Across all tracks</span>
              </div>
            </div>
          </div>

          {/* Category Performance Breakdown */}
          <div className="perf-section-title">
            <h3>Category Performance Breakdown</h3>
            <span>Click any track to inspect in-depth question history, test results, and submitted code</span>
          </div>

          <div className="perf-categories-grid">
            {/* Machine Coding */}
            <div
              className="perf-cat-card clickable"
              onClick={() => setActiveTrackCategory('MACHINE_CODING')}
              role="button"
              tabIndex={0}
              title="Click to view full Machine Coding questions history"
            >
              <div className="perf-cat-header">
                <div className="perf-cat-badge badge-mc">⚡ Machine Coding</div>
                <div className="perf-cat-score">
                  {mcStat?.hasActivity ? `${mcStat.averageScore}% Avg` : 'No activity yet'}
                </div>
              </div>
              <div className="perf-cat-title">Component Architecture &amp; UI Systems</div>
              {mcStat?.hasActivity ? (
                <>
                  <div className="perf-cat-progress-bar">
                    <div
                      className="perf-cat-progress-fill fill-mc"
                      style={{ width: `${mcStat.successRate}%` }}
                    />
                  </div>
                  <div className="perf-cat-metrics">
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Attempted</span>
                      <span className="val">{mcStat.questionsAttempted}</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Solved</span>
                      <span className="val">{mcStat.questionsSolved}</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Success %</span>
                      <span className="val">{mcStat.successRate}%</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Avg Time</span>
                      <span className="val">{formatDuration(mcStat.averageCompletionTimeSeconds)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="perf-cat-empty-notice">No Machine Coding activity yet</div>
              )}
              <div className="perf-cat-action-footer">
                <span className="perf-cat-link">
                  Inspect Question History ({mcStat?.questionsAttempted || 0} questions) →
                </span>
              </div>
            </div>

            {/* LeetCode / DSA */}
            <div
              className="perf-cat-card clickable"
              onClick={() => setActiveTrackCategory('DSA')}
              role="button"
              tabIndex={0}
              title="Click to view full LeetCode / DSA questions history"
            >
              <div className="perf-cat-header">
                <div className="perf-cat-badge badge-dsa">🧠 LeetCode / DSA</div>
                <div className="perf-cat-score">
                  {dsaStat?.hasActivity ? `${dsaStat.averageScore}% Avg` : 'No activity yet'}
                </div>
              </div>
              <div className="perf-cat-title">Algorithms &amp; Problem Solving</div>
              {dsaStat?.hasActivity ? (
                <>
                  <div className="perf-cat-progress-bar">
                    <div
                      className="perf-cat-progress-fill fill-dsa"
                      style={{ width: `${dsaStat.successRate}%` }}
                    />
                  </div>
                  <div className="perf-cat-metrics">
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Attempted</span>
                      <span className="val">{dsaStat.questionsAttempted}</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Solved</span>
                      <span className="val">{dsaStat.questionsSolved}</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Success %</span>
                      <span className="val">{dsaStat.successRate}%</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Avg Time</span>
                      <span className="val">{formatDuration(dsaStat.averageCompletionTimeSeconds)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="perf-cat-empty-notice">No LeetCode / DSA activity yet</div>
              )}
              <div className="perf-cat-action-footer">
                <span className="perf-cat-link">
                  Inspect Question History ({dsaStat?.questionsAttempted || 0} questions) →
                </span>
              </div>
            </div>

            {/* Core Programming */}
            <div
              className="perf-cat-card clickable"
              onClick={() => setActiveTrackCategory('CORE_PROGRAMMING')}
              role="button"
              tabIndex={0}
              title="Click to view full Core Programming questions history"
            >
              <div className="perf-cat-header">
                <div className="perf-cat-badge badge-cp">💻 Core Programming</div>
                <div className="perf-cat-score">
                  {cpStat?.hasActivity ? `${cpStat.averageScore}% Avg` : 'No activity yet'}
                </div>
              </div>
              <div className="perf-cat-title">JavaScript, TypeScript &amp; Web Engines</div>
              {cpStat?.hasActivity ? (
                <>
                  <div className="perf-cat-progress-bar">
                    <div
                      className="perf-cat-progress-fill fill-cp"
                      style={{ width: `${cpStat.successRate}%` }}
                    />
                  </div>
                  <div className="perf-cat-metrics">
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Attempted</span>
                      <span className="val">{cpStat.questionsAttempted}</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Solved</span>
                      <span className="val">{cpStat.questionsSolved}</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Success %</span>
                      <span className="val">{cpStat.successRate}%</span>
                    </div>
                    <div className="perf-cat-metric-item">
                      <span className="lbl">Avg Time</span>
                      <span className="val">{formatDuration(cpStat.averageCompletionTimeSeconds)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="perf-cat-empty-notice">No Core Programming activity yet</div>
              )}
              <div className="perf-cat-action-footer">
                <span className="perf-cat-link">
                  Inspect Question History ({cpStat?.questionsAttempted || 0} questions) →
                </span>
              </div>
            </div>

            {/* AI Video Mock */}
            <div className="perf-cat-card">
              <div className="perf-cat-header">
                <div className="perf-cat-badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9' }}>
                  AI Video Mock
                </div>
                <div className="perf-cat-score">
                  {summary?.aiMockStats?.hasActivity ? `${summary.aiMockStats.averageScore}% Avg` : 'No activity yet'}
                </div>
              </div>
              <div className="perf-cat-title">Behavioral &amp; Technical AI Interviewer</div>
              {summary?.aiMockStats?.hasActivity ? (
                <div className="perf-cat-metrics">
                  <div className="perf-cat-metric-item">
                    <span className="lbl">Sessions</span>
                    <span className="val">{summary.aiMockStats.totalSessions}</span>
                  </div>
                  <div className="perf-cat-metric-item">
                    <span className="lbl">Completed</span>
                    <span className="val">{summary.aiMockStats.completedSessions}</span>
                  </div>
                  <div className="perf-cat-metric-item">
                    <span className="lbl">Highest</span>
                    <span className="val">{summary.aiMockStats.highestScore}</span>
                  </div>
                </div>
              ) : (
                <div className="perf-cat-empty-notice">No AI Mock history yet</div>
              )}
            </div>

            {/* Mentor Mock */}
            <div className="perf-cat-card">
              <div className="perf-cat-header">
                <div className="perf-cat-badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' }}>
                  Mentor Mock
                </div>
                <div className="perf-cat-score">
                  {summary?.mentorMockStats?.hasActivity ? `${summary.mentorMockStats.averageScore}% Avg` : 'No activity yet'}
                </div>
              </div>
              <div className="perf-cat-title">1-on-1 Expert Mock Interviews</div>
              {summary?.mentorMockStats?.hasActivity ? (
                <div className="perf-cat-metrics">
                  <div className="perf-cat-metric-item">
                    <span className="lbl">Sessions</span>
                    <span className="val">{summary.mentorMockStats.totalSessions}</span>
                  </div>
                </div>
              ) : (
                <div className="perf-cat-empty-notice">No Mentor Mock history yet</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* VIEW: QUESTION HISTORY TABLE (Available in 'overview' and 'table' tabs when no track selected) */}
      {!activeTrackCategory && (activeViewTab === 'overview' || activeViewTab === 'table') && (
        <div className="perf-table-section" style={{ marginTop: activeViewTab === 'overview' ? '32px' : '0' }}>
          <div className="perf-activity-header" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="perf-activity-title">
                📋 Complete Question History ({filteredQuestionRows.length} Questions)
              </h3>
              <p className="perf-activity-sub">
                Comprehensive record of all solved and attempted problems, latest scores, and exact submission timestamps.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="perf-filter-bar">
            <div className="perf-search-input-wrap">
              <input
                type="text"
                className="perf-search-input"
                placeholder="Search by problem title or ID (e.g. Two Sum, JS-P001)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="perf-clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="perf-dropdown-filters">
              <select
                className="perf-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="MACHINE_CODING">⚡ Machine Coding</option>
                <option value="DSA">🧠 LeetCode / DSA</option>
                <option value="CORE_PROGRAMMING">💻 Core Programming</option>
                {availableCategories
                  .filter(c => !['MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING'].includes(c))
                  .map(c => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, ' ')}
                    </option>
                  ))}
              </select>

              <select
                className="perf-select"
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                className="perf-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Solved">Solved / Accepted</option>
                <option value="Partial">Partial</option>
                <option value="Failed">Failed</option>
                <option value="Attempted">Attempted</option>
              </select>

              <select
                className="perf-select"
                value={languageFilter}
                onChange={e => setLanguageFilter(e.target.value)}
              >
                <option value="ALL">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>

          {/* Questions Table */}
          {filteredQuestionRows.length === 0 ? (
            <div className="perf-empty-state">
              <div className="perf-empty-icon">🔍</div>
              <h4>No matching questions found</h4>
              <p>Try clearing your search term or adjusting filter values.</p>
            </div>
          ) : (
            <div className="perf-table-responsive">
              <table className="perf-table">
                <thead>
                  <tr>
                    <th>Problem Name &amp; ID</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Attempts</th>
                    <th>Duration</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestionRows.map(row => (
                    <tr
                      key={row.questionId}
                      className="perf-table-row"
                      onClick={() => setSelectedAttempt(row)}
                    >
                      <td>
                        <div className="perf-q-title-wrap">
                          <span className="perf-q-title">{row.questionTitle}</span>
                          <span className="perf-q-id">{row.questionId}</span>
                        </div>
                      </td>
                      <td>{getCategoryBadge(row.category)}</td>
                      <td>{getDifficultyBadge(row.difficulty)}</td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td>
                        <strong style={{ color: row.percentage >= 80 ? 'var(--green, #10b981)' : 'inherit' }}>
                          {row.percentage}%
                        </strong>
                      </td>
                      <td>
                        <span className="perf-pill">{row.attemptsCount} {row.attemptsCount === 1 ? 'attempt' : 'attempts'}</span>
                      </td>
                      <td>{formatDuration(row.durationSeconds)}</td>
                      <td>
                        <div className="perf-date-time-cell">
                          <span className="cell-date">
                            {new Date(row.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="cell-time">
                            {new Date(row.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="perf-action-btn"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedAttempt(row);
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
          )}
        </div>
      )}

      {/* VIEW: DAILY ACTIVITY BREAKDOWN */}
      {!activeTrackCategory && activeViewTab === 'daily' && (
        <div className="perf-activity-section">
          <div className="perf-activity-header">
            <div>
              <h3 className="perf-activity-title">
                📅 Daily Coding Activity ({filteredDailyActivity.length} Active Days · {formatDuration(summary?.totalCodingTimeSeconds || 0)})
              </h3>
              <p className="perf-activity-sub">
                Track your day-by-day active time investment, problem completion, and inspect submitted solutions.
              </p>
            </div>
            <div className="perf-activity-actions">
              <button type="button" className="perf-btn-ghost" onClick={handleExpandAll}>
                Expand All
              </button>
              <button type="button" className="perf-btn-ghost" onClick={handleCollapseAll}>
                Collapse All
              </button>
            </div>
          </div>

          {/* Daily Filter Bar */}
          <div className="perf-filter-bar">
            <div className="perf-search-input-wrap">
              <input
                type="text"
                className="perf-search-input"
                placeholder="Filter daily questions by problem title or ID..."
                value={dailySearchTerm}
                onChange={e => setDailySearchTerm(e.target.value)}
              />
              {dailySearchTerm && (
                <button type="button" className="perf-clear-search" onClick={() => setDailySearchTerm('')}>✕</button>
              )}
            </div>

            <div className="perf-dropdown-filters">
              <select
                className="perf-select"
                value={dailyCategoryFilter}
                onChange={e => setDailyCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="MACHINE_CODING">⚡ Machine Coding</option>
                <option value="DSA">🧠 LeetCode / DSA</option>
                <option value="CORE_PROGRAMMING">💻 Core Programming</option>
              </select>

              <select
                className="perf-select"
                value={dailyStatusFilter}
                onChange={e => setDailyStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Solved">Solved / Accepted</option>
                <option value="Attempted">Attempted / In Progress</option>
              </select>
            </div>
          </div>

          {filteredDailyActivity.length === 0 ? (
            <div className="perf-empty-state">
              <div className="perf-empty-icon">📅</div>
              <h4>No daily activity matches your criteria</h4>
              <p>Try clearing your search term or category filters.</p>
            </div>
          ) : (
            <div className="perf-daily-list">
              {filteredDailyActivity.map((day, dIdx) => {
                const isExpanded = isDayExpanded(day.date, dIdx);
                return (
                  <div key={day.date} className={`perf-daily-card ${isExpanded ? 'expanded' : ''}`}>
                    <div
                      className="perf-daily-card-header"
                      onClick={() => toggleDayExpansion(day.date)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="perf-daily-card-header-left">
                        <span className="perf-daily-calendar-icon">📅</span>
                        <div>
                          <div className="perf-daily-date-row">
                            <h4 className="perf-daily-date-text">{day.displayDate}</h4>
                            <span className="perf-daily-dow-pill">{day.dayOfWeek}</span>
                            {dIdx === 0 && <span className="perf-latest-pill">Latest Day</span>}
                          </div>
                          <span className="perf-daily-count-sub">
                            {day.questions.length} {day.questions.length === 1 ? 'problem' : 'problems'} · {day.totalCodingTimeFormatted} coding time
                          </span>
                        </div>
                      </div>

                      <div className="perf-daily-card-header-right">
                        <div className="perf-mini-stat time">
                          <span className="mini-stat-lbl">Time:</span>
                          <span className="mini-stat-val text-amber">{day.totalCodingTimeFormatted}</span>
                        </div>
                        <div className="perf-mini-stat solved">
                          <span className="mini-stat-lbl">Solved:</span>
                          <span className="mini-stat-val text-green">{day.questionsSolvedCount} / {day.uniqueQuestionsCount}</span>
                        </div>
                        <div className="perf-mini-stat score">
                          <span className="mini-stat-lbl">Avg Score:</span>
                          <span className="mini-stat-val">{day.averageScore}%</span>
                        </div>
                        <span className="perf-daily-chevron">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="perf-daily-card-body">
                        <div className="perf-table-responsive">
                          <table className="perf-table">
                            <thead>
                              <tr>
                                <th>Problem / ID</th>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Time Spent</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Attempts</th>
                                <th>Submitted (Time)</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.questions.map(q => (
                                <tr key={`${day.date}-${q.questionId}`}>
                                  <td>
                                    <div className="perf-q-title-wrap">
                                      <span className="perf-q-title">{q.questionTitle}</span>
                                      <span className="perf-q-id">{q.questionId}</span>
                                    </div>
                                  </td>
                                  <td>{getCategoryBadge(q.category)}</td>
                                  <td>{getDifficultyBadge(q.difficulty)}</td>
                                  <td>
                                    <strong className="text-amber">{q.durationFormatted}</strong>
                                  </td>
                                  <td>{getStatusBadge(q.status)}</td>
                                  <td>
                                    <strong style={{ color: q.score >= 80 ? 'var(--green, #10b981)' : 'inherit' }}>
                                      {q.score}%
                                    </strong>
                                  </td>
                                  <td>
                                    <span className="perf-pill">{q.totalAttemptsOnQuestion} attempts</span>
                                  </td>
                                  <td>
                                    <span className="cell-time">
                                      {new Date(q.attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button
                                      type="button"
                                      className="perf-action-btn"
                                      onClick={() => setSelectedAttempt(q.attempt)}
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
          )}
        </div>
      )}

      {/* VIEW: WEEKLY ACTIVITY BREAKDOWN */}
      {!activeTrackCategory && activeViewTab === 'weekly' && (
        <div className="perf-activity-section">
          <div className="perf-activity-header">
            <div>
              <h3 className="perf-activity-title">
                📆 Weekly Coding Activity ({summary?.weeklyActivity?.length || 0} Calendar Weeks · {formatDuration(summary?.totalCodingTimeSeconds || 0)})
              </h3>
              <p className="perf-activity-sub">
                Track your week-by-week aggregate learning hours, active days consistency, and solved problems.
              </p>
            </div>
            <div className="perf-activity-actions">
              <button type="button" className="perf-btn-ghost" onClick={handleExpandAll}>
                Expand All
              </button>
              <button type="button" className="perf-btn-ghost" onClick={handleCollapseAll}>
                Collapse All
              </button>
            </div>
          </div>

          {!summary?.weeklyActivity || summary.weeklyActivity.length === 0 ? (
            <div className="perf-empty-state">
              <div className="perf-empty-icon">📆</div>
              <h4>No weekly activity recorded yet</h4>
              <p>Practice regularly to see your weekly performance metrics compiled here.</p>
            </div>
          ) : (
            <div className="perf-daily-list">
              {summary.weeklyActivity.map((week, wIdx) => {
                const isExpanded = isWeekExpanded(week.weekKey, wIdx);
                return (
                  <div key={week.weekKey} className={`perf-daily-card perf-weekly-card ${isExpanded ? 'expanded' : ''}`}>
                    <div
                      className="perf-daily-card-header"
                      onClick={() => toggleWeekExpansion(week.weekKey)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="perf-daily-card-header-left">
                        <span className="perf-daily-calendar-icon">📆</span>
                        <div>
                          <div className="perf-daily-date-row">
                            <h4 className="perf-daily-date-text">{week.displayWeek}</h4>
                            {wIdx === 0 && <span className="perf-latest-pill">Latest Week</span>}
                          </div>
                          <span className="perf-daily-count-sub">
                            {week.activeDaysCount} active {week.activeDaysCount === 1 ? 'day' : 'days'} ({week.startDate} – {week.endDate}) · {week.totalAttempts} submissions
                          </span>
                        </div>
                      </div>

                      <div className="perf-daily-card-header-right">
                        <div className="perf-mini-stat time">
                          <span className="mini-stat-lbl">Time:</span>
                          <span className="mini-stat-val text-amber">{week.totalCodingTimeFormatted}</span>
                        </div>
                        <div className="perf-mini-stat solved">
                          <span className="mini-stat-lbl">Solved:</span>
                          <span className="mini-stat-val text-green">{week.questionsSolvedCount} / {week.uniqueQuestionsCount}</span>
                        </div>
                        <div className="perf-mini-stat score">
                          <span className="mini-stat-lbl">Avg Score:</span>
                          <span className="mini-stat-val">{week.averageScore}%</span>
                        </div>
                        <span className="perf-daily-chevron">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="perf-weekly-body">
                        {/* Day badges in this week */}
                        <div className="perf-week-days-summary-grid">
                          {week.days.map(day => (
                            <div
                              key={day.date}
                              className="perf-week-day-badge-card"
                              onClick={() => toggleDayExpansion(day.date)}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="day-badge-head">
                                <span className="day-badge-name">{day.dayOfWeek}</span>
                                <span className="day-badge-date">{day.formattedDateShort}</span>
                              </div>
                              <div className="day-badge-time text-amber">{day.totalCodingTimeFormatted}</div>
                              <div className="day-badge-sub">
                                <span>{day.questionsSolvedCount} solved</span>
                                <span>·</span>
                                <span>{day.totalAttempts} att.</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Nested Days */}
                        <div className="perf-nested-days-list">
                          {week.days.map((day, dIdx) => {
                            const dayExpanded = isDayExpanded(day.date, dIdx);
                            return (
                              <div key={day.date} className={`perf-daily-card nested ${dayExpanded ? 'expanded' : ''}`}>
                                <div
                                  className="perf-daily-card-header nested-header"
                                  onClick={() => toggleDayExpansion(day.date)}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <div className="perf-daily-card-header-left">
                                    <div className="perf-daily-date-row">
                                      <h5 style={{ margin: 0, fontSize: '0.98rem' }}>{day.displayDate}</h5>
                                      <span className="perf-daily-dow-pill">{day.dayOfWeek}</span>
                                    </div>
                                  </div>
                                  <div className="perf-daily-card-header-right">
                                    <div className="perf-mini-stat time" style={{ padding: '4px 10px' }}>
                                      <span className="mini-stat-val text-amber">{day.totalCodingTimeFormatted}</span>
                                    </div>
                                    <div className="perf-mini-stat solved" style={{ padding: '4px 10px' }}>
                                      <span className="mini-stat-val text-green">{day.questionsSolvedCount} / {day.uniqueQuestionsCount} Solved</span>
                                    </div>
                                    <span className="perf-daily-chevron">{dayExpanded ? '▲' : '▼'}</span>
                                  </div>
                                </div>

                                {dayExpanded && (
                                  <div className="perf-daily-card-body">
                                    <div className="perf-table-responsive">
                                      <table className="perf-table">
                                        <thead>
                                          <tr>
                                            <th>Problem / ID</th>
                                            <th>Category</th>
                                            <th>Time Spent</th>
                                            <th>Status</th>
                                            <th>Score</th>
                                            <th>Attempts</th>
                                            <th>Submitted (Time)</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {day.questions.map(q => (
                                            <tr key={`${day.date}-${q.questionId}`}>
                                              <td>
                                                <div className="perf-q-title-wrap">
                                                  <span className="perf-q-title">{q.questionTitle}</span>
                                                  <span className="perf-q-id">{q.questionId}</span>
                                                </div>
                                              </td>
                                              <td>{getCategoryBadge(q.category)}</td>
                                              <td>
                                                <strong className="text-amber">{q.durationFormatted}</strong>
                                              </td>
                                              <td>{getStatusBadge(q.status)}</td>
                                              <td>
                                                <strong style={{ color: q.score >= 80 ? 'var(--green, #10b981)' : 'inherit' }}>
                                                  {q.score}%
                                                </strong>
                                              </td>
                                              <td>
                                                <span className="perf-pill">{q.totalAttemptsOnQuestion} attempts</span>
                                              </td>
                                              <td>
                                                <span className="cell-time">
                                                  {new Date(q.attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                              </td>
                                              <td style={{ textAlign: 'right' }}>
                                                <button
                                                  type="button"
                                                  className="perf-action-btn"
                                                  onClick={() => setSelectedAttempt(q.attempt)}
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
          )}
        </div>
      )}

      {/* VIEW: TIMELINE LOG (Filtered & Detailed) */}
      {!activeTrackCategory && activeViewTab === 'timeline' && (
        <div className="perf-timeline-section">
          <div className="perf-activity-header" style={{ marginBottom: '16px' }}>
            <div>
              <h3 className="perf-activity-title">
                ⏳ Chronological Activity Timeline ({filteredTimelineAttempts.length} Submissions)
              </h3>
              <p className="perf-activity-sub">
                Audited timeline log of all evaluation runs and submissions with exact timestamps and test execution results.
              </p>
            </div>
          </div>

          {/* Timeline Filter Bar */}
          <div className="perf-filter-bar" style={{ marginBottom: '20px' }}>
            <div className="perf-search-input-wrap">
              <input
                type="text"
                className="perf-search-input"
                placeholder="Filter timeline by problem title or ID..."
                value={timelineSearchTerm}
                onChange={e => setTimelineSearchTerm(e.target.value)}
              />
              {timelineSearchTerm && (
                <button type="button" className="perf-clear-search" onClick={() => setTimelineSearchTerm('')}>✕</button>
              )}
            </div>

            <div className="perf-dropdown-filters">
              <select
                className="perf-select"
                value={timelineCategoryFilter}
                onChange={e => setTimelineCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="MACHINE_CODING">⚡ Machine Coding</option>
                <option value="DSA">🧠 LeetCode / DSA</option>
                <option value="CORE_PROGRAMMING">💻 Core Programming</option>
              </select>

              <select
                className="perf-select"
                value={timelineStatusFilter}
                onChange={e => setTimelineStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Solved">Solved / Accepted</option>
                <option value="Partial">Partial</option>
                <option value="Failed">Failed</option>
                <option value="Attempted">Attempted</option>
              </select>
            </div>
          </div>

          <div className="perf-timeline-container">
            {/* Today */}
            {timelineGroups.today.length > 0 && (
              <div className="perf-timeline-group">
                <div className="perf-timeline-group-header">Today ({timelineGroups.today.length})</div>
                <div className="perf-timeline-items">
                  {timelineGroups.today.map(att => renderTimelineCard(att))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {timelineGroups.yesterday.length > 0 && (
              <div className="perf-timeline-group">
                <div className="perf-timeline-group-header">Yesterday ({timelineGroups.yesterday.length})</div>
                <div className="perf-timeline-items">
                  {timelineGroups.yesterday.map(att => renderTimelineCard(att))}
                </div>
              </div>
            )}

            {/* This Week */}
            {timelineGroups.thisWeek.length > 0 && (
              <div className="perf-timeline-group">
                <div className="perf-timeline-group-header">This Week ({timelineGroups.thisWeek.length})</div>
                <div className="perf-timeline-items">
                  {timelineGroups.thisWeek.map(att => renderTimelineCard(att))}
                </div>
              </div>
            )}

            {/* Older */}
            {timelineGroups.older.length > 0 && (
              <div className="perf-timeline-group">
                <div className="perf-timeline-group-header">Older Activity ({timelineGroups.older.length})</div>
                <div className="perf-timeline-items">
                  {timelineGroups.older.map(att => renderTimelineCard(att))}
                </div>
              </div>
            )}

            {filteredTimelineAttempts.length === 0 && (
              <div className="perf-empty-state">
                <div className="perf-empty-icon">⏱️</div>
                <h4>No matching timeline events</h4>
                <p>Try clearing your search term or category filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code & Attempt Detail Modal */}
      {selectedAttempt && (
        <QuestionHistoryDetailModal
          attempt={selectedAttempt}
          userId={effectiveUserId}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
}
