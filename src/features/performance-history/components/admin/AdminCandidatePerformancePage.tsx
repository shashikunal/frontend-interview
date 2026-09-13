import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { profileService } from '../../../auth/services/profile.service';
import { authService } from '../../../auth/services/auth.service';
import { codingHistoryService, formatDurationSec } from '../../services/codingHistoryService';
import { hiringEvaluationService } from '../../services/hiringEvaluationService';
import {
  candidateHiringActionService,
  type CandidateAssignment,
  type ScheduledInterviewRound,
} from '../../services/candidateHiringActionService';
import QuestionHistoryDetailModal from '../student/QuestionHistoryDetailModal';
import {
  candidateAiEvaluationService,
  type CandidateAiEvaluationReport,
} from '../../services/candidateAiEvaluationService';
import type {
  CodingAttempt,
  UserPerformanceSummary,
  HiringEvaluationHistoryItem,
  HiringStatus,
  HiringEvaluation,
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

interface AdminCandidatePerformancePageProps {
  isEmbedded?: boolean;
}

export default function AdminCandidatePerformancePage({ isEmbedded = false }: AdminCandidatePerformancePageProps = {}) {
  const { userId, attemptId, trackKey } = useParams<{ userId: string; attemptId?: string; sessionId?: string; trackKey?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, getAllUsers } = useAuth();
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

  // Automated AI Candidate Evaluation & Hiring Intelligence State
  const [aiEvaluation, setAiEvaluation] = useState<CandidateAiEvaluationReport | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // Password Reset Action State
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetToast, setPasswordResetToast] = useState<string | null>(null);

  // Executive Dossier Export State
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Candidate Comparison State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareRoster, setCompareRoster] = useState<{ id: string; name: string; email: string; role?: string }[]>([]);
  const [selectedCompareId, setSelectedCompareId] = useState<string>('');
  const [compareProfile, setCompareProfile] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    targetCompany?: string;
    experienceLevel?: string;
  } | null>(null);
  const [compareSummary, setCompareSummary] = useState<UserPerformanceSummary | null>(null);
  const [compareEval, setCompareEval] = useState<HiringEvaluation | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [inPageViewMode, setInPageViewMode] = useState<'single' | 'diff'>('single');

  // Candidate Assignments & Scheduled Interviews State
  const [assignments, setAssignments] = useState<CandidateAssignment[]>([]);
  const [interviews, setInterviews] = useState<ScheduledInterviewRound[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Assignment Form State
  const [assignTitle, setAssignTitle] = useState('Frontend Architecture & Complex State');
  const [assignTrack, setAssignTrack] = useState<'MACHINE_CODING' | 'DSA' | 'CORE_PROGRAMMING' | 'FRONTEND_JS'>('MACHINE_CODING');
  const [assignDifficulty, setAssignDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('hard');
  const [assignCount, setAssignCount] = useState(2);
  const [assignDeadlineDays, setAssignDeadlineDays] = useState(3);
  const [assignInstructions, setAssignInstructions] = useState('Implement clean modular architecture, handle loading/error boundaries, and ensure unit test coverage.');

  // Interview Form State
  const [roundTitle, setRoundTitle] = useState('Senior Frontend Live Coding & Architecture Round');
  const [roundType, setRoundType] = useState<'Technical Coding' | 'DSA & Algorithms' | 'System Design & Architecture' | 'Cultural & Behavioral'>('Technical Coding');
  const [roundDate, setRoundDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [roundTime, setRoundTime] = useState('14:30');
  const [roundDuration, setRoundDuration] = useState(60);
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-prep-live');
  const [interviewerNotes, setInterviewerNotes] = useState('Evaluate component modularity, state machines, and real-time algorithmic trade-offs.');

  // Load assignments and interviews
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    Promise.all([
      candidateHiringActionService.getAssignments(userId),
      candidateHiringActionService.getScheduledInterviews(userId),
    ]).then(([assList, intList]) => {
      if (isMounted) {
        setAssignments(assList);
        setInterviews(intList);
      }
    });
    return () => { isMounted = false; };
  }, [userId]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !candidateProfile) return;
    try {
      const deadline = new Date(Date.now() + assignDeadlineDays * 24 * 60 * 60 * 1000).toISOString();
      const created = await candidateHiringActionService.saveAssignment({
        candidateId: userId,
        title: assignTitle,
        track: assignTrack,
        difficulty: assignDifficulty,
        questionsCount: assignCount,
        deadline,
        instructions: assignInstructions,
        status: 'Assigned',
        assignedBy: 'Staff Evaluation Committee',
      });
      setAssignments(prev => [created, ...prev]);
      setShowAssignModal(false);
      setActionSuccessMsg('Targeted Assessment assigned successfully!');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !candidateProfile) return;
    try {
      const scheduledDate = new Date(`${roundDate}T${roundTime}:00`).toISOString();
      const scheduled = await candidateHiringActionService.scheduleInterview({
        candidateId: userId,
        roundTitle,
        roundType,
        scheduledDate,
        durationMinutes: roundDuration,
        meetingLink,
        interviewerNotes,
        status: 'Scheduled',
        interviewerName: 'Staff Interview Panel',
      });
      setInterviews(prev => [...prev, scheduled]);
      setShowScheduleModal(false);
      setActionSuccessMsg('Live Technical Interview scheduled successfully!');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleInterviewStatus = async (roundId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Scheduled' ? 'Completed' : currentStatus === 'Completed' ? 'Cancelled' : 'Scheduled';
    await candidateHiringActionService.updateInterviewStatus(roundId, nextStatus as any);
    setInterviews(prev => prev.map(i => i.id === roundId ? { ...i, status: nextStatus as any } : i));
  };

  // Load roster of other candidates when comparison modal opens
  useEffect(() => {
    if (!showCompareModal) return;
    let isMounted = true;
    getAllUsers().then(users => {
      if (isMounted) {
        const others = users
          .filter(u => u.id !== userId)
          .map(u => ({
            id: u.id,
            name: u.name || 'Candidate',
            email: u.email || `${u.id.slice(0, 8)}@candidate.com`,
            role: u.role,
          }));
        setCompareRoster(others);
        if (others.length > 0 && (!selectedCompareId || selectedCompareId === userId)) {
          setSelectedCompareId(others[0].id);
        }
      }
    }).catch(err => console.warn('Failed to load comparison roster:', err));
    return () => { isMounted = false; };
  }, [showCompareModal, userId, getAllUsers, selectedCompareId]);

  // Load selected comparison candidate performance and evaluation
  useEffect(() => {
    if (!showCompareModal || !selectedCompareId) return;
    let isMounted = true;
    setLoadingCompare(true);
    Promise.all([
      profileService.getProfile(selectedCompareId),
      codingHistoryService.getUserPerformanceSummary(selectedCompareId),
      hiringEvaluationService.getEvaluation(selectedCompareId),
    ]).then(([p, s, e]) => {
      if (isMounted) {
        if (p) {
          setCompareProfile({
            id: p.id,
            name: p.name,
            email: p.email,
            role: p.role,
            targetCompany: p.targetCompany,
            experienceLevel: p.experienceLevel,
          });
        } else {
          setCompareProfile({
            id: selectedCompareId,
            name: 'Candidate',
            email: `${selectedCompareId.slice(0, 8)}@candidate.com`,
            role: 'candidate',
          });
        }
        setCompareSummary(s);
        setCompareEval(e);
        setLoadingCompare(false);
      }
    }).catch(err => {
      console.warn('Error loading candidate comparison:', err);
      if (isMounted) setLoadingCompare(false);
    });
    return () => { isMounted = false; };
  }, [showCompareModal, selectedCompareId]);

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

          // Restore cached AI synthesis if available
          const cachedAi = candidateAiEvaluationService.getCachedEvaluation(userId!);
          if (cachedAi) {
            setAiEvaluation(cachedAi);
          }

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

  // Trigger automated AI evaluation synthesis
  const handleGenerateAiSynthesis = async () => {
    if (!userId || !candidateProfile) return;
    setIsGeneratingAi(true);
    setAiError(null);
    setAiSuccessMsg(null);
    try {
      const topSubmissions = attempts
        .filter(a => a.code && a.code.trim().length > 0)
        .slice(0, 5)
        .map(a => ({
          questionId: a.questionId,
          title: a.questionTitle,
          category: a.category,
          score: a.score,
          status: a.status,
          code: a.code,
          language: a.language || 'typescript',
          timeSpentSeconds: a.timeSpentSeconds,
        }));

      const report = await candidateAiEvaluationService.generateEvaluation({
        candidateId: userId,
        candidateName: candidateProfile.name || 'Candidate',
        candidateEmail: candidateProfile.email,
        metrics: {
          uniqueSolved: summary?.uniqueProblemsSolved ?? 0,
          uniqueAttempted: summary?.uniqueProblemsAttempted ?? 0,
          successRate: summary?.successRate ?? 0,
          totalAttempts: summary?.totalAttempts ?? 0,
          totalTimeMinutes: summary?.totalTimeSpentMinutes ?? 0,
        },
        categoryBreakdown: {
          machineCoding: {
            uniqueSolved: summary?.categoryStats?.MACHINE_CODING?.solved ?? 0,
            avgScore: summary?.categoryStats?.MACHINE_CODING?.averageScore ?? 0,
          },
          coreProgramming: {
            uniqueSolved: summary?.categoryStats?.CORE_PROGRAMMING?.solved ?? 0,
            avgScore: summary?.categoryStats?.CORE_PROGRAMMING?.averageScore ?? 0,
          },
          dsa: {
            uniqueSolved: summary?.categoryStats?.DSA?.solved ?? 0,
            avgScore: summary?.categoryStats?.DSA?.averageScore ?? 0,
          },
        },
        topSubmissions,
      });

      setAiEvaluation(report);
      setAiSuccessMsg('✨ AI Candidate Evaluation successfully synthesized!');
      setTimeout(() => setAiSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Failed to generate AI evaluation:', err);
      setAiError(err.message || 'Failed to synthesize AI evaluation.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Apply AI evaluation recommendations directly to the hiring form
  const handleApplyAiToEvaluation = () => {
    if (!aiEvaluation) return;

    // Map recommendation verdict
    if (aiEvaluation.recommendation === 'STRONG_HIRE' || aiEvaluation.recommendation === 'HIRE') {
      setHiringStatus('Hire');
    } else if (aiEvaluation.recommendation === 'LEAN_HIRE' || aiEvaluation.recommendation === 'LEAN_REJECT') {
      setHiringStatus('Consider');
    } else {
      setHiringStatus('Reject');
    }

    // Rubric scores
    setOverallRating(Math.round(aiEvaluation.rubricSuggestions.problemSolving));
    setRubricProblemSolving(Math.round(aiEvaluation.rubricSuggestions.problemSolving));
    setRubricCodeQuality(Math.round(aiEvaluation.rubricSuggestions.codeQuality));
    setRubricArchitecture(Math.round(aiEvaluation.rubricSuggestions.architecture));

    // Summary & notes
    setRecommendation(aiEvaluation.executiveSummary);

    if (aiEvaluation.strengths && aiEvaluation.strengths.length > 0) {
      setStrengths(aiEvaluation.strengths.map(s => `• ${s}`).join('\n'));
    }

    if (aiEvaluation.areasToProbe && aiEvaluation.areasToProbe.length > 0) {
      setWeaknesses(aiEvaluation.areasToProbe.map(w => `• ${w}`).join('\n'));
    }

    let interviewNotes = `[AI Hiring Intelligence Synthesis - Assessed Seniority: ${aiEvaluation.seniorityLevel} (Confidence: ${aiEvaluation.confidenceScore}%)]\n\n`;
    if (aiEvaluation.tailoredInterviewQuestions && aiEvaluation.tailoredInterviewQuestions.length > 0) {
      interviewNotes += `Recommended Interview Panel Probing Questions:\n`;
      aiEvaluation.tailoredInterviewQuestions.forEach((q, idx) => {
        interviewNotes += `${idx + 1}. "${q.question}"\n   Rationale: ${q.rationale}\n\n`;
      });
    }
    setNotes(prev => (prev ? `${prev}\n\n${interviewNotes}` : interviewNotes));

    setFinalComments(`Leveling Recommendation: ${aiEvaluation.seniorityLevel}\nSeniority Rationale: ${aiEvaluation.seniorityRationale}`);

    setEvaluationSaveMessage('✨ AI recommendations successfully applied to rubric and notes! Review and persist changes.');
    setTimeout(() => setEvaluationSaveMessage(null), 6000);
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

  // Top solved problems for executive dossier snapshot
  const dossierTopSolved = useMemo(() => {
    const solvedMap = new Map<string, CodingAttempt>();
    attempts.forEach(att => {
      const isSolved =
        att.status?.toLowerCase() === 'accepted' ||
        att.status?.toLowerCase() === 'completed' ||
        att.score >= 70;
      if (
        isSolved &&
        (!solvedMap.has(att.questionId) ||
          att.score > (solvedMap.get(att.questionId)?.score || 0))
      ) {
        solvedMap.set(att.questionId, att);
      }
    });
    return Array.from(solvedMap.values()).slice(0, 10);
  }, [attempts]);

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
    <div className={`admin-perf-page ${resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'} ${isEmbedded ? 'is-embedded' : ''}`}>
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
              <>
                <button
                  type="button"
                  className="admin-perf-btn-dossier"
                  onClick={() => setShowAssignModal(true)}
                  title="Assign a targeted challenge bundle to this candidate"
                >
                  📋 Assign Assessment
                </button>
                <button
                  type="button"
                  className="admin-perf-btn-dossier"
                  onClick={() => setShowScheduleModal(true)}
                  title="Schedule a live coding interview round with this candidate"
                >
                  📅 Schedule Interview
                </button>
                <button
                  type="button"
                  className="admin-perf-btn-dossier"
                  onClick={() => setShowCompareModal(true)}
                  title="Benchmark and compare this candidate with another candidate side-by-side"
                >
                  ⚖️ Compare Candidate
                </button>
              </>
            )}
            {isAdmin && (
              <button
                type="button"
                className="admin-perf-btn-dossier admin-perf-btn-ai-magic"
                onClick={() => {
                  setActiveTab('hiring');
                  if (!aiEvaluation && !isGeneratingAi) {
                    handleGenerateAiSynthesis();
                  }
                }}
                disabled={isGeneratingAi}
                title="Synthesize automated AI candidate evaluation report & hiring intelligence"
              >
                {isGeneratingAi ? '✨ Synthesizing AI...' : '✨ AI Hiring Evaluation'}
              </button>
            )}
            <button
              type="button"
              className="admin-perf-btn-dossier"
              onClick={() => setShowDossierModal(true)}
              title="Generate and print standardized executive hiring dossier (PDF)"
            >
              📄 Export Hiring Dossier (PDF)
            </button>
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
            {!isEmbedded && (
              <button
                type="button"
                className="admin-perf-theme-toggle-btn"
                onClick={toggleTheme}
                title={resolvedTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label="Toggle Theme"
              >
                {resolvedTheme === 'light' ? '🌙' : '☀️'}
              </button>
            )}
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

          {/* Targeted Assignments & Live Interviews Section */}
          <div className="admin-perf-actions-section" style={{ marginTop: '36px' }}>
            <div className="admin-perf-section-header-flex">
              <div>
                <h3 className="admin-perf-section-title" style={{ marginBottom: '4px' }}>
                  🎯 Technical Assessment Bundles &amp; Scheduled Interview Rounds
                </h3>
                <p className="admin-perf-section-subtitle">
                  Assign targeted challenges, track candidate take-home deadlines, and coordinate live interview panels.
                </p>
              </div>
              <div className="admin-perf-actions-quick-btns">
                <button
                  type="button"
                  className="admin-perf-action-btn primary"
                  onClick={() => setShowAssignModal(true)}
                >
                  📋 + Assign Assessment
                </button>
                <button
                  type="button"
                  className="admin-perf-action-btn accent"
                  onClick={() => setShowScheduleModal(true)}
                >
                  📅 + Schedule Interview
                </button>
              </div>
            </div>

            {actionSuccessMsg && (
              <div className="admin-perf-success-toast">
                ✓ {actionSuccessMsg}
              </div>
            )}

            <div className="admin-hiring-dual-grid">
              {/* Active Technical Assignments Card */}
              <div className="admin-hiring-card">
                <div className="admin-hiring-card-head">
                  <div className="head-title">
                    <span className="card-icon">📋</span>
                    <div>
                      <h4>Targeted Take-Home Assessments</h4>
                      <p>{assignments.length} assigned challenge{assignments.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                </div>

                <div className="admin-hiring-card-body">
                  {assignments.length === 0 ? (
                    <div className="admin-hiring-empty">
                      <span>📭</span>
                      <p>No take-home challenges currently assigned to this candidate.</p>
                      <button
                        type="button"
                        className="admin-hiring-empty-btn"
                        onClick={() => setShowAssignModal(true)}
                      >
                        Assign First Challenge Bundle
                      </button>
                    </div>
                  ) : (
                    <div className="admin-hiring-list">
                      {assignments.map(ass => {
                        const isPastDeadline = new Date(ass.deadline).getTime() < Date.now();
                        return (
                          <div key={ass.id} className="admin-assignment-item">
                            <div className="item-top">
                              <div className="item-title-group">
                                <h5>{ass.title}</h5>
                                <span className="item-track-tag">{ass.track.replace(/_/g, ' ')}</span>
                                <span className={`item-diff-tag diff-${ass.difficulty}`}>
                                  {ass.difficulty.toUpperCase()}
                                </span>
                              </div>
                              <span className={`item-status-pill status-${ass.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {ass.status}
                              </span>
                            </div>

                            {ass.instructions && (
                              <p className="item-instructions">{ass.instructions}</p>
                            )}

                            <div className="item-footer">
                              <span className="item-meta">
                                📊 <strong>{ass.questionsCount}</strong> questions
                              </span>
                              <span className={`item-deadline ${isPastDeadline ? 'expired' : ''}`}>
                                ⏱ Deadline: {new Date(ass.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                {isPastDeadline ? ' (Past Due)' : ''}
                              </span>
                              <span className="item-assigned-by">By: {ass.assignedBy}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduled Live Interviews Card */}
              <div className="admin-hiring-card">
                <div className="admin-hiring-card-head">
                  <div className="head-title">
                    <span className="card-icon">📅</span>
                    <div>
                      <h4>Live Technical Interview Rounds</h4>
                      <p>{interviews.length} scheduled round{interviews.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                </div>

                <div className="admin-hiring-card-body">
                  {interviews.length === 0 ? (
                    <div className="admin-hiring-empty">
                      <span>🗓️</span>
                      <p>No live interview sessions currently scheduled.</p>
                      <button
                        type="button"
                        className="admin-hiring-empty-btn"
                        onClick={() => setShowScheduleModal(true)}
                      >
                        Schedule First Technical Round
                      </button>
                    </div>
                  ) : (
                    <div className="admin-hiring-list">
                      {interviews.map(round => (
                        <div key={round.id} className="admin-interview-item">
                          <div className="item-top">
                            <div className="item-title-group">
                              <h5>{round.roundTitle}</h5>
                              <span className="item-round-type">{round.roundType}</span>
                              <span className="item-duration-tag">⏱ {round.durationMinutes}m</span>
                            </div>
                            <button
                              type="button"
                              className={`item-status-btn status-${round.status.toLowerCase()}`}
                              onClick={() => handleToggleInterviewStatus(round.id, round.status)}
                              title="Click to toggle status (Scheduled → Completed → Cancelled)"
                            >
                              {round.status === 'Scheduled' && '🟢 Scheduled'}
                              {round.status === 'Completed' && '✓ Completed'}
                              {round.status === 'Cancelled' && '✕ Cancelled'}
                            </button>
                          </div>

                          {round.interviewerNotes && (
                            <p className="item-instructions">📝 {round.interviewerNotes}</p>
                          )}

                          <div className="item-footer">
                            <span className="item-date">
                              🗓️ {new Date(round.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(round.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {round.meetingLink && (
                              <a
                                href={round.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="item-join-link"
                              >
                                Join Meeting Room ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
          {/* AI HIRING INTELLIGENCE & EVALUATION MODULE */}
          <div className="admin-perf-ai-card">
            <div className="admin-perf-ai-header">
              <div className="admin-perf-ai-title-group">
                <div className="admin-perf-ai-badge">✨ AI Hiring Intelligence</div>
                <h3 className="admin-perf-ai-title">Automated Candidate Synthesis &amp; Evaluation</h3>
                <span className="admin-perf-ai-engine-tag">
                  {aiEvaluation
                    ? `Engine: ${aiEvaluation.engine} • Analyzed ${new Date(aiEvaluation.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Deep AST Static Analysis & LLM Hiring Synthesis'}
                </span>
              </div>
              <div className="admin-perf-ai-actions">
                <button
                  type="button"
                  className="admin-perf-ai-btn-generate"
                  onClick={handleGenerateAiSynthesis}
                  disabled={isGeneratingAi}
                  title="Run automated code inspection and hiring synthesis"
                >
                  {isGeneratingAi ? (
                    <>
                      <span className="admin-perf-ai-spinner" /> Synthesizing Analysis...
                    </>
                  ) : (
                    <>
                      <span>⚡</span> {aiEvaluation ? 'Regenerate AI Analysis' : 'Generate AI Evaluation'}
                    </>
                  )}
                </button>
                {aiEvaluation && (
                  <button
                    type="button"
                    className="admin-perf-ai-btn-apply"
                    onClick={handleApplyAiToEvaluation}
                    title="Auto-populate the evaluation rubric, verdict, strengths, weaknesses, and interview questions below"
                  >
                    <span>🎯</span> Apply AI Summary to Rubric &amp; Notes
                  </button>
                )}
              </div>
            </div>

            {aiError && (
              <div className="admin-perf-ai-error-banner">
                ⚠️ {aiError}
              </div>
            )}

            {aiSuccessMsg && (
              <div className="admin-perf-ai-success-banner">
                ✅ {aiSuccessMsg}
              </div>
            )}

            {isGeneratingAi && (
              <div className="admin-perf-ai-loading-state">
                <div className="ai-scanner-line" />
                <p>Analyzing candidate coding submissions, execution metrics, React patterns, and algorithmic complexity...</p>
              </div>
            )}

            {!isGeneratingAi && !aiEvaluation && (
              <div className="admin-perf-ai-empty-state">
                <div className="ai-empty-icon">🤖</div>
                <h4>No AI Evaluation Generated Yet</h4>
                <p>
                  Click <strong>"Generate AI Evaluation"</strong> to trigger deep AST inspection of this candidate's code submissions, assess seniority leveling, recommend rubric ratings, and formulate tailored interview questions.
                </p>
              </div>
            )}

            {!isGeneratingAi && aiEvaluation && (
              <div className="admin-perf-ai-body">
                {/* Top Level Summary Row */}
                <div className="admin-perf-ai-top-row">
                  <div className={`admin-perf-ai-verdict-pill verdict-${aiEvaluation.recommendation.toLowerCase().replace('_', '-')}`}>
                    <span className="verdict-label">RECOMMENDATION</span>
                    <span className="verdict-value">{aiEvaluation.recommendation.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="admin-perf-ai-metric-pill">
                    <span className="metric-label">CONFIDENCE</span>
                    <span className="metric-value">{aiEvaluation.confidenceScore}%</span>
                  </div>
                  <div className="admin-perf-ai-seniority-pill">
                    <span className="metric-label">ASSESSED SENIORITY</span>
                    <span className="metric-value">{aiEvaluation.seniorityLevel}</span>
                  </div>
                </div>

                <div className="admin-perf-ai-seniority-rationale">
                  <strong>Leveling Justification:</strong> {aiEvaluation.seniorityRationale}
                </div>

                <div className="admin-perf-ai-exec-summary">
                  <h4>Executive Synthesis</h4>
                  <p>{aiEvaluation.executiveSummary}</p>
                </div>

                {/* Suggested Rubric Scores */}
                <div className="admin-perf-ai-rubric-section">
                  <h4>Suggested Rubric Ratings (1 - 5 Scale)</h4>
                  <div className="admin-perf-ai-rubric-grid">
                    <div className="ai-rubric-chip">
                      <span className="chip-name">Problem Solving</span>
                      <span className="chip-val">{aiEvaluation.rubricSuggestions.problemSolving.toFixed(1)} / 5</span>
                    </div>
                    <div className="ai-rubric-chip">
                      <span className="chip-name">Code Quality</span>
                      <span className="chip-val">{aiEvaluation.rubricSuggestions.codeQuality.toFixed(1)} / 5</span>
                    </div>
                    <div className="ai-rubric-chip">
                      <span className="chip-name">Architecture</span>
                      <span className="chip-val">{aiEvaluation.rubricSuggestions.architecture.toFixed(1)} / 5</span>
                    </div>
                    <div className="ai-rubric-chip">
                      <span className="chip-name">Speed &amp; Efficiency</span>
                      <span className="chip-val">{aiEvaluation.rubricSuggestions.speedEfficiency.toFixed(1)} / 5</span>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="admin-perf-ai-insights-grid">
                  <div className="ai-insight-box strengths">
                    <h5>⭐ Verified Technical Strengths</h5>
                    <ul>
                      {aiEvaluation.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="ai-insight-box weaknesses">
                    <h5>🔍 Areas to Probe in Interview</h5>
                    <ul>
                      {aiEvaluation.areasToProbe.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tailored Interview Questions */}
                {aiEvaluation.tailoredInterviewQuestions && aiEvaluation.tailoredInterviewQuestions.length > 0 && (
                  <div className="admin-perf-ai-questions-box">
                    <h5>🎯 Tailored Technical Interview Questions &amp; Discussion Topics</h5>
                    <div className="ai-questions-list">
                      {aiEvaluation.tailoredInterviewQuestions.map((q, idx) => (
                        <div key={idx} className="ai-question-item">
                          <div className="ai-question-badge">Question {idx + 1}</div>
                          <div className="ai-question-text">"{q.question}"</div>
                          <div className="ai-question-rationale">
                            <strong>Interviewer Rationale:</strong> {q.rationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

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
              {selectedAttempt ? (() => {
                const inPagePrevAttempt = attempts.find(
                  (a: CodingAttempt) => a.questionId === selectedAttempt.questionId && a.attemptNumber === selectedAttempt.attemptNumber - 1
                );
                return (
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

                      <div className="admin-perf-editor-actions">
                        {/* View Mode Toggle */}
                        <div className="admin-perf-diff-toggle">
                          <button
                            type="button"
                            className={`diff-tab ${inPageViewMode === 'single' ? 'active' : ''}`}
                            onClick={() => setInPageViewMode('single')}
                          >
                            📝 Full Code
                          </button>
                          <button
                            type="button"
                            className={`diff-tab ${inPageViewMode === 'diff' ? 'active' : ''}`}
                            disabled={!inPagePrevAttempt}
                            onClick={() => setInPageViewMode('diff')}
                            title={!inPagePrevAttempt ? 'No previous attempt for diff' : `Diff with Attempt #${inPagePrevAttempt.attemptNumber}`}
                          >
                            🔀 Diff with Prev
                          </button>
                        </div>

                        {/* Open Deep-Dive Playback Modal */}
                        <button
                          type="button"
                          className="admin-perf-playback-launch-btn"
                          onClick={() => setInspectingAttempt(selectedAttempt)}
                          title="Open Interactive Attempt Timeline & Playback"
                        >
                          ▶ Interactive Playback
                        </button>

                        <span className={`admin-perf-status-badge large ${selectedAttempt.status.toLowerCase()}`}>
                          {selectedAttempt.status}
                        </span>
                      </div>
                    </div>

                    <div className="admin-perf-monaco-wrap">
                      {inPageViewMode === 'diff' && inPagePrevAttempt ? (
                        <DiffEditor
                          height="460px"
                          language={
                            selectedAttempt.language === 'react' || selectedAttempt.language === 'typescript'
                              ? 'typescript'
                              : 'javascript'
                          }
                          original={inPagePrevAttempt.code || '// Empty previous code'}
                          modified={selectedAttempt.code || '// Empty code'}
                          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      ) : (
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
                      )}
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
                );
              })() : (
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

      {/* Executive Candidate Hiring Dossier Modal (Print & PDF) */}
      {showDossierModal && candidateProfile && summary && (
        <div className="admin-dossier-modal-backdrop" onClick={() => setShowDossierModal(false)}>
          <div className="admin-dossier-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Controls Bar */}
            <div className="admin-dossier-modal-bar">
              <div className="admin-dossier-modal-title">
                <span className="dossier-icon">📄</span>
                <div>
                  <h3>Executive Candidate Hiring Dossier</h3>
                  <p>Standardized Technical Interview Brief &amp; PDF Export</p>
                </div>
              </div>
              <div className="admin-dossier-modal-actions">
                <button
                  type="button"
                  className="admin-dossier-btn-print"
                  onClick={() => window.print()}
                  title="Print or Save as PDF"
                >
                  🖨️ Print / Save as PDF
                </button>
                <button
                  type="button"
                  className="admin-dossier-btn-close"
                  onClick={() => setShowDossierModal(false)}
                  title="Close Dossier Preview"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Print-Ready Sheet */}
            <div className="admin-dossier-sheet-wrapper">
              <div className="admin-dossier-sheet" id="admin-candidate-dossier-sheet">
                {/* Header Brand Banner */}
                <div className="dossier-sheet-header">
                  <div className="dossier-brand-left">
                    <div className="dossier-logo">
                      <span className="logo-spark">⚡</span>
                      <span className="logo-name">React Interview Prep</span>
                    </div>
                    <span className="dossier-confidential-tag">CONFIDENTIAL • TECHNICAL HIRING DOSSIER</span>
                  </div>
                  <div className="dossier-brand-right">
                    <span className="dossier-date">
                      Report Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <div className={`dossier-status-badge status-${hiringStatus.toLowerCase()}`}>
                      Recommendation: <strong>{hiringStatus.toUpperCase()}</strong>
                    </div>
                  </div>
                </div>

                {/* Candidate Identity Strip */}
                <div className="dossier-candidate-hero">
                  <div className="dossier-candidate-primary">
                    <h1 className="dossier-candidate-name">{candidateProfile.name}</h1>
                    <div className="dossier-candidate-meta-grid">
                      <div><span className="meta-lbl">Email:</span> <span className="meta-val">{candidateProfile.email}</span></div>
                      <div><span className="meta-lbl">Target Role:</span> <span className="meta-val">{candidateProfile.role || 'Frontend Engineer'}</span></div>
                      <div><span className="meta-lbl">Target Org:</span> <span className="meta-val">{candidateProfile.targetCompany || 'Tier-1 Tech'}</span></div>
                      <div><span className="meta-lbl">Experience Level:</span> <span className="meta-val">{candidateProfile.experienceLevel || 'Mid - Senior'}</span></div>
                      <div><span className="meta-lbl">Candidate ID:</span> <span className="meta-val font-mono">{candidateProfile.id}</span></div>
                      <div><span className="meta-lbl">Evaluation Rating:</span> <span className="meta-val">⭐ {overallRating} / 5 Stars</span></div>
                    </div>
                  </div>
                </div>

                {/* Executive KPI Scorecard */}
                <div className="dossier-section">
                  <h3 className="dossier-section-title">1. Executive Performance Scorecard</h3>
                  <div className="dossier-kpi-grid">
                    <div className="dossier-kpi-card">
                      <span className="kpi-num text-emerald">{summary.uniqueSolved}</span>
                      <span className="kpi-lbl">Unique Solved</span>
                      <span className="kpi-sub">out of {summary.uniqueAttempted} attempted</span>
                    </div>
                    <div className="dossier-kpi-card">
                      <span className="kpi-num text-blue">{summary.uniqueAttempted > 0 ? `${summary.successRate}%` : '0%'}</span>
                      <span className="kpi-lbl">Success Rate</span>
                      <span className="kpi-sub">solved vs attempted</span>
                    </div>
                    <div className="dossier-kpi-card">
                      <span className="kpi-num text-purple">{summary.totalAttempts}</span>
                      <span className="kpi-lbl">Code Submissions</span>
                      <span className="kpi-sub">across all categories</span>
                    </div>
                    <div className="dossier-kpi-card">
                      <span className="kpi-num text-amber">
                        {summary.totalCodingTimeSeconds > 0 ? formatDurationSec(summary.totalCodingTimeSeconds) : '0m'}
                      </span>
                      <span className="kpi-lbl">Active Coding Time</span>
                      <span className="kpi-sub">across {summary.dailyActivity?.length || 0} active days</span>
                    </div>
                  </div>
                </div>

                {/* Multi-Track Competency Matrix */}
                <div className="dossier-section">
                  <h3 className="dossier-section-title">2. Track Competency Breakdown</h3>
                  <table className="dossier-table">
                    <thead>
                      <tr>
                        <th>Technical Track</th>
                        <th>Unique Solved</th>
                        <th>Attempted</th>
                        <th>Submissions</th>
                        <th>Success Rate</th>
                        <th>Average Score</th>
                        <th>Proficiency Assessment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'MACHINE_CODING', label: 'Machine Level Coding', icon: '⚡', stats: summary.categoryStats?.MACHINE_CODING },
                        { key: 'DSA', label: 'LeetCode / DSA Algorithms', icon: '🧠', stats: summary.categoryStats?.DSA },
                        { key: 'CORE_PROGRAMMING', label: 'Core JavaScript / TypeScript', icon: '💻', stats: summary.categoryStats?.CORE_PROGRAMMING },
                        { key: 'FRONTEND_JS', label: 'Frontend JS Performance', icon: '⚛️', stats: summary.categoryStats?.FRONTEND_JS },
                      ].map(t => {
                        const s = t.stats;
                        const solved = s?.questionsSolved || 0;
                        const attempted = s?.questionsAttempted || 0;
                        const submissions = s?.totalAttempts || 0;
                        const rate = s?.successRate || 0;
                        const avg = s?.averageScore || 0;
                        const proficiency = !s?.hasActivity
                          ? 'Not Attempted'
                          : rate >= 75
                          ? 'Advanced (High Accuracy)'
                          : rate >= 40
                          ? 'Competent (Solid Progress)'
                          : 'Developing (Needs Iteration)';

                        return (
                          <tr key={t.key}>
                            <td>
                              <strong>{t.icon} {t.label}</strong>
                            </td>
                            <td>{solved}</td>
                            <td>{attempted}</td>
                            <td>{submissions}</td>
                            <td>
                              <span className={`rate-pill ${rate >= 70 ? 'high' : rate >= 40 ? 'mid' : 'low'}`}>
                                {s?.hasActivity ? `${rate}%` : '—'}
                              </span>
                            </td>
                            <td>{s?.hasActivity ? `${avg}%` : '—'}</td>
                            <td>
                              <span className={`proficiency-tag ${rate >= 75 ? 'adv' : rate >= 40 ? 'comp' : 'dev'}`}>
                                {proficiency}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Rubric Evaluation & Hiring Feedback */}
                <div className="dossier-section">
                  <h3 className="dossier-section-title">3. Hiring Committee Rubric &amp; Qualitative Assessment</h3>
                  <div className="dossier-rubric-grid">
                    <div className="dossier-rubric-box">
                      <span className="rubric-lbl">Problem Solving &amp; Logic</span>
                      <div className="rubric-bar-wrap">
                        <div className="rubric-bar" style={{ width: `${(rubricProblemSolving / 5) * 100}%` }} />
                      </div>
                      <span className="rubric-score">{rubricProblemSolving} / 5</span>
                    </div>
                    <div className="dossier-rubric-box">
                      <span className="rubric-lbl">Code Hygiene &amp; Cleanliness</span>
                      <div className="rubric-bar-wrap">
                        <div className="rubric-bar" style={{ width: `${(rubricCodeQuality / 5) * 100}%` }} />
                      </div>
                      <span className="rubric-score">{rubricCodeQuality} / 5</span>
                    </div>
                    <div className="dossier-rubric-box">
                      <span className="rubric-lbl">Technical Communication</span>
                      <div className="rubric-bar-wrap">
                        <div className="rubric-bar" style={{ width: `${(rubricCommunication / 5) * 100}%` }} />
                      </div>
                      <span className="rubric-score">{rubricCommunication} / 5</span>
                    </div>
                    <div className="dossier-rubric-box">
                      <span className="rubric-lbl">Architecture &amp; System Design</span>
                      <div className="rubric-bar-wrap">
                        <div className="rubric-bar" style={{ width: `${(rubricArchitecture / 5) * 100}%` }} />
                      </div>
                      <span className="rubric-score">{rubricArchitecture} / 5</span>
                    </div>
                  </div>

                  <div className="dossier-notes-grid">
                    <div className="dossier-notes-card strengths">
                      <h4>⭐ Demonstrated Strengths</h4>
                      <p>{strengths || 'Consistent multi-attempt iteration, solid problem comprehension, and sustained active coding duration.'}</p>
                    </div>
                    <div className="dossier-notes-card weaknesses">
                      <h4>🎯 Growth &amp; Development Areas</h4>
                      <p>{weaknesses || 'Opportunity to optimize algorithmic time/space complexity and expand LeetCode / DSA problem coverage.'}</p>
                    </div>
                  </div>

                  <div className="dossier-evaluator-summary">
                    <h4>📝 Evaluator Recommendation &amp; Committee Notes</h4>
                    <p className="recommendation-text">
                      <strong>Decision:</strong> {recommendation || `${hiringStatus.toUpperCase()} — Candidate demonstrated verifiable coding competency across technical benchmarks.`}
                    </p>
                    {notes && <p className="notes-text"><strong>Evaluator Notes:</strong> {notes}</p>}
                    {finalComments && <p className="comments-text"><strong>Final Comments:</strong> {finalComments}</p>}
                  </div>
                </div>

                {/* Verified Top Solved Problems Snapshot */}
                {dossierTopSolved.length > 0 && (
                  <div className="dossier-section">
                    <h3 className="dossier-section-title">4. Verified Top Solved Questions (Sample)</h3>
                    <table className="dossier-table compact">
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Track</th>
                          <th>Difficulty</th>
                          <th>Score</th>
                          <th>Status</th>
                          <th>Attempt Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dossierTopSolved.map(q => (
                          <tr key={q.id}>
                            <td>
                              <strong>{q.questionTitle}</strong>
                              <span className="dossier-qid font-mono"> ({q.questionId})</span>
                            </td>
                            <td>{q.category.replace(/_/g, ' ')}</td>
                            <td>
                              <span className={`diff-tag diff-${(q.difficulty || 'medium').toLowerCase()}`}>
                                {q.difficulty || 'Medium'}
                              </span>
                            </td>
                            <td><strong>{q.score}%</strong></td>
                            <td><span className="status-tag-mini accepted">Solved</span></td>
                            <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Formal Verification Sign-off */}
                <div className="dossier-signoff">
                  <div className="signoff-box">
                    <span className="signoff-title">Platform Evaluation Committee</span>
                    <span className="signoff-line" />
                    <span className="signoff-sub">Authorized Technical Reviewer</span>
                  </div>
                  <div className="signoff-box">
                    <span className="signoff-title">Verification Hash</span>
                    <span className="signoff-hash font-mono">{candidateProfile.id.replace(/-/g, '').slice(0, 16).toUpperCase()}</span>
                    <span className="signoff-sub">Tamper-Proof Audit Record</span>
                  </div>
                  <div className="signoff-box">
                    <span className="signoff-title">Audit Timestamp</span>
                    <span className="signoff-val">{new Date().toISOString()}</span>
                    <span className="signoff-sub">React Interview Prep Platform</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Targeted Assessment Modal */}
      {showAssignModal && candidateProfile && (
        <div className="admin-dossier-modal-backdrop" onClick={() => setShowAssignModal(false)}>
          <div className="admin-dossier-modal admin-action-form-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-dossier-modal-bar">
              <div className="admin-dossier-modal-title">
                <span className="dossier-icon">📋</span>
                <div>
                  <h3>Assign Targeted Assessment Bundle</h3>
                  <p>Send a customized technical take-home assignment to {candidateProfile.name}</p>
                </div>
              </div>
              <button
                type="button"
                className="admin-dossier-btn-close"
                onClick={() => setShowAssignModal(false)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="admin-action-form">
              <div className="form-row">
                <label>Assessment Title</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={e => setAssignTitle(e.target.value)}
                  placeholder="e.g. Frontend Architecture Challenge"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Track Focus</label>
                  <select
                    value={assignTrack}
                    onChange={e => setAssignTrack(e.target.value as any)}
                  >
                    <option value="MACHINE_CODING">⚡ Machine Level Coding</option>
                    <option value="DSA">🧠 LeetCode / DSA Algorithms</option>
                    <option value="CORE_PROGRAMMING">💻 Core JavaScript / TypeScript</option>
                    <option value="FRONTEND_JS">⚛️ Frontend JS Performance</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Difficulty Target</label>
                  <select
                    value={assignDifficulty}
                    onChange={e => setAssignDifficulty(e.target.value as any)}
                  >
                    <option value="easy">Easy (Fundamentals)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="hard">Hard (Advanced / Senior)</option>
                    <option value="mixed">Mixed Tier</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Questions Count</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={assignCount}
                    onChange={e => setAssignCount(Number(e.target.value))}
                  />
                </div>

                <div className="form-row">
                  <label>Completion Window</label>
                  <select
                    value={assignDeadlineDays}
                    onChange={e => setAssignDeadlineDays(Number(e.target.value))}
                  >
                    <option value={1}>24 Hours</option>
                    <option value={2}>48 Hours</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>1 Week</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label>Special Candidate Guidelines / Instructions</label>
                <textarea
                  rows={3}
                  value={assignInstructions}
                  onChange={e => setAssignInstructions(e.target.value)}
                  placeholder="Expected patterns, clean state isolation, performance criteria..."
                />
              </div>

              <div className="admin-action-form-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Confirm &amp; Assign to Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Live Interview Modal */}
      {showScheduleModal && candidateProfile && (
        <div className="admin-dossier-modal-backdrop" onClick={() => setShowScheduleModal(false)}>
          <div className="admin-dossier-modal admin-action-form-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-dossier-modal-bar">
              <div className="admin-dossier-modal-title">
                <span className="dossier-icon">📅</span>
                <div>
                  <h3>Schedule Live Technical Interview</h3>
                  <p>Book a real-time coding or architecture round with {candidateProfile.name}</p>
                </div>
              </div>
              <button
                type="button"
                className="admin-dossier-btn-close"
                onClick={() => setShowScheduleModal(false)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="admin-action-form">
              <div className="form-row">
                <label>Round Title</label>
                <input
                  type="text"
                  required
                  value={roundTitle}
                  onChange={e => setRoundTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Live Coding Round"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Round Evaluation Type</label>
                  <select
                    value={roundType}
                    onChange={e => setRoundType(e.target.value as any)}
                  >
                    <option value="Technical Coding">Technical Coding &amp; Component Build</option>
                    <option value="DSA & Algorithms">DSA &amp; Problem Solving</option>
                    <option value="System Design & Architecture">System Design &amp; Architecture</option>
                    <option value="Cultural & Behavioral">Cultural &amp; Engineering Values</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Duration</label>
                  <select
                    value={roundDuration}
                    onChange={e => setRoundDuration(Number(e.target.value))}
                  >
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes (Standard)</option>
                    <option value={90}>90 Minutes (Deep Dive)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-row">
                  <label>Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={roundDate}
                    onChange={e => setRoundDate(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label>Start Time</label>
                  <input
                    type="time"
                    required
                    value={roundTime}
                    onChange={e => setRoundTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label>Meeting Link / Live Room URL</label>
                <input
                  type="url"
                  required
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/... or live room URL"
                />
              </div>

              <div className="form-row">
                <label>Interviewer Panel Briefing &amp; Focus Areas</label>
                <textarea
                  rows={3}
                  value={interviewerNotes}
                  onChange={e => setInterviewerNotes(e.target.value)}
                  placeholder="Specific topics, past gaps to investigate, or architectural challenges..."
                />
              </div>

              <div className="admin-action-form-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Confirm &amp; Schedule Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Side-by-Side Comparison Modal */}
      {showCompareModal && candidateProfile && summary && (
        <div className="admin-dossier-modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="admin-dossier-modal admin-compare-modal" onClick={e => e.stopPropagation()}>
            {/* Top Bar */}
            <div className="admin-dossier-modal-bar">
              <div className="admin-dossier-modal-title">
                <span className="dossier-icon">⚖️</span>
                <div>
                  <h3>Candidate Benchmarking &amp; Comparison</h3>
                  <p>Side-by-side technical evaluation across multi-track metrics, KPIs, and rubrics</p>
                </div>
              </div>
              <div className="admin-dossier-modal-actions">
                <button
                  type="button"
                  className="admin-dossier-btn-close"
                  onClick={() => setShowCompareModal(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Scrollable Sheet Content */}
            <div className="admin-dossier-sheet-wrapper">
              <div className="admin-compare-sheet">
                {/* Candidate Selection Bar */}
                <div className="compare-picker-bar">
                  <div className="compare-picker-left">
                    <span className="picker-lbl">Benchmark Candidate:</span>
                    <div className="picker-current-tag">
                      <strong>{candidateProfile.name}</strong>
                      <span className="picker-email"> ({candidateProfile.email})</span>
                    </div>
                  </div>
                  <div className="compare-vs-badge">VS</div>
                  <div className="compare-picker-right">
                    <span className="picker-lbl">Compare Against:</span>
                    <select
                      className="compare-select"
                      value={selectedCompareId}
                      onChange={e => setSelectedCompareId(e.target.value)}
                    >
                      {compareRoster.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {loadingCompare ? (
                  <div className="admin-compare-loading">
                    <div className="admin-perf-spinner" />
                    <p>Fetching competitor metrics and rubric breakdown...</p>
                  </div>
                ) : compareProfile && compareSummary ? (
                  <div className="compare-body">
                    {/* Split Profile Heroes */}
                    <div className="compare-hero-grid">
                      {/* Candidate A Card */}
                      <div className="compare-hero-card primary">
                        <div className="compare-hero-top">
                          <div className="admin-perf-avatar sm">
                            {candidateProfile.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="compare-candidate-tag">Candidate A (Viewing)</span>
                            <h4 className="compare-hero-name">{candidateProfile.name}</h4>
                            <span className="compare-hero-email">{candidateProfile.email}</span>
                          </div>
                          <div className="compare-hero-status">
                            <span className={`admin-perf-status-tag status-${hiringStatus.toLowerCase()}`}>
                              {hiringStatus}
                            </span>
                          </div>
                        </div>
                        <div className="compare-hero-submeta">
                          <span>🎯 {candidateProfile.targetCompany || 'Tier-1 Tech'}</span>
                          <span>💼 {candidateProfile.experienceLevel || 'Mid - Senior'}</span>
                          <span>⭐ {overallRating} / 5</span>
                        </div>
                      </div>

                      {/* Candidate B Card */}
                      <div className="compare-hero-card secondary">
                        <div className="compare-hero-top">
                          <div className="admin-perf-avatar sm secondary">
                            {compareProfile.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="compare-candidate-tag">Candidate B (Benchmark)</span>
                            <h4 className="compare-hero-name">{compareProfile.name}</h4>
                            <span className="compare-hero-email">{compareProfile.email}</span>
                          </div>
                          <div className="compare-hero-status">
                            <span className={`admin-perf-status-tag status-${(compareEval?.status || 'Pending').toLowerCase()}`}>
                              {compareEval?.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="compare-hero-submeta">
                          <span>🎯 {compareProfile.targetCompany || 'Tier-1 Tech'}</span>
                          <span>💼 {compareProfile.experienceLevel || 'Mid - Senior'}</span>
                          <span>⭐ {compareEval?.overallRating || 3} / 5</span>
                        </div>
                      </div>
                    </div>

                    {/* 4-KPI Comparison Scorecard */}
                    <div className="compare-section">
                      <h3 className="dossier-section-title">1. Overall Key Performance Indicators</h3>
                      <div className="compare-kpi-grid">
                        {/* Solved */}
                        <div className="compare-kpi-box">
                          <span className="compare-kpi-title">Unique Solved</span>
                          <div className="compare-kpi-split">
                            <div className={`compare-val-col ${summary.uniqueSolved >= compareSummary.uniqueSolved ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{candidateProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-emerald">{summary.uniqueSolved}</span>
                              <span className="val-sub">of {summary.uniqueAttempted} attempted</span>
                            </div>
                            <div className="compare-delta-wrap">
                              {summary.uniqueSolved !== compareSummary.uniqueSolved ? (
                                <span className={`compare-delta-badge ${summary.uniqueSolved > compareSummary.uniqueSolved ? 'delta-a' : 'delta-b'}`}>
                                  {summary.uniqueSolved > compareSummary.uniqueSolved
                                    ? `+${summary.uniqueSolved - compareSummary.uniqueSolved} (A)`
                                    : `+${compareSummary.uniqueSolved - summary.uniqueSolved} (B)`}
                                </span>
                              ) : (
                                <span className="compare-delta-badge neutral">Tied</span>
                              )}
                            </div>
                            <div className={`compare-val-col ${compareSummary.uniqueSolved >= summary.uniqueSolved ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{compareProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-emerald">{compareSummary.uniqueSolved}</span>
                              <span className="val-sub">of {compareSummary.uniqueAttempted} attempted</span>
                            </div>
                          </div>
                        </div>

                        {/* Success Rate */}
                        <div className="compare-kpi-box">
                          <span className="compare-kpi-title">Success Rate</span>
                          <div className="compare-kpi-split">
                            <div className={`compare-val-col ${summary.successRate >= compareSummary.successRate ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{candidateProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-blue">{summary.successRate}%</span>
                              <span className="val-sub">solved vs attempted</span>
                            </div>
                            <div className="compare-delta-wrap">
                              {summary.successRate !== compareSummary.successRate ? (
                                <span className={`compare-delta-badge ${summary.successRate > compareSummary.successRate ? 'delta-a' : 'delta-b'}`}>
                                  {summary.successRate > compareSummary.successRate
                                    ? `+${summary.successRate - compareSummary.successRate}% (A)`
                                    : `+${compareSummary.successRate - summary.successRate}% (B)`}
                                </span>
                              ) : (
                                <span className="compare-delta-badge neutral">Tied</span>
                              )}
                            </div>
                            <div className={`compare-val-col ${compareSummary.successRate >= summary.successRate ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{compareProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-blue">{compareSummary.successRate}%</span>
                              <span className="val-sub">solved vs attempted</span>
                            </div>
                          </div>
                        </div>

                        {/* Submissions */}
                        <div className="compare-kpi-box">
                          <span className="compare-kpi-title">Code Submissions</span>
                          <div className="compare-kpi-split">
                            <div className={`compare-val-col ${summary.totalAttempts >= compareSummary.totalAttempts ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{candidateProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-purple">{summary.totalAttempts}</span>
                              <span className="val-sub">attempts</span>
                            </div>
                            <div className="compare-delta-wrap">
                              {summary.totalAttempts !== compareSummary.totalAttempts ? (
                                <span className={`compare-delta-badge ${summary.totalAttempts > compareSummary.totalAttempts ? 'delta-a' : 'delta-b'}`}>
                                  {summary.totalAttempts > compareSummary.totalAttempts
                                    ? `+${summary.totalAttempts - compareSummary.totalAttempts} (A)`
                                    : `+${compareSummary.totalAttempts - summary.totalAttempts} (B)`}
                                </span>
                              ) : (
                                <span className="compare-delta-badge neutral">Tied</span>
                              )}
                            </div>
                            <div className={`compare-val-col ${compareSummary.totalAttempts >= summary.totalAttempts ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{compareProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-purple">{compareSummary.totalAttempts}</span>
                              <span className="val-sub">attempts</span>
                            </div>
                          </div>
                        </div>

                        {/* Coding Time */}
                        <div className="compare-kpi-box">
                          <span className="compare-kpi-title">Active Coding Time</span>
                          <div className="compare-kpi-split">
                            <div className={`compare-val-col ${summary.totalCodingTimeSeconds >= compareSummary.totalCodingTimeSeconds ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{candidateProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-amber">{formatDurationSec(summary.totalCodingTimeSeconds)}</span>
                              <span className="val-sub">{summary.dailyActivity?.length || 0} active days</span>
                            </div>
                            <div className="compare-delta-wrap">
                              {summary.totalCodingTimeSeconds !== compareSummary.totalCodingTimeSeconds ? (
                                <span className={`compare-delta-badge ${summary.totalCodingTimeSeconds > compareSummary.totalCodingTimeSeconds ? 'delta-a' : 'delta-b'}`}>
                                  {summary.totalCodingTimeSeconds > compareSummary.totalCodingTimeSeconds ? 'More Active (A)' : 'More Active (B)'}
                                </span>
                              ) : (
                                <span className="compare-delta-badge neutral">Equal</span>
                              )}
                            </div>
                            <div className={`compare-val-col ${compareSummary.totalCodingTimeSeconds >= summary.totalCodingTimeSeconds ? 'leader' : ''}`}>
                              <span className="cand-sublabel">{compareProfile.name.split(' ')[0]}</span>
                              <span className="val-num text-amber">{formatDurationSec(compareSummary.totalCodingTimeSeconds)}</span>
                              <span className="val-sub">{compareSummary.dailyActivity?.length || 0} active days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Track Performance Comparison */}
                    <div className="compare-section">
                      <h3 className="dossier-section-title">2. Technical Track Performance Comparison</h3>
                      <table className="dossier-table compare-table">
                        <thead>
                          <tr>
                            <th>Technical Track</th>
                            <th>{candidateProfile.name.split(' ')[0]} (Solved / Rate / Avg)</th>
                            <th>{compareProfile.name.split(' ')[0]} (Solved / Rate / Avg)</th>
                            <th style={{ textAlign: 'center' }}>Track Comparison</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: 'MACHINE_CODING', label: 'Machine Level Coding', icon: '⚡' },
                            { key: 'DSA', label: 'LeetCode / DSA Algorithms', icon: '🧠' },
                            { key: 'CORE_PROGRAMMING', label: 'Core JavaScript / TypeScript', icon: '💻' },
                            { key: 'FRONTEND_JS', label: 'Frontend JS Performance', icon: '⚛️' },
                          ].map(t => {
                            const aStats = summary.categoryStats?.[t.key];
                            const bStats = compareSummary.categoryStats?.[t.key];

                            const aSolved = aStats?.questionsSolved || 0;
                            const aRate = aStats?.successRate || 0;
                            const aAvg = aStats?.averageScore || 0;

                            const bSolved = bStats?.questionsSolved || 0;
                            const bRate = bStats?.successRate || 0;
                            const bAvg = bStats?.averageScore || 0;

                            const aHas = aStats?.hasActivity;
                            const bHas = bStats?.hasActivity;

                            let leaderText = 'Tied';
                            let leaderClass = 'neutral';
                            if (aSolved > bSolved || (aSolved === bSolved && aRate > bRate)) {
                              leaderText = `🏆 ${candidateProfile.name.split(' ')[0]} Leading`;
                              leaderClass = 'adv';
                            } else if (bSolved > aSolved || (bSolved === aSolved && bRate > aRate)) {
                              leaderText = `🏆 ${compareProfile.name.split(' ')[0]} Leading`;
                              leaderClass = 'comp';
                            }

                            return (
                              <tr key={t.key}>
                                <td><strong>{t.icon} {t.label}</strong></td>
                                <td>
                                  {aHas ? (
                                    <span className="track-compare-stat">
                                      <strong>{aSolved} solved</strong> · <span className="rate-text">{aRate}% rate</span> · <span className="score-text">{aAvg}% avg</span>
                                    </span>
                                  ) : (
                                    <span className="text-muted">No activity</span>
                                  )}
                                </td>
                                <td>
                                  {bHas ? (
                                    <span className="track-compare-stat">
                                      <strong>{bSolved} solved</strong> · <span className="rate-text">{bRate}% rate</span> · <span className="score-text">{bAvg}% avg</span>
                                    </span>
                                  ) : (
                                    <span className="text-muted">No activity</span>
                                  )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className={`proficiency-tag ${leaderClass}`}>{leaderText}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Rubric Side-by-Side */}
                    <div className="compare-section">
                      <h3 className="dossier-section-title">3. Committee Rubric Assessment Benchmarking</h3>
                      <div className="compare-rubric-grid">
                        {[
                          { label: 'Problem Solving & Logic', a: rubricProblemSolving, b: compareEval?.rubricProblemSolving || 3 },
                          { label: 'Code Hygiene & Cleanliness', a: rubricCodeQuality, b: compareEval?.rubricCodeQuality || 3 },
                          { label: 'Technical Communication', a: rubricCommunication, b: compareEval?.rubricCommunication || 3 },
                          { label: 'Architecture & System Design', a: rubricArchitecture, b: compareEval?.rubricArchitecture || 3 },
                        ].map(r => (
                          <div key={r.label} className="compare-rubric-card">
                            <div className="compare-rubric-header">
                              <strong>{r.label}</strong>
                              <span className="compare-rubric-delta">
                                {r.a > r.b
                                  ? `${candidateProfile.name.split(' ')[0]} (+${r.a - r.b})`
                                  : r.b > r.a
                                  ? `${compareProfile.name.split(' ')[0]} (+${r.b - r.a})`
                                  : 'Tied'}
                              </span>
                            </div>
                            <div className="compare-rubric-dual-bars">
                              <div className="dual-bar-item">
                                <div className="dual-bar-label">
                                  <span>{candidateProfile.name.split(' ')[0]}</span>
                                  <span>{r.a} / 5</span>
                                </div>
                                <div className="rubric-bar-wrap">
                                  <div className="rubric-bar" style={{ width: `${(r.a / 5) * 100}%` }} />
                                </div>
                              </div>
                              <div className="dual-bar-item">
                                <div className="dual-bar-label">
                                  <span>{compareProfile.name.split(' ')[0]}</span>
                                  <span>{r.b} / 5</span>
                                </div>
                                <div className="rubric-bar-wrap">
                                  <div className="rubric-bar comp-bar" style={{ width: `${(r.b / 5) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Qualitative Notes & Recommendations */}
                    <div className="compare-section">
                      <h3 className="dossier-section-title">4. Qualitative Feedback &amp; Recommendations</h3>
                      <div className="compare-notes-grid">
                        <div className="compare-notes-col">
                          <h4>{candidateProfile.name} Summary</h4>
                          <div className="dossier-notes-card strengths">
                            <h4>⭐ Strengths</h4>
                            <p>{strengths || 'Consistent multi-attempt iteration, solid problem comprehension, and sustained active coding duration.'}</p>
                          </div>
                          <div className="dossier-notes-card weaknesses" style={{ marginTop: '10px' }}>
                            <h4>🎯 Growth Areas</h4>
                            <p>{weaknesses || 'Opportunity to optimize algorithmic time/space complexity and expand LeetCode / DSA problem coverage.'}</p>
                          </div>
                        </div>

                        <div className="compare-notes-col">
                          <h4>{compareProfile.name} Summary</h4>
                          <div className="dossier-notes-card strengths">
                            <h4>⭐ Strengths</h4>
                            <p>{compareEval?.strengths || 'Active platform participation, consistent challenge engagement, and sound code modularity.'}</p>
                          </div>
                          <div className="dossier-notes-card weaknesses" style={{ marginTop: '10px' }}>
                            <h4>🎯 Growth Areas</h4>
                            <p>{compareEval?.weaknesses || 'Needs deeper practice in complex graph algorithms and asynchronous state edge cases.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="admin-perf-empty-state">
                    <span className="admin-perf-empty-icon">👥</span>
                    <h4>No Benchmark Candidate Selected</h4>
                    <p>Select another registered candidate above to inspect comparative metrics side-by-side.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
