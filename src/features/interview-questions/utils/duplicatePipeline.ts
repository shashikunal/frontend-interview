// src/features/interview-questions/utils/duplicatePipeline.ts
import type { MasterQuestion, MasterSubjectId } from '../types/interviewQuestions.types'

/**
 * Normalizes question text for semantic comparison:
 * - Converts to lowercase
 * - Strips punctuation, quotes, trailing question marks
 * - Strips common question prefixes ("what is", "explain", "how does", "describe", "define", "what are", "difference between")
 * - Normalizes whitespace
 */
export function normalizeQuestionText(text: string): string {
  if (!text) return ''

  let clean = text.toLowerCase().trim()

  // Remove code markdown wrappers
  clean = clean.replace(/[`*_\-#<>]/g, ' ')

  // Remove punctuation
  clean = clean.replace(/[?.,!;:()[\]{}"'\\\/]/g, ' ')

  // Normalize whitespace
  clean = clean.replace(/\s+/g, ' ').trim()

  // Remove standard query prefixes that make two questions semantically identical
  const prefixes = [
    /^what is the difference between\s+/,
    /^what are the differences between\s+/,
    /^difference between\s+/,
    /^compare\s+/,
    /^what is\s+/,
    /^what are\s+/,
    /^how does\s+/,
    /^how do\s+/,
    /^explain\s+/,
    /^describe\s+/,
    /^define\s+/,
    /^can you explain\s+/,
    /^tell me about\s+/,
  ]

  for (const prefix of prefixes) {
    if (prefix.test(clean)) {
      clean = clean.replace(prefix, '').trim()
      break
    }
  }

  // Remove filler suffix phrases
  clean = clean.replace(/\s+in javascript$/i, '')
  clean = clean.replace(/\s+in react$/i, '')
  clean = clean.replace(/\s+in html5?$/i, '')
  clean = clean.replace(/\s+in css3?$/i, '')
  clean = clean.replace(/\s+in jquery$/i, '')
  clean = clean.replace(/\s+work$/i, '')

  return clean.trim()
}

/**
 * Generates a deterministic hash from the normalized question text and topic
 */
export function computeQuestionHash(questionText: string, topic?: string): string {
  const normQ = normalizeQuestionText(questionText)
  const normT = (topic || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const combined = `${normT}:::${normQ}`

  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }

  return `qh_${Math.abs(hash).toString(16)}`
}

/**
 * Calculates token-level Jaccard similarity between two strings (0.0 to 1.0)
 */
export function calculateSemanticSimilarity(textA: string, textB: string): number {
  const normA = normalizeQuestionText(textA)
  const normB = normalizeQuestionText(textB)

  if (normA === normB) return 1.0

  const tokensA = new Set(normA.split(' ').filter(w => w.length > 2))
  const tokensB = new Set(normB.split(' ').filter(w => w.length > 2))

  if (tokensA.size === 0 || tokensB.size === 0) return 0.0

  let intersection = 0
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection++
    }
  }

  const union = new Set([...tokensA, ...tokensB]).size
  return union === 0 ? 0 : intersection / union
}

export interface DuplicateCheckResult {
  isDuplicate: boolean
  matchType?: 'EXACT' | 'HASH' | 'SEMANTIC'
  similarityScore?: number
  matchedQuestionId?: string
  matchedQuestionTitle?: string
  reason?: string
}

/**
 * Comprehensive duplicate verification pipeline:
 * 1. Checks exact title match
 * 2. Checks question_hash match
 * 3. Checks semantic token similarity (threshold >= 0.78)
 */
export function verifyQuestionDuplicate(
  candidate: Partial<MasterQuestion>,
  existingBank: MasterQuestion[]
): DuplicateCheckResult {
  if (!candidate.question) {
    return { isDuplicate: false }
  }

  const candidateHash = candidate.question_hash || computeQuestionHash(candidate.question, candidate.topic)

  for (const item of existingBank) {
    // Skip checking against itself
    if (candidate.id && item.id === candidate.id) continue

    // 1. Exact string match
    if (candidate.question.trim().toLowerCase() === item.question.trim().toLowerCase()) {
      return {
        isDuplicate: true,
        matchType: 'EXACT',
        similarityScore: 1.0,
        matchedQuestionId: item.id,
        matchedQuestionTitle: item.question,
        reason: `Exact identical title to question ${item.id}`,
      }
    }

    // 2. Hash match
    const itemHash = item.question_hash || computeQuestionHash(item.question, item.topic)
    if (candidateHash === itemHash) {
      return {
        isDuplicate: true,
        matchType: 'HASH',
        similarityScore: 1.0,
        matchedQuestionId: item.id,
        matchedQuestionTitle: item.question,
        reason: `Deterministic normalized hash match with question ${item.id}`,
      }
    }

    // 3. Semantic similarity match
    const sim = calculateSemanticSimilarity(candidate.question, item.question)
    if (sim >= 0.78) {
      return {
        isDuplicate: true,
        matchType: 'SEMANTIC',
        similarityScore: sim,
        matchedQuestionId: item.id,
        matchedQuestionTitle: item.question,
        reason: `Semantic duplicate (${Math.round(sim * 100)}% match) of question ${item.id}: "${item.question}"`,
      }
    }
  }

  return { isDuplicate: false }
}

/**
 * Formats standardized globally unique ID:
 * e.g. HTML-000001, HTML-MCQ-000001, JQUERY-000001, etc.
 */
export function formatStandardQuestionId(subject: MasterSubjectId | string, num: number, isMCQ: boolean = false): string {
  const subPrefix = subject.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const mcqPart = isMCQ ? '-MCQ-' : '-'
  return `${subPrefix}${mcqPart}${String(num).padStart(6, '0')}`
}
