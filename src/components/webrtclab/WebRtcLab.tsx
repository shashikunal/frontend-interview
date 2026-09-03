import { useState } from 'react'
import { Link } from 'react-router-dom'
import './WebRtcLab.css'

export default function WebRtcLab() {
  const [activeTab, setActiveTab] = useState<'signaling' | 'ice-nat' | 'datachannel' | 'topologies'>('signaling')

  // 1. Signaling Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1)

  // 2. NAT Simulation State
  const [selectedNat, setSelectedNat] = useState<'cone' | 'symmetric'>('cone')

  // 3. DataChannel State
  const [channelMode, setChannelMode] = useState<'ordered' | 'unordered'>('unordered')
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; latencyMs: number; seq: number }>>([
    { sender: 'Peer A (Local)', text: 'Hello via WebRTC DataChannel!', latencyMs: 14, seq: 1 },
    { sender: 'Peer B (Remote)', text: 'Direct P2P UDP packet received.', latencyMs: 16, seq: 2 },
  ])
  const [inputMsg, setInputMsg] = useState<string>('')

  const handleNextStep = () => {
    setCurrentStep(prev => (prev < 4 ? prev + 1 : 1))
  }

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return
    const newMsg = {
      sender: 'Peer A (Local)',
      text: inputMsg.trim(),
      latencyMs: channelMode === 'unordered' ? Math.floor(10 + Math.random() * 8) : Math.floor(22 + Math.random() * 15),
      seq: messages.length + 1,
    }
    setMessages(prev => [...prev, newMsg])
    setInputMsg('')
  }

  return (
    <div className="webrtc-page page-enter">
      {/* Header */}
      <div className="webrtc-header">
        <div>
          <span className="webrtc-badge">📡 Real-Time P2P Streaming &amp; Media Protocols</span>
          <h1>WebRTC Peer Connection &amp; ICE Handshake Lab</h1>
          <p className="subtitle">
            Simulate SDP Offer/Answer signaling state machines, understand STUN/TURN NAT punchthrough traversal, test low-latency DataChannels, and master SFU vs MCU media architectures.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="webrtc-tabs-bar">
        <button
          type="button"
          className={`rtc-tab ${activeTab === 'signaling' ? 'active' : ''}`}
          onClick={() => setActiveTab('signaling')}
        >
          🤝 1. SDP Offer / Answer Signaling Stepper
        </button>
        <button
          type="button"
          className={`rtc-tab ${activeTab === 'ice-nat' ? 'active' : ''}`}
          onClick={() => setActiveTab('ice-nat')}
        >
          🌐 2. ICE Candidates &amp; STUN/TURN NAT
        </button>
        <button
          type="button"
          className={`rtc-tab ${activeTab === 'datachannel' ? 'active' : ''}`}
          onClick={() => setActiveTab('datachannel')}
        >
          📦 3. Live WebRTC DataChannel Stream
        </button>
        <button
          type="button"
          className={`rtc-tab ${activeTab === 'topologies' ? 'active' : ''}`}
          onClick={() => setActiveTab('topologies')}
        >
          🏢 4. SFU vs MCU vs Mesh Architecture
        </button>
      </div>

      {/* 1. SIGNALING STEPPER TAB */}
      {activeTab === 'signaling' && (
        <div className="signaling-grid">
          <div className="card-box">
            <div className="step-header-row">
              <h3>SDP Connection Lifecycle (Step {currentStep} of 4)</h3>
              <span className="signaling-state-tag">
                {currentStep === 1 && 'SignalingState: have-local-offer'}
                {currentStep === 2 && 'SignalingState: have-remote-offer'}
                {currentStep === 3 && 'SignalingState: have-local-pranswer'}
                {currentStep === 4 && 'SignalingState: stable (Connected)'}
              </span>
            </div>

            <div className="stepper-visual-bar">
              <div className={`step-node ${currentStep >= 1 ? 'completed' : ''}`}>1. Create Offer</div>
              <div className="step-connector" />
              <div className={`step-node ${currentStep >= 2 ? 'completed' : ''}`}>2. Set Remote Offer</div>
              <div className="step-connector" />
              <div className={`step-node ${currentStep >= 3 ? 'completed' : ''}`}>3. Create Answer</div>
              <div className="step-connector" />
              <div className={`step-node ${currentStep >= 4 ? 'completed' : ''}`}>4. Connected</div>
            </div>

            <div className="step-description-box">
              {currentStep === 1 && (
                <div>
                  <h4>Peer A (Caller) creates SDP Offer:</h4>
                  <p>
                    Peer A invokes <code>peerConnection.createOffer()</code> and calls <code>setLocalDescription(offer)</code>. The SDP payload contains video codecs (H.264, VP9, AV1), audio codecs (Opus), and DTLS encryption keys.
                  </p>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <h4>Signaling Server transports Offer to Peer B:</h4>
                  <p>
                    Peer B receives the SDP offer via WebSocket / HTTP signaling and invokes <code>peerConnection.setRemoteDescription(offer)</code>. Peer B now knows Peer A’s media capabilities.
                  </p>
                </div>
              )}
              {currentStep === 3 && (
                <div>
                  <h4>Peer B (Callee) generates SDP Answer:</h4>
                  <p>
                    Peer B calls <code>peerConnection.createAnswer()</code>, sets it locally via <code>setLocalDescription(answer)</code>, and transmits the answer back through the signaling channel.
                  </p>
                </div>
              )}
              {currentStep === 4 && (
                <div>
                  <h4>Peer A sets Remote Description ➔ Connection Established:</h4>
                  <p>
                    Peer A calls <code>setRemoteDescription(answer)</code>. Signaling state converges to <code>stable</code>, ICE candidate checks succeed, and direct peer-to-peer encrypted media flows!
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary step-btn"
              onClick={handleNextStep}
            >
              {currentStep < 4 ? '▶ Advance to Next Step' : '↩ Restart Handshake Simulation'}
            </button>
          </div>

          <div className="card-box">
            <h3>Raw SDP Session Description Protocol Preview</h3>
            <pre className="sdp-pre">
              <code>{currentStep <= 2 ? `v=0
o=- 482910482 2 IN IP4 198.51.100.4
s=-
t=0 0
m=audio 9 UDP/TLS/RTP/SAVPF 111
a=rtpmap:111 opus/48000/2
m=video 9 UDP/TLS/RTP/SAVPF 96 97
a=rtpmap:96 VP9/90000
a=rtpmap:97 H264/90000
a=fingerprint:sha-256 3B:4E:A8:12:...
a=setup:actpass
a=ice-ufrag:faang_caller_ufrag` : `v=0
o=- 719283910 2 IN IP4 203.0.113.19
s=-
t=0 0
m=audio 9 UDP/TLS/RTP/SAVPF 111
a=rtpmap:111 opus/48000/2
m=video 9 UDP/TLS/RTP/SAVPF 96
a=rtpmap:96 VP9/90000
a=fingerprint:sha-256 9F:11:0C:48:...
a=setup:active
a=ice-pwd:faang_callee_secret_key`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* 2. ICE CANDIDATES & NAT TAB */}
      {activeTab === 'ice-nat' && (
        <div className="ice-grid">
          <div className="card-box">
            <h3>Interactive NAT Traversal Simulator</h3>
            <p className="desc">
              Most user devices sit behind Wi-Fi routers and NAT firewalls with private IPs (e.g. <code>192.168.1.5</code>). <strong>ICE (Interactive Connectivity Establishment)</strong> discovers viable communication paths.
            </p>

            <div className="nat-selector-row">
              <button
                type="button"
                className={`nat-btn ${selectedNat === 'cone' ? 'active' : ''}`}
                onClick={() => setSelectedNat('cone')}
              >
                🏠 Home / Public Wi-Fi (Cone NAT)
              </button>
              <button
                type="button"
                className={`nat-btn ${selectedNat === 'symmetric' ? 'active' : ''}`}
                onClick={() => setSelectedNat('symmetric')}
              >
                🏢 Strict Enterprise Firewall (Symmetric NAT)
              </button>
            </div>

            <div className={`ice-resolution-card ${selectedNat === 'cone' ? 'stun-success' : 'turn-fallback'}`}>
              <div className="res-top">
                <span className="res-type">{selectedNat === 'cone' ? 'STUN Server Reflexive (srflx)' : 'TURN Relay Fallback (relay)'}</span>
                <span className="res-status">{selectedNat === 'cone' ? '⚡ Direct P2P Connected' : '🔄 Relayed Connection'}</span>
              </div>
              <h4>{selectedNat === 'cone' ? 'NAT Punchthrough Succeeded via STUN' : 'Direct P2P Blocked by Symmetric NAT'}</h4>
              <p>
                {selectedNat === 'cone'
                  ? 'STUN server (stun.l.google.com:19302) reflected the client public IP:port (198.51.100.4:54321). Direct peer-to-peer UDP transmission active with minimal 14ms latency.'
                  : 'Symmetric NAT assigns a different random port for every destination. Direct UDP punchthrough fails. Traffic routed through TURN relay server (relay.turn.faang.io) with 65ms latency.'}
              </p>
            </div>
          </div>

          <div className="card-box">
            <h3>3 Types of ICE Candidates Explained</h3>
            <div className="candidates-list">
              <div className="cand-item">
                <span className="cand-tag host">1. Host Candidate</span>
                <code>candidate:1 1 UDP 2122260223 192.168.1.15 54321 typ host</code>
                <p>Local private network IP address on the same LAN subnet.</p>
              </div>

              <div className="cand-item">
                <span className="cand-tag srflx">2. Server Reflexive (srflx - STUN)</span>
                <code>candidate:2 1 UDP 1686052607 198.51.100.4 62100 typ srflx raddr 192.168.1.15</code>
                <p>Public IP &amp; port discovered by querying a lightweight STUN server.</p>
              </div>

              <div className="cand-item">
                <span className="cand-tag relay">3. Relay Candidate (relay - TURN)</span>
                <code>candidate:3 1 UDP 41819903 34.120.50.8 443 typ relay raddr 0.0.0.0</code>
                <p>Fallback cloud relay server used when strict enterprise firewalls block direct traffic.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DATACHANNEL TAB */}
      {activeTab === 'datachannel' && (
        <div className="dc-grid">
          <div className="card-box">
            <div className="dc-header-row">
              <h3>WebRTC DataChannel Packet Transmitter</h3>
              <div className="mode-toggle">
                <button
                  type="button"
                  className={`mode-btn ${channelMode === 'unordered' ? 'active' : ''}`}
                  onClick={() => setChannelMode('unordered')}
                >
                  ⚡ Unordered UDP (Gaming/Audio)
                </button>
                <button
                  type="button"
                  className={`mode-btn ${channelMode === 'ordered' ? 'active' : ''}`}
                  onClick={() => setChannelMode('ordered')}
                >
                  🔒 Ordered TCP-Like (File Transfer)
                </button>
              </div>
            </div>

            <p className="desc">
              DataChannels run over SCTP (Stream Control Transmission Protocol) on top of encrypted DTLS/UDP, allowing both reliable ordered delivery and ultra-low-latency unordered packet streaming.
            </p>

            <div className="dc-chat-stream">
              {messages.map((m, i) => (
                <div key={i} className="dc-message-bubble">
                  <div className="msg-meta">
                    <span className="msg-sender">{m.sender}</span>
                    <span className="msg-latency">⏱️ {m.latencyMs} ms · Seq #{m.seq}</span>
                  </div>
                  <div className="msg-content">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="dc-input-row">
              <input
                type="text"
                className="dc-input"
                placeholder="Type message to broadcast across DataChannel..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                type="button"
                className="btn btn-primary send-btn"
                onClick={handleSendMessage}
              >
                Send Packet
              </button>
            </div>
          </div>

          <div className="card-box">
            <h3>DataChannel Configuration (JavaScript)</h3>
            <pre className="code-snippet">
              <code>{`// Creating an ultra-low-latency UDP-like DataChannel:
const dataChannel = peerConnection.createDataChannel("game-inputs", {
  ordered: ${channelMode === 'ordered' ? 'true' : 'false'},
  maxRetransmits: ${channelMode === 'ordered' ? 'null' : '0'}, // Zero head-of-line blocking!
});

dataChannel.onopen = () => console.log("DataChannel open!");
dataChannel.onmessage = (event) => {
  const binaryBuffer = event.data;
  processPeerPacket(binaryBuffer);
};

// Send low-latency binary payload:
dataChannel.send(new Uint8Array([0x01, 0x04, 0xFF]));`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* 4. TOPOLOGIES TAB */}
      {activeTab === 'topologies' && (
        <div className="topos-container">
          <div className="topos-intro-banner">
            <h3>Multi-Party WebRTC Architectures: Mesh vs SFU vs MCU</h3>
            <p>How video conferencing platforms scale from 2 users (P2P Mesh) to 500+ participants (SFU).</p>
          </div>

          <div className="topos-grid">
            <div className="card-box topo-card">
              <span className="topo-tag mesh">1. Full Mesh (P2P)</span>
              <h4>Best for 1-on-1 Calls</h4>
              <p>
                Every client sends and receives streams directly to every other client. Bandwidth scales quadratically <code>O(N²)</code>. Fails beyond 4 users due to client CPU and upstream upload constraints.
              </p>
            </div>

            <div className="card-box topo-card">
              <span className="topo-tag sfu">2. Selective Forwarding Unit (SFU)</span>
              <h4>Google Meet, Zoom, Discord</h4>
              <p>
                Clients send <strong>1 upstream video feed</strong> to an SFU media server. The SFU routes video streams to all participants without re-encoding, supporting hundreds of users with minimal latency.
              </p>
            </div>

            <div className="card-box topo-card">
              <span className="topo-tag mcu">3. Multipoint Control Unit (MCU)</span>
              <h4>Legacy Hardware Telepresence</h4>
              <p>
                The central server decodes all incoming video feeds, composites them into a single combined video grid, and re-encodes a single output stream. Very high server CPU cost and added encoding latency.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="webrtc-footer">
        <Link to="/peer-room" className="btn btn-secondary">
          👥 Open Live Peer Video Room
        </Link>
        <Link to="/whiteboard" className="btn btn-primary">
          🎨 Collaborative Whiteboard &amp; CRDT →
        </Link>
      </div>
    </div>
  )
}
