// server/src/services/sync.service.js
import crypto from 'crypto'
import { quickBooksApiService } from './quickbooksApi.service.js'
import { quickBooksMapperService } from './quickbooksMapper.service.js'
import { localBusinessRepository } from '../repositories/localBusiness.repository.js'
import { syncLogRepository } from '../repositories/syncLog.repository.js'
import { tokenRepository } from '../repositories/token.repository.js'

function idempotencyKey(action, body) {
  return crypto.createHash('sha256').update(`${action}:${JSON.stringify(body)}`).digest('hex')
}

async function logTimed(tenantId, action, work) {
  const started = Date.now()
  try {
    const result = await work()
    await syncLogRepository.create({
      tenantId,
      action,
      status: 'success',
      message: result.message || `${action} completed.`,
      qbId: result.qbId,
      localId: result.localId,
      durationMs: Date.now() - started,
      metadata: result.metadata || {},
    })
    await tokenRepository.markSynced(tenantId)
    return result
  } catch (error) {
    await syncLogRepository.create({
      tenantId,
      action,
      status: 'error',
      message: error.message,
      durationMs: Date.now() - started,
      errorDetails: error.response?.data || error.stack,
    })
    throw error
  }
}

export const syncService = {
  async testConnection(tenantId) {
    return logTimed(tenantId, 'TEST_CONNECTION', async () => {
      const info = await quickBooksApiService.getCompanyInfo(tenantId)
      return { message: `Connected to ${info.CompanyName || info.LegalName || 'QuickBooks company'}.`, metadata: { company: info } }
    })
  },

  async syncCustomers(tenantId, direction = 'from-qbo') {
    return logTimed(tenantId, 'CUSTOMER_SYNC', async () => {
      if (direction === 'to-qbo') {
        const customers = await localBusinessRepository.listCustomers()
        const created = []
        for (const customer of customers) {
          const payload = quickBooksMapperService.customerToQbo(customer)
          const response = await quickBooksApiService.createCustomer(tenantId, payload)
          created.push(response.Customer)
        }
        return { message: `Pushed ${created.length} local customers to QuickBooks.`, metadata: { count: created.length } }
      }

      const response = await quickBooksApiService.query(tenantId, "select * from Customer maxresults 50")
      const customers = response.QueryResponse?.Customer || []
      return { message: `Pulled ${customers.length} customers from QuickBooks.`, metadata: { count: customers.length, customers } }
    })
  },

  async syncInvoices(tenantId, direction = 'from-qbo') {
    return logTimed(tenantId, 'INVOICE_SYNC', async () => {
      const response = await quickBooksApiService.query(tenantId, "select * from Invoice maxresults 50")
      const invoices = response.QueryResponse?.Invoice || []
      return { message: `${direction === 'from-qbo' ? 'Pulled' : 'Checked'} ${invoices.length} invoices from QuickBooks.`, metadata: { count: invoices.length, invoices } }
    })
  },

  async syncPayments(tenantId) {
    return logTimed(tenantId, 'PAYMENT_SYNC', async () => {
      const response = await quickBooksApiService.query(tenantId, "select * from Payment maxresults 50")
      const payments = response.QueryResponse?.Payment || []
      const candidates = payments.map(quickBooksMapperService.paymentToReconciliationCandidate)
      return { message: `Pulled ${payments.length} payments and prepared reconciliation candidates.`, metadata: { count: payments.length, candidates } }
    })
  },

  async createInvoice(tenantId, invoice) {
    return logTimed(tenantId, 'CREATE_INVOICE', async () => {
      const payload = quickBooksMapperService.invoiceToQbo(invoice)
      const response = await quickBooksApiService.createInvoice(tenantId, payload)
      return {
        message: `Created QuickBooks invoice ${response.Invoice?.DocNumber || response.Invoice?.Id}.`,
        qbId: response.Invoice?.Id,
        localId: invoice.jobId,
        metadata: { idempotencyKey: idempotencyKey('CREATE_INVOICE', invoice), invoice: response.Invoice },
      }
    })
  },
}
