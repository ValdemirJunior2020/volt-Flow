// client/src/pages/JobsPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import { Briefcase, Clock3, DollarSign, MapPin } from 'lucide-react'
import { jobs } from '../data/mockBusinessData'

export default function JobsPage() {
  const total = jobs.reduce((sum, job) => sum + job.amount, 0)
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Operations" title="Jobs" description="Create, dispatch, track, and invoice every electrical service job from one place." primaryLabel="Create Job" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Briefcase} label="Open jobs" value={jobs.length} sub="Across residential and commercial" />
        <KpiCard icon={Clock3} label="In progress" value={jobs.filter((j) => j.status === 'In Progress').length} sub="Technicians currently working" />
        <KpiCard icon={DollarSign} label="Pipeline value" value={`$${total.toLocaleString()}`} sub="Scheduled and quoted revenue" />
        <KpiCard icon={MapPin} label="Urgent calls" value={jobs.filter((j) => j.priority === 'Urgent').length} sub="Need same-day attention" />
      </div>

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Active Job Board</h2>
          <p className="text-xs text-slate-500">Drag-and-drop workflow ready for future Kanban upgrade.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr><th className="px-5 py-3 text-left">Job</th><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Technician</th><th className="px-5 py-3 text-left">Date</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-4"><p className="font-black text-slate-900">{job.id}</p><p className="text-xs text-slate-500">{job.type}</p><p className="mt-1 text-[11px] text-slate-400">{job.address}</p></td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{job.customer}</td>
                  <td className="px-5 py-4 text-slate-600">{job.technician}</td>
                  <td className="px-5 py-4 text-slate-500">{job.date}</td>
                  <td className="px-5 py-4"><StatusBadge>{job.status}</StatusBadge></td>
                  <td className="px-5 py-4 text-right font-black text-slate-900">${job.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
