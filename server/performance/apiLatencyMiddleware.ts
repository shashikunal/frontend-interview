/**
 * API Latency Middleware
 * Phase 15: Performance, Scalability & Load Testing
 *
 * Records per-route request latency (p50/p95/p99) into the existing Phase 11
 * Prometheus histogram. Integrates with httpRequestDurationMs — no new metrics
 * infrastructure needed.
 *
 * Usage (in any Vercel API handler):
 *   import { withLatencyTracking } from '../../server/performance/apiLatencyMiddleware.ts';
 *   export default withLatencyTracking('/api/v1/meetings', handler);
 */

import {
  httpRequestDurationMs,
  httpRequestsTotal,
} from '../observability/metrics.ts';

export interface LatencyWindow {
  route: string;
  method: string;
  samples: number[];
  maxSamples: number;
}

/** In-memory sliding window for per-route percentile computation */
const latencyWindows = new Map<string, LatencyWindow>();
const WINDOW_SIZE = 500; // keep last 500 samples per route

function getWindow(route: string, method: string): LatencyWindow {
  const key = `${method}:${route}`;
  let win = latencyWindows.get(key);
  if (!win) {
    win = { route, method, samples: [], maxSamples: WINDOW_SIZE };
    latencyWindows.set(key, win);
  }
  return win;
}

function recordSample(route: string, method: string, latencyMs: number): void {
  const win = getWindow(route, method);
  win.samples.push(latencyMs);
  if (win.samples.length > win.maxSamples) {
    win.samples.shift(); // evict oldest
  }
}

function computePercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.min(idx, sorted.length - 1)];
}

export interface RoutePercentiles {
  route: string;
  method: string;
  sampleCount: number;
  p50: number;
  p75: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
}

/**
 * Returns computed percentiles for all routes with latency samples.
 * Called by /api/v1/performance endpoint.
 */
export function getAllRoutePercentiles(): RoutePercentiles[] {
  const result: RoutePercentiles[] = [];
  for (const [, win] of latencyWindows.entries()) {
    if (win.samples.length === 0) continue;
    const sorted = [...win.samples].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    result.push({
      route: win.route,
      method: win.method,
      sampleCount: sorted.length,
      p50: computePercentile(sorted, 50),
      p75: computePercentile(sorted, 75),
      p95: computePercentile(sorted, 95),
      p99: computePercentile(sorted, 99),
      avg: Math.round(sum / sorted.length),
      min: sorted[0],
      max: sorted[sorted.length - 1],
    });
  }
  return result.sort((a, b) => b.p95 - a.p95); // highest p95 first
}

/**
 * HOF: wraps a Vercel API handler with latency instrumentation.
 *
 * @param route  Normalized route label (e.g. '/api/v1/meetings')
 * @param handler  The original async handler
 */
export function withLatencyTracking(
  route: string,
  handler: (req: any, res: any) => Promise<void>
): (req: any, res: any) => Promise<void> {
  return async (req: any, res: any): Promise<void> => {
    const startMs = Date.now();
    const method = (req.method || 'GET').toUpperCase();

    try {
      await handler(req, res);
    } finally {
      const latencyMs = Date.now() - startMs;
      const status = String(res.statusCode || 200);

      // Record into Prometheus histogram (Phase 11)
      httpRequestDurationMs.observe(
        { method, route, status },
        latencyMs
      );
      httpRequestsTotal.inc({ method, route, status });

      // Record into sliding window for percentile API
      recordSample(route, method, latencyMs);
    }
  };
}

/**
 * Inline timer — use when you can't wrap the handler (e.g. middleware-level).
 *
 * const stop = startLatencyTimer('/api/v1/auth', 'POST');
 * // ... do work ...
 * stop(res.statusCode);
 */
export function startLatencyTimer(
  route: string,
  method: string
): (statusCode?: number) => void {
  const startMs = Date.now();
  return (statusCode = 200) => {
    const latencyMs = Date.now() - startMs;
    const status = String(statusCode);
    httpRequestDurationMs.observe({ method, route, status }, latencyMs);
    httpRequestsTotal.inc({ method, route, status });
    recordSample(route, method, latencyMs);
  };
}
