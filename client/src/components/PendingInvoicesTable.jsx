import React from 'react'
import { Zap } from 'lucide-react'

const invoices = [
  { id: 'A32001', customer: 'ABC Corp', amount: '$3,200', due: 'Oct 30', status: 'Due Soon' },
  { id: 'A32002', customer: 'ABC Corp', amount: '$3,200', due: 'Oct 30', status: 'Due Soon' },
  { id: 'A32003', customer: 'ABC Corp', amount: '$3,200', due: 'Oct 30', status: 'Due Soon' },
  { id: 'A32004', customer: 'ABC Corp', amount: '$3,200', due: 'Oct 30', status: 'Due Soon' },
  { id: 'A32005', customer: 'ABC Corp', amount: '$3,200', due: 'Oct 31', status: 'Overdue' },
]

const statusStyle = {
  'Due Soon': 'bg-amber-100 text-amber-600',
  'Overdue': 'bg-red-100 text-red-600',
  'Paid': 'bg-emerald-100 text-emerald-600',
}

export default function PendingInvoicesTable() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800">Pending Invoices (8)</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {['Invoice #', 'Customer', 'Amount', 'Due', 'Status'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-slate-400 pb-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-slate-50 last:border-0">
              <td className="py-1.5 text-[11px] text-slate-600 font-medium">{inv.id}</td>
              <td className="py-1.5 text-[11px] text-slate-600">{inv.customer}</td>
              <td className="py-1.5 text-[11px] text-slate-700 font-semibold">{inv.amount}</td>
              <td className="py-1.5 text-[11px] text-slate-600">{inv.due}</td>
              <td className="py-1.5">
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${statusStyle[inv.status]}`}>{inv.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
