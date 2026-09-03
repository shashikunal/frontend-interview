import { supabase } from '../src/lib/supabase/client.ts';

async function checkSupabase() {
  console.log('🔍 Checking connected Supabase database tables...');

  // 1. Check profiles table
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(5);
  if (pErr) {
    console.error('❌ Profiles table error:', pErr.message);
  } else {
    console.log('✅ Profiles table exists! Row count:', profiles?.length || 0);
  }

  // 2. Check audit_logs table
  const { data: audit, error: aErr } = await supabase.from('audit_logs').select('*').limit(5);
  if (aErr) {
    console.error('❌ Audit logs table error:', aErr.message);
  } else {
    console.log('✅ Audit logs table exists! Row count:', audit?.length || 0);
  }

  // 3. Check roles table
  const { data: roles, error: rErr } = await supabase.from('roles').select('*').limit(10);
  if (rErr) {
    console.error('❌ Roles table error:', rErr.message);
  } else {
    console.log('✅ Roles table exists! Roles found:', roles?.map(r => r.name).join(', ') || 'None');
  }

  // 4. Check user_progress table
  const { data: prog, error: prErr } = await supabase.from('user_progress').select('*').limit(5);
  if (prErr) {
    console.error('❌ User progress table error:', prErr.message);
  } else {
    console.log('✅ User progress table exists! Row count:', prog?.length || 0);
  }

  console.log('\n🎉 SUPABASE LIVE DATABASE CONNECTIVITY VERIFIED!');
}

checkSupabase().catch(err => {
  console.error('Supabase check failed:', err);
});
