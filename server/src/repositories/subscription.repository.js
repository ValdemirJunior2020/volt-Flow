// server/src/repositories/subscription.repository.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../data')
const SUBSCRIPTION_FILE = path.join(DATA_DIR, 'subscriptions.json')

const DEFAULT_USER_ID = process.env.APP_DEFAULT_USER_ID || 'demo-user-001'
const DEFAULT_COMPANY_ID = process.env.APP_DEFAULT_COMPANY_ID || 'demo-company-001'

async function ensureSubscriptionFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(SUBSCRIPTION_FILE)
  } catch {
    await fs.writeFile(SUBSCRIPTION_FILE, JSON.stringify([], null, 2))
  }
}

async function readSubscriptions() {
  await ensureSubscriptionFile()

  try {
    const raw = await fs.readFile(SUBSCRIPTION_FILE, 'utf8')
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    await fs.writeFile(SUBSCRIPTION_FILE, JSON.stringify([], null, 2))
    return []
  }
}

async function writeSubscriptions(subscriptions) {
  await fs.writeFile(
    SUBSCRIPTION_FILE,
    JSON.stringify(Array.isArray(subscriptions) ? subscriptions : [], null, 2)
  )
}

function addMonths(date, months) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

function isSubscriptionActive(subscription) {
  if (!subscription) return false
  if (subscription.status !== 'ACTIVE') return false
  if (!subscription.expiresAt) return false

  return new Date(subscription.expiresAt).getTime() > Date.now()
}

export async function getSubscriptionStatus(userId = DEFAULT_USER_ID) {
  const subscriptions = await readSubscriptions()
  const subscription = subscriptions.find((item) => item.userId === userId)

  if (!subscription) {
    return {
      userId,
      companyId: DEFAULT_COMPANY_ID,
      status: 'INACTIVE',
      active: false,
      paymentType: 'ONE_TIME_500',
      amountPaid: 0,
      orderId: null,
      payerEmail: null,
      startsAt: null,
      expiresAt: null,
      daysRemaining: 0,
      createdAt: null,
      updatedAt: null,
    }
  }

  const active = isSubscriptionActive(subscription)
  const expiresAtTime = subscription.expiresAt
    ? new Date(subscription.expiresAt).getTime()
    : Date.now()

  const daysRemaining = active
    ? Math.ceil((expiresAtTime - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return {
    ...subscription,
    active,
    daysRemaining,
    status: active ? 'ACTIVE' : 'EXPIRED',
  }
}

export async function savePaidAccess({
  userId = DEFAULT_USER_ID,
  companyId = DEFAULT_COMPANY_ID,
  orderId,
  payerEmail,
  raw,
}) {
  const subscriptions = await readSubscriptions()
  const existingIndex = subscriptions.findIndex((item) => item.userId === userId)

  const startsAt = new Date()
  const expiresAt = addMonths(startsAt, 4)

  const savedSubscription = {
    userId,
    companyId,
    paymentType: 'ONE_TIME_500',
    amountPaid: 500,
    currency: 'USD',
    orderId,
    status: 'ACTIVE',
    payerEmail: payerEmail || null,
    startsAt: startsAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    raw: raw || null,
    createdAt:
      existingIndex >= 0
        ? subscriptions[existingIndex].createdAt
        : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    subscriptions[existingIndex] = savedSubscription
  } else {
    subscriptions.push(savedSubscription)
  }

  await writeSubscriptions(subscriptions)

  return getSubscriptionStatus(userId)
}

export async function cancelLocalSubscription(userId = DEFAULT_USER_ID) {
  const subscriptions = await readSubscriptions()
  const existingIndex = subscriptions.findIndex((item) => item.userId === userId)

  if (existingIndex < 0) {
    return getSubscriptionStatus(userId)
  }

  subscriptions[existingIndex] = {
    ...subscriptions[existingIndex],
    status: 'CANCELLED',
    active: false,
    updatedAt: new Date().toISOString(),
  }

  await writeSubscriptions(subscriptions)

  return getSubscriptionStatus(userId)
}

export async function activateDemoSubscription(userId = DEFAULT_USER_ID) {
  return savePaidAccess({
    userId,
    companyId: DEFAULT_COMPANY_ID,
    orderId: 'DEMO-ORDER-500',
    payerEmail: 'demo@fieldorapro.com',
    raw: {
      demo: true,
    },
  })
}

export const subscriptionRepository = {
  getSubscriptionStatus,
  savePaidAccess,
  cancelLocalSubscription,
  activateDemoSubscription,
}

export default subscriptionRepository