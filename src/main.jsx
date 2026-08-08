import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('PureLife crash:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0F1F17', color: '#F5F0E8', minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '2rem', fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h2 style={{ color: '#C9973A', marginBottom: 12 }}>PureLife — Error de inicio</h2>
          <pre style={{
            background: 'rgba(255,255,255,0.05)', padding: '1rem',
            borderRadius: 8, maxWidth: 600, overflow: 'auto',
            fontSize: 12, color: '#ff6b6b', textAlign: 'left'
          }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack?.split('\n').slice(0,5).join('\n')}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20, padding: '0.7rem 1.5rem',
              background: '#1A5C3A', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer', fontSize: 14
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    {/* reducedMotion="never": fuerza que whileHover/whileTap se reproduzcan
        siempre, sin importar la preferencia "Reducir movimiento" del SO */}
    <MotionConfig reducedMotion="never">
      <AuthProvider>
        <App />
      </AuthProvider>
    </MotionConfig>
  </ErrorBoundary>
)
