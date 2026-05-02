// client/src/services/subscriptionService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

export const subscriptionService = {
  getPayPalConfig() {
    return request('/paypal/config')
  },

  createOrder() {
    return request('/paypal/create-order', {
      method: 'POST',
    })
  },

  captureOrder(orderId) {
    return request('/paypal/capture-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    })
  },

  getStatus() {
    return request('/subscription/status')
  },

  cancel() {
    return request('/subscription/cancel', {
      method: 'POST',
    })
  },

  activateDemo() {
    return request('/subscription/activate-demo', {
      method: 'POST',
    })
  },
}