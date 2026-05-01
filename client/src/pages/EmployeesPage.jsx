// client/src/pages/EmployeesPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import { UserCog, Clock3, Briefcase, ShieldCheck } from 'lucide-react'
import { employees } from '../data/mockBusinessData'

export default function EmployeesPage() {
  const hours = employees.reduce((sum, employee) => sum + employee.hours, 0)
  const jobs = employees.reduce((sum, employee) => sum + employee.jobs, 0)
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Team" title="Employees" description="Manage technicians, roles, field status, weekly hours, and future payroll integration." primaryLabel="Add Employee" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={UserCog} label="Active employees" value={employees.length} sub="Field and office users" />
        <KpiCard icon={Clock3} label="Weekly hours" value={hours} sub="Tracked for payroll" />
        <KpiCard icon={Briefcase} label="Jobs completed" value={jobs} sub="Current week" />
        <KpiCard icon={ShieldCheck} label="Certified techs" value="3" sub="Master/Journeyman ready" />
      </div>
      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100"><h2 className="font-bold text-slate-900">Employee Directory</h2><p className="text-xs text-slate-500">Permissions, dispatch roles, and payroll status will be managed here.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left">Employee</th><th className="px-5 py-3 text-left">Role</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-right">Jobs</th><th className="px-5 py-3 text-right">Hours</th><th className="px-5 py-3 text-right">Rate</th></tr></thead><tbody>{employees.map((employee, index) => (<tr key={employee.name} className="border-t border-slate-100"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={`https://i.pravatar.cc/36?img=${index + 11}`} className="h-9 w-9 rounded-full" alt={employee.name} /><span className="font-black text-slate-900">{employee.name}</span></div></td><td className="px-5 py-4 text-slate-600">{employee.role}</td><td className="px-5 py-4"><StatusBadge>{employee.status}</StatusBadge></td><td className="px-5 py-4 text-right font-bold">{employee.jobs}</td><td className="px-5 py-4 text-right font-bold">{employee.hours}</td><td className="px-5 py-4 text-right font-bold">${employee.payRate}/hr</td></tr>))}</tbody></table></div>
      </section>
    </div>
  )
}
