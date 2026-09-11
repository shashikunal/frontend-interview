import type { MockQuestion, QuestionDifficulty, TechnologyTrack, QuestionType, ExperienceTier } from './questionBank.types';
export type { MockQuestion, QuestionDifficulty, TechnologyTrack, QuestionType, ExperienceTier };

export type SessionState =
  | 'DRAFT'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'SUBMITTING'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

export type InterviewMode =
  | 'Quick'
  | 'Standard'
  | 'Full'
  | 'Deep'
  | 'Custom'
  | 'Technical'
  | 'Coding'
  | 'Machine Coding'
  | 'Mixed'
  | 'Weak Areas Only'
  | 'Full Subject'
  | 'Topic Specific'
  | 'Communication'
  | 'Behavioral'
  | 'Architecture'
  | 'System Design'
  | 'Job Description Interview'
  | 'Resume Interview'
  | 'Project Interview';

export type InterviewerStyle =
  | 'Professional'
  | 'Friendly'
  | 'Strict'
  | 'Senior Interviewer'
  | 'System Design Interviewer'
  | 'HR / Behavioral';

export interface InterviewerPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  style: InterviewerStyle;
  bio: string;
  voicePitch: number;
  voiceRate: number;
}

export interface CandidateSetupConfig {
  totalExperienceYears: number;
  experienceTier: ExperienceTier;
  techSpecificExperience: Record<string, number>; // e.g., { javascript: 6, react: 5, typescript: 2 }
  primaryTechnology: TechnologyTrack;
  secondaryTechnologies: TechnologyTrack[];
  topic?: string;
  difficulty: QuestionDifficulty | 'Adaptive';
  interviewMode: InterviewMode;
  interviewerStyle: InterviewerStyle;
  interviewerPersonaId: string;
  questionCount: number;
  questionMix: {
    theoryPercent: number;
    practicalPercent: number;
    codingPercent: number;
    scenarioPercent: number;
  };
  jobDescription?: string;
  resumeText?: string;
  projectDescription?: string;
  pressureMode?: boolean;
}

export interface InterviewBlueprint {
  id: string;
  sessionId: string;
  questionCount: number;
  difficultyDistribution: Record<QuestionDifficulty, number>;
  topicDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  reservedQuestionIds: string[];
  expectedLevel: ExperienceTier;
  scoringRubricWeights: {
    correctness: number;
    depth: number;
    practical: number;
    communication: number;
    problemSolving: number;
    architecture: number;
  };
  timeLimitTotalMinutes: number;
  perQuestionTimeLimitSeconds: number;
  createdAt: string;
}

export interface TranscriptRecord {
  id: string;
  version: number;
  rawTranscript: string;
  cleanedTranscript: string;
  rawText?: string;
  cleanedText?: string;
  wpm?: number;
  language: string;
  provider: 'local-whisper' | 'web-speech-api' | 'cloud-whisper';
  model: string;
  confidence: number;
  timestamp: string;
}

export interface VideoRecordingMetadata {
  id: string;
  resolution: string; // '854x480'
  fps: number; // 24
  codec: string; // 'H.264 / AAC'
  sizeBytes: number;
  durationSeconds: number;
  compressionRatio: number;
  storageKey: string;
  storageUrl?: string;
  recordedAt: string;
}

export interface ConceptComparisonResult {
  correctConcepts: string[];
  missingConcepts: string[];
  incorrectConcepts: string[];
}

export interface AnswerEvaluation {
  id: string;
  answerId: string;
  questionId: string;
  numericScore: number; // 0.0 - 10.0
  letterGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason?: string;
  comparison: ConceptComparisonResult;
  whyMarksLost: string[];
  positiveHighlights: string[];
  experienceAwareFeedback: string;
  improvedAnswer: string;
  evaluationRubricScores: {
    correctness: number;
    conceptualDepth: number;
    practicalKnowledge: number;
    communication: number;
    problemSolving: number;
  };
  rubricBreakdown?: {
    technicalAccuracy: number;
    depthAndCompleteness: number;
    senioritySignaling: number;
    architectureTradeoffs: number;
    communicationClarity: number;
  };
  selfCorrectionDetected: boolean;
  honestIDontKnow: boolean;
  modelInfo: {
    modelName: string;
    modelVersion: string;
    promptVersion: string;
    rubricVersion: string;
    evaluatedAt: string;
  };
  secondEvaluator?: {
    numericScore: number;
    letterGrade: string;
    agreement: boolean;
  };
}

