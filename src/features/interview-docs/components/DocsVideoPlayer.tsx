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
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
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
    setCustomSearchQuery('');
    setActiveSearchTerm('');
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

  if (!currentVideo) {
    return null;
  }

  const isSearchMode = currentVideo.videoId === 'search' || !!activeSearchTerm;
  const effectiveSearchQuery = activeSearchTerm || currentVideo.searchQuery || `${subjectTitle} ${topicTitle} tutorial`;

  const directYouTubeUrl = isSearchMode
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(effectiveSearchQuery)}`
    : `https://www.youtube.com/watch?v=${currentVideo.videoId}`;

  const thumbnailUrl = isSearchMode
    ? (playlist[0]?.thumbnailUrl || `https://img.youtube.com/vi/${playlist[0]?.videoId || 'M3LOgX_3X1E'}/hqdefault.jpg`)
    : (currentVideo.thumbnailUrl || `https://img.youtube.com/vi/${currentVideo.videoId}/hqdefault.jpg`);

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${subjectTitle} ${topicTitle} tutorial guide`
  )}`;

  const iframeSrc = isSearchMode
    ? `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(effectiveSearchQuery)}&autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${currentVideo.videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;
    setActiveSearchTerm(customSearchQuery.trim());
    setActiveVideo({
      topicId: currentVideo.topicId,
      videoId: 'search',
      title: `YouTube Search: "${customSearchQuery.trim()}"`,
      duration: 'Live Stream',
      channelName: 'YouTube Search',
      isVerified: true,
      badge: 'Live YouTube Stream',
      searchQuery: customSearchQuery.trim(),
    });
    setIsPlaying(true);
  };

  const handleSelectVideo = (vid: VideoLesson) => {
    setActiveVideo(vid);
    if (vid.videoId === 'search') {
      setActiveSearchTerm(vid.searchQuery || `${subjectTitle} ${topicTitle}`);
    } else {
      setActiveSearchTerm('');
    }
    setIsPlaying(true);
  };

  // If collapsed, render non-distracting compact banner
  if (isCollapsed) {
    return (
      <div className="docs-video-card docs-video-card-collapsed">
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
    <div className="docs-video-card">
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
              title="Watch on YouTube directly"
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

      {/* Quick Chapter & Subtopic Switcher Chips */}
      {playlist.length > 1 && (
        <div className="docs-video-chips-bar">
          <span className="dvc-chips-label">Select Chapter / Subtopic:</span>
          <div className="dvc-chips-list">
            {playlist.map((item, idx) => {
              const isSelected = item.videoId === currentVideo.videoId && (!item.subtopicId || item.subtopicId === currentVideo.subtopicId);
              return (
                <button
                  key={`${item.videoId}-${item.subtopicId || idx}`}
                  type="button"
                  className={`dvc-subtopic-chip ${isSelected ? 'is-chip-active' : ''}`}
                  onClick={() => handleSelectVideo(item)}
                  title={item.title}
                >
                  <span className="dvc-chip-icon">
                    {item.videoId === 'search' ? '⚡' : item.badge === 'What Is It?' ? '💡' : item.badge === 'Practical Usage' ? '💻' : item.badge === 'Best Practices' ? '⚠️' : '🎬'}
                  </span>
                  <span className="dvc-chip-text">
                    {item.subtopicTitle || (idx === 0 ? 'Topic Overview' : item.title)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
              src={iframeSrc}
              title={currentVideo.title}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Dynamic YouTube Finder & Search Bar */}
      <div className="docs-video-search-bar-wrap">
        <form onSubmit={handleSearchSubmit} className="docs-video-search-form">
          <span className="dvs-search-icon">🔍</span>
          <input
            type="text"
            className="dvs-search-input"
            value={customSearchQuery}
            onChange={e => setCustomSearchQuery(e.target.value)}
            placeholder={`Search YouTube for "${topicTitle}" concepts, tutorials or questions...`}
            aria-label="Search YouTube"
          />
          <button type="submit" className="dvs-search-submit-btn">
            ⚡ Stream from YouTube
          </button>
        </form>
        <div className="dvs-quick-tags">
          <span className="dvs-tag-label">Quick Search:</span>
          <button
            type="button"
            className="dvs-tag-btn"
            onClick={() => {
              setCustomSearchQuery(`${topicTitle} tutorial for beginners`);
              setActiveSearchTerm(`${topicTitle} tutorial for beginners`);
              setActiveVideo({
                topicId: currentVideo.topicId,
                videoId: 'search',
                title: `YouTube: "${topicTitle} tutorial for beginners"`,
                duration: 'Live Stream',
                channelName: 'YouTube Stream',
                isVerified: true,
                badge: 'Live YouTube Stream',
                searchQuery: `${topicTitle} tutorial for beginners`,
              });
              setIsPlaying(true);
            }}
          >
            "{topicTitle} tutorial"
          </button>
          <button
            type="button"
            className="dvs-tag-btn"
            onClick={() => {
              setCustomSearchQuery(`${topicTitle} interview questions and answers`);
              setActiveSearchTerm(`${topicTitle} interview questions and answers`);
              setActiveVideo({
                topicId: currentVideo.topicId,
                videoId: 'search',
                title: `YouTube: "${topicTitle} interview questions"`,
                duration: 'Live Stream',
                channelName: 'YouTube Stream',
                isVerified: true,
                badge: 'Live YouTube Stream',
                searchQuery: `${topicTitle} interview questions and answers`,
              });
              setIsPlaying(true);
            }}
          >
            "{topicTitle} interview questions"
          </button>
        </div>
      </div>

      {/* Curated Playlist & Subtopic Video Selectors */}
      {playlist.length > 1 && (
        <div className="docs-video-playlist-section">
          <div className="dvp-header">
            <div className="dvp-header-title">
              <span className="dvp-icon">🎬</span>
              <strong>Curated Video Lessons for this Chapter & Subtopics ({playlist.length})</strong>
            </div>
            <span className="dvp-subtitle">Click any lesson below to switch the player to that specific subtopic or live stream:</span>
          </div>

          <div className="dvp-grid">
            {playlist.map((vid, idx) => {
              const isSelected = vid.videoId === currentVideo.videoId && (!vid.subtopicId || vid.subtopicId === currentVideo.subtopicId);
              const thumb = vid.videoId === 'search'
                ? (playlist[0]?.thumbnailUrl || `https://img.youtube.com/vi/${playlist[0]?.videoId || 'M3LOgX_3X1E'}/mqdefault.jpg`)
                : (vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`);

              return (
                <div
                  key={`${vid.videoId}-${vid.subtopicId || idx}`}
                  className={`dvp-card ${isSelected ? 'is-active-video' : ''}`}
                  onClick={() => handleSelectVideo(vid)}
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
                        <span className={`dvp-badge-tag badge-${vid.badge.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
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
