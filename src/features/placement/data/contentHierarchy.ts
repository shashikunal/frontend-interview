export type SubjectId =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'nextjs'
  | 'browser-apis'
  | 'http-rest'
  | 'authentication'
  | 'web-security'
  | 'web-performance'
  | 'testing'
  | 'dsa'
  | 'java'
  | 'python'
  | 'sql'
  | 'git-github'
  | 'debugging'
  | 'deployment'
  | 'system-design'
  | 'ai-genai'
  | 'machine-coding'
  | 'frontend-projects'
  | 'aptitude'
  | 'reasoning'
  | 'verbal'
  | 'communication'
  | 'interview'

export interface Subtopic {
  id: string
  name: string
  theory: string
  keyPoints: string[]
  commonMistakes: string[]
  interviewQuestions: string[]
  followUps: string[]
}

export interface Topic {
  id: string
  name: string
  subtopics: Subtopic[]
}

export interface Chapter {
  id: string
  name: string
  topics: Topic[]
}

export interface Subject {
  id: SubjectId
  name: string
  icon: string
  description: string
  chapters: Chapter[]
}

export const CONTENT_HIERARCHY: Subject[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'JS',
    description: 'Master JavaScript from fundamentals to advanced concepts',
    chapters: [
      {
        id: 'js-fundamentals',
        name: 'Fundamentals',
        topics: [
          {
            id: 'js-variables',
            name: 'Variables & Data Types',
            subtopics: [
              {
                id: 'js-var-let-const',
                name: 'var, let, const',
                theory: 'var is function-scoped and hoisted with undefined. let is block-scoped and hoisted but not initialized (temporal dead zone). const is block-scoped and cannot be reassigned after declaration.',
                keyPoints: ['var: function-scoped, hoisted', 'let: block-scoped, TDZ', 'const: block-scoped, immutable binding'],
                commonMistakes: ['Using var in modern code', 'Assuming const makes objects immutable', 'Not understanding TDZ'],
                interviewQuestions: ['What is the difference between var, let and const?', 'What is temporal dead zone?'],
                followUps: ['Why was let introduced?', 'When would you use var today?'],
              },
              {
                id: 'js-types',
                name: 'Data Types',
                theory: 'JavaScript has 7 primitive types (undefined, null, boolean, number, string, symbol, bigint) and 1 object type. typeof null returns "object" — a historical bug.',
                keyPoints: ['7 primitive types', 'typeof null === "object"', 'NaN is a number type'],
                commonMistakes: ['Confusing null and undefined', 'Not knowing typeof NaN', 'Using == instead of ==='],
                interviewQuestions: ['What are the data types in JavaScript?', 'What is typeof null?'],
                followUps: ['Why is typeof null "object"?', 'What is the difference between null and undefined?'],
              },
            ],
          },
          {
            id: 'js-functions',
            name: 'Functions',
            subtopics: [
              {
                id: 'js-closures',
                name: 'Closures',
                theory: 'A closure is a function that remembers the variables from the scope where it was created, even after that scope has finished executing. Every function in JavaScript is a closure.',
                keyPoints: ['Function + lexical scope = closure', 'Used for data privacy, function factories', 'Can cause memory leaks if not managed'],
                commonMistakes: ['Creating closures in loops with var', 'Not understanding memory implications', 'Overusing closures'],
                interviewQuestions: ['What is a closure?', 'Give a practical example of closures'],
                followUps: ['How do closures cause memory leaks?', 'What is the module pattern?'],
              },
              {
                id: 'js-this',
                name: 'this keyword',
                theory: 'this refers to the object that is executing the current function. Its value depends on how a function is called: default binding, implicit binding, explicit binding (call/apply/bind), or new binding.',
                keyPoints: ['Default: global/window', 'Implicit: object method', 'Explicit: call/apply/bind', 'Arrow functions: lexical this'],
                commonMistakes: ['Losing this in callbacks', 'Not understanding arrow function this', 'Confusing call vs apply'],
                interviewQuestions: ['What is this in JavaScript?', 'How do arrow functions handle this?'],
                followUps: ['What is the difference between call, apply and bind?', 'How does this work in event handlers?'],
              },
            ],
          },
        ],
      },
      {
        id: 'js-async',
        name: 'Async JavaScript',
        topics: [
          {
            id: 'js-promises',
            name: 'Promises',
            subtopics: [
              {
                id: 'js-promise-basics',
                name: 'Promise Fundamentals',
                theory: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states: pending, fulfilled, and rejected.',
                keyPoints: ['Three states: pending, fulfilled, rejected', 'then/catch/finally', 'Promise chaining'],
                commonMistakes: ['Not returning promises in then', 'Forgetting catch', 'Nested promise pyramids'],
                interviewQuestions: ['What is a Promise?', 'How do you handle promise errors?'],
                followUps: ['What is promise chaining?', 'How do promises differ from callbacks?'],
              },
              {
                id: 'js-async-await',
                name: 'Async/Await',
                theory: 'async/await is syntactic sugar over Promises. An async function always returns a Promise. await pauses the function execution until the Promise resolves.',
                keyPoints: ['async function returns Promise', 'await pauses execution', 'try/catch for error handling'],
                commonMistakes: ['Not using try/catch', 'Awaiting in loops unnecessarily', 'Forgetting await'],
                interviewQuestions: ['What is async/await?', 'How do you handle errors in async functions?'],
                followUps: ['What is the difference between Promise.all and sequential await?', 'How does async await work under the hood?'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'react',
    name: 'React',
    icon: 'R',
    description: 'Build modern UIs with React hooks and patterns',
    chapters: [
      {
        id: 'react-fundamentals',
        name: 'Fundamentals',
        topics: [
          {
            id: 'react-hooks',
            name: 'Hooks',
            subtopics: [
              {
                id: 'react-usestate',
                name: 'useState',
                theory: 'useState is a Hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.',
                keyPoints: ['State triggers re-render', 'Functional updates for prev state', 'Lazy initialization'],
                commonMistakes: ['Direct state mutation', 'Not using functional updates', 'Too many state variables'],
                interviewQuestions: ['What is useState?', 'How does state differ from props?'],
                followUps: ['When does useState re-render?', 'What is lazy initialization?'],
              },
              {
                id: 'react-useeffect',
                name: 'useEffect',
                theory: 'useEffect lets you perform side effects in functional components. It runs after render and can optionally clean up before the next effect or unmount.',
                keyPoints: ['Runs after render', 'Dependency array controls when it runs', 'Cleanup function for side effects'],
                commonMistakes: ['Missing dependencies', 'Not cleaning up subscriptions', 'Infinite loops'],
                interviewQuestions: ['What is useEffect?', 'When does useEffect run?'],
                followUps: ['What is the cleanup function?', 'How do you prevent infinite loops?'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'aptitude',
    name: 'Aptitude',
    icon: 'A',
    description: 'Master quantitative aptitude for placement tests',
    chapters: [
      {
        id: 'apt-percentages',
        name: 'Percentages',
        topics: [
          {
            id: 'apt-percent-basics',
            name: 'Percentage Fundamentals',
            subtopics: [
              {
                id: 'apt-percent-calc',
                name: 'Percentage Calculations',
                theory: 'Percentage means per hundred. To find x% of y: (x/100) × y. Percentage change = ((New - Old) / Old) × 100.',
                keyPoints: ['x% of y = (x/100) × y', 'Percentage change formula', 'Successive percentage changes'],
                commonMistakes: ['Confusing percentage points with percent', 'Wrong base for percentage change', 'Not converting fractions properly'],
                interviewQuestions: ['What is 20% of 500?', 'If a price increases by 20% then decreases by 20%, what is the net change?'],
                followUps: ['How do you calculate percentage change?', 'What is the difference between percentage and percentage points?'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    icon: 'R',
    description: 'Develop logical reasoning skills for placement tests',
    chapters: [
      {
        id: 'reasoning-series',
        name: 'Series & Patterns',
        topics: [
          {
            id: 'reasoning-number-series',
            name: 'Number Series',
            subtopics: [
              {
                id: 'reasoning-series-types',
                name: 'Types of Number Series',
                theory: 'Number series can be arithmetic (constant difference), geometric (constant ratio), alternating, or based on squares/cubes. Identify the pattern by checking differences between consecutive terms.',
                keyPoints: ['Arithmetic: constant difference', 'Geometric: constant ratio', 'Check differences first'],
                commonMistakes: ['Not checking differences carefully', 'Assuming arithmetic when geometric', 'Missing alternating patterns'],
                interviewQuestions: ['Find the next term: 2, 6, 12, 20, 30, ?', 'Complete the series: 3, 6, 12, 24, ?'],
                followUps: ['How do you identify the type of series?', 'What is the difference between arithmetic and geometric series?'],
              },
            ],
          },
        ],
      },
    ],
  },
]

export function getSubject(id: SubjectId): Subject | undefined {
  return CONTENT_HIERARCHY.find((s) => s.id === id)
}

export function getChapter(subjectId: SubjectId, chapterId: string): Chapter | undefined {
  return getSubject(subjectId)?.chapters.find((c) => c.id === chapterId)
}

export function getTopic(subjectId: SubjectId, chapterId: string, topicId: string): Topic | undefined {
  return getChapter(subjectId, chapterId)?.topics.find((t) => t.id === topicId)
}

export function getSubtopic(
  subjectId: SubjectId,
  chapterId: string,
  topicId: string,
  subtopicId: string,
): Subtopic | undefined {
  return getTopic(subjectId, chapterId, topicId)?.subtopics.find((s) => s.id === subtopicId)
}

export function getAllSubtopics(subjectId: SubjectId): Subtopic[] {
  const subject = getSubject(subjectId)
  if (!subject) return []
  return subject.chapters.flatMap((c) => c.topics.flatMap((t) => t.subtopics))
}
