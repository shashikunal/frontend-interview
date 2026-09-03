import { useState } from 'react'
import { Link } from 'react-router-dom'
import './I18nLab.css'

export interface LocaleInfo {
  code: string
  name: string
  flag: string
  dir: 'ltr' | 'rtl'
  currency: string
  currencySymbol: string
  translations: {
    welcome: string
    subtitle: string
    startReview: string
    savedQuestions: string
    activeStreak: string
    completionRate: string
    nextLesson: string
  }
}

const LOCALES: LocaleInfo[] = [
  {
    code: 'en-US',
    name: 'English (US)',
    flag: '🇺🇸',
    dir: 'ltr',
    currency: 'USD',
    currencySymbol: '$',
    translations: {
      welcome: 'Welcome back, Staff Engineer',
      subtitle: 'Your daily system design and coding mock roadmap is ready.',
      startReview: 'Start Revision →',
      savedQuestions: 'Saved Questions',
      activeStreak: 'Active Study Streak',
      completionRate: 'Curriculum Completion',
      nextLesson: 'Next: WebRTC DataChannels & ICE Traversal',
    },
  },
  {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    flag: '🇸🇦',
    dir: 'rtl',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    translations: {
      welcome: 'مرحباً بك مجدداً، مهندس البرمجيات',
      subtitle: 'خارطة طريق تصميم النظم والمقابلات التجريبية جاهزة الآن.',
      startReview: '← بدء المراجعة',
      savedQuestions: 'الأسئلة المحفوظة',
      activeStreak: 'أيام الدراسة المتتالية',
      completionRate: 'نسبة إكمال المنهج',
      nextLesson: 'التالي: قنوات بيانات WebRTC وتجاوز NAT',
    },
  },
  {
    code: 'es-ES',
    name: 'Spanish (Spain)',
    flag: '🇪🇸',
    dir: 'ltr',
    currency: 'EUR',
    currencySymbol: '€',
    translations: {
      welcome: 'Bienvenido de nuevo, Ingeniero Principal',
      subtitle: 'Tu hoja de ruta diaria de diseño de sistemas está lista.',
      startReview: 'Iniciar Revisión →',
      savedQuestions: 'Preguntas Guardadas',
      activeStreak: 'Racha de Estudio Activa',
      completionRate: 'Completado del Plan',
      nextLesson: 'Siguiente: Canales de Datos WebRTC y NAT',
    },
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    flag: '🇨🇳',
    dir: 'ltr',
    currency: 'CNY',
    currencySymbol: '¥',
    translations: {
      welcome: '欢迎回来，资深前端架构师',
      subtitle: '您的系统设计与前端模拟面试学习路线已就绪。',
      startReview: '开始复习 →',
      savedQuestions: '已收藏题目',
      activeStreak: '连续学习天数',
      completionRate: '课程完成进度',
      nextLesson: '下一课：WebRTC 数据通道与 NAT 穿透',
    },
  },
  {
    code: 'de-DE',
    name: 'German (Germany - Text Expansion)',
    flag: '🇩🇪',
    dir: 'ltr',
    currency: 'EUR',
    currencySymbol: '€',
    translations: {
      welcome: 'Willkommen zurück, Hauptentwicklungsingenieur',
      subtitle: 'Ihr täglicher Systementwurfs- und Programmiervorbereitungsplan ist bereit.',
      startReview: 'Wiederholungsphase starten →',
      savedQuestions: 'Gespeicherte Prüfungsfragen',
      activeStreak: 'Aktuelle Lernfortschrittsserie',
      completionRate: 'Lehrplanabschlussquote',
      nextLesson: 'Nächstes: WebRTC-Datenkanäle und ICE-Durchquerung',
    },
  },
  {
    code: 'hi-IN',
    name: 'Hindi (India)',
    flag: '🇮🇳',
    dir: 'ltr',
    currency: 'INR',
    currencySymbol: '₹',
    translations: {
      welcome: 'वापसी पर स्वागत है, स्टाफ इंजीनियर',
      subtitle: 'आपका दैनिक सिस्टम डिज़ाइन और कोडिंग मॉक रोडमैप तैयार है।',
      startReview: 'रिवीजन शुरू करें →',
      savedQuestions: 'सहेजे गए प्रश्न',
      activeStreak: 'सक्रिय अध्ययन स्ट्रीक',
      completionRate: 'पाठ्यक्रम पूर्णता दर',
      nextLesson: 'अगला: WebRTC डेटा चैनल और NAT ट्रैवर्सल',
    },
  },
]

