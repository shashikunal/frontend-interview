import { io } from 'socket.io-client';
import { tokenService } from '../server/auth/tokenService.ts';

async function testP2PMeetingFlow() {
  console.log('--- Starting WebRTC P2P Signaling Test ---');
  const meetingId = 'meet_test_' + Math.random().toString(36).slice(2, 8);

  const { token: hostToken } = tokenService.generateMeetingToken({
    meetingId,
    userId: 'host-user-1',
    userName: 'Host User',
    userEmail: 'host@test.local',
    meetingRole: 'HOST',
    userRole: 'admin',
    permissions: ['canPublishAudio', 'canPublishVideo', 'canPublishScreen', 'canSubscribe', 'canModerate'],
  });

  const { token: clientToken } = tokenService.generateMeetingToken({
    meetingId,
    userId: 'client-user-1',
    userName: 'Student Client',
    userEmail: 'student@test.local',
    meetingRole: 'PARTICIPANT',
    userRole: 'candidate',
    permissions: ['canPublishAudio', 'canPublishVideo', 'canPublishScreen', 'canSubscribe'],
  });

  // 1. Host socket
  const hostSocket = io('http://localhost:5173', {
    path: '/api/socket',
    transports: ['websocket'],
    auth: { token: hostToken },
  });

  // 2. Client socket
  const clientSocket = io('http://localhost:5173', {
    path: '/api/socket',
    transports: ['websocket'],
    auth: { token: clientToken },
  });

  await new Promise((resolve, reject) => {
    let connected = 0;
    const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
    const check = () => {
      connected++;
      if (connected === 2) {
        clearTimeout(timeout);
        resolve();
      }
    };
    hostSocket.on('connect', check);
    clientSocket.on('connect', check);
    hostSocket.on('connect_error', reject);
    clientSocket.on('connect_error', reject);
  });

  console.log('✅ Both sockets connected to Vite Socket server');

  // Join meeting as host
  const hostJoin = await new Promise((resolve) => {
    hostSocket.emit('meeting:join', { meetingId, meetingToken: hostToken }, resolve);
  });
  console.log('✅ Host joined meeting:', hostJoin?.success);

  // Set up client participant joined expectation
  const clientJoinedPromise = new Promise((resolve) => {
    hostSocket.on('meeting:participant:joined', (participant) => {
      console.log('✅ Host received participant joined event:', participant.displayName, participant.userId);
      resolve(participant);
    });
  });

  // Join meeting as client
  const clientJoin = await new Promise((resolve) => {
    clientSocket.emit('meeting:join', { meetingId, meetingToken: clientToken }, resolve);
  });
  console.log('✅ Client joined meeting:', clientJoin?.success, 'Total participants in room:', clientJoin?.participants?.length);

  await clientJoinedPromise;

  // Test WebRTC Offer from Host to Client
  const offerPromise = new Promise((resolve) => {
    clientSocket.on('meeting:webrtc:offer', (data) => {
      console.log('✅ Client received WebRTC Offer from:', data.senderUserId, '| StreamType:', data.streamType);
      resolve(data);
    });
  });

  hostSocket.emit('meeting:webrtc:offer', {
    meetingId,
    targetSocketId: clientSocket.id,
    targetUserId: 'client-user-1',
    offer: { type: 'offer', sdp: 'v=0\r\no=- 12345 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n' },
    streamType: 'camera',
  });

  await offerPromise;

  // Test WebRTC Answer from Client to Host
  const answerPromise = new Promise((resolve) => {
    hostSocket.on('meeting:webrtc:answer', (data) => {
      console.log('✅ Host received WebRTC Answer from:', data.senderUserId);
      resolve(data);
    });
  });

  clientSocket.emit('meeting:webrtc:answer', {
    meetingId,
    targetSocketId: hostSocket.id,
    targetUserId: 'host-user-1',
    answer: { type: 'answer', sdp: 'v=0\r\no=- 67890 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n' },
    streamType: 'camera',
  });

  await answerPromise;

  // Test WebRTC ICE Candidate exchange
  const icePromise = new Promise((resolve) => {
    hostSocket.on('meeting:webrtc:ice-candidate', (data) => {
      console.log('✅ Host received ICE candidate from:', data.senderUserId);
      resolve(data);
    });
  });

  clientSocket.emit('meeting:webrtc:ice-candidate', {
    meetingId,
    targetSocketId: hostSocket.id,
    targetUserId: 'host-user-1',
    candidate: { candidate: 'candidate:1 1 UDP 2122252543 192.168.1.1 50000 typ host', sdpMid: '0', sdpMLineIndex: 0 },
  });

  await icePromise;

  // Test Screen Share broadcast & renegotiation
  const screenSharePromise = new Promise((resolve) => {
    clientSocket.on('meeting:participant:updated', (data) => {
      if (data.screenShareState) {
        console.log('✅ Client received participant screen share state update:', data.displayName, '| ScreenSharing: true');
        resolve(data);
      }
    });
  });

  const renegotiatePromise = new Promise((resolve) => {
    clientSocket.on('meeting:webrtc:renegotiate', (data) => {
      console.log('✅ Client received WebRTC renegotiation signal for:', data.streamType);
      resolve(data);
    });
  });

  hostSocket.emit('meeting:participant:state', {
    meetingId,
    screenShareState: true,
  });

  hostSocket.emit('meeting:webrtc:renegotiate', {
    meetingId,
    streamType: 'screen',
  });

  await Promise.all([screenSharePromise, renegotiatePromise]);

  console.log('🎉 WebRTC P2P signaling, ICE exchange, and Screen Sharing between Host and Client verified successfully!');

  hostSocket.disconnect();
  clientSocket.disconnect();
}

testP2PMeetingFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
