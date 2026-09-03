import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Compensation.css'

export interface CompanyPreset {
  company: string
  level: string
  baseSalary: number
  equity4Yr: number
  signOnY1: number
  signOnY2: number
  bonusPercent: number
  vestingCurve: [number, number, number, number] // [Y1, Y2, Y3, Y4] percentages
  vestingDescription: string
}

const PRESETS: CompanyPreset[] = [
  {
    company: 'Meta',
    level: 'E5 (Senior Software Engineer)',
    baseSalary: 215000,
    equity4Yr: 520000,
    signOnY1: 50000,
    signOnY2: 0,
    bonusPercent: 15,
    vestingCurve: [25, 25, 25, 25],
    vestingDescription: 'Standard 25% annual vesting (quarterly distribution)',
  },
  {
    company: 'Google',
    level: 'L5 (Senior Software Engineer)',
    baseSalary: 205000,
    equity4Yr: 480000,
    signOnY1: 45000,
    signOnY2: 0,
    bonusPercent: 15,
    vestingCurve: [33, 33, 22, 12],
    vestingDescription: 'Frontloaded vesting: 33% Year 1, 33% Year 2, 22% Year 3, 12% Year 4',
  },
  {
    company: 'Amazon',
    level: 'Senior SDE (L6)',
    baseSalary: 195000,
    equity4Yr: 460000,
    signOnY1: 85000,
    signOnY2: 65000,
    bonusPercent: 0,
    vestingCurve: [5, 15, 40, 40],
    vestingDescription: 'Backloaded curve: 5% Y1, 15% Y2, 40% Y3, 40% Y4 + heavy Year 1/2 cash sign-on bonuses',
  },
  {
    company: 'Netflix',
    level: 'Senior Software Engineer (L5/L6)',
    baseSalary: 520000,
    equity4Yr: 0,
    signOnY1: 0,
    signOnY2: 0,
    bonusPercent: 0,
    vestingCurve: [25, 25, 25, 25],
    vestingDescription: 'All-Cash Compensation Model (Optional Stock Option Allocation)',
  },
  {
    company: 'Apple',
    level: 'ICT4 (Senior Software Engineer)',
    baseSalary: 190000,
    equity4Yr: 420000,
    signOnY1: 35000,
    signOnY2: 0,
    bonusPercent: 10,
    vestingCurve: [25, 25, 25, 25],
    vestingDescription: 'Annual 25% RSU vesting with annual refresher grants',
  },
  {
    company: 'Stripe',
    level: 'L4 (Senior Engineer)',
    baseSalary: 220000,
    equity4Yr: 500000,
    signOnY1: 40000,
    signOnY2: 0,
    bonusPercent: 10,
    vestingCurve: [25, 25, 25, 25],
    vestingDescription: '1-Year cliff followed by monthly vesting increments',
  },
]

export interface NegotiationScript {
  id: string
  title: string
  tagline: string
  scenario: string
  scriptText: string
}

