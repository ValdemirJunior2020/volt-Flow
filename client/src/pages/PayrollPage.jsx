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

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function escapeCsv(value) {
  const stringValue = String(value ?? '')
  return `"${stringValue.replaceAll('"', '""')}"`
}

export default function PayrollPage() {
  const [employees] = useState(demoEmployees)
  const [payrollRun, setPayrollRun] = useState(null)
  const [runningPayroll, setRunningPayroll] = useState(false)
  const [approvingPayroll, setApprovingPayroll] = useState(false)
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
    setMessage('Preparing payroll preview for manager review...')

    setTimeout(() => {
      const newPayrollRun = {
        id: `PAY-${Date.now()}`,
        period: 'Oct 28 - This Friday',
        status: payrollSummary.reviewCount > 0 ? 'Needs Review' : 'Ready for Approval',
        createdAt: new Date().toLocaleString(),
        employees: payrollSummary.rows,
        grossPay: payrollSummary.grossPay,
        estimatedTaxes: payrollSummary.taxes,
        netPay: payrollSummary.netPay,
      }

      setPayrollRun(newPayrollRun)
      setRunningPayroll(false)

      if (payrollSummary.reviewCount > 0) {
        setMessage('Payroll preview created. One employee needs review before final approval.')
      } else {
        setMessage('Payroll preview created and ready for manager approval.')
      }
    }, 700)
  }

  function handleApprovePayrollBatch() {
    if (!payrollRun) {
      setMessage('Run Payroll Preview first before approving the batch.')
      return
    }

    setApprovingPayroll(true)
    setMessage('Approving payroll batch...')

    setTimeout(() => {
      setPayrollRun((currentRun) => ({
        ...currentRun,
        status: 'Approved',
        approvedAt: new Date().toLocaleString(),
      }))

      setApprovingPayroll(false)
      setMessage(
        'Payroll batch approved. Managers can now export payroll or optionally sync the accounting summary to QuickBooks.'
      )
    }, 700)
  }

  async function handleSyncAccountingToQuickBooks() {
    if (!payrollRun) {
      setMessage('Run Payroll Preview first.')
      return
    }

    if (payrollRun.status !== 'Approved') {
      setMessage('Approve the payroll batch before syncing accounting data.')
      return
    }

    try {
      setSyncingQuickBooks(true)
      setMessage('Syncing approved payroll accounting summary to QuickBooks...')

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

      await quickbooksService.savePayrollSummary(payload)

      setPayrollRun((currentRun) => ({
        ...currentRun,
        status: 'Approved + Accounting Synced',
        syncedAt: new Date().toLocaleString(),
      }))

      setMessage(
        'Approved payroll accounting summary saved. This does not issue paychecks or file payroll taxes.'
      )
    } catch (error) {
      setMessage(error.message || 'QuickBooks accounting sync failed. Make sure the server is running.')
    } finally {
      setSyncingQuickBooks(false)
    }
  }

  function handleExportPayroll() {
    const rows = payrollRun?.employees || payrollSummary.rows
    const exportId = payrollRun?.id || `PAYROLL-PREVIEW-${Date.now()}`
    const period = payrollRun?.period || 'Current Pay Period'

    const headers = [
      'Payroll Run ID',
      'Pay Period',
      'Employee ID',
      'Employee Name',
      'Role',
      'Regular Hours',
      'Overtime Hours',
      'Hourly Rate',
      'Regular Pay',
      'Overtime Pay',
      'Gross Pay',
      'Federal Tax Estimate',
      'Social Security Estimate',
      'Medicare Estimate',
      'Total Estimated Deductions',
      'Estimated Net Pay',
      'Status',
    ]

    const csvRows = rows.map((employee) => [
      exportId,
      period,
      employee.id,
      employee.name,
      employee.role,
      employee.payroll.regularHours,
      employee.overtimeHours,
      employee.hourlyRate,
      employee.payroll.regularPay.toFixed(2),
      employee.payroll.overtimePay.toFixed(2),
      employee.payroll.grossPay.toFixed(2),
      employee.payroll.federalTax.toFixed(2),
      employee.payroll.socialSecurity.toFixed(2),
      employee.payroll.medicare.toFixed(2),
      employee.payroll.estimatedDeductions.toFixed(2),
      employee.payroll.netPay.toFixed(2),
      employee.status,
    ])

    const totalsRow = [
      exportId,
      period,
      '',
      'TOTAL',
      '',
      '',
      '',
      '',
      '',
      '',
      payrollSummary.grossPay.toFixed(2),
      '',
      '',
      '',
      payrollSummary.taxes.toFixed(2),
      payrollSummary.netPay.toFixed(2),
      payrollRun?.status || 'Preview',
    ]

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...csvRows.map((row) => row.map(escapeCsv).join(',')),
      totalsRow.map(escapeCsv).join(','),
    ].join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${exportId}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setMessage('Payroll CSV exported successfully.')
  }

  function handleAddEmployee() {
    setMessage('Add Employee form is not connected yet. Next step is to add the employee modal.')
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Payroll"
        title="Payroll Command Center"
        description="Prepare payroll previews, estimate deductions, review hours, approve batches, and export manager reports."
        primaryLabel="Add Employee"
        secondaryLabel="Export Payroll"
        onPrimaryClick={handleAddEmployee}
        onSecondaryClick={handleExportPayroll}
      />

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 text-amber-700" size={20} />
          <div>
            <h3 className="font-black text-amber-900">Payroll Compliance Notice</h3>
            <p className="mt-1 text-sm font-semibold text-amber-800">
              VoltFlow helps managers organize payroll, review hours, estimate deductions,
              approve batches, and export reports. Final paycheck processing and tax filing
              should be completed through a payroll provider or approved payroll integration.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Employees" value={payrollSummary.employeeCount} sub="Included this payroll" />
        <KpiCard icon={DollarSign} label="Gross Payroll" value={`$${formatMoney(payrollSummary.grossPay)}`} sub="Before deductions" />
        <KpiCard icon={ReceiptText} label="Estimated Taxes" value={`$${formatMoney(payrollSummary.taxes)}`} sub="Estimate only" />
        <KpiCard icon={CheckCircle2} label="Net Pay" value={`$${formatMoney(payrollSummary.netPay)}`} sub="Estimated take-home" />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('failed') ||
            message.toLowerCase().includes('review') ||
            message.toLowerCase().includes('first')
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
            <p className="text-2xl font-black text-[#0f1c2e]">${formatMoney(payrollSummary.grossPay)}</p>
            <p className="mt-1 text-xs text-slate-500">{payrollSummary.employeeCount} Employees</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleRunPayroll}
              disabled={runningPayroll}
              className="rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {runningPayroll ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
              {runningPayroll ? 'Preparing...' : 'Run Payroll Preview'}
            </button>

            <button
              type="button"
              onClick={handleApprovePayrollBatch}
              disabled={!payrollRun || approvingPayroll}
              className="rounded-xl bg-[#f5d000] px-5 py-3 text-sm font-black text-[#0f1c2e] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {approvingPayroll ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {approvingPayroll ? 'Approving...' : 'Approve Payroll Batch'}
            </button>

            <button
              type="button"
              onClick={handleSyncAccountingToQuickBooks}
              disabled={!payrollRun || payrollRun.status !== 'Approved' || syncingQuickBooks}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {syncingQuickBooks ? <Loader2 size={16} className="animate-spin" /> : <ReceiptText size={16} />}
              {syncingQuickBooks ? 'Syncing...' : 'Optional QuickBooks Sync'}
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
                  <td className="px-5 py-4 text-slate-600 font-semibold">{employee.role}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{employee.hours}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{employee.overtimeHours}</td>
                  <td className="px-5 py-4 text-right text-slate-600">${employee.hourlyRate}</td>
                  <td className="px-5 py-4 text-right font-black text-slate-900">
                    ${formatMoney(employee.payroll.grossPay)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    ${formatMoney(employee.payroll.estimatedDeductions)}
                  </td>
                  <td className="px-5 py-4 text-right font-black text-green-700">
                    ${formatMoney(employee.payroll.netPay)}
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
              <p className="mt-1 text-sm text-slate-500">Created: {payrollRun.createdAt}</p>

              {payrollRun.approvedAt && (
                <p className="text-sm text-green-700 font-semibold">
                  Approved: {payrollRun.approvedAt}
                </p>
              )}

              {payrollRun.syncedAt && (
                <p className="text-sm text-blue-700 font-semibold">
                  Accounting synced: {payrollRun.syncedAt}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500" />
              <StatusBadge>{payrollRun.status}</StatusBadge>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}