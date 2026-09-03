import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProtocolPlayground.css'

export default function ProtocolPlayground() {
  const [activeTab, setActiveTab] = useState<'fetching' | 'n-plus-one' | 'protobuf' | 'matrix'>('fetching')

  // 1. Over-fetching state
  const [selectedProtocol, setSelectedProtocol] = useState<'rest' | 'graphql'>('rest')

  // 2. N+1 state
  const [useDataLoader, setUseDataLoader] = useState<boolean>(false)

  // 3. GraphQL Field Selector
  const [selectedFields, setSelectedFields] = useState<{
    id: boolean
    username: boolean
    avatarUrl: boolean
    followerCount: boolean
    billingHistory: boolean
    oauthTokens: boolean
  }>({
    id: true,
    username: true,
    avatarUrl: true,
    followerCount: true,
    billingHistory: false,
    oauthTokens: false,
  })

  const toggleField = (field: keyof typeof selectedFields) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="protocol-page page-enter">
      {/* Header */}
      <div className="protocol-header">
        <div>
          <span className="protocol-badge">🌐 Network API Protocols &amp; Architecture Lab</span>
          <h1>GraphQL vs. REST vs. gRPC-Web Protocol Studio</h1>
          <p className="subtitle">
            Simulate over-fetching, eliminate N+1 query bottlenecks with DataLoader batching, benchmark Protobuf binary serialization, and master protocol trade-offs.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="protocol-tabs-bar">
        <button
          type="button"
          className={`proto-tab ${activeTab === 'fetching' ? 'active' : ''}`}
          onClick={() => setActiveTab('fetching')}
        >
          📡 1. Over-fetching &amp; Under-fetching Lab
        </button>
        <button
          type="button"
          className={`proto-tab ${activeTab === 'n-plus-one' ? 'active' : ''}`}
          onClick={() => setActiveTab('n-plus-one')}
        >
          ⚡ 2. The N+1 Problem &amp; DataLoader
        </button>
        <button
          type="button"
          className={`proto-tab ${activeTab === 'protobuf' ? 'active' : ''}`}
          onClick={() => setActiveTab('protobuf')}
        >
          📦 3. JSON vs Protobuf Binary (gRPC-Web)
        </button>
        <button
          type="button"
          className={`proto-tab ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          📊 4. FAANG Protocol Decision Matrix
        </button>
      </div>

      {/* 1. OVER-FETCHING & UNDER-FETCHING LAB */}
      {activeTab === 'fetching' && (
        <div className="fetching-grid">
          {/* Controls column */}
          <div className="fetching-controls-col">
            <div className="card-box">
              <h3>Client UI Requirement: User Profile Header</h3>
              <p className="desc">
                Mobile app screen only needs 3 basic fields: <code>username</code>, <code>avatarUrl</code>, and <code>followerCount</code>.
              </p>

              <div className="protocol-toggle-bar">
                <button
                  type="button"
                  className={`proto-toggle-btn ${selectedProtocol === 'rest' ? 'active' : ''}`}
                  onClick={() => setSelectedProtocol('rest')}
                >
                  REST API (Fixed Endpoints)
                </button>
                <button
                  type="button"
                  className={`proto-toggle-btn ${selectedProtocol === 'graphql' ? 'active' : ''}`}
                  onClick={() => setSelectedProtocol('graphql')}
                >
                  GraphQL (Declarative Query)
                </button>
              </div>

              {selectedProtocol === 'graphql' && (
                <div className="fields-selector-panel">
                  <h4>Select Requested GraphQL Fields:</h4>
                  <div className="fields-checkbox-grid">
                    {Object.keys(selectedFields).map(f => (
                      <label key={f} className="field-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedFields[f as keyof typeof selectedFields]}
                          onChange={() => toggleField(f as keyof typeof selectedFields)}
                        />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Telemetry Stats */}
              <div className="telemetry-stats-row">
                <div className="telemetry-stat">
                  <span className="t-label">Wire Payload Size</span>
                  <span className={`t-val ${selectedProtocol === 'rest' ? 'bad' : 'good'}`}>
                    {selectedProtocol === 'rest' ? '48.4 KB (Over-fetched)' : '1.2 KB (Optimal)'}
                  </span>
                </div>

                <div className="telemetry-stat">
                  <span className="t-label">Network Roundtrips</span>
                  <span className={`t-val ${selectedProtocol === 'rest' ? 'bad' : 'good'}`}>
                    {selectedProtocol === 'rest' ? '3 Roundtrips (Under-fetched)' : '1 Single Roundtrip'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Response Payload column */}
          <div className="fetching-payload-col">
            <div className="card-box">
              <div className="payload-header-row">
                <h3>HTTP Response Payload Preview</h3>
                <span className="status-code-tag">200 OK</span>
              </div>

              {selectedProtocol === 'rest' ? (
                <pre className="payload-pre">
                  <code>{`// GET /api/v1/users/9482 (48.4 KB Payload)
{
  "id": "usr_9482",
  "username": "alexchen",
  "avatarUrl": "https://cdn.faang.io/avatars/9482.png",
  "followerCount": 4280,
  // ❌ UNNECESSARY OVER-FETCHED FIELDS FOR THIS SCREEN:
  "email": "alex@faang.com",
  "phoneNumber": "+1-415-555-0199",
  "homeAddress": { "street": "1 Hacker Way", "zip": "94025" },
  "billingHistory": [ { "invId": "inv_1", "amount": 29.99 }, ... 40 more ],
  "oauthTokens": { "stripe": "tok_live_...", "google": "ya29.a0..." },
  "deviceTelemetry": { "lastIp": "192.0.2.1", "gpu": "Apple M3" }
}`}</code>
                </pre>
              ) : (
                <pre className="payload-pre">
                  <code>{`// POST /graphql (1.2 KB Exact Payload)
// query { user(id: "usr_9482") { ${Object.entries(selectedFields).filter(([, v]) => v).map(([k]) => k).join(' ')} } }
{
  "data": {
    "user": {
${Object.entries(selectedFields)
  .filter(([, v]) => v)
  .map(([k]) => `      "${k}": ${k === 'id' ? '"usr_9482"' : k === 'username' ? '"alexchen"' : k === 'avatarUrl' ? '"https://cdn.faang.io/9482.png"' : k === 'followerCount' ? '4280' : 'true'}`)
  .join(',\n')}
    }
  }
}`}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. N+1 PROBLEM & DATALOADER LAB */}
      {activeTab === 'n-plus-one' && (
        <div className="n1-container">
          <div className="n1-intro-banner">
            <div>
              <h3>The GraphQL N+1 Query Problem</h3>
              <p>
                When resolving 10 Posts and each Post's Author, naive resolvers execute 1 query for posts + 10 individual queries for each author. <strong>DataLoader</strong> batches keys in a single event-loop tick.
              </p>
            </div>

            <button
              type="button"
              className={`btn ${useDataLoader ? 'btn-primary' : 'btn-danger'} n1-toggle-btn`}
              onClick={() => setUseDataLoader(prev => !prev)}
            >
              {useDataLoader ? '⚡ DataLoader Active (Batched)' : '❌ Naive Resolvers (N+1 Bug)'}
            </button>
          </div>

          <div className="n1-queries-grid">
            <div className="card-box">
              <h4>Database Query Execution Stream ({useDataLoader ? '2 Queries' : '11 Queries'})</h4>

              <div className="sql-stream">
                <div className="sql-entry main-query">
                  <span className="sql-tag">Query 1</span>
                  <code>SELECT * FROM posts LIMIT 10;</code>
                </div>

                {useDataLoader ? (
                  <div className="sql-entry batched-query">
                    <span className="sql-tag">Query 2 (Batched via DataLoader)</span>
                    <code>SELECT * FROM authors WHERE id IN (101, 102, 103, 104, 105, 106, 107, 108, 109, 110);</code>
                  </div>
                ) : (
                  Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="sql-entry slow-query">
                      <span className="sql-tag">Query {i + 2} (N+1 Sequential Hit)</span>
                      <code>SELECT * FROM authors WHERE id = {101 + i};</code>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card-box">
              <h4>DataLoader Implementation (Node.js)</h4>
              <pre className="code-snippet">
                <code>{`import DataLoader from 'dataloader';

// Batches array of authorIds into a single SQL query
const authorLoader = new DataLoader(async (authorIds: readonly string[]) => {
  const authors = await db.authors.findMany({
    where: { id: { in: [...authorIds] } }
  });

  // Return authors mapped in exact order of input authorIds
  return authorIds.map(id => authors.find(a => a.id === id));
});

// GraphQL Resolver:
const postResolvers = {
  author: (post) => authorLoader.load(post.authorId)
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROTOBUF BINARY LAB */}
      {activeTab === 'protobuf' && (
        <div className="protobuf-grid">
          <div className="card-box">
            <h3>Text JSON (REST / GraphQL) vs Protocol Buffers (gRPC-Web)</h3>
            <p className="desc">
              Protocol Buffers (Protobuf) encode strongly-typed schemas into compact binary wire formats, eliminating JSON key repetition and string parsing overhead.
            </p>

            <div className="proto-stats-row">
              <div className="proto-stat">
                <span className="p-title">JSON Size</span>
                <strong className="bad">4,820 Bytes</strong>
              </div>
              <div className="proto-stat">
                <span className="p-title">Protobuf Binary Size</span>
                <strong className="good">1,190 Bytes (-75%)</strong>
              </div>
            </div>

            <pre className="proto-code-box">
              <code>{`// Proto Schema Definition: user.proto
syntax = "proto3";

message UserProfileResponse {
  string user_id = 1;
  string username = 2;
  string avatar_url = 3;
  int32 follower_count = 4;
  repeated string badges = 5;
}

service UserRpcService {
  rpc GetProfile (UserRequest) returns (UserProfileResponse);
}`}</code>
            </pre>
          </div>

          <div className="card-box">
            <h3>Wire Comparison (Hex Binary Representation)</h3>
            <pre className="binary-preview">
              <code>{`// Protobuf Binary Encoding (Hex Stream):
08 01 12 08 61 6c 65 78 63 68 65 6e 1a 1f 68 74
74 70 73 3a 2f 2f 63 64 6e 2e 66 61 61 6e 67 2e
69 6f 2f 39 34 38 32 20 b8 21 2a 0a 73 74 61 66
66 5f 73 77 65

// Benefits:
// 1. Zero string key transmission ("username", "avatar_url" replaced with 1-byte field tags)
// 2. Variable-length integer encoding (Varints)
// 3. Instant binary-to-memory deserialization without JS JSON.parse() blocking`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* 4. DECISION MATRIX TAB */}
      {activeTab === 'matrix' && (
        <div className="matrix-container">
          <div className="matrix-intro-banner">
            <h3>FAANG API Protocol Decision Matrix</h3>
            <p>Architectural trade-off evaluation guide for Staff Frontend System Design loops.</p>
          </div>

          <div className="matrix-table-wrap">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>REST API</th>
                  <th>GraphQL</th>
                  <th>gRPC-Web / gRPC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Best Use Case</strong></td>
                  <td>Public APIs, Simple CRUD, Standard Caching</td>
                  <td>Complex Client UI Graphs, Mobile Apps</td>
                  <td>High-throughput Internal Microservices</td>
                </tr>
                <tr>
                  <td><strong>Wire Format</strong></td>
                  <td>JSON (Text)</td>
                  <td>JSON (Text)</td>
                  <td>Protocol Buffers (Binary)</td>
                </tr>
                <tr>
                  <td><strong>CDN Edge Caching</strong></td>
                  <td>✅ Native HTTP URL Caching (<code>Cache-Control</code>)</td>
                  <td>⚠️ Harder (POST body hashing required)</td>
                  <td>❌ Not supported by standard CDNs</td>
                </tr>
                <tr>
                  <td><strong>Typing &amp; Schema</strong></td>
                  <td>OpenAPI / Swagger (Optional)</td>
                  <td>✅ Strict GraphQL Schema (SDL)</td>
                  <td>✅ Strict <code>.proto</code> contracts</td>
                </tr>
                <tr>
                  <td><strong>Streaming</strong></td>
                  <td>SSE (Server-Sent Events)</td>
                  <td>GraphQL Subscriptions (WS)</td>
                  <td>✅ HTTP/2 Bidirectional Streaming</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="proto-footer">
        <Link to="/capacity-estimator" className="btn btn-secondary">
          📐 Capacity Estimator Studio
        </Link>
        <Link to="/case-studies" className="btn btn-primary">
          📐 FAANG Architecture Case Studies →
        </Link>
      </div>
    </div>
  )
}
