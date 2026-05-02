export default function Sidebar({ view, setView }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: IconChart },
    { id: 'products', label: 'Loan Products', icon: IconCube },
    { id: 'applications', label: 'Applications', icon: IconFile },
    { id: 'collaterals', label: 'Collaterals', icon: IconShield },
    { id: 'loans', label: 'Loans', icon: IconCard },
  ]

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark" aria-hidden />
        <span className="sidebar-brand-title">Loan LMS</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-nav-item${view === id ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => setView(id)}
          >
            <span className="sidebar-nav-icon" aria-hidden>
              <Icon />
            </span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16l4-4 4 4 6-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconFile() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
    </svg>
  )
}
