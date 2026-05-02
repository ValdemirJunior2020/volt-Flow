// client/src/services/quickbooksService.js
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

export const quickbooksService = {
  getStatus() {
    return request('/quickbooks/status')
  },

  connect() {
    window.location.href = `${API_BASE_URL}/quickbooks/connect`
  },

  disconnect() {
    return request('/quickbooks/disconnect', {
      method: 'POST',
    })
  },

  refreshToken() {
    return request('/quickbooks/refresh-token', {
      method: 'POST',
    })
  },

  syncCustomers(direction = 'from-qbo') {
    return request('/quickbooks/sync/customers', {
      method: 'POST',
      body: JSON.stringify({ direction }),
    })
  },

  syncInvoices(direction = 'to-qbo') {
    return request('/quickbooks/sync/invoices', {
      method: 'POST',
      body: JSON.stringify({ direction }),
    })
  },

  createInvoice(invoice) {
    return request('/quickbooks/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    })
  },

  syncPayments() {
    return request('/quickbooks/sync/payments', {
      method: 'POST',
    })
  },

  savePayrollSummary(payrollRun) {
    return request('/quickbooks/payroll/sync-summary', {
      method: 'POST',
      body: JSON.stringify(payrollRun),
    })
  },

  getSyncLogs(params = {}) {
    const query = new URLSearchParams(params).toString()
    return request(`/sync-logs${query ? `?${query}` : ''}`)
  },
}