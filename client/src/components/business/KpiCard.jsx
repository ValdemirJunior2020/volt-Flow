// client/src/components/business/KpiCard.jsx
import React from 'react'

export default function KpiCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{sub}</p>
        </div>
        {Icon && <div className="rounded-xl bg-[#f5d000]/20 p-2 text-[#0f1c2e]"><Icon size={18} /></div>}
      </div>
    </div>
  )
}
