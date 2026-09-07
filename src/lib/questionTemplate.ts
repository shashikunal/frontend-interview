import React from 'react'
import type { Question } from '../models/question'

export type TemplateType = 'machine-coding' | 'leetcode' | 'dom-browser' | 'concept'

export interface ParsedExample {
  title?: string
  input?: string
  output?: string
  explanation?: string
  raw?: string
}

export interface TestCaseItem {
  id: number
  input: string
  expected?: string
  raw?: string
}

export interface ParsedLeetCodeQuestion {
  questionNumber: number | string
  title: string
  difficulty: string
  category: string
  technology: string
  pattern?: string
  problemText: string
  examples: ParsedExample[]
  constraints: string[]
  candidateTask?: string
  functionSignature?: string
  starterCode?: string
  hints: string[]
  solution: string
  explanation: string
  timeComplexity?: string
  spaceComplexity?: string
  testCases?: string[]
  parsedTestCases?: TestCaseItem[]
  followUps?: string[]
}

export interface ParsedDomQuestion {
  questionNumber: number | string
  title: string
  difficulty: string
  category: string
  technology: string
  problemText: string
  requirements: string[]
  htmlDom?: string
  candidateTask?: string
  expectedBehaviour?: string
  existingCode?: string
  solution: string
  explanation: string
  edgeCases?: string[]
  performance?: string
  testCases?: string[]
  followUps?: string[]
}

export interface ParsedConceptQuestion {
  questionNumber: number | string
  title: string
  difficulty: string
  category: string
  technology: string
  overview: string
  explanation: string
  exampleCode?: string
  keyTakeaways?: string[]
}

/**
 * Detect template type strictly based on existing question's nature.
 * Machine Coding -> 'machine-coding'
 * Algorithm / Problem-Solving -> 'leetcode'
 * DOM / Browser Problem -> 'dom-browser'
 * Concept / Theoretical -> 'concept'
 */
export function detectTemplateType(q: Question & { requirements?: unknown }): TemplateType {
  // 1. Existing Machine Coding questions must NEVER be changed
  if (
    q.requirements ||
    (typeof q.id === 'string' && (q.id as string).startsWith('Q')) ||
    (q as unknown as { starterCode?: string; solutionCode?: string }).starterCode
  ) {
    return 'machine-coding'
  }

  const cat = (q.category || '').toLowerCase()
  const text = ((q.question || '') + ' ' + (q.answer || '')).toLowerCase()
  const code = q.code || ''

  // 2. DOM / Browser Problem
  if (
    cat === 'dom' ||
    cat.includes('dom') ||
    cat.includes('accessibility') ||
    text.includes('intersectionobserver') ||
    text.includes('mutationobserver') ||
    text.includes('document.queryselector') ||
    text.includes('addeventlistener') ||
    text.includes('event delegation') ||
    text.includes('shadow dom') ||
    text.includes('custom element') ||
    text.includes('drag and drop') ||
    text.includes('canvas api') ||
    text.includes('screen reader') ||
    text.includes('aria-')
  ) {
    return 'dom-browser'
  }

  // 3. Algorithm Problem / LeetCode
  if (
    cat === 'leetcode' ||
    cat.includes('algorithm') ||
    cat.includes('data structure') ||
    text.includes('leetcode') ||
    text.includes('two sum') ||
    text.includes('binary tree') ||
    text.includes('dynamic programming') ||
    text.includes('sliding window') ||
    text.includes('two pointers') ||
    text.includes('given an array') ||
    text.includes('given a string') ||
    text.includes('return the index') ||
    text.includes('return the indices') ||
    text.includes('find the maximum') ||
    text.includes('find the minimum') ||
    text.includes('reverse a') ||
    text.includes('sort the') ||
    (code && (text.includes('return ') || text.includes('example:') || text.includes('o(n)')))
  ) {
    return 'leetcode'
  }

  // 4. Concept / Theoretical Question
  if (
    text.startsWith('what is') ||
    text.startsWith('what are') ||
    text.startsWith('explain') ||
    text.startsWith('how does') ||
    text.startsWith('why does') ||
    text.startsWith('difference between') ||
    cat.includes('system design') ||
    !code
  ) {
    return 'concept'
  }

  return code ? 'leetcode' : 'concept'
}

