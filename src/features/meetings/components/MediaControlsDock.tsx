/**
 * Media Controls Dock Component
 * Phase 4: WebRTC + SFU Media Plane
 */

import React from 'react';
import type { MediaPermissions } from '../../../../server/meetings/mediaTypes.ts';
import type { MeetingRoomLayoutMode } from '../types/mediaRoomTypes.ts';

interface MediaControlsDockProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  permissions: MediaPermissions;
  layoutMode: MeetingRoomLayoutMode;
  participantCount: number;
  isParticipantsDrawerOpen: boolean;
  isChatDrawerOpen: boolean;
  unreadChatCount: number;
  isWhiteboardOpen: boolean;
  isCodeEditorOpen: boolean;
  isSettingsOpen: boolean;
  isHost: boolean;
  handRaised?: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleWhiteboard: () => void;
  onToggleCodeEditor: () => void;
  onChangeLayout: (mode: MeetingRoomLayoutMode) => void;
  onToggleParticipantsDrawer: () => void;
  onToggleChatDrawer: () => void;
  onToggleSettings: () => void;
  onLeaveMeeting: () => void;
  onEndMeetingForAll?: () => void;
  onToggleHandRaise?: () => void;
  onSendReaction?: (emoji: string) => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
}

export const MediaControlsDock: React.FC<MediaControlsDockProps> = ({
  audioEnabled,
  videoEnabled,
  screenShareEnabled,
  permissions,
  layoutMode,
  participantCount,
  isParticipantsDrawerOpen,
  isChatDrawerOpen,
  unreadChatCount,
  isWhiteboardOpen,
  isCodeEditorOpen,
  isSettingsOpen,
  isHost,
  handRaised = false,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleWhiteboard,
  onToggleCodeEditor,
  onChangeLayout,
  onToggleParticipantsDrawer,
  onToggleChatDrawer,
  onToggleSettings,
  onLeaveMeeting,
  onEndMeetingForAll,
  onToggleHandRaise,
  onSendReaction,
  isRecording = false,
  onToggleRecording,
}) => {
  const [showReactionPicker, setShowReactionPicker] = React.useState<boolean>(false);
  const reactionEmojis = ['👍', '👏', '❤️', '😂', '🎉'];
  return (
    <div className="rtc-controls-dock-container">
      <div className="rtc-controls-dock">
        {/* Audio Toggle Button */}
        <button
          type="button"
          className={`rtc-dock-btn ${audioEnabled ? 'active' : 'muted'}`}
          onClick={onToggleAudio}
          disabled={!permissions.canPublishAudio}
          title={
            !permissions.canPublishAudio
              ? 'Audio publishing not permitted'
              : audioEnabled
              ? 'Mute Microphone'
              : 'Unmute Microphone'
          }
        >
          {audioEnabled ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.24-5.3-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c1.09-.16 2.09-.58 2.96-1.18l3.77 3.77 1.27-1.27L4.27 3z" />
            </svg>
          )}
          <span className="rtc-dock-btn-label">{audioEnabled ? 'Mic' : 'Muted'}</span>
        </button>

        {/* Video Toggle Button */}
        <button
          type="button"
          className={`rtc-dock-btn ${videoEnabled ? 'active' : 'muted'}`}
          onClick={onToggleVideo}
          disabled={!permissions.canPublishVideo}
          title={
            !permissions.canPublishVideo
              ? 'Video publishing not permitted'
              : videoEnabled
              ? 'Turn Camera Off'
              : 'Turn Camera On'
          }
        >
          {videoEnabled ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27l4.73 4.73H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 23 21 21.73 3.27 2z" />
            </svg>
          )}
          <span className="rtc-dock-btn-label">{videoEnabled ? 'Cam' : 'Off'}</span>
        </button>

        {/* Screen Share Toggle Button */}
        <button
          type="button"
          className={`rtc-dock-btn ${screenShareEnabled ? 'highlight-active' : ''}`}
          onClick={onToggleScreenShare}
          disabled={!permissions.canPublishScreen}
          title={
            !permissions.canPublishScreen
              ? 'Screen sharing disabled by host'
              : screenShareEnabled
              ? 'Stop Presenting'
              : 'Share Screen'
          }
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
          </svg>
          <span className="rtc-dock-btn-label">{screenShareEnabled ? 'Sharing' : 'Share'}</span>
        </button>

        {/* Whiteboard Toggle Button */}
        <button
          type="button"
          className={`rtc-dock-btn ${isWhiteboardOpen ? 'active' : ''}`}
          onClick={onToggleWhiteboard}
          title={isWhiteboardOpen ? 'Close Collaborative Whiteboard' : 'Open Collaborative Whiteboard'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l-2 2v1h12v-1l-2-2h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12z" />
          </svg>
          <span className="rtc-dock-btn-label">Board</span>
        </button>

        {/* Code Editor Toggle Button */}
        <button
          type="button"
          className={`rtc-dock-btn ${isCodeEditorOpen ? 'active' : ''}`}
          onClick={onToggleCodeEditor}
          title={isCodeEditorOpen ? 'Close Collaborative Code Editor' : 'Open Collaborative Code Editor'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="rtc-dock-btn-label">Code</span>
        </button>

        {/* Raise Hand Toggle Button */}
        {onToggleHandRaise && (
          <button
            type="button"
            className={`rtc-dock-btn ${handRaised ? 'highlight-active' : ''}`}
            onClick={onToggleHandRaise}
            title={handRaised ? 'Lower your hand' : 'Raise hand (Alt+H)'}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>✋</span>
            <span className="rtc-dock-btn-label">{handRaised ? 'Raised' : 'Hand'}</span>
          </button>
        )}

        {/* Ephemeral Reactions Picker Button */}
        {onSendReaction && (
          <div style={{ position: 'relative' }}>
            {showReactionPicker && (
              <div
                className="rtc-reaction-picker-popover"
                onClick={e => e.stopPropagation()}
              >
                {reactionEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className="rtc-reaction-emoji-btn"
                    onClick={() => {
                      onSendReaction(emoji);
                      setShowReactionPicker(false);
                    }}
                    title={`Send ${emoji} reaction`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              className={`rtc-dock-btn ${showReactionPicker ? 'active' : ''}`}
              onClick={() => setShowReactionPicker(prev => !prev)}
              title="Send in-call reaction"
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>😊</span>
              <span className="rtc-dock-btn-label">React</span>
            </button>
          </div>
        )}

        {/* Record Button (Host/Admin moderation control) */}
        {onToggleRecording && (
          <button
            type="button"
            className={`rtc-dock-btn ${isRecording ? 'recording' : ''}`}
            onClick={onToggleRecording}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
            style={isRecording ? { borderColor: '#ef4444', color: '#ef4444' } : undefined}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: isRecording ? '2px' : '50%',
                backgroundColor: isRecording ? '#ef4444' : 'currentColor',
                animation: isRecording ? 'handPulse 1.5s infinite' : 'none',
              }}
            />
            <span className="rtc-dock-btn-label">{isRecording ? 'Rec ON' : 'Record'}</span>
          </button>
        )}

        <div className="rtc-dock-separator" />

        {/* Layout Mode Selector */}
        <button
          type="button"
          className="rtc-dock-btn"
          onClick={() => {
            const nextMode: MeetingRoomLayoutMode =
              layoutMode === 'GRID'
                ? 'SPEAKER_SPOTLIGHT'
                : layoutMode === 'SPEAKER_SPOTLIGHT'
                ? 'SCREEN_SHARE_FOCUS'
                : 'GRID';
            onChangeLayout(nextMode);
          }}
          title={`Layout: ${layoutMode.replace('_', ' ')} (Click to toggle)`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            {layoutMode === 'GRID' ? (
              <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
            ) : layoutMode === 'SPEAKER_SPOTLIGHT' ? (
              <path d="M3 3h18v12H3V3zm0 14h5v4H3v-4zm7 0h5v4h-5v-4zm7 0h4v4h-4v-4z" />
            ) : (
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
            )}
          </svg>
          <span className="rtc-dock-btn-label">Layout</span>
        </button>

        {/* Participants Drawer Toggle */}
        <button
          type="button"
          className={`rtc-dock-btn ${isParticipantsDrawerOpen ? 'active' : ''}`}
          onClick={onToggleParticipantsDrawer}
          title="Participants List"
        >
          <div className="rtc-dock-badge-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span className="rtc-participant-count-badge">{participantCount}</span>
          </div>
          <span className="rtc-dock-btn-label">People</span>
        </button>

        {/* Chat Drawer Toggle */}
        <button
          type="button"
          className={`rtc-dock-btn ${isChatDrawerOpen ? 'active' : ''}`}
          onClick={onToggleChatDrawer}
          title="In-Call Chat"
        >
          <div className="rtc-dock-badge-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
            {unreadChatCount > 0 && (
              <span className="rtc-participant-count-badge">{unreadChatCount}</span>
            )}
          </div>
          <span className="rtc-dock-btn-label">Chat</span>
        </button>

        {/* Device Settings Drawer Toggle */}
        <button
          type="button"
          className={`rtc-dock-btn ${isSettingsOpen ? 'active' : ''}`}
          onClick={onToggleSettings}
          title="Audio & Video Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          <span className="rtc-dock-btn-label">Settings</span>
        </button>

        <div className="rtc-dock-separator" />

        {/* Leave Meeting Button */}
        <button
          type="button"
          className="rtc-dock-btn rtc-dock-btn-leave"
          onClick={onLeaveMeeting}
          title="Leave Call"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
          </svg>
          <span className="rtc-dock-btn-label">Leave</span>
        </button>

        {/* Host Only: End Meeting For All */}
        {isHost && onEndMeetingForAll && (
          <button
            type="button"
            className="rtc-dock-btn rtc-dock-btn-end-all"
            onClick={onEndMeetingForAll}
            title="End Meeting For All Participants"
          >
            <span className="rtc-dock-btn-label">End All</span>
          </button>
        )}
      </div>
    </div>
  );
};
