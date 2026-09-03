import { useState } from 'react'
import { Link } from 'react-router-dom'
import './DesignSystemStudio.css'

export default function DesignSystemStudio() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'components' | 'exporter'>('tokens')

  // Color generator state
  const [brandHue, setBrandHue] = useState<number>(238) // Indigo hue
  const [brandSat, setBrandSat] = useState<number>(84)

  // Typography scale state
  const [typeRatio, setTypeRatio] = useState<number>(1.25) // Major Third
  const [baseSize, setBaseSize] = useState<number>(16) // 16px

  // Component state matrix
  const [componentState, setComponentState] = useState<'default' | 'hover' | 'focus' | 'disabled' | 'loading'>('default')

  // Exporter format
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'dtcg-json'>('css')
  const [copied, setCopied] = useState<boolean>(false)

  // Calculate 50-900 tonal scale
  const tones = [
    { step: 50, l: 96 },
    { step: 100, l: 91 },
    { step: 200, l: 82 },
    { step: 300, l: 71 },
    { step: 400, l: 60 },
    { step: 500, l: 52 },
    { step: 600, l: 44 },
    { step: 700, l: 36 },
    { step: 800, l: 26 },
    { step: 900, l: 18 },
  ]

  // Calculate type scale
  const typeScales = [
    { name: 'text-xs', factor: -2 },
    { name: 'text-sm', factor: -1 },
    { name: 'text-base', factor: 0 },
    { name: 'text-lg', factor: 1 },
    { name: 'text-xl', factor: 2 },
    { name: 'text-2xl', factor: 3 },
    { name: 'text-3xl', factor: 4 },
    { name: 'text-4xl', factor: 5 },
  ].map(scale => {
    const px = Math.round(baseSize * Math.pow(typeRatio, scale.factor) * 10) / 10
    const rem = Math.round((px / 16) * 1000) / 1000
    return { ...scale, px, rem }
  })

  // Generate code export
  const getExportCode = () => {
    if (exportFormat === 'css') {
      return `:root {
  /* Global Color Tokens */
${tones.map(t => `  --color-brand-${t.step}: hsl(${brandHue}, ${brandSat}%, ${t.l}%);`).join('\n')}

  /* Semantic Color Aliases */
  --bg-primary: #090d16;
  --bg-surface: #111827;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --interactive-primary: var(--color-brand-500);
  --interactive-primary-hover: var(--color-brand-600);

  /* Typography Scale (${typeRatio} Ratio) */
${typeScales.map(s => `  --${s.name}: ${s.rem}rem; /* ${s.px}px */`).join('\n')}

  /* 8pt Spacing Grid */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
}`
    }

    if (exportFormat === 'tailwind') {
      return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
${tones.map(t => `          ${t.step}: 'hsl(${brandHue} ${brandSat}% ${t.l}%)',`).join('\n')}
        },
      },
      fontSize: {
${typeScales.map(s => `        '${s.name.replace('text-', '')}': ['${s.rem}rem', { lineHeight: '1.4' }],`).join('\n')}
      },
    },
  },
};`
    }

    return JSON.stringify(
      {
        $schema: 'https://design-tokens.github.io/community-group/format/',
        color: {
          brand: Object.fromEntries(
            tones.map(t => [t.step, { $value: `hsl(${brandHue}, ${brandSat}%, ${t.l}%)`, $type: 'color' }])
          ),
        },
        typography: {
          scale: Object.fromEntries(
            typeScales.map(s => [s.name, { $value: `${s.rem}rem`, $type: 'dimension' }])
          ),
        },
      },
      null,
      2
    )
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="design-page page-enter">
      {/* Header */}
      <div className="design-header">
        <div>
          <span className="design-badge">📐 Enterprise Design Token Architecture</span>
          <h1>Design System &amp; Token Studio</h1>
          <p className="subtitle">
            Generate HSL design tokens, configure modular typography scales, preview accessible component state matrices, and export to CSS Variables, Tailwind, or W3C DTCG JSON.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="design-tabs-bar">
        <button
          type="button"
          className={`ds-tab ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          🎨 1. HSL Design Tokens &amp; Palette
        </button>
        <button
          type="button"
          className={`ds-tab ${activeTab === 'typography' ? 'active' : ''}`}
          onClick={() => setActiveTab('typography')}
        >
          🔤 2. Modular Typography Scale
        </button>
        <button
          type="button"
          className={`ds-tab ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          🔘 3. Component State Matrix
        </button>
        <button
          type="button"
          className={`ds-tab ${activeTab === 'exporter' ? 'active' : ''}`}
          onClick={() => setActiveTab('exporter')}
        >
          📦 4. Multi-Format Token Exporter
        </button>
      </div>

      {/* 1. COLOR TOKENS TAB */}
      {activeTab === 'tokens' && (
        <div className="tokens-grid">
          <div className="card-box">
            <h3>Live HSL Brand Hue Customizer</h3>
            <p className="desc">
              Adjust the primary brand hue and saturation sliders to dynamically recalculate the 50-900 tonal scale across global and semantic tokens.
            </p>

            <div className="slider-control-group">
              <div className="slider-header">
                <span>Brand Hue:</span>
                <strong>{brandHue}°</strong>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={brandHue}
                onChange={e => setBrandHue(Number(e.target.value))}
                className="hue-slider"
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-header">
                <span>Saturation:</span>
                <strong>{brandSat}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brandSat}
                onChange={e => setBrandSat(Number(e.target.value))}
              />
            </div>

            <div className="hierarchy-box">
              <h4>3-Tier Token Hierarchy Architecture</h4>
              <div className="tier-flow">
                <div className="tier-card">
                  <span className="tier-tag global">Global (Raw)</span>
                  <code>--color-brand-500: hsl({brandHue}, {brandSat}%, 52%);</code>
                </div>
                <div className="tier-arrow">➔</div>
                <div className="tier-card">
                  <span className="tier-tag semantic">Semantic (Alias)</span>
                  <code>--interactive-primary: var(--color-brand-500);</code>
                </div>
                <div className="tier-arrow">➔</div>
                <div className="tier-card">
                  <span className="tier-tag component">Component</span>
                  <code>--btn-primary-bg: var(--interactive-primary);</code>
                </div>
              </div>
            </div>
          </div>

          <div className="card-box">
            <h3>Generated 50-900 Tonal Swatches</h3>
            <div className="swatches-column">
              {tones.map(t => (
                <div key={t.step} className="swatch-row">
                  <div
                    className="swatch-preview"
                    style={{ backgroundColor: `hsl(${brandHue}, ${brandSat}%, ${t.l}%)` }}
                  />
                  <div className="swatch-meta">
                    <strong>brand-{t.step}</strong>
                    <span>hsl({brandHue}, {brandSat}%, {t.l}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TYPOGRAPHY TAB */}
      {activeTab === 'typography' && (
        <div className="typography-grid">
          <div className="card-box">
            <h3>Modular Typography Scale Ratio</h3>
            <p className="desc">
              Geometric progression ensuring harmonious typographic visual hierarchy across all viewports.
            </p>

            <div className="ratio-selector-group">
              {[
                { label: 'Minor Third (1.200)', val: 1.2 },
                { label: 'Major Third (1.250)', val: 1.25 },
                { label: 'Perfect Fourth (1.333)', val: 1.333 },
                { label: 'Golden Ratio (1.618)', val: 1.618 },
              ].map(r => (
                <button
                  key={r.val}
                  type="button"
                  className={`ratio-btn ${typeRatio === r.val ? 'active' : ''}`}
                  onClick={() => setTypeRatio(r.val)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="base-size-input-row">
              <span>Base Size (Root 1rem):</span>
              <input
                type="number"
                min="12"
                max="24"
                value={baseSize}
                onChange={e => setBaseSize(Number(e.target.value))}
                className="base-input"
              />
              <span>px</span>
            </div>
          </div>

          <div className="card-box">
            <h3>Typographic Visual Hierarchy Preview</h3>
            <div className="type-samples-list">
              {typeScales.map(s => (
                <div key={s.name} className="type-sample-item">
                  <div className="sample-meta">
                    <span className="s-token">{s.name}</span>
                    <span className="s-dims">{s.rem}rem ({s.px}px)</span>
                  </div>
                  <div className="sample-text" style={{ fontSize: `${s.rem}rem` }}>
                    Staff Frontend Engineering
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. COMPONENT STATE MATRIX TAB */}
      {activeTab === 'components' && (
        <div className="components-container">
          <div className="card-box">
            <div className="comp-header-row">
              <h3>Accessible Component State Matrix (WCAG AAA)</h3>
              <div className="state-toggle-bar">
                {(['default', 'hover', 'focus', 'disabled', 'loading'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`st-btn ${componentState === st ? 'active' : ''}`}
                    onClick={() => setComponentState(st)}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="component-showcase-arena">
              {/* Button Component */}
              <div className="component-demo-card">
                <h4>Primary Button</h4>
                <button
                  type="button"
                  disabled={componentState === 'disabled'}
                  className={`demo-btn btn-brand ${componentState}`}
                  style={{
                    backgroundColor:
                      componentState === 'hover'
                        ? `hsl(${brandHue}, ${brandSat}%, 44%)`
                        : componentState === 'disabled'
                        ? '#334155'
                        : `hsl(${brandHue}, ${brandSat}%, 52%)`,
                  }}
                >
                  {componentState === 'loading' ? '⏳ Loading...' : 'Save Changes'}
                </button>
              </div>

              {/* Text Input Component */}
              <div className="component-demo-card">
                <h4>Form Input Field</h4>
                <input
                  type="text"
                  disabled={componentState === 'disabled'}
                  readOnly
                  value={componentState === 'disabled' ? 'Disabled input state' : 'example@faang.com'}
                  className={`demo-input ${componentState}`}
                  style={{
                    borderColor:
                      componentState === 'focus'
                        ? `hsl(${brandHue}, ${brandSat}%, 52%)`
                        : undefined,
                  }}
                />
              </div>

              {/* Badge Component */}
              <div className="component-demo-card">
                <h4>Status Badge Tag</h4>
                <span
                  className="demo-badge"
                  style={{
                    backgroundColor: `hsla(${brandHue}, ${brandSat}%, 52%, 0.15)`,
                    color: `hsl(${brandHue}, ${brandSat}%, 70%)`,
                    borderColor: `hsla(${brandHue}, ${brandSat}%, 52%, 0.35)`,
                  }}
                >
                  ● Active Session
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPORTER TAB */}
      {activeTab === 'exporter' && (
        <div className="exporter-container">
          <div className="card-box">
            <div className="exporter-header-row">
              <div className="export-format-toggles">
                <button
                  type="button"
                  className={`fmt-btn ${exportFormat === 'css' ? 'active' : ''}`}
                  onClick={() => setExportFormat('css')}
                >
                  CSS Custom Properties (:root)
                </button>
                <button
                  type="button"
                  className={`fmt-btn ${exportFormat === 'tailwind' ? 'active' : ''}`}
                  onClick={() => setExportFormat('tailwind')}
                >
                  Tailwind CSS Config
                </button>
                <button
                  type="button"
                  className={`fmt-btn ${exportFormat === 'dtcg-json' ? 'active' : ''}`}
                  onClick={() => setExportFormat('dtcg-json')}
                >
                  W3C DTCG Token JSON
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary copy-code-btn"
                onClick={handleCopyCode}
              >
                {copied ? '✅ Copied to Clipboard!' : '📋 Copy Design Tokens'}
              </button>
            </div>

            <pre className="export-code-box">
              <code>{getExportCode()}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="ds-footer">
        <Link to="/local-first" className="btn btn-secondary">
          💾 Local-First &amp; Offline Sync Studio
        </Link>
        <Link to="/accessibility" className="btn btn-primary">
          ♿ Accessibility (a11y) Lab →
        </Link>
      </div>
    </div>
  )
}
