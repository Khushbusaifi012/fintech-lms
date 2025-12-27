import React, { useState, useEffect } from 'react'
import api from '../api'

export default function ProductForm() {
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

  async function submit(e) {
    e.preventDefault()
    try {
      await api.post('/loan-products/', {
        ...form,
        interest_rate: +form.interest_rate,
        ltv: +form.ltv,
        min_amount: +form.min_amount,
        max_amount: +form.max_amount,
      })
      setToast({ text: 'Product created successfully ✅', type: 'success' })
      setForm({ name: '', interest_rate: '', ltv: '', min_amount: '', max_amount: '' })
    } catch (err) {
      setToast({ text: 'Error creating product', type: 'error' })
    }
  }

  return (
    <div className="card product-form" style={{ position: 'relative' }}>
      {/* Toast popup above the form */}
      <div className="toast-wrap">
        {toast && (
          <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            {toast.text}
          </div>
        )}
      </div>

      <h3>Create Loan Product</h3>

      <form onSubmit={submit} className="form-grid">
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
          <button type="submit" className="primary-btn">
            Create Product
          </button>
        </div>
      </form>
    </div>
  )
}
