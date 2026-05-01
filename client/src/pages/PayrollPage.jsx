// client/src/pages/PayrollPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import { Banknote, CheckCircle2, Clock3, FileSpreadsheet } from 'lucide-react'
import { payrollRows } from '../data/mockBusinessData'

export default function PayrollPage() {
  const gross = payrollRows.reduce((sum, row) => sum + row.gross, 0)
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Finance" title="Payroll" description="Review technician hours, approve payroll, and prepare future QuickBooks Payroll or Gusto exports." primaryLabel="Run Payroll" secondaryLabel="Export Hours" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Banknote} label="Estimated gross" value={`$${gross.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Current pay period" />
        <KpiCard icon={Clock3} label="Total hours" value={payrollRows.reduce((sum, row) => sum + row.hours, 0)} sub="Pending approval" />
        <KpiCard icon={CheckCircle2} label="Approved" value={payrollRows.filter((row) => row.approved).length} sub="Ready for payroll" />
        <KpiCard icon={FileSpreadsheet} label="Export format" value="QBO" sub="Payroll mapping ready" />
      </div>
      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"><div className="p-5 border-b border-slate-100"><h2 className="font-bold text-slate-900">Payroll Approval Queue</h2><p className="text-xs text-slate-500">Validate hours before exporting to accounting.</p></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left">Employee</th><th className="px-5 py-3 text-left">Role</th><th className="px-5 py-3 text-right">Hours</th><th className="px-5 py-3 text-right">Rate</th><th className="px-5 py-3 text-right">Gross</th><th className="px-5 py-3 text-left">Approval</th></tr></thead><tbody>{payrollRows.map((row) => (<tr key={row.name} className="border-t border-slate-100"><td className="px-5 py-4 font-black text-slate-900">{row.name}</td><td className="px-5 py-4 text-slate-600">{row.role}</td><td className="px-5 py-4 text-right font-bold">{row.hours}</td><td className="px-5 py-4 text-right font-bold">${row.payRate}</td><td className="px-5 py-4 text-right font-black text-slate-900">${row.gross.toLocaleString()}</td><td className="px-5 py-4"><StatusBadge>{row.approved ? 'Paid' : 'Draft'}</StatusBadge></td></tr>))}</tbody></table></div></section>
    </div>
  )
}
