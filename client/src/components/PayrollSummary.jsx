// client/src/components/PayrollSummary.jsx
import React, { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'

export default function PayrollSummary() {
  const [loading, setLoading] = useState(false)

  function goToPayrollPage() {
    setLoading(true)

    setTimeout(() => {
      window.history.pushState({}, '', '/payroll')
      window.dispatchEvent(new PopStateEvent('popstate'))
      setLoading(false)
    }, 300)
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800">Employee Payroll Summary</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>

      <div className="mb-1">
        <p className="text-[11px] text-slate-500 font-medium">Next Payroll</p>
        <p className="text-[11px] text-slate-600">Oct 28 - This Friday</p>
      </div>

      <div className="my-3">
        <p className="text-[11px] text-slate-500 font-medium mb-0.5">Total</p>
        <p className="text-2xl font-bold text-slate-900">$21,450</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-slate-600">14 Employees</span>
        <span className="bg-amber-100 text-amber-600 text-[9px] font-semibold px-2 py-0.5 rounded-full">
          Awaiting Approval
        </span>
      </div>

      <button
        type="button"
        onClick={goToPayrollPage}
        disabled={loading}
        className="w-full bg-[#0f1c2e] hover:bg-[#1a2a3f] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'Opening Payroll...' : 'Run Payroll'}
      </button>
    </div>
  )
}