const SCRIPTS: NegotiationScript[] = [
  {
    id: 'competing-offer',
    title: '1. Countering with a Competing Offer',
    tagline: 'Leveraging a higher offer from Meta/Google to maximize RSU equity and sign-on bonus.',
    scenario: 'You have received an offer from Company A, but Company B offered a higher total compensation package or higher equity grant.',
    scriptText: `Hi [Recruiter Name],

Thank you so much for extending the offer for the [Role Name] position! I'm genuinely thrilled about the team's technical vision, particularly the ongoing frontend modernization and the scale of the product.

I wanted to be fully transparent with you: I am currently wrapping up final rounds and have received a competing offer from [Competing Company] at $[Competing TC]k/year, which includes $[Competing Equity]k in equity over 4 years.

That being said, [Your Company] remains my top choice due to the team culture and product roadmap. If we can adjust the package to $[Target TC]k (specifically increasing the initial RSU grant to $[Target Equity]k and the sign-on bonus to $[Target Sign-on]k), I would be ready to sign the offer immediately and withdraw from all other interview processes today.

Is there flexibility on the equity and sign-on bands to help bridge this gap?

Best regards,
[Your Name]`,
  },
  {
    id: 'no-competing-market',
    title: '2. Negotiating Without a Competing Offer',
    tagline: 'Anchoring on market compensation data and exceptional interview feedback.',
    scenario: 'You only have one offer, but you want to negotiate higher within the approved salary band without risking the offer.',
    scriptText: `Hi [Recruiter Name],

I am very excited to receive the offer for the [Role Name] role! Based on the conversations with the engineering team, I know I will make an immediate impact on [Specific Project / Performance Goal].

I’ve reviewed the details of the compensation package. Given my [X] years of experience architecting large-scale React systems and the strong technical feedback from the onsite loop, I was hoping to see a package closer to $[Target TC]k total compensation.

Specifically, I would love to explore whether we can increase the base salary to $[Target Base]k and adjust the equity grant to $[Target Equity]k. If we can reach that level, I would be thrilled to sign right away.

Thank you again for your partnership throughout this process.

Warmly,
[Your Name]`,
  },
  {
    id: 'amazon-cliff-signon',
    title: '3. Bridging the Backloaded Vesting Cliff',
    tagline: 'Asking for a higher Year 1/Year 2 sign-on bonus when dealing with 5/15/40/40 equity vesting.',
    scenario: 'When negotiating with Amazon or backloaded equity companies where only 5% or 15% vests in the first two years.',
    scriptText: `Hi [Recruiter Name],

Thank you for sending over the offer details! I'm really excited about the scope of the [Role Name] team.

In reviewing the 4-year compensation breakdown, I noticed the equity grant is heavily backloaded with 5% in Year 1 and 15% in Year 2. Because of this structure, my Year 1 and Year 2 annualized cashflow is lower than my current market expectations.

To bridge this initial vesting gap and ensure parity with my current total compensation, could we increase the Year 1 sign-on bonus to $[Target Y1 Sign-on]k and Year 2 sign-on to $[Target Y2 Sign-on]k?

If we can align on that adjustment, I am excited to accept the offer and confirm a start date!

Best,
[Your Name]`,
  },
  {
    id: 'level-upgrade',
    title: '4. Requesting a Level Upgrade (L4 ➔ L5 / E5 ➔ E6)',
    tagline: 'Asking the hiring committee to recalibrate your level based on strong System Design performance.',
    scenario: 'You were down-leveled or given an offer at the top of a lower band when your interview demonstrated Senior/Staff scope.',
    scriptText: `Hi [Recruiter Name],

Thank you for putting together the offer package! I am deeply excited about the opportunity to join the team.

During our technical onsite rounds—specifically the Frontend System Design and Architecture sessions—we discussed several high-impact initiatives that align directly with Senior / Staff level responsibilities (such as cross-team micro-frontend governance and Web Vitals optimization).

Given the scope of the problems we discussed, I was hoping to be leveled at the [Target Level, e.g. L5 / Senior SDE] band rather than [Offered Level]. 

Is it possible to have the Hiring Committee re-review the System Design feedback to see if the [Target Level] leveling can be supported? I am eager to contribute at this scope from Day 1.

Thank you for championing this!

Best regards,
[Your Name]`,
  },
]

