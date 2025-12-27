import React, { useEffect, useState } from 'react'
import api from '../api'

export default function ApplicationsList({ refreshKey }) {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [refreshKey]) 

  function load() {
    setLoading(true)
    setError(null)

    api.get('/loan-applications/')
      .then(res => setApps(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  if (loading) return <div>Loading applications...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div className="card">
      <h3 style={{ marginBottom: 12 }}>Loan Applications</h3>

      <div className="table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Profession</th>
              <th>Income</th>
              <th>CIBIL</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {apps.length === 0 && (
              <tr>
                <td colSpan="10" className="empty">
                  No applications found
                </td>
              </tr>
            )}

            {apps.map(a => (
              <tr key={a.id}>
                <td className="mono">#{a.id}</td>
                <td>{a.customer_name}</td>
                <td>{a.gender || '--'}</td>
                <td>{a.dob || '--'}</td>
                <td>{a.profession || '--'}</td>
                <td>₹ {a.annual_income || '--'}</td>
                <td>{a.cibil_score || '--'}</td>
                <td>{a.loan_product_name || a.loan_product}</td>
                <td className="amount">₹ {a.requested_amount}</td>
                <td>
                  <span
                    className={`status ${a.status?.toLowerCase()}`}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: '#fff',
                      background:
                        a.status === 'CLOSED'
                          ? '#16a34a'
                          : a.status === 'APPROVED'
                          ? '#0b5fff'
                          : a.status === 'REJECTED'
                          ? '#dc2626'
                          : '#6b7280',
                    }}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