/**
 * Detects algorithmic pattern from question content if present.
 */
export function detectPattern(text: string): string | undefined {
  const lower = text.toLowerCase()
  if (lower.includes('two pointer') || lower.includes('two-pointer')) return 'Two Pointers'
  if (lower.includes('sliding window')) return 'Sliding Window'
  if (lower.includes('binary search')) return 'Binary Search'
  if (lower.includes('dynamic programming') || lower.includes('memoization') || lower.includes('tabulation')) return 'Dynamic Programming'
  if (lower.includes('depth-first') || lower.includes('dfs')) return 'Depth-First Search (DFS)'
  if (lower.includes('breadth-first') || lower.includes('bfs')) return 'Breadth-First Search (BFS)'
  if (lower.includes('binary tree') || lower.includes('bst')) return 'Binary Tree'
  if (lower.includes('trie') || lower.includes('prefix tree')) return 'Trie'
  if (lower.includes('heap') || lower.includes('priority queue')) return 'Heap / Priority Queue'
  if (lower.includes('hash map') || lower.includes('hash table') || lower.includes('hashmap')) return 'Hash Map'
  if (lower.includes('greedy')) return 'Greedy'
  if (lower.includes('backtrack')) return 'Backtracking'
  if (lower.includes('graph')) return 'Graph Traversal'
  if (lower.includes('linked list')) return 'Linked List'
  if (lower.includes('stack')) return 'Stack'
  if (lower.includes('queue')) return 'Queue'
  return undefined
}

/**
 * Extracts clean title by stripping company/level tag if present.
 */
/**
 * Extracts clean, authentic LeetCode title.
 * Converts camelCase function name (e.g. twoSum -> Two Sum) or extracts concise title.
 */
