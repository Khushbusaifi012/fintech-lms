import React, { useState, useEffect } from 'react'
import api from '../api'
import { normalizeList } from '../utils/normalizeList'

export default function Collaterals({ refreshKey }) {
  const [loanId, setLoanId] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchCollaterals(id) {
    const targetId = id || loanId
    if (!targetId) {
      setItems([])
      return setError('Please enter a Loan Application ID')
    }

    setLoading(true)
    setError(null)

    try {
      const res = await api.get(`/collaterals/${targetId}/`)
      const rows = normalizeList(res.data)
      if (rows.length > 0) {
        setItems(rows)
      } else {
        setItems([])
        setError('No collaterals found for this Loan ID')
      }
    } catch (e) {
      setItems([])
      if (e.response?.status === 404) {
        setError('No collaterals found for this Loan ID')
      } else {
        setError(e.response?.data || e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Refresh table when parent triggers (after new collateral added)
  useEffect(() => {
    if (loanId) fetchCollaterals()
  }, [refreshKey])

  return (
    <div className="card ui-panel collaterals-panel">
      <header className="ui-card-head ui-card-head--row">
        <h2 className="ui-card-title">Collaterals</h2>
        <p className="ui-card-desc">Fetch holdings by loan application ID.</p>
      </header>

      <div className="ui-toolbar">
        <input
          className="ui-input ui-input-grow"
          value={loanId}
          onChange={e => setLoanId(e.target.value)}
          placeholder="Loan application ID"
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={() => fetchCollaterals()}>
          Fetch
        </button>
      </div>

      {loading && <div className="muted-inline">Loading…</div>}
      {error && <div className="ui-inline-error">{error}</div>}

      {items.length > 0 && (
        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Fund</th>
                <th>Units</th>
                <th>NAV</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(items) ? items : []).map((c, i) => (
                <tr key={i}>
                  <td>{c.fund_name}</td>
                  <td className="mono">{c.units}</td>
                  <td className="amount">₹ {c.nav}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && items.length === 0 && !error && <div className="empty">No data</div>}
    </div>
  )
}
