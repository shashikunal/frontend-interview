import { useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import './SplitPane.css'

interface SplitPaneProps {
  left: ReactNode
  right: ReactNode
  initial?: number
  min?: number
  max?: number
  className?: string
}

export default function SplitPane({
  left,
  right,
  initial = 0.5,
  min = 0.2,
  max = 0.8,
  className = '',
}: SplitPaneProps) {
  const [ratio, setRatio] = useState(initial)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    let r = (e.clientX - rect.left) / rect.width
    r = Math.min(max, Math.max(min, r))
    setRatio(r)
  }

  const onPointerUp = (e: ReactPointerEvent) => {
    dragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  return (
    <div ref={containerRef} className={`split-pane ${className}`}>
      <div className="split-pane-left" style={{ width: `${ratio * 100}%` }}>
        {left}
      </div>
      <div
        className="split-pane-divider"
        role="separator"
        aria-orientation="vertical"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="split-pane-grip" />
      </div>
      <div className="split-pane-right">{right}</div>
    </div>
  )
}
