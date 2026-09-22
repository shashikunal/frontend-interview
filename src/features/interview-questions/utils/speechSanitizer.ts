// src/features/interview-questions/utils/speechSanitizer.ts

/**
 * Strips raw Markdown, HTML tags, and code formatting symbols to produce
 * natural, clean English sentences for the Web SpeechSynthesis API.
 * Never allows characters like '#', '*', '<u>', or backticks to be read aloud.
 */
export function sanitizeForSpeech(rawText: string | undefined | null): string {
  if (!rawText) return ''

  let text = rawText

  // 1. Remove HTML tags but keep inner content: <u>term</u> -> term, <span>...</span> -> ...
  text = text.replace(/<[^>]+>/g, ' ')

  // 2. Remove markdown code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, ' ')

  // 3. Remove markdown headers: e.g. "### Short Answer" -> "Short Answer."
  text = text.replace(/^#{1,6}\s*(.+)$/gm, '$1.')

  // 4. Remove bold / italic markers: **term** -> term, *term* -> term, __term__ -> term, _term_ -> term
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')

  // 5. Remove inline backticks: `let x = 10` -> let x = 10
  text = text.replace(/`([^`]+)`/g, '$1')

  // 6. Convert markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // 7. Convert bullet points: "* item" or "- item" -> "item."
  text = text.replace(/^\s*[-*+]\s+/gm, '')

  // 8. Clean up symbols that cause weird vocalizations
  text = text.replace(/[\\#{}[\]()~>]/g, ' ')

  // 9. Normalize multiple punctuation or spaces
  text = text.replace(/\s+/g, ' ').trim()
  text = text.replace(/\.+/g, '.')

  return text
}

export interface SpeechSentenceData {
  fullSpeechText: string
  segments: string[]
  segmentOffsets: number[]
}

/**
 * Splits formatted answer text into synchronized sentence/step segments for speech synthesis.
 * Ensures numbered lists, bullets, and multi-sentence paragraphs match 1-to-1 between UI and speech audio.
 */
export function getSpeechSentenceSegments(rawText: string | undefined | null): SpeechSentenceData {
  if (!rawText || rawText.trim().length === 0) {
    return { fullSpeechText: '', segments: [], segmentOffsets: [] }
  }

  const paras = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  const segments: string[] = []

  for (const para of paras) {
    const lines = para.split('\n').map(l => l.trim()).filter(Boolean)
    const isNumbered = lines.length > 0 && lines.every(l => /^(\d+[\.\)]|Step\s+\d+:?)\s+/i.test(l))
    const isBullet = lines.length > 0 && lines.every(l => /^[-*•]\s+/.test(l))

    if (isNumbered) {
      for (const line of lines) {
        const formatted = line.replace(/^(\d+)[\.\)]\s*/, 'Step $1: ')
        const cleaned = sanitizeForSpeech(formatted)
        if (cleaned) segments.push(cleaned)
      }
    } else if (isBullet) {
      for (const line of lines) {
        const cleaned = sanitizeForSpeech(line)
        if (cleaned) segments.push(cleaned)
      }
    } else {
      // Split by sentence boundaries followed by space and capital letter or digit
      const rawSentences = para.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).filter(Boolean)
      if (rawSentences.length > 0) {
        for (const s of rawSentences) {
          const cleaned = sanitizeForSpeech(s)
          if (cleaned) segments.push(cleaned)
        }
      } else {
        const cleaned = sanitizeForSpeech(para)
        if (cleaned) segments.push(cleaned)
      }
    }
  }

  // Join with space
  const fullSpeechText = segments.join(' ')
  const segmentOffsets: number[] = []
  let currentOffset = 0

  for (const seg of segments) {
    segmentOffsets.push(currentOffset)
    currentOffset += seg.length + 1 // + 1 for space
  }

  return { fullSpeechText, segments, segmentOffsets }
}

/**
 * Generates or extracts a clear, human-friendly plain English audio explanation
 * for code blocks, so users do not hear raw brackets, braces, and semicolons.
 */
export function explainCodeInPlainEnglish(params: {
  codeSnippet?: string
  customSpeech?: string
  lineExplanations?: Array<{ line?: number; code: string; explanation: string }>
  language?: string
}): string {
  const { codeSnippet, customSpeech, lineExplanations } = params

  // 1. If an explicit audio explanation exists in metadata, sanitize and speak it
  if (customSpeech && customSpeech.trim().length > 0) {
    return sanitizeForSpeech(customSpeech)
  }

  // 2. If line-by-line explanations are provided, speak them sequentially in natural English
  if (lineExplanations && lineExplanations.length > 0) {
    const narrationParts = lineExplanations
      .map(item => item.explanation.trim())
      .filter(exp => exp.length > 0)
    if (narrationParts.length > 0) {
      return sanitizeForSpeech(`Here is how this code works: ${narrationParts.join('. ')}.`)
    }
  }

  // 3. Fallback heuristic for common frontend structures
  if (!codeSnippet || codeSnippet.trim().length === 0) {
    return 'No code example provided for this question.'
  }

  const cleanCode = codeSnippet.trim()

  if (cleanCode.startsWith('<!DOCTYPE html>') || cleanCode.includes('<html') || cleanCode.includes('<body')) {
    return 'This HTML code defines a standard web document with a doctype declaration, a head section for metadata, and a body containing visible elements such as headings and paragraphs.'
  }

  if (cleanCode.includes('function') || cleanCode.includes('=>')) {
    return 'This JavaScript snippet demonstrates a function implementation showing its parameters, inner logic, and returned value.'
  }

  return 'This code demonstrates the practical implementation of the concept.'
}

const STORAGE_KEY_SPEECH_SPEED = 'frontend_interview_speech_speed'
export const ALLOWED_SPEECH_SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0] as const
export type SpeechSpeed = typeof ALLOWED_SPEECH_SPEEDS[number]

export function getStoredSpeechRate(): number {
  if (typeof window === 'undefined') return 1.0
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SPEECH_SPEED)
    if (saved) {
      const parsed = parseFloat(saved)
      if (ALLOWED_SPEECH_SPEEDS.includes(parsed as SpeechSpeed)) {
        return parsed
      }
    }
  } catch {
    // Ignore localStorage issues
  }
  return 1.0
}

export function setStoredSpeechRate(rate: number): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_SPEECH_SPEED, rate.toString())
  } catch {
    // Ignore localStorage issues
  }
}
