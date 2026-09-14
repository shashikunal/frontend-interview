import type { InterviewQuestion } from '../types/docs.types';

/**
 * Normalizes question and answer text for deterministic fingerprinting.
 * Removes stop punctuation, collapses whitespace, downcases, and trims.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a deterministic 64-bit style hash fingerprint string.
 */
export function generateFingerprint(text: string): string {
  const norm = normalizeText(text);
  let hash1 = 5381;
  let hash2 = 52711;

  for (let i = 0; i < norm.length; i++) {
    const char = norm.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }

  return `${(hash1 >>> 0).toString(16)}-${(hash2 >>> 0).toString(16)}`;
}

/**
 * Computes Jaccard word-level similarity coefficient between two strings (0.0 to 1.0).
 */
export function computeSemanticTokenSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(normalizeText(textA).split(' ').filter(w => w.length > 2));
  const wordsB = new Set(normalizeText(textB).split(' ').filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersectionCount = 0;
  wordsA.forEach(word => {
    if (wordsB.has(word)) intersectionCount++;
  });

  const unionCount = wordsA.size + wordsB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

export interface DeduplicationValidationResult {
  isValid: boolean;
  rejectedReason?: string;
  matchedQuestionId?: string;
  similarityScore?: number;
}

interface IndexedQuestionItem {
  question: InterviewQuestion;
  qTokens: Set<string>;
  aTokens: Set<string>;
}

/**
 * Enterprise Semantic Deduplication Engine.
 * Optimized with O(1) fingerprint map indexing, pre-cached token sets,
 * and subject-partitioned semantic comparison to guarantee sub-millisecond throughput.
 */
export class DeduplicationPipeline {
  private registeredFingerprints = new Map<string, string>(); // fingerprint -> questionId
  private registeredQuestions: InterviewQuestion[] = [];
  private subjectIndex = new Map<string, IndexedQuestionItem[]>();

  constructor(initialQuestions: InterviewQuestion[] = []) {
    this.registerBatch(initialQuestions);
  }

  private tokenize(text: string): Set<string> {
    return new Set(normalizeText(text).split(' ').filter(w => w.length > 2));
  }

  private computeJaccard(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersectionCount = 0;
    setA.forEach(word => {
      if (setB.has(word)) intersectionCount++;
    });
    const unionCount = setA.size + setB.size - intersectionCount;
    return unionCount === 0 ? 0 : intersectionCount / unionCount;
  }

  /**
   * Evaluates whether a new question passes uniqueness criteria.
   */
  validate(candidate: InterviewQuestion): DeduplicationValidationResult {
    const qFingerprint = candidate.fingerprint || generateFingerprint(candidate.question);

    // 1. Instant O(1) Exact Fingerprint Match
    if (this.registeredFingerprints.has(qFingerprint)) {
      return {
        isValid: false,
        rejectedReason: 'EXACT_FINGERPRINT_DUPLICATE',
        matchedQuestionId: this.registeredFingerprints.get(qFingerprint),
        similarityScore: 1.0,
      };
    }

    // 2. Fast Subject-Scoped Semantic Check with Pre-Cached Tokens
    const targetSubject = candidate.subjectId || 'general';
    const existingInSubject = this.subjectIndex.get(targetSubject);
    if (!existingInSubject || existingInSubject.length === 0) {
      return { isValid: true };
    }

    const candidateQTokens = this.tokenize(candidate.question);
    const candidateATokens = this.tokenize(candidate.shortAnswer);

    for (const existing of existingInSubject) {
      // Question semantic similarity
      const questionSim = this.computeJaccard(candidateQTokens, existing.qTokens);
      if (questionSim > 0.82) {
        return {
          isValid: false,
          rejectedReason: `SEMANTIC_QUESTION_DUPLICATE (${(questionSim * 100).toFixed(1)}% match)`,
          matchedQuestionId: existing.question.id,
          similarityScore: questionSim,
        };
      }

      // Answer semantic similarity
      const answerSim = this.computeJaccard(candidateATokens, existing.aTokens);
      if (answerSim > 0.90) {
        return {
          isValid: false,
          rejectedReason: `DUPLICATE_ANSWER_BODY (${(answerSim * 100).toFixed(1)}% match)`,
          matchedQuestionId: existing.question.id,
          similarityScore: answerSim,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Registers a single question if valid.
   */
  register(question: InterviewQuestion): boolean {
    const result = this.validate(question);
    if (!result.isValid) {
      return false;
    }

    const fp = question.fingerprint || generateFingerprint(question.question);
    this.registeredFingerprints.set(fp, question.id);

    const fullQuestion: InterviewQuestion = {
      ...question,
      fingerprint: fp,
    };

    this.registeredQuestions.push(fullQuestion);

    const subKey = question.subjectId || 'general';
    let subList = this.subjectIndex.get(subKey);
    if (!subList) {
      subList = [];
      this.subjectIndex.set(subKey, subList);
    }
    subList.push({
      question: fullQuestion,
      qTokens: this.tokenize(question.question),
      aTokens: this.tokenize(question.shortAnswer),
    });

    return true;
  }

  /**
   * Fast register that sets fingerprint and caches question without redundant multi-pass checks.
   */
  fastRegister(question: InterviewQuestion): void {
    const fp = question.fingerprint || generateFingerprint(question.question);
    if (this.registeredFingerprints.has(fp)) return;

    this.registeredFingerprints.set(fp, question.id);
    const fullQuestion: InterviewQuestion = {
      ...question,
      fingerprint: fp,
    };
    this.registeredQuestions.push(fullQuestion);

    const subKey = question.subjectId || 'general';
    let subList = this.subjectIndex.get(subKey);
    if (!subList) {
      subList = [];
      this.subjectIndex.set(subKey, subList);
    }
    subList.push({
      question: fullQuestion,
      qTokens: this.tokenize(question.question),
      aTokens: this.tokenize(question.shortAnswer),
    });
  }

  /**
   * Registers a batch of questions, filtering out any duplicates.
   */
  registerBatch(questions: InterviewQuestion[]): InterviewQuestion[] {
    const accepted: InterviewQuestion[] = [];
    for (const q of questions) {
      if (this.register(q)) {
        accepted.push(q);
      }
    }
    return accepted;
  }

  getAcceptedQuestions(): InterviewQuestion[] {
    return this.registeredQuestions;
  }

  getRegistryStats() {
    return {
      totalRegistered: this.registeredQuestions.length,
      fingerprintsTracked: this.registeredFingerprints.size,
    };
  }
}

export const globalDeduplicationPipeline = new DeduplicationPipeline();

