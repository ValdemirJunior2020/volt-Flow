// server/src/controllers/syncLogs.controller.js
import { syncLogRepository } from '../repositories/syncLog.repository.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const syncLogsController = {
  list: asyncHandler(async (req, res) => {
    const items = await syncLogRepository.list({
      tenantId: req.tenantId,
      limit: req.query.limit || 50,
      status: req.query.status,
      action: req.query.action,
      search: req.query.search,
    })
    res.json({ success: true, data: { items, count: items.length } })
  }),

  create: asyncHandler(async (req, res) => {
    const item = await syncLogRepository.create({ tenantId: req.tenantId, ...req.body })
    res.status(201).json({ success: true, data: item })
  }),
}