export function extractCleanTitle(raw: string, code?: string): string {
  if (code) {
    const fnMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) || code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*\(/)
    if (fnMatch && fnMatch[1] && fnMatch[1] !== 'main' && fnMatch[1] !== 'solution' && fnMatch[1] !== 'run') {
      const name = fnMatch[1]
      const titleCase = name.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()
      if (titleCase.length >= 3 && !titleCase.includes('test')) {
        return titleCase.charAt(0).toUpperCase() + titleCase.slice(1)
      }
    }
  }

  const stripped = raw.replace(/^\[[^\]]+\]\s*/, '').trim()
  const firstLine = stripped.split('\n')[0].trim().replace(/[.`]+$/, '')
  return firstLine.length > 80 ? firstLine.slice(0, 77) + '...' : firstLine
}

/**
 * Parses existing question into the LeetCode template format.
 * STRICTLY preserves existing content without fabrication.
 */
export function parseLeetCodeTemplate(q: Question): ParsedLeetCodeQuestion {
  const fullText = q.question || ''
  const answerText = q.answer || ''
  const code = q.code || ''

  // 1. Title & Technology
  const title = extractCleanTitle(fullText, code)
  const pattern = detectPattern(fullText + ' ' + answerText)
  const technology = q.category.includes('TypeScript')
    ? 'TypeScript'
    : q.category.includes('React')
    ? 'ReactJS'
    : 'JavaScript'

  // 2. Separate Problem Statement & Examples
  let problemText = fullText.replace(/^\[[^\]]+\]\s*/, '').trim()
  const examples: ParsedExample[] = []
  const parsedTestCases: TestCaseItem[] = []

  // Look for "Example:" or "Examples:"
  const exampleRegex = /\b(?:Example|Examples|e\.g\.)\s*(\d*)\s*:?\s*([\s\S]*?)(?=(?:\bExample\s*\d+\s*:|\bConstraints?\b|\bFollow-?up\b|$))/gi
  let match: RegExpExecArray | null
  let foundExampleInText = false

  while ((match = exampleRegex.exec(fullText)) !== null) {
    foundExampleInText = true
    const rawExample = match[2].trim()
    if (!rawExample) continue

    // Cut problem text at the first example boundary
    const cutIdx = problemText.indexOf(match[0])
    if (cutIdx > 0) {
      problemText = problemText.slice(0, cutIdx).trim()
    }

    const cleanRaw = rawExample.replace(/[.\s]+$/, '').trim()
    const inputMatch = cleanRaw.match(/Input[:\s]+([\s\S]+?)(?=(?:Output[:\s]|$))/i)
    const outputMatch = cleanRaw.match(/Output[:\s]+([\s\S]+?)(?=(?:Explanation[:\s]|$))/i)
    const explMatch = cleanRaw.match(/Explanation[:\s]+([\s\S]+?)$/i)

    let parsedInput: string | undefined = inputMatch ? inputMatch[1].trim() : undefined
    let parsedOutput: string | undefined = outputMatch ? outputMatch[1].trim() : undefined
    const parsedExpl: string | undefined = explMatch ? explMatch[1].trim() : undefined

    if (!parsedInput) {
      const arrowSplit = cleanRaw.split(/\s*(?:->|=>)\s*/)
      if (arrowSplit.length > 1) {
        parsedInput = arrowSplit[0].trim()
        parsedOutput = arrowSplit[1].trim()
      } else {
        parsedInput = cleanRaw
      }
    }

    const exNum = examples.length + 1
    examples.push({
      title: match[1] ? `Example ${match[1]}` : `Example ${exNum}`,
      input: parsedInput,
      output: parsedOutput,
      explanation: parsedExpl,
      raw: cleanRaw,
    })

    parsedTestCases.push({
      id: exNum,
      input: parsedInput || cleanRaw,
      expected: parsedOutput,
      raw: cleanRaw,
    })
  }

  // Fallback: If no example was found in question text, check question.example
  if (!foundExampleInText && q.example && q.example.trim()) {
    const cleanEx = q.example.trim()
    examples.push({
      title: 'Example 1',
      input: cleanEx,
      raw: cleanEx,
    })
    parsedTestCases.push({
      id: 1,
      input: cleanEx,
      raw: cleanEx,
    })
  }

  // 3. Constraints (preserve if existing, NEVER invent!)
  const constraints: string[] = []
  const constMatch = fullText.match(/Constraints?:?\s*([\s\S]*?)(?=(?:\bExample\b|\bFollow-?up\b|$))/i)
  if (constMatch) {
    const rawLines = constMatch[1].split('\n').map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
    constraints.push(...rawLines)
  }

  // 4. Candidate Task / Function Signature
  let functionSignature: string | undefined
  if (code) {
    const fnMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/)
    const arrowMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*\(([^)]*)\)\s*(?::\s*[a-zA-Z0-9_<>[\]]+\s*)?=>/)
    if (fnMatch) {
      functionSignature = `function ${fnMatch[1]}(${fnMatch[2]}) {\n  // Implement your solution\n}`
    } else if (arrowMatch) {
      functionSignature = `const ${arrowMatch[1]} = (${arrowMatch[2]}) => {\n  // Implement your solution\n}`
    }
  }

  // 5. Complexity (preserve if existing in answer)
  let timeComplexity: string | undefined
  let spaceComplexity: string | undefined

  const timeMatch = answerText.match(/(?:Time(?:\s*Complexity)?[:\s]*|runs in\s*)(O\([^)]+\))/i) ||
                    answerText.match(/(O\([^)]+\))\s*time/i)
  if (timeMatch) timeComplexity = timeMatch[1]

  const spaceMatch = answerText.match(/(?:Space(?:\s*Complexity)?[:\s]*|auxiliary space\s*|memory\s*)(O\([^)]+\))/i) ||
                     answerText.match(/(O\([^)]+\))\s*space/i)
  if (spaceMatch) spaceComplexity = spaceMatch[1]

  // 6. Hints (preserve if existing, do not invent!)
  const hints: string[] = []
  const hintMatch = fullText.match(/Hints?:?\s*([\s\S]*?)(?=(?:\bExample\b|\bConstraints?\b|\bFollow-?up\b|$))/i)
  if (hintMatch) {
    hints.push(...hintMatch[1].split('\n').map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean))
  }

  // 7. Follow-ups (preserve if existing)
  const followUps: string[] = []
  const fuMatch = (fullText + '\n' + answerText).match(/Follow-?up[:\s]+([^\n\r]+)/gi)
  if (fuMatch) {
    fuMatch.forEach(fu => {
      const cleaned = fu.replace(/^Follow-?up[:\s]+/i, '').trim()
      if (cleaned) followUps.push(cleaned)
    })
  }

  let starterCode = ''
  if (functionSignature) {
    starterCode = `/**\n * Problem: #${q.id} ${title}\n */\n${functionSignature}\n`
  } else if (code) {
    starterCode = `// Problem: #${q.id} ${title}\nfunction solution() {\n  // Implement your solution\n}\n`
  }

  return {
    questionNumber: q.id,
    title,
    difficulty: q.difficulty,
    category: q.category,
    technology,
    pattern,
    problemText,
    examples,
    constraints,
    candidateTask: title,
    functionSignature,
    starterCode,
    hints,
    solution: code,
    explanation: answerText,
    timeComplexity,
    spaceComplexity,
    parsedTestCases,
    followUps,
  }
}

