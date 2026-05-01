// server/src/config/env.js
import dotenv from 'dotenv'

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.SERVER_PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  quickBooks: {
    clientId: process.env.QUICKBOOKS_CLIENT_ID || '',
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET || '',
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URI || 'http://localhost:5000/api/v1/quickbooks/callback',
    environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
    scopes: process.env.QUICKBOOKS_SCOPES || 'com.intuit.quickbooks.accounting openid profile email phone address',
  },
  tokenEncryptionSecret: process.env.TOKEN_ENCRYPTION_SECRET || 'local-dev-token-encryption-secret-change-me',
}

export function validateQuickBooksEnv() {
  const missing = []
  if (!env.quickBooks.clientId) missing.push('QUICKBOOKS_CLIENT_ID')
  if (!env.quickBooks.clientSecret) missing.push('QUICKBOOKS_CLIENT_SECRET')
  return missing
}
