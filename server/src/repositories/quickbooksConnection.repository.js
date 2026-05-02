// server/src/repositories/quickbooksConnection.repository.js
import { supabase, DEFAULT_COMPANY_ID } from '../config/supabase.js'

const DEFAULT_CONNECTION = {
  connected: false,
  companyName: null,
  realmId: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  lastSyncAt: null,
  environment: 'sandbox',
}

function mapConnectionFromDb(row) {
  if (!row) return DEFAULT_CONNECTION

  return {
    connected: row.connected,
    companyName: row.company_name,
    realmId: row.realm_id,
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    expiresAt: row.expires_at,
    lastSyncAt: row.last_sync_at,
    environment: row.environment,
  }
}

export async function getQuickBooksConnection(companyId = DEFAULT_COMPANY_ID) {
  const { data, error } = await supabase
    .from('quickbooks_connections')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return mapConnectionFromDb(data)
}

export async function saveQuickBooksConnection(connection, companyId = DEFAULT_COMPANY_ID) {
  const payload = {
    company_id: companyId,
    connected: connection.connected ?? true,
    company_name: connection.companyName ?? connection.company_name ?? null,
    realm_id: connection.realmId ?? connection.realm_id ?? null,
    access_token: connection.accessToken ?? connection.access_token ?? null,
    refresh_token: connection.refreshToken ?? connection.refresh_token ?? null,
    expires_at: connection.expiresAt ?? connection.expires_at ?? null,
    last_sync_at: connection.lastSyncAt
      ? new Date(connection.lastSyncAt).toISOString()
      : new Date().toISOString(),
    environment: connection.environment || process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('quickbooks_connections')
    .upsert(payload, { onConflict: 'company_id' })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapConnectionFromDb(data)
}

export async function clearQuickBooksConnection(companyId = DEFAULT_COMPANY_ID) {
  const payload = {
    company_id: companyId,
    connected: false,
    company_name: null,
    realm_id: null,
    access_token: null,
    refresh_token: null,
    expires_at: null,
    last_sync_at: null,
    environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('quickbooks_connections')
    .upsert(payload, { onConflict: 'company_id' })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapConnectionFromDb(data)
}