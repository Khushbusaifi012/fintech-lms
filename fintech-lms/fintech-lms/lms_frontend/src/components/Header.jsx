import React, { useEffect, useState } from 'react'

export default function Header({ title, subtitle }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <h1 className="page-shell-title">{title}</h1>
        {subtitle ? <p className="page-shell-sub">{subtitle}</p> : null}
      </div>

      <div className="top-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  d="M21 14.79A9 9 0 1 1 11.21 3a7 7 0 0 0 10 11.79z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>

        <div className="user-chip" role="presentation">
          <div className="avatar" aria-hidden="true">
            K
          </div>
        </div>
      </div>
    </header>
  )
}
