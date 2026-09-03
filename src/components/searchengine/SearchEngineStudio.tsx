import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './SearchEngineStudio.css'

export interface SearchDoc {
  id: string
  title: string
  category: string
  content: string
}

const SAMPLE_DOCS: SearchDoc[] = [
  {
    id: 'doc-1',
    title: 'React Fiber Reconciler & Concurrent Mode',
    category: 'React Architecture',
    content: 'React Fiber is a complete rewrite of the reconciliation algorithm. It implements cooperative multitasking and priority scheduling via time slicing and work-in-progress trees.',
  },
  {
    id: 'doc-2',
    title: 'V8 Garbage Collection: Scavenger vs Mark-Sweep',
    category: 'JavaScript Internals',
    content: 'V8 uses a generational garbage collector. Young generation allocations are rapidly cleaned using semi-space scavenger copying algorithms, while old generation uses mark-sweep-compact.',
  },
  {
    id: 'doc-3',
    title: 'WebRTC Peer Connection & ICE NAT Traversal',
    category: 'Networking',
    content: 'WebRTC establishes peer-to-peer real-time audio, video, and data communication using SDP offer/answer handshakes and STUN/TURN ICE candidate gathering.',
  },
  {
    id: 'doc-4',
    title: 'CSS Render Pipeline: Reflow, Repaint & Compositing',
    category: 'Browser Engine',
    content: 'The browser layout engine calculates geometry during reflow, rasterizes pixels during repaint, and composites GPU layers with transform and opacity for 120fps animations.',
  },
  {
    id: 'doc-5',
    title: 'IndexedDB & Local-First Optimistic Sync Engines',
    category: 'Storage & Offline',
    content: 'Local-first applications store all data directly inside IndexedDB with 0ms read latency, queuing optimistic mutations and resolving conflicts using Vector Clocks.',
  },
]

const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'it', 'its', 'by', 'as', 'via'])

