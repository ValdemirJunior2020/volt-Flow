// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\routes\webhooks.routes.js
import express from 'express'
import { supabase } from '../config/supabase.js'
import { syncLogRepository } from '../repositories/syncLog.repository.js'
import { verifyPayPalWebhookSignature } from '../services/paypalSubscription.service.js'
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

router.post('/paypal', asyncHandler(async (req, res) => {
  const verified = await verifyPayPalWebhookSignature({
    headers: req.headers,
    body: req.body,
  })

  if (!verified) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PayPal webhook signature.',
    })
  }

  const event = req.body
  const eventType = event.event_type
  const subscriptionId = event.resource?.id || event.resource?.billing_agreement_id

  if (subscriptionId && ['BILLING.SUBSCRIPTION.CANCELLED', 'BILLING.SUBSCRIPTION.EXPIRED', 'BILLING.SUBSCRIPTION.SUSPENDED'].includes(eventType)) {
    await supabase
      .from('companies')
      .update({
        subscription_status: eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ? 'suspended' : 'cancelled',
        subscription_cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('paypal_subscription_id', subscriptionId)
  }

  if (subscriptionId && ['BILLING.SUBSCRIPTION.ACTIVATED', 'BILLING.SUBSCRIPTION.RE-ACTIVATED'].includes(eventType)) {
    await supabase
      .from('companies')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('paypal_subscription_id', subscriptionId)
  }

  await syncLogRepository.create({
    tenantId: req.tenantId,
    action: 'PAYPAL_WEBHOOK_RECEIVED',
    status: 'success',
    message: `PayPal webhook accepted: ${eventType}`,
    metadata: event,
  })

  return res.status(202).json({ success: true, message: 'Webhook accepted.' })
}))

export default router
