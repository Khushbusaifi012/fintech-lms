import React, { useEffect, useMemo, useState } from 'react'
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

function readChartAxisStyles() {
  const root = getComputedStyle(document.documentElement)
  const axis = root.getPropertyValue('--chart-axis').trim()
  const grid = root.getPropertyValue('--chart-grid').trim()
  return {
    axis: axis || '#1e293b',
    grid: grid || 'rgba(15, 23, 42, 0.11)',
  }
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
  const [chartPaintKey, setChartPaintKey] = useState(0)

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
          newLoans: (data.new_loans || []).map((n) => Number(n) || 0),
          disbursements: (data.disbursements || []).map((n) => Number(n) || 0),
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

  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => setChartPaintKey((k) => k + 1))
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const { axis: axisColor, grid: gridColor } = useMemo(
    () => readChartAxisStyles(),
    [chartPaintKey]
  )

  const loanMax = useMemo(() => {
    const arr = loanSeries.newLoans
    if (!arr.length) return 0
    return Math.max(0, ...arr.map((n) => Number(n)))
  }, [loanSeries.newLoans])

  const disbMax = useMemo(() => {
    const arr = loanSeries.disbursements
    if (!arr.length) return 0
    return Math.max(0, ...arr.map((n) => Number(n)))
  }, [loanSeries.disbursements])

  const recentLoans =
    loanSeries.newLoans.length > 0 ? loanSeries.newLoans[loanSeries.newLoans.length - 1] : 0

  /* ---------- CHART DATA ---------- */
  const barData = {
    labels: loanSeries.labels,
    datasets: [
      {
        label: 'New Loans',
        data: loanSeries.newLoans,
        backgroundColor: 'rgba(20,184,166,0.85)',
        borderRadius: 6,
        maxBarThickness: 56,
      },
    ],
  }

  const lineData = {
    labels: loanSeries.labels,
    datasets: [
      {
        label: 'Disbursements',
        data: loanSeries.disbursements,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20,184,166,0.18)',
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  }

  /* ---------- CHART OPTIONS ---------- */
  const barOptions = useMemo(
    () => ({
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
      scales: {
        x: {
          ticks: {
            color: axisColor,
            font: { size: 11, weight: '500' },
            maxRotation: 0,
            autoSkip: true,
          },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          max: loanMax === 0 ? 10 : undefined,
          ticks: {
            color: axisColor,
            font: { size: 11, weight: '500' },
          },
          grid: { color: gridColor },
        },
      },
    }),
    [axisColor, gridColor, loanMax]
  )

  const lineOptions = useMemo(
    () => ({
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
      scales: {
        x: {
          ticks: {
            color: axisColor,
            font: { size: 11, weight: '500' },
            maxRotation: 0,
            autoSkip: true,
          },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          max: disbMax === 0 ? 250000 : undefined,
          ticks: {
            color: axisColor,
            font: { size: 11, weight: '500' },
            callback: (v) => formatINR(v),
          },
          grid: { color: gridColor },
        },
      },
    }),
    [axisColor, gridColor, disbMax]
  )

  return (
    <div className="dashboard-page">
      {/* chart: no area fill — avoids Chart.js Filler plugin / CDN stale bundles */}
      <div className="dashboard-toolbar">
        <span className="dashboard-toolbar-label">Overview</span>
        <div className="sync-pill">{lastSynced ? `Synced · ${lastSynced}` : 'Loading…'}</div>
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
      <div className="chart-grid">
        {/* Bar Chart */}
        <div className="card chart-panel">
          <div className="chart-panel-title">New Loans</div>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Line Chart */}
        <div className="card chart-panel">
          <div className="chart-panel-title">Loan Disbursements</div>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  )
}
