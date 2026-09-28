import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { BookmarkProvider } from './context/BookmarkContext'
import { ProgressProvider } from './context/ProgressContext'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from './app/store'
import { queryClient } from './lib/query/queryClient'
import App from './App'
import './index.css'
import './horizon-candidate-theme.css'

// Clean up any legacy demo mock data from previous sessions
try {
  const reqKey = 'supabase_access_requests_local'
  const raw = localStorage.getItem(reqKey)
  if (raw) {
    const list = JSON.parse(raw)
    const cleaned = Array.isArray(list)
      ? list.filter((r: any) => !r.userEmail?.includes('demo.io') && r.userId !== 'usr_candidate_demo')
      : []
    localStorage.setItem(reqKey, JSON.stringify(cleaned))
  }
} catch {
  // ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <BookmarkProvider>
                <ProgressProvider>
                  <App />
                </ProgressProvider>
              </BookmarkProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)

// Universal PWA Service Worker Registration for offline caching
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        if (reg.installing) {
          reg.installing.addEventListener('statechange', () => {
            if (reg.installing?.state === 'installed') {
              console.info('[PWA] MasterDocs syllabus & app shell cached for offline access.')
            }
          })
        }
      })
      .catch((err) => {
        console.info('[PWA] Service Worker registration status:', err?.message || err)
      })
  })
}




