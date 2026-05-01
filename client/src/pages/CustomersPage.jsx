// client/src/pages/CustomersPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import { Building2, Home, Mail, WalletCards } from 'lucide-react'
import { customers } from '../data/mockBusinessData'

export default function CustomersPage() {
  const balance = customers.reduce((sum, customer) => sum + customer.balance, 0)
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="CRM" title="Customers" description="Manage residential and commercial customers, contact history, balances, and QuickBooks customer sync." primaryLabel="Add Customer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Building2} label="Commercial" value={customers.filter((c) => c.type === 'Commercial').length} sub="Business accounts" />
        <KpiCard icon={Home} label="Residential" value={customers.filter((c) => c.type === 'Residential').length} sub="Home service customers" />
        <KpiCard icon={WalletCards} label="Open balance" value={`$${balance.toLocaleString()}`} sub="Total receivables" />
        <KpiCard icon={Mail} label="VIP accounts" value={customers.filter((c) => c.status === 'VIP').length} sub="High-value relationships" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {customers.map((customer) => (
          <article key={customer.email} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-900">{customer.name}</h3><p className="text-xs text-slate-500">{customer.type}</p></div><StatusBadge>{customer.status}</StatusBadge></div>
            <div className="mt-4 space-y-2 text-sm text-slate-600"><p>{customer.phone}</p><p className="truncate">{customer.email}</p><p>Last job: <span className="font-semibold text-slate-800">{customer.lastJob}</span></p></div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Current balance</p><p className="font-black text-slate-900">${customer.balance.toLocaleString()}</p></div>
          </article>
        ))}
      </div>
    </div>
  )
}
