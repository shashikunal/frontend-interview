import React from 'react'
import './SkeletonLoader.css'

export type SkeletonVariant = 'page' | 'dashboard' | 'admin' | 'table' | 'profile' | 'studio'

interface SkeletonLoaderProps {
  variant?: SkeletonVariant
  rows?: number
  className?: string
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'page',
  rows = 5,
  className = '',
}) => {
  if (variant === 'dashboard') {
    return (
      <div className={`skeleton-wrapper ${className}`}>
        <div className="skeleton-shimmer skeleton-hero" />
        <div className="skeleton-grid-3">
          <div className="skeleton-shimmer skeleton-card-box" />
          <div className="skeleton-shimmer skeleton-card-box" />
          <div className="skeleton-shimmer skeleton-card-box" />
        </div>
        <div className="skeleton-shimmer" style={{ height: '280px', borderRadius: '16px' }} />
      </div>
    )
  }

  if (variant === 'admin') {
    return (
      <div className={`skeleton-wrapper ${className}`}>
        <div className="skeleton-shimmer skeleton-page-header" />
        <div className="skeleton-grid-3">
          <div className="skeleton-shimmer skeleton-card-box" style={{ height: '110px' }} />
          <div className="skeleton-shimmer skeleton-card-box" style={{ height: '110px' }} />
          <div className="skeleton-shimmer skeleton-card-box" style={{ height: '110px' }} />
          <div className="skeleton-shimmer skeleton-card-box" style={{ height: '110px' }} />
        </div>
        <div className="skeleton-shimmer skeleton-table-header" />
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="skeleton-shimmer skeleton-table-row" />
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={`skeleton-wrapper ${className}`}>
        <div className="skeleton-shimmer skeleton-table-header" />
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="skeleton-shimmer skeleton-table-row" />
        ))}
      </div>
    )
  }

  if (variant === 'profile') {
    return (
      <div className={`skeleton-wrapper ${className}`}>
        <div className="skeleton-profile-layout">
          <div className="skeleton-shimmer" style={{ height: '340px', borderRadius: '16px' }}>
            <div className="skeleton-shimmer skeleton-avatar-circle" style={{ marginTop: '24px' }} />
            <div className="skeleton-shimmer skeleton-line-md" style={{ width: '60%', margin: '0 auto 12px' }} />
            <div className="skeleton-shimmer skeleton-line-sm" style={{ width: '40%', margin: '0 auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton-shimmer" style={{ height: '160px', borderRadius: '16px' }} />
            <div className="skeleton-shimmer" style={{ height: '160px', borderRadius: '16px' }} />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'studio') {
    return (
      <div className={`skeleton-wrapper ${className}`} style={{ height: '100vh', display: 'flex', gap: '16px', padding: '16px' }}>
        <div className="skeleton-shimmer" style={{ width: '260px', height: '100%', borderRadius: '12px' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton-shimmer" style={{ height: '56px', borderRadius: '12px' }} />
          <div className="skeleton-shimmer" style={{ flex: 1, borderRadius: '12px' }} />
        </div>
      </div>
    )
  }

  // Default 'page' Variant
  return (
    <div className={`skeleton-wrapper ${className}`}>
      <div className="skeleton-shimmer skeleton-page-header" />
      <div className="skeleton-grid-3">
        <div className="skeleton-shimmer skeleton-card-box" />
        <div className="skeleton-shimmer skeleton-card-box" />
        <div className="skeleton-shimmer skeleton-card-box" />
      </div>
      <div className="skeleton-shimmer" style={{ height: '220px', borderRadius: '14px' }} />
    </div>
  )
}

export default SkeletonLoader
