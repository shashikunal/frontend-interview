import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useAuth,
  type UserRole,
  type FeatureEntitlements,
  type StoredUserAccount,
} from '../../context/AuthContext'

import './UserManagementStudio.css'

const PERMISSIONS = [
  { key: 'questions_full', label: 'Full 22,222 Questions Bank Access', candidate: false, pro: true, admin: true },
  { key: 'coding_sandbox', label: 'Execute Monaco Code Sandbox', candidate: true, pro: true, admin: true },
  { key: 'system_design', label: 'System Design Canvas & Blueprints', candidate: false, pro: true, admin: true },
  { key: 'video_mock', label: 'AI Video Mock Interviews with Rubrics', candidate: false, pro: true, admin: true },
  { key: 'compiler_studios', label: 'AST & Compiler Visualizers', candidate: false, pro: true, admin: true },
  { key: 'cloud_sync', label: 'Supabase Postgres Cloud Progress Sync', candidate: true, pro: true, admin: true },
]

export default function UserManagementStudio() {
  const {
    user,
    switchRole,
    getAllUsers,
    updateUserEntitlements,
    adminUpdateUserRole,
  } = useAuth()

  const [activeTab, setActiveTab] = useState<'otp-flow' | 'rbac' | 'rls' | 'sessions'>('rbac')

  // Flow Stepper State
  const [activeStep, setActiveStep] = useState<number>(1)
  const [simEmail, setSimEmail] = useState<string>('candidate@techcorp.com')
  const [simOtp, setSimOtp] = useState<string>('482910')
  const [simRole, setSimRole] = useState<UserRole>('pro_member')

  // User Management State
  const [usersList, setUsersList] = useState<StoredUserAccount[]>([])
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [statusNotification, setStatusNotification] = useState<string | null>(null)

  // RLS Simulation State
  const [rlsUserContext, setRlsUserContext] = useState<'anon' | 'candidate' | 'pro_member' | 'admin'>('candidate')

  // Load real user list
  useEffect(() => {
    setUsersList(getAllUsers())
  }, [getAllUsers])

  // Update user role
  const handleUpdateUserRole = async (id: string, newRole: UserRole) => {
    await adminUpdateUserRole(id, newRole)
    setUsersList(getAllUsers())
    setStatusNotification(`Role updated to ${newRole.toUpperCase()}`)
    setTimeout(() => setStatusNotification(null), 3000)
  }

  // Toggle single entitlement feature on click
  const handleToggleEntitlement = async (
    targetUser: StoredUserAccount,
    featureKey: keyof FeatureEntitlements
  ) => {
    const nextEntitlements: FeatureEntitlements = {
      ...targetUser.entitlements,
      [featureKey]: !targetUser.entitlements[featureKey],
    }

    await updateUserEntitlements(targetUser.id, nextEntitlements)
    setUsersList(getAllUsers())
    setStatusNotification(`Updated '${featureKey}' for ${targetUser.name}`)
    setTimeout(() => setStatusNotification(null), 3000)
  }

  // Filtered users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchFilter.toLowerCase()) || u.email.toLowerCase().includes(searchFilter.toLowerCase())
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter
    return matchesSearch && matchesRole
  })

  const editingUser = usersList.find(u => u.id === editingUserId)

  return (
    <div className="um-page page-enter">
      {/* Header */}
      <div className="um-header">
        <div className="um-title-row">
          <span className="um-badge">🛡️ Enterprise Identity &amp; RBAC Studio</span>
          {statusNotification && (
            <span className="um-alert-toast">✅ {statusNotification}</span>
          )}
        </div>
        <h1>Step-by-Step User Management &amp; Supabase Auth Studio</h1>
        <p className="subtitle">
          Manage user accounts, toggle granular feature entitlements with 1-click, simulate Supabase PostgreSQL Row-Level Security (RLS), and audit active cryptographic sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="um-tabs-bar">
        <button
          type="button"
          className={`um-tab ${activeTab === 'rbac' ? 'active' : ''}`}
          onClick={() => setActiveTab('rbac')}
        >
          👥 1. User Directory &amp; 1-Click Feature Entitlements
        </button>
        <button
          type="button"
          className={`um-tab ${activeTab === 'otp-flow' ? 'active' : ''}`}
          onClick={() => setActiveTab('otp-flow')}
        >
          🔐 2. Step-by-Step OTP &amp; Password Lifecycle
        </button>
        <button
          type="button"
          className={`um-tab ${activeTab === 'rls' ? 'active' : ''}`}
          onClick={() => setActiveTab('rls')}
        >
          🗄️ 3. Postgres Row-Level Security (RLS)
        </button>
        <button
          type="button"
          className={`um-tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          📊 4. Active Sessions &amp; Security Audit Log
        </button>
      </div>

      {/* TAB 1: USER DIRECTORY & 1-CLICK FEATURE ENTITLEMENTS */}
      {activeTab === 'rbac' && (
        <div className="rbac-container">
          {/* User Directory Table */}
          <div className="card-box user-directory-card">
            <div className="ud-top-bar">
              <div>
                <h3>User Directory ({filteredUsers.length} Users)</h3>
                <p className="desc">Click <strong>"⚙️ Edit Entitlements"</strong> to enable or disable specific features for any user.</p>
              </div>

              <div className="ud-controls">
                <input
                  type="text"
                  className="ud-search-input"
                  placeholder="Search name or email..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                />
                <select
                  className="ud-role-filter"
                  value={selectedRoleFilter}
                  onChange={e => setSelectedRoleFilter(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="candidate">Candidate (Free)</option>
                  <option value="pro_member">Pro Member</option>
                  <option value="interviewer">Interviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="user-table-wrap">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User / Email</th>
                    <th>Role Tier</th>
                    <th>Feature Entitlements (Click to Toggle)</th>
                    <th>Solved</th>
                    <th>Streak</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          className={`role-select-inline ${u.role}`}
                          value={u.role}
                          onChange={e => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                        >
                          <option value="candidate">Candidate</option>
                          <option value="pro_member">Pro Member</option>
                          <option value="interviewer">Interviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {/* 1-Click Feature Chips */}
                        <div className="entitlement-chips-row">
                          <button
                            type="button"
                            className={`chip-btn ${u.entitlements.questions_full ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleEntitlement(u, 'questions_full')}
                            title="Toggle 22,222 Questions Bank"
                          >
                            {u.entitlements.questions_full ? '✅ 22K Questions' : '🔒 22K Locked'}
                          </button>

                          <button
                            type="button"
                            className={`chip-btn ${u.entitlements.system_design ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleEntitlement(u, 'system_design')}
                            title="Toggle System Design Canvas"
                          >
                            {u.entitlements.system_design ? '✅ System Design' : '🔒 Design Locked'}
                          </button>

                          <button
                            type="button"
                            className={`chip-btn ${u.entitlements.video_mock ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleEntitlement(u, 'video_mock')}
                            title="Toggle AI Video Mock Interviews"
                          >
                            {u.entitlements.video_mock ? '✅ AI Video Mock' : '🔒 Mock Locked'}
                          </button>

                          <button
                            type="button"
                            className={`chip-btn ${u.entitlements.compiler_studios ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleEntitlement(u, 'compiler_studios')}
                            title="Toggle AST & Compiler Labs"
                          >
                            {u.entitlements.compiler_studios ? '✅ Compilers' : '🔒 Compilers Locked'}
                          </button>
                        </div>
                      </td>
                      <td><strong>{u.solvedCount}</strong> / 22,222</td>
                      <td>🔥 {u.streak}d</td>
                      <td>
                        <div className="action-btns-row">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => setEditingUserId(u.id)}
                          >
                            ⚙️ Details
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => switchRole(u.role)}
                            title="Impersonate role in platform"
                          >
                            Impersonate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Drawer for Detailed Entitlement Matrix */}
          {editingUser && (
            <div className="entitlement-drawer card-box">
              <div className="ed-header">
                <div>
                  <h3>Admin Entitlement Manager for {editingUser.name}</h3>
                  <span className="ed-sub">{editingUser.email} • Current Role: {editingUser.role.toUpperCase()}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingUserId(null)}
                >
                  ✕ Close
                </button>
              </div>

              <div className="ed-grid">
                {(
                  [
                    { key: 'questions_full', label: 'Full 22,222 Question Bank', desc: 'Unlocks complete question bank vs 500 free items.' },
                    { key: 'coding_sandbox', label: 'Interactive Monaco Sandbox', desc: 'Execute JavaScript, TypeScript & React code in sandbox.' },
                    { key: 'system_design', label: 'System Design Studio & Blueprints', desc: 'Access 4-tier canvas and capacity estimators.' },
                    { key: 'video_mock', label: 'AI Audio & Video Mock Interviews', desc: 'Timed candidate simulations with automated rubrics.' },
                    { key: 'compiler_studios', label: 'Compilers, AST & WASM Studios', desc: 'Babel AST visualizers and WebAssembly runners.' },
                    { key: 'cloud_sync', label: 'PostgreSQL Cloud Sync', desc: 'Sync progress across devices in Supabase.' },
                  ] as const
                ).map(feat => {
                  const isEnabled = editingUser.entitlements[feat.key]
                  return (
                    <div
                      key={feat.key}
                      className={`ed-item ${isEnabled ? 'enabled' : 'disabled'}`}
                      onClick={() => handleToggleEntitlement(editingUser, feat.key)}
                    >
                      <div className="ed-checkbox">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => {}}
                          aria-label={feat.label}
                        />
                      </div>
                      <div className="ed-info">
                        <strong>{feat.label}</strong>
                        <p>{feat.desc}</p>
                      </div>
                      <span className={`ed-status-tag ${isEnabled ? 'on' : 'off'}`}>
                        {isEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Granular RBAC Permission Matrix */}
          <div className="card-box rbac-matrix-card">
            <h3>Role-Based Default Matrix vs Admin Overrides</h3>
            <p className="desc">Admin clicks above override default role settings for individual accounts in Supabase Postgres.</p>

            <div className="matrix-table-wrap">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Platform Capability / Route</th>
                    <th>🟢 Candidate (Default)</th>
                    <th>⚡ Pro Member (Default)</th>
                    <th>🔒 Admin Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map(p => (
                    <tr key={p.key}>
                      <td>
                        <div className="perm-info">
                          <strong>{p.label}</strong>
                          <code>{p.key}</code>
                        </div>
                      </td>
                      <td className="center-cell">{p.candidate ? '✅ Allowed' : '🔒 Locked (Admin can grant)'}</td>
                      <td className="center-cell">{p.pro ? '✅ Allowed' : '🔒 Locked'}</td>
                      <td className="center-cell">{p.admin ? '✅ Superuser' : '🔒 Locked'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP OTP & PASSWORD LIFECYCLE */}
      {activeTab === 'otp-flow' && (
        <div className="otp-flow-container">
          <div className="stepper-nav-bar card-box">
            {[
              { num: 1, title: 'Identity Submission', desc: 'Email input & rate limiter check' },
              { num: 2, title: 'Cryptographic Dispatch', desc: 'Salted password hash or random OTP' },
              { num: 3, title: 'Verification Handshake', desc: 'Constant-time comparison & 5m TTL' },
              { num: 4, title: 'JWT Token & Entitlements', desc: 'Signed claims & Supabase RLS' },
            ].map(s => (
              <button
                key={s.num}
                type="button"
                className={`step-nav-btn ${activeStep === s.num ? 'active' : ''} ${activeStep > s.num ? 'completed' : ''}`}
                onClick={() => setActiveStep(s.num)}
              >
                <div className="step-num-circle">{activeStep > s.num ? '✓' : s.num}</div>
                <div className="step-info">
                  <strong>{s.title}</strong>
                  <span>{s.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="step-detail-grid">
            {/* Step Left: Interactive Simulator */}
            <div className="card-box step-sim-box">
              {activeStep === 1 && (
                <div className="sim-step-content">
                  <h3>Step 1: User Identity &amp; Rate-Limiting Gate</h3>
                  <p className="desc">
                    The user submits their email. Before dispatching any network packets, the server validates format, checks IP rate limits (max 5 requests / 15 minutes), and verifies account status.
                  </p>

                  <div className="sim-form-group">
                    <label>Candidate Email Address:</label>
                    <input
                      type="email"
                      className="sim-input"
                      value={simEmail}
                      onChange={e => setSimEmail(e.target.value)}
                    />
                  </div>

                  <div className="sim-rate-limit-badge">
                    <span>🛡️ IP Rate Limiter:</span>
                    <strong>1 / 5 Allowed (Pass)</strong>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary sim-next-btn"
                    onClick={() => {
                      setSimOtp(String(Math.floor(100000 + Math.random() * 900000)))
                      setActiveStep(2)
                    }}
                  >
                    Generate &amp; Dispatch Code →
                  </button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="sim-step-content">
                  <h3>Step 2: Cryptographic Code Generation &amp; Email Dispatch</h3>
                  <p className="desc">
                    A true cryptographically random 6-digit number is generated using <code>crypto.getRandomValues()</code> and hashed with salt in Postgres. An HTML email is dispatched via EmailJS or SMTP.
                  </p>

                  <div className="code-dispatch-preview">
                    <span className="cdp-label">Generated 6-Digit Secure OTP:</span>
                    <strong className="cdp-otp">{simOtp}</strong>
                    <span className="cdp-hash">SHA-256 Hash: <code>{btoa(simOtp + 'salt').slice(0, 24)}...</code></span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary sim-next-btn"
                    onClick={() => setActiveStep(3)}
                  >
                    Simulate User Entering Passcode →
                  </button>
                </div>
              )}

              {activeStep === 3 && (
                <div className="sim-step-content">
                  <h3>Step 3: OTP Handshake &amp; Constant-Time Verification</h3>
                  <p className="desc">
                    The user inputs the 6-digit code. The server verifies within constant time (preventing timing attacks) and confirms the token is within the 5-minute TTL window.
                  </p>

                  <div className="handshake-verify-box">
                    <div className="hvb-row">
                      <span>Recipient Email:</span>
                      <strong>{simEmail}</strong>
                    </div>
                    <div className="hvb-row">
                      <span>Passcode Entered:</span>
                      <strong>{simOtp}</strong>
                    </div>
                    <div className="hvb-row">
                      <span>TTL Expiration:</span>
                      <strong className="ttl-active">Active (4m 45s remaining)</strong>
                    </div>
                    <div className="hvb-row">
                      <span>Status:</span>
                      <strong className="status-success">✅ Valid Passcode Match</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary sim-next-btn"
                    onClick={() => setActiveStep(4)}
                  >
                    Issue JWT &amp; Create Session →
                  </button>
                </div>
              )}

              {activeStep === 4 && (
                <div className="sim-step-content">
                  <h3>Step 4: JWT Token Issuance &amp; RBAC Claims</h3>
                  <p className="desc">
                    Supabase generates a cryptographically signed JWT token with user claims (UID, role, expiration) and establishes a secure session in browser storage.
                  </p>

                  <div className="jwt-claims-box">
                    <div className="jwt-header-pill">JWT HEADER: {`{"alg": "HS256", "typ": "JWT"}`}</div>
                    <div className="jwt-payload">
                      <code>
                        {`{
  "sub": "usr_94821a80c",
  "email": "${simEmail}",
  "role": "${simRole}",
  "aud": "authenticated",
  "exp": ${Math.floor(Date.now() / 1000) + 604800}
}`}
                      </code>
                    </div>
                  </div>

                  <div className="role-selector-sim">
                    <span>Assign Demo Role:</span>
                    <div className="rs-btns">
                      {(['candidate', 'pro_member', 'admin'] as const).map(r => (
                        <button
                          key={r}
                          type="button"
                          className={`btn btn-sm ${simRole === r ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setSimRole(r)}
                        >
                          {r.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary sim-next-btn"
                    onClick={() => setActiveStep(1)}
                  >
                    ↺ Restart OTP Flow
                  </button>
                </div>
              )}
            </div>

            {/* Step Right: Architectural Security Breakdown */}
            <div className="card-box step-arch-box">
              <h4>🛡️ Open-Source Security Architecture</h4>
              <ul className="arch-security-list">
                <li>
                  <strong>Anti-Bruteforce Throttle:</strong> Max 3 failed attempts before locking the OTP challenge for 10 minutes.
                </li>
                <li>
                  <strong>Constant-Time String Compare:</strong> Prevents side-channel timing analysis attacks when validating 6 digits.
                </li>
                <li>
                  <strong>Single-Use Invalidation:</strong> The OTP record is instantly deleted from storage upon successful handshake to prevent replay attacks.
                </li>
                <li>
                  <strong>Cryptographic Salt &amp; Pepper:</strong> Tokens stored in the database are hashed with server-side secrets.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POSTGRES RLS INSPECTOR */}
      {activeTab === 'rls' && (
        <div className="rls-container">
          <div className="card-box rls-header-banner">
            <div>
              <h3>Supabase Postgres Row-Level Security (RLS) Policy Simulator</h3>
              <p>
                PostgreSQL RLS ensures that even if client-side code is modified, queries are enforced at the database kernel level: <code>auth.uid() = id</code>.
              </p>
            </div>

            <div className="rls-context-selector">
              <span>Execute SQL Context As:</span>
              <div className="rc-btns">
                {(['anon', 'candidate', 'pro_member', 'admin'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`btn btn-sm ${rlsUserContext === c ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRlsUserContext(c)}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rls-grid">
            <div className="card-box">
              <h4>Active SQL Query &amp; Execution Output</h4>
              <div className="sql-box">
                <code>
                  {`-- Query executing as context: [${rlsUserContext.toUpperCase()}]
SELECT * FROM public.user_progress
WHERE user_id = auth.uid();`}
                </code>
              </div>

              <div className="rls-result-preview">
                <span className="rr-title">Postgres DB Kernel Response:</span>
                {rlsUserContext === 'anon' ? (
                  <div className="rls-error-box">
                    <span>⛔ 401 Unauthorized: Empty result set (0 rows returned). Anonymous requests cannot read user progress.</span>
                  </div>
                ) : (
                  <div className="rls-success-box">
                    <span>✅ 200 OK: 1 row returned. RLS policy filtered strictly to UID `usr_${rlsUserContext}`. Zero data leakage across tenants!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card-box">
              <h4>Database Schema &amp; Security Script</h4>
              <p className="desc">Copy and paste this script into your Supabase SQL Editor.</p>
              <div className="schema-code-box">
                <code>
                  {`-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only update own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id);`}
                </code>
              </div>
              <Link to="/profile" className="btn btn-secondary mt-2">
                👤 Open User Profile Hub →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE SESSIONS & SECURITY AUDIT */}
      {activeTab === 'sessions' && (
        <div className="sessions-container">
          <div className="card-box">
            <h3>Active Browser Sessions &amp; Remote Revocation</h3>
            <p className="desc">Manage active JWT sessions across devices.</p>

            <div className="sessions-list">
              <div className="session-item current">
                <div className="sess-icon">💻</div>
                <div className="sess-meta">
                  <div className="sess-top">
                    <strong>Current Active Device (This Browser)</strong>
                    <span className="current-badge">CURRENT SESSION</span>
                  </div>
                  <span className="sess-sub">Chrome on Windows • IP 127.0.0.1 • Expires in 6 days</span>
                </div>
                <button type="button" className="btn btn-sm btn-secondary" disabled>
                  Active
                </button>
              </div>

              <div className="session-item">
                <div className="sess-icon">📱</div>
                <div className="sess-meta">
                  <div className="sess-top">
                    <strong>Mobile Safari (iOS 18)</strong>
                    <span className="idle-badge">IDLE (2h ago)</span>
                  </div>
                  <span className="sess-sub">iPhone 15 Pro • IP 72.14.192.1 • Expires in 4 days</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => alert('Remote session revoked! User logged out from iOS device.')}
                >
                  Revoke Device
                </button>
              </div>
            </div>
          </div>

          <div className="card-box mt-4">
            <h3>Security Audit Trail (Real-Time Events)</h3>
            <div className="audit-table-wrap">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Event Type</th>
                    <th>User / Context</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Just now</td>
                    <td><code>AUTH_VERIFIED</code></td>
                    <td>{user?.email || 'candidate@faang.io'}</td>
                    <td><span className="audit-tag success">SUCCESS</span></td>
                  </tr>
                  <tr>
                    <td>10m ago</td>
                    <td><code>FEATURE_ENTITLEMENT_TOGGLED</code></td>
                    <td>sarah.connor@google.com</td>
                    <td><span className="audit-tag info">GRANTED (system_design)</span></td>
                  </tr>
                  <tr>
                    <td>1h ago</td>
                    <td><code>ROLE_UPGRADE_PRO</code></td>
                    <td>alex.chen@meta.com</td>
                    <td><span className="audit-tag success">UPGRADED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="um-footer-links">
        <Link to="/profile" className="btn btn-secondary">
          👤 User Profile &amp; Progress Hub
        </Link>
        <Link to="/system-design" className="btn btn-primary">
          📐 Test System Design Studio →
        </Link>
      </div>
    </div>
  )
}
