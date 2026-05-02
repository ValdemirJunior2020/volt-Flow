// server/src/controllers/paypal.controller.js
import {
  capturePayPalOrder,
  createOneTimePayPalOrder,
  getPayPalPublicConfig,
} from '../services/paypal.service.js'
import { savePaidAccess } from '../repositories/subscription.repository.js'
import { addSyncLog } from '../repositories/syncLog.repository.js'

const DEFAULT_USER_ID = process.env.APP_DEFAULT_USER_ID || 'demo-user-001'
const DEFAULT_COMPANY_ID = process.env.APP_DEFAULT_COMPANY_ID || 'demo-company-001'

function extractPayerEmail(capture) {
  return (
    capture?.payer?.email_address ||
    capture?.payment_source?.paypal?.email_address ||
    null
  )
}

export async function getPayPalConfig(req, res, next) {
  try {
    return res.json({
      success: true,
      config: getPayPalPublicConfig(),
    })
  } catch (error) {
    next(error)
  }
}

export async function createCheckoutOrder(req, res, next) {
  try {
    const order = await createOneTimePayPalOrder()

    await addSyncLog({
      action: 'PAYPAL_ORDER_CREATED',
      status: 'SUCCESS',
      source: 'PayPal',
      message: 'PayPal $500 checkout order created for 4 months access.',
      localId: DEFAULT_USER_ID,
      qbId: order.orderId,
      metadata: order.raw,
    })

    return res.status(201).json({
      success: true,
      message: 'PayPal checkout order created.',
      order,
    })
  } catch (error) {
    next(error)
  }
}

export async function captureCheckoutOrder(req, res, next) {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing orderId.',
      })
    }

    const capture = await capturePayPalOrder(orderId)

    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: `PayPal payment not completed. Current status: ${capture.status}`,
        capture,
      })
    }

    const subscription = await savePaidAccess({
      userId: DEFAULT_USER_ID,
      companyId: DEFAULT_COMPANY_ID,
      orderId,
      payerEmail: extractPayerEmail(capture),
      raw: capture,
    })

    await addSyncLog({
      action: 'PAYPAL_PAYMENT_CAPTURED',
      status: 'SUCCESS',
      source: 'PayPal',
      message: '$500 payment captured. Full access unlocked for 4 months.',
      localId: DEFAULT_USER_ID,
      qbId: orderId,
      metadata: {
        capture,
        subscription,
      },
    })

    return res.json({
      success: true,
      message: 'Payment complete. Full access unlocked for 4 months.',
      subscription,
    })
  } catch (error) {
    next(error)
  }
}

export async function paypalWebhook(req, res, next) {
  try {
    const event = req.body

    await addSyncLog({
      action: 'PAYPAL_WEBHOOK_RECEIVED',
      status: 'SUCCESS',
      source: 'PayPal',
      message: `PayPal webhook received: ${event?.event_type || 'UNKNOWN_EVENT'}.`,
      localId: DEFAULT_USER_ID,
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