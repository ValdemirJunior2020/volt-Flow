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

export async function getSubscriptionStatus(userId = DEFAULT_USER_ID) {
  const subscriptions = await readSubscriptions()

  const subscription = subscriptions.find((item) => item.userId === userId)

  if (!subscription) {
    return {
      userId,
      companyId: DEFAULT_COMPANY_ID,
      status: 'INACTIVE',
      active: false,
      subscriptionId: null,
      planId: process.env.PAYPAL_PLAN_ID || null,
      payerEmail: null,
      nextBillingTime: null,
      createdAt: null,
      updatedAt: null,
    }
  }

  return {
    ...subscription,
    active: subscription.status === 'ACTIVE',
  }
}

export async function saveSubscription(subscription = {}) {
  const subscriptions = await readSubscriptions()

  const userId = subscription.userId || DEFAULT_USER_ID
  const companyId = subscription.companyId || DEFAULT_COMPANY_ID

  const existingIndex = subscriptions.findIndex((item) => item.userId === userId)

  const savedSubscription = {
    userId,
    companyId,
    planId: subscription.planId || process.env.PAYPAL_PLAN_ID || null,
    subscriptionId: subscription.subscriptionId || null,
    status: subscription.status || 'INACTIVE',
    payerEmail: subscription.payerEmail || null,
    nextBillingTime: subscription.nextBillingTime || null,
    lastWebhookAt: subscription.lastWebhookAt || null,
    raw: subscription.raw || null,
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

  return {
    ...savedSubscription,
    active: savedSubscription.status === 'ACTIVE',
  }
}

export async function cancelLocalSubscription(userId = DEFAULT_USER_ID) {
  const current = await getSubscriptionStatus(userId)

  return saveSubscription({
    ...current,
    userId,
    status: 'CANCELLED',
  })
}

export const subscriptionRepository = {
  getSubscriptionStatus,
  saveSubscription,
  cancelLocalSubscription,
}

export default subscriptionRepository