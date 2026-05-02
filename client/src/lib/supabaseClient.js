// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\lib\supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL in client environment variables.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY in client environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)