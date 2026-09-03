import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './CapacityEstimator.css'

export interface SystemPreset {
  id: string
  name: string
  icon: string
  dau: number
  readsPerUser: number
  writesPerUser: number
  readSizeKb: number
  writeSizeKb: number
  peakMultiplier: number
  description: string
}

const PRESETS: SystemPreset[] = [
  {
    id: 'twitter',
    name: 'Twitter / X Timeline',
    icon: '🐦',
    dau: 300000000,
    readsPerUser: 100,
    writesPerUser: 5,
    readSizeKb: 10,
    writeSizeKb: 2,
    peakMultiplier: 2.5,
    description: 'Heavy read-to-write ratio (20:1) with fanout caching on high-follower accounts.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Instant Messaging',
    icon: '💬',
    dau: 1000000000,
    readsPerUser: 40,
    writesPerUser: 40,
    readSizeKb: 2,
    writeSizeKb: 2,
    peakMultiplier: 2.0,
    description: 'Symmetric 1:1 read/write messaging with ephemeral store and local-first client storage.',
  },
  {
    id: 'netflix',
    name: 'Netflix Video Streaming',
    icon: '🍿',
    dau: 250000000,
    readsPerUser: 8,
    writesPerUser: 0.2,
    readSizeKb: 50000, // 50MB segment chunk stream
    writeSizeKb: 1,
    peakMultiplier: 3.0,
    description: 'Massive egress video bandwidth served via Open Connect CDN edge caching appliances.',
  },
  {
    id: 'instagram',
    name: 'Instagram Photo Feed',
    icon: '📸',
    dau: 500000000,
    readsPerUser: 30,
    writesPerUser: 2,
    readSizeKb: 250, // compressed image thumbnails
    writeSizeKb: 1500, // uploaded high-res photo
    peakMultiplier: 2.5,
    description: 'Heavy media payload caching with CDN thumbnail generation pipelines.',
  },
]

