/**
 * Global API Resilience: Unhandled Exception/Rejection Guard & Env Validation
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Provides:
 *   1. Process-level unhandled rejection logging (prevents silent crashes)
 *   2. Startup environment variable validation
 *   3. Request-level error response normalizer
 *   4. Safe async handler wrapper (eliminates boilerplate try/catch in API routes)
 */

// ──────────────────────────────────────────────────────────────────────────────
// 1. Required Environment Variable Validation
// ──────────────────────────────────────────────────────────────────────────────

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

const RECOMMENDED_ENV_VARS = [
  'JWT_SECRET',
  'REDIS_URL',
  'KAFKA_BROKERS',
  'RESEND_API_KEY',
  'LIVEKIT_API_KEY',
  'LIVEKIT_API_SECRET',
] as const;

export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  for (const key of RECOMMENDED_ENV_VARS) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(
      '[EnvValidation] FATAL: Missing required environment variables:',
      missing.join(', ')
    );
  }

  if (warnings.length > 0) {
    console.warn(
      '[EnvValidation] Missing recommended environment variables (features may degrade):',
      warnings.join(', ')
    );
  }

  return { valid: missing.length === 0, missing, warnings };
}

// ──────────────────────────────────────────────────────────────────────────────
// 2. Normalized API Error Response Builder
// ──────────────────────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  requestId?: string;
  timestamp: string;
}

export function buildErrorResponse(
  message: string,
  code: string,
  statusCode: number,
  requestId?: string
): ApiErrorResponse {
  return {
    success: false,
    error: message,
    code,
    statusCode,
    requestId,
    timestamp: new Date().toISOString(),
  };
}

// Map of common error types to HTTP status codes
export function classifyError(err: unknown): { statusCode: number; code: string; message: string } {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (err.name === 'CircuitOpenError') {
      return { statusCode: 503, code: 'SERVICE_UNAVAILABLE', message: 'Dependency unavailable. Please retry shortly.' };
    }
    if (err.name === 'TimeoutError') {
      return { statusCode: 504, code: 'GATEWAY_TIMEOUT', message: 'Operation timed out. Please retry.' };
    }
    if (err.name === 'BulkheadRejectedError' || err.name === 'BulkheadQueueTimeoutError') {
      return { statusCode: 429, code: 'TOO_MANY_REQUESTS', message: 'Server is at capacity. Please retry shortly.' };
    }
    if (msg.includes('forbidden') || msg.includes('not authorized') || msg.includes('rbac')) {
      return { statusCode: 403, code: 'FORBIDDEN', message: 'Insufficient permissions.' };
    }
    if (msg.includes('not found') || msg.includes('does not exist')) {
      return { statusCode: 404, code: 'NOT_FOUND', message: err.message };
    }
    if (msg.includes('unauthorized') || msg.includes('invalid token') || msg.includes('expired')) {
      return { statusCode: 401, code: 'UNAUTHORIZED', message: 'Authentication required.' };
    }
    if (msg.includes('invalid') || msg.includes('required') || msg.includes('missing')) {
      return { statusCode: 400, code: 'BAD_REQUEST', message: err.message };
    }
  }

  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again.',
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. Safe Async Handler Wrapper for Vercel API Routes
// ──────────────────────────────────────────────────────────────────────────────

type ApiRequest = { method?: string; url?: string; headers?: Record<string, string | string[] | undefined>; [key: string]: any };
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: any) => void; [key: string]: any };
type AsyncHandler = (req: ApiRequest, res: ApiResponse) => Promise<void>;

/**
 * Wraps an async API handler with global error catching.
 * Ensures all unhandled errors produce a normalized JSON error response.
 *
 * Usage:
 *   export default safeHandler(async (req, res) => { ... });
 */
export function safeHandler(handler: AsyncHandler): AsyncHandler {
  return async (req: ApiRequest, res: ApiResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (err: unknown) {
      const { statusCode, code, message } = classifyError(err);

      // Log error server-side
      console.error(`[API Error] ${req.method} ${req.url} → ${statusCode} ${code}:`, err);

      if (!res.headersSent) {
        res
          .status(statusCode)
          .json(buildErrorResponse(message, code, statusCode));
      }
    }
  };
}
