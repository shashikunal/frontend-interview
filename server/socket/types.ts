export type UserRole = 'candidate' | 'admin' | 'interviewer' | 'observer';

export type PresenceStatus = 'online' | 'idle' | 'reconnecting' | 'disconnected';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: UserRole;
  name: string;
}

export interface StudentCodeChangeEvent {
  sessionId: string;
  fileId: string;
  language: string;
  code: string;
  lineCount?: number;
  cursor?: {
    line: number;
    column: number;
  };
  version: number;
  timestamp: number;
}

export interface StudentTypingEvent {
  sessionId: string;
  isTyping: boolean;
  fileId?: string;
  timestamp: number;
}

export interface StudentCursorChangeEvent {
  sessionId: string;
  fileId: string;
  line: number;
  column: number;
  timestamp: number;
}

export interface StudentQuestionChangeEvent {
  sessionId: string;
  questionId: string;
  questionTitle?: string;
  track?: string;
  timestamp: number;
}

export interface StudentFileChangeEvent {
  sessionId: string;
  fileId: string;
  timestamp: number;
}

export interface StudentRunStartEvent {
  sessionId: string;
  questionId: string;
  language: string;
  timestamp: number;
}

export interface StudentRunResultEvent {
  sessionId: string;
  questionId: string;
  status: 'running' | 'success' | 'failed' | 'error';
  passed: number;
  total: number;
  runtimeMs?: number;
  output?: string;
  error?: string;
  timestamp: number;
}

export interface StudentActivityEvent {
  sessionId: string;
  type: string;
  message: string;
  timestamp: number;
}

export interface SessionStatePayload {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  questionId: string;
  questionTitle?: string;
  activeFile: string;
  language: string;
  code: string;
  cursor?: { line: number; column: number } | null;
  isTyping: boolean;
  presence: PresenceStatus;
  lastExecution?: {
    status: 'running' | 'success' | 'failed' | 'error';
    passed: number;
    total: number;
    runtimeMs?: number;
    output?: string;
    error?: string;
    timestamp: number;
  } | null;
  activityHistory: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: number;
  }>;
  codeVersion: number;
  startedAt: string;
  lastActivityAt: number;
}

export interface YjsUpdateEvent {
  sessionId: string;
  update: Uint8Array | number[];
  fileId?: string;
  timestamp?: number;
}

export interface YjsSyncRequestEvent {
  sessionId: string;
  stateVector?: Uint8Array | number[];
}

export interface YjsSyncResponseEvent {
  sessionId: string;
  docState: Uint8Array | number[];
}

export interface StudentKeystrokeEvent {
  sessionId: string;
  fileId?: string;
  code: string;
  cursor?: {
    line: number;
    column: number;
  } | null;
  timestamp: number;
}

export interface ClientToServerEvents {
  'session:join': (data: { sessionId: string; questionId?: string; questionTitle?: string; language?: string; initialCode?: string }, callback?: (ack: { success: boolean; state?: SessionStatePayload; docState?: Uint8Array | number[]; error?: string }) => void) => void;
  'session:leave': (data: { sessionId: string }) => void;
  'session:heartbeat': (data: { sessionId: string; status?: 'online' | 'idle' }) => void;
  'student:typing': (data: StudentTypingEvent) => void;
  'student:keystroke': (data: StudentKeystrokeEvent) => void;
  'student:code-change': (data: StudentCodeChangeEvent) => void;
  'student:file-change': (data: StudentFileChangeEvent) => void;
  'student:cursor-change': (data: StudentCursorChangeEvent) => void;
  'student:question-change': (data: StudentQuestionChangeEvent) => void;
  'student:run-start': (data: StudentRunStartEvent) => void;
  'student:run-result': (data: StudentRunResultEvent) => void;
  'student:activity': (data: StudentActivityEvent) => void;
  'monitor:subscribe': (data: { sessionId: string }, callback?: (ack: { success: boolean; state?: SessionStatePayload; docState?: Uint8Array | number[]; error?: string }) => void) => void;
  'monitor:unsubscribe': (data: { sessionId: string }) => void;
  'yjs:update': (data: YjsUpdateEvent) => void;
  'yjs:sync-request': (data: YjsSyncRequestEvent, callback?: (res: YjsSyncResponseEvent) => void) => void;

