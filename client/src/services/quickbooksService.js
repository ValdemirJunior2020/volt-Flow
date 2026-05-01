// client/src/services/quickbooksService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Request failed: ${response.status}`)
  }

  return payload
}

export const quickbooksService = {
  getStatus() {
    return request('/quickbooks/status')
  },

  getConnectUrl() {
    return request('/quickbooks/connect')
  },

  disconnect() {
    return request('/quickbooks/disconnect', { method: 'POST' })
  },

  refreshToken() {
    return request('/quickbooks/refresh-token', { method: 'POST' })
  },

  testConnection() {
    return request('/quickbooks/test-connection', { method: 'POST' })
  },

  getCompanyInfo() {
    return request('/quickbooks/company-info')
  },

  syncCustomers(direction = 'from-qbo') {
    return request('/quickbooks/sync/customers', {
      method: 'POST',
      body: JSON.stringify({ direction }),
    })
  },

  syncInvoices(direction = 'from-qbo') {
    return request('/quickbooks/sync/invoices', {
      method: 'POST',
      body: JSON.stringify({ direction }),
    })
  },

  syncPayments() {
    return request('/quickbooks/sync/payments', { method: 'POST' })
  },

  createInvoice(invoice) {
    return request('/quickbooks/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    })
  },

  getSyncLogs(params = {}) {
    const query = new URLSearchParams(params).toString()
    return request(`/sync-logs${query ? `?${query}` : ''}`)
  },
}
