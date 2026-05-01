// client/src/components/business/PageHeader.jsx
import React from 'react'
import { Plus, Download, Search } from 'lucide-react'

export default function PageHeader({ eyebrow, title, description, primaryLabel = 'Add New', secondaryLabel = 'Export' }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{eyebrow}</p>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search size={15} className="text-slate-400" />
          <input className="w-full min-w-44 bg-transparent text-sm outline-none" placeholder="Search..." />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
          <Download size={15} /> {secondaryLabel}
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f1c2e] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#1a2a3f]">
          <Plus size={15} /> {primaryLabel}
        </button>
      </div>
    </div>
  )
}
