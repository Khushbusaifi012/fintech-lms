import React, { useEffect, useState } from 'react'
import api from '../api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

/* ---------- STAT CARD COMPONENT ---------- */
function StatCard({ title, value, delta, muted }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="stat-value">{value}</div>
        {delta && (
          <div
            className="stat-delta"
            style={{ color: delta.startsWith('-') ? '#DE350B' : '#00A86B' }}
          >
            {delta}
          </div>
        )}
      </div>
      {muted && <div className="stat-muted">{muted}</div>}
    </div>
  )
}

/* ---------- DASHBOARD COMPONENT ---------- */
export default function Dashboard() {
  const [stats, setStats] = useState({
    activeLoans: 0,
    applications: 0,
    products: 0,
  })

  const [loanSeries, setLoanSeries] = useState({ labels: [], values: [] })

  useEffect(() => {
    async function load() {
      try {
        const [ongoingRes, appsRes, productsRes] = await Promise.all([
          api.get('/ongoing-loans'),
          api.get('/loan-applications'),
          api.get('/loan-products'),
        ])

        setStats({
          activeLoans: ongoingRes.data.length || 0,
          applications: appsRes.data.length || 0,
          products: productsRes.data.length || 0,
        })

        const labels = []
        const values = []
        const now = new Date()

        for (let i = 9; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(now.getDate() - i)

          labels.push(
            d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          )
          values.push(
            Math.max(0, Math.round((ongoingRes.data.length || 0) * (0.5 + Math.random())) + i)
          )
        }

        setLoanSeries({ labels, values })
      } catch (err) {
        console.error('Dashboard load error', err)
      }
    }

    load()
  }, [])

  /* ---------- CHART DATA ---------- */
  const barData = {
    labels: loanSeries.labels,
    datasets: [
      {
        label: 'New Loans',
        data: loanSeries.values,
        backgroundColor: 'rgba(11,91,255,0.8)',
        borderRadius: 6,
      },
    ],
  }

  const lineData = {
    labels: loanSeries.labels,
    datasets: [
      {
        label: 'Disbursements',
        data: loanSeries.values.map(v => Math.round(v * 0.8)),
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255,107,107,0.15)',
        tension: 0.4,
      },
    ],
  }

  /* ---------- CHART OPTIONS ---------- */
  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  }

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Loan Dashboard</h2>
        <div style={{ color: '#6b7280' }}>Last synced 5 minutes ago</div>
      </div>

      {/* KPI GRID */}
      <div className="kpi-grid">
        <StatCard title="Active Loans" value={stats.activeLoans} muted="Active and ongoing" />
        <StatCard title="Applications" value={stats.applications} muted="Total applications" />
        <StatCard title="Products" value={stats.products} muted="Loan products" />
        <StatCard title="New Loans" value={loanSeries.values.at(-1) || 0} muted="Recent" />
        <StatCard title="Total Disbursed" value="₹ --" delta="+3%" />
        <StatCard title="Total Sanctioned" value="₹ --" />
        <StatCard title="Active Securities" value="--" delta="+1%" />
        <StatCard title="Total Repayment" value="₹ --" />
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        {/* Bar Chart */}
        <div className="card" style={{ height: 300 }}>
          <div style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>New Loans</div>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Line Chart */}
        <div className="card" style={{ height: 300 }}>
          <div style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>Loan Disbursements</div>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  )
}
