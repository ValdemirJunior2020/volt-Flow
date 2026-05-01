// server/src/routes/quickbooks.routes.js
import express from 'express'
import { z } from 'zod'
import { quickBooksController } from '../controllers/quickbooks.controller.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

const directionSchema = validate(z.object({
  body: z.object({ direction: z.enum(['from-qbo', 'to-qbo']).optional().default('from-qbo') }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
}))

const invoiceSchema = validate(z.object({
  body: z.object({
    customerName: z.string().min(1),
    customerEmail: z.string().email().optional(),
    quickBooksCustomerId: z.string().optional(),
    jobId: z.string().optional(),
    technician: z.string().optional(),
    serviceDate: z.string().optional(),
    taxRate: z.number().optional(),
    lines: z.array(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      quantity: z.number().positive().default(1),
      unitPrice: z.number().nonnegative(),
      type: z.enum(['labor', 'materials', 'service', 'other']).optional(),
    })).min(1),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
}))

router.get('/connect', quickBooksController.connect)
router.get('/callback', quickBooksController.callback)
router.get('/status', quickBooksController.status)
router.post('/disconnect', quickBooksController.disconnect)
router.post('/refresh-token', quickBooksController.refreshToken)
router.post('/test-connection', quickBooksController.testConnection)
router.get('/company-info', quickBooksController.companyInfo)
router.post('/sync/customers', directionSchema, quickBooksController.syncCustomers)
router.post('/sync/invoices', directionSchema, quickBooksController.syncInvoices)
router.post('/sync/payments', quickBooksController.syncPayments)
router.post('/invoices', invoiceSchema, quickBooksController.createInvoice)

export default router
