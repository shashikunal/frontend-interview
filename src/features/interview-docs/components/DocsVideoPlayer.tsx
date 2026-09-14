import { useState, useEffect } from 'react';
import type { VideoLesson } from '../types/docs.types';

interface DocsVideoPlayerProps {
  video?: VideoLesson;
  videoList?: VideoLesson[];
  topicTitle: string;
  subjectTitle?: string;
}

export function DocsVideoPlayer({
  video,
  videoList = [],
  topicTitle,
  subjectTitle = '',
}: DocsVideoPlayerProps) {
  const [activeVideo, setActiveVideo] = useState<VideoLesson | undefined>(video);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('docs_video_player_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Sync active video whenever the topic changes
  useEffect(() => {
    setActiveVideo(video);
    setIsPlaying(false);
  }, [video, topicTitle]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('docs_video_player_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Combine primary video and playlist to ensure no duplicates
  const playlist = videoList.length > 0
    ? videoList
    : (video ? [video] : []);

  const currentVideo = activeVideo || video || playlist[0];

  if (!currentVideo || !currentVideo.videoId) {
    return (
      <div className="docs-video-card video-unavailable-card">
        <div className="video-placeholder-inner">
          <span className="video-status-icon">🎥</span>
          <div>
            <h5>Video Tutorial in Review</h5>
            <p>
              A verified video walkthrough is being cataloged for <strong>{topicTitle}</strong>.
              In the meantime, all technical specifications and production code snippets are available below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const directYouTubeUrl = `https://www.youtube.com/watch?v=${currentVideo.videoId}`;
  const thumbnailUrl =
    currentVideo.thumbnailUrl ||
    `https://img.youtube.com/vi/${currentVideo.videoId}/hqdefault.jpg`;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${subjectTitle} ${topicTitle} tutorial guide`
  )}`;

  // If collapsed, render non-distracting compact banner
  if (isCollapsed) {
    return (
      <div className="docs-video-card docs-video-card-collapsed" id="video-explanation">
        <div className="docs-video-collapsed-bar">
          <div className="dvc-left">
            <span className="dvc-icon">📺</span>
            <span className="dvc-label">Video Lesson:</span>
            <strong className="dvc-title">{currentVideo.title}</strong>
            <span className="dvc-duration">⏱️ {currentVideo.duration}</span>
          </div>
          <div className="dvc-right">
            <a
              href={directYouTubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dvc-youtube-btn"
              title="Watch directly on YouTube in a new tab"
            >
              📺 Open on YouTube ↗
            </a>
            <button
              type="button"
              className="dvc-toggle-btn"
              onClick={toggleCollapse}
              title="Expand video player"
            >
              Expand Player ▾
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="docs-video-card" id="video-explanation">
      {/* Active Video Header Info */}
      <div className="docs-video-meta-head">
        <div className="dvm-left">
          <span className="dvm-badge">
            {currentVideo.badge ? currentVideo.badge.toUpperCase() : '📺 LESSON VIDEO'}
          </span>
          <h4 className="dvm-title">{currentVideo.title}</h4>
        </div>
        <div className="dvm-right">
          <span className="dvm-channel">Instructor: <strong>{currentVideo.channelName}</strong></span>
          <span className="dvm-duration">⏱️ {currentVideo.duration}</span>
          <div className="dvm-actions">
            <a
              href={directYouTubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dvm-yt-btn"
              title="Watch on YouTube directly (Bypasses local ad-blocker & embed limits)"
            >
              📺 Watch on YouTube ↗
            </a>
            <button
              type="button"
              className="dvm-collapse-btn"
              onClick={toggleCollapse}
              title="Collapse video player for distraction-free reading"
            >
              Hide Video ▴
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Embed Player */}
      <div className="docs-video-player-container">
        {!isPlaying ? (
          <div
            className="docs-video-thumbnail-wrap"
            onClick={() => setIsPlaying(true)}
            role="button"
            tabIndex={0}
            aria-label={`Play video: ${currentVideo.title}`}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsPlaying(true);
              }
            }}
          >
            <img
              src={thumbnailUrl}
              alt={currentVideo.title}
              className="docs-video-thumb-img"
              loading="lazy"
            />
            <div className="docs-video-play-overlay">
              <div className="docs-play-button">▶</div>
              <span className="docs-play-label">Watch Interactive Lesson</span>
              <span className="docs-play-subtext">Click to stream directly in this page</span>
              <div className="docs-overlay-direct-box" onClick={e => e.stopPropagation()}>
                <a
                  href={directYouTubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-overlay-direct-btn"
                  title="Watch in YouTube new tab without any embed or ad-blocker restrictions"
                >
                  ↗ Open Directly on YouTube (Ad-Blocker Friendly)
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="docs-video-iframe-wrap">
            <div className="docs-video-active-bar">
              <button
                type="button"
                className="dva-back-btn"
                onClick={() => setIsPlaying(false)}
                title="Stop video and return to preview"
              >
                ✕ Close Player
              </button>
              <div className="dva-notice">
                <span>⚠️ Seeing "Video unavailable"? Ad-blockers or network filters often block third-party embeds:</span>
                <a
                  href={directYouTubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dva-direct-link"
                >
                  Watch Directly on YouTube ↗
                </a>
              </div>
            </div>
            <iframe
              className="docs-video-iframe"
              src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={currentVideo.title}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Curated Playlist & Subtopic Video Selectors */}
      {playlist.length > 1 && (
        <div className="docs-video-playlist-section">
          <div className="dvp-header">
            <div className="dvp-header-title">
              <span className="dvp-icon">🎬</span>
              <strong>Recommended Video Lessons ({playlist.length})</strong>
            </div>
            <span className="dvp-subtitle">Select any tutorial below to switch playback:</span>
          </div>

          <div className="dvp-grid">
            {playlist.map((vid, idx) => {
              const isSelected = vid.videoId === currentVideo.videoId;
              const thumb =
                vid.thumbnailUrl ||
                `https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`;

              return (
                <div
                  key={`${vid.videoId}-${idx}`}
                  className={`dvp-card ${isSelected ? 'is-active-video' : ''}`}
                  onClick={() => {
                    setActiveVideo(vid);
                    setIsPlaying(true);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="dvp-card-thumb-box">
                    <img src={thumb} alt={vid.title} className="dvp-card-img" loading="lazy" />
                    <span className="dvp-card-duration">{vid.duration}</span>
                    {isSelected && <span className="dvp-playing-pill">▶ PLAYING</span>}
                  </div>

                  <div className="dvp-card-details">
                    <div className="dvp-card-badges">
                      {vid.badge && (
                        <span className={`dvp-badge-tag badge-${vid.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                          {vid.badge}
                        </span>
                      )}
                      {vid.subtopicTitle && (
                        <span className="dvp-subtopic-tag" title={vid.subtopicTitle}>
                          📄 {vid.subtopicTitle}
                        </span>
                      )}
                    </div>
                    <h5 className="dvp-card-title">{vid.title}</h5>
                    <span className="dvp-card-channel">{vid.channelName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Footer Actions & YouTube Search Link */}
      <div className="docs-video-footer-tip">
        <span className="dvf-tip">
          💡 <em>Pro-Tip:</em> Follow along with the production code snippets and interview questions below while watching.
        </span>
        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dvf-search-youtube-btn"
          title={`Search for more ${topicTitle} tutorials on YouTube`}
        >
          🔍 Search More "{topicTitle}" Tutorials on YouTube ↗
        </a>
      </div>
    </div>
  );
}
