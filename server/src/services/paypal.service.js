// server/src/services/paypal.service.js
import axios from 'axios'

function getPayPalBaseUrl() {
  const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox'

  return environment === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

export function getPayPalPublicConfig() {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    planId: process.env.PAYPAL_PLAN_ID || '',
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
    amount: 150,
    currency: 'USD',
  }
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId) {
    throw new Error('Missing PAYPAL_CLIENT_ID in server environment variables.')
  }

  if (!clientSecret) {
    throw new Error('Missing PAYPAL_CLIENT_SECRET in server environment variables.')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await axios.post(
    `${getPayPalBaseUrl()}/v1/oauth2/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
    }).toString(),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  return response.data.access_token
}

export async function getPayPalSubscription(subscriptionId) {
  if (!subscriptionId) {
    throw new Error('Missing PayPal subscription ID.')
  }

  const accessToken = await getPayPalAccessToken()

  const response = await axios.get(
    `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}

export async function cancelPayPalSubscription(subscriptionId, reason = 'Cancelled by user') {
  if (!subscriptionId) {
    throw new Error('Missing PayPal subscription ID.')
  }

  const accessToken = await getPayPalAccessToken()

  await axios.post(
    `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      reason,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return {
    success: true,
  }
}

export async function createPayPalSubscription() {
  const planId = process.env.PAYPAL_PLAN_ID

  if (!planId) {
    throw new Error('Missing PAYPAL_PLAN_ID in server environment variables.')
  }

  const accessToken = await getPayPalAccessToken()
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

  const response = await axios.post(
    `${getPayPalBaseUrl()}/v1/billing/subscriptions`,
    {
      plan_id: planId,
      application_context: {
        brand_name: 'Fieldora Pro',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${clientUrl}/subscription?paypal=success`,
        cancel_url: `${clientUrl}/subscription?paypal=cancelled`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const approvalLink = response.data.links?.find((link) => link.rel === 'approve')?.href

  return {
    subscriptionId: response.data.id,
    status: response.data.status,
    approvalLink,
    raw: response.data,
  }
}