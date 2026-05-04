// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\services\paypalSubscription.service.js
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox'

const PAYPAL_BASE_URL =
  PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

function getPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId) {
    throw new Error('Missing PAYPAL_CLIENT_ID in server .env')
  }

  if (!clientSecret || clientSecret.includes('PASTE_YOUR_CURRENT_PAYPAL')) {
    throw new Error('Missing real PAYPAL_CLIENT_SECRET in server .env')
  }

  return {
    clientId,
    clientSecret,
  }
}

export function getPayPalBaseUrl() {
  return PAYPAL_BASE_URL
}

export async function getPayPalAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials()

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error_description || data.message || 'Unable to get PayPal access token')
  }

  return data.access_token
}

export async function createMonthlyProductAndPlan() {
  const accessToken = await getPayPalAccessToken()

  const productResponse = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name: 'Fildemora Pro',
      description: 'Monthly access to Fildemora Pro business management software.',
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  })

  const product = await productResponse.json()

  if (!productResponse.ok) {
    throw new Error(product.message || 'Unable to create PayPal product')
  }

  const planResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      product_id: product.id,
      name: 'Fildemora Pro Weekly Trial + Monthly Pro',
      description: '$20 for the first week, then $70 monthly subscription for Fildemora Pro.',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'WEEK',
            interval_count: 1,
          },
          tenure_type: 'TRIAL',
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: {
              value: '20.00',
              currency_code: 'USD',
            },
          },
        },
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: '70.00',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  })

  const plan = await planResponse.json()

  if (!planResponse.ok) {
    throw new Error(plan.message || 'Unable to create PayPal plan')
  }

  return {
    product,
    plan,
  }
}

export async function getPayPalSubscription(subscriptionId) {
  if (!subscriptionId) {
    throw new Error('Missing PayPal subscription ID')
  }

  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Unable to verify PayPal subscription')
  }

  return data
}

export async function cancelPayPalSubscription(subscriptionId, reason = 'Customer requested cancellation.') {
  if (!subscriptionId) {
    throw new Error('Missing PayPal subscription ID')
  }

  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Unable to cancel PayPal subscription')
  }

  return true
}

export async function verifyPayPalWebhookSignature({ headers, body }) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID

  if (!webhookId) {
    throw new Error('Missing PAYPAL_WEBHOOK_ID in server .env')
  }

  const transmissionId = headers['paypal-transmission-id']
  const transmissionTime = headers['paypal-transmission-time']
  const transmissionSig = headers['paypal-transmission-sig']
  const certUrl = headers['paypal-cert-url']
  const authAlgo = headers['paypal-auth-algo']

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    return false
  }

  const accessToken = await getPayPalAccessToken()
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: body,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return false
  }

  return data.verification_status === 'SUCCESS'
}