/**
 * Parses existing question into the DOM / Browser LeetCode-style template format.
 * STRICTLY reorganizes existing content without changing meaning or fabricating.
 */
export function parseDomTemplate(q: Question): ParsedDomQuestion {
  const fullText = q.question || ''
  const answerText = q.answer || ''
  const code = q.code || ''
  const title = extractCleanTitle(fullText)

  const technology = q.category.includes('TypeScript')
    ? 'TypeScript / DOM'
    : q.category.includes('React')
    ? 'React / Web APIs'
    : 'JavaScript / Web APIs'

  // Extract requirements from answer or question if present
  const requirements: string[] = []
  const reqMatch = answerText.match(/(?:Requirements|Key points|Steps)[:\s]*([\s\S]*?)(?=(?:\bExample\b|\bComplexity\b|$))/i)
  if (reqMatch) {
    requirements.push(...reqMatch[1].split('\n').map(s => s.replace(/^[-*•\d.]\s*/, '').trim()).filter(Boolean))
  } else {
    // Break into logical sentence requirements
    const sentences = answerText.split(/(?<=[.?!])\s+/).slice(0, 3)
    requirements.push(...sentences.filter(s => s.length > 10))
  }

  return {
    questionNumber: q.id,
    title,
    difficulty: q.difficulty,
    category: q.category,
    technology,
    problemText: fullText.replace(/^\[[^\]]+\]\s*/, '').trim(),
    requirements,
    htmlDom: q.example && q.example.includes('<') ? q.example : undefined,
    candidateTask: `Implement the DOM component or event handler for "${title}"`,
    solution: code,
    explanation: answerText,
  }
}

/**
 * Parses existing question into Concept format (preserves existing concept view).
 */
export function parseConceptTemplate(q: Question): ParsedConceptQuestion {
  const fullText = q.question || ''
  const answerText = q.answer || ''
  const title = extractCleanTitle(fullText)

  const technology = q.category.includes('TypeScript')
    ? 'TypeScript'
    : q.category.includes('React')
    ? 'React'
    : q.category.includes('CSS')
    ? 'CSS'
    : 'JavaScript'

  return {
    questionNumber: q.id,
    title,
    difficulty: q.difficulty,
    category: q.category,
    technology,
    overview: fullText.replace(/^\[[^\]]+\]\s*/, '').trim(),
    explanation: answerText,
    exampleCode: q.code || q.example,
  }
}

/**
 * Formats inline markdown spans like `code` into styled <code> elements.
 */
export function renderFormattedMarkdown(text: string): React.ReactNode {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(`[^`]+`)/g)
    const elements = parts.map((part, partIdx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return React.createElement('code', { key: partIdx, className: 'lc-inline-code' }, part.slice(1, -1))
      }
      return part
    })

    return React.createElement(
      React.Fragment,
      { key: lineIdx },
      elements,
      lineIdx < lines.length - 1 ? React.createElement('br', { key: `br-${lineIdx}` }) : null
    )
  })
}

