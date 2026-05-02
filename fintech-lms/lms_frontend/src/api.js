import axios from 'axios'

/**
 * Production must set VITE_API_BASE_URL (e.g. https://your-backend.onrender.com/api).
 * Local dev: defaults to Vite proxy path `/api` → http://127.0.0.1:8000 (see vite.config.mjs).
 */
function resolveBaseURL() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim().replace(/\/$/, '')
  }
  if (import.meta.env.DEV) {
    return '/api'
  }
  console.warn(
    '[api] VITE_API_BASE_URL is unset; API requests may fail in production builds.'
  )
  return ''
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
