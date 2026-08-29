import { useEffect, useState } from 'react'
import './Videos.css'

interface Video {
  title: string
  description: string
  url: string
  thumbnail: string
  topic: string
}

function fileUrl(name: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  return `${base}data/${name}.json`
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(fileUrl('topbrains-videos'))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Video[]) => {
        if (!cancelled) setVideos(Array.isArray(data) ? data : [])
      })
      .catch(e => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load videos')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="videos-page page-enter">
      <h1>Videos</h1>
      <p className="subtitle">
        Curated TopBrains walkthroughs. We store only metadata and links — no video files are
        downloaded. Open any card to watch on the source site.
      </p>

      {videos === null && !error && (
        <div className="videos-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 240 }} />
          ))}
        </div>
      )}

      {error && (
        <div className="empty-state">
          <h3>Videos not available yet</h3>
          <p>
            The video list (<code>data/topbrains-videos.json</code>) hasn&rsquo;t been generated.
            Run the fetcher with your TopBrains token to populate it:
          </p>
          <pre className="code-hint">SCRAPE_ONLY=topbrains npm run scrape:premium</pre>
        </div>
      )}

      {videos !== null && videos.length === 0 && (
        <div className="empty-state">
          <h3>No videos yet</h3>
          <p>
            Your <code>topbrains-videos.json</code> is empty. Provide a TopBrains token to the
            scraper and re-run to fetch video metadata.
          </p>
        </div>
      )}

      {videos !== null && videos.length > 0 && (
        <>
          <p className="result-count">
            <strong>{videos.length.toLocaleString()}</strong> video{videos.length !== 1 ? 's' : ''} available
          </p>
          <div className="videos-grid">
            {videos.map((v, i) => (
              <a
                key={v.url || i}
                className="video-card"
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="video-thumb">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt="" loading="lazy" />
                  ) : (
                    <div className="video-thumb-fallback" aria-hidden="true">▶</div>
                  )}
                </div>
                <div className="video-body">
                  {v.topic && <span className="badge badge-category">{v.topic}</span>}
                  <h3 className="video-title">{v.title}</h3>
                  {v.description && <p className="video-desc">{v.description}</p>}
                  <span className="video-watch">Watch on TopBrains ↗</span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
