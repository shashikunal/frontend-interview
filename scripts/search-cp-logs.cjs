const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function searchActivityLogs() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  // 1. Check all activity_logs where entity_id starts with JS-P or JSP or CP
  const { data: logs1, error: err1 } = await client
    .from('activity_logs')
    .select('*')
    .ilike('entity_id', 'JS-P%');
  console.log('activity_logs with entity_id like JS-P%:', logs1?.length);

  // 2. Check all activity_logs with action in (answer_submitted, submission_accepted, submission_failed)
  const { data: subLogs, count: subLogsCount } = await client
    .from('activity_logs')
    .select('id, action, entity_id, entity_type, metadata, created_at', { count: 'exact' })
    .in('action', ['answer_submitted', 'submission_accepted', 'submission_failed', 'question_completed'])
    .limit(1000);
  console.log('Total submission/completion logs in activity_logs sample:', subLogs?.length, 'total count:', subLogsCount);

  const cpActLogs = (subLogs || []).filter(l => {
    const eid = String(l.entity_id || '');
    const meta = JSON.stringify(l.metadata || '');
    return eid.includes('JS-P') || meta.includes('JS-P') || meta.includes('CORE_PROGRAMMING') || meta.includes('core');
  });
  console.log('Core Programming activity logs found:', cpActLogs.length);
  for (const l of cpActLogs) {
    console.log(`  action: ${l.action}, entity_id: ${l.entity_id}, metadata: ${JSON.stringify(l.metadata)}`);
  }
}
searchActivityLogs();
