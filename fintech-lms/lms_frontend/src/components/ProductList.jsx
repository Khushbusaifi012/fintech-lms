import React, { useEffect, useState } from 'react'
import api from '../api'

export default function ProductList(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    api.get('/loan-products/').then(res=>{
      if(mounted) setProducts(res.data)
    }).catch(err=>{
      if(mounted) setError(err.message || 'Failed to load')
    }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted = false
  },[])

  if(loading) return <div>Loading products...</div>
  if(error) return <div style={{color:'red'}}>Error: {error}</div>

  return (
    <div>
      <h2>Loan Products</h2>
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
          {products.map(p=> (
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
  )
}