export default function I18nLab() {
  const [selectedLocale, setSelectedLocale] = useState<LocaleInfo>(LOCALES[0])
  const [activeTab, setActiveTab] = useState<'sandbox' | 'logical-props' | 'intl-api' | 'guide'>('sandbox')

  // Intl Suite state
  const [amountInput, setAmountInput] = useState<number>(1250480)
  const [pluralCount, setPluralCount] = useState<number>(2)

  // Plural rule calculation
  const getPluralCategory = (count: number, locale: string) => {
    try {
      const pr = new Intl.PluralRules(locale)
      return pr.select(count)
    } catch {
      return 'other'
    }
  }

  // Format currency
  const formatCurrency = (val: number, locale: string, cur: string) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: cur,
        maximumFractionDigits: 0,
      }).format(val)
    } catch {
      return `${val} ${cur}`
    }
  }

  return (
    <div className="i18n-page page-enter">
      {/* Header */}
      <div className="i18n-header">
        <div>
          <span className="i18n-badge">🌍 Global Localization &amp; Bi-directional Layouts</span>
          <h1>Internationalization (i18n) &amp; RTL Studio</h1>
          <p className="subtitle">
            Master Right-to-Left (RTL) Arabic bidirectional layout mirroring, CSS Logical Properties, and modern ECMAScript Intl APIs (NumberFormat, DateTimeFormat, PluralRules).
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="i18n-tabs-bar">
        <button
          type="button"
          className={`i18n-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
        >
          🌐 1. Live Multi-Locale &amp; RTL Mirroring
        </button>
        <button
          type="button"
          className={`i18n-tab ${activeTab === 'logical-props' ? 'active' : ''}`}
          onClick={() => setActiveTab('logical-props')}
        >
          📐 2. CSS Logical Properties vs Physical
        </button>
        <button
          type="button"
          className={`i18n-tab ${activeTab === 'intl-api' ? 'active' : ''}`}
          onClick={() => setActiveTab('intl-api')}
        >
          🔢 3. ECMAScript Intl APIs Playground
        </button>
        <button
          type="button"
          className={`i18n-tab ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          📖 4. FAANG Localization &amp; Text Expansion
        </button>
      </div>

      {/* 1. LIVE MULTI-LOCALE TAB */}
      {activeTab === 'sandbox' && (
        <div className="sandbox-grid">
          <div className="card-box">
            <h3>Select Active Target Locale:</h3>
            <div className="locales-picker-grid">
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  type="button"
                  className={`loc-btn ${selectedLocale.code === loc.code ? 'active' : ''}`}
                  onClick={() => setSelectedLocale(loc)}
                >
                  <span className="loc-flag">{loc.flag}</span>
                  <div className="loc-meta">
                    <strong>{loc.name}</strong>
                    <span className="loc-code">{loc.code} · {loc.dir.toUpperCase()}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="dir-info-banner">
              <strong>Active Direction: <code>dir="{selectedLocale.dir}"</code></strong>
              <p>
                {selectedLocale.dir === 'rtl'
                  ? 'Arabic layout mirrors horizontally: navigation icons, badges, back chevrons, and text alignment start from the right margin.'
                  : 'Left-to-right standard Latin/Asian script rendering.'}
              </p>
            </div>
          </div>

          {/* Interactive Mirrored UI Card */}
          <div className="card-box">
            <h3>Rendered UI Component (Bi-directional Mirroring)</h3>
            <div
              className={`mirrored-app-card ${selectedLocale.dir}`}
              dir={selectedLocale.dir}
            >
              <div className="app-card-header">
                <span className="user-avatar">👨‍💻</span>
                <div>
                  <h4 className="user-title">{selectedLocale.translations.welcome}</h4>
                  <p className="user-sub">{selectedLocale.translations.subtitle}</p>
                </div>
              </div>

              <div className="app-stats-row">
                <div className="app-stat-box">
                  <span className="s-icon">🔥</span>
                  <div>
                    <span className="s-label">{selectedLocale.translations.activeStreak}</span>
                    <strong className="s-val">14 Days</strong>
                  </div>
                </div>

                <div className="app-stat-box">
                  <span className="s-icon">📊</span>
                  <div>
                    <span className="s-label">{selectedLocale.translations.completionRate}</span>
                    <strong className="s-val">84%</strong>
                  </div>
                </div>
              </div>

              <div className="app-lesson-banner">
                <span className="lesson-badge">📘 {selectedLocale.translations.nextLesson}</span>
                <button type="button" className="btn btn-primary btn-sm">
                  {selectedLocale.translations.startReview}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CSS LOGICAL PROPERTIES TAB */}
      {activeTab === 'logical-props' && (
        <div className="props-container">
          <div className="props-intro-banner">
            <div>
              <h3>CSS Logical Properties vs Legacy Physical Properties</h3>
              <p>
                Legacy physical properties (<code>left</code>, <code>right</code>, <code>margin-left</code>) require writing brittle <code>.rtl</code> CSS override hacks. <strong>CSS Logical Properties</strong> automatically mirror based on writing mode and direction!
              </p>
            </div>
          </div>

          <div className="props-table-wrap">
            <table className="props-table">
              <thead>
                <tr>
                  <th>Physical Property (Legacy ❌)</th>
                  <th>CSS Logical Property (Modern ✅)</th>
                  <th>LTR Behavior</th>
                  <th>RTL (Arabic/Hebrew) Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>margin-left: 16px;</code></td>
                  <td><code>margin-inline-start: 16px;</code></td>
                  <td>Margin on Left</td>
                  <td>Margin on Right automatically!</td>
                </tr>
                <tr>
                  <td><code>margin-right: 16px;</code></td>
                  <td><code>margin-inline-end: 16px;</code></td>
                  <td>Margin on Right</td>
                  <td>Margin on Left automatically!</td>
                </tr>
                <tr>
                  <td><code>padding-left: 20px;</code></td>
                  <td><code>padding-inline-start: 20px;</code></td>
                  <td>Padding on Left</td>
                  <td>Padding on Right automatically!</td>
                </tr>
                <tr>
                  <td><code>left: 0;</code></td>
                  <td><code>inset-inline-start: 0;</code></td>
                  <td>Pinned to Left</td>
                  <td>Pinned to Right automatically!</td>
                </tr>
                <tr>
                  <td><code>text-align: left;</code></td>
                  <td><code>text-align: start;</code></td>
                  <td>Aligns to Left</td>
                  <td>Aligns to Right automatically!</td>
                </tr>
                <tr>
                  <td><code>border-right: 1px solid;</code></td>
                  <td><code>border-inline-end: 1px solid;</code></td>
                  <td>Border on Right</td>
                  <td>Border on Left automatically!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. INTL APIS TAB */}
      {activeTab === 'intl-api' && (
        <div className="intl-grid">
          <div className="card-box">
            <h3>1. Intl.NumberFormat (Currency &amp; Compact)</h3>
            <div className="intl-input-group">
              <span>Test Numeric Amount:</span>
              <input
                type="number"
                value={amountInput}
                onChange={e => setAmountInput(Number(e.target.value))}
                className="intl-input"
              />
            </div>

            <div className="currency-results-list">
              {LOCALES.map(loc => (
                <div key={loc.code} className="currency-row">
                  <span className="c-loc">{loc.flag} {loc.name}:</span>
                  <strong className="c-val">
                    {formatCurrency(amountInput, loc.code, loc.currency)}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card-box">
            <h3>2. Intl.PluralRules (Complex Arabic 6-Category Rules)</h3>
            <p className="desc">
              English has only 2 plural categories (<code>one</code>, <code>other</code>). Arabic has 6 distinct grammatical categories: <code>zero</code>, <code>one</code>, <code>two</code>, <code>few</code>, <code>many</code>, <code>other</code>!
            </p>

            <div className="intl-input-group">
              <span>Item Quantity:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={pluralCount}
                onChange={e => setPluralCount(Number(e.target.value))}
                className="intl-input"
              />
            </div>

            <div className="plural-results-box">
              <div className="pl-item">
                <span>🇺🇸 English (en-US):</span>
                <strong>Category: {getPluralCategory(pluralCount, 'en-US')}</strong>
              </div>
              <div className="pl-item highlight-ar">
                <span>🇸🇦 Arabic (ar-SA):</span>
                <strong>Category: {getPluralCategory(pluralCount, 'ar-SA')}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. GUIDE TAB */}
      {activeTab === 'guide' && (
        <div className="guide-container">
          <div className="guide-intro-banner">
            <h3>FAANG Global Scale Localization Architectural Principles</h3>
            <p>Techniques top teams use to avoid UI truncation and layout breaking in 120+ languages.</p>
          </div>

          <div className="guide-grid">
            <div className="card-box g-card">
              <h4>1. German &amp; Romance Text Expansion (+35%)</h4>
              <p>
                English strings often expand by <strong>30% to 45%</strong> when translated into German, French, or Spanish. Never hardcode fixed pixel widths on buttons or headers. Use <code>min-width</code> and flexible CSS grid layouts.
              </p>
            </div>

            <div className="card-box g-card">
              <h4>2. Pseudo-Localization in CI/CD</h4>
              <p>
                Automated test builds replace English strings with accented characters and padded brackets (e.g. <code>[!!! Ẅéĺčömê ƀäċķ !!!]</code>) to instantly expose hardcoded un-localized strings and layout truncation before shipping to production.
              </p>
            </div>

            <div className="card-box g-card">
              <h4>3. ICU MessageFormat for Complex Plurals</h4>
              <p>
                Never concatenate strings with <code>count + ' items'</code>! Use standard ICU message patterns: <code>{`{count, plural, =0{No items} one{# item} other{# items}}`}</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="i18n-footer">
        <Link to="/design-system" className="btn btn-secondary">
          🎨 Design System &amp; Tokens Studio
        </Link>
        <Link to="/accessibility" className="btn btn-primary">
          ♿ Accessibility (a11y) Lab →
        </Link>
      </div>
    </div>
  )
}