  // Phase 6: Meeting Chat Events
  'meeting:join': (data: { meetingId: string; meetingToken?: string }, callback?: (ack: { success: boolean; error?: string; allowChat?: boolean }) => void) => void;
  'meeting:leave': (data: { meetingId: string }) => void;
  'meeting:chat:send': (data: { meetingId: string; content: string; messageType?: string; codeLanguage?: string; replyToMessageId?: string; correlationId?: string }, callback?: (ack: { success: boolean; message?: any; error?: string; code?: string }) => void) => void;
  'meeting:chat:delete': (data: { meetingId: string; messageId: string }, callback?: (ack: { success: boolean; error?: string; code?: string }) => void) => void;
  'meeting:chat:reaction': (data: { meetingId: string; messageId: string; emoji: string }, callback?: (ack: { success: boolean; reactions?: Record<string, string[]>; error?: string }) => void) => void;
  'meeting:chat:toggle': (data: { meetingId: string; allowChat: boolean }, callback?: (ack: { success: boolean; allowChat?: boolean; error?: string }) => void) => void;
  'meeting:chat:announce': (data: { meetingId: string; content: string; correlationId?: string }, callback?: (ack: { success: boolean; message?: any; error?: string }) => void) => void;
  'meeting:chat:sync': (data: { meetingId: string; sinceTimestamp?: string }, callback?: (res: { success: boolean; messages: any[] }) => void) => void;

