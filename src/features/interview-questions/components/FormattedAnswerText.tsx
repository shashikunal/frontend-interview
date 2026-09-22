// src/features/interview-questions/components/FormattedAnswerText.tsx
import React from 'react'

interface FormattedAnswerTextProps {
  text?: string
  className?: string
  isSpeakingSection?: boolean
  activeSentenceIndex?: number
  highlightRange?: { start: number; end: number }
}

/**
 * Renders structured text with support for:
 * - **bold** concept highlights with pill background tint
 * - <u>underline</u> critical terms with warm amber highlight + underline
 * - `code` inline terms with monospace border badge
 * - Step items (1. ..., 2. ..., Step 1: ...) with elegant badges
 * - short bullet lists (* or -)
 * - paragraphs with generous reading typography (line-height: 1.8, comfortable spacing)
 * - sentence-level speech highlighting in complete sync with speech audio
 */
export const FormattedAnswerText: React.FC<FormattedAnswerTextProps> = ({
  text = '',
  className = '',
  isSpeakingSection = false,
  activeSentenceIndex,
}) => {
  if (!text || text.trim().length === 0) return null

  // Normalize any accidental quad-asterisks to double asterisks for bold formatting
  const sanitizedText = text.replace(/\*{4,}/g, '**')

  // Split into paragraphs by double newlines or single newlines that divide sentences/bullets
  const paragraphs = sanitizedText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)

  let globalSentenceCount = 0

  const renderInline = (content: string): React.ReactNode[] => {
    // Regex matches:
    // 1. `code`
    // 2. <u>underline</u>
    // 3. **bold**
    // 4. *italic*
    const tokenRegex = /(`[^`]+`|<u>[^<]+<\/u>|\*\*[^*]+\*\*|\*[^*]+\*)/g
    const parts = content.split(tokenRegex)

    return parts.map((part, index) => {
      if (!part) return null

      // Inline code: `...`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded text-[0.88em] font-mono font-medium border"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.25)',
              color: 'var(--mqb-accent-bright, #818cf8)',
            }}
          >
            {part.slice(1, -1)}
          </code>
        )
      }

      // Underline + background highlight: <u>...</u>
      if (part.startsWith('<u>') && part.endsWith('</u>')) {
        return (
          <span
            key={index}
            className="mqb-term-highlight"
            title="Key technical term"
          >
            {part.slice(3, -4)}
          </span>
        )
      }

      // Bold + subtle pill highlight: **...**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong
            key={index}
            className="mqb-bold-highlight text-slate-900 dark:text-white"
          >
            {part.slice(2, -2)}
          </strong>
        )
      }

      // Italic: *...*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={index} className="italic text-slate-700 dark:text-slate-300">
            {part.slice(1, -1)}
          </em>
        )
      }

      return <React.Fragment key={index}>{part}</React.Fragment>
    })
  }

  return (
    <div
      className={`space-y-4 text-[1.03rem] leading-[1.85] text-slate-700 dark:text-slate-200 ${className}`}
      style={{
        transition: 'all 0.2s ease',
      }}
    >
      {paragraphs.map((para, pIdx) => {
        // Check if paragraph is a bullet or numbered list
        const lines = para.split('\n').map(l => l.trim()).filter(Boolean)
        const isBulletList = lines.length > 0 && lines.every(line => /^[-*•]\s+/.test(line))
        const isNumberedList = lines.length > 0 && lines.every(line => /^(\d+[\.\)]|Step\s+\d+:?)\s+/i.test(line))

        if (isNumberedList) {
          return (
            <div key={pIdx} className="space-y-2.5 my-2.5">
              {lines.map((line, lIdx) => {
                const match = line.match(/^(\d+[\.\)]|Step\s+\d+:?)\s*(.*)/i)
                const stepLabel = match ? match[1].replace(/[\.\):]/g, '').trim() : `${lIdx + 1}`
                const content = match ? match[2] : line
                const thisSentenceIdx = globalSentenceCount++
                const isStepSpeaking = isSpeakingSection && activeSentenceIndex !== undefined && activeSentenceIndex === thisSentenceIdx

                return (
                  <div
                    key={lIdx}
                    className={isStepSpeaking ? 'mqb-active-spoken-sentence' : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: isStepSpeaking ? undefined : 'rgba(99, 102, 241, 0.04)',
                      border: isStepSpeaking ? undefined : '1px solid rgba(99, 102, 241, 0.12)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '9999px',
                        background: 'rgba(99, 102, 241, 0.18)',
                        color: 'var(--mqb-accent-bright, #818cf8)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    >
                      {stepLabel}
                    </span>
                    <div style={{ flex: 1 }}>
                      {renderInline(content)}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }

        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-2 my-2 marker:text-indigo-500">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[-*•]\s+/, '')
                const thisSentenceIdx = globalSentenceCount++
                const isBulletSpeaking = isSpeakingSection && activeSentenceIndex !== undefined && activeSentenceIndex === thisSentenceIdx

                return (
                  <li
                    key={lIdx}
                    className={`pl-1 ${isBulletSpeaking ? 'mqb-active-spoken-sentence' : ''}`}
                  >
                    {renderInline(cleanLine)}
                  </li>
                )
              })}
            </ul>
          )
        }

        // Standard paragraph: split into sentences for seamless audio sync matching getSpeechSentenceSegments
        const rawSplit = para.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).filter(Boolean)
        const sentences = rawSplit.length > 0 ? rawSplit : [para]

        return (
          <p key={pIdx} className="m-0">
            {sentences.map((sentence, sIdx) => {
              const thisSentenceIdx = globalSentenceCount++
              const isSentenceSpeaking = isSpeakingSection && activeSentenceIndex !== undefined && activeSentenceIndex === thisSentenceIdx

              return (
                <span
                  key={sIdx}
                  className={isSentenceSpeaking ? 'mqb-active-spoken-sentence' : undefined}
                >
                  {renderInline(sentence)}
                  {sIdx < sentences.length - 1 ? ' ' : ''}
                </span>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}
