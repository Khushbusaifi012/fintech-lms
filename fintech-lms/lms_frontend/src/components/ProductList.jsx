import React, { useEffect, useState } from 'react'
import api from '../api'
import { normalizeList } from '../utils/normalizeList'

export default function ProductList({ refreshKey }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)
    api.get('/loan-products/').then(res=>{
      if(mounted) setProducts(normalizeList(res.data))
    }).catch(err=>{
      if(mounted) setError(err.message || 'Failed to load')
    }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted = false
  },[refreshKey])

  if (loading)
    return <div className="card muted-loading">Loading products…</div>
  if (error)
    return (
      <div className="card error-panel">
        <strong>Error:</strong> {error}
      </div>
    )

  return (
    <div className="card ui-panel panel-block">
      <header className="ui-card-head ui-card-head--row">
        <h2 className="ui-card-title">Loan products</h2>
        <p className="ui-card-desc">Active catalogue available for new applications.</p>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
            <th>Name</th>
            <th>Interest Rate</th>
            <th>LTV (%)</th>
            <th>Min</th>
            <th>Max</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(products) ? products : []).map(p=> (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.interest_rate}</td>
              <td>{p.ltv}</td>
              <td>{p.min_amount}</td>
              <td>{p.max_amount}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
