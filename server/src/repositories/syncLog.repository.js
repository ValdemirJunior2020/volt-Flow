// server/src/repositories/syncLog.repository.js
import { v4 as uuid } from 'uuid'
import { JsonFileRepository } from './jsonFileRepository.js'

const repo = new JsonFileRepository('syncLogs.json', { items: [] })

export const syncLogRepository = {
  async list({ tenantId = 'default-company', limit = 50, status, action, search } = {}) {
    const store = await repo.read()
    let items = store.items.filter((item) => item.tenantId === tenantId)
    if (status) items = items.filter((item) => item.status === status)
    if (action) items = items.filter((item) => item.action === action)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((item) => `${item.action} ${item.message} ${item.source} ${item.qbId} ${item.localId}`.toLowerCase().includes(q))
    }
    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, Number(limit))
  },

  async create(entry) {
    const store = await repo.read()
    const item = {
      id: uuid(),
      tenantId: entry.tenantId || 'default-company',
      action: entry.action,
      status: entry.status,
      message: entry.message,
      source: entry.source || 'quickbooks',
      localId: entry.localId || null,
      qbId: entry.qbId || null,
      durationMs: entry.durationMs || null,
      errorDetails: entry.errorDetails || null,
      timestamp: new Date().toISOString(),
      metadata: entry.metadata || {},
    }
    store.items.push(item)
    await repo.write(store)
    return item
  },
}
