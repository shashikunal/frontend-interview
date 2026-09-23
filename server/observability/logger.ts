/**
 * Production Structured JSON Logger with Sensitive Data Redaction
 * Phase 11: Audit Logging + Observability + System Health
 *
 * Features:
 * - Structured JSON logging format with correlation context injection
 * - Dynamic log level gating (DEBUG, INFO, WARN, ERROR)
 * - Automated recursive redaction of sensitive credentials (passwords, tokens, keys)
 * - Safe fail-open error handling (never crashes user requests)
 */

import type { LogLevel, StructuredLogEntry } from './types.ts';
import { getCurrentCorrelation } from './correlation.ts';

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
};

// Patterns for sensitive fields that must be masked
const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /authorization/i,
  /bearer/i,
  /cookie/i,
  /api[_-]?key/i,
  /credential/i,
  /private[_-]?key/i,
  /ssn/i,
  /credit[_-]?card/i,
];

const REDACTED_PLACEHOLDER = '[REDACTED]';

/**
 * Recursively sanitizes an object, masking sensitive keys and trimming large payloads
 */
export function sanitizeLogData(data: any, depth = 0): any {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (depth > 6) return '[MAX_DEPTH_REACHED]';

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item, depth + 1));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    const isSensitive = SENSITIVE_KEY_PATTERNS.some((pat) => pat.test(key));
    if (isSensitive) {
      sanitized[key] = REDACTED_PLACEHOLDER;
    } else if (typeof val === 'string' && val.length > 2000) {
      sanitized[key] = `${val.substring(0, 500)}... [TRUNCATED ${val.length} CHARS]`;
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeLogData(val, depth + 1);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

export class StructuredLogger {
  private serviceName: string;
  private minLevel: LogLevel;
  private defaultContext: Record<string, any>;

  constructor(serviceName = 'interviewprep-app', minLevel?: LogLevel, defaultContext: Record<string, any> = {}) {
    this.serviceName = serviceName;
    const envLevel = (process.env.LOG_LEVEL || '').toUpperCase() as LogLevel;
    this.minLevel = minLevel || (LOG_LEVELS[envLevel] ? envLevel : process.env.NODE_ENV === 'production' ? 'INFO' : 'DEBUG');
    this.defaultContext = defaultContext;
  }

  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public getLevel(): LogLevel {
    return this.minLevel;
  }

  public withContext(context: Record<string, any>): StructuredLogger {
    return new StructuredLogger(this.serviceName, this.minLevel, {
      ...this.defaultContext,
      ...context,
    });
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private output(entry: StructuredLogEntry): void {
    try {
      const jsonString = JSON.stringify(entry);
      if (entry.level === 'ERROR') {
        process.stderr.write(jsonString + '\n');
      } else {
        process.stdout.write(jsonString + '\n');
      }
    } catch {
      // Fallback console logging in case of serialization issues
      console.log(`[${entry.level}] ${entry.message}`);
    }
  }

  private buildEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ): StructuredLogEntry {
    const activeCorrelation = getCurrentCorrelation();
    const sanitizedMeta = metadata ? sanitizeLogData(metadata) : undefined;

    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      environment: process.env.NODE_ENV || 'development',
      message,
      requestId: activeCorrelation?.requestId,
      correlationId: activeCorrelation?.correlationId,
      causationId: activeCorrelation?.causationId,
      userId: activeCorrelation?.userId || sanitizedMeta?.userId,
      operation: sanitizedMeta?.operation,
      durationMs: sanitizedMeta?.durationMs,
      status: sanitizedMeta?.status,
      errorCode: sanitizedMeta?.errorCode,
      errorCategory: sanitizedMeta?.errorCategory,
      metadata: {
        ...this.defaultContext,
        ...sanitizedMeta,
      },
    };
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog('DEBUG')) return;
    this.output(this.buildEntry('DEBUG', message, metadata));
  }

  public info(message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog('INFO')) return;
    this.output(this.buildEntry('INFO', message, metadata));
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    if (!this.shouldLog('WARN')) return;
    this.output(this.buildEntry('WARN', message, metadata));
  }

  public error(message: string, errorOrMeta?: Error | Record<string, any>, extraMeta?: Record<string, any>): void {
    if (!this.shouldLog('ERROR')) return;

    let meta: Record<string, any> = extraMeta || {};
    if (errorOrMeta instanceof Error) {
      meta = {
        ...meta,
        errorName: errorOrMeta.name,
        errorMessage: errorOrMeta.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : errorOrMeta.stack,
      };
    } else if (typeof errorOrMeta === 'object' && errorOrMeta !== null) {
      meta = { ...errorOrMeta, ...meta };
    }

    this.output(this.buildEntry('ERROR', message, meta));
  }
}

export const logger = new StructuredLogger();
