import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-body)',
          fontFamily: 'var(--font-family)'
        }}>
          <span className="material-icons-round" style={{ fontSize: '80px', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            error_outline
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem', lineHeight: '1.6' }}>
            We encountered an unexpected error. Don't worry, your data is safe. 
            Please try refreshing the page or head back to the home page.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="btn btn-secondary"
            >
              Back to Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Error Details (Dev Only)</summary>
              <pre style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#b91c1c', overflowX: 'auto' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
