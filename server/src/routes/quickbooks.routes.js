// server/src/routes/quickbooks.routes.js
import express from 'express'
import {
  connectQuickBooks,
  quickBooksCallback,
  getQuickBooksStatus,
  disconnectQuickBooks,
  refreshQuickBooksToken,
  syncCustomers,
  syncInvoices,
  syncPayments,
  createInvoice,
} from '../controllers/quickbooks.controller.js'

const router = express.Router()

router.get('/connect', connectQuickBooks)
router.get('/callback', quickBooksCallback)
router.get('/status', getQuickBooksStatus)

router.post('/disconnect', disconnectQuickBooks)
router.post('/refresh-token', refreshQuickBooksToken)

router.post('/sync/customers', syncCustomers)
router.post('/sync/invoices', syncInvoices)
router.post('/sync/payments', syncPayments)

router.post('/invoices', createInvoice)

export default router