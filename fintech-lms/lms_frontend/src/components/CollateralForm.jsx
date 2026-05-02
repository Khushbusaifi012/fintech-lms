import React, { useState, useEffect } from 'react'
import api from '../api'
import { normalizeList } from '../utils/normalizeList'

export default function CollateralForm({ onSuccess }) {
  const [loanApplicationId, setLoanApplicationId] = useState('')
  const [fundName, setFundName] = useState('')
  const [units, setUnits] = useState('')
  const [nav, setNav] = useState('')
  const [applications, setApplications] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load loan applications
  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await api.get('/loan-applications/')
        setApplications(normalizeList(res.data))
      } catch (err) {
        console.error(err)
      }
    }
    loadApplications()
  }, [])

  // Toast helper
  function showToast(type, text) {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3000)
  }

  // Add Collateral
  async function submitCollateral(e) {
    e.preventDefault()

    if (!loanApplicationId || !fundName || !units || !nav) {
      return showToast('error', 'Please fill all fields ❌')
    }

    setLoading(true)

    try {
      const payload = {
        loan_application: loanApplicationId,
        fund_name: fundName,
        units: Number(units),
        nav: Number(nav),
      }

      await api.post('/collaterals/', payload)

      showToast('success', 'Collateral created successfully ✅')

      setFundName('')
      setUnits('')
      setNav('')
      onSuccess?.()
    } catch (err) {
      showToast('error', err.response?.data || 'Failed to create collateral ❌')
    } finally {
      setLoading(false)
    }
  }

  // Submit Loan
  async function submitLoan() {
    if (!loanApplicationId) {
      return showToast('error', 'Select a loan application first ❌')
    }

    try {
      await api.post(`/loan-applications/${loanApplicationId}/submit/`)
      showToast('success', 'Loan submitted successfully ✅')
      onSuccess?.()
    } catch (err) {
      showToast('error', err.response?.data || 'Failed to submit loan ❌')
    }
  }

  return (
    <div className="card ui-panel collateral-shell" style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'success' ? '#16a34a' : '#dc2626',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 10,
            fontWeight: 600,
            zIndex: 9999,
          }}
        >
          {toast.text}
        </div>
      )}

      <header className="ui-card-head">
        <h2 className="ui-card-title">Add collateral</h2>
        <p className="ui-card-desc">Link mutual fund units to an application before submit.</p>
      </header>

      <form onSubmit={submitCollateral} className="form-grid collateral-form ui-form">
        <div className="form-field">
          <label>Loan Application</label>
          <select
            value={loanApplicationId}
            onChange={e => setLoanApplicationId(e.target.value)}
          >
            <option value="">Select...</option>
            {(Array.isArray(applications) ? applications : []).map(a => (
              <option key={a.id} value={a.id}>
                {a.customer_name} (#{a.id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Fund Name</label>
          <input
            value={fundName}
            onChange={e => setFundName(e.target.value)}
            placeholder="e.g. HDFC Equity Fund"
          />
        </div>

        <div className="form-field">
          <label>Units</label>
          <input
            type="number"
            step="0.01"
            value={units}
            onChange={e => setUnits(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        <div className="form-field">
          <label>NAV</label>
          <input
            type="number"
            step="0.01"
            value={nav}
            onChange={e => setNav(e.target.value)}
            placeholder="e.g. 52.30"
          />
        </div>

        <div className="collateral-form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-collateral-submit"
            disabled={loading}
          >
            {loading ? 'Adding…' : 'Add collateral'}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-collateral-submit"
            onClick={submitLoan}
            disabled={!loanApplicationId}
          >
            Submit loan
          </button>
        </div>
      </form>
    </div>
  )
}
