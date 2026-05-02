// server/src/repositories/syncLog.repository.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../data')
const SYNC_LOG_FILE = path.join(DATA_DIR, 'syncLogs.json')

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(SYNC_LOG_FILE)
  } catch {
    await fs.writeFile(SYNC_LOG_FILE, JSON.stringify([], null, 2))
  }
}

async function readLogsFile() {
  await ensureDataFile()

  try {
    const raw = await fs.readFile(SYNC_LOG_FILE, 'utf8')
    const parsed = JSON.parse(raw || '[]')

    if (Array.isArray(parsed)) {
      return parsed
    }

    if (parsed && Array.isArray(parsed.logs)) {
      return parsed.logs
    }

    return []
  } catch (error) {
    console.error('Failed to read syncLogs.json. Resetting to empty array.', error)
    await fs.writeFile(SYNC_LOG_FILE, JSON.stringify([], null, 2))
    return []
  }
}

async function writeLogsFile(logs) {
  const safeLogs = Array.isArray(logs) ? logs : []
  await fs.writeFile(SYNC_LOG_FILE, JSON.stringify(safeLogs, null, 2))
}

export async function getSyncLogs(filters = {}) {
  let logs = await readLogsFile()

  if (filters.status) {
    logs = logs.filter(
      (log) =>
        String(log.status).toLowerCase() === String(filters.status).toLowerCase()
    )
  }

  if (filters.action) {
    logs = logs.filter((log) =>
      String(log.action).toLowerCase().includes(String(filters.action).toLowerCase())
    )
  }

  if (filters.search) {
    const search = String(filters.search).toLowerCase()

    logs = logs.filter((log) =>
      [
        log.action,
        log.status,
        log.message,
        log.source,
        log.qbId,
        log.localId,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    )
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export async function addSyncLog(log = {}) {
  const logs = await readLogsFile()

  const newLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action: log.action || 'UNKNOWN_ACTION',
    status: log.status || 'INFO',
    source: log.source || 'VoltFlow',
    message: log.message || '',
    localId: log.localId || null,
    qbId: log.qbId || null,
    duration: log.duration || 0,
    errorDetails: log.errorDetails || null,
    metadata: log.metadata || null,
  }

  logs.unshift(newLog)

  await writeLogsFile(logs)

  return newLog
}

export async function updateSyncLog(id, updates = {}) {
  const logs = await readLogsFile()

  const updatedLogs = logs.map((log) =>
    log.id === id
      ? {
          ...log,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : log
  )

  await writeLogsFile(updatedLogs)

  return updatedLogs.find((log) => log.id === id) || null
}

export async function clearSyncLogs() {
  await writeLogsFile([])
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