export default function CapacityEstimator() {
  const [selectedPreset, setSelectedPreset] = useState<SystemPreset>(PRESETS[0])

  // System parameters state
  const [dau, setDau] = useState<number>(PRESETS[0].dau)
  const [readsPerUser, setReadsPerUser] = useState<number>(PRESETS[0].readsPerUser)
  const [writesPerUser, setWritesPerUser] = useState<number>(PRESETS[0].writesPerUser)
  const [readSizeKb, setReadSizeKb] = useState<number>(PRESETS[0].readSizeKb)
  const [writeSizeKb, setWriteSizeKb] = useState<number>(PRESETS[0].writeSizeKb)
  const [peakMultiplier, setPeakMultiplier] = useState<number>(PRESETS[0].peakMultiplier)
  const [cachePercent, setCachePercent] = useState<number>(20) // 80-20 rule
  const [replicationFactor, setReplicationFactor] = useState<number>(3) // 3x data copies

  const [activeTab, setActiveTab] = useState<'calculator' | 'latency-table'>('calculator')

  const applyPreset = (preset: SystemPreset) => {
    setSelectedPreset(preset)
    setDau(preset.dau)
    setReadsPerUser(preset.readsPerUser)
    setWritesPerUser(preset.writesPerUser)
    setReadSizeKb(preset.readSizeKb)
    setWriteSizeKb(preset.writeSizeKb)
    setPeakMultiplier(preset.peakMultiplier)
  }

  // Calculations
  const metrics = useMemo(() => {
    const SECONDS_PER_DAY = 86400

    // Total operations per day
    const totalDailyReads = dau * readsPerUser
    const totalDailyWrites = dau * writesPerUser

    // QPS
    const avgReadQps = Math.round(totalDailyReads / SECONDS_PER_DAY)
    const peakReadQps = Math.round(avgReadQps * peakMultiplier)

    const avgWriteQps = Math.round(totalDailyWrites / SECONDS_PER_DAY)
    const peakWriteQps = Math.round(avgWriteQps * peakMultiplier)

    // Bandwidth (Bytes / sec -> MB/s or GB/s)
    const ingressBytesPerSec = avgWriteQps * writeSizeKb * 1024
    const egressBytesPerSec = avgReadQps * readSizeKb * 1024

    const ingressMbSec = (ingressBytesPerSec / (1024 * 1024)).toFixed(1)
    const egressGbSec = (egressBytesPerSec / (1024 * 1024 * 1024)).toFixed(2)

    // Storage
    const dailyWriteDataBytes = totalDailyWrites * writeSizeKb * 1024
    const dailyStorageTb = (dailyWriteDataBytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)
    const annualStorageTb = (Number(dailyStorageTb) * 365).toFixed(1)
    const fiveYearStoragePb = ((Number(annualStorageTb) * 5 * replicationFactor) / 1024).toFixed(2)

    // RAM Cache (80-20 rule: 20% of daily read data in RAM)
    const dailyReadDataBytes = totalDailyReads * readSizeKb * 1024
    const ramCacheGb = Math.round((dailyReadDataBytes * (cachePercent / 100)) / (1024 * 1024 * 1024))

    return {
      avgReadQps,
      peakReadQps,
      avgWriteQps,
      peakWriteQps,
      ingressMbSec,
      egressGbSec,
      dailyStorageTb,
      annualStorageTb,
      fiveYearStoragePb,
      ramCacheGb,
    }
  }, [dau, readsPerUser, writesPerUser, readSizeKb, writeSizeKb, peakMultiplier, cachePercent, replicationFactor])

  return (
    <div className="capacity-page page-enter">
      {/* Header */}
      <div className="capacity-header">
        <div>
          <span className="capacity-badge">📐 System Design Back-of-the-Envelope Studio</span>
          <h1>System Capacity Estimator &amp; Sizing Calculator</h1>
          <p className="subtitle">
            Perform real-time architectural sizing calculations for QPS, Ingress/Egress Bandwidth, RAM Cache (80-20 Pareto), and 5-Year Storage Replication.
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="presets-bar">
        <span>FAANG System Presets:</span>
        <div className="presets-pills">
          {PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              className={`preset-pill ${selectedPreset.id === p.id ? 'active' : ''}`}
              onClick={() => applyPreset(p)}
            >
              <span>{p.icon}</span>
              <strong>{p.name}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="capacity-tabs-bar">
        <button
          type="button"
          className={`cap-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          📊 Interactive Capacity Sizing Studio
        </button>
        <button
          type="button"
          className={`cap-tab ${activeTab === 'latency-table' ? 'active' : ''}`}
          onClick={() => setActiveTab('latency-table')}
        >
          ⏱️ Latency Numbers Every Architect Must Know
        </button>
      </div>

      {/* 1. CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div className="calc-main-container">
          {/* Top Metrics Telemetry Banner */}
          <div className="metrics-summary-grid">
            <div className="metric-box">
              <span className="m-val">{metrics.peakReadQps.toLocaleString()}</span>
              <span className="m-label">Peak Read QPS (Avg: {metrics.avgReadQps.toLocaleString()})</span>
            </div>

            <div className="metric-box">
              <span className="m-val">{metrics.peakWriteQps.toLocaleString()}</span>
              <span className="m-label">Peak Write QPS (Avg: {metrics.avgWriteQps.toLocaleString()})</span>
            </div>

            <div className="metric-box">
              <span className="m-val">{metrics.egressGbSec} GB/s</span>
              <span className="m-label">Egress Bandwidth (Outbound)</span>
            </div>

            <div className="metric-box highlight-ram">
              <span className="m-val">{metrics.ramCacheGb.toLocaleString()} GB</span>
              <span className="m-label">RAM Cache Size (20% Pareto)</span>
            </div>

            <div className="metric-box highlight-storage">
              <span className="m-val">{metrics.fiveYearStoragePb} PB</span>
              <span className="m-label">5-Year Storage ({replicationFactor}x Replicas)</span>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="sliders-grid">
            {/* Column 1: Traffic Parameters */}
            <div className="slider-card">
              <h3>1. Traffic &amp; Users</h3>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Daily Active Users (DAU)</span>
                  <strong>{(dau / 1000000).toFixed(0)} Million</strong>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="1500000000"
                  step="10000000"
                  value={dau}
                  onChange={e => setDau(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Daily Reads per User</span>
                  <strong>{readsPerUser} reads/day</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  step="1"
                  value={readsPerUser}
                  onChange={e => setReadsPerUser(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Daily Writes per User</span>
                  <strong>{writesPerUser} writes/day</strong>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="50"
                  step="0.5"
                  value={writesPerUser}
                  onChange={e => setWritesPerUser(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Peak-to-Average Traffic Multiplier</span>
                  <strong>{peakMultiplier}x Peak</strong>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={peakMultiplier}
                  onChange={e => setPeakMultiplier(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Column 2: Payload Sizes & Storage */}
            <div className="slider-card">
              <h3>2. Payload Sizes &amp; Storage Architecture</h3>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Read Payload Size</span>
                  <strong>{readSizeKb >= 1024 ? (readSizeKb / 1024).toFixed(1) + ' MB' : readSizeKb + ' KB'}</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50000"
                  step="10"
                  value={readSizeKb}
                  onChange={e => setReadSizeKb(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Write Payload Size</span>
                  <strong>{writeSizeKb >= 1024 ? (writeSizeKb / 1024).toFixed(1) + ' MB' : writeSizeKb + ' KB'}</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5000"
                  step="5"
                  value={writeSizeKb}
                  onChange={e => setWriteSizeKb(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Cache Retention Ratio (Pareto Rule)</span>
                  <strong>{cachePercent}% of daily reads</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="5"
                  value={cachePercent}
                  onChange={e => setCachePercent(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Data Replication Factor</span>
                  <strong>{replicationFactor}x Copies (Fault Tolerance)</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={replicationFactor}
                  onChange={e => setReplicationFactor(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LATENCY CHEATSHEET TAB */}
      {activeTab === 'latency-table' && (
        <div className="latency-container">
          <div className="latency-intro-banner">
            <h3>Latency Numbers Every Frontend &amp; System Architect Must Know</h3>
            <p>
              Hardware latency orders of magnitude (Jeff Dean's latency benchmarks normalized to human intuition scale).
            </p>
          </div>

          <div className="latency-table-wrap">
            <table className="latency-table">
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Actual Latency</th>
                  <th>Normalized (1 CPU Cycle = 1 Sec)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>L1 CPU Cache Reference</td>
                  <td><strong>0.5 ns</strong></td>
                  <td>0.5 seconds</td>
                </tr>
                <tr>
                  <td>L2 CPU Cache Reference</td>
                  <td><strong>7 ns</strong></td>
                  <td>7 seconds</td>
                </tr>
                <tr>
                  <td>Main RAM Memory Reference</td>
                  <td><strong>100 ns</strong></td>
                  <td>1.5 minutes</td>
                </tr>
                <tr>
                  <td>NVMe SSD Random Read</td>
                  <td><strong>16 &mu;s</strong></td>
                  <td>4.5 hours</td>
                </tr>
                <tr>
                  <td>Same Datacenter Network Roundtrip</td>
                  <td><strong>500 &mu;s</strong></td>
                  <td>5.8 days</td>
                </tr>
                <tr>
                  <td>Cross-Country RTT (SF to NYC)</td>
                  <td><strong>40 ms</strong></td>
                  <td>1.3 years</td>
                </tr>
                <tr>
                  <td>Transatlantic RTT (SF to London)</td>
                  <td><strong>150 ms</strong></td>
                  <td>4.8 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="cap-footer">
        <Link to="/case-studies" className="btn btn-secondary">
          📐 FAANG Architecture Case Studies
        </Link>
        <Link to="/system-design" className="btn btn-primary">
          🏗️ Open System Design Studio →
        </Link>
      </div>
    </div>
  )
}
