import React, { useState, useEffect } from 'react'
import api from '../api'

export default function ProductForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    interest_rate: '',
    ltv: '',
    min_amount: '',
    max_amount: '',
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  function apiErrorMessage(err, fallback) {
    const data = err.response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data?.detail) return String(Array.isArray(data.detail) ? data.detail[0] : data.detail)
    if (data && typeof data === 'object') {
      const pairs = Object.entries(data)
      if (pairs.length === 1) {
        const [k, v] = pairs[0]
        const msg = Array.isArray(v) ? v[0] : v
        return `${k}: ${msg}`
      }
      return JSON.stringify(data)
    }
    if (!err.response) return `${fallback} (check API URL / network)`
    return fallback
  }

  async function submit(e) {
    e.preventDefault()
    const interest_rate = parseFloat(form.interest_rate)
    const ltv = parseFloat(form.ltv)
    const min_amount = parseFloat(form.min_amount)
    const max_amount = parseFloat(form.max_amount)
    if ([interest_rate, ltv, min_amount, max_amount].some(n => Number.isNaN(n))) {
      setToast({ text: 'Enter valid numbers for rate, LTV, and amounts', type: 'error' })
      return
    }
    try {
      await api.post('/loan-products/', {
        name: form.name.trim(),
        interest_rate,
        ltv,
        min_amount,
        max_amount,
      })
      setToast({ text: 'Product created successfully ✅', type: 'success' })
      setForm({ name: '', interest_rate: '', ltv: '', min_amount: '', max_amount: '' })
      onCreated?.()
    } catch (err) {
      console.error(err)
      setToast({
        text: apiErrorMessage(err, 'Error creating product'),
        type: 'error',
      })
    }
  }

  return (
    <div className="card ui-panel product-form">
      <header className="ui-card-head">
        <h3 className="ui-card-title">Create loan product</h3>
        <p className="ui-card-desc">Define rate, LTV band, and sanctioned amount limits.</p>
      </header>

      <div className="toast-wrap">
        {toast && (
          <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            {toast.text}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="form-grid ui-form">
        <div className="form-field">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="e.g. Gold Loan"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-field">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            placeholder="e.g. 10.5"
            value={form.interest_rate}
            onChange={e => setForm({ ...form, interest_rate: e.target.value })}
            required
          />
        </div>

        <div className="form-field">
          <label>LTV (%)</label>
          <input
            type="number"
            placeholder="e.g. 70"
            value={form.ltv}
            onChange={e => setForm({ ...form, ltv: e.target.value })}
            required
          />
        </div>

        <div className="form-field">
          <label>Minimum Amount</label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={form.min_amount}
            onChange={e => setForm({ ...form, min_amount: e.target.value })}
            required
          />
        </div>

        <div className="form-field">
          <label>Maximum Amount</label>
          <input
            type="number"
            placeholder="e.g. 500000"
            value={form.max_amount}
            onChange={e => setForm({ ...form, max_amount: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create product
          </button>
        </div>
      </form>
    </div>
  )
}
