// client/src/components/business/StatusBadge.jsx
import React from 'react'

const statusStyles = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Estimate Sent': 'bg-slate-50 text-slate-700 border-slate-200',
  'Ready to Invoice': 'bg-amber-50 text-amber-700 border-amber-200',
  Draft: 'bg-slate-50 text-slate-700 border-slate-200',
  Sent: 'bg-blue-50 text-blue-700 border-blue-200',
  Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  VIP: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Tentative: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Field': 'bg-blue-50 text-blue-700 border-blue-200',
  Warehouse: 'bg-slate-50 text-slate-700 border-slate-200',
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Not Synced': 'bg-slate-50 text-slate-700 border-slate-200',
  Synced: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function StatusBadge({ children }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[children] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
      {children}
    </span>
  )
}
