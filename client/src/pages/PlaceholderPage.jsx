// client/src/pages/PlaceholderPage.jsx
import React from 'react'

export default function PlaceholderPage({ title }) {
  return (
    <div className="p-5">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">VoltFlow Module</p>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">{title}</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          This page is ready for the next electrician workflow: jobs, scheduling, invoices, customers, employees,
          payroll, materials, and reporting. The dashboard design is preserved while the architecture is now ready
          for connected business operations.
        </p>
      </div>
    </div>
  )
}
