export type DSADifficulty = 'Easy' | 'Medium' | 'Difficult'

export interface DSATestCase {
  id: string
  input: string          // JSON array of args, e.g. "[[2, 7, 11, 15], 9]"
  expectedOutput: string // JSON representation of expected return value, e.g. "[0, 1]"
  isHidden: boolean
  explanation?: string
}

export interface DSAExample {
  input: string
  output: string
  explanation?: string
}

export interface DSAQuestion {
  id: string              // e.g. 'DSA001'
  number: number          // 1 .. 1000
  title: string
  slug: string
  difficulty: DSADifficulty
  topic: string           // e.g. 'Arrays', 'Strings', 'Binary Search', etc.
  pattern: string[]       // e.g. ['Two Pointers', 'Hash Map']
  tags: string[]
  companies?: string[]
  problemStatement: string
  examples: DSAExample[]
  constraints: string[]
  inputFormat?: string
  outputFormat?: string
  hints: string[]
  approach: string
  stepByStepExplanation: string
  optimalApproach: string
  timeComplexity: string
  spaceComplexity: string
  functionName: string
  starterCodeJS: string
  starterCodeTS: string
  solutionJS: string
  solutionTS: string
  testCases: DSATestCase[]
  similarQuestions?: string[]
}

export interface DSATestResult {
  testCaseId: string
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput?: string
  error?: string
  runtimeMs: number
  isHidden: boolean
}

export interface DSARunResult {
  success: boolean
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compile Error'
  passedCount: number
  totalCount: number
  results: DSATestResult[]
  totalRuntimeMs: number
  consoleLogs: { level: 'log' | 'info' | 'warn' | 'error'; message: string }[]
  error?: string
}

export interface DSASubmission {
  id: string
  questionId: string
  language: 'javascript' | 'typescript'
  code: string
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compile Error'
  testsPassed: number
  testsTotal: number
  runtimeMs: number
  timestamp: string
}

export interface DSARoadmap {
  id: string
  title: string
  description: string
  badge: string
  questionIds: string[]
}
