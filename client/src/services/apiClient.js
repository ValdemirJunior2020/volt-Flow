// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\services\apiClient.js

import { supabase } from '../lib/supabaseClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const TIMEOUT_MS = 10000

function timeoutPromise(message) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), TIMEOUT_MS)
  })
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, TIMEOUT_MS)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function getAccessToken() {
  try {
    const sessionResult = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise('Supabase session check timed out.'),
    ])

    return sessionResult?.data?.session?.access_token || null
  } catch (error) {
    console.warn('No Supabase session found:', error.message)
    return null
  }
}

export async function apiRequest(path, options = {}) {
  const token = await getAccessToken()

  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

export async function publicApiRequest(path, options = {}) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}