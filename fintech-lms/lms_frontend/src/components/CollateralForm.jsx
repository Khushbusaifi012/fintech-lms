import React, { useState, useEffect } from 'react'
import api from '../api'

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
        const res = await api.get('/loan-applications')
        setApplications(res.data)
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
    <div className="form-box" style={{ position: 'relative' }}>
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

      <h2>Add Collateral</h2>

      <form onSubmit={submitCollateral} className="form-grid">
        <div>
          <label>Loan Application</label>
          <select
            value={loanApplicationId}
            onChange={e => setLoanApplicationId(e.target.value)}
          >
            <option value="">Select...</option>
            {applications.map(a => (
              <option key={a.id} value={a.id}>
                {a.customer_name} (#{a.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fund Name</label>
          <input
            value={fundName}
            onChange={e => setFundName(e.target.value)}
            placeholder="e.g. HDFC Equity Fund"
          />
        </div>

        <div>
          <label>Units</label>
          <input
            type="number"
            step="0.01"
            value={units}
            onChange={e => setUnits(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        <div>
          <label>NAV</label>
          <input
            type="number"
            step="0.01"
            value={nav}
            onChange={e => setNav(e.target.value)}
            placeholder="e.g. 52.30"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Collateral'}
        </button>
      </form>

      {/* Submit Loan Button */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button
          type="button"
          className="submit-btn"
          style={{ background: '#0b5fff', width: 200 }}
          onClick={submitLoan}
          disabled={!loanApplicationId}
        >
          Submit Loan
        </button>
      </div>
    </div>
  )
}
