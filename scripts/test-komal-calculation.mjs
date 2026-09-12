import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const KOMAL_ID = '91b07587-a436-4a36-8986-30e0851e9a59'

async function checkKomal() {
  console.log('--- TEST WITH ANON CLIENT ---')
  const anon = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data: anonCP } = await anon.from('core_programming_submissions').select('*').eq('user_id', KOMAL_ID)
  console.log('Anon CP rows for Komal:', anonCP?.length)

  console.log('\n--- TEST WITH ADMIN CLIENT ---')
  const admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  await admin.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  const { data: adminCP } = await admin.from('core_programming_submissions').select('*').eq('user_id', KOMAL_ID)
  console.log('Admin CP rows for Komal:', adminCP?.length)
  const { data: adminSubs } = await admin.from('submissions').select('*').eq('user_id', KOMAL_ID)
  console.log('Admin general submissions for Komal:', adminSubs?.length)
}

checkKomal().catch(console.error)
