// scripts/live-typer-demo.mjs
import { io } from 'socket.io-client';
import * as Y from 'yjs';

const SOCKET_URL = 'http://localhost:5173';
const SOCKET_PATH = '/api/socket';

const sessionId = process.argv[2];
if (!sessionId) {
  console.error('Usage: node scripts/live-typer-demo.mjs <sessionId>');
  process.exit(1);
}

const textToType = '// Hello Monaco Bind and yjs and socket\nfunction solve(a, b) {\n  return a + b;\n}';

console.log(`Starting real-time live typing demo for session ${sessionId}...`);
console.log(`Text to type:\n${textToType}\n`);

const socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  transports: ['websocket'],
  auth: {
    devUser: {
      id: 'student_live_demo',
      name: 'Alex Student',
      role: 'candidate',
      email: 'alex.student@interview.local',
    },
  },
});

socket.on('connect', async () => {
  console.log('Student socket connected:', socket.id);

  // Join session
  await new Promise((resolve) => {
    socket.emit('session:join', {
      sessionId,
      questionId: 'JS-P001',
      questionTitle: 'Two Sum Problem',
      language: 'javascript',
      initialCode: '',
    }, resolve);
  });

  const ydoc = new Y.Doc();
  const ytext = ydoc.getText('solution.js');

  ydoc.on('update', (update) => {
    socket.emit('yjs:update', {
      sessionId,
      update: Array.from(update),
      fileId: 'solution.js',
      timestamp: Date.now(),
    });
  });

  // Type character by character with 90ms delay
  let currentCode = '';
  let line = 1;
  let column = 1;

  for (let i = 0; i < textToType.length; i++) {
    const char = textToType[i];
    ytext.insert(currentCode.length, char);
    currentCode += char;

    if (char === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }

    socket.emit('student:keystroke', {
      sessionId,
      fileId: 'solution.js',
      code: currentCode,
      cursor: { line, column },
      timestamp: Date.now(),
    });

    socket.emit('student:cursor-change', {
      sessionId,
      fileId: 'solution.js',
      line,
      column,
      timestamp: Date.now(),
    });

    console.log(`Typed char [${char === '\n' ? '\\n' : char}] -> Line ${line}, Col ${column}`);
    await new Promise((r) => setTimeout(r, 90));
  }

  console.log('Finished live typing! Keeping connection alive for 10s...');
  await new Promise((r) => setTimeout(r, 10000));
  socket.disconnect();
  console.log('Demo completed.');
  process.exit(0);
});
