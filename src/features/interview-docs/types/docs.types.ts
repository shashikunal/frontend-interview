/**
 * Core type definitions for the Interview Documentation + Learning + Question Bank Platform
 */

export type SubjectId =
  | 'html'
  | 'css'
  | 'advanced-css'
  | 'javascript'
  | 'es6'
  | 'typescript'
  | 'react'
  | 'advanced-react'
  | 'redux'
  | 'redux-toolkit'
  | 'tanstack-query'
  | 'react-router'
  | 'tailwind'
  | 'nextjs'
  | 'microfrontends'
  | 'restful-apis'
  | 'http'
  | 'postman'
  | 'websockets'
  | 'webhooks'
  | 'web-performance';

export type QuestionDifficulty = 'easy' | 'intermediate' | 'difficult';

export type ExperienceLevel =
  | 'fresher'
  | 'junior'
  | 'mid-level'
  | 'senior'
  | 'lead'
  | 'architect';

export type QuestionType =
  | 'conceptual'
  | 'definition'
  | 'comparison'
  | 'output-prediction'
  | 'coding'
  | 'debugging'
  | 'code-review'
  | 'scenario'
  | 'production-issue'
  | 'performance'
  | 'security'
  | 'architecture'
  | 'design-decision'
  | 'trade-off'
  | 'troubleshooting'
  | 'accessibility';

export type MasteryState =
  | 'not-started'
  | 'in-progress'
  | 'needs-review'
  | 'incorrect'
  | 'mastered';

export interface SubjectMetadata {
  id: SubjectId;
  title: string;
  category: 'Core Web' | 'Languages' | 'React Ecosystem' | 'Architecture & Fullstack' | 'Networking & APIs' | 'Performance & Tooling';
  icon: string;
  badge: string;
  tagline: string;
  description: string;
  estimatedHours: number;
  totalTopicsCount: number;
  tags: string[];
}

export interface SubtopicMetadata {
  id: string;
  title: string;
  conceptId: string;
  description?: string;
  estimatedMinutes?: number;
}

export interface TopicMetadata {
  id: string;
  subjectId: SubjectId;
  title: string;
  icon?: string;
  description: string;
  subtopics: SubtopicMetadata[];
  order: number;
}

export interface DocPageSection {
  id: string;
  heading: string;
  content: string; // Markdown or structured text
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
    caption?: string;
  };
}

export interface VideoLesson {
  topicId: string;
  videoId: string; // YouTube video ID or verified embed ID
  title: string;
  duration: string;
  channelName: string;
  thumbnailUrl?: string;
  isVerified: boolean;
  subtopicId?: string;
  subtopicTitle?: string;
  badge?: 'Core Concept' | 'Deep Dive' | 'Interview Gotchas' | 'Hands-on Code' | 'Subtopic Focus';
}

export interface InterviewFollowUp {
  id: string;
  question: string;
  depthLevel: 'follow-up' | 'deep-dive' | 'architect';
  expectedAnswer: string;
  codeSnippet?: string;
}

export interface InterviewQuestion {
  id: string;
  subjectId: SubjectId;
  topicId: string;
  subtopicId?: string;
  conceptId: string;
  difficulty: QuestionDifficulty;
  experience: ExperienceLevel;
  type: QuestionType;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  seniorAnswer?: string;
  whyAsked?: {
    testingObjective: string;
    expectedSignal: string;
    commonWeakAnswer: string;
    strongSeniorAnswer: string;
  };
  code?: {
    language: string;
    snippet: string;
    explanation?: string;
  };
  explanation: string;
  commonMistakes?: string[];
  followUps?: InterviewFollowUp[];
  tags: string[];
  fingerprint?: string;
}

export interface DocPage {
  subjectId: SubjectId;
  topicId: string;
  title: string;
  description: string;
  overview: string;
  whyItMatters: string;
  howItWorks: string;
  syntaxReference?: string;
  sections: DocPageSection[];
  commonMistakes: string[];
  performanceTips?: string[];
  securityNotes?: string[];
  video?: VideoLesson;
  videoList?: VideoLesson[];
  questions: InterviewQuestion[];
  relatedTopics: { subjectId: SubjectId; topicId: string; title: string }[];
  previousTopic?: { subjectId: SubjectId; topicId: string; title: string };
  nextTopic?: { subjectId: SubjectId; topicId: string; title: string };
}

export interface PracticeSessionState {
  subjectId: SubjectId;
  topicId?: string;
  difficulty?: QuestionDifficulty | 'all';
  totalQuestions: number;
  currentIndex: number;
  questions: InterviewQuestion[];
  answersState: Record<string, { answered: boolean; status: 'knew-it' | 'needs-review' | 'missed'; timestamp: number }>;
  isComplete: boolean;
}

export interface InterviewSessionConfig {
  subjectIds: SubjectId[];
  difficulty: QuestionDifficulty | 'mixed';
  experience: ExperienceLevel;
  questionCount: number;
}

export interface InterviewSessionState {
  id: string;
  config: InterviewSessionConfig;
  questions: InterviewQuestion[];
  currentIndex: number;
  activeFollowUpIndex: number;
  userRatings: Record<string, number>; // 1-5 score per question
  notes: Record<string, string>;
  candidateTranscripts?: Record<string, string>;
  evaluations?: Record<string, any>;
  followUpResponses?: Record<string, string[]>;
  startedAt: string;
  completedAt?: string;
  isFinished: boolean;
  scoreSummary?: {
    overallPercentage: number;
    readinessGrade: 'Strong Hire' | 'Hire' | 'Borderline' | 'Needs Practice';
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: { subjectId: SubjectId; topicId: string; title: string }[];
  };
}

export interface UserDocsProgress {
  lastVisited?: {
    subjectId: SubjectId;
    topicId: string;
    timestamp: number;
  };
  completedTopics: string[]; // Set of `${subjectId}:${topicId}`
  bookmarkedDocs: string[]; // Set of `${subjectId}:${topicId}`
  bookmarkedQuestions: string[]; // question IDs
  questionMastery: Record<string, MasteryState>;
  practiceAttemptsCount: number;
  interviewsCompletedCount: number;
  subjectProgress: Record<SubjectId, {
    topicsRead: number;
    questionsPracticed: number;
    masteredCount: number;
  }>;
}
