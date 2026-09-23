/**
 * Request ID, Correlation ID & Trace Context Propagation Engine
 * Phase 11: Audit Logging + Observability + System Health
 *
 * Enforces:
 * - Deterministic correlation ID propagation across HTTP, WebSocket, Kafka, Outbox, and Notification boundaries
 * - Strict sanitization of client-provided IDs (alphanumeric, dashes, max 64 chars) to prevent log / header injection
 * - W3C Trace Context parsing & formatting (traceparent: 00-{traceId}-{spanId}-{flags})
 * - AsyncLocalStorage request context tracking
 */

import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { CorrelationContext, TraceContext } from './types.ts';

const correlationStorage = new AsyncLocalStorage<CorrelationContext>();

/**
 * Validates and sanitizes untrusted incoming client-provided IDs.
 * Accepts standard UUIDs or alphanumeric identifiers up to 64 chars.
 * Rejects invalid strings, control chars, and newlines.
 */
export function sanitizeTraceId(id?: string | null): string | null {
  if (!id || typeof id !== 'string') return null;
  const trimmed = id.trim();
  if (/^[a-zA-Z0-9_-]{8,64}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Parses standard W3C traceparent header: 00-{traceId}-{spanId}-{traceFlags}
 */
export function parseTraceparent(header?: string | null): TraceContext | null {
  if (!header || typeof header !== 'string') return null;
  const parts = header.trim().split('-');
  if (parts.length === 4 && parts[0] === '00') {
    const [_, traceId, spanId, traceFlags] = parts;
    if (/^[0-9a-f]{32}$/.test(traceId) && /^[0-9a-f]{16}$/.test(spanId)) {
      return { traceId, spanId, traceFlags };
    }
  }
  return null;
}

/**
 * Formats a TraceContext into a W3C traceparent header string.
 */
export function formatTraceparent(ctx: TraceContext): string {
  return `00-${ctx.traceId}-${ctx.spanId}-${ctx.traceFlags || '01'}`;
}

/**
 * Generates a standard random UUIDv4.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a 32-hex trace ID and 16-hex span ID for W3C distributed tracing.
 */
export function generateTraceContext(parentSpanId?: string): TraceContext {
  const traceId = crypto.randomBytes ? crypto.randomBytes(16).toString('hex') : Math.random().toString(16).substring(2, 34).padEnd(32, '0');
  const spanId = crypto.randomBytes ? crypto.randomBytes(8).toString('hex') : Math.random().toString(16).substring(2, 18).padEnd(16, '0');
  return {
    traceId,
    spanId,
    traceFlags: '01',
    parentSpanId,
  };
}

/**
 * Extracts correlation information from incoming HTTP request headers or query params,
 * generating new IDs when absent, and sanitizing untrusted inputs.
 */
export function extractCorrelationContext(req: any): CorrelationContext {
  const headers = req?.headers || {};

  // 1. Request ID (x-request-id)
  const incomingReqId = sanitizeTraceId(
    headers['x-request-id'] || headers['X-Request-Id'] || req?.query?.requestId
  );
  const requestId = incomingReqId || `req_${generateUUID()}`;

  // 2. Correlation ID (x-correlation-id)
  const incomingCorrId = sanitizeTraceId(
    headers['x-correlation-id'] || headers['X-Correlation-Id'] || headers['x-correlationid']
  );
  const correlationId = incomingCorrId || requestId;

  // 3. Causation ID (x-causation-id)
  const incomingCausationId = sanitizeTraceId(
    headers['x-causation-id'] || headers['X-Causation-Id']
  );

  // 4. W3C Traceparent
  const incomingTraceparent = headers['traceparent'] || headers['Traceparent'];
  let traceContext = parseTraceparent(incomingTraceparent);
  if (!traceContext) {
    traceContext = generateTraceContext();
  }

  return {
    requestId,
    correlationId,
    causationId: incomingCausationId || undefined,
    traceContext,
  };
}

/**
 * Injects correlation and tracing response headers into an outgoing HTTP response.
 */
export function injectCorrelationHeaders(res: any, context: CorrelationContext): void {
  if (!res || !context) return;
  try {
    if (typeof res.setHeader === 'function') {
      res.setHeader('X-Request-Id', context.requestId);
      res.setHeader('X-Correlation-Id', context.correlationId);
      if (context.traceContext) {
        res.setHeader('traceparent', formatTraceparent(context.traceContext));
      }
    }
  } catch {
    // Gracefully ignore header set failures (e.g. if already sent)
  }
}

/**
 * Runs an asynchronous function within a scoped correlation context.
 */
export function runWithCorrelation<T>(context: CorrelationContext, fn: () => T): T {
  return correlationStorage.run(context, fn);
}

/**
 * Returns the currently active correlation context from AsyncLocalStorage.
 */
export function getCurrentCorrelation(): CorrelationContext | undefined {
  return correlationStorage.getStore();
}
