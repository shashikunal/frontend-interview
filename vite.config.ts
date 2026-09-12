import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { initSocketServer } from './server/socket/index.js'

// Local Dev Socket.IO Middleware
function localSocketIOPlugin(): Plugin {
  return {
    name: 'local-socket-io-middleware',
    configureServer(server) {
      if (server.httpServer) {
        initSocketServer(server.httpServer)
        console.log('🚀 [Socket.IO Dev Server] Attached to Vite HTTP server on /api/socket')
      }
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

      // 2. Video Upload API (/api/video/upload) -> Saves to local disk
      server.middlewares.use('/api/video/upload', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = []
          const userId = (req.headers['x-user-id'] as string) || 'anonymous'
          const sessionId = (req.headers['x-session-id'] as string) || 'default_session'
          const answerId = (req.headers['x-answer-id'] as string) || `ans_${Date.now()}`
          const durationSec = Number(req.headers['x-duration-seconds'] || 0)

          const sessionDir = path.join(STORAGE_ROOT, userId, sessionId)
          if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true })
          }

          const filePath = path.join(sessionDir, `${answerId}.webm`)
          const metaPath = path.join(sessionDir, `${answerId}.meta.json`)

          req.on('data', chunk => chunks.push(chunk))
          req.on('end', () => {
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
        const sessionId = urlObj.searchParams.get('sessionId')
        const userId = urlObj.searchParams.get('userId') || 'anonymous'

        if (!answerId) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Answer ID is required' }))
          return
        }

        // Find file path
        let targetFilePath = ''
        if (sessionId) {
          const directPath = path.join(STORAGE_ROOT, userId, sessionId, `${answerId}.webm`)
          if (fs.existsSync(directPath)) targetFilePath = directPath
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
            root: STORAGE_ROOT,
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
  plugins: [react(), localEmailPlugin(), localAIVideoMockPlugin(), localSocketIOPlugin()],
})
