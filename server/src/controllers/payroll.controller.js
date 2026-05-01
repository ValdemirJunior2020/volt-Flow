// server/src/controllers/payroll.controller.js
import crypto from 'crypto'
import { addSyncLog } from '../repositories/syncLog.repository.js'

export async function syncPayrollSummaryToQuickBooks(req, res, next) {
  const startedAt = Date.now()

  try {
    const payrollRun = req.body

    if (!payrollRun?.payrollRunId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payrollRunId.',
      })
    }

    if (!Array.isArray(payrollRun.employees) || payrollRun.employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payroll run must include at least one employee.',
      })
    }

    const grossPay = Number(payrollRun.grossPay || 0)
    const estimatedTaxes = Number(payrollRun.estimatedTaxes || 0)
    const netPay = Number(payrollRun.netPay || 0)

    const payrollSummary = {
      payrollRunId: payrollRun.payrollRunId,
      period: payrollRun.period || 'Current Pay Period',
      grossPay,
      estimatedTaxes,
      netPay,
      employees: payrollRun.employees,
      accountingAction:
        'Payroll summary prepared for manager review. This does not issue paychecks or legally file payroll taxes.',
    }

    const referenceId = `PAYROLL-SUMMARY-${crypto
      .randomBytes(5)
      .toString('hex')
      .toUpperCase()}`

    await addSyncLog({
      action: 'PAYROLL_SUMMARY_CREATED',
      status: 'SUCCESS',
      source: 'VoltFlow Payroll',
      message:
        'Payroll summary created for manager review. Actual paycheck processing and tax filing should be handled by QuickBooks Payroll, Gusto, ADP, or another approved payroll provider.',
      localId: payrollRun.payrollRunId,
      qbId: referenceId,
      duration: Date.now() - startedAt,
      metadata: payrollSummary,
    })

    return res.status(200).json({
      success: true,
      message:
        'Payroll summary saved successfully. Managers can review payroll totals, estimated taxes, deductions, and export reports.',
      referenceId,
      payrollRun: payrollSummary,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  syncPayrollSummaryToQuickBooks,
}