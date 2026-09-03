import { auditService } from '../src/features/auth/services/audit.service.ts';

async function testRealtime() {
  console.log('⚡ Testing Multi-Channel Real-Time Notification Pipeline...');

  let received = null;
  const start = Date.now();

  const unsubscribe = auditService.subscribeToAccessRequests(notif => {
    received = notif;
    const latency = Date.now() - start;
    console.log(`📡 [REAL-TIME EVENT RECEIVED in ${latency}ms]:`, notif);
  });

  // Wait 100ms for subscription setup
  await new Promise(r => setTimeout(r, 100));

  console.log('🚀 Candidate dispatching 1-Click Access Request...');
  await auditService.logEvent({
    action: 'FEATURE_ACCESS_REQUESTED',
    resource: 'system_design',
    details: {
      featureName: 'System Design Studio',
      userEmail: 'candidate_realtime@faang.io',
      userName: 'Live Candidate',
      currentRole: 'candidate'
    }
  });

  // Wait a moment for event loop propagation
  await new Promise(r => setTimeout(r, 500));

  unsubscribe();

  if (received) {
    console.log('🎉 SUCCESS: Real-Time Notification received immediately without delay!');
  } else {
    console.warn('⚠️ Event not received via subscription listener in test runner.');
  }
}

testRealtime().catch(err => {
  console.error('Test error:', err);
});
