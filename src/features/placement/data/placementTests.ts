export interface PlacementTest {
  id: string
  name: string
  description: string
  category: string
  durationMinutes: number
  questionCount: number
  passingScore: number
  negativeMarking: boolean
  difficulty: ('easy' | 'medium' | 'hard')[]
  subjects: string[]
}

export const PLACEMENT_TESTS: PlacementTest[] = [
  {
    id: 'test-aptitude',
    name: 'Aptitude Test',
    description: 'Quantitative aptitude covering percentages, ratios, time & work, and more.',
    category: 'aptitude',
    durationMinutes: 30,
    questionCount: 20,
    passingScore: 60,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['aptitude'],
  },
  {
    id: 'test-reasoning',
    name: 'Reasoning Test',
    description: 'Logical reasoning including series, coding-decoding, blood relations, and puzzles.',
    category: 'reasoning',
    durationMinutes: 30,
    questionCount: 20,
    passingScore: 60,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['reasoning'],
  },
  {
    id: 'test-technical',
    name: 'Technical MCQ Test',
    description: 'Technical questions covering JavaScript, React, TypeScript, HTML, and CSS.',
    category: 'technical',
    durationMinutes: 45,
    questionCount: 30,
    passingScore: 65,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['technical_mcq', 'frontend'],
  },
  {
    id: 'test-javascript',
    name: 'JavaScript Test',
    description: 'Deep JavaScript knowledge including closures, promises, prototypes, and ES6+.',
    category: 'javascript',
    durationMinutes: 45,
    questionCount: 25,
    passingScore: 70,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['technical_mcq'],
  },
  {
    id: 'test-react',
    name: 'React Test',
    description: 'React fundamentals, hooks, state management, and component patterns.',
    category: 'react',
    durationMinutes: 45,
    questionCount: 25,
    passingScore: 70,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['frontend'],
  },
  {
    id: 'test-programming',
    name: 'Programming Test',
    description: 'Coding problems focusing on arrays, strings, and basic algorithms.',
    category: 'programming',
    durationMinutes: 60,
    questionCount: 10,
    passingScore: 60,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['dsa', 'programming'],
  },
  {
    id: 'test-dsa',
    name: 'DSA Test',
    description: 'Data structures and algorithms including arrays, strings, hashing, and two pointers.',
    category: 'dsa',
    durationMinutes: 60,
    questionCount: 15,
    passingScore: 65,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['dsa'],
  },
  {
    id: 'test-api',
    name: 'API & HTTP Test',
    description: 'HTTP methods, REST, authentication, CORS, and API design.',
    category: 'api',
    durationMinutes: 30,
    questionCount: 20,
    passingScore: 65,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['technical_mcq'],
  },
  {
    id: 'test-ai',
    name: 'AI/GenAI Test',
    description: 'AI fundamentals, LLMs, prompt engineering, RAG, and AI applications.',
    category: 'ai',
    durationMinutes: 30,
    questionCount: 20,
    passingScore: 60,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['technical_mcq'],
  },
  {
    id: 'test-mixed',
    name: 'Mixed Placement Test',
    description: 'Comprehensive test covering aptitude, reasoning, technical, and programming.',
    category: 'mixed',
    durationMinutes: 90,
    questionCount: 50,
    passingScore: 65,
    negativeMarking: false,
    difficulty: ['easy', 'medium'],
    subjects: ['aptitude', 'reasoning', 'technical_mcq', 'dsa', 'programming'],
  },
]

export function getPlacementTest(id: string): PlacementTest | undefined {
  return PLACEMENT_TESTS.find((t) => t.id === id)
}

export function getPlacementTestsByCategory(category: string): PlacementTest[] {
  return PLACEMENT_TESTS.filter((t) => t.category === category)
}
