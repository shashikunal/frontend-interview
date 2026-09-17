/**
 * Participant Tile Component
 * Phase 4: WebRTC + SFU Media Plane
 */

import React, { useRef, useEffect } from 'react';
import type { ConnectionQuality } from '../../../../server/meetings/mediaTypes.ts';
import type { MeetingRole } from '../../../../server/auth/tokenTypes.ts';

interface ParticipantTileProps {
  id: string;
  name: string;
  role: MeetingRole;
  isLocal?: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled?: boolean;
  audioLevel: number; // 0 - 100
  isSpeaking: boolean;
  connectionQuality: ConnectionQuality;
  stream?: MediaStream | null;
  screenStream?: MediaStream | null;
  avatarUrl?: string;
  isPinned?: boolean;
  onPinToggle?: () => void;
}

export const ParticipantTile: React.FC<ParticipantTileProps> = ({
  name,
  role,
  isLocal = false,
  audioEnabled,
  videoEnabled,
  screenShareEnabled = false,
  audioLevel,
  isSpeaking,
  connectionQuality,
  stream,
  screenStream,
  avatarUrl,
  isPinned = false,
  onPinToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream && videoEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoEnabled]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream && screenShareEnabled) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, screenShareEnabled]);

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderQualityIndicator = () => {
    let color = '#01b574'; // green
    let label = 'Excellent';

    if (connectionQuality === 'GOOD') {
      color = '#00d2d3';
      label = 'Good';
    } else if (connectionQuality === 'POOR') {
      color = '#ffb547';
      label = 'Poor';
    } else if (connectionQuality === 'LOST') {
      color = '#ee5d50';
      label = 'Disconnected';
    }

    return (
      <div className="rtc-quality-badge" title={`Network: ${label}`}>
        <span className="rtc-quality-dot" style={{ backgroundColor: color }} />
      </div>
    );
  };

  return (
    <div
      className={`rtc-participant-tile ${isSpeaking ? 'is-speaking' : ''} ${
        isPinned ? 'is-pinned' : ''
      }`}
    >
      {/* Active Speaker Aura Ring */}
      {isSpeaking && (
        <div
          className="rtc-speaking-pulse-ring"
          style={{ opacity: Math.min(1, Math.max(0.3, audioLevel / 100)) }}
        />
      )}

      {/* Screen Share Layer (if screen active) */}
      {screenShareEnabled && screenStream ? (
        <div className="rtc-screen-layer">
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="rtc-video-element rtc-screen-video"
          />
          <div className="rtc-screen-badge">🖥️ Screen Share</div>
        </div>
      ) : videoEnabled && stream ? (
        /* Video Stream Layer */
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`rtc-video-element ${isLocal ? 'rtc-local-mirror' : ''}`}
        />
      ) : (
        /* Avatar Fallback */
        <div className="rtc-avatar-fallback">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="rtc-avatar-img" />
          ) : (
            <div className="rtc-initials-badge">{getInitials(name)}</div>
          )}
          <div className="rtc-avatar-name">{name}</div>
        </div>
      )}

      {/* Tile Header Overlay */}
      <div className="rtc-tile-header">
        {onPinToggle && (
          <button
            type="button"
            className={`rtc-pin-btn ${isPinned ? 'active' : ''}`}
            onClick={onPinToggle}
            title={isPinned ? 'Unpin participant' : 'Pin participant'}
          >
            📌
          </button>
        )}
        {renderQualityIndicator()}
      </div>

      {/* Tile Footer Overlay */}
      <div className="rtc-tile-footer">
        <div className="rtc-identity-box">
          <span className="rtc-name-label">
            {name} {isLocal && '(You)'}
          </span>
          {role === 'HOST' && <span className="rtc-role-pill rtc-role-host">Host</span>}
          {role === 'CO_HOST' && <span className="rtc-role-pill rtc-role-cohost">Co-Host</span>}
        </div>

        <div className="rtc-status-indicators">
          {/* Audio State / Volume Meter */}
          {audioEnabled ? (
            <div
              className={`rtc-mic-indicator ${isSpeaking ? 'active-meter' : ''}`}
              title={`Microphone Active (${audioLevel}%)`}
            >
              <div className="rtc-mic-level-bar" style={{ height: `${Math.max(4, audioLevel)}%` }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
          ) : (
            <div className="rtc-mic-indicator muted" title="Microphone Muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.24-5.3-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c1.09-.16 2.09-.58 2.96-1.18l3.77 3.77 1.27-1.27L4.27 3z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
