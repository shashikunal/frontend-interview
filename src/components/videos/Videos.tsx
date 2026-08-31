import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import './Videos.css'

interface Video {
  id?: number
  videoId?: string
  title: string
  description: string
  url: string
  thumbnail: string
  topic: string
  instructor?: string
  duration?: string
  level?: string
}

function fileUrl(name: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  return `${base}data/${name}.json`
}

const PAGE_SIZE = 24

export default function Videos() {
  const [videos, setVideos] = useState<Video[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

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

  const topics = useMemo(() => {
    if (!videos) return []
    const set = new Set<string>()
    videos.forEach(v => {
      if (v.topic) set.add(v.topic)
    })
    return Array.from(set).sort()
  }, [videos])

  const filteredVideos = useMemo(() => {
    if (!videos) return []
    let list = videos
    if (selectedTopic) {
      list = list.filter(v => v.topic === selectedTopic)
    }
    if (selectedLevel) {
      list = list.filter(v => v.level === selectedLevel)
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        v =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.topic.toLowerCase().includes(q) ||
          (v.instructor && v.instructor.toLowerCase().includes(q))
      )
    }
    return list
  }, [videos, selectedTopic, selectedLevel, searchTerm])

  const activeIndex = useMemo(() => {
    if (!activeVideo || !filteredVideos.length) return -1
    return filteredVideos.findIndex(v => v.id === activeVideo.id || v.title === activeVideo.title)
  }, [activeVideo, filteredVideos])

  const handlePrevVideo = useCallback(() => {
    if (activeIndex > 0) {
      setActiveVideo(filteredVideos[activeIndex - 1])
    }
  }, [activeIndex, filteredVideos])

  const handleNextVideo = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < filteredVideos.length - 1) {
      setActiveVideo(filteredVideos[activeIndex + 1])
    }
  }, [activeIndex, filteredVideos])

  // Keyboard navigation & body scroll locking for modal
  useEffect(() => {
    if (!activeVideo) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null)
      } else if (e.key === 'ArrowLeft') {
        handlePrevVideo()
      } else if (e.key === 'ArrowRight') {
        handleNextVideo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeVideo, handlePrevVideo, handleNextVideo])

  const hasMore = visibleCount < filteredVideos.length

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selectedTopic, selectedLevel, searchTerm])

  // Infinite scroll
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, filteredVideos.length))
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [filteredVideos.length, visibleCount, hasMore])

  const visible = filteredVideos.slice(0, visibleCount)

  return (
    <div className="videos-page page-enter">
      <div className="videos-header">
        <h1>Videos &amp; Masterclasses</h1>
        <p className="subtitle">
          A comprehensive library of {videos ? videos.length.toLocaleString() : '700+'} curated frontend interview video walkthroughs, system design architectures, web performance optimizations, React 19, React Query, Redux Toolkit (RTK), TypeScript, security sanitization, tooling &amp; HTTP networking. Click any card to <strong>play instantly in-app</strong>.
        </p>
      </div>

      {videos === null && !error && (
        <div className="videos-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260 }} />
          ))}
        </div>
      )}

      {error && (
        <div className="empty-state">
          <h3>Videos not available yet</h3>
          <p>Failed to load video catalog: {error}</p>
        </div>
      )}

      {videos !== null && videos.length > 0 && (
        <>
          <div className="videos-filter-bar">
            <div className="videos-controls-row">
              <input
                type="search"
                className="videos-search-input"
                placeholder="Search 700+ videos (e.g. CSS Grid, System Design, React Query, RTK, Sanitization, HTTP, TypeScript)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Filter videos"
              />
              <select
                className="videos-level-select"
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                aria-label="Filter by level"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="videos-topics">
              <button
                type="button"
                className={`topic-pill ${!selectedTopic ? 'active' : ''}`}
                onClick={() => setSelectedTopic('')}
              >
                All Topics ({videos.length})
              </button>
              {topics.map(t => {
                const count = videos.filter(v => v.topic === t).length
                return (
                  <button
                    key={t}
                    type="button"
                    className={`topic-pill ${selectedTopic === t ? 'active' : ''}`}
                    onClick={() => setSelectedTopic(t)}
                  >
                    {t} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          <div className="result-header-row">
            <p className="result-count">
              Showing <strong>{visible.length}</strong> of <strong>{filteredVideos.length}</strong> video{filteredVideos.length !== 1 ? 's' : ''}
              {filteredVideos.length < videos.length && ` (filtered from ${videos.length} total)`}
            </p>
            {(selectedTopic || selectedLevel || searchTerm) && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => {
                  setSelectedTopic('')
                  setSelectedLevel('')
                  setSearchTerm('')
                }}
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredVideos.length === 0 ? (
            <div className="empty-state">
              <h3>No matching videos found</h3>
              <p>Try searching for a different keyword or reset topic filters.</p>
            </div>
          ) : (
            <>
              <div className="videos-grid">
                {visible.map((v, i) => (
                  <div
                    key={v.id || v.url || i}
                    className="video-card interactive-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveVideo(v)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveVideo(v)
                      }
                    }}
                  >
                    <div className="video-thumb">
                      {v.thumbnail ? (
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="video-thumb-fallback" aria-hidden="true">▶</div>
                      )}
                      <div className="video-play-overlay" aria-hidden="true">
                        <div className="play-circle">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      {v.duration && <span className="video-duration-badge">{v.duration}</span>}
                    </div>
                    <div className="video-body">
                      <div className="video-meta-top">
                        {v.topic && <span className="badge badge-category">{v.topic}</span>}
                        {v.level && (
                          <span className={`badge badge-${v.level.toLowerCase()}`}>{v.level}</span>
                        )}
                        {v.instructor && (
                          <span className="video-instructor">{v.instructor}</span>
                        )}
                      </div>
                      <h3 className="video-title">{v.title}</h3>
                      {v.description && <p className="video-desc">{v.description}</p>}
                      <div className="video-card-footer">
                        <span className="video-watch-btn">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: 4 }}>
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Play In-App
                        </span>
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-yt-link"
                          onClick={e => e.stopPropagation()}
                          title="Open directly on YouTube"
                        >
                          YouTube ↗
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore ? (
                <div ref={sentinelRef} className="videos-sentinel">
                  <div className="videos-spinner" aria-hidden="true" />
                  <p className="videos-loading-note">Loading more masterclasses…</p>
                </div>
              ) : (
                <p className="videos-end-note">You&rsquo;ve reached the end — {filteredVideos.length} masterclasses.</p>
              )}
            </>
          )}
        </>
      )}

      {/* In-App Embedded Video Player Modal */}
      {activeVideo && (
        <div
          className="video-modal-backdrop page-enter"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div
            className="video-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="video-modal-header">
              <div className="video-modal-title-wrap">
                <div className="video-meta-top">
                  {activeVideo.topic && (
                    <span className="badge badge-category">{activeVideo.topic}</span>
                  )}
                  {activeVideo.level && (
                    <span className={`badge badge-${activeVideo.level.toLowerCase()}`}>
                      {activeVideo.level}
                    </span>
                  )}
                  {activeVideo.instructor && (
                    <span className="video-instructor">
                      👨‍💻 {activeVideo.instructor}
                    </span>
                  )}
                  {activeVideo.duration && (
                    <span className="video-duration-badge" style={{ position: 'static' }}>
                      ⏱️ {activeVideo.duration}
                    </span>
                  )}
                </div>
                <h2 className="video-modal-title">{activeVideo.title}</h2>
              </div>
              <button
                type="button"
                className="video-modal-close-btn"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
              >
                ✕
              </button>
            </div>

            <div className="video-modal-player-wrap">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId || 'rg7Fvvl3taU'}?autoplay=1&rel=0&enablejsapi=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="video-player-iframe"
              />
            </div>

            <div className="video-modal-body">
              <div className="video-modal-desc-box">
                <h4>Masterclass Overview &amp; Interview Takeaways</h4>
                <p>{activeVideo.description}</p>
              </div>

              <div className="video-modal-actions">
                <div className="video-modal-nav-btns">
                  <button
                    type="button"
                    className="modal-nav-btn"
                    onClick={handlePrevVideo}
                    disabled={activeIndex <= 0}
                  >
                    ← Previous Masterclass
                  </button>
                  <span className="modal-track-pos">
                    {activeIndex + 1} of {filteredVideos.length}
                  </span>
                  <button
                    type="button"
                    className="modal-nav-btn"
                    onClick={handleNextVideo}
                    disabled={activeIndex >= filteredVideos.length - 1}
                  >
                    Next Masterclass →
                  </button>
                </div>

                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-yt-action-btn"
                >
                  Watch on YouTube ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
