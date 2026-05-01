// server/src/services/quickbooksApi.service.js
import axios from 'axios'
import { env } from '../config/env.js'
import { quickBooksAuthService } from './quickbooksAuth.service.js'
import { tokenRepository } from '../repositories/token.repository.js'

function baseUrl() {
  return env.quickBooks.environment === 'production'
    ? 'https://quickbooks.api.intuit.com'
    : 'https://sandbox-quickbooks.api.intuit.com'
}

export const quickBooksApiService = {
  async request(tenantId, { method = 'GET', path, data, params }) {
    const record = await quickBooksAuthService.getValidToken(tenantId)
    const accessToken = record.token.access_token
    const url = `${baseUrl()}/v3/company/${record.realmId}${path}`

    const response = await axios({
      method,
      url,
      data,
      params: { minorversion: 75, ...(params || {}) },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    return response.data
  },

  async getCompanyInfo(tenantId) {
    const record = await quickBooksAuthService.getValidToken(tenantId)
    const data = await this.request(tenantId, { path: `/companyinfo/${record.realmId}` })
    const companyName = data?.CompanyInfo?.CompanyName || data?.CompanyInfo?.LegalName || ''
    if (companyName) await tokenRepository.setCompanyName(tenantId, companyName)
    return data.CompanyInfo
  },

  async query(tenantId, sql) {
    return this.request(tenantId, { path: '/query', params: { query: sql } })
  },

  async createCustomer(tenantId, payload) {
    return this.request(tenantId, { method: 'POST', path: '/customer', data: payload })
  },

  async createInvoice(tenantId, payload) {
    return this.request(tenantId, { method: 'POST', path: '/invoice', data: payload })
  },
}
