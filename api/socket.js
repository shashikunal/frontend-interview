// Vercel Serverless Function: /api/socket
// Attaches Socket.IO to the underlying Node.js HTTP server

import { initSocketServer } from '../server/socket/index.js';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('[Vercel Socket.IO] Initializing Socket.IO server on Node HTTP server...');
    const io = initSocketServer(res.socket.server);
    res.socket.server.io = io;
  } else {
    // Already running
  }
  res.end();
}
