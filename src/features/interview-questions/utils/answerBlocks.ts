// src/features/interview-questions/utils/answerBlocks.ts

/**
 * Shared markdown-lite parser for interview answer bodies.
 *
 * Both the visual renderer (FormattedAnswerText) and the speech synthesizer
 * (speechSanitizer.getSpeechSentenceSegments) build from the same block list,
 * so the spoken sentence indexes always line up with the rendered highlights.
 */

export type AnswerBlock =
  | { type: 'code'; lang: string; code: string }
  | { type: 'heading'; text: string }
  | { type: 'step'; number: string; title: string; children: AnswerBlock[] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'paragraph'; text: string }

type RawBlock =
  | AnswerBlock
  | { type: 'step-start'; number: string; title: string }

const FENCE_RE = /```([A-Za-z0-9_+#.-]*)[ \t]*\n([\s\S]*?)(?:```|$)/g
const NUMBERED_RE = /^(\d+)[.)]\s+(\S.*)$/
const BULLET_RE = /^[-*•]\s+(\S.*)$/
const HEADING_RE = /^(#{1,6})\s+(\S.*)$/
const HRULE_RE = /^(-{3,}|\*{3,}|_{3,})$/

/** Splits a paragraph into sentence units (mirrors the speech segmenter). */
export function segmentParagraph(text: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).filter(s => s.trim().length > 0)
  return sentences.length > 0 ? sentences : [text]
}

function matchStepTitle(line: string): { number: string; title: string } | null {
  const m = line.match(NUMBERED_RE)
  if (!m) return null
  const core = m[2].replace(/\*\*$/, '').trim()
  return core.endsWith(':') ? { number: m[1], title: m[2].trim() } : null
}

function classifyLines(lines: string[], out: RawBlock[]): void {
  if (lines.length === 0) return

  if (lines.every(l => NUMBERED_RE.test(l))) {
    if (lines.length === 1) {
      const step = matchStepTitle(lines[0])
      if (step) {
        out.push({ type: 'step-start', ...step })
        return
      }
    }
    out.push({ type: 'list', ordered: true, items: lines })
    return
  }

  if (lines.every(l => BULLET_RE.test(l))) {
    out.push({ type: 'list', ordered: false, items: lines })
    return
  }

  out.push({ type: 'paragraph', text: lines.join('\n') })
}

function pushTextChunk(chunk: string, out: RawBlock[]): void {
  const paragraphs = chunk.split(/\n[ \t]*\n/).map(p => p.trim()).filter(Boolean)

  for (const para of paragraphs) {
    const lines = para
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .filter(l => !HRULE_RE.test(l))
    if (lines.length === 0) continue

    const hasHeading = lines.some(l => HEADING_RE.test(l))
    if (!hasHeading) {
      classifyLines(lines, out)
      continue
    }

    let buffer: string[] = []
    const flush = () => {
      if (buffer.length) {
        classifyLines(buffer, out)
        buffer = []
      }
    }
    for (const line of lines) {
      const heading = line.match(HEADING_RE)
      if (heading) {
        flush()
        out.push({ type: 'heading', text: heading[2].trim() })
      } else {
        buffer.push(line)
      }
    }
    flush()
  }
}

function groupSteps(blocks: RawBlock[]): AnswerBlock[] {
  const out: AnswerBlock[] = []
  let current: { number: string; title: string; children: AnswerBlock[] } | null = null

  const close = () => {
    if (current) {
      out.push({ type: 'step', ...current })
      current = null
    }
  }

  for (const block of blocks) {
    if (block.type === 'step-start') {
      close()
      current = { number: block.number, title: block.title, children: [] }
      continue
    }
    if (current) current.children.push(block as AnswerBlock)
    else out.push(block as AnswerBlock)
  }
  close()

  return out
}

export function parseAnswerBlocks(raw: string | undefined | null): AnswerBlock[] {
  if (!raw || !raw.trim()) return []

  const text = raw.replace(/\*{4,}/g, '**').replace(/\r\n?/g, '\n')
  const rawBlocks: RawBlock[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  FENCE_RE.lastIndex = 0
  while ((match = FENCE_RE.exec(text)) !== null) {
    pushTextChunk(text.slice(cursor, match.index), rawBlocks)
    const code = match[2].replace(/[ \t]+$/gm, '').replace(/^\n+|\n+$/g, '')
    rawBlocks.push({ type: 'code', lang: (match[1] || 'js').toLowerCase(), code })
    cursor = match.index + match[0].length
  }
  pushTextChunk(text.slice(cursor), rawBlocks)

  return groupSteps(rawBlocks)
}

/**
 * Produces one string per spoken unit, in document order.
 * Code blocks contribute nothing (they are never read aloud).
 * Empty strings are preserved so renderer/speech indexes stay aligned.
 */
export function speechUnitsFromBlocks(blocks: AnswerBlock[]): string[] {
  const units: string[] = []

  const walk = (block: AnswerBlock): void => {
    switch (block.type) {
      case 'code':
        return
      case 'heading':
        units.push(block.text)
        return
      case 'paragraph':
        units.push(...segmentParagraph(block.text))
        return
      case 'list':
        for (const item of block.items) {
          if (block.ordered) {
            const m = item.match(NUMBERED_RE)
            units.push(m ? `Step ${m[1]}: ${m[2]}` : item)
          } else {
            units.push(item)
          }
        }
        return
      case 'step':
        units.push(`Step ${block.number}: ${block.title}`)
        block.children.forEach(walk)
        return
    }
  }

  blocks.forEach(walk)
  return units
}

/**
 * Flattens an answer body into one clean line of plain text for list cards
 * and snippets: no code blocks, no markdown markers, length capped.
 */
export function toPlainSnippet(raw: string | undefined | null, maxLen = 220): string {
  if (!raw || !raw.trim()) return ''

  const parts: string[] = []
  const walk = (block: AnswerBlock): void => {
    switch (block.type) {
      case 'code':
        return
      case 'heading':
        parts.push(block.text)
        return
      case 'paragraph':
        parts.push(block.text)
        return
      case 'list':
        for (const item of block.items) parts.push(item.replace(/^[-*•]\s+/, ''))
        return
      case 'step':
        parts.push(`${block.number}. ${block.title.replace(/\*\*$/, '').trim()}`)
        block.children.forEach(walk)
        return
    }
  }
  parseAnswerBlocks(raw).forEach(walk)

  let text = parts
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*|__|<\/?u>|`/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length > maxLen) {
    const cut = text.slice(0, maxLen)
    const lastSpace = cut.lastIndexOf(' ')
    text = (lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
  }
  return text
}
