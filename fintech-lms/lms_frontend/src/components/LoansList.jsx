import React, { useEffect, useState } from 'react'
import api from '../api'

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
      .then(res => { if (mounted) setLoans(res.data) })
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
      setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'Closed' } : l))
      setToast({ type: 'success', text: `Loan #${loanId} closed successfully ✅` })
    } catch (e) {
      setToast({ type: 'error', text: e.response?.data || `Failed to close loan #${loanId} ❌` })
    } finally {
      setClosingId(null)
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) return <div>Loading loans...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div style={{ position: 'relative' }}>
      <h2>Ongoing Loans</h2>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: toast.type === 'success' ? '#16a34a' : '#dc2626',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          {toast.text}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
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
          {loans.map(l => (
            <tr key={l.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{l.id}</td>
              <td>{l.loan_application}</td>
              <td>{l.approved_amount}</td>
              <td>{l.outstanding_amount}</td>
              <td>{l.status}</td>
              <td>
                {l.status !== 'Closed' ? (
                  <button
                    onClick={() => openConfirm(l)}
                    disabled={closingId === l.id}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#0b5fff',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {closingId === l.id ? 'Closing...' : 'Close'}
                  </button>
                ) : (
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Closed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirm && selectedLoan && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
          }}
        >
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
          }}>
            <h3>Confirm Close Loan</h3>
            <p>Are you sure you want to close loan #{selectedLoan.id}?</p>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmClose}
                style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: '#0b5fff', color: '#fff', border: 'none' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
