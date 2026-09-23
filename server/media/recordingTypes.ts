/**
 * Recording & Transcription Domain Types
 * Phase 17: Recording, Transcription & Post-Meeting Media Pipeline
 */

export type RecordingStatus =
  | 'NOT_STARTED'
  | 'RECORDING'
  | 'STOPPING'
  | 'PROCESSING'
  | 'READY'
  | 'FAILED'
  | 'DELETED';

export type TranscriptStatus =
  | 'PROCESSING'
  | 'READY'
  | 'FAILED';

export interface MeetingRecordingRecord {
  id: string;
  meetingId: string;
  hostId: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  status: RecordingStatus;
  storageKey: string;
  storageProvider: string;
  fileSizeBytes: number;
  mimeType: string;
  thumbnailKey?: string;
  metadata: {
    resolution?: string;
    codec?: string;
    fps?: number;
    errorReason?: string;
    retryCount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptSegment {
  id: string;
  transcriptId: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  text: string;
  speakerId?: string;
  speakerName?: string;
  confidence: number;
}

export interface MeetingTranscriptRecord {
  id: string;
  recordingId: string;
  meetingId: string;
  language: string;
  status: TranscriptStatus;
  fullText: string;
  confidence: number;
  wordCount: number;
  segments: TranscriptSegment[];
  createdAt: string;
  updatedAt: string;
}

export interface StartRecordingRequest {
  meetingId: string;
  resolution?: string;
}

export interface StopRecordingRequest {
  recordingId: string;
  meetingId: string;
}

export interface RecordingAccessResponse {
  recordingId: string;
  meetingId: string;
  status: RecordingStatus;
  playbackUrl: string;
  expiresInSeconds: number;
  durationSeconds: number;
  fileSizeBytes: number;
  mimeType: string;
  hasTranscript: boolean;
}

export const VALID_RECORDING_TRANSITIONS: Record<RecordingStatus, RecordingStatus[]> = {
  NOT_STARTED: ['RECORDING'],
  RECORDING: ['STOPPING', 'FAILED'],
  STOPPING: ['PROCESSING', 'FAILED'],
  PROCESSING: ['READY', 'FAILED'],
  READY: ['DELETED'],
  FAILED: ['DELETED', 'PROCESSING'],
  DELETED: [], // Terminal
};
