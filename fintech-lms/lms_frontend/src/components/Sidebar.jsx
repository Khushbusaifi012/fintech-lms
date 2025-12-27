export default function Sidebar({ view, setView }) {
  const Item = ({ id, label }) => (
    <div
      onClick={() => setView(id)}
      style={{
        padding: '10px 14px',
        borderRadius: 8,
        cursor: 'pointer',
        background: view === id ? 'var(--primary)' : 'transparent',
        color: view === id ? '#fff' : 'var(--text)',
        marginBottom: 6,
      }}
    >
      {label}
    </div>
  )

  return (
    <div
      style={{
        width: 220,
        padding: 16,
        borderRight: '1px solid var(--border)',
        background: 'var(--card)',
      }}
    >
      <h3 style={{ marginBottom: 20 }}>LMS Dashboard</h3>
      <Item id="dashboard" label="📊 Dashboard" />
      <Item id="products" label="📦 Loan Products" />
      <Item id="applications" label="📝 Applications" />
      <Item id="collaterals" label="💎 Collaterals" />
      <Item id="loans" label="💳 Loans" />
    </div>
  )
}
