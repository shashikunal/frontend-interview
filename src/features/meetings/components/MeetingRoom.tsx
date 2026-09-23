/**
 * Enterprise Google Meet-Style Media Room Component
 * Phase 4: WebRTC + SFU Media Plane
 * Phase 15: Performance — memoized callbacks, throttled audio-level detection
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
import { meetingCollaborationService } from '../services/meetingCollaborationService';
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

  // Phase 16: Collaboration State
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [activeReactions, setActiveReactions] = useState<Array<{ id: string; emoji: string; userName: string; x: number }>>([]);
  const [participantReactions, setParticipantReactions] = useState<Map<string, { emoji: string; reactionId: string; timestamp: number }>>(new Map());
  const [isRemovedFromMeeting, setIsRemovedFromMeeting] = useState<boolean>(false);
  const [removalReason, setRemovalReason] = useState<string>('');
  const [isMeetingEndedByHost, setIsMeetingEndedByHost] = useState<boolean>(false);
  const [hostMuteToast, setHostMuteToast] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);

  // Layout & Drawers
  const [layoutMode, setLayoutMode] = useState<MeetingRoomLayoutMode>('GRID');
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);
  const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageRecord[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [allowChat, setAllowChat] = useState<boolean>(true);
  const [chatCursor, setChatCursor] = useState<string | null>(null);
  const [hasMoreOlderMessages, setHasMoreOlderMessages] = useState<boolean>(false);
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
  const [sessionToken, setSessionToken] = useState<string>(directMeetingToken);
  const activeSessionTokenRef = useRef<string>(directMeetingToken);
  const cleanupAudioRef = useRef<(() => void) | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const lobbyVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    localStreamRef.current = localMedia.stream;
    screenStreamRef.current = localMedia.screenStream;
  }, [localMedia.stream, localMedia.screenStream]);

  // Stable lobby preview video stream attachment (prevents black screen and flickering on audioLevel re-renders)
  useEffect(() => {
    const el = lobbyVideoRef.current;
    if (!el) return;
    if (localMedia.videoEnabled && localMedia.stream) {
      if (el.srcObject !== localMedia.stream) {
        el.srcObject = localMedia.stream;
        el.play().catch(() => {});
      }
    } else {
      if (el.srcObject !== null) {
        el.srcObject = null;
      }
    }
  }, [localMedia.stream, localMedia.videoEnabled, inLobby]);

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
    let isMounted = true;

    async function initLobby() {
      try {
        const availableDevices = await mediaRoomClientService.enumerateDevices();
        if (!isMounted) return;
        setDevices(availableDevices);

        // Preview stream in lobby
        const previewStream = await mediaRoomClientService.acquireUserMedia({
          audio: true,
          video: true,
        });

        if (!isMounted) {
          // If unmounted during StrictMode or route change, immediately shut down all hardware tracks!
          if (previewStream) {
            mediaRoomClientService.cleanupStream(previewStream);
            mediaRoomClientService.stopCamera(previewStream);
          }
          return;
        }

        if (previewStream) {
          setLocalMedia(prev => ({
            ...prev,
            stream: previewStream,
            videoEnabled: previewStream.getVideoTracks().length > 0,
            audioEnabled: previewStream.getAudioTracks().length > 0,
          }));

          const stopAudio = mediaRoomClientService.setupAudioAnalyzer(previewStream, level => {
            if (isMounted) {
              setLocalMedia(prev => ({ ...prev, audioLevel: prev.audioEnabled ? level : 0 }));
            }
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
            if (isMounted && meetingData) {
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

    // Hot-plug device change listener (headset plugged/unplugged, cam connected)
    const handleDeviceChange = async () => {
      try {
        const updated = await mediaRoomClientService.enumerateDevices();
        if (isMounted) {
          setDevices(updated);
        }
      } catch {
        // Ignored
      }
    };

    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    }

    return () => {
      isMounted = false;
      if (cleanupAudioRef.current) cleanupAudioRef.current();
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      }
      // Stop and release all physical webcam & microphone hardware
      mediaRoomClientService.stopAllMedia();
      if (localStreamRef.current) {
        mediaRoomClientService.cleanupStream(localStreamRef.current);
      }
      if (screenStreamRef.current) {
        mediaRoomClientService.cleanupStream(screenStreamRef.current);
      }
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

  // 3. Dominant Speaker Detection — throttled: only re-runs when speaking threshold crosses
  //    Phase 15: Previously ran on every audioLevel tick (30-60x/sec), causing full re-render.
  //    Now uses a ref-based throttle so it only compares speaking boundaries.
  const dominantSpeakerThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAudioLevelRef = useRef<number>(0);
  const prevSpeakingRef = useRef<boolean>(false);

  useEffect(() => {
    if (inLobby || hasLeft) return;

    const localSpeaking = localMedia.audioEnabled && localMedia.audioLevel > 15;
    const speakingChanged = localSpeaking !== prevSpeakingRef.current;
    const levelDelta = Math.abs(localMedia.audioLevel - lastAudioLevelRef.current);

    // Only update dominant speaker if speaking state changed or significant level shift
    if (!speakingChanged && levelDelta < 10) return;

    prevSpeakingRef.current = localSpeaking;
    lastAudioLevelRef.current = localMedia.audioLevel;

    if (dominantSpeakerThrottleRef.current) return; // coalesce rapid updates
    dominantSpeakerThrottleRef.current = setTimeout(() => {
      dominantSpeakerThrottleRef.current = null;
      const speaker = mediaRoomClientService.getDominantSpeaker(
        {
          id: 'local-participant',
          name: user?.name || 'You',
          isSpeaking: prevSpeakingRef.current,
          audioLevel: lastAudioLevelRef.current,
        },
        participants
      );
      setDominantSpeakerId(speaker ? speaker.id : null);
    }, 150); // max 6 dominant-speaker evaluations/sec
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
        setSessionToken(sessionToken);
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

      // Authoritative WebSocket collaboration plane registration
      const collabResult = await meetingCollaborationService.joinRoom(meetingId, sessionToken);
      if (collabResult.success && collabResult.participants) {
        const myUserId = user?.id || 'local-participant';
        const remoteList = collabResult.participants.filter(p => p.id !== myUserId);
        setParticipants(remoteList);
      }
    } catch (err: any) {
      console.error('Join meeting failed:', err);
      setConnectionState('DISCONNECTED');
      setErrorMsg(err.message || 'Could not join meeting. Please verify link or credentials.');
    }
  };

  // 5. Media Toggles
  const handleToggleAudio = async () => {
    if (!permissions.canPublishAudio) return;

    const nextState = !localMedia.audioEnabled;

    if (localMedia.stream) {
      const audioTracks = localMedia.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach(t => (t.enabled = nextState));
      } else if (nextState) {
        try {
          const audioStream = await mediaRoomClientService.acquireUserMedia({
            audio: localMedia.audioInputDeviceId
              ? { deviceId: localMedia.audioInputDeviceId }
              : true,
            video: false,
          });
          if (audioStream) {
            const newAudioTrack = audioStream.getAudioTracks()[0];
            if (newAudioTrack) {
              localMedia.stream.addTrack(newAudioTrack);
              if (cleanupAudioRef.current) cleanupAudioRef.current();
              cleanupAudioRef.current = mediaRoomClientService.setupAudioAnalyzer(localMedia.stream, level => {
                setLocalMedia(p => ({ ...p, audioLevel: p.audioEnabled ? level : 0 }));
              });
            }
          }
        } catch (err) {
          console.warn('Failed to acquire audio track on unmute:', err);
        }
      }
    }

    setLocalMedia(prev => ({
      ...prev,
      audioEnabled: nextState,
      audioLevel: nextState ? prev.audioLevel : 0,
    }));

    if (meetingId) {
      meetingCollaborationService.updateLocalMediaState(meetingId, {
        micState: nextState,
      });
    }
  };

  const handleToggleVideo = async () => {
    if (!permissions.canPublishVideo) return;

    if (localMedia.videoEnabled) {
      // 1. Physically stop camera tracks so the laptop webcam light turns OFF immediately
      if (localMedia.stream) {
        localMedia.stream.getVideoTracks().forEach(t => {
          try {
            t.enabled = false;
            t.stop();
          } catch {}
          localMedia.stream?.removeTrack(t);
        });
      }
      mediaRoomClientService.stopCamera();
      if (lobbyVideoRef.current) {
        try {
          lobbyVideoRef.current.srcObject = null;
        } catch {}
      }
      setLocalMedia(prev => ({ ...prev, videoEnabled: false }));
      if (meetingId) {
        meetingCollaborationService.updateLocalMediaState(meetingId, {
          cameraState: false,
        });
      }
    } else {
      // 2. Re-acquire video stream from hardware
      try {
        const videoStream = await mediaRoomClientService.acquireUserMedia({
          audio: false,
          video: localMedia.videoInputDeviceId
            ? { deviceId: localMedia.videoInputDeviceId }
            : true,
        });

        if (videoStream) {
          const newVideoTrack = videoStream.getVideoTracks()[0];
          if (newVideoTrack) {
            let stream = localMedia.stream;
            if (!stream) {
              stream = new MediaStream();
            }
            // Remove any stopped video tracks
            stream.getVideoTracks().forEach(t => {
              try {
                t.enabled = false;
                t.stop();
              } catch {}
              stream?.removeTrack(t);
            });
            stream.addTrack(newVideoTrack);

            setLocalMedia(prev => ({
              ...prev,
              videoEnabled: true,
              stream,
            }));

            if (meetingId) {
              meetingCollaborationService.updateLocalMediaState(meetingId, {
                cameraState: true,
              });
            }
          }
        }
      } catch (err) {
        console.warn('Failed to re-acquire camera video track:', err);
      }
    }
  };

  const handleToggleScreenShare = async () => {
    if (!permissions.canPublishScreen) return;

    if (localMedia.screenShareEnabled) {
      // Stop screen share
      mediaRoomClientService.cleanupStream(localMedia.screenStream);
      setLocalMedia(prev => ({ ...prev, screenShareEnabled: false, screenStream: null }));
      if (meetingId) {
        meetingCollaborationService.updateLocalMediaState(meetingId, {
          screenShareState: false,
        });
      }
    } else {
      try {
        const screenStream = await mediaRoomClientService.acquireDisplayMedia();
        if (screenStream) {
          screenStream.getVideoTracks()[0].onended = () => {
            setLocalMedia(prev => ({ ...prev, screenShareEnabled: false, screenStream: null }));
            if (meetingId) {
              meetingCollaborationService.updateLocalMediaState(meetingId, {
                screenShareState: false,
              });
            }
          };
          setLocalMedia(prev => ({ ...prev, screenShareEnabled: true, screenStream }));
          setLayoutMode('SCREEN_SHARE_FOCUS');
          if (meetingId) {
            meetingCollaborationService.updateLocalMediaState(meetingId, {
              screenShareState: true,
            });
          }
        }
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
      }
    }
  };

  // 6. Collaboration Actions: Hand Raise & Reaction
  const handleToggleHandRaise = async () => {
    if (!meetingId) return;
    if (isHandRaised) {
      await meetingCollaborationService.lowerHand(meetingId);
      setIsHandRaised(false);
    } else {
      await meetingCollaborationService.raiseHand(meetingId);
      setIsHandRaised(true);
    }
  };

  const handleSendReaction = async (emoji: string) => {
    if (!meetingId) return;
    const res = await meetingCollaborationService.sendReaction(meetingId, emoji);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  // Host Moderation Actions
  const handleHostMute = (targetUserId: string) => {
    if (!meetingId) return;
    meetingCollaborationService.hostRequestMute(meetingId, targetUserId);
  };

  const handleHostLowerHand = (targetUserId: string) => {
    if (!meetingId) return;
    meetingCollaborationService.hostLowerHand(meetingId, targetUserId);
  };

  const handleHostRemove = (targetUserId: string) => {
    if (!meetingId) return;
    meetingCollaborationService.hostRemoveParticipant(meetingId, targetUserId);
  };

  // 7. Device Selection Switch
  const handleSelectDevice = async (kind: 'audioinput' | 'videoinput', deviceId: string) => {
    if (kind === 'audioinput') {
      setLocalMedia(prev => ({ ...prev, audioInputDeviceId: deviceId }));
    } else {
      setLocalMedia(prev => ({ ...prev, videoInputDeviceId: deviceId }));
      // If camera is currently OFF, do NOT activate hardware or turn on laptop light!
      if (!localMedia.videoEnabled) {
        return;
      }
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
          setLocalMedia(p => ({ ...p, audioLevel: p.audioEnabled ? level : 0 }));
        });
      }
    } catch (err) {
      console.warn('Device switch error:', err);
    }
  };

  // 8. Leave Meeting
  const handleLeaveMeeting = useCallback(() => {
    if (meetingId) {
      meetingCollaborationService.leaveRoom(meetingId);
    }
    if (cleanupAudioRef.current) cleanupAudioRef.current();
    mediaRoomClientService.stopAllMedia();
    mediaRoomClientService.cleanupStream(localMedia.stream);
    mediaRoomClientService.cleanupStream(localMedia.screenStream);
    setLocalMedia(prev => ({
      ...prev,
      stream: null,
      screenStream: null,
      videoEnabled: false,
      audioEnabled: false,
      screenShareEnabled: false,
    }));
    setHasLeft(true);
    setConnectionState('DISCONNECTED');
  }, [meetingId, localMedia.stream, localMedia.screenStream]);

  // Recording Control (Phase 17)
  const handleToggleRecording = async () => {
    const token = activeSessionTokenRef.current;
    if (!token || !meetingId) return;

    try {
      if (!isRecording) {
        const res = await fetch('/api/v1/meetings/recording', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: 'START', meetingId }),
        });
        const data = await res.json();
        if (data.success && data.recording) {
          setIsRecording(true);
          setRecordingId(data.recording.id);
        }
      } else if (recordingId) {
        const res = await fetch('/api/v1/meetings/recording', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: 'STOP', meetingId, recordingId }),
        });
        const data = await res.json();
        if (data.success) {
          setIsRecording(false);
          setRecordingId(null);
        }
      }
    } catch (err) {
      console.error('Failed to toggle recording:', err);
    }
  };

  // 9. End Meeting for All (Host only)
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
          await meetingCollaborationService.hostEndMeeting(meetingId, 'Host ended meeting');
        }
      } catch {
        // Fallback
      }
      handleLeaveMeeting();
    }
  };

  // 10. Realtime Collaboration Event Subscriptions (Phase 16)
  useEffect(() => {
    if (inLobby || hasLeft || !meetingId) return;

    const unsubscribe = meetingCollaborationService.subscribe({
      onParticipantJoined: (p) => {
        const myUserId = user?.id || 'local-participant';
        if (p.id === myUserId) return;
        setParticipants(prev => {
          if (prev.some(existing => existing.id === p.id)) return prev;
          return [...prev, p];
        });
      },
      onParticipantLeft: (data) => {
        setParticipants(prev => prev.filter(p => p.id !== data.userId));
      },
      onParticipantUpdated: (updated) => {
        setParticipants(prev => prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p)));
      },
      onHandRaised: (data) => {
        const myUserId = user?.id || 'local-participant';
        if (data.userId === myUserId) {
          setIsHandRaised(true);
        }
        setParticipants(prev =>
          prev.map(p => (p.id === data.userId ? { ...p, handRaised: true, handRaisedAt: data.handRaisedAt } : p))
        );
      },
      onHandLowered: (data) => {
        const myUserId = user?.id || 'local-participant';
        if (data.userId === myUserId) {
          setIsHandRaised(false);
        }
        setParticipants(prev =>
          prev.map(p => (p.id === data.userId ? { ...p, handRaised: false, handRaisedAt: undefined } : p))
        );
      },
      onReaction: (reaction) => {
        const rxItem = {
          id: reaction.reactionId,
          emoji: reaction.emoji,
          userName: reaction.userName,
          x: 15 + Math.random() * 70,
        };
        setActiveReactions(prev => [...prev.slice(-15), rxItem]);
        setParticipantReactions(prev => {
          const next = new Map(prev);
          next.set(reaction.userId, {
            emoji: reaction.emoji,
            reactionId: reaction.reactionId,
            timestamp: reaction.timestamp,
          });
          return next;
        });
        setTimeout(() => {
          setActiveReactions(prev => prev.filter(r => r.id !== rxItem.id));
        }, 3500);
      },
      onMuteRequested: (data) => {
        const myUserId = user?.id || 'local-participant';
        if (data.targetUserId === myUserId) {
          if (localMedia.stream) {
            localMedia.stream.getAudioTracks().forEach(t => (t.enabled = false));
          }
          setLocalMedia(prev => ({ ...prev, audioEnabled: false }));
          setHostMuteToast(true);
          setTimeout(() => setHostMuteToast(false), 5000);
        }
      },
      onParticipantRemoved: (data) => {
        const myUserId = user?.id || 'local-participant';
        if (data.targetUserId === myUserId) {
          handleLeaveMeeting();
          setIsRemovedFromMeeting(true);
          setRemovalReason(data.reason || 'You have been removed from the meeting by the host.');
        } else {
          setParticipants(prev => prev.filter(p => p.id !== data.targetUserId));
        }
      },
      onMeetingEnded: () => {
        handleLeaveMeeting();
        setIsMeetingEndedByHost(true);
      },
      onStateSynced: (serverParticipants) => {
        const myUserId = user?.id || 'local-participant';
        setParticipants(serverParticipants.filter(p => p.id !== myUserId));
      },
    });

    return () => {
      unsubscribe();
    };
  }, [inLobby, hasLeft, meetingId, user?.id, localMedia.stream, handleLeaveMeeting]);

  // 11. Accessibility & Keyboard Shortcuts (Phase 16)
  const handlersRef = useRef({
    handleToggleAudio,
    handleToggleVideo,
    handleToggleHandRaise,
  });
  useEffect(() => {
    handlersRef.current = {
      handleToggleAudio,
      handleToggleVideo,
      handleToggleHandRaise,
    };
  });

  useEffect(() => {
    if (inLobby || hasLeft) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Alt+H: Toggle Raise Hand
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        handlersRef.current.handleToggleHandRaise();
      }
      // Ctrl+D: Toggle Microphone
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        handlersRef.current.handleToggleAudio();
      }
      // Ctrl+E: Toggle Camera
      if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handlersRef.current.handleToggleVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inLobby, hasLeft]);

  // Copy Invite Link
  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/meet/${meetingId}${
      inviteTokenFromUrl ? `?invite=${inviteTokenFromUrl}` : ''
    }`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  // 9. In-Meeting Real-Time Chat Sync & Broadcast (Phase 6 Production-Grade)
  useEffect(() => {
    if (inLobby || hasLeft || !meetingId) return;

    const token = activeSessionTokenRef.current;
    if (token) {
      chatClientService.initSocket(meetingId, token);
      chatClientService
        .getMessages(meetingId, token, undefined, 50)
        .then(res => {
          setChatMessages(res.messages || []);
          setChatCursor(res.nextCursor || null);
          setHasMoreOlderMessages(res.hasMore || false);
        })
        .catch(() => {});
    }

    const unsubscribe = chatClientService.subscribeToRealtime(meetingId, {
      onMessage: (newMsg) => {
        setChatMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setIsChatDrawerOpen(isOpen => {
          if (!isOpen) setUnreadChatCount(c => c + 1);
          return isOpen;
        });
      },
      onReaction: (msgId, reactions) => {
        setChatMessages(prev =>
          prev.map(m => (m.id === msgId ? { ...m, reactions } : m))
        );
      },
      onDeleted: (msgId, deletedBy) => {
        setChatMessages(prev =>
          prev.map(m =>
            m.id === msgId
              ? { ...m, deletedAt: new Date().toISOString(), deletedBy }
              : m
          )
        );
      },
      onStatus: (allowed) => {
        setAllowChat(allowed);
      },
      onSystem: (msg) => {
        if (msg.metadata?.allowChat !== undefined) {
          setAllowChat(msg.metadata.allowChat);
        }
      },
      onAnnouncement: (msg) => {
        setChatMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setIsChatDrawerOpen(isOpen => {
          if (!isOpen) setUnreadChatCount(c => c + 1);
          return isOpen;
        });
      },
    });

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

  const handleDeleteMessage = async (messageId: string) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    await chatClientService.deleteMessage(token, meetingId, messageId);
    setChatMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, deletedAt: new Date().toISOString(), deletedBy: user?.id || 'me' }
          : m
      )
    );
  };

  const handleToggleChat = async (newAllowChat: boolean) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    const result = await chatClientService.toggleChat(token, meetingId, newAllowChat);
    setAllowChat(result);
  };

  const handleSendAnnouncement = async (content: string) => {
    if (!meetingId) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    const ann = await chatClientService.sendAnnouncement(token, meetingId, content);
    setChatMessages(prev => {
      if (prev.some(m => m.id === ann.id)) return prev;
      return [...prev, ann];
    });
  };

  const handleLoadOlderMessages = async () => {
    if (!meetingId || !chatCursor) return;
    const token = activeSessionTokenRef.current;
    if (!token) return;

    const res = await chatClientService.getMessages(meetingId, token, chatCursor, 30);
    if (res.messages && res.messages.length > 0) {
      setChatMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const olderUnique = res.messages.filter(m => !existingIds.has(m.id));
        return [...olderUnique, ...prev];
      });
      setChatCursor(res.nextCursor || null);
      setHasMoreOlderMessages(res.hasMore || false);
    } else {
      setHasMoreOlderMessages(false);
    }
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

  // ─── RENDER: REMOVED BY HOST SCREEN (Phase 16) ───────────────────────────
  if (isRemovedFromMeeting) {
    return (
      <div className="rtc-fullscreen-wrap rtc-post-call-page">
        <div className="rtc-post-call-card">
          <div className="rtc-post-call-icon">🚫</div>
          <h2>Removed from Meeting</h2>
          <p className="rtc-post-call-subtitle">
            {removalReason || 'A meeting host has removed you from this session.'}
          </p>
          <div className="rtc-post-call-actions">
            <button
              type="button"
              className="rtc-btn rtc-btn-primary"
              onClick={() => navigate('/')}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER: MEETING ENDED BY HOST SCREEN (Phase 16) ───────────────────────
  if (isMeetingEndedByHost) {
    return (
      <div className="rtc-fullscreen-wrap rtc-post-call-page">
        <div className="rtc-post-call-card">
          <div className="rtc-post-call-icon">🏁</div>
          <h2>Meeting Ended</h2>
          <p className="rtc-post-call-subtitle">
            The host has ended this meeting for all participants.
          </p>
          <p className="rtc-post-call-subtitle">
            Total Duration: <strong>{formatTimer(elapsedSeconds)}</strong>
          </p>
          <div className="rtc-post-call-actions">
            <button
              type="button"
              className="rtc-btn rtc-btn-primary"
              onClick={() => navigate('/')}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                ref={lobbyVideoRef}
                autoPlay
                playsInline
                muted
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

      {/* Recording in Progress Banner (Phase 17) */}
      {isRecording && (
        <div
          style={{
            backgroundColor: '#7f1d1d',
            color: '#fef2f2',
            padding: '6px 16px',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderBottom: '1px solid #991b1b',
            zIndex: 40,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }}
          />
          <span>Recording in progress — This meeting is being recorded for playback and transcription.</span>
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
        {/* Phase 16: Host Mute Toast Notification */}
        {hostMuteToast && (
          <div className="rtc-host-mute-toast-banner">
            🔇 The meeting host requested that your microphone be muted.
          </div>
        )}

        {/* Phase 16: Floating Ephemeral Reactions Overlay */}
        <div className="rtc-floating-reactions-overlay">
          {activeReactions.map(r => (
            <div
              key={r.id}
              className="rtc-floating-reaction-badge"
              style={{ left: `${r.x}%` }}
            >
              <span className="rtc-rx-emoji">{r.emoji}</span>
              <span className="rtc-rx-user">{r.userName}</span>
            </div>
          ))}
        </div>

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
                handRaised={isHandRaised}
                recentReaction={participantReactions.get(user?.id || 'local-participant')}
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
                  handRaised={p.handRaised}
                  recentReaction={participantReactions.get(p.id)}
                  isHostViewer={meetingRole === 'HOST' || user?.role === 'admin'}
                  onHostMute={() => handleHostMute(p.id)}
                  onHostLowerHand={() => handleHostLowerHand(p.id)}
                  onHostRemove={() => handleHostRemove(p.id)}
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
                handRaised={isHandRaised}
                recentReaction={participantReactions.get(user?.id || 'local-participant')}
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
                  handRaised={p.handRaised}
                  recentReaction={participantReactions.get(p.id)}
                  isHostViewer={meetingRole === 'HOST' || user?.role === 'admin'}
                  onHostMute={() => handleHostMute(p.id)}
                  onHostLowerHand={() => handleHostLowerHand(p.id)}
                  onHostRemove={() => handleHostRemove(p.id)}
                />
              ))}
            </div>

            {/* Collaborative Monaco Code Editor */}
            <MeetingCodeEditor
              meetingId={meetingId || ''}
              meetingToken={sessionToken || activeSessionTokenRef.current}
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
            data-participant-count={allParticipantsCount}
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
              handRaised={isHandRaised}
              recentReaction={participantReactions.get(user?.id || 'local-participant')}
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
                handRaised={p.handRaised}
                recentReaction={participantReactions.get(p.id)}
                isHostViewer={meetingRole === 'HOST' || user?.role === 'admin'}
                onPinToggle={() =>
                  setPinnedParticipantId(prev => (prev === p.id ? null : p.id))
                }
                onHostMute={() => handleHostMute(p.id)}
                onHostLowerHand={() => handleHostLowerHand(p.id)}
                onHostRemove={() => handleHostRemove(p.id)}
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
                <div className="rtc-drawer-icons-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isHandRaised && <span className="rtc-drawer-hand" title="Hand Raised" style={{ fontSize: '16px' }}>✋</span>}
                  <span className="rtc-drawer-icons">
                    {localMedia.audioEnabled ? '🎙️' : '🔇'}
                    {localMedia.videoEnabled ? '📹' : '🚫'}
                  </span>
                </div>
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
                  <div className="rtc-drawer-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {p.handRaised && <span className="rtc-drawer-hand" title="Hand Raised" style={{ fontSize: '16px' }}>✋</span>}
                    <span className="rtc-drawer-icons">
                      {p.audioEnabled ? '🎙️' : '🔇'}
                      {p.videoEnabled ? '📹' : '🚫'}
                    </span>
                    {(meetingRole === 'HOST' || user?.role === 'admin') && (
                      <div className="rtc-drawer-host-quick-actions" style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="rtc-tile-host-menu-btn"
                          title="Request participant mute"
                          onClick={() => handleHostMute(p.id)}
                          style={{ width: '22px', height: '22px', fontSize: '11px' }}
                        >
                          🔇
                        </button>
                        {p.handRaised && (
                          <button
                            type="button"
                            className="rtc-tile-host-menu-btn"
                            title="Lower participant hand"
                            onClick={() => handleHostLowerHand(p.id)}
                            style={{ width: '22px', height: '22px', fontSize: '11px' }}
                          >
                            ✋
                          </button>
                        )}
                        <button
                          type="button"
                          className="rtc-tile-host-menu-btn"
                          title="Remove from meeting"
                          onClick={() => {
                            if (window.confirm(`Remove ${p.name} from meeting?`)) {
                              handleHostRemove(p.id);
                            }
                          }}
                          style={{ width: '22px', height: '22px', fontSize: '11px' }}
                        >
                          🚫
                        </button>
                      </div>
                    )}
                  </div>
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
            isHost={meetingRole === 'HOST' || user?.role === 'admin'}
            allowChat={allowChat}
            hasMoreOlderMessages={hasMoreOlderMessages}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
            onDeleteMessage={handleDeleteMessage}
            onToggleChat={handleToggleChat}
            onSendAnnouncement={handleSendAnnouncement}
            onLoadOlderMessages={handleLoadOlderMessages}
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
        handRaised={isHandRaised}
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
        onToggleHandRaise={handleToggleHandRaise}
        onSendReaction={handleSendReaction}
        isRecording={isRecording}
        onToggleRecording={meetingRole === 'HOST' || user?.role === 'admin' ? handleToggleRecording : undefined}
      />
    </div>
  );
};

export default MeetingRoom;
