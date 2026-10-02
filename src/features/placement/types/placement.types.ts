export type PlacementView =
  | 'overview'
  | 'day-plan'
  | 'practice'
  | 'assessments'
  | 'readiness'
  | 'mock-interviews'
  | 'mock-flow'
  | 'analytics'
  | 'notifications'
  | 'project-interview'
  | 'project'
  | 'applications'
  | 'interview-prep'
  | 'mentor'
  | 'admin'

export const PLACEMENT_VIEWS: PlacementView[] = [
  'overview',
  'day-plan',
  'practice',
  'assessments',
  'readiness',
  'mock-interviews',
  'mock-flow',
  'analytics',
  'notifications',
  'project-interview',
  'project',
  'applications',
  'interview-prep',
  'mentor',
  'admin',
]

export type PlacementCategory =
  | 'aptitude'
  | 'reasoning'
  | 'verbal'
  | 'technical_mcq'
  | 'dsa'
  | 'programming'
  | 'frontend'
  | 'sql'
  | 'cs_fundamentals'
  | 'machine_coding'
  | 'project'
  | 'communication'

export type TechnicalSubject =
  | 'html'
  | 'css'
  | 'javascript'
  | 'react'
  | 'typescript'
  | 'dsa'
  | 'java'
  | 'python'
  | 'sql'
  | 'oop'
  | 'dbms'
  | 'operating_systems'
  | 'networking'
  | 'git'
  | 'http'
  | 'rest'

export type PlacementQuestionType =
  | 'mcq'
  | 'output'
  | 'debugging'
  | 'scenario'
  | 'concept'
  | 'coding'
  | 'subjective'

export type PlacementDifficulty = 'easy' | 'easy-medium' | 'medium' | 'hard'

export type VerificationStatus = 'verified' | 'needs_review' | 'incorrect' | 'duplicate' | 'archived'

export type LanguageTrack = 'java' | 'python' | 'javascript'

export type AttemptMode = 'practice' | 'interview' | 'assessment' | 'daily' | 'weakness'

export type AttemptStatus = 'passed' | 'failed' | 'partial' | 'submitted' | 'timeout'

export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'placement_mode' | 'withdrawn'

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'online_assessment'
  | 'shortlisted'
  | 'technical_round'
  | 'hr_round'
  | 'selected'
  | 'rejected'
  | 'no_response'
  | 'withdrawn'

export type InterviewResult = 'pending' | 'cleared' | 'rejected' | 'holding' | 'withdrawn'

export type MockResult =
  | 'pending'
  | 'strong_hire'
  | 'hire'
  | 'lean_hire'
  | 'lean_no_hire'
  | 'no_hire'

export type MentorStatusLabel =
  | 'At Risk'
  | 'Needs Intervention'
  | 'Improving'
  | 'Almost Ready'
  | 'Job Ready'

export type InterventionPriority = 'low' | 'medium' | 'high' | 'critical'

export interface PlacementQuestionOption {
  key: string
  text: string
}

/** Student-safe question projection (mirrors placement_questions_public). */
export interface PlacementQuestion {
  id: string
  category: PlacementCategory
  subcategory: string
  topic: string
  questionType: PlacementQuestionType
  difficulty: PlacementDifficulty
  prompt: string
  codeSnippet?: string
  options: PlacementQuestionOption[]
  expectedTimeSeconds: number
  points: number
  languageTrack?: LanguageTrack | 'any'
  tags: string[]
}

/** Full question record, admin/mentor only. */
export interface PlacementQuestionRecord extends PlacementQuestion {
  correctAnswer: string
  explanation: string
  verificationStatus: VerificationStatus
  createdAt?: string
  updatedAt?: string
}

export interface PlacementTestCase {
  id: string
  questionId: string
  input: string
  expectedOutput: string
  isSample: boolean
  explanation?: string
  orderIndex: number
}

export interface PlacementAttempt {
  id: string
  userId: string
  programId?: string | null
  questionId?: string | null
  dayId?: string | null
  category: PlacementCategory
  subcategory: string
  mode: AttemptMode
  selectedAnswer?: string | null
  submittedCode?: string | null
  language?: string
  isCorrect: boolean
  score: number
  maxScore: number
  timeSpentSeconds: number
  attemptsCount: number
  hintsUsed: number
  resultStatus: AttemptStatus
  createdAt: string
}

export interface PlacementDayTask {
  id: string
  taskKey: string
  taskLabel: string
  category: PlacementCategory
  targetCount: number
  completedCount: number
  isCompleted: boolean
  completedAt?: string | null
}

export interface PlacementProgress {
  id: string
  userId: string
  programId: string
  enrollmentStatus: EnrollmentStatus
  currentDay: number
  daysCompleted: number[]
  streakDays: number
  lastActivityAt?: string | null
  totalQuestionsAttempted: number
  totalQuestionsCorrect: number
  totalTimeSpentSeconds: number
  weakTopics: string[]
}

export interface PlacementProgram {
  id: string
  slug: string
  name: string
  description: string
  durationDays: number
  targetRoles: string[]
  targetRegions: string[]
  status: 'active' | 'archived' | 'draft'
}

export interface PlacementDay {
  id: string
  programId: string
  dayNumber: number
  phase: string
  title: string
  focus: string
  description: string
  goals: string[]
  isMilestone: boolean
}

export interface PlacementTopic {
  id: string
  programId: string
  dayId: string
  name: string
  category: PlacementCategory
  subcategory: string
  description: string
  resourceRoute: string
  expectedMinutes: number
  orderIndex: number
}

export interface PlacementAssessment {
  id: string
  programId: string
  title: string
  description: string
  assessmentType: 'weekly' | 'final' | 'mock' | 'screening' | 'custom'
  dayNumber: number | null
  durationMinutes: number
  questionCount: number
  totalPoints: number
  passingScore: number
  isPublished: boolean
}

