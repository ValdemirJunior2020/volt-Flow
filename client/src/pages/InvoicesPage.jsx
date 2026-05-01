// client/src/pages/InvoicesPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import { FileText, Send, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { invoices } from '../data/mockBusinessData'

export default function InvoicesPage() {
  const outstanding = invoices.filter((i) => i.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Accounting" title="Invoices" description="Build invoices from jobs, sync them to QuickBooks, and track collections." primaryLabel="New Invoice" secondaryLabel="Export PDF" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={FileText} label="Total invoices" value={invoices.length} sub="Current billing cycle" />
        <KpiCard icon={Send} label="Outstanding" value={`$${outstanding.toLocaleString()}`} sub="Needs collection" />
        <KpiCard icon={AlertTriangle} label="Overdue" value={invoices.filter((i) => i.status === 'Overdue').length} sub="Follow-up required" />
        <KpiCard icon={CheckCircle2} label="QuickBooks synced" value={invoices.filter((i) => i.qb === 'Synced').length} sub="Matched with QBO" />
      </div>
      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Invoice Center</h2><p className="text-xs text-slate-500">Create, send, sync, and reconcile invoices.</p></div><button className="rounded-xl bg-[#f5d000] px-4 py-2 text-sm font-black text-[#0f1c2e]">Sync with QuickBooks</button></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left">Invoice</th><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Job</th><th className="px-5 py-3 text-left">Due</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">QBO</th><th className="px-5 py-3 text-right">Amount</th></tr></thead><tbody>{invoices.map((invoice) => (<tr key={invoice.id} className="border-t border-slate-100"><td className="px-5 py-4 font-black text-slate-900">{invoice.id}</td><td className="px-5 py-4 text-slate-700 font-semibold">{invoice.customer}</td><td className="px-5 py-4 text-slate-500">{invoice.job}</td><td className="px-5 py-4 text-slate-500">{invoice.due}</td><td className="px-5 py-4"><StatusBadge>{invoice.status}</StatusBadge></td><td className="px-5 py-4"><StatusBadge>{invoice.qb}</StatusBadge></td><td className="px-5 py-4 text-right font-black text-slate-900">${invoice.amount.toLocaleString()}</td></tr>))}</tbody></table>
        </div>
      </section>
    </div>
  )
}
