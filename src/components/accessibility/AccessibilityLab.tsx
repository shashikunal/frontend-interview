import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './AccessibilityLab.css'

export default function AccessibilityLab() {
  const [activeTab, setActiveTab] = useState<'screen-reader' | 'focus-trap' | 'contrast' | 'aria-tree'>('screen-reader')

  // 1. SCREEN READER SIMULATOR STATE
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true)
  const [speechLog, setSpeechLog] = useState<string[]>([
    'VoiceOver started. Focus on any component to hear simulated screen reader narration.',
  ])
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false)
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true)
  const [cartCount, setCartCount] = useState<number>(3)

  // 2. FOCUS TRAP MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const modalTriggerRef = useRef<HTMLButtonElement | null>(null)

  // 3. COLOR CONTRAST CALCULATOR STATE
  const [textColor, setTextColor] = useState<string>('#ffffff')
  const [bgColor, setBgColor] = useState<string>('#6366f1')

  // Screen Reader Speech Announcer
  const announceSpeech = (text: string) => {
    setSpeechLog(prev => [text, ...prev.slice(0, 15)])

    if (speechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.1
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  // Focus Trapping Logic for Modal
  useEffect(() => {
    if (!isModalOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusables = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return

    const firstEl = focusables[0]
    const lastEl = focusables[focusables.length - 1]

    firstEl.focus()
    announceSpeech('Dialog opened. Enter your details. First input focused.')

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
        modalTriggerRef.current?.focus()
        announceSpeech('Dialog closed.')
        return
      }

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  // WCAG Color Contrast Calculations
  const contrastRatio = useMemo(() => {
    const hexToRgb = (hex: string) => {
      const sanitized = hex.replace('#', '')
      if (sanitized.length !== 6) return [0, 0, 0]
      return [
        parseInt(sanitized.slice(0, 2), 16),
        parseInt(sanitized.slice(2, 4), 16),
        parseInt(sanitized.slice(4, 6), 16),
      ]
    }

    const getLuminance = (rgb: number[]) => {
      const a = rgb.map(v => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      })
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
    }

    const rgb1 = hexToRgb(textColor)
    const rgb2 = hexToRgb(bgColor)
    const lum1 = getLuminance(rgb1)
    const lum2 = getLuminance(rgb2)

    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    const ratio = (brightest + 0.05) / (darkest + 0.05)
    return Math.round(ratio * 100) / 100
  }, [textColor, bgColor])

  return (
    <div className="a11y-page page-enter">
      {/* Header */}
      <div className="a11y-header">
        <div>
          <span className="a11y-badge">♿ Interactive WCAG 2.1 AAA Accessibility Lab</span>
          <h1>Accessibility (a11y) &amp; Screen Reader Lab</h1>
          <p className="subtitle">
            Auditory screen reader simulation (VoiceOver/NVDA), keyboard focus trapping sandbox, WCAG 2.1 AAA contrast calculator, and live ARIA accessibility tree inspector.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="a11y-tabs-bar">
        <button
          type="button"
          className={`a11y-tab ${activeTab === 'screen-reader' ? 'active' : ''}`}
          onClick={() => setActiveTab('screen-reader')}
        >
          🎙️ Screen Reader Speech Simulator
        </button>
        <button
          type="button"
          className={`a11y-tab ${activeTab === 'focus-trap' ? 'active' : ''}`}
          onClick={() => setActiveTab('focus-trap')}
        >
          ⌨️ Keyboard Focus Trap Sandbox
        </button>
        <button
          type="button"
          className={`a11y-tab ${activeTab === 'contrast' ? 'active' : ''}`}
          onClick={() => setActiveTab('contrast')}
        >
          🎨 WCAG Contrast Ratio Calculator ({contrastRatio}:1)
        </button>
        <button
          type="button"
          className={`a11y-tab ${activeTab === 'aria-tree' ? 'active' : ''}`}
          onClick={() => setActiveTab('aria-tree')}
        >
          🌳 ARIA Accessibility Tree Inspector
        </button>
      </div>

      {/* 1. SCREEN READER SIMULATOR TAB */}
      {activeTab === 'screen-reader' && (
        <div className="screen-reader-grid">
          {/* Left: Interactive Components */}
          <div className="interactive-widgets-column">
            <div className="widgets-card">
              <div className="widgets-card-header">
                <h3>Accessible Interactive Widgets</h3>
                <button
                  type="button"
                  className={`btn btn-sm ${speechEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                >
                  {speechEnabled ? '🔊 Audio Speech: ON' : '🔇 Audio Speech: MUTED'}
                </button>
              </div>
              <p className="widgets-desc">
                Click or navigate with <kbd>Tab</kbd> to hear how assistive technology announces roles, states, and values.
              </p>

              {/* Widget 1: Primary Button */}
              <div className="widget-row">
                <span className="widget-label">1. Semantic Button with aria-label:</span>
                <button
                  type="button"
                  className="btn btn-primary"
                  aria-label="Confirm Purchase: Total $49.00 USD"
                  onFocus={() => announceSpeech('Button, Confirm Purchase: Total $49.00 USD, press enter to activate')}
                  onClick={() => announceSpeech('Confirm Purchase activated. Processing payment.')}
                >
                  💳 Pay $49.00
                </button>
              </div>

              {/* Widget 2: Accessible Accordion */}
              <div className="widget-row">
                <span className="widget-label">2. Accordion with aria-expanded &amp; aria-controls:</span>
                <div className="accordion-widget">
                  <button
                    type="button"
                    className="accordion-header-btn"
                    aria-expanded={accordionOpen}
                    aria-controls="acc-content-1"
                    onFocus={() => announceSpeech(`Button, Security and Privacy Policy, ${accordionOpen ? 'expanded' : 'collapsed'}, accordion header`)}
                    onClick={() => {
                      const next = !accordionOpen
                      setAccordionOpen(next)
                      announceSpeech(`Security and Privacy Policy, ${next ? 'expanded' : 'collapsed'}`)
                    }}
                  >
                    <span>🛡️ Security &amp; Privacy Policy</span>
                    <span className="acc-icon">{accordionOpen ? '▲' : '▼'}</span>
                  </button>
                  {accordionOpen && (
                    <div id="acc-content-1" className="accordion-body">
                      We enforce strict Content Security Policies (CSP) with cryptographic nonces and Trusted Types.
                    </div>
                  )}
                </div>
              </div>

              {/* Widget 3: WAI-ARIA Custom Checkbox */}
              <div className="widget-row">
                <span className="widget-label">3. Custom Checkbox with role="checkbox" &amp; aria-checked:</span>
                <div
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={checkboxChecked}
                  className={`custom-a11y-checkbox ${checkboxChecked ? 'checked' : ''}`}
                  onFocus={() => announceSpeech(`Checkbox, Enable Email Notifications, ${checkboxChecked ? 'checked' : 'not checked'}`)}
                  onKeyDown={e => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      const next = !checkboxChecked
                      setCheckboxChecked(next)
                      announceSpeech(`Checkbox, Enable Email Notifications, ${next ? 'checked' : 'not checked'}`)
                    }
                  }}
                  onClick={() => {
                    const next = !checkboxChecked
                    setCheckboxChecked(next)
                    announceSpeech(`Checkbox, Enable Email Notifications, ${next ? 'checked' : 'not checked'}`)
                  }}
                >
                  <span className="chk-box-visual">{checkboxChecked ? '✓' : ''}</span>
                  <span>Enable Real-Time Email Notifications</span>
                </div>
              </div>

              {/* Widget 4: Live Region */}
              <div className="widget-row">
                <span className="widget-label">4. Dynamic Live Region (aria-live="polite"):</span>
                <div className="live-region-demo">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const next = cartCount + 1
                      setCartCount(next)
                      announceSpeech(`Cart updated: ${next} items in shopping cart.`)
                    }}
                  >
                    🛒 Add Item to Cart
                  </button>
                  <div
                    aria-live="polite"
                    role="status"
                    className="live-status-pill"
                  >
                    Shopping Cart: <strong>{cartCount}</strong> items
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Screen Reader Transcript Log */}
          <div className="speech-transcript-column">
            <div className="transcript-card">
              <div className="transcript-header">
                <h4>🎙️ Live Screen Reader Speech Output</h4>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSpeechLog([])}
                >
                  Clear Log
                </button>
              </div>

              <div className="speech-log-container">
                {speechLog.map((log, i) => (
                  <div key={i} className="speech-log-item">
                    <span className="voice-icon">🗣️</span>
                    <p>{log}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FOCUS TRAP SANDBOX TAB */}
      {activeTab === 'focus-trap' && (
        <div className="focus-trap-container">
          <div className="focus-trap-intro-card">
            <h3>WAI-ARIA Modal Dialog Focus Trapping</h3>
            <p>
              In accessible dialogs (WCAG 2.1.2 No Keyboard Trap), pressing <kbd>Tab</kbd> on the last interactive element must cycle focus back to the first element, and pressing <kbd>Shift + Tab</kbd> on the first element must cycle to the last. When the dialog closes, focus must return to the original trigger element.
            </p>
            <button
              ref={modalTriggerRef}
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setIsModalOpen(true)}
            >
              🚀 Launch Accessible Modal Dialog
            </button>
          </div>

          {/* Modal Overlay */}
          {isModalOpen && (
            <div className="a11y-modal-backdrop" role="presentation">
              <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                className="a11y-modal-box"
              >
                <div className="modal-header-row">
                  <h3 id="modal-title">🔐 Enterprise Security Confirmation</h3>
                  <button
                    type="button"
                    className="modal-close-btn"
                    aria-label="Close Dialog"
                    onClick={() => {
                      setIsModalOpen(false)
                      modalTriggerRef.current?.focus()
                      announceSpeech('Dialog closed. Focus restored.')
                    }}
                  >
                    ✕
                  </button>
                </div>

                <p id="modal-desc" className="modal-desc-text">
                  Tab through the inputs below. Notice how focus is trapped within this dialog and cannot escape to the background document.
                </p>

                <div className="modal-form-fields">
                  <div className="m-field">
                    <label htmlFor="m-user-email">
                      <span className="field-step-tag">1st Focus</span> Account Email:
                    </label>
                    <input
                      id="m-user-email"
                      type="email"
                      placeholder="engineer@faang.com"
                      className="modal-input"
                    />
                  </div>

                  <div className="m-field">
                    <label htmlFor="m-2fa-code">
                      <span className="field-step-tag">2nd Focus</span> 2FA Security Token:
                    </label>
                    <input
                      id="m-2fa-code"
                      type="text"
                      placeholder="6-digit token"
                      className="modal-input"
                    />
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsModalOpen(false)
                      modalTriggerRef.current?.focus()
                      announceSpeech('Dialog cancelled. Focus restored.')
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setIsModalOpen(false)
                      modalTriggerRef.current?.focus()
                      announceSpeech('Authentication confirmed. Focus restored to launch button.')
                    }}
                  >
                    <span className="field-step-tag">3rd Focus</span> Confirm Authentication
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. COLOR CONTRAST CALCULATOR TAB */}
      {activeTab === 'contrast' && (
        <div className="contrast-grid">
          {/* Left: Inputs & Visual Preview */}
          <div className="contrast-controls-card">
            <h3>WCAG Color Luminance Simulator</h3>

            <div className="color-pickers-row">
              <div className="picker-box">
                <label>Text (Foreground) Color:</label>
                <div className="picker-input-wrap">
                  <input
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="hex-text-input"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="picker-box">
                <label>Background Color:</label>
                <div className="picker-input-wrap">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="hex-text-input"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Swatch */}
            <div
              className="contrast-live-preview"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <h4>Live Text Rendering Preview</h4>
              <p>
                Accessible typography guarantees high readability for users with low vision, color blindness, and in bright outdoor sunlight conditions.
              </p>
              <button
                type="button"
                className="preview-sample-btn"
                style={{ borderColor: textColor, color: textColor }}
              >
                Sample UI Component Button
              </button>
            </div>
          </div>

          {/* Right: WCAG Scorecard */}
          <div className="contrast-scorecard-card">
            <div className="contrast-ratio-hero">
              <span className={`ratio-number ${contrastRatio >= 7.0 ? 'aaa' : contrastRatio >= 4.5 ? 'aa' : 'fail'}`}>
                {contrastRatio} : 1
              </span>
              <span className="ratio-caption">Contrast Ratio</span>
            </div>

            <div className="wcag-checks-list">
              <div className="wcag-check-item">
                <div className="check-title-row">
                  <span>WCAG AA Normal Text (&ge; 4.5:1)</span>
                  <span className={`pass-badge ${contrastRatio >= 4.5 ? 'pass' : 'fail'}`}>
                    {contrastRatio >= 4.5 ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
                <p className="check-desc">Applies to standard body text (below 18pt or 14pt bold).</p>
              </div>

              <div className="wcag-check-item">
                <div className="check-title-row">
                  <span>WCAG AA Large Text &amp; UI Components (&ge; 3.0:1)</span>
                  <span className={`pass-badge ${contrastRatio >= 3.0 ? 'pass' : 'fail'}`}>
                    {contrastRatio >= 3.0 ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
                <p className="check-desc">Applies to headings (18pt+), form input borders, and icons.</p>
              </div>

              <div className="wcag-check-item">
                <div className="check-title-row">
                  <span>WCAG AAA Enhanced Contrast (&ge; 7.0:1)</span>
                  <span className={`pass-badge ${contrastRatio >= 7.0 ? 'pass' : 'fail'}`}>
                    {contrastRatio >= 7.0 ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
                <p className="check-desc">Government, healthcare, and enterprise gold standard.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ARIA TREE INSPECTOR TAB */}
      {activeTab === 'aria-tree' && (
        <div className="aria-tree-container">
          <div className="tree-intro-banner">
            <h3>Computed ARIA Accessibility Tree vs DOM Tree</h3>
            <p>
              Assistive technologies like screen readers do not parse CSS or layout trees directly. They read the <strong>Computed Accessibility Tree</strong> generated by browser engines (Blink/Gecko/WebKit), mapping semantic roles, names, and states.
            </p>
          </div>

          <div className="tree-comparison-grid">
            <div className="tree-card">
              <h4>❌ Non-Semantic &lt;div&gt; (Inaccessible)</h4>
              <div className="code-snippet-box">
                <code>{`<div class="btn" onClick="checkout()">\n  <span>Buy Now</span>\n</div>`}</code>
              </div>
              <div className="computed-tree-view bad">
                <strong>Computed Accessibility Tree:</strong>
                <ul>
                  <li>Role: <code>generic</code></li>
                  <li>Name: <code>"" (empty)</code></li>
                  <li>Keyboard Navigable: <code>false</code></li>
                  <li>Screen Reader Narration: <em>"Silence / Ignored"</em></li>
                </ul>
              </div>
            </div>

            <div className="tree-card">
              <h4>✅ Semantic &lt;button&gt; (100% Accessible)</h4>
              <div className="code-snippet-box">
                <code>{`<button type="button" aria-label="Purchase Premium Subscription">\n  <span>Buy Now</span>\n</button>`}</code>
              </div>
              <div className="computed-tree-view good">
                <strong>Computed Accessibility Tree:</strong>
                <ul>
                  <li>Role: <code>button</code></li>
                  <li>Name: <code>"Purchase Premium Subscription"</code></li>
                  <li>Keyboard Navigable: <code>true (Space / Enter)</code></li>
                  <li>Screen Reader Narration: <em>"Button, Purchase Premium Subscription, press enter to activate"</em></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="a11y-footer">
        <Link to="/code-review" className="btn btn-secondary">
          🔍 AI Static Code Reviewer
        </Link>
        <Link to="/system-design" className="btn btn-primary">
          🏗️ Open System Design Studio →
        </Link>
      </div>
    </div>
  )
}
