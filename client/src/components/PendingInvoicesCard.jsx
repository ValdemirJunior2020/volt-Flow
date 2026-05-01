import React from 'react'
import { Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const data = [
  { week: '1', value: 3200 },
  { week: '2', value: 5800 },
  { week: '3', value: 4200 },
  { week: '4', value: 6100 },
  { week: '5', value: 7800 },
  { week: '6', value: 5200 },
  { week: '7', value: 8400 },
  { week: '8', value: 6600 },
]

export default function PendingInvoicesCard() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500">Pending Invoices</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5">$11,850</div>
      <span className="inline-block bg-amber-100 text-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2">8 Unpaid</span>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={10}>
            <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
              formatter={(v) => [`$${v.toLocaleString()}`, '']}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 6 ? '#1e3a5f' : '#f5d000'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
