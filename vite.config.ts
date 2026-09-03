import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localEmailPlugin()],
})
