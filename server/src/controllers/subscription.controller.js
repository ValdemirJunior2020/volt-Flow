// server/src/controllers/subscription.controller.js
import {
  cancelLocalSubscription,
  getSubscriptionStatus,
  saveSubscription,
} from '../repositories/subscription.repository.js'
import { cancelPayPalSubscription } from '../services/paypal.service.js'
import { addSyncLog } from '../repositories/syncLog.repository.js'

const DEFAULT_USER_ID = process.env.APP_DEFAULT_USER_ID || 'demo-user-001'

export async function getStatus(req, res, next) {
  try {
    const subscription = await getSubscriptionStatus(DEFAULT_USER_ID)

    return res.json({
      success: true,
      subscription,
    })
  } catch (error) {
    next(error)
  }
}

export async function cancelSubscription(req, res, next) {
  try {
    const current = await getSubscriptionStatus(DEFAULT_USER_ID)

    if (current.subscriptionId) {
      try {
        await cancelPayPalSubscription(
          current.subscriptionId,
          'Cancelled from Fieldora Pro dashboard'
        )
      } catch (error) {
        console.error('PayPal cancel failed, cancelling locally:', error.message)
      }
    }

    const cancelled = await cancelLocalSubscription(DEFAULT_USER_ID)

    await addSyncLog({
      action: 'SUBSCRIPTION_CANCELLED',
      status: 'SUCCESS',
      source: 'Fieldora Pro',
      message: 'Subscription cancelled.',
      localId: DEFAULT_USER_ID,
      qbId: current.subscriptionId,
      metadata: cancelled,
    })

    return res.json({
      success: true,
      message: 'Subscription cancelled.',
      subscription: cancelled,
    })
  } catch (error) {
    next(error)
  }
}

export async function activateDemoSubscription(req, res, next) {
  try {
    const subscription = await saveSubscription({
      userId: DEFAULT_USER_ID,
      status: 'ACTIVE',
      subscriptionId: 'DEMO-SUBSCRIPTION',
      planId: process.env.PAYPAL_PLAN_ID || 'DEMO-PLAN',
      payerEmail: 'demo@fieldorapro.com',
      nextBillingTime: null,
    })

    return res.json({
      success: true,
      message: 'Demo subscription activated.',
      subscription,
    })
  } catch (error) {
    next(error)
  }
}