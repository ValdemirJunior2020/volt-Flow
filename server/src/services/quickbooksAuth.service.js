// server/src/services/quickbooksAuth.service.js
import OAuthClient from 'intuit-oauth'
import crypto from 'crypto'
import { env, validateQuickBooksEnv } from '../config/env.js'
import { tokenRepository } from '../repositories/token.repository.js'

const stateStore = new Map()
let refreshInFlight = null

export function getOAuthClient() {
  return new OAuthClient({
    clientId: env.quickBooks.clientId,
    clientSecret: env.quickBooks.clientSecret,
    environment: env.quickBooks.environment,
    redirectUri: env.quickBooks.redirectUri,
  })
}

export const quickBooksAuthService = {
  getAuthorizationUrl(tenantId) {
    const missing = validateQuickBooksEnv()
    if (missing.length) {
      const error = new Error(`Missing QuickBooks environment values: ${missing.join(', ')}`)
      error.statusCode = 400
      throw error
    }

    const oauthClient = getOAuthClient()
    const state = crypto.randomBytes(24).toString('hex')
    stateStore.set(state, { tenantId, createdAt: Date.now() })

    const authorizationUrl = oauthClient.authorizeUri({
      scope: env.quickBooks.scopes.split(' '),
      state,
    })

    return { authorizationUrl, state }
  },

  async handleCallback({ url, state, realmId }) {
    const stored = stateStore.get(state)
    if (!stored || Date.now() - stored.createdAt > 10 * 60 * 1000) {
      const error = new Error('Invalid or expired OAuth state. Please try connecting again.')
      error.statusCode = 400
      throw error
    }

    stateStore.delete(state)
    const oauthClient = getOAuthClient()
    const authResponse = await oauthClient.createToken(url)
    const token = authResponse.getJson()

    await tokenRepository.save(stored.tenantId, {
      realmId,
      token,
      companyName: '',
      createdAt: new Date().toISOString(),
    })

    return { tenantId: stored.tenantId, realmId, token }
  },

  async getTokenStatus(tenantId) {
    const record = await tokenRepository.get(tenantId)
    if (!record) return { status: 'disconnected' }

    const expiresAt = record.token?.x_refresh_token_expires_in
      ? new Date(new Date(record.updatedAt).getTime() + Number(record.token.x_refresh_token_expires_in) * 1000)
      : null

    const accessTokenExpiresAt = record.token?.expires_in
      ? new Date(new Date(record.updatedAt).getTime() + Number(record.token.expires_in) * 1000)
      : null

    const isExpired = accessTokenExpiresAt ? accessTokenExpiresAt.getTime() <= Date.now() : false

    return {
      status: isExpired ? 'token_expired' : 'connected',
      realmId: record.realmId,
      companyName: record.companyName || '',
      lastSyncAt: record.lastSyncAt,
      accessTokenExpiresAt,
      refreshTokenExpiresAt: expiresAt,
    }
  },

  async getValidToken(tenantId) {
    const record = await tokenRepository.get(tenantId)
    if (!record) {
      const error = new Error('QuickBooks is not connected.')
      error.statusCode = 401
      throw error
    }

    const updatedAt = new Date(record.updatedAt).getTime()
    const expiresInMs = Number(record.token.expires_in || 0) * 1000
    const expiresSoon = updatedAt + expiresInMs - 2 * 60 * 1000 <= Date.now()

    if (!expiresSoon) return record
    return this.refreshToken(tenantId)
  },

  async refreshToken(tenantId) {
    if (refreshInFlight) return refreshInFlight

    refreshInFlight = (async () => {
      const record = await tokenRepository.get(tenantId)
      if (!record) {
        const error = new Error('QuickBooks is not connected.')
        error.statusCode = 401
        throw error
      }

      const oauthClient = getOAuthClient()
      oauthClient.setToken(record.token)
      const authResponse = await oauthClient.refresh()
      const refreshedToken = authResponse.getJson()

      await tokenRepository.save(tenantId, {
        realmId: record.realmId,
        companyName: record.companyName,
        token: refreshedToken,
        createdAt: record.createdAt,
        lastSyncAt: record.lastSyncAt,
      })

      return tokenRepository.get(tenantId)
    })()

    try {
      return await refreshInFlight
    } finally {
      refreshInFlight = null
    }
  },

  async disconnect(tenantId) {
    await tokenRepository.remove(tenantId)
  },
}
