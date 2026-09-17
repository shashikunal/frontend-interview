/**
 * Meeting Domain Models & Lifecycle Types
 * Phase 2: Real-Time Collaboration Control Plane
 */

export type MeetingStatus =
  | 'SCHEDULED'
  | 'STARTED'
  | 'ACTIVE'
  | 'ENDED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type MeetingType = 'COLLABORATIVE' | 'INTERVIEW' | 'BROADCAST' | 'PEER';

export interface MeetingSettings {
  allowScreenShare: boolean;
  allowChat: boolean;
  muteOnEntry: boolean;
  waitingRoom: boolean;
  maxParticipants: number;
  e2eeEnabled: boolean;
  recordingEnabled: boolean;
}

export const DEFAULT_MEETING_SETTINGS: MeetingSettings = {
  allowScreenShare: true,
  allowChat: true,
  muteOnEntry: false,
  waitingRoom: true,
  maxParticipants: 25,
  e2eeEnabled: false,
  recordingEnabled: false,
};

export interface MeetingRecord {
  id: string;
  title: string;
  description?: string;
  hostId: string;
  hostEmail: string;
  hostName: string;
  meetingType: MeetingType;
  status: MeetingStatus;
  scheduledStartTime: string; // ISO 8601
  scheduledEndTime?: string; // ISO 8601
  actualStartTime?: string; // ISO 8601
  actualEndTime?: string; // ISO 8601
  settings: MeetingSettings;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  meetingType?: MeetingType;
  scheduledStartTime?: string; // If omitted, defaults to immediate start
  scheduledEndTime?: string;
  settings?: Partial<MeetingSettings>;
}

export interface UpdateLifecycleRequest {
  targetStatus: MeetingStatus;
  reason?: string;
}

export interface MeetingOutboxEvent {
  id: string;
  meetingId: string;
  eventType:
    | 'MeetingCreated'
    | 'MeetingScheduled'
    | 'MeetingStarted'
    | 'MeetingActivated'
    | 'MeetingEnded'
    | 'MeetingCancelled'
    | 'MeetingArchived';
  payload: Record<string, any>;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  createdAt: string;
}
