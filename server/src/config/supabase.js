// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\config\supabase.js
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('SUPABASE_URL is missing.')
  console.error('Expected .env path:', path.resolve(__dirname, '../../.env'))
  throw new Error('Missing SUPABASE_URL in server environment variables.')
}

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is missing.')
  console.error('Expected .env path:', path.resolve(__dirname, '../../.env'))
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in server environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Temporary fallback values for older repositories while we migrate every module
// to real authenticated company IDs.
export const DEFAULT_USER_ID = process.env.APP_DEFAULT_USER_ID || 'demo-user-001'
export const DEFAULT_COMPANY_ID =
  process.env.APP_DEFAULT_COMPANY_ID || 'demo-company-001'