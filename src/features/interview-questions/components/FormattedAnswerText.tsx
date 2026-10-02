// src/features/interview-questions/components/FormattedAnswerText.tsx
import React from 'react'
import {
  parseAnswerBlocks,
  segmentParagraph,
  type AnswerBlock,
} from '../utils/answerBlocks'

interface FormattedAnswerTextProps {
  text?: string
  className?: string
  isSpeakingSection?: boolean
  activeSentenceIndex?: number
  highlightRange?: { start: number; end: number }
}

const LANG_LABELS: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  text: 'Text',
}

const AnswerCodeBlock: React.FC<{ lang: string; code: string }> = ({ lang, code }) => {
  const lineCount = code.split('\n').length
  const [open, setOpen] = React.useState(lineCount <= 8)
  const label = LANG_LABELS[lang] || lang.toUpperCase() || 'Code'

  return (
    <div className="mqb-code-block mqb-answer-code">
      <div className="mqb-code-header">
        <span className="mqb-code-caption">
          <span aria-hidden="true">{'</>'}</span> {label} example · {lineCount}{' '}
          {lineCount === 1 ? 'line' : 'lines'}
        </span>
        <button
          type="button"
          className="mqb-code-toggle"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          {open ? 'Hide code' : 'Show code'}
        </button>
      </div>
      {open && (
        <pre className="mqb-code-content">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

/**
 * Renders structured answer text with support for:
 * - **bold** concept highlights, <u>underline</u> terms, `inline code`
 * - grouped numbered steps (title + body in one card)
 * - markdown headings (### ...), bullet and numbered lists
 * - fenced code examples in a collapsible monospace block
 * - sentence-level speech highlighting in sync with speech audio
 *
 * Block parsing is shared with speechSanitizer so spoken segments and
 * rendered sentence indexes always match 1-to-1.
 */
export const FormattedAnswerText: React.FC<FormattedAnswerTextProps> = ({
  text = '',
  className = '',
  isSpeakingSection = false,
  activeSentenceIndex,
}) => {
  const blocks = React.useMemo(
    () => parseAnswerBlocks(text),
    [text]
  )

  if (blocks.length === 0) return null

  let globalSentenceCount = 0

  const takeIndex = (): number => {
    const idx = globalSentenceCount
    globalSentenceCount += 1
    return idx
  }

  const speakClass = (idx: number): string | undefined =>
    isSpeakingSection && activeSentenceIndex !== undefined && activeSentenceIndex === idx
      ? 'mqb-active-spoken-sentence'
      : undefined

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

  const renderParagraph = (paragraph: string, key: React.Key): React.ReactNode => {
    const sentences = segmentParagraph(paragraph)

    return (
      <p key={key} className="mqb-answer-p">
        {sentences.map((sentence, sIdx) => {
          const idx = takeIndex()
          return (
            <span key={sIdx} className={speakClass(idx)}>
              {renderInline(sentence)}
              {sIdx < sentences.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </p>
    )
  }

  const renderList = (
    items: string[],
    ordered: boolean,
    key: React.Key
  ): React.ReactNode => {
    if (ordered) {
      return (
        <div key={key} className="mqb-answer-steps-list">
          {items.map((line, lIdx) => {
            const match = line.match(/^(\d+)[.)]\s*(.*)/)
            const stepLabel = match ? match[1] : `${lIdx + 1}`
            const content = match ? match[2] : line
            const idx = takeIndex()

            return (
              <div key={lIdx} className={`mqb-answer-step-item ${speakClass(idx) || ''}`}>
                <span className="mqb-answer-step-num">{stepLabel}</span>
                <div className="mqb-answer-step-item-body">{renderInline(content)}</div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <ul key={key} className="mqb-answer-bullets">
        {items.map((line, lIdx) => {
          const idx = takeIndex()
          return (
            <li key={lIdx} className={speakClass(idx)}>
              {renderInline(line.replace(/^[-*•]\s+/, ''))}
            </li>
          )
        })}
      </ul>
    )
  }

  const renderBlock = (block: AnswerBlock, key: React.Key): React.ReactNode => {
    switch (block.type) {
      case 'code':
        return <AnswerCodeBlock key={key} lang={block.lang} code={block.code} />

      case 'heading': {
        const idx = takeIndex()
        return (
          <div key={key} className={`mqb-answer-h ${speakClass(idx) || ''}`}>
            {renderInline(block.text)}
          </div>
        )
      }

      case 'paragraph':
        return renderParagraph(block.text, key)

      case 'list':
        return renderList(block.items, block.ordered, key)

      case 'step': {
        const titleIdx = takeIndex()
        return (
          <section key={key} className="mqb-answer-step">
            <header className="mqb-answer-step-head">
              <span className="mqb-answer-step-num">{block.number}</span>
              <span className={`mqb-answer-step-title ${speakClass(titleIdx) || ''}`}>
                {renderInline(block.title)}
              </span>
            </header>
            <div className="mqb-answer-step-body">
              {block.children.map((child, cIdx) => renderBlock(child, cIdx))}
            </div>
          </section>
        )
      }
    }
  }

  return (
    <div
      className={`space-y-4 text-[1.03rem] leading-[1.85] text-slate-700 dark:text-slate-200 ${className}`}
      style={{
        transition: 'all 0.2s ease',
      }}
    >
      {blocks.map((block, bIdx) => renderBlock(block, bIdx))}
    </div>
  )
}
