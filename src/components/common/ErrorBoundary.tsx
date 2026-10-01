import React, { Component, type ReactNode, type ErrorInfo } from 'react'
import './ErrorBoundary.css'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name?: string
  variant?: 'global' | 'section' | 'card'
  onReset?: () => void
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  isDetailsOpen: boolean
  copied: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    isDetailsOpen: false,
    copied: false,
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })

    // Log runtime error cleanly to standard console
    console.group(`🚨 [ErrorBoundary] Caught crash in component: ${this.props.name || 'Anonymous'}`)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Component stack:', errorInfo?.componentStack)
    console.groupEnd()

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  public resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
      copied: false,
    })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public handleCopyDiagnostics = (): void => {
    const { error, errorInfo } = this.state
    const diagnostics = `[Frontend App Error Diagnostics]
Component: ${this.props.name || 'Unknown Component'}
Time: ${new Date().toISOString()}
Message: ${error?.message || 'No error message'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(diagnostics).then(() => {
        this.setState({ copied: true })
        setTimeout(() => this.setState({ copied: false }), 2000)
      })
    }
  }

  public toggleDetails = (): void => {
    this.setState(prev => ({ isDetailsOpen: !prev.isDetailsOpen }))
  }

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    const { variant = 'global', name } = this.props
    const { error, errorInfo, isDetailsOpen, copied } = this.state

    // Inline Card Variant
    if (variant === 'card') {
      return (
        <div className="eb-card-container">
          <div className="eb-card-text">
            <strong>⚠️ {name || 'Component'} Error:</strong> {error?.message || 'Failed to render.'}
          </div>
          <button className="eb-btn eb-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={this.resetError}>
            Retry
          </button>
        </div>
      )
    }

    // Section / Widget Variant
    if (variant === 'section') {
      return (
        <div className="eb-section-container">
          <div className="eb-section-header">
            <div className="eb-section-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="eb-section-title">Unable to display {name || 'this section'}</h3>
              <p className="eb-section-subtitle">{error?.message || 'An unexpected runtime error occurred.'}</p>
            </div>
          </div>
          <div className="eb-section-actions">
            <button className="eb-btn eb-btn-primary" onClick={this.resetError}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Try Again
            </button>
            <button className="eb-details-toggle" onClick={this.toggleDetails}>
              <span className={`eb-details-toggle-icon ${isDetailsOpen ? 'open' : ''}`}>▶</span>
              {isDetailsOpen ? 'Hide Details' : 'View Details'}
            </button>
          </div>

          {isDetailsOpen && (
            <div className="eb-details-box" style={{ width: '100%' }}>
              <div className="eb-details-header">
                <span className="eb-details-title">{error?.name || 'Error Trace'}</span>
                <button className="eb-copy-btn" onClick={this.handleCopyDiagnostics}>
                  {copied ? '✓ Copied!' : 'Copy Info'}
                </button>
              </div>
              <pre className="eb-stack-trace">
                {error?.message}
                {'\n'}
                {error?.stack}
                {errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      )
    }

    // Default Full Application Global Variant
    return (
      <div className="eb-global-container">
        <div className="eb-global-background-glow" />
        <div className="eb-global-card">
          <div className="eb-header-badge">
            <span className="eb-header-badge-dot" />
            Application Error Shield
          </div>

          <h1 className="eb-title">Something went wrong</h1>
          <p className="eb-description">
            {name ? `An error occurred while loading the ${name} module.` : 'An unexpected error occurred while rendering the page.'} Don&apos;t worry, your progress and session remain saved.
          </p>

          <div className="eb-actions">
            <button className="eb-btn eb-btn-primary" onClick={this.resetError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Reload View
            </button>

            <button
              className="eb-btn eb-btn-secondary"
              onClick={() => {
                window.location.href = '/'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go to Home
            </button>

            <button
              className="eb-btn eb-btn-ghost"
              onClick={() => {
                window.location.reload()
              }}
            >
              Force App Refresh
            </button>
          </div>

          <button className="eb-details-toggle" onClick={this.toggleDetails}>
            <span className={`eb-details-toggle-icon ${isDetailsOpen ? 'open' : ''}`}>▶</span>
            {isDetailsOpen ? 'Hide Technical Diagnostics' : 'Show Technical Diagnostics'}
          </button>

          {isDetailsOpen && (
            <div className="eb-details-box">
              <div className="eb-details-header">
                <span className="eb-details-title">{error?.name || 'Error'}</span>
                <button className="eb-copy-btn" onClick={this.handleCopyDiagnostics}>
                  {copied ? '✓ Copied' : 'Copy Diagnostics'}
                </button>
              </div>
              <pre className="eb-stack-trace">
                {error?.message}
                {'\n'}
                {error?.stack}
                {errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }
}

/** Preset Global Error Boundary */
export function GlobalErrorBoundary(props: Omit<ErrorBoundaryProps, 'variant'>) {
  return <ErrorBoundary variant="global" {...props} />
}

/** Preset Section / Route Error Boundary */
export function SectionErrorBoundary(props: Omit<ErrorBoundaryProps, 'variant'>) {
  return <ErrorBoundary variant="section" {...props} />
}

/** Higher-Order Component Helper */
export function withErrorBoundary<P extends object>(
  ComponentToWrap: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps} name={errorBoundaryProps?.name || ComponentToWrap.displayName || ComponentToWrap.name}>
      <ComponentToWrap {...props} />
    </ErrorBoundary>
  )
  WrappedComponent.displayName = `WithErrorBoundary(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`
  return WrappedComponent
}
