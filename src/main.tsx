// import React from 'react' // Not needed in React 19
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { validateEnvironment } from './utils/security'
import './utils/routingDebug' // Import routing debug utilities
import './utils/performanceMonitor' // Import performance monitoring

// Validate environment variables on startup
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
}

// Security warning for development mode
if (process.env.NODE_ENV === 'development') {
  console.warn('🔒 Running in development mode - sensitive data may be logged');
}

createRoot(document.getElementById('root')!).render(
  <App />
)
