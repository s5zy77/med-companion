import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MedNote Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>😔</div>
            <h1 style={{ fontSize: 28, fontWeight: 600, fontFamily: "'Lora', serif", marginBottom: 12, color: 'var(--text)' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 8, lineHeight: 1.6 }}>
              Don't worry, your medicines and data are safe. Let's try again.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              className="btn btn-primary"
              style={{ fontSize: 16, padding: '14px 32px', minHeight: 48 }}
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              aria-label="Reload the application"
            >
              🔄 Reload MedNote
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
