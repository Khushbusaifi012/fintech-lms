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

const PAGE_META = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Portfolio metrics and disbursement trends',
  },
  products: {
    title: 'Loan products',
    subtitle: 'Create products and maintain the catalogue',
  },
  applications: {
    title: 'Applications',
    subtitle: 'Capture and track loan requests',
  },
  collaterals: {
    title: 'Collaterals',
    subtitle: 'Securities pledged against applications',
  },
  loans: {
    title: 'Loans',
    subtitle: 'Active book and closures',
  },
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [productRefreshKey, setProductRefreshKey] = useState(0)
  const headerMeta = PAGE_META[view]

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />

      <div className="app-main">
        <Header title={headerMeta.title} subtitle={headerMeta.subtitle} />

        <main className="view-stack">
          {view === 'dashboard' && <Dashboard />}

          {view === 'products' && (
            <>
              <ProductForm onCreated={() => setProductRefreshKey(k => k + 1)} />
              <ProductList refreshKey={productRefreshKey} />
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
        </main>
      </div>
    </div>
  )
}
