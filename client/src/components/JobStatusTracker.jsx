import React from 'react'
import { Zap } from 'lucide-react'

const stages = [
  { label: 'Estimate Sent', count: 6, color: 'bg-slate-200', text: 'text-slate-600' },
  { label: 'Job Scheduled', count: 12, color: 'bg-blue-700', text: 'text-white', active: true },
  { label: 'In Progress', count: 8, color: 'bg-[#f5d000]', text: 'text-slate-900', active: true },
  { label: 'Invoicing', count: 5, color: 'bg-slate-200', text: 'text-slate-600' },
]

export default function JobStatusTracker() {
  const total = stages.reduce((s, x) => s + x.count, 0)

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-800">Job Status Tracker</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>

      {/* Labels row */}
      <div className="flex gap-2 mb-2">
        {stages.map((s) => (
          <div key={s.label} className="flex-1 text-center">
            <p className="text-[9px] text-slate-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Count + bar row */}
      <div className="flex gap-2 mb-1">
        {stages.map((s) => (
          <div key={s.label} className="flex-1 text-center">
            <p className={`text-2xl font-bold ${s.active ? 'text-slate-900' : 'text-slate-400'}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Horizontal bars */}
      <div className="flex gap-1.5 mt-2">
        {stages.map((s) => (
          <div
            key={s.label}
            className={`${s.color} rounded transition-all`}
            style={{ flex: s.count, height: '48px', opacity: s.active ? 1 : 0.5 }}
          />
        ))}
      </div>
    </div>
  )
}
