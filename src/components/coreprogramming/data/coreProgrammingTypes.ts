// src/components/coreprogramming/data/coreProgrammingTypes.ts

export type CoreProgrammingDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert'

export type CoreProgrammingQuestionType =
  | 'Coding'
  | 'Implementation'
  | 'Debugging'
  | 'Output Prediction'
  | 'Optimization'
  | 'Edge Cases'
  | 'Real-world programming'
  | 'Polyfill'
  | (string & {})

export type CoreProgrammingCategory =
  | 'JavaScript Basics'
  | 'Strings'
  | 'Arrays'
  | 'Objects'
  | 'Functions'
  | 'Array Method Implementation'
  | 'Scope / Hoisting / Closures'
  | 'this / call / apply / bind / Prototype'
  | 'ES6+'
  | 'Recursion / Algorithms'
  | 'Functional JavaScript'
  | 'Async JavaScript Programming'
  | 'Advanced Core JavaScript'
  | 'Advanced Algorithms & Core Architecture'
  | (string & {})

export interface CoreProgrammingTestCase {
  id: string
  input: string          // JSON or JS expression argument string, e.g. "[1, 2]"
  expectedOutput: string // String representation of expected result, e.g. "3"
  isHidden: boolean
  description?: string
  isAsync?: boolean
}

export interface CoreProgrammingExample {
  title?: string
  input: string
  output: string
  explanation?: string
}

export interface CoreProgrammingQuestion {
  id: string              // e.g. 'JS-P001'
  number: number          // 1 .. 500
  title: string
  slug: string
  category: CoreProgrammingCategory
  subcategory: string
  difficulty: CoreProgrammingDifficulty
  questionType: CoreProgrammingQuestionType
  skills: string[]
  tags: string[]
  expectedTime: string
  machineCoding?: boolean
  summary?: string
  problemStatement: string
  examples: CoreProgrammingExample[]
  constraints: string[]
  starterCode: string
  functionName: string
  testCases: CoreProgrammingTestCase[]
  hiddenTestCases?: CoreProgrammingTestCase[]
  solution: string
  explanation: string
  timeComplexity: string
  spaceComplexity: string
  hints: string[]
  followUps?: string[]
}

export interface CoreProgrammingRunResult {
  success: boolean
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded'
  passedCount: number
  totalCount: number
  results: {
    testCaseId: string
    passed: boolean
    input: string
    expectedOutput: string
    actualOutput?: string
    error?: string
    runtimeMs: number
    isHidden?: boolean
  }[]
  totalRuntimeMs: number
  consoleLogs: {
    level: 'log' | 'info' | 'warn' | 'error'
    message: string
  }[]
  error?: string
}

export interface CoreProgrammingSubmission {
  id: string
  candidateId?: string
  questionId: string
  code: string
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded'
  testsPassed: number
  testsTotal: number
  score: number
  runtimeMs: number
  timeSpentSeconds?: number
  timestamp: string
}
