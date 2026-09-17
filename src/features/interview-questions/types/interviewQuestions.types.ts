// src/features/interview-questions/types/interviewQuestions.types.ts

export type MasterSubjectId =
  | 'html'
  | 'css'
  | 'javascript'
  | 'es6'
  | 'es7'
  | 'es8'
  | 'dom'
  | 'bom'
  | 'web-apis'
  | 'typescript'
  | 'react'
  | 'redux'

export type QuestionDifficulty = 'EASY' | 'INTERMEDIATE' | 'DIFFICULT'

export type ExperienceLevel =
  | 'FRESHER'
  | '1_3_YEARS'
  | '3_5_YEARS'
  | '5_8_YEARS'
  | '8_PLUS_YEARS'

export type QuestionType =
  | 'CONCEPTUAL'
  | 'DEFINITION'
  | 'COMPARISON'
  | 'CODE'
  | 'OUTPUT'
  | 'DEBUGGING'
  | 'SCENARIO'
  | 'ARCHITECTURE'
  | 'PERFORMANCE'
  | 'SECURITY'
  | 'ACCESSIBILITY'
  | 'BEST_PRACTICE'
  | 'REAL_WORLD'
  | 'TRICKY'
  | 'DESIGN'
  | 'FOLLOW_UP'

export interface LineExplanation {
  line: number
  code: string
  explanation: string
}

export interface MasterQuestion {
  id: string                     // e.g. "iq-html-0001"
  subject: MasterSubjectId       // e.g. "html"
  topic: string                  // e.g. "Semantic HTML & Accessibility"
  subtopic: string               // e.g. "Landmark Elements"
  concept: string                // e.g. "<main> vs <article> vs <section>"
  difficulty: QuestionDifficulty // EASY | INTERMEDIATE | DIFFICULT
  questionType: QuestionType     // CONCEPTUAL | CODE | OUTPUT | etc.
  experienceLevel: ExperienceLevel // FRESHER | 1_3_YEARS | etc.
  tags: string[]                 // ["semantics", "a11y", "seo"]

  // Mandatory 13 Deep Content Sections
  question: string               // Clear interview question
  shortAnswer: string            // 2-5 lines summary
  interviewAnswer: string        // Natural speaking script candidate can say in interview
  detailedExplanation: string    // Deep technical breakdown
  why: string                    // Why the feature/concept exists
  howItWorks: string             // Internal engine / execution mechanism
  realWorldExample: string       // Production scenario
  example: string                // Concrete code or practical example
  commonMistakes: string[]       // Candidate mistakes
  interviewTraps: string[]       // Traps & misconceptions
  interviewTips: string[]        // What interviewer is evaluating
  followUps: string[]            // 2-5 follow-up questions
  followUpAnswers: string[]      // Model answers to follow-ups

  // Code & Output Deep Breakdown (mandatory for CODE, OUTPUT, DEBUGGING, etc.)
  codeSnippet?: string
  lineByLineExplanation?: LineExplanation[]
  executionFlow?: string[]       // Step 1: Input -> Step 2: Parsing -> Step 3: Runtime -> Output
  expectedOutput?: string
  complexity?: {
    time: string
    space: string
  }
  edgeCases?: string[]
  alternativeSolution?: string
  tradeOffs?: string
  productionConsiderations?: string
}

export interface SubjectMeta {
  id: MasterSubjectId
  name: string
  icon: string
  badge: string
  color: string
  accentGradient: string
  description: string
  totalQuestions: number
  topics: string[]
}

export interface SubjectProgressStat {
  subjectId: MasterSubjectId
  totalQuestions: number
  completed: number
  remaining: number
  completionPct: number
  easyCount: number
  easyCompleted: number
  intermediateCount: number
  intermediateCompleted: number
  difficultCount: number
  difficultCompleted: number
  bookmarkedCount: number
  needsReviewCount: number
}

export interface UserInterviewQuestionsProgress {
  completedQuestionIds: string[]
  bookmarkedQuestionIds: string[]
  needsReviewQuestionIds: string[]
  masteredQuestionIds: string[]
  questionNotes: Record<string, string>
  lastVisited?: {
    subjectId: MasterSubjectId
    questionId: string
    timestamp: number
  }
  practiceSessionsCount: number
  testScores: {
    id: string
    subjectId: MasterSubjectId | 'all'
    score: number
    totalQuestions: number
    percentage: number
    timestamp: string
    durationSeconds: number
  }[]
  updatedAt: string
}

export interface MasterBankCatalog {
  generatedAt: string
  totalQuestions: number
  subjects: SubjectMeta[]
}