  // Phase 7: Application Chat Events (DM + Group + Presence + Typing + Read Receipts)
  'app:chat:subscribe': (data: { conversationIds?: string[] }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'app:chat:join': (data: { conversationId: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'app:chat:leave': (data: { conversationId: string }) => void;
  'app:chat:message:send': (data: { conversationId: string; content: string; clientMessageId?: string; metadata?: any }, callback?: (ack: { success: boolean; message?: any; error?: string; code?: string }) => void) => void;
  'app:chat:message:delete': (data: { conversationId: string; messageId: string }, callback?: (ack: { success: boolean; error?: string; code?: string }) => void) => void;
  'app:chat:message:read': (data: { conversationId: string; messageId?: string }, callback?: (ack: { success: boolean; lastReadMessageId?: string; lastReadAt?: string; error?: string }) => void) => void;
  'app:chat:typing:start': (data: { conversationId: string }) => void;
  'app:chat:typing:stop': (data: { conversationId: string }) => void;
  'app:chat:presence:subscribe': (data: { userIds: string[] }, callback?: (ack: { success: boolean; presences: Record<string, any> }) => void) => void;

  // Phase 16: Advanced Meeting Collaboration Events
  'meeting:participant:state': (data: { meetingId: string; micState?: boolean; cameraState?: boolean; screenShareState?: boolean; connectionState?: any; connectionQuality?: any }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:hand:raise': (data: { meetingId: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:hand:lower': (data: { meetingId: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:hand:host-lower': (data: { meetingId: string; targetUserId: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:reaction': (data: { meetingId: string; emoji: string; correlationId?: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:host:mute-participant': (data: { meetingId: string; targetUserId: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:host:remove-participant': (data: { meetingId: string; targetUserId: string; reason?: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:host:end-meeting': (data: { meetingId: string; reason?: string }, callback?: (ack: { success: boolean; error?: string }) => void) => void;
  'meeting:sync-state': (data: { meetingId: string }, callback?: (ack: { success: boolean; participants: any[]; error?: string }) => void) => void;

  // WebRTC Peer-to-Peer Signaling Events
  'meeting:webrtc:offer': (data: { meetingId: string; targetSocketId?: string; targetUserId?: string; offer: any; streamType?: string }) => void;
  'meeting:webrtc:answer': (data: { meetingId: string; targetSocketId?: string; targetUserId?: string; answer: any; streamType?: string }) => void;
  'meeting:webrtc:ice-candidate': (data: { meetingId: string; targetSocketId?: string; targetUserId?: string; candidate: any; streamType?: string }) => void;
  'meeting:webrtc:renegotiate': (data: { meetingId: string; streamType?: string }) => void;
}

export interface ServerToClientEvents {
  'session:state': (state: SessionStatePayload) => void;
  'student:typing': (data: StudentTypingEvent) => void;
  'student:keystroke': (data: StudentKeystrokeEvent) => void;
  'student:code-change': (data: StudentCodeChangeEvent) => void;
  'student:file-change': (data: StudentFileChangeEvent) => void;
  'student:cursor-change': (data: StudentCursorChangeEvent) => void;
  'student:question-change': (data: StudentQuestionChangeEvent) => void;
  'student:run-start': (data: StudentRunStartEvent) => void;
  'student:run-result': (data: StudentRunResultEvent) => void;
  'student:status': (data: { sessionId: string; presence: PresenceStatus; timestamp: number }) => void;
  'student:activity': (data: StudentActivityEvent) => void;
  'monitor:ack': (data: { sessionId: string; connectedAt: number }) => void;
  'yjs:update': (data: YjsUpdateEvent) => void;
  'yjs:sync-response': (data: YjsSyncResponseEvent) => void;
  'error': (data: { message: string; code?: string }) => void;

  // Phase 6: Meeting Chat Broadcasts
  'meeting:chat:message': (message: any) => void;
  'meeting:chat:deleted': (data: { meetingId: string; messageId: string; deletedBy: string }) => void;
  'meeting:chat:reaction': (data: { meetingId: string; messageId: string; reactions: Record<string, string[]> }) => void;
  'meeting:chat:system': (message: any) => void;
  'meeting:chat:announcement': (message: any) => void;
  'meeting:chat:status': (data: { meetingId: string; allowChat: boolean; updatedBy: string }) => void;
  'meeting:chat:error': (data: { code: string; message: string; correlationId?: string }) => void;

  // Phase 7: Application Chat Broadcasts
  'app:chat:message:created': (message: any) => void;
  'app:chat:message:deleted': (data: { conversationId: string; messageId: string; deletedBy: string }) => void;
  'app:chat:message:read': (data: { conversationId: string; userId: string; lastReadMessageId: string; lastReadAt: string }) => void;
  'app:chat:typing:update': (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => void;
  'app:chat:presence:update': (data: { userId: string; status: 'ONLINE' | 'OFFLINE'; lastSeen?: string }) => void;
  'app:chat:conversation:updated': (conversation: any) => void;
  'app:chat:member:updated': (data: { conversationId: string; participant: any; action: 'ADDED' | 'REMOVED' | 'LEFT' }) => void;
  'app:chat:error': (data: { code: string; message: string; correlationId?: string }) => void;

  // Phase 16: Meeting Collaboration Broadcasts
  'meeting:participant:joined': (participant: any) => void;
  'meeting:participant:left': (data: { meetingId: string; userId: string; socketId: string }) => void;
  'meeting:participant:updated': (participant: any) => void;
  'meeting:hand:raised': (data: { meetingId: string; userId: string; handRaisedAt: string }) => void;
  'meeting:hand:lowered': (data: { meetingId: string; userId: string }) => void;
  'meeting:reaction:broadcast': (reaction: { meetingId: string; reactionId: string; userId: string; userName: string; emoji: string; timestamp: number }) => void;
  'meeting:host:mute-requested': (data: { meetingId: string; targetUserId: string; requestedBy: string }) => void;
  'meeting:participant:removed': (data: { meetingId: string; targetUserId: string; reason?: string }) => void;
  'meeting:ended': (data: { meetingId: string; reason?: string }) => void;
  'meeting:state:synced': (data: { meetingId: string; participants: any[] }) => void;

  // WebRTC Peer-to-Peer Signaling Broadcasts
  'meeting:webrtc:offer': (data: { meetingId: string; senderSocketId: string; senderUserId: string; senderName?: string; offer: any; streamType?: string }) => void;
  'meeting:webrtc:answer': (data: { meetingId: string; senderSocketId: string; senderUserId: string; senderName?: string; answer: any; streamType?: string }) => void;
  'meeting:webrtc:ice-candidate': (data: { meetingId: string; senderSocketId: string; senderUserId: string; candidate: any; streamType?: string }) => void;
  'meeting:webrtc:renegotiate': (data: { meetingId: string; senderSocketId: string; senderUserId: string; streamType?: string }) => void;
}

export interface SocketData {
  user: AuthenticatedUser;
  sessionId?: string;
  meetingId?: string;
  role: UserRole;
  subscribedSessions: Set<string>;
  subscribedMeetings: Set<string>;
  subscribedConversations?: Set<string>;
}