export type EvaluationReport = AnswerEvaluation;

export interface CodingRunEvaluation {
  testsPassed: number;
  testsTotal: number;
  status: 'PASSED' | 'WRONG_ANSWER' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT' | 'MEMORY_LIMIT' | 'SANDBOX_ERROR';
  executionTimeMs: number;
  failedCases: Array<{ input: string; expected: string; actual: string; error?: string }>;
  aiCodeReview?: {
    codeQualityScore: number;
    timeComplexityDemonstrated: string;
    spaceComplexityDemonstrated: string;
    cleanCodeNotes: string[];
    potentialBugs: string[];
    suggestedRefactoring: string;
  };
}

export interface IntegritySignal {
  type: 'tab_visibility_change' | 'unusual_pause' | 'excessive_restart' | 'browser_blur' | 'network_glitch';
  timestamp: string;
  details?: string;
}

export interface InterviewAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  questionNumber: number;
  question: MockQuestion;
  mode: 'speech' | 'code' | 'machine-coding';
  status: 'UNANSWERED' | 'RECORDING' | 'SUBMITTED' | 'SKIPPED' | 'EVALUATED';
  transcript?: TranscriptRecord;
  submittedCode?: string;
  codeLanguage?: 'javascript' | 'typescript';
  codingEvaluation?: CodingRunEvaluation;
  videoMetadata?: VideoRecordingMetadata;
  evaluation?: AnswerEvaluation;
  dynamicFollowUpQuestion?: string;
  timeSpentSeconds: number;
  startedAt: string;
  submittedAt?: string;
}

export interface SeniorityReadiness {
  claimedLevel: string;
  expectedLevel: string;
  demonstratedLevel: string;
  readinessPercentage: number;
  status: 'BELOW_EXPECTED' | 'MEETS_EXPECTED' | 'EXCEEDS_EXPECTED';
  keyDifferentiators: string[];
}

export interface TargetRoleReadiness {
  role: string;
  overallPercent: number;
  competencyBreakdown: Record<string, number>;
  criticalBlockers: string[];
}

export interface RecurringWeakness {
  topic: string;
  technology: TechnologyTrack;
  averageScore: number;
  occurrences: number;
  lastMissedConcepts: string[];
}

export interface LearningRecommendation {
  topic: string;
  technology: TechnologyTrack;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  actionItems: string[];
}

export interface FinalInterviewScorecard {
  sessionId: string;
  overallScore: number; // 0.0 - 10.0
  letterGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  confidence: 'High' | 'Medium' | 'Low';
  competencyPillars: {
    technicalCorrectness: number;
    conceptualDepth: number;
    practicalApplication: number;
    problemSolving: number;
    architectureAndDesign: number;
    communicationAndClarity: number;
  };
  seniorityAssessment: SeniorityReadiness;
  strengths: string[];
  weaknesses: string[];
  recurringWeaknesses: RecurringWeakness[];
  criticalGaps: string[];
  communicationSummary: {
    clarityScore: number;
    pacingWordsPerMinute: number;
    fillerWordsCount: number;
    structureRating: 'Weak' | 'Moderate' | 'Strong' | 'Executive';
    keyObservations: string[];
  };
  learningPlan: LearningRecommendation[];
  targetRoleReadiness: TargetRoleReadiness;
  evaluatedAt: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  state: SessionState;
  config: CandidateSetupConfig;
  blueprint: InterviewBlueprint;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: InterviewAnswer[];
  scorecard?: FinalInterviewScorecard;
  integritySignals: IntegritySignal[];
  startedAt: string;
  pausedAt?: string;
  totalPausedSeconds: number;
  completedAt?: string;
  updatedAt: string;
}
