// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\controllers\paypalSubscription.controller.js
import { supabase } from '../config/supabase.js'
import {
  cancelPayPalSubscription,
  createMonthlyProductAndPlan,
  getPayPalSubscription,
} from '../services/paypalSubscription.service.js'

function getNextBillingDate(subscription) {
  const billingInfo = subscription.billing_info || {}
  return billingInfo.next_billing_time || null
}

export async function createFildemoraMonthlyPlan(req, res, next) {
  try {
    const result = await createMonthlyProductAndPlan()

    return res.status(201).json({
      success: true,
      message: 'PayPal $20 first-week trial + $70 monthly plan created. Save this plan ID in PAYPAL_PLAN_ID.',
      productId: result.product.id,
      planId: result.plan.id,
      plan: result.plan,
    })
  } catch (error) {
    next(error)
  }
}

export async function getSubscriptionConfig(req, res, next) {
  try {
    const planId = process.env.PAYPAL_PLAN_ID

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Missing PAYPAL_PLAN_ID in server .env',
      })
    }

    return res.json({
      success: true,
      planId,
      trialAmount: 20,
      amount: 70,
      currency: 'USD',
    })
  } catch (error) {
    next(error)
  }
}

export async function confirmPayPalSubscription(req, res, next) {
  try {
    const { subscriptionId } = req.body

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing subscriptionId.',
      })
    }

    const paypalSubscription = await getPayPalSubscription(subscriptionId)

    const status = paypalSubscription.status
    const planId = paypalSubscription.plan_id
    const nextBillingAt = getNextBillingDate(paypalSubscription)

    if (!['ACTIVE', 'APPROVAL_PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `PayPal subscription is not active. Current status: ${status}`,
      })
    }

    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: company, error } = await supabase
      .from('companies')
      .update({
        subscription_status: 'active',
        subscription_amount: 70,
        subscription_currency: 'USD',
        paypal_subscription_id: subscriptionId,
        paypal_plan_id: planId,
        subscription_started_at: new Date().toISOString(),
        subscription_trial_ends_at: trialEndsAt,
        subscription_next_billing_at: nextBillingAt,
        subscription_cancelled_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.companyId)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return res.json({
      success: true,
      message: 'Fildemora Pro subscription activated.',
      company,
      paypalSubscription: {
        id: paypalSubscription.id,
        status: paypalSubscription.status,
        planId: paypalSubscription.plan_id,
        nextBillingAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getMySubscription(req, res, next) {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select(
        'id, name, subscription_status, subscription_amount, subscription_currency, paypal_subscription_id, paypal_plan_id, subscription_started_at, subscription_trial_ends_at, subscription_next_billing_at, subscription_cancelled_at'
      )
      .eq('id', req.companyId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return res.json({
      success: true,
      subscription: {
        companyId: company.id,
        companyName: company.name,
        status: company.subscription_status,
        amount: company.subscription_amount,
        currency: company.subscription_currency,
        paypalSubscriptionId: company.paypal_subscription_id,
        paypalPlanId: company.paypal_plan_id,
        startedAt: company.subscription_started_at,
        trialEndsAt: company.subscription_trial_ends_at,
        nextBillingAt: company.subscription_next_billing_at,
        cancelledAt: company.subscription_cancelled_at,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function cancelSubscription(req, res, next) {
  try {
    const { data: company, error: findError } = await supabase
      .from('companies')
      .select('id, paypal_subscription_id')
      .eq('id', req.companyId)
      .single()

    if (findError) {
      throw new Error(findError.message)
    }

    if (!company?.paypal_subscription_id) {
      return res.status(400).json({
        success: false,
        message: 'No PayPal subscription found for this company.',
      })
    }

    await cancelPayPalSubscription(company.paypal_subscription_id)

    const cancelledAt = new Date().toISOString()

    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        subscription_status: 'cancelled',
        subscription_cancelled_at: cancelledAt,
        updated_at: cancelledAt,
      })
      .eq('id', req.companyId)
      .select('*')
      .single()

    if (updateError) {
      throw new Error(updateError.message)
    }

    return res.json({
      success: true,
      message: 'Subscription cancelled successfully.',
      company: updatedCompany,
    })
  } catch (error) {
    next(error)
  }
}
