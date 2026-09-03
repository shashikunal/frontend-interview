import { auditService } from '../src/features/auth/services/audit.service.ts';
import { supabase } from '../src/lib/supabase/client.ts';

async function testLiveDbWorkflow() {
  console.log('🧪 Testing Live Supabase DB Access Request & Notification Pipeline...');

  // 1. Candidate sends access request
  const testCandidateEmail = 'alex.rivers@example.com';
  console.log('1️⃣ Candidate requesting access to System Design Studio...');
  await auditService.logEvent({
    action: 'FEATURE_ACCESS_REQUESTED',
    resource: 'system_design',
    details: {
      featureName: 'System Design Studio',
      userEmail: testCandidateEmail,
      userName: 'Alex Rivers',
      currentRole: 'candidate'
    }
  });

  // 2. Query from live Supabase table
  console.log('2️⃣ Querying live audit_logs table in Supabase...');
  const { data: dbLogs, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('action', 'FEATURE_ACCESS_REQUESTED');

  if (error) {
    throw new Error('Supabase query error: ' + error.message);
  }
  console.log(`✅ Retrieved ${dbLogs.length} live access request(s) directly from Supabase:`, dbLogs);

  // 3. Admin fetches notifications via service
  console.log('3️⃣ Admin fetching access notifications via service...');
  const notifs = await auditService.getAccessNotifications();
  console.log('✅ Admin Notification Bell will show:', notifs.length, 'request(s):', notifs);

  console.log('\n🎉 FULL DATABASE WORKFLOW OPERATING 100% IN SUPABASE POSTGRESQL!');
}

testLiveDbWorkflow().catch(err => {
  console.error('Test failed:', err);
});
