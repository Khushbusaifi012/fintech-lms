import React, { useState, useEffect } from 'react'
import api from '../api'
import { normalizeList } from '../utils/normalizeList'

export default function ApplicationForm() {
  const [products, setProducts] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState(null)

  const [form, setForm] = useState({
    customer_name: '',
    student: false,
    profession: '',
    dob: '',
    nationality: '',
    address: '',
    pan_number: '',
    purpose_of_loan: '',
    gender: '',
    designation: '',
    annual_income: '',
    cibil_score: '',
    loan_product: '',
    requested_amount: '',
  })

  useEffect(() => {
    api.get('/loan-products/')
      .then(res => setProducts(normalizeList(res.data)))
      .catch(err => console.error(err))
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  async function submit(e) {
    e.preventDefault()
    setMessage(null)

    try {
      const payload = {
        ...form,
        annual_income: form.annual_income ? parseFloat(form.annual_income) : null,
        cibil_score: form.cibil_score ? parseInt(form.cibil_score) : null,
        requested_amount: parseFloat(form.requested_amount),
      }

      await api.post('/loan-applications/', payload)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2500)

      setForm({
        customer_name: '',
        student: false,
        profession: '',
        dob: '',
        nationality: '',
        address: '',
        pan_number: '',
        purpose_of_loan: '',
        gender: '',
        designation: '',
        annual_income: '',
        cibil_score: '',
        loan_product: '',
        requested_amount: '',
      })

    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create application ❌' })
    }
  }

  return (
    <div className="application-page">
      {showSuccess && (
        <div className="toast top-toast success">
          Loan application created successfully ✅
        </div>
      )}

      <div className="card ui-panel">
        <header className="ui-card-head">
          <h2 className="ui-card-title">Create loan application</h2>
          <p className="ui-card-desc">Applicant profile, product selection, and requested amount.</p>
        </header>

        {message && <p className="ui-inline-error">{message.text}</p>}

        <form onSubmit={submit} className="form-grid ui-form">

          <input name="customer_name" placeholder="Customer Name" value={form.customer_name} onChange={handleChange} required />

          <label className="checkbox">
            <input type="checkbox" name="student" checked={form.student} onChange={handleChange} />
            Student
          </label>

          <input name="profession" placeholder="Profession" value={form.profession} onChange={handleChange} />

          <input type="date" name="dob" value={form.dob} onChange={handleChange} />

          <input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} />

          <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} />

          <input name="pan_number" placeholder="PAN Number" value={form.pan_number} onChange={handleChange} />

          <input name="purpose_of_loan" placeholder="Purpose of Loan" value={form.purpose_of_loan} onChange={handleChange} />

          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input name="designation" placeholder="Designation" value={form.designation} onChange={handleChange} />

          <input type="number" name="annual_income" placeholder="Annual Income" value={form.annual_income} onChange={handleChange} />

          <input type="number" name="cibil_score" placeholder="CIBIL Score" value={form.cibil_score} onChange={handleChange} />

          <select name="loan_product" value={form.loan_product} onChange={handleChange} required>
            <option value="">Select Loan Product</option>
            {(Array.isArray(products) ? products : []).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input type="number" name="requested_amount" placeholder="Requested Amount" value={form.requested_amount} onChange={handleChange} required />

          <button type="submit" className="btn btn-primary btn-block">
            Create application
          </button>

        </form>
      </div>
    </div>
  )
}
