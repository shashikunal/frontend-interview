import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
// Local Dev Socket.IO Middleware
function localSocketIOPlugin(): Plugin {
  return {
    name: 'local-socket-io-middleware',
    async configureServer(server) {
      if (server.httpServer) {
        const { initSocketServer } = await import('./server/socket/index.js')
        initSocketServer(server.httpServer)
        console.log('🚀 [Socket.IO Dev Server] Attached to Vite HTTP server on /api/socket')
      }
    },
  }
}

// Local Dev Admin Auth & Candidate History API Middleware
function localAdminAuthPlugin(): Plugin {
  return {
    name: 'local-admin-auth-middleware',
    configureServer(server) {
      server.middlewares.use('/api/admin-auth', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/admin-auth.js')
          const urlObj = new URL(req.url || '/', 'http://localhost')
          req.query = Object.fromEntries(urlObj.searchParams.entries())
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Candidate History API Middleware (bypasses browser RLS seamlessly in dev)
      server.middlewares.use('/api/candidate-history', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/candidate-history.js')
          const urlObj = new URL(req.url || '/', 'http://localhost')
          req.query = Object.fromEntries(urlObj.searchParams.entries())
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Candidate AI Evaluation API Middleware
      server.middlewares.use('/api/candidate-ai-evaluation', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/candidate-ai-evaluation.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 1 Meeting Token API Middleware
      server.middlewares.use('/api/v1/auth/token', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/auth/token.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 2 Meeting Lifecycle API Middleware
      server.middlewares.use('/api/v1/meetings/lifecycle', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/lifecycle.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 2 Meetings API Middleware
      server.middlewares.use('/api/v1/meetings', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/index.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 3 Meeting Invitations API Middleware
      server.middlewares.use('/api/v1/meetings/invite', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/invite.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 3 Meeting Join Pipeline API Middleware
      server.middlewares.use('/api/v1/meetings/join', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/join.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 4 WebRTC / SFU Media Token API Middleware
      server.middlewares.use('/api/v1/meetings/media-token', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/media-token.js')
          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 5 In-Meeting Chat API Middleware
      server.middlewares.use('/api/v1/meetings/chat', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/chat.js')
          const urlObj = new URL(req.url || '/', 'http://localhost')
          req.query = Object.fromEntries(urlObj.searchParams.entries())

          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 6 In-Meeting Whiteboard API Middleware
      server.middlewares.use('/api/v1/meetings/whiteboard', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/whiteboard.js')
          const urlObj = new URL(req.url || '/', 'http://localhost')
          req.query = Object.fromEntries(urlObj.searchParams.entries())

          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 7 In-Meeting Collaborative Code Editor API Middleware
      server.middlewares.use('/api/v1/meetings/editor', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/meetings/_handlers/editor.js')
          const urlObj = new URL(req.url || '/', 'http://localhost')
          req.query = Object.fromEntries(urlObj.searchParams.entries())

          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Local Dev Phase 7 Application Chat API Middleware
      server.middlewares.use('/api/v1/chat', async (req: any, res: any) => {
        try {
          // @ts-ignore
          const { default: handler } = await import('./api/v1/chat/index.js')
          const urlObj = new URL(req.url || '/', 'http://localhost')
          req.query = Object.fromEntries(urlObj.searchParams.entries())

          res.status = (code: number) => { res.statusCode = code; return res }
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: any) => { body += chunk })
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
              await handler(req, res)
            })
            return
          }

          await handler(req, res)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })

      // Reusable helper for local dev REST API handlers
      const registerDevEndpoint = (mountPath: string, modulePath: string) => {
        server.middlewares.use(mountPath, async (req: any, res: any) => {
          try {
            const fileUrl = pathToFileURL(path.resolve(process.cwd(), modulePath)).href
            // @ts-ignore
            const { default: handler } = await import(fileUrl)
            const urlObj = new URL(req.url || '/', 'http://localhost')
            req.query = Object.fromEntries(urlObj.searchParams.entries())
            res.status = (code: number) => { res.statusCode = code; return res }
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return res
            }

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
              let body = ''
              req.on('data', (chunk: any) => { body += chunk })
              req.on('end', async () => {
                try { req.body = JSON.parse(body || '{}') } catch { req.body = {} }
                await handler(req, res)
              })
              return
            }

            await handler(req, res)
          } catch (err: any) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err?.message || 'Server error' }))
          }
        })
      }

      // Local Dev Phase 12 Admin Operations & Telemetry Middlewares
      registerDevEndpoint('/api/v1/admin/dashboard', './api/v1/admin/dashboard.js')
      registerDevEndpoint('/api/v1/admin/meetings', './api/v1/admin/meetings.js')
      registerDevEndpoint('/api/v1/admin/notifications', './api/v1/admin/notifications.js')
      registerDevEndpoint('/api/v1/admin/users', './api/v1/admin/users.js')

      // Web Push Notifications & Meeting Link Dispatch
      registerDevEndpoint('/api/v1/notifications', './api/_handlers/notifications.js')

      // Local Dev Phase 11 Compliance Audit Trail Middleware
      registerDevEndpoint('/api/v1/audit', './api/v1/audit/index.js')

      // Local Dev Phase 11 Health, Observability & Performance Middlewares
      registerDevEndpoint('/api/v1/health/dependencies', './api/v1/health/dependencies.js')
      registerDevEndpoint('/api/v1/health/ready', './api/v1/health/ready.js')
      registerDevEndpoint('/api/v1/health/redis', './api/v1/health/redis.js')
      registerDevEndpoint('/api/v1/health/kafka', './api/v1/health/kafka.js')
      registerDevEndpoint('/api/v1/health', './api/v1/health/index.js')
      registerDevEndpoint('/api/v1/metrics', './api/v1/metrics.js')
      registerDevEndpoint('/api/v1/performance', './api/v1/performance.js')
      registerDevEndpoint('/api/ai-feedback', './api/ai-feedback.js')
    },
  }
}

// Local Dev Email API Middleware
function localEmailPlugin(): Plugin {
  return {
    name: 'local-email-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              console.log('\n========================================')
              console.log('📬 [EMAIL DISPATCHED VIA DEV GATEWAY]')
              console.log('TO:', data.to)
              console.log('SUBJECT:', data.subject)
              console.log('CODE / PASSCODE:', data.otpCode)
              console.log('TIME:', new Date().toLocaleTimeString())
              console.log('========================================\n')

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({
                success: true,
                to: data.to,
                subject: data.subject,
                otpCode: data.otpCode,
                message: `Email dispatched to ${data.to}`,
                timestamp: new Date().toISOString(),
              }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }))
            }
          })
          return
        }
        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method Not Allowed' }))
      })
    },
  }
}

