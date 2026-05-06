import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/* Apply saved theme before first paint so CSS variables match Chart.js tick colors. */
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.classList.toggle('dark', savedTheme === 'dark')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
