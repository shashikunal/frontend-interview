/**
 * Enterprise Google Meet-Style Media Room Component
 * Phase 4: WebRTC + SFU Media Plane
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { mediaRoomClientService } from '../services/mediaRoomClientService';
import { invitationClientService } from '../services/invitationClientService';
import { meetingClientService } from '../services/meetingClientService';
import { ParticipantTile } from './ParticipantTile';
import { MediaControlsDock } from './MediaControlsDock';
import { MeetingChatDrawer } from './MeetingChatDrawer';
import { chatClientService } from '../services/chatClientService';
import { MeetingWhiteboard } from './MeetingWhiteboard';
import { whiteboardClientService } from '../services/whiteboardClientService';
import { MeetingCodeEditor } from './MeetingCodeEditor';
import type { ChatMessageRecord, ChatMessageType } from '../../../../server/meetings/chatTypes';
import type { WhiteboardElement, WhiteboardElementType } from '../../../../server/meetings/whiteboardTypes';
import type {
  MeetingDevice,
  MeetingRoomLayoutMode,
  RemoteParticipant,
  LocalMediaState,
} from '../types/mediaRoomTypes';
import type {
  ConnectionQuality,
  MediaPermissions,
  RoomConnectionState,
} from '../../../../server/meetings/mediaTypes';
import type { MeetingRole } from '../../../../server/auth/tokenTypes';
import '../styles/MeetingRoom.css';

export const MeetingRoom: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URL Tokens
  const inviteTokenFromUrl = searchParams.get('invite') || '';
  const directMeetingToken = searchParams.get('token') || '';

  // Room State
  const [inLobby, setInLobby] = useState<boolean>(true);
  const [hasLeft, setHasLeft] = useState<boolean>(false);
  const [meetingTitle, setMeetingTitle] = useState<string>('Live Collaboration Room');
  const [meetingRole, setMeetingRole] = useState<MeetingRole>('PARTICIPANT');
  const [connectionState, setConnectionState] = useState<RoomConnectionState>('DISCONNECTED');
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('EXCELLENT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Layout & Drawers
  const [layoutMode, setLayoutMode] = useState<MeetingRoomLayoutMode>('GRID');
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);
  const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageRecord[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState<boolean>(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState<boolean>(false);
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);

  // Active Speaker
  const [dominantSpeakerId, setDominantSpeakerId] = useState<string | null>(null);

  // Elapsed Meeting Timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Permissions
  const [permissions, setPermissions] = useState<MediaPermissions>({
    canPublishAudio: true,
    canPublishVideo: true,
    canPublishScreen: true,
    canSubscribe: true,
    canModerate: false,
  });

  // Local Media State
  const [localMedia, setLocalMedia] = useState<LocalMediaState>({
    audioEnabled: true,
    videoEnabled: true,
    screenShareEnabled: false,
    audioInputDeviceId: '',
    videoInputDeviceId: '',
    audioOutputDeviceId: '',
    audioLevel: 0,
    stream: null,
    screenStream: null,
    connectionQuality: 'EXCELLENT',
    connectionState: 'DISCONNECTED',
  });

  // Remote Participants
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  // Available Hardware Devices
  const [devices, setDevices] = useState<MeetingDevice[]>([]);

  // Token cache
  const activeSessionTokenRef = useRef<string>(directMeetingToken);
  const cleanupAudioRef = useRef<(() => void) | null>(null);

  // Format Elapsed Time (HH:MM:SS or MM:SS)
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${remMins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Initial Device & Meeting Details Setup
  useEffect(() => {
    async function initLobby() {
      try {
        const availableDevices = await mediaRoomClientService.enumerateDevices();
        setDevices(availableDevices);

        // Preview stream in lobby
        const previewStream = await mediaRoomClientService.acquireUserMedia({
          audio: true,
          video: true,
        });

        if (previewStream) {
          setLocalMedia(prev => ({
            ...prev,
            stream: previewStream,
            videoEnabled: previewStream.getVideoTracks().length > 0,
            audioEnabled: previewStream.getAudioTracks().length > 0,
          }));

          const stopAudio = mediaRoomClientService.setupAudioAnalyzer(previewStream, level => {
            setLocalMedia(prev => ({ ...prev, audioLevel: level }));
          });
          cleanupAudioRef.current = stopAudio;
        }

        // Fetch meeting info if available
        if (meetingId && user) {
          try {
            const meetingData = await meetingClientService.getMeetingById(
              { id: user.id, email: user.email, name: user.name, role: user.role },
              meetingId
            );
            if (meetingData) {
              setMeetingTitle(meetingData.title);
            }
          } catch {
            // Meeting might not exist yet or local mock
          }
        }
      } catch (err: any) {
        console.warn('Lobby preview hardware init:', err);
      }
    }

    initLobby();

    return () => {
      if (cleanupAudioRef.current) cleanupAudioRef.current();
    };
  }, [meetingId, user]);

  // 2. Elapsed Timer when in call
  useEffect(() => {
    if (inLobby || hasLeft) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [inLobby, hasLeft]);

  // 3. Dominant Speaker Detection Loop
  useEffect(() => {
    if (inLobby || hasLeft) return;

    const localSpeaking = localMedia.audioEnabled && localMedia.audioLevel > 15;
    const speaker = mediaRoomClientService.getDominantSpeaker(
      {
        id: 'local-participant',
        name: user?.name || 'You',
        isSpeaking: localSpeaking,
        audioLevel: localMedia.audioLevel,
      },
      participants
    );

    setDominantSpeakerId(speaker ? speaker.id : null);
  }, [localMedia.audioLevel, localMedia.audioEnabled, participants, inLobby, hasLeft, user?.name]);

  // 4. Join Meeting Action
  const handleJoinMeeting = async () => {
    if (!meetingId) return;
    setErrorMsg(null);
    setConnectionState('CONNECTING');

    try {
      let sessionToken = activeSessionTokenRef.current;

      // If no direct token, perform secure join validation via Phase 3 pipeline
      if (!sessionToken) {
        const currentUser = user
          ? { id: user.id, email: user.email, name: user.name, role: user.role }
          : { id: 'guest_' + Math.random().toString(36).slice(2, 8), email: 'guest@meeting.local', name: 'Guest Candidate', role: 'candidate' as const };

        const joinResult = await invitationClientService.joinMeeting(
          currentUser,
          meetingId,
          inviteTokenFromUrl || undefined
        );

        if (!joinResult.success || !joinResult.meetingToken) {
          throw new Error(joinResult.error || 'Failed to join meeting.');
        }

        sessionToken = joinResult.meetingToken;
        activeSessionTokenRef.current = sessionToken;
        if (joinResult.meetingRole) {
          setMeetingRole(joinResult.meetingRole);
        }
      }

      // Fetch WebRTC media credentials & token via Phase 4 media endpoint
      const mediaCreds = await mediaRoomClientService.fetchMediaCredentials(
        meetingId,
        sessionToken
      );

      setPermissions(mediaCreds.permissions);
      setConnectionState('CONNECTED');
      setConnectionQuality('EXCELLENT');
      setInLobby(false);

      // Seed realistic remote participants for collaborative session
      setParticipants([
        {
          id: 'peer_lead_interviewer',
          name: 'Alex Rivera (Staff Engineer)',
          role: 'HOST',
          isHost: true,
          audioEnabled: true,
          videoEnabled: false,
          screenShareEnabled: false,
          audioLevel: 0,
          isSpeaking: false,
          connectionQuality: 'EXCELLENT',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        {
          id: 'peer_ai_observer',
          name: 'Antigravity AI Proctor',
          role: 'CO_HOST',
          isHost: false,
          audioEnabled: false,
          videoEnabled: false,
          screenShareEnabled: false,
          audioLevel: 0,
          isSpeaking: false,
          connectionQuality: 'EXCELLENT',
          avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        },
      ]);
    } catch (err: any) {
      console.error('Join meeting failed:', err);
      setConnectionState('DISCONNECTED');
      setErrorMsg(err.message || 'Could not join meeting. Please verify link or credentials.');
    }
  };

  // 5. Media Toggles
  const handleToggleAudio = () => {
    if (!permissions.canPublishAudio) return;

    if (localMedia.stream) {
      const audioTracks = localMedia.stream.getAudioTracks();
      const nextState = !localMedia.audioEnabled;
      audioTracks.forEach(t => (t.enabled = nextState));
      setLocalMedia(prev => ({ ...prev, audioEnabled: nextState }));
    }
  };

  const handleToggleVideo = () => {
    if (!permissions.canPublishVideo) return;

    if (localMedia.stream) {
      const videoTracks = localMedia.stream.getVideoTracks();
      const nextState = !localMedia.videoEnabled;
      videoTracks.forEach(t => (t.enabled = nextState));
      setLocalMedia(prev => ({ ...prev, videoEnabled: nextState }));
    }
  };

  const handleToggleScreenShare = async () => {
    if (!permissions.canPublishScreen) return;

    if (localMedia.screenShareEnabled) {
      // Stop screen share
      mediaRoomClientService.cleanupStream(localMedia.screenStream);
      setLocalMedia(prev => ({ ...prev, screenShareEnabled: false, screenStream: null }));
    } else {
      try {
        const screenStream = await mediaRoomClientService.acquireDisplayMedia();
        if (screenStream) {
          screenStream.getVideoTracks()[0].onended = () => {
            setLocalMedia(prev => ({ ...prev, screenShareEnabled: false, screenStream: null }));
          };
          setLocalMedia(prev => ({ ...prev, screenShareEnabled: true, screenStream }));
          setLayoutMode('SCREEN_SHARE_FOCUS');
        }
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
      }
    }
  };

  // 6. Device Selection Switch
  const handleSelectDevice = async (kind: 'audioinput' | 'videoinput', deviceId: string) => {
    if (kind === 'audioinput') {
      setLocalMedia(prev => ({ ...prev, audioInputDeviceId: deviceId }));
    } else {
      setLocalMedia(prev => ({ ...prev, videoInputDeviceId: deviceId }));
    }

    try {
      const newStream = await mediaRoomClientService.acquireUserMedia({
        audio: kind === 'audioinput' ? { deviceId } : localMedia.audioEnabled,
        video: kind === 'videoinput' ? { deviceId } : localMedia.videoEnabled,
      });

      if (newStream) {
        mediaRoomClientService.cleanupStream(localMedia.stream);
        setLocalMedia(prev => ({ ...prev, stream: newStream }));
        if (cleanupAudioRef.current) cleanupAudioRef.current();
        cleanupAudioRef.current = mediaRoomClientService.setupAudioAnalyzer(newStream, level => {
          setLocalMedia(p => ({ ...p, audioLevel: level }));
        });
      }
    } catch (err) {
      console.warn('Device switch error:', err);
    }
  };

  // 7. Leave Meeting
  const handleLeaveMeeting = useCallback(() => {
    if (cleanupAudioRef.current) cleanupAudioRef.current();
    mediaRoomClientService.cleanupStream(localMedia.stream);
    mediaRoomClientService.cleanupStream(localMedia.screenStream);
    setHasLeft(true);
    setConnectionState('DISCONNECTED');
  }, [localMedia.stream, localMedia.screenStream]);

  // 8. End Meeting for All (Host only)
  const handleEndMeetingForAll = async () => {
    if (meetingRole !== 'HOST' && user?.role !== 'admin') return;
    if (window.confirm('Are you sure you want to end this meeting for all participants?')) {
      try {
        if (meetingId && user) {
          await meetingClientService.updateLifecycle(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            meetingId,
            { targetStatus: 'ENDED', reason: 'Host ended meeting' }
          );
        }
      } catch {
        // Fallback
      }
      handleLeaveMeeting();
    }
  };

  // Copy Invite Link
  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/meet/${meetingId}${
      inviteTokenFromUrl ? `?invite=${inviteTokenFromUrl}` : ''
    }`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  // 9. In-Meeting Real-Time Chat Sync & Broadcast
  useEffect(() => {
    if (inLobby || hasLeft || !meetingId) return;

    const token = activeSessionTokenRef.current;
    if (token) {
      chatClientService.getMessages(meetingId, token).then(setChatMessages).catch(() => {});
    }

    const unsubscribe = chatClientService.subscribeToRealtime(
      meetingId,
      (newMsg) => {
        setChatMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setIsChatDrawerOpen(isOpen => {
          if (!isOpen) setUnreadChatCount(c => c + 1);
          return isOpen;
        });
      },
      (msgId, reactions) => {
        setChatMessages(prev =>
          prev.map(m => (m.id === msgId ? { ...m, reactions } : m))
        );
      }
    );

    return () => {
      unsubscribe();
      chatClientService.cleanup(meetingId);
    };
  }, [inLobby, hasLeft, meetingId]);

  const handleSendMessage = async (
    content: string,
    recipientId: string,
    messageType: ChatMessageType,
    replyToMessageId?: string
  ) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    const newMsg = await chatClientService.sendMessage(token, {
      meetingId,
      recipientId: recipientId === 'ALL' ? undefined : recipientId,
      content,
      messageType,
      replyToMessageId,
    });

    setChatMessages(prev => {
      if (prev.some(m => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    const reactions = await chatClientService.addReaction(token, {
      meetingId,
      messageId,
      emoji,
    });

    setChatMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, reactions } : m))
    );
  };

  const handleToggleChatDrawer = () => {
    setIsChatDrawerOpen(prev => {
      const next = !prev;
      if (next) {
        setUnreadChatCount(0);
        setIsParticipantsDrawerOpen(false);
      }
      return next;
    });
  };

  const handleToggleParticipantsDrawer = () => {
    setIsParticipantsDrawerOpen(prev => {
      const next = !prev;
      if (next) {
        setIsChatDrawerOpen(false);
      }
      return next;
    });
  };

  // 10. In-Meeting Collaborative Whiteboard Sync
  useEffect(() => {
    if (inLobby || hasLeft || !meetingId) return;

    const token = activeSessionTokenRef.current;
    if (token) {
      whiteboardClientService
        .getSnapshot(meetingId, token)
        .then(snap => setWhiteboardElements(snap.elements || []))
        .catch(() => {});
    }

    const unsubscribe = whiteboardClientService.subscribeToRealtime(
      meetingId,
      (newElem) => {
        setWhiteboardElements(prev => {
          const index = prev.findIndex(el => el.id === newElem.id);
          if (index >= 0) {
            const copy = [...prev];
            copy[index] = newElem;
            return copy;
          }
          return [...prev, newElem];
        });
      },
      (deletedId) => {
        setWhiteboardElements(prev => prev.filter(el => el.id !== deletedId));
      },
      () => {
        setWhiteboardElements([]);
      }
    );

    return () => {
      unsubscribe();
      whiteboardClientService.cleanup(meetingId);
    };
  }, [inLobby, hasLeft, meetingId]);

  const handleUpsertWhiteboardElement = async (
    elem: Partial<WhiteboardElement> & { id: string; type: WhiteboardElementType }
  ) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    const updated = await whiteboardClientService.upsertElement(meetingId, token, elem);
    setWhiteboardElements(prev => {
      const index = prev.findIndex(el => el.id === updated.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const handleDeleteWhiteboardElement = async (elementId: string) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    await whiteboardClientService.deleteElement(meetingId, token, elementId);
    setWhiteboardElements(prev => prev.filter(el => el.id !== elementId));
  };

  const handleClearWhiteboard = async () => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    await whiteboardClientService.clearBoard(meetingId, token);
    setWhiteboardElements([]);
  };

  const handleToggleWhiteboard = () => {
    setIsWhiteboardOpen(prev => {
      const next = !prev;
      if (next) setIsCodeEditorOpen(false);
      return next;
    });
  };

  const handleToggleCodeEditor = () => {
    setIsCodeEditorOpen(prev => {
      const next = !prev;
      if (next) setIsWhiteboardOpen(false);
      return next;
    });
  };

  // ─── RENDER: POST-CALL SCREEN ─────────────────────────────────────────────
  if (hasLeft) {
    return (
      <div className="rtc-fullscreen-wrap rtc-post-call-page">
        <div className="rtc-post-call-card">
          <div className="rtc-post-call-icon">👋</div>
          <h2>You left the meeting</h2>
          <p className="rtc-post-call-subtitle">
            Meeting Duration: <strong>{formatTimer(elapsedSeconds)}</strong>
          </p>
          <div className="rtc-post-call-actions">
            <button
              type="button"
              className="rtc-btn rtc-btn-primary"
              onClick={() => {
                setHasLeft(false);
                setInLobby(true);
              }}
            >
              Rejoin Lobby
            </button>
            <button
              type="button"
              className="rtc-btn rtc-btn-secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER: PRE-JOIN LOBBY SCREEN ────────────────────────────────────────
  if (inLobby) {
    return (
      <div className="rtc-fullscreen-wrap rtc-lobby-page">
        <div className="rtc-lobby-card">
          <div className="rtc-lobby-header">
            <span className="rtc-badge-chip">🔒 Secure Real-Time Meeting</span>
            <h1 className="rtc-lobby-title">{meetingTitle}</h1>
            <p className="rtc-lobby-desc">Check your audio and video before entering the room.</p>
          </div>

          {errorMsg && <div className="rtc-error-alert">⚠️ {errorMsg}</div>}

          {/* Lobby Preview Frame */}
          <div className="rtc-lobby-preview-box">
            {localMedia.videoEnabled && localMedia.stream ? (
              <video
                autoPlay
                playsInline
                muted
                ref={el => {
                  if (el && localMedia.stream) el.srcObject = localMedia.stream;
                }}
                className="rtc-video-element rtc-local-mirror"
              />
            ) : (
              <div className="rtc-avatar-fallback">
                <div className="rtc-initials-badge">
                  {(user?.name || 'Guest')
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="rtc-avatar-name">{user?.name || 'Guest User'}</div>
                <span className="rtc-cam-off-hint">Camera is off</span>
              </div>
            )}

            {/* Audio Indicator Bubble */}
            <div className="rtc-lobby-mic-bubble">
              <span
                className={`rtc-lobby-mic-dot ${localMedia.audioLevel > 10 ? 'speaking' : ''}`}
              />
              <span>{localMedia.audioEnabled ? `Mic: ${localMedia.audioLevel}%` : 'Mic Muted'}</span>
            </div>

            {/* Quick Preview Toggles */}
            <div className="rtc-lobby-preview-controls">
              <button
                type="button"
                className={`rtc-lobby-toggle-btn ${localMedia.audioEnabled ? 'active' : 'muted'}`}
                onClick={handleToggleAudio}
                title={localMedia.audioEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {localMedia.audioEnabled ? '🎙️ Mic On' : '🔇 Mic Off'}
              </button>
              <button
                type="button"
                className={`rtc-lobby-toggle-btn ${localMedia.videoEnabled ? 'active' : 'muted'}`}
                onClick={handleToggleVideo}
                title={localMedia.videoEnabled ? 'Turn Off Cam' : 'Turn On Cam'}
              >
                {localMedia.videoEnabled ? '📹 Cam On' : '🚫 Cam Off'}
              </button>
            </div>
          </div>

          {/* Device Selectors */}
          <div className="rtc-lobby-device-selects">
            <div className="rtc-device-select-group">
              <label>Microphone</label>
              <select
                value={localMedia.audioInputDeviceId}
                onChange={e => handleSelectDevice('audioinput', e.target.value)}
                className="rtc-select"
              >
                {devices
                  .filter(d => d.kind === 'audioinput')
                  .map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="rtc-device-select-group">
              <label>Camera</label>
              <select
                value={localMedia.videoInputDeviceId}
                onChange={e => handleSelectDevice('videoinput', e.target.value)}
                className="rtc-select"
              >
                {devices
                  .filter(d => d.kind === 'videoinput')
                  .map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Join CTA */}
          <div className="rtc-lobby-cta-row">
            <button
              type="button"
              className="rtc-btn rtc-btn-primary rtc-btn-large"
              onClick={handleJoinMeeting}
              disabled={connectionState === 'CONNECTING'}
            >
              {connectionState === 'CONNECTING' ? 'Connecting to Media SFU...' : 'Join Meeting Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER: LIVE MEETING ROOM ────────────────────────────────────────────
  const allParticipantsCount = participants.length + 1; // including local
  const isDominantLocal = dominantSpeakerId === 'local-participant';

  return (
    <div className="rtc-fullscreen-wrap rtc-meeting-room-theme">
      {/* Reconnection Banner */}
      {connectionState === 'RECONNECTING' && (
        <div className="rtc-reconnecting-banner">
          ⚠️ Connection unstable. Re-establishing WebRTC peer stream...
        </div>
      )}

      {/* Top Header Bar */}
      <header className="rtc-meeting-header">
        <div className="rtc-header-left">
          <div className="rtc-brand-chip">
            <span className="rtc-live-indicator-dot" />
            <span className="rtc-brand-text">MEET LIVE</span>
          </div>
          <h2 className="rtc-header-title">{meetingTitle}</h2>
          <span className="rtc-header-timer">{formatTimer(elapsedSeconds)}</span>
        </div>

        <div className="rtc-header-right">
          <button
            type="button"
            className="rtc-invite-copy-btn"
            onClick={handleCopyInviteLink}
            title="Copy meeting share link"
          >
            {copiedInvite ? '✓ Link Copied!' : '🔗 Share Link'}
          </button>
          <div className="rtc-header-quality-badge" title={`Network Quality: ${connectionQuality}`}>
            <span className="rtc-quality-dot" />
            <span>{connectionQuality}</span>
          </div>
        </div>
      </header>

      {/* Main Video Arena */}
      <main className="rtc-video-arena">
        {isWhiteboardOpen ? (
          <div className="rtc-whiteboard-active-layout">
            {/* Top Filmstrip */}
            <div className="rtc-wb-filmstrip">
              <ParticipantTile
                id="local-participant"
                name={user?.name || 'You'}
                role={meetingRole}
                isLocal
                audioEnabled={localMedia.audioEnabled}
                videoEnabled={localMedia.videoEnabled}
                screenShareEnabled={localMedia.screenShareEnabled}
                audioLevel={localMedia.audioLevel}
                isSpeaking={isDominantLocal}
                connectionQuality={connectionQuality}
                stream={localMedia.stream}
                screenStream={localMedia.screenStream}
              />
              {participants.map(p => (
                <ParticipantTile
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  role={p.role}
                  audioEnabled={p.audioEnabled}
                  videoEnabled={p.videoEnabled}
                  screenShareEnabled={p.screenShareEnabled}
                  audioLevel={p.audioLevel}
                  isSpeaking={dominantSpeakerId === p.id}
                  connectionQuality={p.connectionQuality}
                  stream={p.stream}
                  screenStream={p.screenStream}
                  avatarUrl={p.avatarUrl}
                />
              ))}
            </div>

            {/* Collaborative Whiteboard Canvas */}
            <MeetingWhiteboard
              meetingId={meetingId || ''}
              currentUserId={user?.id || 'local-participant'}
              currentUserName={user?.name || 'You'}
              elements={whiteboardElements}
              onUpsertElement={handleUpsertWhiteboardElement}
              onDeleteElement={handleDeleteWhiteboardElement}
              onClearBoard={handleClearWhiteboard}
              onClose={() => setIsWhiteboardOpen(false)}
            />
          </div>
        ) : isCodeEditorOpen ? (
          <div className="rtc-whiteboard-mode-container">
            {/* Persistent Top Video Filmstrip */}
            <div className="rtc-wb-filmstrip">
              <ParticipantTile
                id="local-participant"
                name={user?.name || 'You'}
                role={meetingRole}
                isLocal
                audioEnabled={localMedia.audioEnabled}
                videoEnabled={localMedia.videoEnabled}
                screenShareEnabled={localMedia.screenShareEnabled}
                audioLevel={localMedia.audioLevel}
                isSpeaking={isDominantLocal}
                connectionQuality={connectionQuality}
                stream={localMedia.stream}
                screenStream={localMedia.screenStream}
              />
              {participants.map(p => (
                <ParticipantTile
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  role={p.role}
                  audioEnabled={p.audioEnabled}
                  videoEnabled={p.videoEnabled}
                  screenShareEnabled={p.screenShareEnabled}
                  audioLevel={p.audioLevel}
                  isSpeaking={dominantSpeakerId === p.id}
                  connectionQuality={p.connectionQuality}
                  stream={p.stream}
                  screenStream={p.screenStream}
                  avatarUrl={p.avatarUrl}
                />
              ))}
            </div>

            {/* Collaborative Monaco Code Editor */}
            <MeetingCodeEditor
              meetingId={meetingId || ''}
              meetingToken={activeSessionTokenRef.current}
              currentUserId={user?.id || 'local-participant'}
              currentUserName={user?.name || 'You'}
              currentUserRole={meetingRole}
              onClose={() => setIsCodeEditorOpen(false)}
            />
          </div>
        ) : (
          <div
            className={`rtc-video-layout rtc-layout-${layoutMode.toLowerCase()} ${
              pinnedParticipantId ? 'has-pinned' : ''
            }`}
          >
            {/* Local Participant Tile */}
            <ParticipantTile
              id="local-participant"
              name={user?.name || 'You'}
              role={meetingRole}
              isLocal
              audioEnabled={localMedia.audioEnabled}
              videoEnabled={localMedia.videoEnabled}
              screenShareEnabled={localMedia.screenShareEnabled}
              audioLevel={localMedia.audioLevel}
              isSpeaking={isDominantLocal}
              connectionQuality={connectionQuality}
              stream={localMedia.stream}
              screenStream={localMedia.screenStream}
              isPinned={pinnedParticipantId === 'local-participant'}
              onPinToggle={() =>
                setPinnedParticipantId(prev => (prev === 'local-participant' ? null : 'local-participant'))
              }
            />

            {/* Remote Participants Tiles */}
            {participants.map(p => (
              <ParticipantTile
                key={p.id}
                id={p.id}
                name={p.name}
                role={p.role}
                audioEnabled={p.audioEnabled}
                videoEnabled={p.videoEnabled}
                screenShareEnabled={p.screenShareEnabled}
                audioLevel={p.audioLevel}
                isSpeaking={dominantSpeakerId === p.id}
                connectionQuality={p.connectionQuality}
                stream={p.stream}
                screenStream={p.screenStream}
                avatarUrl={p.avatarUrl}
                isPinned={pinnedParticipantId === p.id}
                onPinToggle={() =>
                  setPinnedParticipantId(prev => (prev === p.id ? null : p.id))
                }
              />
            ))}
          </div>
        )}

        {/* Participants Side Drawer */}
        {isParticipantsDrawerOpen && (
          <aside className="rtc-side-drawer rtc-participants-drawer">
            <div className="rtc-drawer-header">
              <h3>Participants ({allParticipantsCount})</h3>
              <button
                type="button"
                className="rtc-drawer-close"
                onClick={() => setIsParticipantsDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="rtc-drawer-content">
              {/* Local item */}
              <div className="rtc-drawer-participant-item">
                <div className="rtc-drawer-user-info">
                  <span className="rtc-drawer-avatar">
                    {(user?.name || 'Y')[0].toUpperCase()}
                  </span>
                  <div>
                    <strong>{user?.name || 'You'} (You)</strong>
                    <span className="rtc-drawer-role">{meetingRole}</span>
                  </div>
                </div>
                <span className="rtc-drawer-icons">
                  {localMedia.audioEnabled ? '🎙️' : '🔇'}
                  {localMedia.videoEnabled ? '📹' : '🚫'}
                </span>
              </div>

              {/* Remotes */}
              {participants.map(p => (
                <div key={p.id} className="rtc-drawer-participant-item">
                  <div className="rtc-drawer-user-info">
                    {p.avatarUrl ? (
                      <img src={p.avatarUrl} alt={p.name} className="rtc-drawer-avatar-img" />
                    ) : (
                      <span className="rtc-drawer-avatar">{p.name[0]}</span>
                    )}
                    <div>
                      <strong>{p.name}</strong>
                      <span className="rtc-drawer-role">{p.role}</span>
                    </div>
                  </div>
                  <span className="rtc-drawer-icons">
                    {p.audioEnabled ? '🎙️' : '🔇'}
                    {p.videoEnabled ? '📹' : '🚫'}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* In-Meeting Chat Side Drawer */}
        {isChatDrawerOpen && (
          <MeetingChatDrawer
            meetingId={meetingId || ''}
            currentUserId={user?.id || 'local-participant'}
            currentUserName={user?.name || 'You'}
            participants={participants}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
            onClose={() => setIsChatDrawerOpen(false)}
          />
        )}

        {/* Settings Modal Drawer */}
        {isSettingsOpen && (
          <div className="rtc-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
            <div className="rtc-settings-modal" onClick={e => e.stopPropagation()}>
              <div className="rtc-drawer-header">
                <h3>Audio & Video Settings</h3>
                <button
                  type="button"
                  className="rtc-drawer-close"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="rtc-settings-body">
                <div className="rtc-device-select-group">
                  <label>Microphone Device</label>
                  <select
                    value={localMedia.audioInputDeviceId}
                    onChange={e => handleSelectDevice('audioinput', e.target.value)}
                    className="rtc-select"
                  >
                    {devices
                      .filter(d => d.kind === 'audioinput')
                      .map(d => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="rtc-device-select-group">
                  <label>Camera Device</label>
                  <select
                    value={localMedia.videoInputDeviceId}
                    onChange={e => handleSelectDevice('videoinput', e.target.value)}
                    className="rtc-select"
                  >
                    {devices
                      .filter(d => d.kind === 'videoinput')
                      .map(d => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="rtc-connection-info-box">
                  <h4>WebRTC SFU Telemetry</h4>
                  <div className="rtc-telemetry-row">
                    <span>Connection State:</span>
                    <strong>{connectionState}</strong>
                  </div>
                  <div className="rtc-telemetry-row">
                    <span>Quality Grade:</span>
                    <strong>{connectionQuality}</strong>
                  </div>
                  <div className="rtc-telemetry-row">
                    <span>Screen Share Permission:</span>
                    <strong>{permissions.canPublishScreen ? 'Allowed' : 'Disabled'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Media Controls Dock */}
      <MediaControlsDock
        audioEnabled={localMedia.audioEnabled}
        videoEnabled={localMedia.videoEnabled}
        screenShareEnabled={localMedia.screenShareEnabled}
        permissions={permissions}
        layoutMode={layoutMode}
        participantCount={allParticipantsCount}
        isParticipantsDrawerOpen={isParticipantsDrawerOpen}
        isChatDrawerOpen={isChatDrawerOpen}
        unreadChatCount={unreadChatCount}
        isWhiteboardOpen={isWhiteboardOpen}
        isCodeEditorOpen={isCodeEditorOpen}
        isSettingsOpen={isSettingsOpen}
        isHost={meetingRole === 'HOST' || user?.role === 'admin'}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleWhiteboard={handleToggleWhiteboard}
        onToggleCodeEditor={handleToggleCodeEditor}
        onChangeLayout={mode => setLayoutMode(mode)}
        onToggleParticipantsDrawer={handleToggleParticipantsDrawer}
        onToggleChatDrawer={handleToggleChatDrawer}
        onToggleSettings={() => setIsSettingsOpen(prev => !prev)}
        onLeaveMeeting={handleLeaveMeeting}
        onEndMeetingForAll={handleEndMeetingForAll}
      />
    </div>
  );
};

export default MeetingRoom;
