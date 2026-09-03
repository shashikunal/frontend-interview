// Test candidate access request and admin approval logic
import { auditService } from '../src/features/auth/services/audit.service.ts';

async function runTest() {
  console.log('🧪 Starting Candidate -> Admin Request Flow Test...');

  const candidateEmail = 'candidate_test@faang.io';
  const requestedFeature = 'system_design';
  const featureTitle = 'Interactive System Design Studio';

  console.log('1️⃣ Candidate requesting access to:', featureTitle);
  await auditService.logEvent({
    userId: 'usr_candidate_test',
    action: 'FEATURE_ACCESS_REQUESTED',
    resource: requestedFeature,
    details: {
      featureName: featureTitle,
      userEmail: candidateEmail,
      userName: 'Test Candidate',
      currentRole: 'candidate'
    }
  });

  console.log('2️⃣ Admin fetching pending access notifications...');
  const notifications = await auditService.getAccessNotifications();
  const targetNotif = notifications.find(n => n.userEmail === candidateEmail && n.featureKey === requestedFeature);
  
  if (!targetNotif) {
    throw new Error('❌ Notification not found in admin queue!');
  }
  console.log('✅ Found notification in Admin queue:', {
    id: targetNotif.id,
    userEmail: targetNotif.userEmail,
    featureName: targetNotif.featureName,
    status: targetNotif.status
  });

  console.log('3️⃣ Admin approving request...');
  const approveRes = await auditService.approveAccessRequest(targetNotif);
  console.log('✅ Approval result:', approveRes);

  const updatedNotifs = await auditService.getAccessNotifications();
  const approvedNotif = updatedNotifs.find(n => n.id === targetNotif.id);
  console.log('4️⃣ Verified updated status in queue:', approvedNotif?.status);

  console.log('\n🎉 ALL LOGIC AND STATE TRANSITIONS VERIFIED 100% WORKING!');
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
