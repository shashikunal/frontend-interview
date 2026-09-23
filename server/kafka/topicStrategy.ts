/**
 * Kafka Topic & Partition Strategy
 * Phase 9: Kafka + Event Architecture + Transactional Outbox
 *
 * Implements:
 * - Domain topic definitions with defined retention & ordering guarantees
 * - Partition key resolution ensuring ordering per aggregate
 * - Dead-letter topic routing
 */

import type { EventType, EventEnvelope } from './eventContracts.ts';

export const KAFKA_TOPICS = {
  MEETING_EVENTS: 'meeting.events',
  CHAT_EVENTS: 'chat.events',
  CONVERSATION_EVENTS: 'conversation.events',
  USER_EVENTS: 'user.events',
  NOTIFICATION_EVENTS: 'notification.events',
  RECORDING_EVENTS: 'recording.events',
  AUDIT_EVENTS: 'audit.events',
  ANALYTICS_EVENTS: 'analytics.events',
  DEAD_LETTER_EVENTS: 'dead-letter.events',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];

export interface TopicMetadata {
  name: string;
  description: string;
  partitionKeyDescription: string;
  retentionHours: number;
  orderingGuarantee: string;
}

export const TOPIC_REGISTRY: Record<KafkaTopic, TopicMetadata> = {
  [KAFKA_TOPICS.MEETING_EVENTS]: {
    name: KAFKA_TOPICS.MEETING_EVENTS,
    description: 'Meeting creation, lifecycle transitions, and participant presence changes',
    partitionKeyDescription: 'meetingId - guarantees strict ordered lifecycle progression per meeting',
    retentionHours: 168, // 7 days
    orderingGuarantee: 'Per-meeting ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.CHAT_EVENTS]: {
    name: KAFKA_TOPICS.CHAT_EVENTS,
    description: 'Chat messages sent, edited, deleted, and read',
    partitionKeyDescription: 'conversationId - guarantees causal ordering of messages per conversation',
    retentionHours: 168,
    orderingGuarantee: 'Per-conversation ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.CONVERSATION_EVENTS]: {
    name: KAFKA_TOPICS.CONVERSATION_EVENTS,
    description: 'Conversation creation, participant additions, and removals',
    partitionKeyDescription: 'conversationId',
    retentionHours: 168,
    orderingGuarantee: 'Per-conversation ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.USER_EVENTS]: {
    name: KAFKA_TOPICS.USER_EVENTS,
    description: 'User registration, profile updates, and authentication state events',
    partitionKeyDescription: 'userId',
    retentionHours: 168,
    orderingGuarantee: 'Per-user ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.NOTIFICATION_EVENTS]: {
    name: KAFKA_TOPICS.NOTIFICATION_EVENTS,
    description: 'Outbox-generated notification triggers for downstream Phase 10 delivery',
    partitionKeyDescription: 'recipientId or aggregateId',
    retentionHours: 72, // 3 days
    orderingGuarantee: 'Per-recipient ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.RECORDING_EVENTS]: {
    name: KAFKA_TOPICS.RECORDING_EVENTS,
    description: 'Meeting recording lifecycle, media finalization, and transcription jobs',
    partitionKeyDescription: 'meetingId',
    retentionHours: 168,
    orderingGuarantee: 'Per-meeting ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.AUDIT_EVENTS]: {
    name: KAFKA_TOPICS.AUDIT_EVENTS,
    description: 'Security, compliance, and governance audit records',
    partitionKeyDescription: 'aggregateId',
    retentionHours: 720, // 30 days
    orderingGuarantee: 'Per-aggregate ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.ANALYTICS_EVENTS]: {
    name: KAFKA_TOPICS.ANALYTICS_EVENTS,
    description: 'Aggregated product telemetry and engagement metrics',
    partitionKeyDescription: 'aggregateId',
    retentionHours: 168,
    orderingGuarantee: 'Per-aggregate ordering guaranteed within partition',
  },
  [KAFKA_TOPICS.DEAD_LETTER_EVENTS]: {
    name: KAFKA_TOPICS.DEAD_LETTER_EVENTS,
    description: 'Failed, exhausted, or poison messages for operational inspection',
    partitionKeyDescription: 'originalEventId',
    retentionHours: 720, // 30 days
    orderingGuarantee: 'None required (independent DLQ records)',
  },
};

/**
 * Resolves the target topic for a given domain event type
 */
export function resolveTopicForEvent(eventType: EventType | string): KafkaTopic {
  if (eventType.startsWith('Meeting') || eventType.startsWith('Participant')) {
    return KAFKA_TOPICS.MEETING_EVENTS;
  }
  if (eventType.startsWith('Message')) {
    return KAFKA_TOPICS.CHAT_EVENTS;
  }
  if (eventType.startsWith('Conversation')) {
    return KAFKA_TOPICS.CONVERSATION_EVENTS;
  }
  if (eventType.startsWith('User')) {
    return KAFKA_TOPICS.USER_EVENTS;
  }
  if (eventType.startsWith('Notification')) {
    return KAFKA_TOPICS.NOTIFICATION_EVENTS;
  }
  if (eventType.startsWith('Recording') || eventType.startsWith('Transcript')) {
    return KAFKA_TOPICS.RECORDING_EVENTS;
  }
  if (eventType.startsWith('Audit')) {
    return KAFKA_TOPICS.AUDIT_EVENTS;
  }
  if (eventType.startsWith('Analytics')) {
    return KAFKA_TOPICS.ANALYTICS_EVENTS;
  }
  if (eventType.startsWith('DeadLetter')) {
    return KAFKA_TOPICS.DEAD_LETTER_EVENTS;
  }

  // Fallback to audit
  return KAFKA_TOPICS.AUDIT_EVENTS;
}

/**
 * Resolves partition key for event envelope
 */
export function resolvePartitionKey(envelope: EventEnvelope): string {
  return envelope.partitionKey || envelope.aggregateId || 'default';
}
