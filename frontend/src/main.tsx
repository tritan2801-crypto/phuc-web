import React from 'react'
import ReactDOM from 'react-dom/client'
import posthog from 'posthog-js'
import App from './App'
import './index.css'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    loaded: (ph) => {
      if (import.meta.env.DEV) {
        ph.debug();
      }
    }
  })
}

// Global fetch wrapper to propagate PostHog correlation headers to the NestJS backend API
const originalFetch = window.fetch
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : (input as Request).url
  
  // Only inject correlation headers for local app API calls
  if (url.startsWith('/api/') || url.includes('/api/')) {
    try {
      const distinctId = posthog.get_distinct_id()
      const sessionId = posthog.get_session_id()
      
      if (distinctId || sessionId) {
        const newInit = { ...init }
        const headers = new Headers(newInit.headers)
        
        if (distinctId) {
          headers.set('X-POSTHOG-DISTINCT-ID', distinctId)
        }
        if (sessionId) {
          headers.set('X-POSTHOG-SESSION-ID', sessionId)
        }
        
        newInit.headers = headers
        return originalFetch(input, newInit)
      }
    } catch (err) {
      console.warn('Error setting PostHog correlation headers:', err)
    }
  }
  return originalFetch(input, init)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
