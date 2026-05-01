// server/src/routes/payroll.routes.js
import express from 'express'
import { syncPayrollSummaryToQuickBooks } from '../controllers/payroll.controller.js'

const router = express.Router()

router.post('/sync-summary', syncPayrollSummaryToQuickBooks)

export default router