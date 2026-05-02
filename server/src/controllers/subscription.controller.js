// server/src/controllers/subscription.controller.js
import {
  activateDemoSubscription,
  cancelLocalSubscription,
  getSubscriptionStatus,
} from '../repositories/subscription.repository.js'
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
    const cancelled = await cancelLocalSubscription(DEFAULT_USER_ID)

    await addSyncLog({
      action: 'ACCESS_CANCELLED',
      status: 'SUCCESS',
      source: 'Fieldora Pro',
      message: 'Paid access cancelled locally.',
      localId: DEFAULT_USER_ID,
      metadata: cancelled,
    })

    return res.json({
      success: true,
      message: 'Access cancelled.',
      subscription: cancelled,
    })
  } catch (error) {
    next(error)
  }
}

export async function activateDemo(req, res, next) {
  try {
    const subscription = await activateDemoSubscription(DEFAULT_USER_ID)

    return res.json({
      success: true,
      message: 'Demo access activated for 4 months.',
      subscription,
    })
  } catch (error) {
    next(error)
  }
}