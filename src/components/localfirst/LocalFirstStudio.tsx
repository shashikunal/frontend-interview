import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LocalFirstStudio.css'

export interface LocalNote {
  id: string
  title: string
  body: string
  status: 'synced' | 'pending-sync' | 'error'
  vectorClock: { clientA: number; clientB: number }
  updatedAt: string
}

export interface MutationAction {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  noteId: string
  payload: string
  timestamp: string
}

export default function LocalFirstStudio() {
  const [activeTab, setActiveTab] = useState<'optimistic' | 'vector-clock' | 'storage' | 'blueprints'>('optimistic')

  // Network simulator state
  const [isOnline, setIsOnline] = useState<boolean>(true)

  // Local document state
  const [notes, setNotes] = useState<LocalNote[]>([
    {
      id: 'note-1',
      title: 'Distributed Systems Architecture',
      body: 'Local-first client executes all mutations against local IndexedDB instance with 0ms latency.',
      status: 'synced',
      vectorClock: { clientA: 3, clientB: 1 },
      updatedAt: 'Just now',
    },
    {
      id: 'note-2',
      title: 'CAP Theorem & PACELC',
      body: 'Offline clients choose Availability and Partition tolerance (AP) during network partitions.',
      status: 'synced',
      vectorClock: { clientA: 2, clientB: 2 },
      updatedAt: '1m ago',
    },
  ])

  // Sync queue
  const [mutationQueue, setMutationQueue] = useState<MutationAction[]>([])
  const [newTitle, setNewTitle] = useState<string>('')
  const [newBody, setNewBody] = useState<string>('')

  // Conflict state
  const [conflictResolved, setConflictResolved] = useState<boolean>(false)

  // 1. Handle Create Note (Optimistic)
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newNoteId = `note-${Date.now()}`
    const newNote: LocalNote = {
      id: newNoteId,
      title: newTitle.trim(),
      body: newBody.trim() || 'No body content.',
      status: isOnline ? 'synced' : 'pending-sync',
      vectorClock: { clientA: 4, clientB: 1 },
      updatedAt: new Date().toLocaleTimeString(),
    }

    // 0ms Optimistic UI Update (Writes directly to local store)
    setNotes(prev => [newNote, ...prev])
    setNewTitle('')
    setNewBody('')

    if (!isOnline) {
      const mutation: MutationAction = {
        id: `mut-${Date.now()}`,
        type: 'CREATE',
        noteId: newNoteId,
        payload: JSON.stringify({ title: newNote.title, body: newNote.body }),
        timestamp: new Date().toLocaleTimeString(),
      }
      setMutationQueue(prev => [mutation, ...prev])
    }
  }

  // 2. Reconnect and Flush Queue
  const handleReconnect = () => {
    setIsOnline(true)
    if (mutationQueue.length > 0) {
      // Simulate asynchronous server reconciliation
      setTimeout(() => {
        setNotes(prev =>
          prev.map(n => ({
            ...n,
            status: 'synced',
          }))
        )
        setMutationQueue([])
      }, 500)
    }
  }

  // 3. Simulate Server Rollback
  const handleSimulateRollback = () => {
    if (notes.length === 0) return
    // Mark first note with error and rollback
    setNotes(prev =>
      prev.map((n, idx) => (idx === 0 ? { ...n, status: 'error', title: `[ROLLBACK] ${n.title}` } : n))
    )
  }


  return (
    <div className="localfirst-page page-enter">
      {/* Header */}
      <div className="localfirst-header">
        <div>
          <span className="localfirst-badge">💾 Client Database &amp; Offline Sync Engine</span>
          <h1>IndexedDB &amp; Local-First Offline Sync Studio</h1>
          <p className="subtitle">
            Experience 0ms optimistic UI mutations, offline sync queues with automatic re-sync, Vector Clock causality tracking, and local client storage architectures.
          </p>
        </div>

        <div className="network-status-toggle">
          <button
            type="button"
            className={`btn ${isOnline ? 'btn-primary' : 'btn-danger'} net-btn`}
            onClick={() => (isOnline ? setIsOnline(false) : handleReconnect())}
          >
            {isOnline ? '🟢 Network: Online' : '🔴 Network: Offline (Queuing Mutations)'}
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="localfirst-tabs-bar">
        <button
          type="button"
          className={`lf-tab ${activeTab === 'optimistic' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimistic')}
        >
          ⚡ 1. Optimistic UI &amp; Offline Sync Queue
        </button>
        <button
          type="button"
          className={`lf-tab ${activeTab === 'vector-clock' ? 'active' : ''}`}
          onClick={() => setActiveTab('vector-clock')}
        >
          ⏳ 2. Vector Clocks vs Last-Write-Wins (LWW)
        </button>
        <button
          type="button"
          className={`lf-tab ${activeTab === 'storage' ? 'active' : ''}`}
          onClick={() => setActiveTab('storage')}
        >
          💾 3. IndexedDB vs SQLite WASM vs LocalStorage
        </button>
        <button
          type="button"
          className={`lf-tab ${activeTab === 'blueprints' ? 'active' : ''}`}
          onClick={() => setActiveTab('blueprints')}
        >
          🏢 4. FAANG Local-First Blueprints (Linear &amp; Notion)
        </button>
      </div>

      {/* 1. OPTIMISTIC MUTATIONS TAB */}
      {activeTab === 'optimistic' && (
        <div className="optimistic-grid">
          {/* Left Column: Form & Notes List */}
          <div className="notes-column">
            <div className="card-box">
              <h3>Create Local Document (Instant 0ms Mutation)</h3>
              <form onSubmit={handleCreateNote} className="note-form">
                <input
                  type="text"
                  className="note-input"
                  placeholder="Document title..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
                <textarea
                  className="note-textarea"
                  placeholder="Body content..."
                  rows={2}
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                />
                <div className="form-actions-row">
                  <button type="submit" className="btn btn-primary">
                    + Commit Local Mutation
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleSimulateRollback}
                  >
                    Simulate Server Rollback
                  </button>
                </div>
              </form>
            </div>

            {/* Notes List */}
            <div className="notes-list">
              {notes.map(note => (
                <div key={note.id} className={`note-card ${note.status}`}>
                  <div className="note-top">
                    <h4>{note.title}</h4>
                    <span className={`status-pill ${note.status}`}>
                      {note.status === 'synced' && '✅ Synced to Cloud'}
                      {note.status === 'pending-sync' && '⏳ Local Only (Pending Sync)'}
                      {note.status === 'error' && '❌ Conflict / Rolled Back'}
                    </span>
                  </div>
                  <p className="note-body">{note.body}</p>
                  <div className="note-footer-meta">
                    <span>Clock: [A:{note.vectorClock.clientA}, B:{note.vectorClock.clientB}]</span>
                    <span>Updated: {note.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mutation Sync Queue */}
          <div className="queue-column">
            <div className="card-box">
              <div className="queue-header-row">
                <h3>Offline Sync Replay Queue</h3>
                <span className="queue-badge">{mutationQueue.length} Mutations Pending</span>
              </div>
              <p className="desc">
                When offline, mutations are committed to an IndexedDB transaction log. Upon reconnection, this queue is deterministically replayed against the cloud sync server.
              </p>

              <div className="queue-items-stream">
                {mutationQueue.length === 0 ? (
                  <div className="empty-queue-box">
                    <span>✨ Queue is empty. All local mutations synced to server.</span>
                  </div>
                ) : (
                  mutationQueue.map(mut => (
                    <div key={mut.id} className="queue-item-card">
                      <div className="q-top">
                        <span className="q-type">{mut.type}</span>
                        <span className="q-time">{mut.timestamp}</span>
                      </div>
                      <code className="q-payload">{mut.payload}</code>
                    </div>
                  ))
                )}
              </div>

              {!isOnline && mutationQueue.length > 0 && (
                <button
                  type="button"
                  className="btn btn-primary flush-btn"
                  onClick={handleReconnect}
                >
                  ⚡ Reconnect &amp; Replay Sync Queue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. VECTOR CLOCKS TAB */}
      {activeTab === 'vector-clock' && (
        <div className="vc-container">
          <div className="vc-intro-banner">
            <div>
              <h3>Causality Tracking: Vector Clocks vs Last-Write-Wins (LWW)</h3>
              <p>
                Wall-clock timestamps (e.g. <code>Date.now()</code>) drift across client devices (NTP skew). <strong>Vector Clocks</strong> capture true causal relationships across distributed offline clients without relying on synchronized physical clocks.
              </p>
            </div>
          </div>

          <div className="vc-grid">
            <div className="card-box">
              <span className="vc-tag bad">1. Last-Write-Wins (LWW) Danger</span>
              <h4>Silent Data Overwrite Bug</h4>
              <p>
                Client A edits document at 10:00:01 (device clock is 2 seconds fast). Client B edits document at 10:00:00. Even though Client B made a later modification in real time, Client A’s skewed timestamp silently overwrites Client B’s changes forever.
              </p>
              <div className="danger-alert">
                ⚠️ Result: Silent data loss.
              </div>
            </div>

            <div className="card-box">
              <span className="vc-tag good">2. Vector Clocks Solution</span>
              <h4>Explicit Causality &amp; Conflict Detection</h4>
              <p>
                Each client maintains an integer counter for every node in the cluster.
              </p>
              <pre className="code-box">
                <code>{`// Client A Clock: { A: 2, B: 1 }
// Client B Clock: { A: 1, B: 2 }
// Condition: Neither clock is strictly greater than the other!
// => CONCURRENT CONFLICT DETECTED!
// Trigger 3-way merge UI instead of silent overwrite.`}</code>
              </pre>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setConflictResolved(prev => !prev)}
              >
                {conflictResolved ? '✅ Conflict Merged (Clock: { A: 3, B: 3 })' : '⚡ Simulate 3-Way Automatic Merge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. STORAGE COMPARISON TAB */}
      {activeTab === 'storage' && (
        <div className="storage-container">
          <div className="storage-intro-banner">
            <h3>Browser Client Storage Engines Comparison</h3>
            <p>Choosing the right local database for high-performance offline web applications.</p>
          </div>

          <div className="storage-table-wrap">
            <table className="storage-table">
              <thead>
                <tr>
                  <th>Storage Engine</th>
                  <th>API Type</th>
                  <th>Storage Quota</th>
                  <th>ACID Transactions</th>
                  <th>Ideal Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>LocalStorage</strong></td>
                  <td>Synchronous (Blocks JS)</td>
                  <td>~5 MB</td>
                  <td>❌ No</td>
                  <td>User theme preference, JWT auth tokens</td>
                </tr>
                <tr>
                  <td><strong>IndexedDB</strong></td>
                  <td>Asynchronous (Event/Promise)</td>
                  <td>500 MB+ (Up to 80% disk)</td>
                  <td>✅ Yes (Object Store)</td>
                  <td>Local-first offline apps, cached question banks</td>
                </tr>
                <tr>
                  <td><strong>SQLite WASM + OPFS</strong></td>
                  <td>Synchronous Web Worker I/O</td>
                  <td>Multi-Gigabyte (Unlimited)</td>
                  <td>✅ Full SQL ACID</td>
                  <td>Figma, Notion, complex relational offline queries</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && (
        <div className="blueprints-container">
          <div className="blueprints-intro-banner">
            <h3>FAANG Local-First Production Case Studies</h3>
            <p>Architectural patterns powering the fastest productivity applications in the world.</p>
          </div>

          <div className="blueprints-grid">
            <div className="card-box bp-card">
              <span className="bp-tag linear">⚡ Linear Sync Engine</span>
              <h4>Instant UI &amp; Local IndexedDB Replay</h4>
              <p>
                Linear loads the entire workspace database directly into the browser’s IndexedDB on initial load. Every click, issue update, or search executes in <strong>0ms against local memory</strong>, broadcasting delta mutations asynchronously via WebSockets.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag notion">📝 Notion Desktop &amp; Web</span>
              <h4>SQLite WASM / IndexedDB Hybrid</h4>
              <p>
                Notion maintains a local SQLite instance on desktop and IndexedDB on web to cache pages, blocks, and relational databases. Full-text search and page switching run with zero network roundtrip latency.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag superhuman">🚀 Superhuman</span>
              <h4>Local-First Trie Indexing</h4>
              <p>
                Stores the last 100,000 emails in client memory using an in-memory prefix trie, allowing sub-50 millisecond instantaneous full-text email search with zero server queries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="lf-footer">
        <Link to="/webrtc-lab" className="btn btn-secondary">
          📡 WebRTC &amp; ICE Handshake Lab
        </Link>
        <Link to="/whiteboard" className="btn btn-primary">
          🎨 Collaborative Whiteboard &amp; CRDT →
        </Link>
      </div>
    </div>
  )
}
