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

export interface ClientToServerEvents {
  'session:join': (data: { sessionId: string; questionId?: string; questionTitle?: string; language?: string; initialCode?: string }, callback?: (ack: { success: boolean; state?: SessionStatePayload; error?: string }) => void) => void;
  'session:leave': (data: { sessionId: string }) => void;
  'session:heartbeat': (data: { sessionId: string; status?: 'online' | 'idle' }) => void;
  'student:typing': (data: StudentTypingEvent) => void;
  'student:code-change': (data: StudentCodeChangeEvent) => void;
  'student:file-change': (data: StudentFileChangeEvent) => void;
  'student:cursor-change': (data: StudentCursorChangeEvent) => void;
  'student:question-change': (data: StudentQuestionChangeEvent) => void;
  'student:run-start': (data: StudentRunStartEvent) => void;
  'student:run-result': (data: StudentRunResultEvent) => void;
  'student:activity': (data: StudentActivityEvent) => void;
  'monitor:subscribe': (data: { sessionId: string }, callback?: (ack: { success: boolean; state?: SessionStatePayload; error?: string }) => void) => void;
  'monitor:unsubscribe': (data: { sessionId: string }) => void;
}

export interface ServerToClientEvents {
  'session:state': (state: SessionStatePayload) => void;
  'student:typing': (data: StudentTypingEvent) => void;
  'student:code-change': (data: StudentCodeChangeEvent) => void;
  'student:file-change': (data: StudentFileChangeEvent) => void;
  'student:cursor-change': (data: StudentCursorChangeEvent) => void;
  'student:question-change': (data: StudentQuestionChangeEvent) => void;
  'student:run-start': (data: StudentRunStartEvent) => void;
  'student:run-result': (data: StudentRunResultEvent) => void;
  'student:status': (data: { sessionId: string; presence: PresenceStatus; timestamp: number }) => void;
  'student:activity': (data: StudentActivityEvent) => void;
  'monitor:ack': (data: { sessionId: string; connectedAt: number }) => void;
  'error': (data: { message: string; code?: string }) => void;
}

export interface SocketData {
  user: AuthenticatedUser;
  sessionId?: string;
  role: UserRole;
  subscribedSessions: Set<string>;
}
