import { DSA_QUESTIONS } from '../src/components/dsa/data/dsaQuestions'
import type { DSAQuestion, DSATestCase } from '../src/components/dsa/data/dsaTypes'

interface AuditResult {
  total: number
  easyCount: number
  mediumCount: number
  difficultCount: number
  missingNumbers: number[]
  duplicateNumbers: number[]
  duplicateTitles: string[]
  duplicateSlugs: string[]
  missingJSSolutions: string[]
  missingTSSolutions: string[]
  malformedQuestions: { id: string; reason: string }[]
  invalidDifficulties: { id: string; val: string }[]
  testExecutionFailures: { id: string; error: string }[]
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }
    return true
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false
    if (!deepEqual(a[k], b[k])) return false
  }
  return true
}

function flexibleEqual(actual: any, expected: any): boolean {
  if (deepEqual(actual, expected)) return true
  if (Array.isArray(actual) && Array.isArray(expected) && actual.length === expected.length) {
    if (actual.every(x => typeof x === 'number') && expected.every(x => typeof x === 'number')) {
      const sA = [...actual].sort((x, y) => x - y)
      const sE = [...expected].sort((x, y) => x - y)
      if (deepEqual(sA, sE)) return true
    }
    if (actual.every(x => typeof x === 'string') && expected.every(x => typeof x === 'string')) {
      const sA = [...actual].sort()
      const sE = [...expected].sort()
      if (deepEqual(sA, sE)) return true
    }
  }
  return false
}

