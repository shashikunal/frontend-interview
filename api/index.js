// Master Consolidated Serverless API Gateway
// Uses dynamic imports so that individual endpoint handlers load on-demand,
// eliminating cold-start bloat and top-level module load failures on Vercel.

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
      const { default: h } = await import('./_handlers/admin-meetings.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/admin/dashboard' || pathname.startsWith('/api/v1/admin/dashboard/')) {
      const { default: h } = await import('./_handlers/admin-dashboard.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/admin/notifications' || pathname.startsWith('/api/v1/admin/notifications/')) {
      const { default: h } = await import('./_handlers/admin-notifications.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/admin/users' || pathname.startsWith('/api/v1/admin/users/')) {
      const { default: h } = await import('./_handlers/admin-users.js');
      return h(req, res);
    }

    // 2. Auth & Meeting Tokens
    if (pathname === '/api/v1/auth/token' || pathname.startsWith('/api/v1/auth/token/')) {
      const { default: h } = await import('./_handlers/auth-token.js');
      return h(req, res);
    }

    // 3. Meeting Operations (Lifecycle, Chat, Editor, Whiteboard, Invite, Join, Media-Token, Recording)
    if (pathname === '/api/v1/meetings' || pathname.startsWith('/api/v1/meetings/')) {
      const { default: h } = await import('./_handlers/meetings.js');
      return h(req, res);
    }

    // 4. Application Chat & Audit
    if (pathname === '/api/v1/chat' || pathname.startsWith('/api/v1/chat/')) {
      const { default: h } = await import('./_handlers/chat-app.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/audit' || pathname.startsWith('/api/v1/audit/')) {
      const { default: h } = await import('./_handlers/audit.js');
      return h(req, res);
    }

    // 5. Health Probes & Observability
    if (pathname === '/api/v1/health/kafka') {
      const { default: h } = await import('./_handlers/health-kafka.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/health/redis') {
      const { default: h } = await import('./_handlers/health-redis.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/health/ready') {
      const { default: h } = await import('./_handlers/health-ready.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/health/dependencies') {
      const { default: h } = await import('./_handlers/health-dependencies.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/health' || pathname.startsWith('/api/v1/health/')) {
      const { default: h } = await import('./_handlers/health.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/metrics') {
      const { default: h } = await import('./_handlers/metrics.js');
      return h(req, res);
    }
    if (pathname === '/api/v1/performance') {
      const { default: h } = await import('./_handlers/performance.js');
      return h(req, res);
    }

    // 6. Candidate, Evaluation & Feedback Services
    if (pathname === '/api/admin-auth') {
      const { default: h } = await import('./_handlers/admin-auth.js');
      return h(req, res);
    }
    if (pathname === '/api/candidate-history') {
      const { default: h } = await import('./_handlers/candidate-history.js');
      return h(req, res);
    }
    if (pathname === '/api/candidate-ai-evaluation') {
      const { default: h } = await import('./_handlers/candidate-ai-evaluation.js');
      return h(req, res);
    }
    if (pathname === '/api/ai-feedback') {
      const { default: h } = await import('./_handlers/ai-feedback.js');
      return h(req, res);
    }
    if (pathname === '/api/send-email') {
      const { default: h } = await import('./_handlers/send-email.js');
      return h(req, res);
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
