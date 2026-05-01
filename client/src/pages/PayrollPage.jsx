// client/src/pages/PayrollPage.jsx
import React, { useMemo, useState } from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  PlayCircle,
  ReceiptText,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { quickbooksService } from '../services/quickbooksService'

const demoEmployees = [
  {
    id: 'EMP-1001',
    name: 'Mike Rodriguez',
    role: 'Master Electrician',
    hours: 42,
    hourlyRate: 38,
    overtimeHours: 2,
    status: 'Ready',
  },
  {
    id: 'EMP-1002',
    name: 'Carlos Mendes',
    role: 'Electrician Helper',
    hours: 40,
    hourlyRate: 24,
    overtimeHours: 0,
    status: 'Ready',
  },
  {
    id: 'EMP-1003',
    name: 'Ana Silva',
    role: 'Dispatcher',
    hours: 40,
    hourlyRate: 22,
    overtimeHours: 0,
    status: 'Ready',
  },
  {
    id: 'EMP-1004',
    name: 'James Carter',
    role: 'Service Technician',
    hours: 45,
    hourlyRate: 31,
    overtimeHours: 5,
    status: 'Needs Review',
  },
]

function calculateEmployeePayroll(employee) {
  const regularHours = Math.max(employee.hours - employee.overtimeHours, 0)
  const regularPay = regularHours * employee.hourlyRate
  const overtimePay = employee.overtimeHours * employee.hourlyRate * 1.5
  const grossPay = regularPay + overtimePay

  const federalTax = grossPay * 0.12
  const socialSecurity = grossPay * 0.062
  const medicare = grossPay * 0.0145
  const estimatedDeductions = federalTax + socialSecurity + medicare
  const netPay = grossPay - estimatedDeductions

  return {
    regularHours,
    regularPay,
    overtimePay,
    grossPay,
    federalTax,
    socialSecurity,
    medicare,
    estimatedDeductions,
    netPay,
  }
}

