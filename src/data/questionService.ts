import type { Question } from '../models/question'

// Maps each data file to a friendly source label shown in the UI.
export const SOURCE_LABELS: Record<string, string> = {
  'leetcode-style': 'LeetCode-style',
  'frontendmasters-style': 'FrontendMasters-style',
  'greatfrontend-javascript': 'GreatFrontEnd',
  'greatfrontend-react': 'GreatFrontEnd',
  'greatfrontend-typescript': 'GreatFrontEnd',
  'greatfrontend-dom': 'GreatFrontEnd',
  'leetcode': 'LeetCode',
  'algomonster': 'AlgoMonster',
  'educative': 'Educative',
  'frontendlead': 'FrontendLead',
  'topbrains': 'TopBrains',
  'js-assignments': 'JS Assignments',
  'system-design': 'System Design & Arch',
}

export const GENERATED_SOURCE = 'LeetCode-style'

export const DATA_FILES = [
  'leetcode-style',
  'frontendmasters-style',
  'greatfrontend-javascript',
  'greatfrontend-react',
  'greatfrontend-typescript',
  'greatfrontend-dom',
  'leetcode',
  'algomonster',
  'educative',
  'frontendlead',
  'topbrains',
  'js-assignments',
  'system-design',
] as const


let cache: Question[] | null = null
let loading: Promise<Question[]> | null = null

function fileUrl(name: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  return `${base}data/${name}.json`
}

export function loadAll(): Promise<Question[]> {
  if (cache) return Promise.resolve(cache)
  if (!loading) {
    loading = Promise.all(
      DATA_FILES.map(async name => {
        try {
          const res = await fetch(fileUrl(name))
          if (!res.ok) return [] as Question[]
          const items = (await res.json()) as Question[]
          const source = SOURCE_LABELS[name] ?? name
          return items.map(q => ({ ...q, source: q.source ?? source }))
        } catch {
          return [] as Question[]
        }
      })
    )
      .then(results => {
        cache = results.flat()
        return cache
      })
      .catch(err => {
        loading = null
        throw err
      })
  }
  return loading
}

export function getAllSync(): Question[] {
  return cache ?? []
}

export function getById(all: Question[], id: number): Question | undefined {
  return all.find(q => q.id === id)
}

export function getCategories(all: Question[]): string[] {
  return Array.from(new Set(all.map(q => q.category)))
}

export interface SourceStat {
  name: string
  count: number
}

export function getSources(all: Question[]): SourceStat[] {
  const map = new Map<string, number>()
  for (const q of all) {
    const key = q.source ?? GENERATED_SOURCE
    map.set(key, (map.get(key) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function getByCategory(all: Question[], category: string): Question[] {
  return all.filter(q => q.category === category)
}

export function getCodingCount(all: Question[]): number {
  return all.filter(q => q.code).length
}

export function search(all: Question[], term: string): Question[] {
  const t = term.toLowerCase()
  return all.filter(
    q =>
      q.question.toLowerCase().includes(t) ||
      q.answer.toLowerCase().includes(t) ||
      q.category.toLowerCase().includes(t)
  )
}

export function getStats(all: Question[]): { total: number; byCategory: { name: string; count: number }[] } {
  const map = new Map<string, number>()
  all.forEach(q => map.set(q.category, (map.get(q.category) || 0) + 1))
  return {
    total: all.length,
    byCategory: Array.from(map.entries()).map(([name, count]) => ({ name, count })),
  }
}

export function getDifficultyBreakdown(all: Question[]): { easy: number; medium: number; hard: number } {
  return all.reduce(
    (acc, q) => {
      if (q.difficulty === 'Easy') acc.easy++
      else if (q.difficulty === 'Medium') acc.medium++
      else if (q.difficulty === 'Hard') acc.hard++
      return acc
    },
    { easy: 0, medium: 0, hard: 0 }
  )
}
