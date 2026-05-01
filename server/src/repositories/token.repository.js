// server/src/repositories/token.repository.js
import { JsonFileRepository } from './jsonFileRepository.js'
import { decryptJson, encryptJson } from '../utils/crypto.js'

const repo = new JsonFileRepository('tokens.json', { tenants: {} })

export const tokenRepository = {
  async get(tenantId = 'default-company') {
    const store = await repo.read()
    const record = store.tenants[tenantId]
    if (!record?.encryptedToken) return null
    return { ...record, token: decryptJson(record.encryptedToken) }
  },

  async save(tenantId = 'default-company', tokenData) {
    const store = await repo.read()
    store.tenants[tenantId] = {
      tenantId,
      realmId: tokenData.realmId,
      companyName: tokenData.companyName || '',
      encryptedToken: encryptJson(tokenData.token),
      createdAt: tokenData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSyncAt: tokenData.lastSyncAt || null,
    }
    await repo.write(store)
    return store.tenants[tenantId]
  },

  async remove(tenantId = 'default-company') {
    const store = await repo.read()
    delete store.tenants[tenantId]
    await repo.write(store)
  },

  async setCompanyName(tenantId, companyName) {
    const store = await repo.read()
    if (store.tenants[tenantId]) {
      store.tenants[tenantId].companyName = companyName
      store.tenants[tenantId].updatedAt = new Date().toISOString()
      await repo.write(store)
    }
  },

  async markSynced(tenantId = 'default-company') {
    const store = await repo.read()
    if (store.tenants[tenantId]) {
      store.tenants[tenantId].lastSyncAt = new Date().toISOString()
      store.tenants[tenantId].updatedAt = new Date().toISOString()
      await repo.write(store)
    }
  },
}
