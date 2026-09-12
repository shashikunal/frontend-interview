import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

async function testRls() {
  console.log('--- TEST 1: UN-AUTHENTICATED ANON CLIENT ---')
  const anon = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const { data: anonProfiles, error: pErr } = await anon.from('profiles').select('id, email, full_name')
  console.log('Anon profiles count:', anonProfiles?.length, 'Error:', pErr?.message)

  const { data: anonCP, error: cpErr } = await anon.from('core_programming_submissions').select('id')
  console.log('Anon core_programming_submissions count:', anonCP?.length, 'Error:', cpErr?.message)

  const { data: anonSubs, error: sErr } = await anon.from('submissions').select('id')
  console.log('Anon submissions count:', anonSubs?.length, 'Error:', sErr?.message)

  console.log('\n--- TEST 2: AUTHENTICATED AS ADMIN ---')
  const admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  await admin.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  const { data: adminProfiles } = await admin.from('profiles').select('id, email, full_name')
  console.log('Admin profiles count:', adminProfiles?.length)

  const { data: adminCP } = await admin.from('core_programming_submissions').select('id')
  console.log('Admin core_programming_submissions count:', adminCP?.length)

  const { data: adminSubs } = await admin.from('submissions').select('id')
  console.log('Admin submissions count:', adminSubs?.length)
}

testRls().catch(console.error)
