// server/src/routes/webhooks.routes.js
import express from 'express'
import { syncLogRepository } from '../repositories/syncLog.repository.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.post('/quickbooks', asyncHandler(async (req, res) => {
  await syncLogRepository.create({
    tenantId: req.tenantId,
    action: 'QBO_WEBHOOK_RECEIVED',
    status: 'success',
    message: 'QuickBooks webhook received. Signature verification should be enabled before production use.',
    metadata: req.body,
  })
  res.status(202).json({ success: true, message: 'Webhook accepted.' })
}))

export default router
