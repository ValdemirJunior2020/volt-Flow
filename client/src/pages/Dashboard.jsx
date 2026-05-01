// client/src/pages/Dashboard.jsx
import React from 'react'
import TotalRevenue from '../components/TotalRevenue'
import PendingInvoicesCard from '../components/PendingInvoicesCard'
import JobsScheduledToday from '../components/JobsScheduledToday'
import ActiveEmployees from '../components/ActiveEmployees'
import ScheduledJobsTable from '../components/ScheduledJobsTable'
import JobStatusTracker from '../components/JobStatusTracker'
import PayrollSummary from '../components/PayrollSummary'
import PendingInvoicesTable from '../components/PendingInvoicesTable'
import MonthlyRevenue from '../components/MonthlyRevenue'
import ExpenseBreakdown from '../components/ExpenseBreakdown'
import QuickActionsPanel from '../components/QuickActionsPanel'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <button className="flex items-center justify-center gap-2 bg-[#0f1c2e] hover:bg-[#1a2a3f] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
          <span>Quick action</span>
          <div className="bg-white/20 rounded-md p-0.5">
            <Plus size={12} />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <TotalRevenue />
        <PendingInvoicesCard />
        <JobsScheduledToday />
        <ActiveEmployees />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <ScheduledJobsTable />
        <JobStatusTracker />
        <PayrollSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <PendingInvoicesTable />
        <MonthlyRevenue />
        <ExpenseBreakdown />
        <QuickActionsPanel />
      </div>
    </div>
  )
}
