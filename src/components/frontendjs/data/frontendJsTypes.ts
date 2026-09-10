export type FrontendJsDifficulty = 'Easy' | 'Medium' | 'Hard'

export type FrontendJsInterviewType =
  | 'Coding'
  | 'Code Completion'
  | 'Debugging'
  | 'Refactoring'
  | 'Output Prediction'
  | 'Scenario Programming'
  | 'Production Programming'
  | 'Frontend Machine-Coding-Style'
  | 'Interview Follow-up'

export type FrontendJsFrequencyRank =
  | 'Top 25'
  | 'Top 50'
  | 'Top 100'
  | 'Top 250'
  | 'Frequently Asked'
  | 'Standard'

export interface FrontendJsTestCase {
  id: string
  input: string          // JSON array string of arguments, e.g. "[[1, [2, [3]]]]"
  expectedOutput: string // JSON representation of return value, e.g. "[1, 2, 3]"
  isHidden: boolean
  description?: string
  isAsync?: boolean
}

export interface FrontendJsExample {
  title?: string
  input: string
  output: string
  explanation?: string
}

export interface FrontendJsAlternativeSolution {
  title: string
  approach: string
  code: string
  tradeoffs: string
}

export interface FrontendJsQuestion {
  id: string              // e.g. 'FJP-0001'
  number: number          // 1 .. 1000
  title: string
  slug: string
  category: string        // e.g. 'Fundamentals', 'Functions', 'Async', 'DOM', 'Arrays', 'Objects', 'Strings', 'Performance', 'Production Scenarios'
  subcategory: string
  difficulty: FrontendJsDifficulty
  frontendTopic: string
  javascriptConcepts: string[]
  interviewType: FrontendJsInterviewType
  frequencyRank: FrontendJsFrequencyRank
  isMostAsked: boolean
  companyTags: string[]
  startupTag: string
  scenarioType: string
  problemStatement: string
  timeEstimate?: string
  constraints?: string[]
  inputDescription?: string
  outputDescription?: string
  examples: FrontendJsExample[]
  starterCode: string
  functionName: string
  testCases: FrontendJsTestCase[]
  hiddenTestCases: FrontendJsTestCase[]
  solution: string
  alternativeSolutions?: FrontendJsAlternativeSolution[]
  explanation: string
  edgeCases?: string[]
  timeComplexity: string
  spaceComplexity: string
  hints: string[]
  followUps?: string[]
  productionNotes?: string
  version: number
  status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Archived'
  createdAt?: string
  updatedAt?: string
}

export interface FrontendJsTestResult {
  testCaseId: string
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput?: string
  error?: string
  runtimeMs: number
  isHidden: boolean
  description?: string
}

export interface FrontendJsRunResult {
  success: boolean
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compile Error'
  passedCount: number
  totalCount: number
  results: FrontendJsTestResult[]
  totalRuntimeMs: number
  consoleLogs: { level: 'log' | 'info' | 'warn' | 'error'; message: string }[]
  error?: string
}

export interface FrontendJsSubmission {
  id: string
  candidateId?: string
  questionId: string
  questionVersion: number
  code: string
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compile Error'
  testsPassed: number
  testsTotal: number
  score: number
  runtimeMs: number
  hintsUsed: number
  solutionViewed: boolean
  timeSpentSeconds: number
  timestamp: string
}

export interface FrontendJsAttempt {
  id: string
  questionId: string
  code: string
  status: string
  testsPassed: number
  testsTotal: number
  runtimeMs: number
  timestamp: string
}

export interface FrontendJsReport {
  id: string
  questionId: string
  reportType:
    | 'Incorrect question'
    | 'Broken starter code'
    | 'Duplicate question'
    | 'Incorrect expected output'
    | 'Unclear problem'
    | 'Broken tests'
    | 'Incorrect solution'
    | 'Other issue'
  description: string
  candidateEmail?: string
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed'
  adminNotes?: string
  createdAt: string
}

export interface FrontendJsRoadmap {
  id: string
  title: string
  description: string
  badge: string
  questionIds: string[]
}
