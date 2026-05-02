// server/src/controllers/paypal.controller.js
import {
  createPayPalSubscription,
  getPayPalPublicConfig,
  getPayPalSubscription,
} from '../services/paypal.service.js'
import { saveSubscription } from '../repositories/subscription.repository.js'
import { addSyncLog } from '../repositories/syncLog.repository.js'

const DEFAULT_USER_ID = process.env.APP_DEFAULT_USER_ID || 'demo-user-001'
const DEFAULT_COMPANY_ID = process.env.APP_DEFAULT_COMPANY_ID || 'demo-company-001'

function extractPayerEmail(paypalSubscription) {
  return (
    paypalSubscription?.subscriber?.email_address ||
    paypalSubscription?.subscriber?.payer_id ||
    null
  )
}

function extractNextBillingTime(paypalSubscription) {
  return paypalSubscription?.billing_info?.next_billing_time || null
}

export async function getPayPalConfig(req, res, next) {
  try {
    const config = getPayPalPublicConfig()

    return res.json({
      success: true,
      config,
    })
  } catch (error) {
    next(error)
  }
}

export async function createSubscription(req, res, next) {
  try {
    const subscription = await createPayPalSubscription()

    await saveSubscription({
      userId: DEFAULT_USER_ID,
      companyId: DEFAULT_COMPANY_ID,
      subscriptionId: subscription.subscriptionId,
      planId: process.env.PAYPAL_PLAN_ID,
      status: subscription.status || 'APPROVAL_PENDING',
      raw: subscription.raw,
    })

    await addSyncLog({
      action: 'PAYPAL_SUBSCRIPTION_CREATED',
      status: 'SUCCESS',
      source: 'PayPal',
      message: 'PayPal subscription created and awaiting approval.',
      localId: DEFAULT_USER_ID,
      qbId: subscription.subscriptionId,
      metadata: subscription.raw,
    })

    return res.status(201).json({
      success: true,
      message: 'PayPal subscription created.',
      subscription,
    })
  } catch (error) {
    next(error)
  }
}

export async function confirmSubscription(req, res, next) {
  try {
    const { subscriptionId } = req.body

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing subscriptionId.',
      })
    }

    const paypalSubscription = await getPayPalSubscription(subscriptionId)

    const savedSubscription = await saveSubscription({
      userId: DEFAULT_USER_ID,
      companyId: DEFAULT_COMPANY_ID,
      subscriptionId,
      planId: process.env.PAYPAL_PLAN_ID,
      status: paypalSubscription.status || 'UNKNOWN',
      payerEmail: extractPayerEmail(paypalSubscription),
      nextBillingTime: extractNextBillingTime(paypalSubscription),
      raw: paypalSubscription,
    })

    await addSyncLog({
      action: 'PAYPAL_SUBSCRIPTION_CONFIRMED',
      status: 'SUCCESS',
      source: 'PayPal',
      message: `PayPal subscription confirmed with status ${savedSubscription.status}.`,
      localId: DEFAULT_USER_ID,
      qbId: subscriptionId,
      metadata: paypalSubscription,
    })

    return res.json({
      success: true,
      message: 'PayPal subscription confirmed.',
      subscription: savedSubscription,
    })
  } catch (error) {
    next(error)
  }
}

export async function paypalWebhook(req, res, next) {
  try {
    const event = req.body
    const eventType = event?.event_type
    const resource = event?.resource || {}
    const subscriptionId = resource?.id || resource?.billing_agreement_id || null

    let status = null

    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      status = 'ACTIVE'
    }

    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      status = 'CANCELLED'
    }

    if (eventType === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      status = 'SUSPENDED'
    }

    if (eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      status = 'EXPIRED'
    }

    if (status && subscriptionId) {
      await saveSubscription({
        userId: DEFAULT_USER_ID,
        companyId: DEFAULT_COMPANY_ID,
        subscriptionId,
        planId: process.env.PAYPAL_PLAN_ID,
        status,
        lastWebhookAt: new Date().toISOString(),
        raw: event,
      })
    }

    await addSyncLog({
      action: 'PAYPAL_WEBHOOK_RECEIVED',
      status: 'SUCCESS',
      source: 'PayPal',
      message: `PayPal webhook received: ${eventType || 'UNKNOWN_EVENT'}.`,
      localId: DEFAULT_USER_ID,
      qbId: subscriptionId,
      metadata: event,
    })

    return res.status(200).json({
      success: true,
      received: true,
    })
  } catch (error) {
    next(error)
  }
}