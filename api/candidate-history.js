// Vercel Serverless Function: /api/candidate-history
// Securely retrieves candidate performance submissions and attempts from Supabase using server-side credentials,
// bypassing client-side RLS restrictions without exposing admin passwords in browser bundles.

import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const userId = req.query?.userId || new URL(req.url, 'http://localhost').searchParams.get('userId')
  if (!userId) {
    return res.status(400).json({ error: 'userId parameter is required.' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'Admin@9999'

  try {
    const sb = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Authenticate with admin account on the server side to satisfy Postgres RLS
    await sb.auth.signInWithPassword({
      email: 'admin@interviewprep.com',
      password: adminPassword,
    })

    const [subsRes, cpRes, dsaRes, fjsRes, attRes, profRes] = await Promise.all([
      sb.from('submissions').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      sb.from('core_programming_submissions').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      sb.from('dsa_submissions').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      sb.from('frontend_js_submissions').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      sb.from('question_attempts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      sb.from('profiles').select('*').eq('id', userId).maybeSingle(),
    ])

    return res.status(200).json({
      success: true,
      userId,
      profile: profRes.data || null,
      submissions: subsRes.data || [],
      coreProgrammingSubmissions: cpRes.data || [],
      dsaSubmissions: dsaRes.data || [],
      frontendJsSubmissions: fjsRes.data || [],
      questionAttempts: attRes.data || [],
    })
  } catch (err) {
    console.error('[Candidate History API Error]:', err)
    return res.status(500).json({ error: 'Failed to retrieve candidate history records.' })
  }
}
