import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Dashboard from './components/Dashboard'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm.jsx'
import ApplicationsList from './components/ApplicationsList'
import ApplicationForm from './components/ApplicationForm'
import Collaterals from './components/Collaterals'
import CollateralForm from './components/CollateralForm'
import LoansList from './components/LoansList'

export default function App() {
  const [view, setView] = useState('dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar view={view} setView={setView} />

      <div style={{ flex: 1, padding: 24 }}>
        <Header />

        {view === 'dashboard' && <Dashboard />}

        {view === 'products' && (
          <>
            <ProductForm />
            <ProductList />
          </>
        )}

        {view === 'applications' && (
          <>
            <ApplicationForm />
            <ApplicationsList />
          </>
        )}

        {view === 'collaterals' && (
          <>
            <CollateralForm />
            <Collaterals />
          </>
        )}

        {view === 'loans' && <LoansList />}
      </div>
    </div>
  )
}
