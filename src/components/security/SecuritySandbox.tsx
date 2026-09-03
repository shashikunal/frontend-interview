import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './SecuritySandbox.css'

export default function SecuritySandbox() {
  const [activeTab, setActiveTab] = useState<'xss' | 'csrf' | 'clickjacking' | 'prototype' | 'cheatsheet'>('xss')

  // 1. XSS STATE
  const [xssInput, setXssInput] = useState<string>('<img src=x onerror="alert(\'XSS: Cookie Stolen!\')">')
  const [enableDomPurify, setEnableDomPurify] = useState<boolean>(false)
  const [enableCsp, setEnableCsp] = useState<boolean>(false)
  const [xssExecutedAlert, setXssExecutedAlert] = useState<string | null>(null)

  // 2. CSRF STATE
  const [enableSameSite, setEnableSameSite] = useState<boolean>(false)
  const [enableCsrfToken, setEnableCsrfToken] = useState<boolean>(false)
  const [csrfLog, setCsrfLog] = useState<string | null>(null)

  // 3. CLICKJACKING STATE
  const [iframeOpacity, setIframeOpacity] = useState<number>(0.15)
  const [enableXFrameOptions, setEnableXFrameOptions] = useState<boolean>(false)
  const [clickjackLog, setClickjackLog] = useState<string | null>(null)

  // 4. PROTOTYPE POLLUTION STATE
  const [enableObjectCreateNull, setEnableObjectCreateNull] = useState<boolean>(false)
  const [protoPollutionResult, setProtoPollutionResult] = useState<{
    polluted: boolean
    message: string
  } | null>(null)

  // Security Posture Score (0-100%)
  const securityScore = useMemo(() => {
    let score = 0
    if (enableDomPurify) score += 15
    if (enableCsp) score += 15
    if (enableSameSite) score += 15
    if (enableCsrfToken) score += 15
    if (enableXFrameOptions) score += 20
    if (enableObjectCreateNull) score += 20
    return score
  }, [enableDomPurify, enableCsp, enableSameSite, enableCsrfToken, enableXFrameOptions, enableObjectCreateNull])

  // XSS Execution Simulation
  const handleTestXss = () => {
    if (enableDomPurify) {
      setXssExecutedAlert('🛡️ SAFE: DOMPurify stripped the malicious onerror payload. Zero script executed.')
    } else if (enableCsp) {
      setXssExecutedAlert('🛡️ BLOCKED BY CSP: Browser refused to execute inline script due to Content-Security-Policy (script-src \'self\').')
    } else {
      setXssExecutedAlert('🚨 VULNERABILITY EXPLOITED! Injected inline script executed. Stolen Cookie: "auth_token=eyJhbGciOiJIUzI1NiIsIn..."')
    }
  }

  // CSRF Execution Simulation
  const handleTestCsrf = () => {
    if (enableSameSite) {
      setCsrfLog('🛡️ BLOCKED BY SAMESITE: Browser stripped ambient session cookies because the request originated from a cross-site context.')
    } else if (enableCsrfToken) {
      setCsrfLog('🛡️ REJECTED BY SERVER: Request header missing valid X-CSRF-Token. Transaction aborted.')
    } else {
      setCsrfLog('🚨 CSRF EXPLOITED! Ambient cookies automatically attached. Transferred $5,000 to attacker account!')
    }
  }

  // Prototype Pollution Simulation
  const handleTestProtoPollution = () => {
    if (enableObjectCreateNull) {
      setProtoPollutionResult({
        polluted: false,
        message: '🛡️ SAFE: Target object created with Object.create(null) has no prototype chain. Pollution thwarted!',
      })
    } else {
      setProtoPollutionResult({
        polluted: true,
        message: '🚨 CRITICAL: Object.prototype was polluted! Global expression ({}).isAdmin evaluated to true across the entire JavaScript runtime!',
      })
    }
  }

  return (
    <div className="security-page page-enter">
      {/* Header */}
      <div className="security-header">
        <div>
          <span className="sec-badge">🔒 OWASP Top 10 Interactive Security Lab</span>
          <h1>Web Security &amp; OWASP Defense Sandbox</h1>
          <p className="subtitle">
            Hands-on exploit demonstrations and defense hardening for Cross-Site Scripting (XSS), CSRF, Clickjacking, and Prototype Pollution.
          </p>
        </div>

        {/* Security Posture Gauge */}
        <div className="posture-card">
          <span className="posture-label">Security Posture</span>
          <span className={`posture-val ${securityScore >= 80 ? 'good' : securityScore >= 40 ? 'warn' : 'bad'}`}>
            {securityScore}%
          </span>
          <span className="posture-sub">
            {securityScore === 100 ? '✅ Hardened Enterprise Grade' : '⚠️ Defenses Required'}
          </span>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="sec-tabs-bar">
        <button
          type="button"
          className={`sec-tab ${activeTab === 'xss' ? 'active' : ''}`}
          onClick={() => setActiveTab('xss')}
        >
          💉 1. Cross-Site Scripting (XSS)
        </button>
        <button
          type="button"
          className={`sec-tab ${activeTab === 'csrf' ? 'active' : ''}`}
          onClick={() => setActiveTab('csrf')}
        >
          🍪 2. Cross-Site Request Forgery (CSRF)
        </button>
        <button
          type="button"
          className={`sec-tab ${activeTab === 'clickjacking' ? 'active' : ''}`}
          onClick={() => setActiveTab('clickjacking')}
        >
          🖼️ 3. Clickjacking &amp; UI Redressing
        </button>
        <button
          type="button"
          className={`sec-tab ${activeTab === 'prototype' ? 'active' : ''}`}
          onClick={() => setActiveTab('prototype')}
        >
          ☣️ 4. Prototype Pollution
        </button>
        <button
          type="button"
          className={`sec-tab ${activeTab === 'cheatsheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('cheatsheet')}
        >
          🛡️ FAANG Security Cheatsheet
        </button>
      </div>

      {/* 1. XSS LAB */}
      {activeTab === 'xss' && (
        <div className="lab-grid">
          <div className="lab-card">
            <h3>💉 Cross-Site Scripting (XSS) Attack Vector</h3>
            <p className="lab-desc">
              Occurs when an application includes untrusted data in a web page without proper validation or escaping, allowing attackers to execute scripts in the victim's browser.
            </p>

            <div className="input-group">
              <label>Malicious Input Payload:</label>
              <textarea
                className="sec-input"
                value={xssInput}
                onChange={e => setXssInput(e.target.value)}
                rows={3}
              />
            </div>

            <div className="defenses-panel">
              <h4>Defensive Hardening Controls:</h4>
              <label className="checkbox-toggle">
                <input
                  type="checkbox"
                  checked={enableDomPurify}
                  onChange={e => setEnableDomPurify(e.target.checked)}
                />
                <span>Enable <code>DOMPurify.sanitize()</code> HTML Sanitization</span>
              </label>

              <label className="checkbox-toggle">
                <input
                  type="checkbox"
                  checked={enableCsp}
                  onChange={e => setEnableCsp(e.target.checked)}
                />
                <span>Enforce Strict CSP (<code>script-src 'self' 'nonce-...'</code>)</span>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-danger execute-exploit-btn"
              onClick={handleTestXss}
            >
              ⚡ Inject Payload &amp; Test Render
            </button>

            {xssExecutedAlert && (
              <div className={`exploit-feedback-box ${xssExecutedAlert.includes('🚨') ? 'compromised' : 'secured'}`}>
                {xssExecutedAlert}
              </div>
            )}
          </div>

          <div className="lab-card info-card">
            <h4>XSS Prevention Golden Rules:</h4>
            <ul className="rules-list">
              <li><strong>Context-Aware Escaping:</strong> Never use <code>innerHTML</code> or React's <code>dangerouslySetInnerHTML</code> without cryptographic sanitization.</li>
              <li><strong>Content Security Policy (CSP):</strong> Disallow <code>'unsafe-inline'</code> and require cryptographic nonces on all script tags.</li>
              <li><strong>HttpOnly Cookie Flag:</strong> Sensitive session tokens stored with <code>HttpOnly</code> cannot be accessed by JavaScript via <code>document.cookie</code>.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 2. CSRF LAB */}
      {activeTab === 'csrf' && (
        <div className="lab-grid">
          <div className="lab-card">
            <h3>🍪 Cross-Site Request Forgery (CSRF)</h3>
            <p className="lab-desc">
              Forces an authenticated user to execute unwanted actions on a web application where they are currently authenticated, leveraging ambient cookies.
            </p>

            <div className="request-preview-box">
              <strong>Simulated Malicious Phishing Site Payload:</strong>
              <code>{`<img src="https://bank.com/api/transfer?amount=5000&to=attacker">`}</code>
            </div>

            <div className="defenses-panel">
              <h4>Defensive Hardening Controls:</h4>
              <label className="checkbox-toggle">
                <input
                  type="checkbox"
                  checked={enableSameSite}
                  onChange={e => setEnableSameSite(e.target.checked)}
                />
                <span>Set Cookie Attribute <code>SameSite=Strict</code> (or <code>Lax</code>)</span>
              </label>

              <label className="checkbox-toggle">
                <input
                  type="checkbox"
                  checked={enableCsrfToken}
                  onChange={e => setEnableCsrfToken(e.target.checked)}
                />
                <span>Require Synchronizer Anti-CSRF Token Header (<code>X-CSRF-Token</code>)</span>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-danger execute-exploit-btn"
              onClick={handleTestCsrf}
            >
              ⚡ Simulate Cross-Origin Attack Request
            </button>

            {csrfLog && (
              <div className={`exploit-feedback-box ${csrfLog.includes('🚨') ? 'compromised' : 'secured'}`}>
                {csrfLog}
              </div>
            )}
          </div>

          <div className="lab-card info-card">
            <h4>CSRF Defense Deep-Dive:</h4>
            <ul className="rules-list">
              <li><strong>SameSite Cookies:</strong> <code>SameSite=Strict</code> prevents cookies from ever being sent on cross-site requests.</li>
              <li><strong>Custom Request Headers:</strong> Browser CORS blocks cross-origin requests from sending custom headers like <code>X-CSRF-Token</code> without preflight approval.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. CLICKJACKING LAB */}
      {activeTab === 'clickjacking' && (
        <div className="lab-grid">
          <div className="lab-card">
            <h3>🖼️ Clickjacking &amp; UI Redressing</h3>
            <p className="lab-desc">
              Deceives users into clicking an invisible, transparent iframe embedded over an innocuous button (e.g. "Claim Free Gift").
            </p>

            {/* Interactive Opacity Slider */}
            <div className="slider-group">
              <label>
                Iframe Disguise Transparency (Attacker Opacity): <strong>{Math.round(iframeOpacity * 100)}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={iframeOpacity}
                onChange={e => setIframeOpacity(Number(e.target.value))}
              />
            </div>

            {/* Clickjacking Overlay Simulator */}
            <div className="clickjack-sandbox-stage">
              {/* Fake Top Decoy Layer */}
              <button
                type="button"
                className="decoy-btn"
                onClick={() => {
                  if (enableXFrameOptions) {
                    setClickjackLog('🛡️ BLOCKED BY X-FRAME-OPTIONS: Embedding refused by iframe host.')
                  } else {
                    setClickjackLog('🚨 DECEIVED: User clicked "Claim $500 Gift Card", but the invisible iframe captured the click and executed "Delete Account"!')
                  }
                }}
              >
                🎁 Click Here to Claim Free $500 Gift Card!
              </button>

              {/* Hidden Target Layer */}
              <div
                className="hidden-target-layer"
                style={{ opacity: iframeOpacity }}
              >
                <span className="hidden-tag">Invisible Iframe (Bank App)</span>
                <button type="button" className="btn btn-danger btn-sm">
                  ⚠️ Permanently Delete Account
                </button>
              </div>
            </div>

            <div className="defenses-panel">
              <h4>Defensive Hardening Controls:</h4>
              <label className="checkbox-toggle">
                <input
                  type="checkbox"
                  checked={enableXFrameOptions}
                  onChange={e => setEnableXFrameOptions(e.target.checked)}
                />
                <span>Set Header <code>X-Frame-Options: DENY</code> / CSP <code>frame-ancestors 'none'</code></span>
              </label>
            </div>

            {clickjackLog && (
              <div className={`exploit-feedback-box ${clickjackLog.includes('🚨') ? 'compromised' : 'secured'}`}>
                {clickjackLog}
              </div>
            )}
          </div>

          <div className="lab-card info-card">
            <h4>Clickjacking Mitigation:</h4>
            <ul className="rules-list">
              <li><strong>Content Security Policy:</strong> <code>frame-ancestors 'none'</code> is the modern, robust standard.</li>
              <li><strong>X-Frame-Options:</strong> Legacy HTTP header (<code>DENY</code> or <code>SAMEORIGIN</code>).</li>
            </ul>
          </div>
        </div>
      )}

      {/* 4. PROTOTYPE POLLUTION LAB */}
      {activeTab === 'prototype' && (
        <div className="lab-grid">
          <div className="lab-card">
            <h3>☣️ JavaScript Prototype Pollution</h3>
            <p className="lab-desc">
              Occurs when an attacker injects properties into <code>Object.prototype</code> via recursive deep merges or query string parsers, altering global behavior across all application objects.
            </p>

            <div className="request-preview-box">
              <strong>Malicious JSON Payload:</strong>
              <code>{`{\n  "__proto__": {\n    "isAdmin": true,\n    "canDeleteDatabase": true\n  }\n}`}</code>
            </div>

            <div className="defenses-panel">
              <h4>Defensive Hardening Controls:</h4>
              <label className="checkbox-toggle">
                <input
                  type="checkbox"
                  checked={enableObjectCreateNull}
                  onChange={e => setEnableObjectCreateNull(e.target.checked)}
                />
                <span>Instantiate with <code>Object.create(null)</code> or <code>new Map()</code> (No Prototype)</span>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-danger execute-exploit-btn"
              onClick={handleTestProtoPollution}
            >
              ⚡ Deep Merge Payload into Application Store
            </button>

            {protoPollutionResult && (
              <div className={`exploit-feedback-box ${protoPollutionResult.polluted ? 'compromised' : 'secured'}`}>
                {protoPollutionResult.message}
              </div>
            )}
          </div>

          <div className="lab-card info-card">
            <h4>Prototype Pollution Defenses:</h4>
            <ul className="rules-list">
              <li><strong>Prototype-less Objects:</strong> Use <code>Object.create(null)</code> for dictionary lookups.</li>
              <li><strong>Map over Object:</strong> Prefer modern <code>Map</code> data structures for dynamic key-value storage.</li>
              <li><strong>Object.freeze:</strong> Call <code>Object.freeze(Object.prototype)</code> in application bootstrapping scripts.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 5. CHEATSHEET TAB */}
      {activeTab === 'cheatsheet' && (
        <div className="cheatsheet-container">
          <div className="cheatsheet-banner">
            <h3>FAANG Security Architecture Cheatsheet</h3>
            <p>Master the essential security concepts evaluated in Senior and Staff frontend interview loops.</p>
          </div>

          <div className="cheatsheet-grid">
            <div className="cheat-card">
              <h4>1. Content Security Policy (CSP)</h4>
              <p>HTTP response header restricting origins from which scripts, images, styles, and frames can load. Eliminates XSS when combined with nonces.</p>
              <code>Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m'; frame-ancestors 'none';</code>
            </div>

            <div className="cheat-card">
              <h4>2. CORS &amp; Preflight (OPTIONS)</h4>
              <p>Cross-Origin Resource Sharing mechanism. Browsers send an <code>OPTIONS</code> preflight request before non-simple HTTP methods (PUT/DELETE or custom headers).</p>
              <code>Access-Control-Allow-Origin: https://app.faang.com<br/>Access-Control-Allow-Methods: GET, POST, OPTIONS</code>
            </div>

            <div className="cheat-card">
              <h4>3. Subresource Integrity (SRI)</h4>
              <p>Ensures third-party CDN scripts have not been tampered with by verifying a cryptographic SHA-384 hash before execution.</p>
              <code>{`<script src="https://cdn.com/lib.js" integrity="sha384-..." crossorigin="anonymous"></script>`}</code>
            </div>

            <div className="cheat-card">
              <h4>4. Cookie Security Flags</h4>
              <p>Triple-lock security attributes for sensitive session authentication cookies.</p>
              <code>Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Path=/</code>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="security-footer">
        <Link to="/code-review" className="btn btn-secondary">
          🔍 AI Static Code Reviewer
        </Link>
        <Link to="/case-studies" className="btn btn-primary">
          📐 FAANG Architecture Case Studies →
        </Link>
      </div>
    </div>
  )
}
