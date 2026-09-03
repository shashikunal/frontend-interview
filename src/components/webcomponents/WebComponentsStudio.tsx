import { useState } from 'react'
import { Link } from 'react-router-dom'
import './WebComponentsStudio.css'

export default function WebComponentsStudio() {
  const [activeTab, setActiveTab] = useState<'shadow-dom' | 'slots' | 'lifecycle' | 'blueprints'>('shadow-dom')

  // 1. Shadow Root Sandbox State
  const [shadowMode, setShadowMode] = useState<'open' | 'closed'>('open')
  const [hostVariant, setHostVariant] = useState<'default' | 'premium' | 'danger'>('premium')
  const [accentColor, setAccentColor] = useState<string>('#6366f1')

  // 2. Slots State
  const [badgeText, setBadgeText] = useState<string>('NEW FEATURE')
  const [titleText, setTitleText] = useState<string>('Staff Frontend Architecture')
  const [bodyText, setBodyText] = useState<string>('Encapsulated inside custom element shadow root without CSS leaks.')

  // 3. Lifecycle State
  const [currentStep, setCurrentStep] = useState<number>(2) // connectedCallback
  const [observedRating, setObservedRating] = useState<number>(5)

  const lifecycleSteps = [
    {
      name: 'constructor()',
      tag: 'INIT',
      desc: 'Invoked when custom element is instantiated (e.g. document.createElement). Attaches Shadow Root (attachShadow) and initializes internal reactive state.',
      code: `constructor() {
  super();
  this.attachShadow({ mode: '${shadowMode}' });
}`,
    },
    {
      name: 'connectedCallback()',
      tag: 'MOUNT',
      desc: 'Invoked every time the custom element is inserted into a document DOM. Ideal for rendering template, attaching window listeners, or fetching data.',
      code: `connectedCallback() {
  this.render();
  this.addEventListener('click', this.handleClick);
}`,
    },
    {
      name: 'attributeChangedCallback(name, oldValue, newValue)',
      tag: 'UPDATE',
      desc: 'Invoked when observed attributes change. Triggers re-renders without full component re-mounting.',
      code: `static get observedAttributes() { return ['rating', 'theme']; }
attributeChangedCallback(name, oldVal, newVal) {
  if (name === 'rating') this.updateRating(newVal);
}`,
    },
    {
      name: 'disconnectedCallback()',
      tag: 'UNMOUNT',
      desc: 'Invoked when custom element is removed from DOM. Essential for cleaning up timer intervals, AbortControllers, and global listeners to avoid memory leaks.',
      code: `disconnectedCallback() {
  this.removeEventListener('click', this.handleClick);
  this.abortController.abort();
}`,
    },
  ]

  return (
    <div className="wc-page page-enter">
      {/* Header */}
      <div className="wc-header">
        <div>
          <span className="wc-badge">🛡️ DOM Encapsulation &amp; Custom Elements</span>
          <h1>Shadow DOM &amp; Web Components Studio</h1>
          <p className="subtitle">
            Master Shadow Root style encapsulation (`:host`, `::slotted`), open vs closed modes, named &lt;slot&gt; content projection, and Custom Element lifecycle callbacks.
          </p>
        </div>
      </div>


      {/* Mode Tabs */}
      <div className="wc-tabs-bar">
        <button
          type="button"
          className={`wc-tab ${activeTab === 'shadow-dom' ? 'active' : ''}`}
          onClick={() => setActiveTab('shadow-dom')}
        >
          🛡️ 1. Shadow Root &amp; Style Encapsulation
        </button>
        <button
          type="button"
          className={`wc-tab ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          📥 2. Named &lt;slot&gt; Content Projection
        </button>
        <button
          type="button"
          className={`wc-tab ${activeTab === 'lifecycle' ? 'active' : ''}`}
          onClick={() => setActiveTab('lifecycle')}
        >
          🔄 3. Custom Element Lifecycle Engine
        </button>
        <button
          type="button"
          className={`wc-tab ${activeTab === 'blueprints' ? 'active' : ''}`}
          onClick={() => setActiveTab('blueprints')}
        >
          🏢 4. FAANG Framework-Agnostic Blueprints
        </button>
      </div>

      {/* 1. SHADOW DOM TAB */}
      {activeTab === 'shadow-dom' && (
        <div className="shadow-grid">
          {/* Controls Column */}
          <div className="card-box">
            <h3>Shadow Root Configuration</h3>
            <p className="desc">
              Shadow DOM isolates DOM subtrees and CSS styling. Global styles on the page do not leak inside, and internal styles do not leak out!
            </p>

            <div className="ctrl-group">
              <label>Shadow Root Mode:</label>
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`mode-btn ${shadowMode === 'open' ? 'active' : ''}`}
                  onClick={() => setShadowMode('open')}
                >
                  mode: 'open' (shadowRoot accessible)
                </button>
                <button
                  type="button"
                  className={`mode-btn ${shadowMode === 'closed' ? 'active' : ''}`}
                  onClick={() => setShadowMode('closed')}
                >
                  mode: 'closed' (shadowRoot is null)
                </button>
              </div>
            </div>

            <div className="ctrl-group">
              <label>:host Variant Attribute:</label>
              <div className="mode-toggle-group">
                {(['default', 'premium', 'danger'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`mode-btn ${hostVariant === v ? 'active' : ''}`}
                    onClick={() => setHostVariant(v)}
                  >
                    :host([{v}])
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-group">
              <label>CSS Custom Property Piercing (`--card-accent`):</label>
              <div className="color-picker-row">
                {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8'].map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-bubble ${accentColor === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setAccentColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Rendered Component Preview */}
          <div className="card-box">
            <h3>Rendered Custom Element: &lt;interview-card&gt;</h3>
            <div
              className={`custom-element-host ${hostVariant}`}
              style={{ ['--card-accent' as string]: accentColor }}
            >
              <div className="shadow-root-container">
                <div className="shadow-boundary-tag">
                  #shadow-root ({shadowMode})
                </div>

                <div className="shadow-inner-card">
                  <div className="shadow-top-row">
                    <span className="shadow-badge">::slotted(badge)</span>
                    <span className="shadow-host-tag">:host([{hostVariant}])</span>
                  </div>
                  <h4 className="shadow-title">Encapsulated Web Component</h4>
                  <p className="shadow-body">
                    Styles inside this shadow tree are 100% scoped. Global CSS resets and classes will not pollute this element.
                  </p>
                  <button type="button" className="shadow-btn">
                    Action Button
                  </button>
                </div>
              </div>
            </div>

            <div className="js-access-banner">
              <span>JavaScript DOM Inspection:</span>
              <code>
                {shadowMode === 'open'
                  ? `element.shadowRoot => #document-fragment (Accessible)`
                  : `element.shadowRoot => null (Closed & Hidden)`}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* 2. SLOTS TAB */}
      {activeTab === 'slots' && (
        <div className="slots-grid">
          {/* Light DOM Inputs */}
          <div className="card-box">
            <h3>Light DOM Children (Consumer Markup)</h3>
            <p className="desc">
              Consumers write HTML inside &lt;interview-card&gt;. The browser projects these nodes into the Shadow Root's named &lt;slot&gt; outlets without copying or cloning!
            </p>

            <div className="slot-input-group">
              <label>&lt;span slot="badge"&gt;:</label>
              <input
                type="text"
                className="wc-input"
                value={badgeText}
                onChange={e => setBadgeText(e.target.value)}
              />
            </div>

            <div className="slot-input-group">
              <label>&lt;h3 slot="title"&gt;:</label>
              <input
                type="text"
                className="wc-input"
                value={titleText}
                onChange={e => setTitleText(e.target.value)}
              />
            </div>

            <div className="slot-input-group">
              <label>Default Slot (Body Text):</label>
              <textarea
                className="wc-textarea"
                rows={3}
                value={bodyText}
                onChange={e => setBodyText(e.target.value)}
              />
            </div>
          </div>

          {/* Shadow DOM Slot Mapping Preview */}
          <div className="card-box">
            <h3>Shadow DOM Slot Projection Pipeline</h3>
            <div className="slots-projection-card">
              <div className="proj-row">
                <span className="slot-tag">&lt;slot name="badge"&gt;</span>
                <div className="proj-arrow">➔</div>
                <div className="projected-badge">{badgeText}</div>
              </div>

              <div className="proj-row">
                <span className="slot-tag">&lt;slot name="title"&gt;</span>
                <div className="proj-arrow">➔</div>
                <div className="projected-title">{titleText}</div>
              </div>

              <div className="proj-row">
                <span className="slot-tag">&lt;slot&gt; (Default)</span>
                <div className="proj-arrow">➔</div>
                <div className="projected-body">{bodyText}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LIFECYCLE TAB */}
      {activeTab === 'lifecycle' && (
        <div className="lifecycle-container">
          <div className="lc-intro-banner">
            <h3>Custom Element Lifecycle Hooks Engine</h3>
            <p>
              Standard W3C Custom Elements API provides deterministic lifecycle hooks across creation, DOM mounting, attribute mutations, and unmounting.
            </p>
          </div>

          <div className="lifecycle-stepper-bar">
            {lifecycleSteps.map((step, idx) => (
              <button
                key={step.name}
                type="button"
                className={`lc-step-btn ${currentStep === idx ? 'active' : ''}`}
                onClick={() => setCurrentStep(idx)}
              >
                <span className="step-num">{idx + 1}</span>
                <div className="step-txt">
                  <strong>{step.name}</strong>
                  <span className="step-tag">{step.tag}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lifecycle-display-grid">
            <div className="card-box">
              <h3>{lifecycleSteps[currentStep].name}</h3>
              <p className="desc">{lifecycleSteps[currentStep].desc}</p>
              <pre className="lc-code-box">
                <code>{lifecycleSteps[currentStep].code}</code>
              </pre>
            </div>

            <div className="card-box">
              <h3>Interactive Attribute Mutation Trigger</h3>
              <p className="desc">
                Change the <code>rating</code> attribute below to trigger <code>attributeChangedCallback</code> in real time!
              </p>

              <div className="rating-trigger-row">
                <span>Rating Attribute:</span>
                <div className="stars-picker">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${observedRating >= star ? 'active' : ''}`}
                      onClick={() => {
                        setObservedRating(star)
                        setCurrentStep(2) // Jump to attributeChangedCallback
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mutation-log-banner">
                <span>⚡ Lifecycle Hook Dispatched:</span>
                <code>
                  attributeChangedCallback('rating', '{observedRating - 1}', '{observedRating}')
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLUEPRINTS TAB */}
      {activeTab === 'blueprints' && (
        <div className="bp-container">
          <div className="bp-intro-banner">
            <h3>FAANG Web Components &amp; Micro-Frontends Architecture</h3>
            <p>How top engineering teams build framework-agnostic design systems that run across React, Angular, and Vue.</p>
          </div>

          <div className="bp-grid">
            <div className="card-box bp-card">
              <span className="bp-tag adobe">🎨 Adobe Spectrum Web Components</span>
              <h4>Lit-Powered Design System</h4>
              <p>
                Adobe ships its entire design system as standardized Web Components built with <strong>Lit</strong>. Photoshop Web and Acrobat Web embed the exact same UI components across React and Vanilla JavaScript without rewrite overhead.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag salesforce">⚡ Salesforce Lightning (LWC)</span>
              <h4>Enterprise Micro-Frontends</h4>
              <p>
                Salesforce rebuilt its core CRM platform around Custom Elements and Shadow DOM to allow third-party developers to embed secure, encapsulated widgets without risking CSS pollution or DOM security breaches.
              </p>
            </div>

            <div className="card-box bp-card">
              <span className="bp-tag youtube">▶️ YouTube Video Player</span>
              <h4>Custom Element Video Orchestrator</h4>
              <p>
                YouTube wraps its entire media playback engine into <code>&lt;ytd-player&gt;</code> and <code>&lt;ytd-watch-flexy&gt;</code> Custom Elements, managing hardware decoding, video captions, and buffer telemetry with isolated Shadow DOM styling.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="wc-footer">
        <Link to="/sdui-lab" className="btn btn-secondary">
          📱 Server-Driven UI &amp; RSC Studio
        </Link>
        <Link to="/module-federation" className="btn btn-primary">
          🌐 Micro-Frontends Studio →
        </Link>
      </div>
    </div>
  )
}
