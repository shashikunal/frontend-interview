/**
 * Domain Event Contracts & Standard Event Envelope
 * Phase 9: Kafka + Event Architecture + Transactional Outbox
 *
 * Implements:
 * - Standardized event envelope (eventId, eventType, version, aggregateType, aggregateId, correlationId, causationId, partitionKey)
 * - Versioned schema naming convention (Action.v1)
 * - Payload security: Excludes passwords, tokens, and raw credentials
 * - Strongly-typed domain event payloads across Meeting, Chat, Conversation, User, Notification, Audit, and Analytics
 */

import crypto from 'node:crypto';

export type AggregateType =
  | 'MEETING'
  | 'CHAT'
  | 'CONVERSATION'
  | 'USER'
  | 'NOTIFICATION'
  | 'AUDIT'
  | 'ANALYTICS';

export type EventType =
  // Meeting events
  | 'MeetingCreated.v1'
  | 'MeetingScheduled.v1'
  | 'MeetingStarted.v1'
  | 'MeetingEnded.v1'
  | 'MeetingCancelled.v1'
  | 'ParticipantInvited.v1'
  | 'ParticipantJoined.v1'
  | 'ParticipantLeft.v1'
  // Chat events
  | 'MessageSent.v1'
  | 'MessageDeleted.v1'
  | 'MessageRead.v1'
  // Conversation events
  | 'ConversationCreated.v1'
  | 'ConversationUpdated.v1'
  | 'ParticipantAdded.v1'
  | 'ParticipantRemoved.v1'
  | 'ParticipantLeftConv.v1'
  // User events
  | 'UserCreated.v1'
  | 'UserUpdated.v1'
  | 'UserStatusChanged.v1'
  // Notification events
  | 'NotificationRequested.v1'
  // Recording events
  | 'RecordingStarted.v1'
  | 'RecordingStopped.v1'
  | 'RecordingCompleted.v1'
  | 'RecordingProcessingStarted.v1'
  | 'RecordingProcessingCompleted.v1'
  | 'RecordingProcessingFailed.v1'
  | 'RecordingDeleted.v1'
  | 'TranscriptCompleted.v1'
  // Audit & Analytics events
  | 'AuditEventCreated.v1'
  | 'AnalyticsEventCreated.v1'
  // Meeting Ops canonical events
  | 'meeting.created'
  | 'meeting.updated'
  | 'meeting.cancelled'
  | 'meeting.participant.added'
  | 'meeting.participant.removed'
  | 'meeting.reminder.scheduled'
  | 'meeting.reminder.triggered'
  | 'notification.requested'
  | 'notification.sent'
  | 'notification.failed'
  | 'calendar.sync.requested'
  | 'calendar.sync.completed'
  | 'calendar.sync.failed'
  // Dead letter queue
  | 'DeadLetterEvent.v1';

export interface MeetingOpsCanonicalEvent<T = any> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  producer: string;
  correlationId: string;
  meetingId: string;
  userId: string;
  payload: T;
}

export interface EventEnvelope<T = any> {
  eventId: string;
  eventType: EventType | string;
  eventVersion: string;
  aggregateType: AggregateType | string;
  aggregateId: string;
  occurredAt: string;
  producer: string;
  correlationId: string;
  causationId?: string;
  partitionKey: string;
  payload: T;
}

// ──────────────────────────────────────────────────────────────────────────
// TYPED EVENT PAYLOADS
// ──────────────────────────────────────────────────────────────────────────

export interface MeetingCreatedPayload {
  meetingId: string;
  title: string;
  hostId: string;
  hostEmail: string;
  scheduledStartTime?: string;
  isInstant: boolean;
  settings: {
    allowChat: boolean;
    allowScreenShare: boolean;
    allowWhiteboard: boolean;
    allowEditor: boolean;
  };
}

export interface MeetingLifecyclePayload {
  meetingId: string;
  fromStatus: string;
  toStatus: string;
  updatedBy: string;
  timestamp: string;
}

export interface ParticipantInvitedPayload {
  invitationId: string;
  meetingId: string;
  email: string;
  role: string;
  invitedBy: string;
  expiresAt: string;
}

export interface ParticipantJoinedPayload {
  meetingId: string;
  userId: string;
  userName: string;
  role: string;
  joinedAt: string;
}

export interface MessageSentPayload {
  messageId: string;
  conversationId: string;
  senderId: string;
  clientMessageId?: string;
  contentLength: number;
  hasCodeSnippet: boolean;
  hasAttachment: boolean;
}

export interface MessageDeletedPayload {
  messageId: string;
  conversationId: string;
  deletedBy: string;
  timestamp: string;
}

export interface ConversationCreatedPayload {
  conversationId: string;
  type: 'DIRECT' | 'GROUP';
  name?: string;
  creatorId: string;
  participantIds: string[];
}

export interface NotificationRequestedPayload {
  notificationId: string;
  recipientId: string;
  recipientEmail?: string;
  channel: 'EMAIL' | 'IN_APP' | 'PUSH';
  template: string;
  data: Record<string, any>;
}

export interface AuditEventPayload {
  auditId: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsEventPayload {
  analyticsId: string;
  eventName: string;
  userId?: string;
  meetingId?: string;
  durationSeconds?: number;
  properties: Record<string, any>;
}

export interface DeadLetterPayload {
  originalEventId: string;
  originalTopic: string;
  originalEventType: string;
  partition?: number;
  offset?: string;
  error: string;
  retryCount: number;
  failedAt: string;
  rawPayload: any;
}

// ──────────────────────────────────────────────────────────────────────────
// ENVELOPE FACTORY HELPER
// ──────────────────────────────────────────────────────────────────────────

export function createEventEnvelope<T>(
  eventType: EventType | string,
  aggregateType: AggregateType | string,
  aggregateId: string,
  partitionKey: string,
  payload: T,
  options?: {
    correlationId?: string;
    causationId?: string;
    producer?: string;
    eventVersion?: string;
  }
): EventEnvelope<T> {
  return {
    eventId: `evt_${crypto.randomUUID()}`,
    eventType,
    eventVersion: options?.eventVersion || '1.0',
    aggregateType,
    aggregateId,
    occurredAt: new Date().toISOString(),
    producer: options?.producer || 'frontend-interview-backend',
    correlationId: options?.correlationId || `corr_${crypto.randomUUID()}`,
    causationId: options?.causationId,
    partitionKey,
    payload,
  };
}

export function createMeetingOpsEvent<T>(
  eventType: string,
  meetingId: string,
  userId: string,
  payload: T,
  options?: {
    correlationId?: string;
    producer?: string;
    eventVersion?: number;
  }
): MeetingOpsCanonicalEvent<T> {
  return {
    eventId: crypto.randomUUID(),
    eventType,
    eventVersion: options?.eventVersion || 1,
    occurredAt: new Date().toISOString(),
    producer: options?.producer || 'meeting-service',
    correlationId: options?.correlationId || crypto.randomUUID(),
    meetingId,
    userId,
    payload,
  };
}
