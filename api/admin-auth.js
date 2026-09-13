// Vercel Serverless Function: /api/admin-auth
// Verifies administrator credentials securely on the server side without exposing passwords in client bundles.

export default async function handler(req, res) {
  // CORS Headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  const configuredUsername = process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME
  const configuredPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD

  if (!configuredUsername || !configuredPassword) {
    console.error('[Admin Auth API] Administrator credentials not configured in environment.')
    return res.status(500).json({ error: 'Administrator access is not configured on this server.' })
  }

  const cleanUsername = String(username).trim()
  if (cleanUsername !== configuredUsername.trim() || password !== configuredPassword) {
    return res.status(401).json({ error: 'Invalid administrator credentials. Access denied.' })
  }

  const adminUser = {
    id: 'admin_super_user',
    email: 'admin@interviewprep.com',
    name: 'Platform Administrator',
    role: 'admin',
    permissions: ['admin:all', 'admin:users_manage', 'admin:billing', 'admin:audit'],
    status: 'ACTIVE',
  }

  return res.status(200).json({
    success: true,
    user: adminUser,
    message: 'Administrator authentication successful.',
  })
}
