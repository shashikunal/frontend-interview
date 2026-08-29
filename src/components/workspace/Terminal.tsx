import { useState, useRef, useEffect } from 'react'
import type { TermLine } from './termLine'

interface TerminalProps {
  lines: TermLine[]
  running: boolean
  onEvaluate: (expr: string) => void
}

export default function Terminal({ lines, running, onEvaluate }: TerminalProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const submit = () => {
    const expr = input.trim()
    if (!expr) return
    onEvaluate(expr)
    setInput('')
  }

  return (
    <div className="terminal">
      <div className="terminal-head">
        <span className="terminal-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="terminal-title">Terminal{running ? ' — running…' : ''}</span>
        {running && <span className="terminal-spinner" aria-label="Running" />}
      </div>
      <div className="terminal-body" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        {lines.length === 0 && (
          <div className="term-line term-system">Console output appears here. Press Run, or type a JS expression below.</div>
        )}
        {lines.map(l => (
          <div key={l.id} className={`term-line term-${l.kind}`}>
            <span className="term-prompt">{l.kind === 'input' ? '›' : l.kind === 'error' ? '✕' : l.kind === 'warn' ? '▲' : '›'}</span>
            <pre className="term-text">{l.text}</pre>
          </div>
        ))}
      </div>
      <div className="terminal-input-row">
        <span className="term-prompt">❯</span>
        <input
          ref={inputRef}
          className="terminal-input"
          placeholder="Type a JS expression and press Enter (e.g. [1,2,3].map(n => n * 2))"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
