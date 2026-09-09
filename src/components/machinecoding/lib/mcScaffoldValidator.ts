/**
 * Machine Coding Starter Scaffold Validator
 * 
 * Enforces quality, structural validity, domain relevance, and anti-duplication
 * rules across all generated and curated starter templates.
 */

import type { MCQuestion } from '../machineCodingQuestions.ts';
import { isGenericBoilerplateStarter, cleanTitle } from './mcStarterGenerator.ts';
import { getEnrichedQuestionSpec } from './mcQuestionSpecService.ts';

export interface ValidationIssue {
  type: 'ERROR' | 'WARNING';
  code: string;
  message: string;
}

export interface QuestionValidationResult {
  questionId: string;
  title: string;
  isValid: boolean;
  issues: ValidationIssue[];
  todoCount: number;
}

/**
 * Normalizes code by stripping comments, string literals, and whitespace
 * to compare raw structural tokens.
 */
export function normalizeCodeStructure(code: string): string {
  if (!code) return '';
  return code
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove single-line comments
    .replace(/\/\/.*/g, '')
    // Remove JSX comments
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Jaccard token similarity (0.0 to 1.0) between two code snippets.
 */
export function computeTokenSimilarity(codeA: string, codeB: string): number {
  const tokensA = new Set(normalizeCodeStructure(codeA).split(/[^a-zA-Z0-9_]+/));
  const tokensB = new Set(normalizeCodeStructure(codeB).split(/[^a-zA-Z0-9_]+/));

  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }

  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

/**
 * Validates a single question's starter code against core quality standards.
 */
export function validateStarterCode(q: MCQuestion, starterCode: string): QuestionValidationResult {
  const issues: ValidationIssue[] = [];
  const cTitle = cleanTitle(q.title);

  // 1. Must not be empty
  if (!starterCode || !starterCode.trim()) {
    issues.push({
      type: 'ERROR',
      code: 'EMPTY_STARTER',
      message: `Question [${q.id}] starter code is empty.`,
    });
    return { questionId: q.id, title: cTitle, isValid: false, issues, todoCount: 0 };
  }

  // 2. Must not be generic canvas/counter boilerplate
  if (isGenericBoilerplateStarter(starterCode)) {
    issues.push({
      type: 'ERROR',
      code: 'GENERIC_BOILERPLATE',
      message: `Question [${q.id}] contains generic placeholder canvas or counter boilerplate.`,
    });
  }

  // 3. Must enforce "scaffold, not solution"
  // Curated components like Q001 can be concise, but dynamic scaffolds must have TODO placeholders
  const hasTodo = starterCode.includes('TODO') || starterCode.includes('todo');
  if (q.id !== 'Q001' && !hasTodo) {
    issues.push({
      type: 'WARNING',
      code: 'MISSING_TODO',
      message: `Question [${q.id}] does not contain explicit TODO placeholders for the candidate.`,
    });
  }

  // 4. Check for accidental solution leakage
  const solutionLeaked =
    starterCode.includes('// Reference Solution') ||
    starterCode.includes('// Complete implementation') ||
    starterCode.includes('/* Reference Solution */');

  if (solutionLeaked) {
    issues.push({
      type: 'ERROR',
      code: 'SOLUTION_LEAK',
      message: `Question [${q.id}] appears to expose reference solution comments or markers.`,
    });
  }

  // 5. Domain Relevance: Key entity or title keywords must be represented
  const titleKeywords = cTitle
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['with', 'from', 'mode', 'modes', 'support', 'full'].includes(w.toLowerCase()));

  const codeLower = starterCode.toLowerCase();
  const matchedKeyword = titleKeywords.some(kw => codeLower.includes(kw.toLowerCase()));

  if (titleKeywords.length > 0 && !matchedKeyword) {
    issues.push({
      type: 'WARNING',
      code: 'DOMAIN_RELEVANCE',
      message: `Question [${q.id}] starter code does not prominently reference any primary domain keywords (${titleKeywords.slice(0, 3).join(', ')}).`,
    });
  }

  const isValid = issues.filter(i => i.type === 'ERROR').length === 0;
  const todoCount = (starterCode.match(/TODO/g) || []).length;
  return {
    questionId: q.id,
    title: cTitle,
    isValid,
    issues,
    todoCount,
  };
}

/**
 * Audits entire question bank for suspicious identical scaffolds across unrelated questions.
 */
export function auditQuestionBankSimilarity(
  questions: MCQuestion[],
  thresholdOrGetter?: number | ((q: MCQuestion) => string)
): {
  totalQuestions: number;
  totalAudited: number;
  suspiciousPairs: Array<{ qA: string; qB: string; q1: { id: string; title: string }; q2: { id: string; title: string }; similarity: number; reason: string }>;
  identicalCount: number;
} {
  const getStarter = typeof thresholdOrGetter === 'function'
    ? thresholdOrGetter
    : (q: MCQuestion) => {
        const spec = getEnrichedQuestionSpec(q);
        return spec.starterCode || '';
      };

  const suspiciousPairs: Array<{ qA: string; qB: string; q1: { id: string; title: string }; q2: { id: string; title: string }; similarity: number; reason: string }> = [];
  const normalizedMap = new Map<string, MCQuestion>();
  let identicalCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const qA = questions[i];
    const codeA = getStarter(qA);
    const normA = normalizeCodeStructure(codeA);

    if (normalizedMap.has(normA)) {
      const prevQ = normalizedMap.get(normA)!;
      identicalCount++;
      suspiciousPairs.push({
        qA: prevQ.id,
        qB: qA.id,
        q1: { id: prevQ.id, title: prevQ.title },
        q2: { id: qA.id, title: qA.title },
        similarity: 1.0,
        reason: `Questions [${prevQ.id}] and [${qA.id}] have 100% identical normalized scaffolds!`,
      });
    } else {
      normalizedMap.set(normA, qA);
    }
  }

  return {
    totalQuestions: questions.length,
    totalAudited: questions.length,
    suspiciousPairs,
    identicalCount,
  };
}
