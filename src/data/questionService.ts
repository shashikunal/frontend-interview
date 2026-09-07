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

export const STANDARD_CATEGORIES = [
  'JavaScript',
  'TypeScript',
  'ReactJS',
  'React Redux Toolkit',
  'React Query',
  'DOM',
  'LeetCode',
] as const

export type StandardCategory = typeof STANDARD_CATEGORIES[number]

export function normalizeCategory(cat: string = '', title: string = '', source: string = ''): StandardCategory {
  const c = cat.trim()
  const t = title.toLowerCase()
  const s = source.toLowerCase()

  // 1. React Redux Toolkit
  if (
    t.includes('redux') ||
    t.includes('toolkit') ||
    t.includes('rtk') ||
    t.includes('slice') ||
    t.includes('dispatch') ||
    t.includes('action creator') ||
    t.includes('redux-thunk') ||
    t.includes('usedispatch') ||
    t.includes('useselector') ||
    t.includes('global store') ||
    t.includes('store subscriber') ||
    t.includes('flux architecture')
  ) {
    return 'React Redux Toolkit'
  }

  // 2. React Query
  if (
    t.includes('react query') ||
    t.includes('tanstack query') ||
    t.includes('usequery') ||
    t.includes('usemutation') ||
    t.includes('queryclient') ||
    t.includes('swr') ||
    t.includes('stale-while-revalidate') ||
    t.includes('data fetching') ||
    t.includes('cache invalidation') ||
    t.includes('optimistic update') ||
    t.includes('infinite scroll') ||
    t.includes('pagination') ||
    t.includes('polling') ||
    t.includes('retry logic') ||
    t.includes('background refetch') ||
    ((c === 'ReactJS' || s.includes('react')) && (t.includes('fetch') || t.includes('api request') || t.includes('caching') || t.includes('async request')))
  ) {
    return 'React Query'
  }

  // 3. TypeScript
  if (
    c === 'TypeScript' ||
    s.includes('typescript') ||
    t.includes('typescript') ||
    t.includes('generics') ||
    t.includes('type system')
  ) {
    return 'TypeScript'
  }

  // 4. DOM
  if (
    c === 'DOM & Web APIs' ||
    c === 'Accessibility' ||
    s.includes('dom') ||
    t.includes('dom') ||
    t.includes('event listener') ||
    t.includes('mutationobserver') ||
    t.includes('shadow dom') ||
    t.includes('custom element') ||
    t.includes('queryselector') ||
    t.includes('event delegation') ||
    t.includes('bubbling') ||
    t.includes('capturing') ||
    t.includes('drag and drop') ||
    t.includes('canvas')
  ) {
    return 'DOM'
  }

  // 5. LeetCode
  if (
    c === 'Algorithms' ||
    c === 'Data Structures' ||
    s.includes('leetcode') ||
    s.includes('algomonster') ||
    t.includes('leetcode') ||
    t.includes('binary tree') ||
    t.includes('dynamic programming') ||
    t.includes('graph') ||
    t.includes('two pointers') ||
    t.includes('sliding window')
  ) {
    return 'LeetCode'
  }

  // 6. ReactJS
  if (
    c === 'ReactJS' ||
    s.includes('react') ||
    t.includes('react') ||
    t.includes('usestate') ||
    t.includes('useeffect') ||
    t.includes('usememo') ||
    t.includes('usecallback') ||
    t.includes('useref') ||
    t.includes('usereducer') ||
    t.includes('custom hook') ||
    t.includes('jsx') ||
    t.includes('virtual dom') ||
    t.includes('props') ||
    t.includes('component')
  ) {
    return 'ReactJS'
  }

  // 7. JavaScript
  return 'JavaScript'
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
          return items.map(q => ({
            ...q,
            source: q.source ?? source,
            category: normalizeCategory(q.category, q.question, q.source ?? source),
          }))
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
  const found = new Set(all.map(q => q.category))
  const list = (STANDARD_CATEGORIES as unknown as string[]).filter(c => found.has(c))
  return list.length > 0 ? list : Array.from(found)
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
