import { useState, useRef, useEffect } from 'react'
import './BrowserPreview.css'

interface BrowserPreviewProps {
  srcDoc?: string
  src?: string
  url?: string
  title?: string
}

export default function BrowserPreview({ srcDoc, src, url, title }: BrowserPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    const el = wrapRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  return (
    <div className="browser-preview" ref={wrapRef}>
      <div className="browser-chrome">
        <span className="browser-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <div className="browser-url" title={url}>
          <span className="browser-lock" aria-hidden="true">🔒</span>
          <span className="browser-url-text">{url || 'about:preview'}</span>
        </div>
        <button className="browser-fs" onClick={toggleFullscreen} title={isFs ? 'Exit full screen' : 'Full screen'}>
          {isFs ? '⤡' : '⤢'}
        </button>
      </div>
      <iframe className="browser-frame" sandbox="allow-scripts" srcDoc={srcDoc} src={src} title={title} />
    </div>
  )
}
