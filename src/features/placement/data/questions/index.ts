import type {
  PlacementCategory,
  PlacementDifficulty,
  PlacementQuestion,
  PlacementQuestionRecord,
} from '../../types/placement.types'
import { APTITUDE_QUESTIONS } from './aptitude'
import { REASONING_QUESTIONS } from './reasoning'
import { VERBAL_QUESTIONS } from './verbal'
import { TECHNICAL_MCQ_QUESTIONS } from './technicalMcq'
import { INTERVIEW_QUESTIONS } from './interviewQuestions'
import { BANGALORE_STARTUP_QUESTIONS } from './bangaloreStartupQuestions'
import { ADDITIONAL_MCQS } from './additionalMcqs'
import { MORE_MCQS } from './moreMcqs'
import { EXTRA_MCQS } from './extraMcqs'
import { APTITUDE_REASONING_MCQS } from './aptitudeReasoningMcqs'
import { SQL_CS_MCQS } from './sqlCsMcqs'
import { JS_REACT_MCQS } from './jsReactMcqs'
import { DSA_PROJECT_MCQS } from './dsaProjectMcqs'
import { STARTUP_INTERVIEW_MCQS } from './startupInterviewMcqs'
import { ADVANCED_TECH_MCQS } from './advancedTechMcqs'
import { AI_GENAI_INTERVIEW_QUESTIONS } from './aiGenAiInterviewQuestions'

export { APTITUDE_QUESTIONS, REASONING_QUESTIONS, VERBAL_QUESTIONS, TECHNICAL_MCQ_QUESTIONS, INTERVIEW_QUESTIONS, BANGALORE_STARTUP_QUESTIONS, ADDITIONAL_MCQS, MORE_MCQS, EXTRA_MCQS, APTITUDE_REASONING_MCQS, SQL_CS_MCQS, JS_REACT_MCQS, DSA_PROJECT_MCQS, STARTUP_INTERVIEW_MCQS, ADVANCED_TECH_MCQS, AI_GENAI_INTERVIEW_QUESTIONS }

/**
 * Combined placement question bank.
 *
 * Only `verificationStatus: 'verified'` questions may be used in official
 * assessments — that rule is enforced by `getVerifiedQuestions` and mirrored by
 * the `placement_questions_public` database view.
 */
export const PLACEMENT_QUESTIONS: PlacementQuestionRecord[] = [
  ...APTITUDE_QUESTIONS,
  ...REASONING_QUESTIONS,
  ...VERBAL_QUESTIONS,
  ...TECHNICAL_MCQ_QUESTIONS,
  ...INTERVIEW_QUESTIONS,
  ...BANGALORE_STARTUP_QUESTIONS,
  ...ADDITIONAL_MCQS,
  ...MORE_MCQS,
  ...EXTRA_MCQS,
  ...APTITUDE_REASONING_MCQS,
  ...SQL_CS_MCQS,
  ...JS_REACT_MCQS,
  ...DSA_PROJECT_MCQS,
  ...STARTUP_INTERVIEW_MCQS,
  ...ADVANCED_TECH_MCQS,
  ...AI_GENAI_INTERVIEW_QUESTIONS,
]

export function getVerifiedQuestions(
  questions: PlacementQuestionRecord[] = PLACEMENT_QUESTIONS,
): PlacementQuestionRecord[] {
  return questions.filter((q) => q.verificationStatus === 'verified')
}

/** Strips answer/explanation — the shape a student may see before answering. */
export function toStudentQuestion(question: PlacementQuestionRecord): PlacementQuestion {
  return {
    id: question.id,
    category: question.category,
    subcategory: question.subcategory,
    topic: question.topic,
    questionType: question.questionType,
    difficulty: question.difficulty,
    prompt: question.prompt,
    codeSnippet: question.codeSnippet,
    options: question.options,
    expectedTimeSeconds: question.expectedTimeSeconds,
    points: question.points,
    languageTrack: question.languageTrack,
    tags: question.tags,
  }
}

export function getQuestionsByCategory(
  category: PlacementCategory,
  options: { verifiedOnly?: boolean; subcategory?: string } = {},
): PlacementQuestionRecord[] {
  const pool = options.verifiedOnly ? getVerifiedQuestions() : PLACEMENT_QUESTIONS
  return pool.filter(
    (q) => q.category === category && (!options.subcategory || q.subcategory === options.subcategory),
  )
}

export function getQuestionById(id: string): PlacementQuestionRecord | undefined {
  return PLACEMENT_QUESTIONS.find((q) => q.id === id)
}

