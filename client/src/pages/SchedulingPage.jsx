// client/src/pages/SchedulingPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import { CalendarDays, Clock, Route, Users } from 'lucide-react'
import { scheduleEvents, employees } from '../data/mockBusinessData'

export default function SchedulingPage() {
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Dispatch" title="Scheduling" description="Assign technicians, manage routes, and keep the daily electrical schedule organized." primaryLabel="Schedule Job" secondaryLabel="Print Schedule" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={CalendarDays} label="Today's appointments" value={scheduleEvents.length} sub="Jobs and internal tasks" />
        <KpiCard icon={Users} label="Technicians assigned" value={employees.length} sub="Crew coverage today" />
        <KpiCard icon={Clock} label="Open slots" value="3" sub="Available for emergency calls" />
        <KpiCard icon={Route} label="Route efficiency" value="91%" sub="Optimized dispatch plan" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900">Daily Timeline</h2>
          <div className="mt-5 space-y-4">
            {scheduleEvents.map((event) => (
              <div key={event.time} className="flex gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50">
                <div className="w-24 shrink-0 text-sm font-black text-slate-900">{event.time}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="font-bold text-slate-800">{event.title}</p>
                    <StatusBadge>{event.status}</StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Assigned to {event.technician}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-2xl bg-[#0f1c2e] text-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#f5d000]">Dispatch Notes</p>
          <h3 className="mt-2 text-xl font-black">Emergency-ready schedule</h3>
          <p className="mt-2 text-sm text-slate-300">Leave at least one technician available for urgent troubleshooting and failed inspections.</p>
          <div className="mt-5 space-y-3">
            {employees.map((employee) => (
              <div key={employee.name} className="rounded-xl bg-white/10 p-3">
                <p className="font-bold">{employee.name}</p>
                <p className="text-xs text-slate-300">{employee.status} • {employee.jobs} jobs this week</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
