/**
 * Production Security Headers & CORS Enforcement
 * Phase 13: Production Security Hardening & Threat Protection
 */

const TRUSTED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);

if (process.env.APP_URL) {
  try {
    const parsed = new URL(process.env.APP_URL);
    TRUSTED_ORIGINS.add(parsed.origin);
  } catch (_) {}
}

if (process.env.ADDITIONAL_TRUSTED_ORIGINS) {
  process.env.ADDITIONAL_TRUSTED_ORIGINS.split(',').forEach((o) => {
    const trimmed = o.trim();
    if (trimmed) TRUSTED_ORIGINS.add(trimmed);
  });
}

/**
 * Validates incoming origin against trusted origins.
 * In development, permits localhost origins.
 * In production, permits configured origins and all Vercel deployment domains (*.vercel.app).
 */
export function isOriginAllowed(origin?: string, reqHost?: string): boolean {
  if (!origin) return true; // Direct same-origin / server-to-server requests
  if (TRUSTED_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    // Allow any localhost/127.0.0.1 in non-production
    if (process.env.NODE_ENV !== 'production') {
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return true;
      }
    }
    // Allow Vercel production and preview deployment domains (*.vercel.app)
    if (url.hostname === 'vercel.app' || url.hostname.endsWith('.vercel.app')) {
      return true;
    }
    // Allow if origin matches current host header (same-domain requests)
    if (reqHost && (url.host === reqHost || url.hostname === reqHost)) {
      return true;
    }
  } catch (_) {
    return false;
  }

  return false;
}

/**
 * Injects security headers and applies strict CORS on API responses.
 * Never blindly uses Access-Control-Allow-Origin: * on authenticated endpoints.
 */
export function applySecurityHeaders(req: any, res: any): boolean {
  const origin = req.headers?.origin || req.headers?.Origin;
  const reqHost = req.headers?.host || req.headers?.Host;

  // 1. Strict Origin Validation for CORS
  if (origin) {
    if (isOriginAllowed(origin, reqHost)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    } else {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'CORS Origin Not Allowed', origin }));
      return false;
    }
  } else {
    // Same-origin fallback
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Correlation-Id, X-Request-Id, X-User-Id, X-Session-Id'
  );

  // Handle CORS preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return false;
  }

  // 2. Production Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), display-capture=(self), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' https: wss: ws: http:; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; media-src 'self' blob: data:;"
  );

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return true;
}