export function runAudit(): AuditResult {
  const result: AuditResult = {
    total: DSA_QUESTIONS.length,
    easyCount: 0,
    mediumCount: 0,
    difficultCount: 0,
    missingNumbers: [],
    duplicateNumbers: [],
    duplicateTitles: [],
    duplicateSlugs: [],
    missingJSSolutions: [],
    missingTSSolutions: [],
    malformedQuestions: [],
    invalidDifficulties: [],
    testExecutionFailures: [],
  }

  const seenNumbers = new Set<number>()
  const seenTitles = new Set<string>()
  const seenSlugs = new Set<string>()

  // 1. Audit each question
  for (let i = 0; i < DSA_QUESTIONS.length; i++) {
    const q = DSA_QUESTIONS[i]

    // Number check
    if (seenNumbers.has(q.number)) {
      result.duplicateNumbers.push(q.number)
    }
    seenNumbers.add(q.number)

    // Title check
    if (seenTitles.has(q.title)) {
      result.duplicateTitles.push(q.title)
    }
    seenTitles.add(q.title)

    // Slug check
    if (seenSlugs.has(q.slug)) {
      result.duplicateSlugs.push(q.slug)
    }
    seenSlugs.add(q.slug)

    // Difficulty check
    if (q.difficulty === 'Easy') result.easyCount++
    else if (q.difficulty === 'Medium') result.mediumCount++
    else if (q.difficulty === 'Difficult') result.difficultCount++
    else result.invalidDifficulties.push({ id: q.id, val: String(q.difficulty) })

    // Required fields check
    const requiredStringFields = [
      'id', 'title', 'slug', 'difficulty', 'topic', 'problemStatement',
      'approach', 'stepByStepExplanation', 'optimalApproach', 'timeComplexity',
      'spaceComplexity', 'functionName', 'starterCodeJS', 'starterCodeTS',
      'solutionJS', 'solutionTS'
    ] as const

    for (const field of requiredStringFields) {
      if (!q[field] || typeof q[field] !== 'string' || q[field].trim() === '') {
        result.malformedQuestions.push({ id: q.id, reason: `Empty or invalid field: ${field}` })
      }
    }

    if (!Array.isArray(q.pattern) || q.pattern.length === 0) {
      result.malformedQuestions.push({ id: q.id, reason: 'Empty or missing pattern array' })
    }

    if (!Array.isArray(q.tags) || q.tags.length === 0) {
      result.malformedQuestions.push({ id: q.id, reason: 'Empty or missing tags array' })
    }

    if (!Array.isArray(q.examples) || q.examples.length === 0) {
      result.malformedQuestions.push({ id: q.id, reason: 'Empty or missing examples array' })
    }

    if (!Array.isArray(q.constraints) || q.constraints.length === 0) {
      result.malformedQuestions.push({ id: q.id, reason: 'Empty or missing constraints array' })
    }

    if (!Array.isArray(q.hints) || q.hints.length === 0) {
      result.malformedQuestions.push({ id: q.id, reason: 'Empty or missing hints array' })
    }

    if (!Array.isArray(q.testCases) || q.testCases.length === 0) {
      result.malformedQuestions.push({ id: q.id, reason: 'Empty or missing testCases array' })
    }

    // Solutions check
    if (!q.solutionJS || !q.solutionJS.includes(q.functionName)) {
      result.missingJSSolutions.push(q.id)
    }
    if (!q.solutionTS || !q.solutionTS.includes(q.functionName)) {
      result.missingTSSolutions.push(q.id)
    }

    // Test case execution check
    try {
      // Create execution sandbox for solutionJS
      const fn = new Function(`${q.solutionJS}; return ${q.functionName};`)()
      if (typeof fn !== 'function') {
        result.testExecutionFailures.push({ id: q.id, error: `Function ${q.functionName} not created by solutionJS` })
      } else {
        for (const tc of q.testCases) {
          let args: any[] = []
          try {
            const parsed = JSON.parse(tc.input)
            args = Array.isArray(parsed) ? parsed : [parsed]
          } catch {
            args = [tc.input]
          }

          let expected: any
          try {
            expected = JSON.parse(tc.expectedOutput)
          } catch {
            expected = tc.expectedOutput
          }

          const actual = fn(...args)
          if (!flexibleEqual(actual, expected)) {
            result.testExecutionFailures.push({
              id: q.id,
              error: `Test case ${tc.id} failed: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
            })
            break
          }
        }
      }
    } catch (err: any) {
      result.testExecutionFailures.push({ id: q.id, error: err.message || String(err) })
    }
  }

  // 2. Check for missing numbers between 1 and 1000
  for (let n = 1; n <= 1000; n++) {
    if (!seenNumbers.has(n)) {
      result.missingNumbers.push(n)
    }
  }

  return result
}

// Execute and print summary
console.log('--- Starting Comprehensive 1,000 DSA Questions Audit ---')
const t0 = Date.now()
const res = runAudit()
const duration = Date.now() - t0

console.log(`Audit completed in ${duration}ms.\n`)
console.log('==================================================')
console.log('1. DATASET INTEGRITY')
console.log('==================================================')
console.log(`Total Questions:         ${res.total}`)
console.log(`Easy Count:              ${res.easyCount} (${((res.easyCount / res.total) * 100).toFixed(1)}%)`)
console.log(`Medium Count:            ${res.mediumCount} (${((res.mediumCount / res.total) * 100).toFixed(1)}%)`)
console.log(`Difficult Count:         ${res.difficultCount} (${((res.difficultCount / res.total) * 100).toFixed(1)}%)`)
console.log(`Missing Numbers:         ${res.missingNumbers.length === 0 ? 'None (0)' : res.missingNumbers.join(', ')}`)
console.log(`Duplicate Numbers:       ${res.duplicateNumbers.length === 0 ? 'None (0)' : res.duplicateNumbers.join(', ')}`)
console.log(`Duplicate Titles:        ${res.duplicateTitles.length === 0 ? 'None (0)' : JSON.stringify(res.duplicateTitles)}`)
console.log(`Duplicate Slugs:         ${res.duplicateSlugs.length === 0 ? 'None (0)' : JSON.stringify(res.duplicateSlugs)}`)
console.log(`Invalid Difficulty:      ${res.invalidDifficulties.length === 0 ? 'None (0)' : JSON.stringify(res.invalidDifficulties)}`)
console.log(`Malformed Questions:     ${res.malformedQuestions.length === 0 ? 'None (0)' : res.malformedQuestions.length}`)
console.log(`Missing JS Solutions:    ${res.missingJSSolutions.length === 0 ? 'None (0)' : res.missingJSSolutions.length}`)
console.log(`Missing TS Solutions:    ${res.missingTSSolutions.length === 0 ? 'None (0)' : res.missingTSSolutions.length}`)
console.log(`Test Execution Failures: ${res.testExecutionFailures.length === 0 ? 'None (0) - 100% PASS' : res.testExecutionFailures.length}`)

if (res.testExecutionFailures.length > 0) {
  console.log('\nSample failures (first 5):', res.testExecutionFailures.slice(0, 5))
}
