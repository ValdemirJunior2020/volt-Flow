// server/src/controllers/quickbooks.controller.js
import { env } from '../config/env.js'
import { quickBooksAuthService } from '../services/quickbooksAuth.service.js'
import { syncService } from '../services/sync.service.js'
import { quickBooksApiService } from '../services/quickbooksApi.service.js'
import { syncLogRepository } from '../repositories/syncLog.repository.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const quickBooksController = {
  connect: asyncHandler(async (req, res) => {
    const data = quickBooksAuthService.getAuthorizationUrl(req.tenantId)
    res.json({ success: true, data, message: 'QuickBooks authorization URL generated.' })
  }),

  callback: asyncHandler(async (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const { state, realmId } = req.query
    await quickBooksAuthService.handleCallback({ url: fullUrl, state, realmId })
    await syncLogRepository.create({ tenantId: 'default-company', action: 'OAUTH_CALLBACK', status: 'success', message: 'QuickBooks connected successfully.', qbId: realmId })
    res.redirect(`${env.clientUrl}/integrations/quickbooks?quickbooks=connected`)
  }),

  status: asyncHandler(async (req, res) => {
    const data = await quickBooksAuthService.getTokenStatus(req.tenantId)
    res.json({ success: true, data })
  }),

  disconnect: asyncHandler(async (req, res) => {
    await quickBooksAuthService.disconnect(req.tenantId)
    await syncLogRepository.create({ tenantId: req.tenantId, action: 'DISCONNECT', status: 'success', message: 'QuickBooks disconnected.' })
    res.json({ success: true, message: 'QuickBooks disconnected.' })
  }),

  refreshToken: asyncHandler(async (req, res) => {
    await quickBooksAuthService.refreshToken(req.tenantId)
    await syncLogRepository.create({ tenantId: req.tenantId, action: 'TOKEN_REFRESH', status: 'success', message: 'QuickBooks token refreshed.' })
    res.json({ success: true, message: 'QuickBooks token refreshed.' })
  }),

  testConnection: asyncHandler(async (req, res) => {
    const data = await syncService.testConnection(req.tenantId)
    res.json({ success: true, data, message: data.message })
  }),

  companyInfo: asyncHandler(async (req, res) => {
    const data = await quickBooksApiService.getCompanyInfo(req.tenantId)
    res.json({ success: true, data })
  }),

  syncCustomers: asyncHandler(async (req, res) => {
    const data = await syncService.syncCustomers(req.tenantId, req.body.direction)
    res.json({ success: true, data, message: data.message })
  }),

  syncInvoices: asyncHandler(async (req, res) => {
    const data = await syncService.syncInvoices(req.tenantId, req.body.direction)
    res.json({ success: true, data, message: data.message })
  }),

  syncPayments: asyncHandler(async (req, res) => {
    const data = await syncService.syncPayments(req.tenantId)
    res.json({ success: true, data, message: data.message })
  }),

  createInvoice: asyncHandler(async (req, res) => {
    const data = await syncService.createInvoice(req.tenantId, req.body)
    res.status(201).json({ success: true, data, message: data.message })
  }),
}
