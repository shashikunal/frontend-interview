export type TrackCategory = 'MACHINE_CODING' | 'DSA' | 'CORE_PROGRAMMING' | string;

export interface CodingAttempt {
  id: string;
  userId: string;
  sessionId?: string | null;
  questionId: string;
  questionTitle: string;
  category: TrackCategory;
  subcategory?: string | null;
  language: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  startedAt: string;
  completedAt?: string | null;
  durationSeconds: number;
  status: 'Solved' | 'Attempted' | 'Failed' | 'Partial' | string;
  score: number;
  percentage: number;
  testCasesPassed?: number | null;
  totalTestCases?: number | null;
  executionResult?: string | null;
  submissionStatus?: string | null;
  code: string;
  attemptNumber: number;
  errorMessage?: string | null;
  compilerOutput?: string | null;
  executionTimeMs?: number | null;
  memoryUsedMb?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MockSessionSummary {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  highestScore: number;
  improvementPercentage: number | null;
  hasActivity: boolean;
  message: string;
}

export interface CategoryPerformance {
  category: string;
  categoryName: string;
  questionsAttempted: number;
  questionsSolved: number;
  averageScore: number;
  successRate: number;
  averageCompletionTimeSeconds: number;
  totalAttempts: number;
  hasActivity: boolean;
  statusMessage?: string;
}

export interface DailyQuestionDetail {
  questionId: string;
  questionTitle: string;
  category: TrackCategory;
  subcategory?: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  durationSeconds: number;
  durationFormatted: string;
  status: 'Solved' | 'Attempted' | 'Failed' | 'Partial' | string;
  score: number;
  attemptNumber: number;
  totalAttemptsOnQuestion: number;
  submittedAt: string;
  code: string;
  language: string;
  errorMessage?: string | null;
  attempt: CodingAttempt;
}

export interface DailyActivityItem {
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Saturday, Sep 12, 2026"
  formattedDateShort: string; // e.g. "Sep 12, 2026"
  dayOfWeek: string; // e.g. "Saturday"
  totalCodingTimeSeconds: number;
  totalCodingTimeFormatted: string; // e.g. "3h 56m"
  totalAttempts: number;
  uniqueQuestionsCount: number;
  questionsSolvedCount: number;
  successRate: number;
  averageScore: number;
  firstActivityAt: string;
  lastActivityAt: string;
  questions: DailyQuestionDetail[];
}

export interface WeeklyActivityItem {
  weekKey: string; // e.g. "2026-W37"
  displayWeek: string; // e.g. "Week 37 (Sep 7 – Sep 13, 2026)"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalCodingTimeSeconds: number;
  totalCodingTimeFormatted: string; // e.g. "6h 46m"
  activeDaysCount: number;
  totalAttempts: number;
  uniqueQuestionsCount: number;
  questionsSolvedCount: number;
  successRate: number;
  averageScore: number;
  days: DailyActivityItem[];
}

export interface UserPerformanceSummary {
  totalQuestions: number;
  uniqueSolved: number;
  uniqueAttempted: number;
  successRate: number; // Solved / Attempted * 100
  totalCodingTimeSeconds: number;
  totalAttempts: number;
  categoryStats: Record<string, CategoryPerformance>;
  aiMockStats: MockSessionSummary;
  mentorMockStats: MockSessionSummary;
  dailyActivity: DailyActivityItem[];
  weeklyActivity: WeeklyActivityItem[];
  recentTimeline: {
    today: CodingAttempt[];
    yesterday: CodingAttempt[];
    thisWeek: CodingAttempt[];
    thisMonth: CodingAttempt[];
    older: CodingAttempt[];
  };
}

export type HiringStatus = 'Hire' | 'Consider' | 'Reject' | 'Pending';

export interface HiringEvaluation {
  id: string;
  candidateId: string;
  status: HiringStatus;
  overallRating: number; // 1 to 5
  rubricProblemSolving?: number; // 1 to 5
  rubricCodeQuality?: number; // 1 to 5
  rubricCommunication?: number; // 1 to 5
  rubricArchitecture?: number; // 1 to 5
  recommendation?: string;
  notes?: string;
  strengths?: string;
  weaknesses?: string;
  finalComments?: string;
  evaluatedBy?: string;
  evaluatorName?: string;
  evaluatedAt: string;
  updatedAt?: string;
}

export interface HiringEvaluationHistoryItem {
  id: string;
  evaluationId?: string;
  candidateId: string;
  status: HiringStatus;
  overallRating: number;
  notes?: string;
  recommendation?: string;
  evaluatedBy?: string;
  evaluatorName?: string;
  createdAt: string;
}

export interface CandidateUserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  lastActive: string;
  totalQuestions: number;
  solvedCount: number;
  successRate: number;
  machineCodingScore: number;
  dsaScore: number;
  coreProgrammingScore: number;
  hiringStatus: HiringStatus | 'Not Evaluated';
  overallRating?: number;
}

export interface UserQuickMetricSummary {
  uniqueAttempted: number;
  uniqueSolved: number;
  successRate: number;
  totalAttempts: number;
  machineCodingScore: number;
  dsaScore: number;
  coreProgrammingScore: number;
  lastActiveDate?: string;
}
