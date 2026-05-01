// server/src/utils/crypto.js
import crypto from 'crypto'
import { env } from '../config/env.js'

const algorithm = 'aes-256-gcm'
const key = crypto.createHash('sha256').update(env.tokenEncryptionSecret).digest()

export function encryptJson(value) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const plaintext = JSON.stringify(value)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`
}

export function decryptJson(payload) {
  if (!payload) return null
  const [ivB64, tagB64, encryptedB64] = payload.split('.')
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivB64, 'base64'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'))
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedB64, 'base64')), decipher.final()])
  return JSON.parse(decrypted.toString('utf8'))
}
