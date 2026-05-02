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

function formatINR(n) {
  if (n == null || Number.isNaN(Number(n))) return '₹ —'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n))
}

/* ---------- STAT CARD COMPONENT ---------- */
function StatCard({ title, value, delta, muted }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="stat-value">{value}</div>
        {delta ? (
          <div
            className="stat-delta"
            style={{ color: delta.startsWith('-') ? '#DE350B' : '#00A86B' }}
          >
            {delta}
          </div>
        ) : null}
      </div>
      {muted && <div className="stat-muted">{muted}</div>}
    </div>
  )
}

/* ---------- DASHBOARD COMPONENT ---------- */
export default function Dashboard() {
  const defaultSummary = {
    total_disbursed: 0,
    total_sanctioned: 0,
    active_securities: 0,
    total_repayment: 0,
  }

  const [stats, setStats] = useState({
    activeLoans: 0,
    applications: 0,
    products: 0,
  })

  const [summary, setSummary] = useState(defaultSummary)

  const [loanSeries, setLoanSeries] = useState({
    labels: [],
    newLoans: [],
    disbursements: [],
  })

  const [lastSynced, setLastSynced] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/dashboard/graphs/')

        const counts = data.counts || {}
        setStats({
          activeLoans: counts.active_loans ?? 0,
          applications: counts.applications ?? 0,
          products: counts.products ?? 0,
        })

        setSummary({ ...defaultSummary, ...data.summary })

        setLoanSeries({
          labels: data.labels || [],
          newLoans: data.new_loans || [],
          disbursements: data.disbursements || [],
        })

        setLastSynced(
          new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        )
      } catch (err) {
        console.error('Dashboard load error', err)
      }
    }

    load()
  }, [])

  const recentLoans =
    loanSeries.newLoans.length > 0 ? loanSeries.newLoans[loanSeries.newLoans.length - 1] : 0

  /* ---------- CHART DATA ---------- */
  const barData = {
    labels: loanSeries.labels,
    datasets: [
      {
        label: 'New Loans',
        data: loanSeries.newLoans,
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
        data: loanSeries.disbursements,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255,107,107,0.15)',
        tension: 0.4,
      },
    ],
  }

  /* ---------- CHART OPTIONS ---------- */
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatINR(ctx.raw)}`,
        },
      },
    },
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Loan Dashboard</h2>
        <div style={{ color: '#6b7280' }}>
          {lastSynced ? `Last synced ${lastSynced}` : 'Loading…'}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="kpi-grid">
        <StatCard title="Active Loans" value={stats.activeLoans} muted="Active and ongoing" />
        <StatCard title="Applications" value={stats.applications} muted="Total applications" />
        <StatCard title="Products" value={stats.products} muted="Loan products" />
        <StatCard title="New Loans" value={recentLoans} muted="Latest day in chart" />
        <StatCard title="Total Disbursed" value={formatINR(summary.total_disbursed)} />
        <StatCard title="Total Sanctioned" value={formatINR(summary.total_sanctioned)} />
        <StatCard title="Active Securities" value={summary.active_securities} />
        <StatCard title="Total Repayment" value={formatINR(summary.total_repayment)} />
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
