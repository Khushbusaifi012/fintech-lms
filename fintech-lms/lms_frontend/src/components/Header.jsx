import React, { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="topbar">
      <div className="brand">
        <div className="logo">K</div>
        <div className="breadcrumbs">
          Loan Management System
        </div>
      </div>

      <div className="top-actions">
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <div className="avatar">K</div>
      </div>
    </div>
  )
}
