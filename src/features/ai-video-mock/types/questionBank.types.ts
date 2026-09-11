import { z } from 'zod';

export type TechnologyTrack =
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'react'
  | 'nextjs'
  | 'angular'
  | 'vue'
  | 'redux-state'
  | 'web-performance'
  | 'browser-web-apis'
  | 'frontend-security'
  | 'accessibility'
  | 'testing'
  | 'frontend-architecture'
  | 'communication';

export const ALL_TECHNOLOGY_TRACKS: { id: TechnologyTrack; label: string; icon: string; description: string }[] = [
  { id: 'javascript', label: 'JavaScript', icon: '📜', description: 'Core engine, execution context, closures, event loop & prototypes' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', description: 'Advanced types, generics, conditional types, AST & compiler options' },
  { id: 'html', label: 'HTML & Semantic Web', icon: '🌐', description: 'Semantic tags, forms, SEO, web components & DOM structuring' },
  { id: 'css', label: 'Modern CSS', icon: '🎨', description: 'Flexbox, Grid, container queries, animations, cascade & architecture' },
  { id: 'react', label: 'React Ecosystem', icon: '⚛️', description: 'Hooks, Fiber reconciliation, concurrency, Suspense & Server Components' },
  { id: 'nextjs', label: 'Next.js & Modern SSR', icon: '▲', description: 'App router, Server Actions, streaming, ISR, middleware & edge deployment' },
  { id: 'angular', label: 'Angular', icon: '🅰️', description: 'Signals, dependency injection, RxJS, zones, directives & standalone components' },
  { id: 'vue', label: 'Vue.js', icon: '💚', description: 'Reactivity transform, composition API, directives, Pinia & Vue internals' },
  { id: 'redux-state', label: 'State Management', icon: '🔄', description: 'Redux Toolkit, Zustand, Jotai, MobX, immutability & state machines' },
  { id: 'web-performance', label: 'Web Performance', icon: '⚡', description: 'Core Web Vitals (LCP, INP, CLS), critical rendering path, caching & bundle optimization' },
  { id: 'browser-web-apis', label: 'Browser & Web APIs', icon: '💻', description: 'Web Workers, Service Workers, IndexedDB, WebSockets & Streams API' },
  { id: 'frontend-security', label: 'Frontend Security', icon: '🛡️', description: 'XSS, CSRF, CSP, CORS, clickjacking, token storage & OWASP Top 10' },
  { id: 'accessibility', label: 'Accessibility (a11y)', icon: '♿', description: 'WCAG 2.2 AA/AAA, ARIA patterns, keyboard navigation, focus & screen readers' },
  { id: 'testing', label: 'Testing & QA', icon: '🧪', description: 'Vitest, Jest, React Testing Library, Playwright, Cypress & TDD' },
  { id: 'frontend-architecture', label: 'Frontend Architecture', icon: '🏛️', description: 'Micro-frontends, Monorepos, Module Federation, Design Systems & Scalability' },
  { id: 'communication', label: 'Communication & Leadership', icon: '🎙️', description: 'Stakeholder alignment, technical presentations, conflict, STAR & leadership' },
];

export type QuestionDifficulty = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export type QuestionType =
  | 'Theory'
  | 'Practical'
  | 'Logical'
  | 'Programming'
  | 'Machine Coding'
  | 'Debugging'
  | 'Scenario Based'
  | 'Architecture'
  | 'System Design'
  | 'Behavioral'
  | 'Communication'
  | 'Role Play'
  | 'Technical Explanation'
  | 'Leadership'
  | 'Presentation'
  | 'Problem Solving';

export type ExperienceTier =
  | '0-1'
  | '1-2'
  | '2-4'
  | '4-6'
  | '6-8'
  | '8-12'
  | '12+';

export type QuestionStatus = 'DRAFT' | 'VALIDATING' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'DEPRECATED';

export interface CodeTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface ProgrammingSpec {
  programmingLanguage: 'javascript' | 'typescript';
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  starterCode: string;
  solutionCode: string;
  testCases: CodeTestCase[];
  expectedApproach: string;
  expectedComplexity: { time: string; space: string };
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface MachineCodingSpec {
  requirements: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  starterFiles: Record<string, string>;
  allowedDependencies: string[];
  expectedBehavior: string;
  sampleUsage: string;
  evaluationCriteria: string[];
  edgeCases: string[];
  timeLimitMinutes: number;
}

export interface ExpectedAnswerRubric {
  minimumExpected: string;
  strongAnswer: string;
  seniorLevelExpectations: string;
  expertLevelExpectations: string;
  acceptableAnswer?: string;
  weakSignals?: string[];
}

export interface MockQuestion {
  id: string;
  technology: TechnologyTrack;
  topic: string;
  subtopic: string;
  difficulty: QuestionDifficulty;
  starterCode?: string;
  question: string;
  questionType: QuestionType;
  experienceLevels: ExperienceTier[];
  expectedConcepts: string[];
  idealAnswerPoints: string[];
  commonMistakes: string[];
  followUpTopics: string[];
  estimatedTimeMinutes: number;
  tags: string[];
  status: QuestionStatus;
  qualityScore: number; // 0 - 100
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  version: number;
  createdAt: string;
  updatedAt: string;
  rubric: ExpectedAnswerRubric;
  programmingSpec?: ProgrammingSpec;
  machineCodingSpec?: MachineCodingSpec;
}

// Zod Schema for validation
export const MockQuestionSchema = z.object({
  id: z.string().min(3),
  technology: z.enum([
    'javascript', 'typescript', 'html', 'css', 'react', 'nextjs', 'angular', 'vue',
    'redux-state', 'web-performance', 'browser-web-apis', 'frontend-security',
    'accessibility', 'testing', 'frontend-architecture', 'communication',
  ]),
  topic: z.string().min(2),
  subtopic: z.string().min(2),
  difficulty: z.enum(['Basic', 'Intermediate', 'Advanced', 'Expert']),
  question: z.string().min(10),
  questionType: z.enum([
    'Theory', 'Practical', 'Logical', 'Programming', 'Machine Coding', 'Debugging',
    'Scenario Based', 'Architecture', 'System Design', 'Behavioral', 'Communication',
    'Role Play', 'Technical Explanation', 'Leadership', 'Presentation', 'Problem Solving',
  ]),
  experienceLevels: z.array(z.enum(['0-1', '1-2', '2-4', '4-6', '6-8', '8-12', '12+'])).min(1),
  expectedConcepts: z.array(z.string()).min(2),
  idealAnswerPoints: z.array(z.string()).min(2),
  commonMistakes: z.array(z.string()).min(1),
  followUpTopics: z.array(z.string()).min(1),
  estimatedTimeMinutes: z.number().int().min(1).max(60),
  tags: z.array(z.string()).min(1),
  status: z.enum(['DRAFT', 'VALIDATING', 'REVIEW', 'APPROVED', 'PUBLISHED', 'DEPRECATED']),
  qualityScore: z.number().min(0).max(100),
  reviewStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  version: z.number().int().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  rubric: z.object({
    minimumExpected: z.string().min(5),
    strongAnswer: z.string().min(10),
    seniorLevelExpectations: z.string().min(10),
    expertLevelExpectations: z.string().min(10),
  }),
});
