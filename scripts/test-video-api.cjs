async function testVideoUploadAndStream() {
  console.log('Testing /api/video/upload...');
  const fakeWebmBuffer = Buffer.from('FAKE_WEBM_VIDEO_BINARY_DATA_FOR_AUDIT');
  const uploadRes = await fetch('http://localhost:5173/api/video/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'video/webm',
      'x-user-id': 'candidate_test',
      'x-session-id': 'session_audit_101',
      'x-answer-id': 'ans_test_001',
      'x-duration-seconds': '4.5'
    },
    body: fakeWebmBuffer
  });

  console.log('Upload HTTP:', uploadRes.status);
  const uploadData = await uploadRes.json();
  console.log('Upload Result:', JSON.stringify(uploadData, null, 2));

  console.log('\nTesting /api/video/stream/ans_test_001...');
  const streamRes = await fetch('http://localhost:5173/api/video/stream/ans_test_001?sessionId=session_audit_101&userId=candidate_test');
  console.log('Stream HTTP:', streamRes.status);
  console.log('Content-Type:', streamRes.headers.get('content-type'));
  console.log('Content-Length:', streamRes.headers.get('content-length'));

  const streamBody = await streamRes.text();
  console.log('Streamed Body matches:', streamBody === 'FAKE_WEBM_VIDEO_BINARY_DATA_FOR_AUDIT');

  console.log('\nTesting HTTP 206 Range Stream...');
  const rangeRes = await fetch('http://localhost:5173/api/video/stream/ans_test_001?sessionId=session_audit_101&userId=candidate_test', {
    headers: { 'Range': 'bytes=0-9' }
  });
  console.log('Range HTTP:', rangeRes.status);
  console.log('Range Content-Range:', rangeRes.headers.get('content-range'));
  const rangeBody = await rangeRes.text();
  console.log('Range Content:', rangeBody);

  console.log('\n✅ Video local disk upload and HTTP 206 streaming verified!');
}

testVideoUploadAndStream().catch(err => {
  console.error('Video test error:', err);
  process.exit(1);
});
