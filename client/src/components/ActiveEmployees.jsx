import React from 'react'
import { Zap } from 'lucide-react'

const employees = [
  { name: 'Sarah P.', role: 'Residential Install', hasStatus: true },
  { name: 'Sarah P.', role: 'Residential Install', hasStatus: true },
  { name: 'Sarah P.', role: 'Residential Install', amount: '$850.00' },
]

export default function ActiveEmployees() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500">Active Employees</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-3">14</div>

      <div className="space-y-2">
        {employees.map((emp, i) => (
          <div key={i} className="flex items-center gap-2">
            <img src={`https://i.pravatar.cc/24?img=${i + 5}`} className="w-7 h-7 rounded-full" alt={emp.name} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-700 truncate">{emp.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{emp.role}</p>
            </div>
            {emp.hasStatus && (
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-semibold px-2 py-0.5 rounded flex-shrink-0">Status</span>
            )}
            {emp.amount && (
              <span className="text-[11px] font-semibold text-slate-700 flex-shrink-0">{emp.amount}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
