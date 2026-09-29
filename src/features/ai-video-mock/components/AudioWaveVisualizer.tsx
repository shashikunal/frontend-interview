import React from 'react'
import './AudioWaveVisualizer.css'

interface AudioWaveVisualizerProps {
  isActive: boolean
  label?: string
  color?: string
  barsCount?: number
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isActive,
  label = 'Audio Active',
  color = '#818cf8',
  barsCount = 12,
}) => {
  return (
    <div className={`awv-container ${isActive ? 'active' : 'idle'}`}>
      <div className="awv-bars">
        {Array.from({ length: barsCount }).map((_, i) => (
          <span
            key={i}
            className="awv-bar"
            style={{
              backgroundColor: color,
              animationDelay: `${(i % 5) * 0.15}s`,
              height: isActive ? `${Math.floor(20 + Math.random() * 80)}%` : '15%',
            }}
          />
        ))}
      </div>
      {label && <span className="awv-label" style={{ color }}>{label}</span>}
    </div>
  )
}
