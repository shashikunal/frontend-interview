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
  | 'jquery'
  | 'typescript'
  | 'react'
  | 'redux'
  | 'react-router'
  | 'tanstack-query'
  | 'nextjs'
  | 'http'
  | 'rest-apis'
  | 'websockets'
  | 'browser-internals'
  | 'performance'
  | 'accessibility'
  | 'seo'
  | 'security'
  | 'testing'
  | 'git'
  | 'build-tools'
  | 'micro-frontends'
  | 'design-patterns'
  | 'frontend-architecture'
  | 'machine-coding'
  | 'system-design'
  | 'coding-problems'
  | 'scenarios'
  | 'company-questions'

export type QuestionDifficulty = 'EASY' | 'INTERMEDIATE' | 'DIFFICULT' | 'EXPERT'

export type ExperienceLevel =
  | 'FRESHER'
  | '1_3_YEARS'
  | '3_5_YEARS'
  | '5_8_YEARS'
  | '8_PLUS_YEARS'

export type QuestionStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'duplicate'
  | 'archived'

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
  | 'MCQ'
  | 'concept'
  | 'mcq'
  | 'multi-select-mcq'
  | 'coding'
  | 'output'
  | 'debugging'
  | 'scenario'
  | 'practical'
  | 'performance'
  | 'security'
  | 'accessibility'
  | 'architecture'
  | 'machine-coding'
  | 'system-design'
  | 'company-based'

export interface MCQOption {
  key: string // "A", "B", "C", "D"
  text: string
  explanation?: string // Why this specific option is wrong or correct
}

export interface LineExplanation {
  line: number
  code: string
  explanation: string
}

export interface MasterQuestion {
  id: string                     // e.g. "iq-html-0001"
  standard_id?: string           // e.g. "HTML-000001" or "HTML-MCQ-000001"
  subject: MasterSubjectId       // e.g. "html"
  questionNumber?: number        // e.g. 1
  category?: string              // e.g. "HTML Fundamentals"
  topic: string                  // e.g. "Semantic HTML & Accessibility"
  subtopic?: string              // e.g. "Landmark Elements"
  concept: string                // e.g. "<main> vs <article> vs <section>"
  difficulty: QuestionDifficulty | string // EASY | INTERMEDIATE | DIFFICULT | easy | intermediate | difficult
  questionType?: QuestionType | string    // CONCEPTUAL | CODE | OUTPUT | etc.
  question_type?: string         // "concept" | "mcq" | "coding" | etc.
  experienceLevel?: ExperienceLevel | string // FRESHER | 1_3_YEARS | etc.
  status?: QuestionStatus | string       // draft | review | approved | published | rejected | duplicate | archived
  question_hash?: string         // Normalized deterministic hash for zero-duplicate guarantee
  isHighFrequency?: boolean      // True for FAANG top asked questions
  companyTags?: string[]          // e.g. ["Google", "Meta", "Amazon"]
  tags: string[]                // ["html", "fundamentals"]

  // Core Fresher & Interview Content
  question: string              // Clear interview question: "What is HTML?"
  shortAnswer: string           // Crisp 1-2 sentence interview definition
  simpleExplanation?: string    // Simple natural English explanation with small paragraphs
  detailedAnswer?: string       // Plain English beginner-friendly explanation
  detailedExplanation?: string   // Deep technical breakdown (legacy/advanced)
  codeExample?: string          // Clean practical code snippet
  example?: string              // Concrete code or practical example
  realWorldExample?: string      // Real-world production scenario / application
  commonMistakes: string[]       // Candidate mistakes / beginner pitfalls
  interviewTip?: string         // Short practical interview tip
  interviewTips?: string[]       // What interviewer is evaluating
  followUpQuestions?: string[]   // Clean follow-up interview questions
  followUps?: string[]           // Follow-up questions (legacy alias)
  followUpAnswers?: string[]     // Model answers to follow-ups

  // Speaking & Depth Features
  interviewAnswer?: string       // Natural speaking script candidate can say in interview
  codeExplanationSpeech?: string // Plain English audio explanation of what the code does
  why?: string                   // Why the feature/concept exists
  howItWorks?: string            // Internal engine / execution mechanism
  interviewTraps?: string[]      // Traps & misconceptions

  // Code & Sandbox Breakdown
  codeSnippet?: string
  lineByLineExplanation?: LineExplanation[]
  executionFlow?: string[]       // Step 1: Input -> Step 2: Parsing -> Step 3: Runtime -> Output
  expectedOutput?: string
  mcqQuestion?: string           // Formatted MCQ prompt stem (e.g. "Which statement best describes...")
  options?: MCQOption[] | string[] // For MCQ question types: Options A, B, C, D
  correctAnswer?: string         // e.g. "B"
  mcqExplanation?: string        // Simple explanation for why correct answer is right
  wrongOptionExplanations?: Record<string, string> // Explanations for why other options are wrong (A: ..., C: ...)
  diagram?: string               // Optional Mermaid state/sequence/flowchart diagram definition
  diagramCaption?: string        // Caption for the architecture/lifecycle diagram
  videoUrl?: string             // Curated video explanation tutorial embed URL (YouTube/Vimeo)
  videoTitle?: string           // Video lesson title
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
