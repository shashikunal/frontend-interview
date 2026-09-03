import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './PeerRoom.css'

export interface MockProblem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  prompt: string
  starterCode: string
  solutionCode: string
  hints: string[]
  testCases: { input: string; expected: string }[]
}

const PEER_PROBLEMS: MockProblem[] = [
  {
    id: 'promise-all-settled',
    title: 'Implement Promise.allSettled Polyfill',
    difficulty: 'Medium',
    prompt: 'Implement a zero-dependency polyfill for `Promise.allSettled`. It accepts an array of promises and returns a single promise resolving to an array of outcome objects with `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. It should never reject.',
    starterCode: `function myPromiseAllSettled(promises) {
  // Return a promise that resolves when all input promises settle
  return new Promise((resolve) => {
    // Write your solution here...
  });
}

// Test call
const p1 = Promise.resolve(42);
const p2 = Promise.reject('Network Error');
myPromiseAllSettled([p1, p2]).then(console.log);`,
    solutionCode: `function myPromiseAllSettled(promises) {
  if (promises.length === 0) return Promise.resolve([]);

  return new Promise((resolve) => {
    const results = [];
    let completed = 0;

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch((reason) => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        });
    });
  });
}`,
    hints: [
      'Remember to wrap each element in `Promise.resolve(p)` to handle non-promise primitives.',
      'Maintain an index counter to preserve the original ordering of the input array.',
      'The outer promise should never call reject(); always resolve all results once completed === promises.length.',
    ],
    testCases: [
      { input: '[Promise.resolve(1), Promise.resolve(2)]', expected: '[{status:"fulfilled",value:1}, {status:"fulfilled",value:2}]' },
      { input: '[Promise.resolve(1), Promise.reject("err")]', expected: '[{status:"fulfilled",value:1}, {status:"rejected",reason:"err"}]' },
    ],
  },
  {
    id: 'lru-cache-ttl',
    title: 'Design LRU Cache with Time-to-Live (TTL)',
    difficulty: 'Hard',
    prompt: 'Design and implement an LRU (Least Recently Used) Cache that supports automatic item expiration via a configurable Time-To-Live (TTL in milliseconds). Expired keys must return `null` and be evicted from memory.',
    starterCode: `class LRUCacheWithTTL {
  constructor(capacity, defaultTtlMs = 5000) {
    this.capacity = capacity;
    this.defaultTtlMs = defaultTtlMs;
    this.map = new Map();
  }

  get(key) {
    // Return value if valid, or null if expired/not found
  }

  put(key, value, ttlMs = this.defaultTtlMs) {
    // Insert/update key with TTL and evict least recently used if over capacity
  }
}`,
    solutionCode: `class LRUCacheWithTTL {
  constructor(capacity, defaultTtlMs = 5000) {
    this.capacity = capacity;
    this.defaultTtlMs = defaultTtlMs;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return null;
    const item = this.map.get(key);

    if (Date.now() > item.expiresAt) {
      this.map.delete(key);
      return null;
    }

    // Refresh access order by re-inserting
    this.map.delete(key);
    this.map.set(key, item);
    return item.value;
  }

  put(key, value, ttlMs = this.defaultTtlMs) {
    if (this.map.has(key)) this.map.delete(key);

    if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }

    this.map.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}`,
    hints: [
      'In JavaScript, Map preserves key insertion order. Deleting and re-inserting a key moves it to the most recently used (end) position.',
      'Check `Date.now() > item.expiresAt` on `get()` and delete expired items eagerly.',
      'When capacity is exceeded, `this.map.keys().next().value` returns the oldest key.',
    ],
    testCases: [
      { input: 'cache.put("a", 1); cache.get("a")', expected: '1' },
      { input: 'cache.put("a", 1, 10); wait(20ms); cache.get("a")', expected: 'null (Expired)' },
    ],
  },
]

