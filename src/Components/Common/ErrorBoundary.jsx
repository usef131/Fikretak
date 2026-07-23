import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Swap console for a real error-reporting service in production.
    console.error('Uncaught render error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{ borderRadius: '999px', padding: '0.6rem 2rem', fontWeight: 700 }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
