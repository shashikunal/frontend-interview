/**
 * Production Observability, Audit Logging & Health Types
 * Phase 11: Audit Logging + Observability + System Health
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export type ErrorCategory =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'DEPENDENCY_FAILURE'
  | 'INTERNAL_ERROR';

export interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
  parentSpanId?: string;
}

export interface CorrelationContext {
  requestId: string;
  correlationId: string;
  causationId?: string;
  userId?: string;
  traceContext?: TraceContext;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  message: string;
  requestId?: string;
  correlationId?: string;
  causationId?: string;
  userId?: string;
  eventId?: string;
  operation?: string;
  durationMs?: number;
  status?: string | number;
  errorCode?: string;
  errorCategory?: ErrorCategory;
  metadata?: Record<string, any>;
}

export type AuditAction =
  // Authentication & Session
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'AUTH_TOKEN_REVOKED'
  | 'AUTH_REFRESH_SUCCESS'
  | 'AUTH_REFRESH_FAILURE'
  // Admin & Operations
  | 'MEETING_CREATED'
  | 'MEETING_SCHEDULED'
  | 'MEETING_STARTED'
  | 'MEETING_ENDED'
  | 'MEETING_CANCELLED'
  | 'INVITATION_SENT'
  | 'INVITATION_REVOKED'
  // Meeting Runtime
  | 'PARTICIPANT_JOINED'
  | 'PARTICIPANT_LEFT'
  | 'MEETING_SETTING_CHANGED'
  // Media & Recording (Phase 17)
  | 'RECORDING_STARTED'
  | 'RECORDING_STOPPED'
  | 'RECORDING_ACCESSED'
  | 'RECORDING_DELETED'
  | 'TRANSCRIPT_ACCESSED'
  | 'TRANSCRIPT_DELETED'
  // Chat & Collaboration
  | 'CHAT_MESSAGE_SENT'
  | 'CHAT_MESSAGE_DELETED'
  | 'CONVERSATION_CREATED'
  | 'CONVERSATION_MEMBERSHIP_CHANGED'
  // Security & RBAC
  | 'RBAC_ROLE_ASSIGNED'
  | 'RBAC_ENTITLEMENT_MODIFIED'
  | 'SECURITY_AUTHORIZATION_FAILED'
  | 'RATE_LIMIT_ABUSE'
  | 'FEATURE_ACCESS_REQUESTED';

export type AuditResult = 'SUCCESS' | 'FAILURE' | 'DENIED';

export interface AuditLogRecord {
  id: string;
  actorUserId?: string;
  actorEmail?: string;
  action: AuditAction | string;
  resourceType: string;
  resourceId?: string;
  timestamp: string;
  result: AuditResult;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  eventId?: string;
  causationId?: string;
  metadata?: Record<string, any>;
}

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export interface DependencyHealth {
  name: string;
  status: HealthStatus;
  mode?: string;
  latencyMs: number;
  lastChecked: string;
  critical: boolean;
  message?: string;
  details?: Record<string, any>;
}

export interface SystemHealthSummary {
  timestamp: string;
  status: HealthStatus;
  version: string;
  environment: string;
  uptimeSeconds: number;
  process: {
    pid: number;
    nodeVersion: string;
    memoryRssMb: number;
    memoryHeapUsedMb: number;
  };
  dependencies: {
    database: DependencyHealth;
    redis: DependencyHealth;
    kafka: DependencyHealth;
    websocket: DependencyHealth;
    notifications: DependencyHealth;
    sfu: DependencyHealth;
  };
}

export interface MetricDefinition {
  name: string;
  help: string;
  type: 'counter' | 'gauge' | 'histogram';
  labelNames?: string[];
  buckets?: number[];
}

export interface MetricSample {
  name: string;
  labels: Record<string, string>;
  value: number;
  timestamp?: number;
}

export interface AlertRule {
  id: string;
  name: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  condition: string;
  threshold: number;
  active: boolean;
  currentValue?: number;
  triggeredAt?: string;
}