export default function SearchEngineStudio() {
  const [activeTab, setActiveTab] = useState<'engine' | 'bm25' | 'trie' | 'blueprints'>('engine')

  // Search Engine State
  const [searchQuery, setSearchQuery] = useState<string>('react fiber reconciliation')
  const [bm25K1, setBm25K1] = useState<number>(1.5) // Term saturation
  const [bm25B, setBm25B] = useState<number>(0.75) // Length normalization

  // Trie Autocomplete State
  const [triePrefix, setTriePrefix] = useState<string>('rec')

  // Tokenize text helper
  const tokenize = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP_WORDS.has(w))
  }

  // Build Inverted Index
  const invertedIndex = useMemo(() => {
    const index: Record<string, { docId: string; tf: number }[]> = {}
    SAMPLE_DOCS.forEach(doc => {
      const tokens = tokenize(`${doc.title} ${doc.content}`)
      const counts: Record<string, number> = {}
      tokens.forEach(t => {
        counts[t] = (counts[t] || 0) + 1
      })
      Object.entries(counts).forEach(([term, tf]) => {
        if (!index[term]) index[term] = []
        index[term].push({ docId: doc.id, tf })
      })
    })
    return index
  }, [])

  // BM25 Score calculation
  const searchResults = useMemo(() => {
    const queryTokens = tokenize(searchQuery)
    if (queryTokens.length === 0) return []

    const N = SAMPLE_DOCS.length
    const avgdl =
      SAMPLE_DOCS.reduce((sum, d) => sum + tokenize(`${d.title} ${d.content}`).length, 0) / N

    const scores: Record<string, number> = {}

    queryTokens.forEach(term => {
      const postings = invertedIndex[term] || []
      const df = postings.length
      if (df === 0) return

      // Standard Lucene/BM25 IDF
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5))

      postings.forEach(({ docId, tf }) => {
        const doc = SAMPLE_DOCS.find(d => d.id === docId)!
        const docLen = tokenize(`${doc.title} ${doc.content}`).length
        const tfNorm = (tf * (bm25K1 + 1)) / (tf + bm25K1 * (1 - bm25B + bm25B * (docLen / avgdl)))
        scores[docId] = (scores[docId] || 0) + idf * tfNorm
      })
    })

    return Object.entries(scores)
      .map(([docId, score]) => ({
        doc: SAMPLE_DOCS.find(d => d.id === docId)!,
        score: Math.round(score * 100) / 100,
      }))
      .sort((a, b) => b.score - a.score)
  }, [searchQuery, bm25K1, bm25B, invertedIndex])

  // Sample Trie vocabulary
  const trieKeywords = [
    'reconciliation',
    'reconciler',
    'reactive',
    'react-fiber',
    'recursion',
    'reflow',
    'repaint',
    'redux',
    'render-tree',
    'router',
  ]

  const trieMatches = trieKeywords.filter(k =>
    k.toLowerCase().startsWith(triePrefix.toLowerCase().trim())
  )

  return (
    <div className="search-page page-enter">
      {/* Header */}
      <div className="search-header">
        <div>
          <span className="search-badge">⚡ Inverted Index &amp; BM25 Information Retrieval</span>
          <h1>Client-Side Search Engine &amp; Inverted Index Studio</h1>
          <p className="subtitle">
            Experience sub-millisecond client-side search engines: Tokenizer pipelines, Inverted Index data structures, Okapi BM25 ranking algorithms, and Prefix Trie autocomplete graphs.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="search-tabs-bar">
        <button
          type="button"
          className={`search-tab ${activeTab === 'engine' ? 'active' : ''}`}
          onClick={() => setActiveTab('engine')}
        >
          🔍 1. Live Inverted Index &amp; Search Engine
        </button>
        <button
          type="button"
          className={`search-tab ${activeTab === 'bm25' ? 'active' : ''}`}
          onClick={() => setActiveTab('bm25')}
        >
          📊 2. Okapi BM25 vs TF-IDF Ranking
        </button>
        <button
          type="button"
          className={`search-tab ${activeTab === 'trie' ? 'active' : ''}`}
          onClick={() => setActiveTab('trie')}
        >
          🌲 3. Prefix Trie &amp; Autocomplete Engine
        </button>
        <button
          type="button"
          className={`search-tab ${activeTab === 'blueprints' ? 'active' : ''}`}
          onClick={() => setActiveTab('blueprints')}
        >
          🏢 4. FAANG Client Search Blueprints (Superhuman &amp; Linear)
        </button>
      </div>

      {/* 1. SEARCH ENGINE TAB */}
      {activeTab === 'engine' && (
        <div className="engine-grid">
          {/* Left: Query Bar & Ranked Results */}
          <div className="search-col">
            <div className="card-box">
              <h3>Client-Side Search Query:</h3>
              <div className="search-input-box">
                <span className="search-mag">🔍</span>
                <input
                  type="text"
                  className="search-term-input"
                  placeholder="Search architecture concepts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="query-tokens-pill-row">
                <span>Extracted Query Tokens:</span>
                {tokenize(searchQuery).map(tok => (
                  <span key={tok} className="q-tok-pill">{tok}</span>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="results-list">
              {searchResults.length === 0 ? (
                <div className="card-box no-res">
                  <span>❌ No documents matched query terms. Try searching "fiber", "v8", "webrtc", or "reflow".</span>
                </div>
              ) : (
                searchResults.map(({ doc, score }, rIdx) => (
                  <div key={doc.id} className="card-box res-card">
                    <div className="res-top-row">
                      <span className="res-rank">#{rIdx + 1}</span>
                      <h4>{doc.title}</h4>
                      <span className="bm25-score-badge">BM25: {score}</span>
                    </div>
                    <span className="res-cat">{doc.category}</span>
                    <p className="res-content">{doc.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Inverted Index Table */}
          <div className="index-col">
            <div className="card-box">
              <div className="index-header-row">
                <h3>Inverted Index Posting Table</h3>
                <span className="terms-badge">{Object.keys(invertedIndex).length} Unique Terms</span>
              </div>
              <p className="desc">
                Inverted Index maps each unique token directly to document IDs and occurrence frequencies (TF). Enables <code>O(1)</code> constant-time term lookup instead of scanning all documents!
              </p>

              <div className="posting-table-container">
                <table className="posting-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Postings [DocID: TF]</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(invertedIndex)
                      .slice(0, 14)
                      .map(([term, postings]) => (
                        <tr key={term}>
                          <td><strong>{term}</strong></td>
                          <td>
                            <div className="postings-pills">
                              {postings.map(p => (
                                <span key={p.docId} className="post-pill">
                                  {p.docId} ({p.tf}x)
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BM25 RANKING TAB */}
      {activeTab === 'bm25' && (
        <div className="bm25-container">
          <div className="bm25-intro-banner">
            <div>
              <h3>Okapi BM25 Relevance Ranking Algorithm</h3>
              <p>
                BM25 improves upon naive TF-IDF by adding <strong>term frequency saturation</strong> (prevents keyword stuffing from dominating results) and <strong>document length normalization</strong> (penalizes abnormally long documents).
              </p>
            </div>
          </div>

          <div className="bm25-grid">
            <div className="card-box">
              <h4>BM25 Mathematical Formula</h4>
              <div className="formula-box">
                <code>
                  Score(D, Q) = Σ IDF(q) · [ tf · (k₁ + 1) ] / [ tf + k₁ · (1 - b + b · (|D| / avgdl)) ]
                </code>
              </div>

              <div className="bm25-sliders">
                <div className="b-slider-group">
                  <div className="sl-header">
                    <span>k₁ (TF Saturation):</span>
                    <strong>{bm25K1}</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.1"
                    value={bm25K1}
                    onChange={e => setBm25K1(Number(e.target.value))}
                  />
                  <span className="sl-hint">Controls how quickly term frequency saturates.</span>
                </div>

                <div className="b-slider-group">
                  <div className="sl-header">
                    <span>b (Length Normalization):</span>
                    <strong>{bm25B}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={bm25B}
                    onChange={e => setBm25B(Number(e.target.value))}
                  />
                  <span className="sl-hint">1.0 = full document length penalty, 0.0 = no length penalty.</span>
                </div>
              </div>
            </div>

            <div className="card-box">
              <h4>Why BM25 Beats Naive TF-IDF</h4>
              <div className="bm25-benefits-list">
                <div className="benefit-row">
                  <span className="b-tag good">✅ Non-linear Saturation</span>
                  <p>In TF-IDF, a document repeating a term 100 times scores 100x higher. In BM25, the gain asymptotically approaches an upper limit of <code>(k₁ + 1)</code>.</p>
                </div>

                <div className="benefit-row">
                  <span className="b-tag good">✅ Length Normalization</span>
                  <p>Matches in short, punchy titles receive higher relevance weighting than casual mentions buried inside 5,000-word articles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRIE AUTOCOMPLETE TAB */}
      {activeTab === 'trie' && (
        <div className="trie-grid">
          <div className="card-box">
            <h3>Prefix Trie (Radix Tree) Autocomplete</h3>
            <p className="desc">
              Trie nodes store characters on edges. Traversing down a prefix runs in <code>O(K)</code> time where K is the prefix length, completely independent of the total dataset size!
            </p>

            <div className="trie-input-group">
              <label>Type Keyword Prefix:</label>
              <input
                type="text"
                className="trie-input"
                placeholder="e.g. rec, re, rend..."
                value={triePrefix}
                onChange={e => setTriePrefix(e.target.value)}
              />
            </div>

            <div className="trie-traversal-display">
              <div className="trav-header">Character Path Traversal:</div>
              <div className="trav-nodes">
                <span className="node-pill root">ROOT</span>
                {triePrefix.split('').map((char, cIdx) => (
                  <span key={cIdx} className="node-pill char">
                    ➔ '{char}'
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card-box">
            <h3>Subtree Matched Autocomplete Suggestions</h3>
            <div className="trie-matches-list">
              {trieMatches.length === 0 ? (
                <div className="no-trie">No suggestions found starting with "{triePrefix}".</div>
              ) : (
                trieMatches.map(m => (
                  <div key={m} className="trie-match-item">
                    <span className="matched-prefix">{triePrefix}</span>
                    <span className="remaining-suffix">{m.slice(triePrefix.length)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && (
        <div className="bp-container">
          <div className="bp-intro-banner">
            <h3>FAANG Client-Side Search Architecture Blueprints</h3>
            <p>How modern offline-first applications deliver instantaneous zero-latency search experiences.</p>
          </div>

          <div className="bp-grid">
            <div className="card-box bp-card">
              <span className="bp-tag superhuman">⚡ Superhuman</span>
              <h4>Client-Side In-Memory Trie</h4>
              <p>
                Superhuman downloads the user’s last 100,000 emails directly into the browser and builds an in-memory prefix trie. Search queries execute in <strong>&lt;16ms (under 1 animation frame)</strong> without triggering any network requests.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag linear">📐 Linear Issue Search</span>
              <h4>Local SQLite / IndexedDB Index</h4>
              <p>
                Linear executes full-text search directly against local client storage using pre-tokenized inverted indexes. Issue filtering and keyword search update in real time with 0ms spinner latency.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag pagefind">🦀 Pagefind &amp; Minisearch</span>
              <h4>WebAssembly Sharded Inverted Index</h4>
              <p>
                Static search engines chunk inverted indexes into 20KB sharded static files, loading only the necessary token slices via HTTP range requests and executing BM25 in WebAssembly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="search-footer">
        <Link to="/local-first" className="btn btn-secondary">
          💾 Local-First &amp; Offline Sync Studio
        </Link>
        <Link to="/wasm-lab" className="btn btn-primary">
          ⚡ WebAssembly &amp; SIMD Lab →
        </Link>
      </div>
    </div>
  )
}