/** Deterministic shuffle so a given seed always produces the same paper. */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items]
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  for (let i = result.length - 1; i > 0; i -= 1) {
    state = (state * 16807) % 2147483647
    const j = Math.floor((state / 2147483647) * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickQuestions(
  criteria: {
    categories?: PlacementCategory[]
    subcategories?: string[]
    difficulties?: PlacementDifficulty[]
    limit?: number
    excludeIds?: string[]
    seed?: number
    verifiedOnly?: boolean
  },
): PlacementQuestionRecord[] {
  const {
    categories,
    subcategories,
    difficulties,
    limit = 10,
    excludeIds = [],
    seed = Date.now() % 100000,
    verifiedOnly = true,
  } = criteria

  let pool = verifiedOnly ? getVerifiedQuestions() : PLACEMENT_QUESTIONS
  if (categories?.length) pool = pool.filter((q) => categories.includes(q.category))
  if (subcategories?.length) pool = pool.filter((q) => subcategories.includes(q.subcategory))
  if (difficulties?.length) pool = pool.filter((q) => difficulties.includes(q.difficulty))
  if (excludeIds.length) pool = pool.filter((q) => !excludeIds.includes(q.id))

  return seededShuffle(pool, seed).slice(0, Math.max(0, limit))
}

export interface DailyPracticePlan {
  key: string
  label: string
  category: PlacementCategory
  target: number
  questions: PlacementQuestionRecord[]
  route: string
}

/**
 * Builds the "Today's priority" workload from the configured daily targets and
 * the student's actual weak areas. Never invents topics — weak areas come from
 * recorded attempts and interview feedback.
 */
export function buildDailyPracticePlan(
  workload: {
    aptitude: number
    reasoning: number
    technicalMcq: number
    dsa: number
    programming: number
    frontendPractice: number
    interviewAnswer: number
  },
  weakSubcategories: string[],
  dayNumber: number,
): DailyPracticePlan[] {
  const seed = dayNumber * 977
  const plan: DailyPracticePlan[] = [
    {
      key: 'aptitude',
      label: `Solve ${workload.aptitude} aptitude questions`,
      category: 'aptitude',
      target: workload.aptitude,
      questions: pickQuestions({ categories: ['aptitude'], limit: workload.aptitude, seed }),
      route: '/placement?view=practice',
    },
    {
      key: 'reasoning',
      label: `Solve ${workload.reasoning} reasoning questions`,
      category: 'reasoning',
      target: workload.reasoning,
      questions: pickQuestions({ categories: ['reasoning'], limit: workload.reasoning, seed: seed + 1 }),
      route: '/placement?view=practice',
    },
    {
      key: 'technical_mcq',
      label: `Complete ${workload.technicalMcq} technical MCQs`,
      category: 'technical_mcq',
      target: workload.technicalMcq,
      questions: pickQuestions({ categories: ['technical_mcq'], limit: workload.technicalMcq, seed: seed + 2 }),
      route: '/placement?view=practice',
    },
    {
      key: 'dsa',
      label: `Solve ${workload.dsa} DSA problems`,
      category: 'dsa',
      target: workload.dsa,
      questions: [],
      route: '/dsa/questions',
    },
    {
      key: 'programming',
      label: `Complete ${workload.programming} programming problems`,
      category: 'programming',
      target: workload.programming,
      questions: [],
      route: '/core-programming',
    },
    {
      key: 'frontend',
      label: `Complete ${workload.frontendPractice} frontend practice task`,
      category: 'frontend',
      target: workload.frontendPractice,
      questions: [],
      route: '/frontend-javascript',
    },
    {
      key: 'interview',
      label: `Practice ${workload.interviewAnswer} interview answer`,
      category: 'communication',
      target: workload.interviewAnswer,
      questions: pickQuestions({ categories: ['communication'], limit: workload.interviewAnswer, seed: seed + 3 }),
      route: '/placement?view=interview-prep',
    },
  ]

  if (weakSubcategories.length) {
    const weaknessQuestions = pickQuestions({
      subcategories: weakSubcategories,
      limit: 6,
      seed: seed + 4,
      verifiedOnly: true,
    })
    if (weaknessQuestions.length) {
      plan.push({
        key: 'weakness',
        label: `Re-attempt ${weaknessQuestions.length} questions in your weak topics`,
        category: weaknessQuestions[0]?.category ?? 'technical_mcq',
        target: weaknessQuestions.length,
        questions: weaknessQuestions,
        route: '/placement?view=practice',
      })
    }
  }

  return plan
}

/** Generates a weakness-focused practice set from recorded weak subcategories. */
export function buildWeaknessPracticeSet(
  weakSubcategories: string[],
  limit = 15,
): PlacementQuestionRecord[] {
  if (!weakSubcategories.length) return []
  return pickQuestions({ subcategories: weakSubcategories, limit, seed: 4242 })
}
