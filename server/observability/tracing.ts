/**
 * OpenTelemetry-Compatible Distributed Tracing Engine
 * Phase 11: Audit Logging + Observability + System Health
 *
 * Implements:
 * - W3C Trace Context compliance (traceparent: 00-{traceId}-{spanId}-{flags})
 * - Span lifecycle: startSpan, setAttribute, setStatus, recordException, end
 * - Parent-child span hierarchy tracking
 * - High-resolution performance timer
 * - Safe fail-open error isolation: Tracing failures never crash application code
 */

import { generateTraceContext, formatTraceparent, parseTraceparent } from './correlation.ts';
import type { TraceContext } from './types.ts';

export type SpanStatusCode = 'UNSET' | 'OK' | 'ERROR';

export interface SpanData {
  name: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  startTimeMs: number;
  endTimeMs?: number;
  durationMs?: number;
  attributes: Record<string, string | number | boolean>;
  status: {
    code: SpanStatusCode;
    message?: string;
  };
  events: Array<{
    name: string;
    timestamp: number;
    attributes?: Record<string, any>;
  }>;
}

export class Span {
  public data: SpanData;
  private ended = false;

  constructor(name: string, traceCtx: TraceContext) {
    const now = Date.now();
    this.data = {
      name,
      traceId: traceCtx.traceId,
      spanId: traceCtx.spanId,
      parentSpanId: traceCtx.parentSpanId,
      startTimeMs: now,
      attributes: {},
      status: { code: 'UNSET' },
      events: [],
    };
  }

  public setAttribute(key: string, value: string | number | boolean): this {
    if (this.ended) return this;
    try {
      this.data.attributes[key] = value;
    } catch {
      // ignore
    }
    return this;
  }

  public setAttributes(attrs: Record<string, string | number | boolean>): this {
    if (this.ended) return this;
    for (const [k, v] of Object.entries(attrs)) {
      this.setAttribute(k, v);
    }
    return this;
  }

  public setStatus(code: SpanStatusCode, message?: string): this {
    if (this.ended) return this;
    this.data.status = { code, message };
    return this;
  }

  public recordException(err: Error | unknown): this {
    if (this.ended) return this;
    try {
      const e = err instanceof Error ? err : new Error(String(err));
      this.setStatus('ERROR', e.message);
      this.addEvent('exception', {
        'exception.type': e.name,
        'exception.message': e.message,
        'exception.stacktrace': e.stack,
      });
    } catch {
      // ignore
    }
    return this;
  }

  public addEvent(name: string, attributes?: Record<string, any>): this {
    if (this.ended) return this;
    this.data.events.push({
      name,
      timestamp: Date.now(),
      attributes,
    });
    return this;
  }

  public end(): void {
    if (this.ended) return;
    this.ended = true;
    this.data.endTimeMs = Date.now();
    this.data.durationMs = Math.max(0, this.data.endTimeMs - this.data.startTimeMs);
    tracer.recordCompletedSpan(this.data);
  }

  public getTraceContext(): TraceContext {
    return {
      traceId: this.data.traceId,
      spanId: this.data.spanId,
      traceFlags: '01',
      parentSpanId: this.data.parentSpanId,
    };
  }

  public getTraceparent(): string {
    return formatTraceparent(this.getTraceContext());
  }
}

export class Tracer {
  private completedSpans: SpanData[] = [];
  private readonly maxStoredSpans = 200;

  /**
   * Starts a new distributed span. If parentContext is supplied, inherits traceId.
   */
  public startSpan(name: string, parentContext?: TraceContext | string): Span {
    try {
      let parentCtx: TraceContext | null = null;
      if (typeof parentContext === 'string') {
        parentCtx = parseTraceparent(parentContext);
      } else if (parentContext && typeof parentContext === 'object') {
        parentCtx = parentContext;
      }

      let newContext: TraceContext;
      if (parentCtx) {
        newContext = generateTraceContext(parentCtx.spanId);
        newContext.traceId = parentCtx.traceId; // propagate same trace ID
      } else {
        newContext = generateTraceContext();
      }

      return new Span(name, newContext);
    } catch {
      // Failure isolation: return a safe fallback span
      return new Span(name, generateTraceContext());
    }
  }

  public recordCompletedSpan(spanData: SpanData): void {
    try {
      this.completedSpans.push(spanData);
      if (this.completedSpans.length > this.maxStoredSpans) {
        this.completedSpans.splice(0, this.completedSpans.length - this.maxStoredSpans);
      }
    } catch {
      // ignore
    }
  }

  public getCompletedSpans(): SpanData[] {
    return [...this.completedSpans];
  }

  public clearSpans(): void {
    this.completedSpans = [];
  }
}

export const tracer = new Tracer();
