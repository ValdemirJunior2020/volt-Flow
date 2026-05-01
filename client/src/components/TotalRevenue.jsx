import React from 'react'
import { Zap, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { month: 'Jun', value: 28000 },
  { month: 'Jul', value: 35000 },
  { month: 'Aug', value: 30000 },
  { month: 'Sep', value: 38000 },
  { month: 'Nov', value: 42000 },
  { month: 'Oct', value: 54230 },
]

export default function TotalRevenue() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500">Total Revenue (Oct):</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5">$54,230</div>
      <div className="flex items-center gap-1 mb-2">
        <TrendingUp size={12} className="text-emerald-500" />
        <span className="text-xs text-emerald-500 font-medium">+12% vs last month</span>
      </div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
              formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
