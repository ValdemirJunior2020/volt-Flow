import React from 'react'

const actions = ['Create Invoice', 'Add Job', 'New Estimate', 'Add Employee']

const inventory = [
  { label: 'Stock levels', pct: 100, color: 'bg-blue-500' },
  { label: 'Stock levels', pct: 15.6, color: 'bg-amber-400' },
]

export default function QuickActionsPanel() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-4">
      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((a) => (
            <button
              key={a}
              className="text-[11px] font-medium text-slate-700 border border-slate-200 rounded-lg py-2 px-2 hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Material Inventory */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Material Inventory</h3>
        <div className="space-y-2">
          {inventory.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-slate-500">{item.label}</span>
                <span className="text-[10px] text-slate-600 font-medium">{item.pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`${item.color} h-1.5 rounded-full transition-all`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