export default function PayrollPage() {
  const [employees] = useState(demoEmployees)
  const [payrollRun, setPayrollRun] = useState(null)
  const [runningPayroll, setRunningPayroll] = useState(false)
  const [syncingQuickBooks, setSyncingQuickBooks] = useState(false)
  const [message, setMessage] = useState('')

  const payrollSummary = useMemo(() => {
    const rows = employees.map((employee) => ({
      ...employee,
      payroll: calculateEmployeePayroll(employee),
    }))

    const grossPay = rows.reduce((sum, row) => sum + row.payroll.grossPay, 0)
    const taxes = rows.reduce((sum, row) => sum + row.payroll.estimatedDeductions, 0)
    const netPay = rows.reduce((sum, row) => sum + row.payroll.netPay, 0)
    const reviewCount = rows.filter((row) => row.status !== 'Ready').length

    return {
      rows,
      grossPay,
      taxes,
      netPay,
      reviewCount,
      employeeCount: rows.length,
    }
  }, [employees])

  function handleRunPayroll() {
    setRunningPayroll(true)
    setMessage('Preparing payroll batch...')

    setTimeout(() => {
      const newPayrollRun = {
        id: `PAY-${Date.now()}`,
        period: 'Oct 28 - This Friday',
        status: payrollSummary.reviewCount > 0 ? 'Needs Review' : 'Ready to Sync',
        createdAt: new Date().toLocaleString(),
        employees: payrollSummary.rows,
        grossPay: payrollSummary.grossPay,
        estimatedTaxes: payrollSummary.taxes,
        netPay: payrollSummary.netPay,
      }

      setPayrollRun(newPayrollRun)
      setRunningPayroll(false)

      if (payrollSummary.reviewCount > 0) {
        setMessage(
          'Payroll batch created, but one employee needs review before final approval.'
        )
      } else {
        setMessage('Payroll batch created and ready to sync to QuickBooks.')
      }
    }, 900)
  }

  async function handleSyncPayrollToQuickBooks() {
    if (!payrollRun) {
      setMessage('Run payroll first before syncing to QuickBooks.')
      return
    }

    try {
      setSyncingQuickBooks(true)
      setMessage('Sending payroll accounting summary to QuickBooks...')

      const payload = {
        payrollRunId: payrollRun.id,
        period: payrollRun.period,
        grossPay: payrollRun.grossPay,
        estimatedTaxes: payrollRun.estimatedTaxes,
        netPay: payrollRun.netPay,
        employees: payrollRun.employees.map((employee) => ({
          id: employee.id,
          name: employee.name,
          role: employee.role,
          hours: employee.hours,
          overtimeHours: employee.overtimeHours,
          hourlyRate: employee.hourlyRate,
          grossPay: employee.payroll.grossPay,
          estimatedDeductions: employee.payroll.estimatedDeductions,
          netPay: employee.payroll.netPay,
        })),
      }

      await quickbooksService.syncPayroll(payload)

      setPayrollRun((currentRun) => ({
        ...currentRun,
        status: 'Synced to QuickBooks',
        syncedAt: new Date().toLocaleString(),
      }))

      setMessage(
        'Payroll summary synced to QuickBooks. Actual paycheck processing and tax filing must be completed in QuickBooks Payroll or an approved payroll provider.'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'QuickBooks payroll sync failed. Make sure the backend is running and QuickBooks is connected.'
      )
    } finally {
      setSyncingQuickBooks(false)
    }
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Payroll"
        title="Employee Payroll"
        description="Prepare payroll batches, calculate estimated payroll totals, and sync the accounting summary to QuickBooks."
        primaryLabel="Add Employee"
        secondaryLabel="Export Payroll"
      />

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 text-amber-700" size={20} />
          <div>
            <h3 className="font-black text-amber-900">Payroll API Limitation</h3>
            <p className="mt-1 text-sm font-semibold text-amber-800">
              This page prepares payroll and syncs payroll accounting totals to QuickBooks.
              It does not legally file taxes or issue paychecks unless your app has approved
              QuickBooks Payroll API access or you connect a payroll provider.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          label="Employees"
          value={payrollSummary.employeeCount}
          sub="Included this payroll"
        />
        <KpiCard
          icon={DollarSign}
          label="Gross Payroll"
          value={`$${payrollSummary.grossPay.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          sub="Before deductions"
        />
        <KpiCard
          icon={ReceiptText}
          label="Estimated Taxes"
          value={`$${payrollSummary.taxes.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          sub="Estimate only"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Net Pay"
          value={`$${payrollSummary.netPay.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          sub="Estimated take-home"
        />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('failed') ||
            message.toLowerCase().includes('review')
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-black text-slate-900">Employee Payroll Summary</h2>
            <p className="mt-1 text-xs text-slate-500">Next Payroll</p>
            <p className="text-xs text-slate-500">Oct 28 - This Friday</p>
            <p className="mt-3 text-xs text-slate-500">Total</p>
            <p className="text-2xl font-black text-[#0f1c2e]">
              $
              {payrollSummary.grossPay.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {payrollSummary.employeeCount} Employees
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleRunPayroll}
              disabled={runningPayroll}
              className="rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {runningPayroll ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <PlayCircle size={16} />
              )}
              {runningPayroll ? 'Preparing Payroll...' : 'Run Payroll'}
            </button>

            <button
              type="button"
              onClick={handleSyncPayrollToQuickBooks}
              disabled={!payrollRun || syncingQuickBooks}
              className="rounded-xl bg-[#f5d000] px-5 py-3 text-sm font-black text-[#0f1c2e] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {syncingQuickBooks ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShieldCheck size={16} />
              )}
              {syncingQuickBooks ? 'Syncing...' : 'Sync Payroll to QuickBooks'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Employee</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-right">Hours</th>
                <th className="px-5 py-3 text-right">OT</th>
                <th className="px-5 py-3 text-right">Rate</th>
                <th className="px-5 py-3 text-right">Gross</th>
                <th className="px-5 py-3 text-right">Taxes</th>
                <th className="px-5 py-3 text-right">Net</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {payrollSummary.rows.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-black text-slate-900">{employee.name}</p>
                    <p className="text-xs text-slate-500">{employee.id}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">
                    {employee.role}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {employee.hours}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {employee.overtimeHours}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    ${employee.hourlyRate}
                  </td>
                  <td className="px-5 py-4 text-right font-black text-slate-900">
                    $
                    {employee.payroll.grossPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    $
                    {employee.payroll.estimatedDeductions.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-5 py-4 text-right font-black text-green-700">
                    $
                    {employee.payroll.netPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge>{employee.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {payrollRun && (
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Payroll Batch</p>
              <h2 className="text-xl font-black text-slate-900">{payrollRun.id}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Created: {payrollRun.createdAt}
              </p>
              {payrollRun.syncedAt && (
                <p className="text-sm text-green-700 font-semibold">
                  Synced: {payrollRun.syncedAt}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500" />
              <StatusBadge>{payrollRun.status}</StatusBadge>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Gross Pay</p>
              <p className="mt-1 text-xl font-black text-slate-900">
                $
                {payrollRun.grossPay.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Estimated Taxes/Deductions
              </p>
              <p className="mt-1 text-xl font-black text-slate-900">
                $
                {payrollRun.estimatedTaxes.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Net Pay</p>
              <p className="mt-1 text-xl font-black text-green-700">
                $
                {payrollRun.netPay.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}