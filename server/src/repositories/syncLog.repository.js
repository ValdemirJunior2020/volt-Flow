// server/src/repositories/syncLog.repository.js
import { supabase, DEFAULT_COMPANY_ID } from '../config/supabase.js'

function mapLogFromDb(log) {
  return {
    id: log.id,
    timestamp: log.created_at,
    action: log.action,
    status: log.status,
    source: log.source,
    message: log.message,
    localId: log.local_id,
    qbId: log.qb_id,
    duration: log.duration,
    errorDetails: log.error_details,
    metadata: log.metadata,
  }
}

export async function getSyncLogs(filters = {}) {
  let query = supabase
    .from('sync_logs')
    .select('*')
    .eq('company_id', filters.companyId || DEFAULT_COMPANY_ID)
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.ilike('status', filters.status)
  }

  if (filters.action) {
    query = query.ilike('action', `%${filters.action}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  let logs = (data || []).map(mapLogFromDb)

  if (filters.search) {
    const search = String(filters.search).toLowerCase()

    logs = logs.filter((log) =>
      [log.action, log.status, log.message, log.source, log.qbId, log.localId]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    )
  }

  return logs
}

export async function addSyncLog(log = {}) {
  const payload = {
    company_id: log.companyId || DEFAULT_COMPANY_ID,
    action: log.action || 'UNKNOWN_ACTION',
    status: log.status || 'INFO',
    source: log.source || 'Fieldora Pro',
    message: log.message || '',
    local_id: log.localId || null,
    qb_id: log.qbId || null,
    duration: Number(log.duration || 0),
    error_details: log.errorDetails || null,
    metadata: log.metadata || null,
  }

  const { data, error } = await supabase
    .from('sync_logs')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapLogFromDb(data)
}

export async function updateSyncLog(id, updates = {}) {
  const payload = {
    status: updates.status,
    message: updates.message,
    duration: updates.duration,
    error_details: updates.errorDetails,
    metadata: updates.metadata,
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key]
  })

  const { data, error } = await supabase
    .from('sync_logs')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapLogFromDb(data)
}

export async function clearSyncLogs() {
  const { error } = await supabase
    .from('sync_logs')
    .delete()
    .eq('company_id', DEFAULT_COMPANY_ID)

  if (error) {
    throw new Error(error.message)
  }

  return []
}

export const syncLogRepository = {
  getAll: getSyncLogs,
  getSyncLogs,
  create: addSyncLog,
  add: addSyncLog,
  addSyncLog,
  update: updateSyncLog,
  updateSyncLog,
  clear: clearSyncLogs,
  clearSyncLogs,
}

export default syncLogRepository