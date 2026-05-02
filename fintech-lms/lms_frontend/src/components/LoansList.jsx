import React, { useEffect, useState } from 'react'
import api from '../api'
import { normalizeList } from '../utils/normalizeList'

export default function LoansList() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [closingId, setClosingId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null) 

  // Fetch loans
  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/ongoing-loans/')
      .then(res => { if (mounted) setLoans(normalizeList(res.data)) })
      .catch(e => { if (mounted) setError(e.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => mounted = false
  }, [])

  // Open confirmation modal
  const openConfirm = (loan) => {
    setSelectedLoan(loan)
    setShowConfirm(true)
  }

  // Close loan after confirmation
  const confirmClose = async () => {
    const loanId = selectedLoan.id
    setClosingId(loanId)
    setShowConfirm(false)
    setToast(null)

    try {
      await api.post(`/loans/${loanId}/close/`)
      setLoans(prev =>
        (Array.isArray(prev) ? prev : []).map(l =>
          l.id === loanId ? { ...l, status: 'Closed' } : l
        )
      )
      setToast({ type: 'success', text: `Loan #${loanId} closed successfully ✅` })
    } catch (e) {
      setToast({ type: 'error', text: e.response?.data || `Failed to close loan #${loanId} ❌` })
    } finally {
      setClosingId(null)
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) return <div className="card ui-panel muted-loading">Loading loans…</div>
  if (error)
    return (
      <div className="card ui-panel ui-inline-error-wrap">
        Error: {error}
      </div>
    )

  return (
    <div className="loans-page" style={{ position: 'relative' }}>
      <div className="card ui-panel panel-block">
        <header className="ui-card-head ui-card-head--row">
          <h2 className="ui-card-title">Ongoing loans</h2>
          <p className="ui-card-desc">Active portfolio; close loans when settled.</p>
        </header>

        {toast && (
          <div role="status" className={`toast-floating toast-floating--${toast.type}`}>
            {toast.text}
          </div>
        )}

        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Application</th>
                <th>Approved</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(loans) ? loans : []).map(l => (
                <tr key={l.id}>
                  <td className="mono">{l.id}</td>
                  <td className="mono">{l.loan_application}</td>
                  <td className="amount">₹ {l.approved_amount}</td>
                  <td className="amount">₹ {l.outstanding_amount}</td>
                  <td>
                    <span className={`ui-badge ui-badge--${l.status?.toLowerCase?.() || 'muted'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    {l.status !== 'Closed' ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => openConfirm(l)}
                        disabled={closingId === l.id}
                      >
                        {closingId === l.id ? 'Closing…' : 'Close'}
                      </button>
                    ) : (
                      <span className="ui-closed-label">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirm && selectedLoan && (
        <div className="ui-dialog-overlay" role="presentation">
          <div className="ui-dialog" role="dialog" aria-labelledby="loan-close-title">
            <h3 id="loan-close-title" className="ui-dialog-title">
              Close loan?
            </h3>
            <p className="ui-dialog-desc">Loan #{selectedLoan.id} will be marked settled.</p>
            <div className="ui-dialog-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmClose}>
                Confirm close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
