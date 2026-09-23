/**
 * Enterprise Meeting Recording & Synchronized Transcript Viewer
 * Phase 17: Recording, Media Storage, Presigned URLs & Transcript Retrieval
 *
 * Features:
 * - HTML5 video streaming with range-request seek support
 * - Synchronized transcript panel with speaker tags
 * - Interactive timestamp clicking: jumps video to exact dialogue moment
 * - In-transcript keyword search
 * - Responsive layout for desktop and tablet
 */

import React, { useState, useRef } from 'react';
import type { MeetingTranscriptRecord } from '../../../../server/media/recordingTypes.ts';

interface MeetingRecordingViewerProps {
  meetingTitle: string;
  playbackUrl: string;
  durationSeconds: number;
  transcript?: MeetingTranscriptRecord | null;
  onClose?: () => void;
}

export const MeetingRecordingViewer: React.FC<MeetingRecordingViewerProps> = ({
  meetingTitle,
  playbackUrl,
  durationSeconds,
  transcript,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(-1);

  // Update current time on video timeupdate
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      if (transcript && transcript.segments) {
        const idx = transcript.segments.findIndex(
          s => s.startTimeSeconds <= time && s.endTimeSeconds >= time
        );
        setActiveSegmentIndex(idx);
      }
    }
  };

  const handleSeekToSegment = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play().catch(() => {});
    }
  };

  const filteredSegments = (transcript?.segments || []).filter(segment =>
    segment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSeconds = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#1e293b',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{meetingTitle}</h2>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Time: {formatSeconds(currentTime)} / {formatSeconds(durationSeconds)} • Playback & Transcript
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #475569',
              color: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* Main Content: Split Player and Transcript */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Video Player Column */}
        <div
          style={{
            flex: 2,
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            src={playbackUrl}
            controls
            onTimeUpdate={handleTimeUpdate}
            style={{ width: '100%', maxHeight: '100%', outline: 'none' }}
          >
            Your browser does not support HTML5 video playback.
          </video>
        </div>

        {/* Transcript Column */}
        <div
          style={{
            flex: 1,
            borderLeft: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0f172a',
            minWidth: '320px',
          }}
        >
          {/* Transcript Header & Search */}
          <div style={{ padding: '16px', borderBottom: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 12px 0' }}>
              Meeting Transcript
            </h3>
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Transcript Dialogue List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {!transcript || transcript.status === 'PROCESSING' ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 0' }}>
                <div style={{ marginBottom: '8px', fontSize: '1.5rem' }}>⏳</div>
                <p style={{ margin: 0, fontWeight: 500 }}>Transcript processing...</p>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Dialogue will appear automatically once speech-to-text finishes.
                </span>
              </div>
            ) : filteredSegments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 0' }}>
                No dialogue matches "{searchQuery}"
              </div>
            ) : (
              filteredSegments.map((segment, idx) => {
                const isActive = activeSegmentIndex === idx;
                return (
                  <div
                    key={segment.id}
                    onClick={() => handleSeekToSegment(segment.startTimeSeconds)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#1e293b' : '#111827',
                      borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#38bdf8' }}>
                        {segment.speakerName || 'Speaker identification unavailable'}
                      </span>
                      <span>{formatSeconds(segment.startTimeSeconds)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.4 }}>
                      {segment.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
