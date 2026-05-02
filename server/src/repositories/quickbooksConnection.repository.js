// server/src/repositories/quickbooksConnection.repository.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../data')
const CONNECTION_FILE = path.join(DATA_DIR, 'quickbooksConnection.json')

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

async function ensureConnectionFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(CONNECTION_FILE)
  } catch {
    await fs.writeFile(CONNECTION_FILE, JSON.stringify(DEFAULT_CONNECTION, null, 2))
  }
}

export async function getQuickBooksConnection() {
  await ensureConnectionFile()

  try {
    const raw = await fs.readFile(CONNECTION_FILE, 'utf8')
    const parsed = JSON.parse(raw || '{}')

    return {
      ...DEFAULT_CONNECTION,
      ...parsed,
    }
  } catch {
    await fs.writeFile(CONNECTION_FILE, JSON.stringify(DEFAULT_CONNECTION, null, 2))
    return DEFAULT_CONNECTION
  }
}

export async function saveQuickBooksConnection(connection) {
  await ensureConnectionFile()

  const current = await getQuickBooksConnection()

  const updated = {
    ...current,
    ...connection,
    updatedAt: new Date().toISOString(),
  }

  await fs.writeFile(CONNECTION_FILE, JSON.stringify(updated, null, 2))

  return updated
}

export async function clearQuickBooksConnection() {
  await ensureConnectionFile()

  await fs.writeFile(CONNECTION_FILE, JSON.stringify(DEFAULT_CONNECTION, null, 2))

  return DEFAULT_CONNECTION
}