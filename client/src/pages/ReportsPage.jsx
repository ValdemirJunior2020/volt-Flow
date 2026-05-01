// client/src/pages/ReportsPage.jsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import { BarChart2, TrendingUp, Wallet, Activity } from 'lucide-react'
import { reports } from '../data/mockBusinessData'

const revenueData = [
  { month: 'Jan', revenue: 58200, jobs: 42 },
  { month: 'Feb', revenue: 64400, jobs: 48 },
  { month: 'Mar', revenue: 73500, jobs: 55 },
  { month: 'Apr', revenue: 81100, jobs: 63 },
  { month: 'May', revenue: 86420, jobs: 66 },
]

export default function ReportsPage() {
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Business Intelligence" title="Reports" description="Monitor revenue, job volume, margins, technician utilization, and accounting health." primaryLabel="Build Report" secondaryLabel="Download CSV" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {reports.map((report, index) => <KpiCard key={report.label} icon={[BarChart2, Wallet, TrendingUp, Activity][index]} label={report.label} value={report.value} sub={report.change} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900">Monthly Revenue</h2>
          <p className="text-xs text-slate-500 mb-4">Revenue trend by closed electrical work.</p>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenueData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} /><Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#0f1c2e" /></BarChart></ResponsiveContainer></div>
        </section>
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900">Job Volume</h2>
          <p className="text-xs text-slate-500 mb-4">Completed and scheduled jobs by month.</p>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={revenueData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="jobs" stroke="#f5d000" strokeWidth={4} dot={{ r: 5 }} /></LineChart></ResponsiveContainer></div>
        </section>
      </div>
    </div>
  )
}