// Local Dev AI Video Mock Platform Middleware (Ollama Proxy, Video Storage & Streaming)
function localAIVideoMockPlugin(): Plugin {
  const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  const STORAGE_ROOT = path.resolve(process.cwd(), 'storage/interviews')

  if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true })
  }

  return {
    name: 'local-ai-video-mock-middleware',
    configureServer(server) {
      // 1. Ollama Proxy API (/api/ollama/*) to eliminate CORS and enforce timeout
      server.middlewares.use('/api/ollama', async (req, res) => {
        const url = req.url || '/'
        const targetUrl = `${OLLAMA_BASE_URL}/api${url.replace(/^\//, '/')}`

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        try {
          if (req.method === 'GET') {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 10000)
            const upstream = await fetch(targetUrl, { signal: controller.signal })
            clearTimeout(timeout)
            const text = await upstream.text()
            res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
            res.statusCode = upstream.status
            res.end(text)
            return
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk
            })
            req.on('end', async () => {
              try {
                const controller = new AbortController()
                const timeout = setTimeout(() => controller.abort(), 120000)
                const upstream = await fetch(targetUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body,
                  signal: controller.signal,
                })
                clearTimeout(timeout)
                const text = await upstream.text()
                res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
                res.statusCode = upstream.status
                res.end(text)
              } catch (err: any) {
                res.statusCode = 502
                res.end(JSON.stringify({ error: `Ollama upstream error: ${err.message}` }))
              }
            })
            return
          }

          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
        } catch (err: any) {
          res.statusCode = 502
          res.end(JSON.stringify({ error: `Ollama connection error: ${err.message}` }))
        }
      })

      // 2. Video Upload API (/api/video/upload) -> Saves to local disk with strict path traversal & size validation
      server.middlewares.use('/api/video/upload', (req, res) => {
        if (req.method === 'POST') {
          const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/
          const rawUserId = (req.headers['x-user-id'] as string) || 'anonymous'
          const rawSessionId = (req.headers['x-session-id'] as string) || 'default_session'
          const rawAnswerId = (req.headers['x-answer-id'] as string) || `ans_${Date.now()}`
          const durationSec = Number(req.headers['x-duration-seconds'] || 0)

          if (!SAFE_ID_REGEX.test(rawUserId) || !SAFE_ID_REGEX.test(rawSessionId) || !SAFE_ID_REGEX.test(rawAnswerId)) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid identifier: Path traversal or illegal characters detected.' }))
            return
          }

          const userId = rawUserId
          const sessionId = rawSessionId
          const answerId = rawAnswerId

          const sessionDir = path.resolve(STORAGE_ROOT, userId, sessionId)
          if (!sessionDir.startsWith(STORAGE_ROOT)) {
            res.statusCode = 403
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Path traversal blocked.' }))
            return
          }

          if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true })
          }

          const filePath = path.join(sessionDir, `${answerId}.webm`)
          const metaPath = path.join(sessionDir, `${answerId}.meta.json`)

          const chunks: Buffer[] = []
          let totalBytes = 0
          const MAX_UPLOAD_BYTES = 100 * 1024 * 1024 // 100MB limit

          req.on('data', chunk => {
            totalBytes += chunk.length
            if (totalBytes > MAX_UPLOAD_BYTES) {
              res.statusCode = 413
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Payload Too Large: Video exceeds 100MB limit.' }))
              req.destroy()
              return
            }
            chunks.push(chunk)
          })

          req.on('end', () => {
            if (totalBytes > MAX_UPLOAD_BYTES) return
            const buffer = Buffer.concat(chunks)
            fs.writeFileSync(filePath, buffer)

            const metadata = {
              answerId,
              userId,
              sessionId,
              sizeBytes: buffer.length,
              durationSeconds: durationSec,
              mimeType: 'video/webm',
              resolution: '854x480',
              fps: 24,
              storagePath: filePath,
              streamUrl: `/api/video/stream/${answerId}?sessionId=${sessionId}&userId=${userId}`,
              createdAt: new Date().toISOString(),
            }
            fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2))

            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ success: true, metadata }))
          })
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method Not Allowed' }))
      })

      // 3. Video Stream API (/api/video/stream/:id) -> HTML5 Range streaming from disk
      server.middlewares.use('/api/video/stream', (req, res) => {
        const urlObj = new URL(req.url || '/', 'http://localhost')
        const pathname = urlObj.pathname.replace(/^\//, '')
        const answerId = pathname.split('/')[0]
        const sessionId = urlObj.searchParams.get('sessionId') || ''
        const userId = urlObj.searchParams.get('userId') || ''
        const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/
        if (!SAFE_ID_REGEX.test(answerId) || (sessionId && !SAFE_ID_REGEX.test(sessionId)) || (userId && !SAFE_ID_REGEX.test(userId))) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid identifier: Path traversal rejected.' }))
          return
        }

        // Find file path
        let targetFilePath = ''
        if (sessionId) {
          const directPath = path.resolve(STORAGE_ROOT, userId, sessionId, `${answerId}.webm`)
          if (directPath.startsWith(STORAGE_ROOT) && fs.existsSync(directPath)) {
            targetFilePath = directPath
          }
        }

        if (!targetFilePath) {
          // Recursive lookup in storage
          const findFile = (dir: string): string | null => {
            if (!fs.existsSync(dir)) return null
            const entries = fs.readdirSync(dir, { withFileTypes: true })
            for (const entry of entries) {
              const full = path.join(dir, entry.name)
              if (entry.isDirectory()) {
                const found = findFile(full)
                if (found) return found
              } else if (entry.name === `${answerId}.webm`) {
                return full
              }
            }
            return null
          }
          targetFilePath = findFile(STORAGE_ROOT) || ''
        }

        if (!targetFilePath || !fs.existsSync(targetFilePath)) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Video file not found' }))
          return
        }

        const stat = fs.statSync(targetFilePath)
        const fileSize = stat.size
        const range = req.headers.range

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-')
          const start = parseInt(parts[0], 10)
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
          const chunksize = end - start + 1
          const file = fs.createReadStream(targetFilePath, { start, end })

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/webm',
          })
          file.pipe(res)
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/webm',
          })
          fs.createReadStream(targetFilePath).pipe(res)
        }
      })

      // 4. System Status API (/api/system-status)
      server.middlewares.use('/api/system-status', async (_req, res) => {
        let ollamaOnline = false
        let models: string[] = []

        try {
          const check = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(2000) })
          if (check.ok) {
            ollamaOnline = true
            const data: any = await check.json()
            models = data.models?.map((m: any) => m.name) || []
          }
        } catch {}

        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify({
          ollama: {
            online: ollamaOnline,
            baseUrl: OLLAMA_BASE_URL,
            models,
            configuredModel: models.includes('llama3.2:latest') ? 'llama3.2:latest' : (models[0] || 'llama3.2:latest'),
          },
          storage: {
            // Path intentionally omitted to avoid filesystem disclosure
            exists: fs.existsSync(STORAGE_ROOT),
          },
          nodeVersion: process.version,
          uptimeSeconds: process.uptime(),
          timestamp: new Date().toISOString(),
        }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'monaco-editor/esm/vs/editor/editor.api.js': 'monaco-editor',
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/monaco-editor') || id.includes('@monaco-editor')) {
            return 'vendor-monaco'
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts'
          }
          if (id.includes('src/components/dsa/data/batches/')) {
            const match = id.match(/batch\d+/i)
            return match ? `dsa-${match[0].toLowerCase()}` : 'dsa-batches'
          }
        },
      },
    },
  },
  plugins: [react(), localAdminAuthPlugin(), localEmailPlugin(), localAIVideoMockPlugin(), localSocketIOPlugin()],
})

