import React from 'react'
import { Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { month: 'Jan', revenue: 22000, target: 18000 },
  { month: 'Feb', revenue: 28000, target: 22000 },
  { month: 'Mar', revenue: 25000, target: 26000 },
  { month: 'Apr', revenue: 40000, target: 32000 },
  { month: 'May', revenue: 35000, target: 38000 },
]

export default function MonthlyRevenue() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-800">Monthly Revenue</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>
      <div className="h-36 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rev1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5d000" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f5d000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v) => [`$${v.toLocaleString()}`]} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#rev1)" dot={false} />
            <Area type="monotone" dataKey="target" stroke="#f5d000" strokeWidth={2} fill="url(#rev2)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
