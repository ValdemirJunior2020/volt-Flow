// server/src/services/paypal.service.js
import axios from 'axios'

function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENVIRONMENT === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

export function getPayPalPublicConfig() {
  return {
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
    amount: 500,
    currency: 'USD',
    accessLength: '4 months',
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

export async function createOneTimePayPalOrder() {
  const accessToken = await getPayPalAccessToken()
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

  const response = await axios.post(
    `${getPayPalBaseUrl()}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: 'Fieldora Pro - 4 Months Full Access',
          amount: {
            currency_code: 'USD',
            value: '500.00',
          },
        },
      ],
      application_context: {
        brand_name: 'Fieldora Pro',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
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
    orderId: response.data.id,
    status: response.data.status,
    approvalLink,
    raw: response.data,
  }
}

export async function capturePayPalOrder(orderId) {
  if (!orderId) {
    throw new Error('Missing PayPal order ID.')
  }

  const accessToken = await getPayPalAccessToken()

  const response = await axios.post(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}