export default function Compensation() {
  const [selectedPreset, setSelectedPreset] = useState<CompanyPreset>(PRESETS[0])

  // Custom compensation values
  const [base, setBase] = useState<number>(PRESETS[0].baseSalary)
  const [equity, setEquity] = useState<number>(PRESETS[0].equity4Yr)
  const [signOnY1, setSignOnY1] = useState<number>(PRESETS[0].signOnY1)
  const [signOnY2, setSignOnY2] = useState<number>(PRESETS[0].signOnY2)
  const [bonusPct, setBonusPct] = useState<number>(PRESETS[0].bonusPercent)

  const [activeTab, setActiveTab] = useState<'calculator' | 'scripts'>('calculator')
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null)

  const applyPreset = (preset: CompanyPreset) => {
    setSelectedPreset(preset)
    setBase(preset.baseSalary)
    setEquity(preset.equity4Yr)
    setSignOnY1(preset.signOnY1)
    setSignOnY2(preset.signOnY2)
    setBonusPct(preset.bonusPercent)
  }

  // Calculate Year 1 to 4 cashflows
  const cashflows = useMemo(() => {
    const annualBonus = Math.round(base * (bonusPct / 100))
    const curve = selectedPreset.vestingCurve

    const y1Equity = Math.round(equity * (curve[0] / 100))
    const y2Equity = Math.round(equity * (curve[1] / 100))
    const y3Equity = Math.round(equity * (curve[2] / 100))
    const y4Equity = Math.round(equity * (curve[3] / 100))

    const year1Total = base + annualBonus + y1Equity + signOnY1
    const year2Total = base + annualBonus + y2Equity + signOnY2
    const year3Total = base + annualBonus + y3Equity
    const year4Total = base + annualBonus + y4Equity

    const average4Yr = Math.round((year1Total + year2Total + year3Total + year4Total) / 4)

    return {
      annualBonus,
      year1: { base, bonus: annualBonus, equity: y1Equity, signOn: signOnY1, total: year1Total },
      year2: { base, bonus: annualBonus, equity: y2Equity, signOn: signOnY2, total: year2Total },
      year3: { base, bonus: annualBonus, equity: y3Equity, signOn: 0, total: year3Total },
      year4: { base, bonus: annualBonus, equity: y4Equity, signOn: 0, total: year4Total },
      average4Yr,
    }
  }, [base, equity, signOnY1, signOnY2, bonusPct, selectedPreset])

  const copyScript = (script: NegotiationScript) => {
    navigator.clipboard.writeText(script.scriptText)
    setCopiedScriptId(script.id)
    setTimeout(() => setCopiedScriptId(null), 2000)
  }

  const formatUsd = (num: number) => {
    return '$' + num.toLocaleString('en-US')
  }

  return (
    <div className="comp-page page-enter">
      {/* Header */}
      <div className="comp-header">
        <div>
          <span className="comp-badge">💰 FAANG Total Compensation &amp; Offer Negotiation</span>
          <h1>Compensation Modeler &amp; Negotiation Studio</h1>
          <p className="subtitle">
            Model level-by-level FAANG salaries, frontloaded vs backloaded RSU vesting schedules, and use battle-tested word-for-word counter-offer scripts.
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="comp-tabs-bar">
        <button
          type="button"
          className={`comp-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          📊 4-Year TC &amp; Vesting Schedule Calculator
        </button>
        <button
          type="button"
          className={`comp-tab ${activeTab === 'scripts' ? 'active' : ''}`}
          onClick={() => setActiveTab('scripts')}
        >
          ✉️ Battle-Tested Negotiation Scripts ({SCRIPTS.length} Scenarios)
        </button>
      </div>

      {/* 1. CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div className="calculator-container">
          {/* Company Presets Grid */}
          <div className="presets-bar">
            <span>FAANG Level Presets:</span>
            <div className="presets-pills">
              {PRESETS.map(p => (
                <button
                  key={p.company}
                  type="button"
                  className={`preset-pill ${selectedPreset.company === p.company ? 'active' : ''}`}
                  onClick={() => applyPreset(p)}
                >
                  <strong>{p.company}</strong> ({p.level.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="calc-main-grid">
            {/* Left Column: Sliders & Inputs */}
            <div className="calc-inputs-column">
              <div className="inputs-card">
                <div className="card-header-row">
                  <h3>{selectedPreset.company} Offer Structure</h3>
                  <span className="preset-level-tag">{selectedPreset.level}</span>
                </div>
                <p className="vesting-desc-note">ℹ️ {selectedPreset.vestingDescription}</p>

                {/* Base Salary Slider */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>Base Salary (Annual)</span>
                    <strong>{formatUsd(base)}</strong>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="600000"
                    step="5000"
                    value={base}
                    onChange={e => setBase(Number(e.target.value))}
                  />
                </div>

                {/* 4-Year RSU Grant Slider */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>4-Year RSU Equity Grant</span>
                    <strong>{formatUsd(equity)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500000"
                    step="10000"
                    value={equity}
                    onChange={e => setEquity(Number(e.target.value))}
                  />
                </div>

                {/* Year 1 Sign-On Bonus */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>Year 1 Sign-On Bonus</span>
                    <strong>{formatUsd(signOnY1)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={signOnY1}
                    onChange={e => setSignOnY1(Number(e.target.value))}
                  />
                </div>

                {/* Year 2 Sign-On Bonus */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>Year 2 Sign-On Bonus (Amazon/Backloaded)</span>
                    <strong>{formatUsd(signOnY2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500000"
                    step="5000"
                    value={signOnY2}
                    onChange={e => setSignOnY2(Number(e.target.value))}
                  />
                </div>

                {/* Annual Target Performance Bonus */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>Target Annual Performance Bonus</span>
                    <strong>{bonusPct}% ({formatUsd(cashflows.annualBonus)}/yr)</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="5"
                    value={bonusPct}
                    onChange={e => setBonusPct(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: 4-Year Cashflow Graph & Totals */}
            <div className="calc-results-column">
              <div className="tc-summary-hero">
                <div className="hero-tc-box">
                  <span className="hero-tc-val">{formatUsd(cashflows.average4Yr)}</span>
                  <span className="hero-tc-label">Average Annual Total Compensation (TC)</span>
                </div>
                <div className="hero-y1-box">
                  <span className="hero-y1-val">{formatUsd(cashflows.year1.total)}</span>
                  <span className="hero-y1-label">Year 1 First-Year Take-Home</span>
                </div>
              </div>

              {/* 4-Year Breakdown Cards */}
              <div className="year-breakdown-grid">
                <div className="year-card">
                  <span className="year-title">Year 1</span>
                  <h4 className="year-total">{formatUsd(cashflows.year1.total)}</h4>
                  <ul className="year-details-list">
                    <li>Base: {formatUsd(cashflows.year1.base)}</li>
                    <li>RSU Equity: {formatUsd(cashflows.year1.equity)}</li>
                    <li>Sign-On: {formatUsd(cashflows.year1.signOn)}</li>
                    <li>Bonus: {formatUsd(cashflows.year1.bonus)}</li>
                  </ul>
                </div>

                <div className="year-card">
                  <span className="year-title">Year 2</span>
                  <h4 className="year-total">{formatUsd(cashflows.year2.total)}</h4>
                  <ul className="year-details-list">
                    <li>Base: {formatUsd(cashflows.year2.base)}</li>
                    <li>RSU Equity: {formatUsd(cashflows.year2.equity)}</li>
                    <li>Sign-On: {formatUsd(cashflows.year2.signOn)}</li>
                    <li>Bonus: {formatUsd(cashflows.year2.bonus)}</li>
                  </ul>
                </div>

                <div className="year-card">
                  <span className="year-title">Year 3</span>
                  <h4 className="year-total">{formatUsd(cashflows.year3.total)}</h4>
                  <ul className="year-details-list">
                    <li>Base: {formatUsd(cashflows.year3.base)}</li>
                    <li>RSU Equity: {formatUsd(cashflows.year3.equity)}</li>
                    <li>Sign-On: $0</li>
                    <li>Bonus: {formatUsd(cashflows.year3.bonus)}</li>
                  </ul>
                </div>

                <div className="year-card">
                  <span className="year-title">Year 4</span>
                  <h4 className="year-total">{formatUsd(cashflows.year4.total)}</h4>
                  <ul className="year-details-list">
                    <li>Base: {formatUsd(cashflows.year4.base)}</li>
                    <li>RSU Equity: {formatUsd(cashflows.year4.equity)}</li>
                    <li>Sign-On: $0</li>
                    <li>Bonus: {formatUsd(cashflows.year4.bonus)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. NEGOTIATION SCRIPTS TAB */}
      {activeTab === 'scripts' && (
        <div className="scripts-container">
          <div className="scripts-intro-banner">
            <h3>Proven FAANG Offer Negotiation Scripts</h3>
            <p>
              Hiring managers and recruiters expect candidates to negotiate. Always negotiate over email first to keep a clear audit trail, anchor high within the approved band, and maintain extreme professionalism.
            </p>
          </div>

          <div className="scripts-list">
            {SCRIPTS.map(s => (
              <div key={s.id} className="script-card">
                <div className="script-card-header">
                  <div>
                    <h3 className="script-title">{s.title}</h3>
                    <span className="script-tagline">{s.tagline}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm copy-script-btn"
                    onClick={() => copyScript(s)}
                  >
                    {copiedScriptId === s.id ? '✓ Copied to Clipboard!' : '📋 Copy Script Template'}
                  </button>
                </div>

                <div className="scenario-context-box">
                  <strong>When to Use:</strong> {s.scenario}
                </div>

                <pre className="script-body-box">
                  <code>{s.scriptText}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="comp-footer">
        <Link to="/resume-optimizer" className="btn btn-secondary">
          📄 ATS Resume Scanner
        </Link>
        <Link to="/pathways" className="btn btn-primary">
          🏢 620+ Company Pathways →
        </Link>
      </div>
    </div>
  )
}
