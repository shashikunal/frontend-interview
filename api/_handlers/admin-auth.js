// REST API: /api/admin-auth
// Phase 13: Production Security Hardening & Threat Protection
// Securely verifies administrator credentials with timing-safe comparison, distributed rate-limiting, and CORS protection.

import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { applySecurityHeaders } from '../../server/security/securityHeaders.ts';
import { rateLimiter } from '../../server/redis/rateLimiter.ts';
import { auditService } from '../../server/observability/auditService.ts';

function secureCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (!applySecurityHeaders(req, res)) {
    return;
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Reject unauthenticated GET session acquisition backdoor
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Admin authentication requires POST with credentials.',
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';
  const configuredUsername = process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME || 'shashi';
  const configuredPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'Admin@9999';

  const allowedUsernames = new Set([
    'shashi',
    'shashi@admin.com',
    'admin',
    'admin@interviewprep.com',
    configuredUsername.toLowerCase().trim(),
  ]);

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const cleanUsername = String(username).trim().toLowerCase();

  // 1. Rate Limiting Protection (5 attempts per minute to defeat brute-force)
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rateLimitKey = `admin_login_${cleanUsername}_${String(clientIp).split(',')[0].trim()}`;
  const rateLimit = await rateLimiter.consume('AUTH_LOGIN', rateLimitKey);

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    auditService.log({
      action: 'RATE_LIMIT_EXCEEDED',
      actorUserId: cleanUsername,
      resourceType: 'admin_auth',
      resourceId: cleanUsername,
      result: 'DENIED',
      ipAddress: String(clientIp),
      metadata: { policy: 'AUTH_LOGIN' },
    });
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Too many login attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before retrying.`,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  // 2. Timing-Safe Credential Verification
  const isUsernameValid = allowedUsernames.has(cleanUsername);
  const isPasswordValid = secureCompare(password, configuredPassword);

  if (!isUsernameValid || !isPasswordValid) {
    auditService.log({
      action: 'SECURITY_AUTHENTICATION_FAILED',
      actorUserId: cleanUsername,
      resourceType: 'admin_auth',
      resourceId: cleanUsername,
      result: 'DENIED',
      ipAddress: String(clientIp),
      metadata: { attemptedUsername: cleanUsername },
    });
    return res.status(401).json({ error: 'Invalid administrator credentials. Access denied.' });
  }

  // 3. Establish Supabase Admin Session
  let session = null;
  try {
    const sb = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData } = await sb.auth.signInWithPassword({
      email: 'admin@interviewprep.com',
      password: configuredPassword,
    });
    if (authData?.session) {
      session = authData.session;
    }
  } catch (e) {
    console.warn('[Admin Auth] Supabase session generation notice:', e);
  }

  const isShashi = cleanUsername === 'shashi' || cleanUsername === 'shashi@admin.com';
  const adminUser = {
    id: isShashi ? 'f16e43bf-2ff8-480c-ae49-e2285940bf46' : session?.user?.id || 'admin_super_user',
    email: isShashi ? 'shashi@admin.com' : session?.user?.email || 'admin@interviewprep.com',
    name: isShashi ? 'shashi' : 'Platform Administrator',
    role: 'admin',
    permissions: ['admin:all', 'admin:users_manage', 'admin:billing', 'admin:audit'],
    status: 'ACTIVE',
  };

  auditService.log({
    action: 'ADMIN_SETTINGS_CHANGED',
    actorUserId: adminUser.id,
    resourceType: 'admin_session',
    resourceId: adminUser.id,
    result: 'SUCCESS',
    ipAddress: String(clientIp),
    metadata: { email: adminUser.email },
  });

  return res.status(200).json({
    success: true,
    user: adminUser,
    session,
    message: 'Administrator authentication successful.',
  });
}
