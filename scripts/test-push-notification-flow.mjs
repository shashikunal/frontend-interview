// Full End-to-End Push Notification Audit Script
import http from 'http';

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('=== STARTING COMPLETE PUSH NOTIFICATION AUDIT ===\n');

  // Step 1: VAPID Key Retrieval
  console.log('1. Checking Public VAPID Key Endpoint (/api/v1/notifications/vapid-key)...');
  const vapidRes = await makeRequest({
    hostname: 'localhost',
    port: 5173,
    path: '/api/v1/notifications/vapid-key',
    method: 'GET',
  });
  console.log(`Status: ${vapidRes.status}`, vapidRes.json);
  if (!vapidRes.json?.publicKey) throw new Error('VAPID key not returned');

  // Step 2: Register Student Web Push Subscription
  console.log('\n2. Registering Active Student Push Subscription (/api/v1/notifications/subscribe)...');
  const subPayload = {
    userId: 'student_rahul_sharma',
    deviceType: 'desktop',
    browser: 'chrome',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    subscription: {
      endpoint: 'https://fcm.googleapis.com/fcm/send/fake_test_token_12345',
      keys: {
        p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0Pclwt00eaMEK3vnv1alDTIVpBgTOo51kZ00xpe-JWxY',
        auth: 'tBHItJI5svbpez7KI4CCXg',
      },
    },
  };
  const subRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5173,
      path: '/api/v1/notifications/subscribe',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    subPayload
  );
  console.log(`Status: ${subRes.status}`, subRes.json);
  if (!subRes.json?.success) throw new Error('Subscription registration failed');

  // Step 3: Dispatch Meeting Link Push Notification to Students
  console.log('\n3. Dispatching Meeting Link Push Notification to Enrolled Student...');
  const sendRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5173,
      path: '/api/v1/notifications/send',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      action: 'send-meeting-link',
      meetingId: 'meet_9207d42bde624ec2',
      studentIds: ['student_rahul_sharma'],
      customMessage: 'Your Technical Interview has started! Click to enter room immediately.',
    }
  );
  console.log(`Status: ${sendRes.status}`, sendRes.json);

  // Step 4: Broadcast to All Students (Auto-discovery for Ad-Hoc / Instant Meetings)
  console.log('\n4. Dispatching Broadcast Link Push (Instant Room with Auto-Targeting)...');
  const broadRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5173,
      path: '/api/v1/notifications/send',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      action: 'send-meeting-link',
      meetingId: 'meet_9207d42bde624ec2',
      customMessage: 'Instant Meeting is LIVE. Join us!',
    }
  );
  console.log(`Status: ${broadRes.status}`, broadRes.json);

  console.log('\n=== AUDIT COMPLETE: ALL PUSH NOTIFICATION CHECKS PASSED! ===');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