export interface PlacementAssessmentAttempt {
  id: string
  userId: string
  assessmentId: string
  status: 'in_progress' | 'submitted' | 'timed_out' | 'abandoned'
  startedAt: string
  submittedAt?: string | null
  durationSeconds: number
  score: number
  maxScore: number
  percentage: number
  correctCount: number
  wrongCount: number
  skippedCount: number
  weakTopics: string[]
  categoryBreakdown: Record<string, { correct: number; total: number }>
}

/** Readiness weights are admin-editable; never hardcode in UI. */
export type ReadinessCategory =
  | 'dsa'
  | 'frontend'
  | 'programming'
  | 'aptitude'
  | 'technical_mcq'
  | 'machine_coding'
  | 'sql_cs'
  | 'project'
  | 'communication'

export type ReadinessWeights = Record<ReadinessCategory, number>
export type ReadinessThresholds = Record<ReadinessCategory, number>

export interface ReadinessGateChecklist {
  resume: boolean
  github: boolean
  portfolio: boolean
  live_project: boolean
  readme: boolean
  min_mock_interviews: number
  final_assessment_passed: boolean
}

export interface ReadinessConfig {
  id: string
  weights: ReadinessWeights
  thresholds: ReadinessThresholds
  gateChecklist: ReadinessGateChecklist
  updatedAt?: string
}

export interface ReadinessCategoryScore {
  category: ReadinessCategory
  score: number
  threshold: number
  weight: number
  meetsThreshold: boolean
  evidence: string
  sampleSize: number
}

export interface PlacementReadiness {
  overallScore: number
  categoryScores: ReadinessCategoryScore[]
  weightsUsed: ReadinessWeights
  thresholdsUsed: ReadinessThresholds
  isJobReady: boolean
  blockingReasons: string[]
  checklistState: Record<string, boolean | number>
  computedAt: string
}

export interface PlacementProject {
  id: string
  userId: string
  title: string
  description: string
  techStack: string[]
  repoUrl: string
  liveUrl: string
  readmeUrl: string
  hasReadme: boolean
  hasScreenshots: boolean
  hasAuth: boolean
  hasErrorHandling: boolean
  hasDeployment: boolean
  architectureNotes: string
  apiNotes: string
  databaseNotes: string
  deploymentNotes: string
  status: 'draft' | 'in_progress' | 'ready_for_review' | 'defended' | 'needs_work'
}

export interface PlacementProjectReview {
  id: string
  projectId: string
  userId: string
  reviewType: 'self' | 'peer' | 'mentor' | 'system'
  score: number
  maxScore: number
  clarityScore: number
  technicalScore: number
  architectureScore: number
  deploymentScore: number
  communicationScore: number
  questionsAsked: { question: string; answer: string; rating: number }[]
  strengths: string
  improvements: string
  verdict: 'pending' | 'pass' | 'needs_work' | 'fail'
  createdAt: string
}

export interface PlacementMockInterview {
  id: string
  userId: string
  title: string
  mockType: 'full' | 'dsa' | 'frontend' | 'machine_coding' | 'project' | 'communication' | 'hr' | 'language'
  scheduledAt?: string | null
  conductedAt?: string | null
  durationMinutes: number
  interviewerName: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes: string
}

export interface PlacementMockResult {
  id: string
  mockId: string
  userId: string
  result: MockResult
  overallScore: number
  areaScores: Record<string, number>
  strengths: string[]
  improvements: string[]
  questionsFailed: string[]
  questionsPassed: string[]
  feedback: string
  createdAt: string
}

export interface PlacementJobApplication {
  id: string
  userId: string
  company: string
  role: string
  location: string
  jobUrl: string
  source: string
  appliedAt: string | null
  status: ApplicationStatus
  interviewDate: string | null
  currentRound: string
  salaryRange: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface PlacementInterviewFeedback {
  id: string
  userId: string
  applicationId?: string | null
  mockId?: string | null
  company: string
  role: string
  round: string
  interviewDate: string | null
  questionsAsked: string[]
  questionsFailed: string[]
  questionsPassed: string[]
  areaResults: Record<string, 'pass' | 'fail' | 'partial'>
  result: InterviewResult
  feedback: string
  createdAt: string
}

export interface RejectionAnalysis {
  windowSize: number
  totalInterviews: number
  areaFailureCounts: Record<string, number>
  areaPassCounts: Record<string, number>
  weakTopics: string[]
  recommendations: string[]
  computedAt: string
}

export interface MentorIntervention {
  id: string
  studentId: string
  mentorId?: string | null
  statusLabel: MentorStatusLabel
  problem: string
  evidence: string
  recommendedAction: string
  priority: InterventionPriority
  triggerKey: string
  resolved: boolean
  createdAt: string
}

export interface MentorStudentRow {
  userId: string
  name: string
  email: string
  readiness: number
  dsa: number
  frontend: number
  programming: number
  aptitude: number
  machineCoding: number
  project: number
  applications: number
  interviews: number
  selections: number
  statusLabel: MentorStatusLabel
  lastActivityAt: string | null
}

export interface PlacementDailyPriorityItem {
  key: string
  label: string
  category: PlacementCategory
  target: number
  completed: number
  route?: string
}

export interface CommunicationPrompt {
  id: string
  title: string
  prompt: string
  duration: '60s' | '2min' | 'technical' | 'project'
  category: 'introduction' | 'project' | 'motivation' | 'technical' | 'behavioral'
  rubric: string[]
}

export interface CommunicationSubmission {
  id: string
  promptId: string
  answerText: string
  clarity: number
  structure: number
  technicalCorrectness: number
  confidence: number
  conciseness: number
  createdAt: string
}
