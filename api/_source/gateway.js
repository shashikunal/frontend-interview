// Source Entrypoint for Consolidated Serverless API Gateway
// Bundled by esbuild into api/index.js for rock-solid production execution on Vercel.

import adminMeetingsHandler from '../_handlers/admin-meetings.js';
import adminDashboardHandler from '../_handlers/admin-dashboard.js';
import adminNotificationsHandler from '../_handlers/admin-notifications.js';
import adminUsersHandler from '../_handlers/admin-users.js';
import authTokenHandler from '../_handlers/auth-token.js';
import meetingsHandler from '../_handlers/meetings.js';
import chatAppHandler from '../_handlers/chat-app.js';
import auditHandler from '../_handlers/audit.js';
import healthHandler from '../_handlers/health.js';
import healthDepsHandler from '../_handlers/health-dependencies.js';
import healthKafkaHandler from '../_handlers/health-kafka.js';
import healthReadyHandler from '../_handlers/health-ready.js';
import healthRedisHandler from '../_handlers/health-redis.js';
import metricsHandler from '../_handlers/metrics.js';
import performanceHandler from '../_handlers/performance.js';
import adminAuthHandler from '../_handlers/admin-auth.js';
import candidateHistoryHandler from '../_handlers/candidate-history.js';
import candidateAiEvalHandler from '../_handlers/candidate-ai-evaluation.js';
import sendEmailHandler from '../_handlers/send-email.js';
import aiFeedbackHandler from '../_handlers/ai-feedback.js';

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req, res) {
  // Ensure standard response helper methods exist
  if (!res.status) {
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
  }
  if (!res.json) {
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };
  }

  try {
    // Parse body if needed for write methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && !req.body) {
      req.body = await parseBody(req);
    }

    // Normalize URL and path
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const pathname = urlObj.pathname.toLowerCase().replace(/\/+$/, '');

    // Populate query params onto req.query
    if (!req.query) {
      req.query = Object.fromEntries(urlObj.searchParams.entries());
    } else {
      for (const [k, v] of urlObj.searchParams.entries()) {
        if (req.query[k] === undefined) req.query[k] = v;
      }
    }

    // 1. Admin Operations
    if (pathname === '/api/v1/admin/meetings' || pathname.startsWith('/api/v1/admin/meetings/')) {
      return adminMeetingsHandler(req, res);
    }
    if (pathname === '/api/v1/admin/dashboard' || pathname.startsWith('/api/v1/admin/dashboard/')) {
      return adminDashboardHandler(req, res);
    }
    if (pathname === '/api/v1/admin/notifications' || pathname.startsWith('/api/v1/admin/notifications/')) {
      return adminNotificationsHandler(req, res);
    }
    if (pathname === '/api/v1/admin/users' || pathname.startsWith('/api/v1/admin/users/')) {
      return adminUsersHandler(req, res);
    }

    // 2. Auth & Meeting Tokens
    if (pathname === '/api/v1/auth/token' || pathname.startsWith('/api/v1/auth/token/')) {
      return authTokenHandler(req, res);
    }

    // 3. Meeting Operations (Lifecycle, Chat, Editor, Whiteboard, Invite, Join, Media-Token, Recording)
    if (pathname === '/api/v1/meetings' || pathname.startsWith('/api/v1/meetings/')) {
      return meetingsHandler(req, res);
    }

    // 4. Application Chat & Audit
    if (pathname === '/api/v1/chat' || pathname.startsWith('/api/v1/chat/')) {
      return chatAppHandler(req, res);
    }
    if (pathname === '/api/v1/audit' || pathname.startsWith('/api/v1/audit/')) {
      return auditHandler(req, res);
    }

    // 5. Health Probes & Observability
    if (pathname === '/api/v1/health/kafka') {
      return healthKafkaHandler(req, res);
    }
    if (pathname === '/api/v1/health/redis') {
      return healthRedisHandler(req, res);
    }
    if (pathname === '/api/v1/health/ready') {
      return healthReadyHandler(req, res);
    }
    if (pathname === '/api/v1/health/dependencies') {
      return healthDepsHandler(req, res);
    }
    if (pathname === '/api/v1/health' || pathname.startsWith('/api/v1/health/')) {
      return healthHandler(req, res);
    }
    if (pathname === '/api/v1/metrics') {
      return metricsHandler(req, res);
    }
    if (pathname === '/api/v1/performance') {
      return performanceHandler(req, res);
    }

    // 6. Candidate, Evaluation & Feedback Services
    if (pathname === '/api/admin-auth') {
      return adminAuthHandler(req, res);
    }
    if (pathname === '/api/candidate-history') {
      return candidateHistoryHandler(req, res);
    }
    if (pathname === '/api/candidate-ai-evaluation') {
      return candidateAiEvalHandler(req, res);
    }
    if (pathname === '/api/ai-feedback') {
      return aiFeedbackHandler(req, res);
    }
    if (pathname === '/api/send-email') {
      return sendEmailHandler(req, res);
    }

    // Default Fallback
    return res.status(404).json({ error: 'Endpoint Not Found', pathname, method: req.method });
  } catch (err) {
    console.error('[API Gateway Error]', err);
    return res.status(500).json({
      error: 'API Gateway Execution Error',
      message: err?.message || String(err),
      stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined,
    });
  }
}