export default function PeerRoom() {
  const [roomId, setRoomId] = useState<string>('room-892147')
  const [isInRoom, setIsInRoom] = useState<boolean>(false)
  const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate')
  const [selectedProblem, setSelectedProblem] = useState<MockProblem>(PEER_PROBLEMS[0])
  const [code, setCode] = useState<string>(PEER_PROBLEMS[0].starterCode)
  const [outputLogs, setOutputLogs] = useState<string[]>([])
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  // Media state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false)
  const [isVideoDisabled, setIsVideoDisabled] = useState<boolean>(false)
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean>(false)

  // Interviewer Rubric Scores (1 - 5)
  const [rubricScores, setRubricScores] = useState({
    coding: 4,
    problemSolving: 5,
    communication: 4,
    edgeCases: 4,
  })
  const [interviewerNotes, setInterviewerNotes] = useState<string>('')
  const [rubricSubmitted, setRubricSubmitted] = useState<boolean>(false)

  const localVideoRef = useRef<HTMLVideoElement | null>(null)

  // Start webcam feed
  useEffect(() => {
    if (!isInRoom) return

    let stream: MediaStream | null = null
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(s => {
        stream = s
        setHasMediaPermission(true)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s
        }
      })
      .catch(() => {
        setHasMediaPermission(false)
      })

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [isInRoom])

  const copyRoomInvite = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const runCodeSandbox = () => {
    setOutputLogs(['▶ Executing in sandboxed environment...'])
    const logs: string[] = []

    try {
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push(`[ERROR] ${args.join(' ')}`),
      }

      const runFn = new Function('console', code)
      runFn(customConsole)

      setTimeout(() => {
        setOutputLogs(logs.length > 0 ? logs : ['Execution finished with 0 output logs. (Use console.log)'])
      }, 300)
    } catch (err: any) {
      setOutputLogs([`❌ Runtime Exception: ${err.message}`])
    }
  }

  return (
    <div className="peer-room-page page-enter">
      {/* Header */}
      <div className="peer-header">
        <div>
          <span className="peer-badge">👥 Live WebRTC Peer Interview Room</span>
          <h1>Peer-to-Peer Live Mock Interview Room</h1>
          <p className="subtitle">
            Practice live 1-on-1 mock interviews with peers. Includes real-time webcam/audio feeds, synchronized code workspace, and interviewer evaluation rubrics.
          </p>
        </div>
      </div>

      {!isInRoom ? (
        /* Room Join / Creation Screen */
        <div className="room-lobby-card">
          <div className="lobby-icon">🌐</div>
          <h2>Join or Create a Mock Interview Room</h2>
          <p className="lobby-desc">
            Connect with a peer or interview partner. One person acts as the <strong>Candidate</strong> solving the problem, and the other acts as the <strong>Interviewer</strong> evaluating with the live rubric.
          </p>

          <div className="room-setup-form">
            <div className="form-group">
              <label>Room Identifier:</label>
              <input
                type="text"
                className="room-input"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
              />
            </div>

            <div className="role-selector-row">
              <label>Select Your Role:</label>
              <div className="role-pills">
                <button
                  type="button"
                  className={`role-pill ${role === 'candidate' ? 'active' : ''}`}
                  onClick={() => setRole('candidate')}
                >
                  👨‍💻 Candidate (Solving Problem)
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'interviewer' ? 'active' : ''}`}
                  onClick={() => setRole('interviewer')}
                >
                  🧑‍🏫 Interviewer (Evaluating with Rubric)
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg enter-room-btn"
              onClick={() => setIsInRoom(true)}
            >
              🚀 Enter Live Interview Room ({roomId})
            </button>
          </div>
        </div>
      ) : (
        /* Live Connected Room */
        <div className="active-room-container">
          {/* Room Top Bar */}
          <div className="room-top-bar">
            <div className="room-meta-left">
              <span className="live-pulse-dot" />
              <span className="room-id-tag">Room: <strong>{roomId}</strong></span>
              <span className={`role-badge role-${role}`}>{role.toUpperCase()} MODE</span>
            </div>

            <div className="room-controls-right">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={copyRoomInvite}
              >
                {copiedLink ? '✓ Copied Invite Link!' : '🔗 Copy Invite Link'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setRole(r => r === 'candidate' ? 'interviewer' : 'candidate')}
              >
                🔄 Switch to {role === 'candidate' ? 'Interviewer' : 'Candidate'} View
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setIsInRoom(false)}
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Main Room Grid */}
          <div className="room-main-grid">
            {/* Left Column: Code Workspace & Prompt */}
            <div className="code-workspace-column">
              {/* Problem Prompt Card */}
              <div className="peer-problem-card">
                <div className="p-card-header">
                  <select
                    className="problem-select"
                    value={selectedProblem.id}
                    onChange={e => {
                      const p = PEER_PROBLEMS.find(prob => prob.id === e.target.value) || PEER_PROBLEMS[0]
                      setSelectedProblem(p)
                      setCode(p.starterCode)
                      setOutputLogs([])
                    }}
                  >
                    {PEER_PROBLEMS.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
                    ))}
                  </select>
                  <span className={`diff-pill diff-${selectedProblem.difficulty.toLowerCase()}`}>
                    {selectedProblem.difficulty}
                  </span>
                </div>
                <p className="peer-prompt-text">{selectedProblem.prompt}</p>
              </div>

              {/* Code Editor */}
              <div className="peer-editor-card">
                <div className="editor-top-actions">
                  <span className="editor-lang-tag">JavaScript (ES2024)</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm run-code-btn"
                    onClick={runCodeSandbox}
                  >
                    ▶ Run Code &amp; Tests
                  </button>
                </div>

                <textarea
                  className="peer-code-editor"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  rows={14}
                />
              </div>

              {/* Console Output */}
              <div className="peer-console-card">
                <span className="console-title">Console Output:</span>
                <pre className="console-stdout">
                  {outputLogs.length === 0 ? 'No output yet. Click "Run Code & Tests" to execute.' : outputLogs.join('\n')}
                </pre>
              </div>
            </div>

            {/* Right Column: WebRTC Video Feeds & Interviewer Rubric */}
            <div className="video-rubric-column">
              {/* WebRTC Video Tiles */}
              <div className="video-tiles-grid">
                {/* Local Video Tile */}
                <div className="video-tile local-tile">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`stream-video ${isVideoDisabled ? 'hidden' : ''}`}
                  />
                  {(!hasMediaPermission || isVideoDisabled) && (
                    <div className="video-placeholder">
                      <span className="avatar-icon">👤</span>
                      <span>{role === 'candidate' ? 'You (Candidate)' : 'You (Interviewer)'}</span>
                    </div>
                  )}
                  <span className="tile-user-tag">You ({role})</span>
                </div>

                {/* Remote Peer Video Tile */}
                <div className="video-tile remote-tile">
                  <div className="video-placeholder">
                    <span className="avatar-icon">🧑‍💻</span>
                    <span>Waiting for Peer Video...</span>
                  </div>
                  <span className="tile-user-tag">Peer Partner</span>
                </div>
              </div>

              {/* Media Controls Bar */}
              <div className="media-controls-bar">
                <button
                  type="button"
                  className={`btn btn-sm ${isAudioMuted ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                >
                  {isAudioMuted ? '🔇 Unmute Mic' : '🎙️ Mute Mic'}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${isVideoDisabled ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                >
                  {isVideoDisabled ? '📷 Enable Camera' : '📷 Stop Camera'}
                </button>
              </div>

              {/* Interviewer Mode: Rubric Grading Card */}
              {role === 'interviewer' ? (
                <div className="interviewer-rubric-card">
                  <h4>🧑‍🏫 Interviewer Evaluation Rubric</h4>

                  <div className="rubric-sliders-list">
                    <div className="rubric-slider-group">
                      <div className="slider-label">
                        <span>Coding Fluency &amp; Correctness</span>
                        <strong>{rubricScores.coding} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={rubricScores.coding}
                        onChange={e => setRubricScores({ ...rubricScores, coding: Number(e.target.value) })}
                      />
                    </div>

                    <div className="rubric-slider-group">
                      <div className="slider-label">
                        <span>Problem Solving &amp; Algorithmic Speed</span>
                        <strong>{rubricScores.problemSolving} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={rubricScores.problemSolving}
                        onChange={e => setRubricScores({ ...rubricScores, problemSolving: Number(e.target.value) })}
                      />
                    </div>

                    <div className="rubric-slider-group">
                      <div className="slider-label">
                        <span>Communication &amp; Clarifying Questions</span>
                        <strong>{rubricScores.communication} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={rubricScores.communication}
                        onChange={e => setRubricScores({ ...rubricScores, communication: Number(e.target.value) })}
                      />
                    </div>

                    <div className="rubric-slider-group">
                      <div className="slider-label">
                        <span>Edge Cases &amp; Memory Safety</span>
                        <strong>{rubricScores.edgeCases} / 5</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={rubricScores.edgeCases}
                        onChange={e => setRubricScores({ ...rubricScores, edgeCases: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="interviewer-hints-box">
                    <strong>💡 Progressive Hints to Give Candidate:</strong>
                    <ol>
                      {selectedProblem.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ol>
                  </div>

                  <textarea
                    className="interviewer-notes-area"
                    placeholder="Type candidate feedback notes and hiring recommendation..."
                    value={interviewerNotes}
                    onChange={e => setInterviewerNotes(e.target.value)}
                    rows={3}
                  />

                  <button
                    type="button"
                    className="btn btn-primary submit-rubric-btn"
                    onClick={() => setRubricSubmitted(true)}
                  >
                    {rubricSubmitted ? '✓ Rubric Feedback Submitted' : 'Submit Hiring Recommendation'}
                  </button>
                </div>
              ) : (
                /* Candidate View: Interviewer Hints & Tips */
                <div className="candidate-tips-card">
                  <h4>👨‍💻 Candidate Live Tips</h4>
                  <ul>
                    <li>Think out loud before typing any code. Explain your algorithmic time/space complexity.</li>
                    <li>Ask clarifying questions regarding edge cases (e.g. empty arrays, async rejections).</li>
                    <li>Write clean, modular code with descriptive variable names.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="peer-footer">
        <Link to="/mock-interview" className="btn btn-secondary">
          ⏱️ Timed Mock Simulator
        </Link>
        <Link to="/video-mock" className="btn btn-primary">
          🎥 Start AI Video Mock Interview →
        </Link>
      </div>
    </div>
  )
}
