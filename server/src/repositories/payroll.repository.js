// server/src/repositories/payroll.repository.js
import { supabase, DEFAULT_COMPANY_ID } from '../config/supabase.js'

function mapPayrollBatchFromDb(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    period: row.period,
    status: row.status,
    grossPay: Number(row.gross_pay || 0),
    estimatedTaxes: Number(row.estimated_taxes || 0),
    netPay: Number(row.net_pay || 0),
    employees: row.employees || [],
    approvedAt: row.approved_at,
    syncedAt: row.synced_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function savePayrollBatch(payrollRun, companyId = DEFAULT_COMPANY_ID) {
  const payload = {
    id: payrollRun.payrollRunId || payrollRun.id,
    company_id: companyId,
    period: payrollRun.period || 'Current Pay Period',
    status: payrollRun.status || 'Approved',
    gross_pay: Number(payrollRun.grossPay || 0),
    estimated_taxes: Number(payrollRun.estimatedTaxes || 0),
    net_pay: Number(payrollRun.netPay || 0),
    employees: payrollRun.employees || [],
    approved_at: payrollRun.approvedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('payroll_batches')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapPayrollBatchFromDb(data)
}

export async function getPayrollBatches(companyId = DEFAULT_COMPANY_ID) {
  const { data, error } = await supabase
    .from('payroll_batches')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map(mapPayrollBatchFromDb)
}

export const payrollRepository = {
  savePayrollBatch,
  getPayrollBatches,
}

export default payrollRepository