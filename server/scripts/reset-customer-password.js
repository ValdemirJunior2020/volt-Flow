// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\scripts\reset-customer-password.js

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const customerEmail = process.argv[2]
const newPassword = process.argv[3]

if (!customerEmail || !newPassword) {
  console.error('')
  console.error('Usage:')
  console.error('node ./scripts/reset-customer-password.js customer@email.com "NewPassword123!"')
  console.error('')
  process.exit(1)
}

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function resetCustomerPassword() {
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (listError) {
    console.error('Could not list users:', listError.message)
    process.exit(1)
  }

  const user = usersData.users.find(
    (item) => item.email?.toLowerCase() === customerEmail.toLowerCase()
  )

  if (!user) {
    console.error(`User not found: ${customerEmail}`)
    process.exit(1)
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
    email_confirm: true,
  })

  if (error) {
    console.error('Could not reset password:', error.message)
    process.exit(1)
  }

  console.log('')
  console.log('SUCCESS: Customer password reset completed.')
  console.log('Email:', data.user.email)
  console.log('Temporary password:', newPassword)
  console.log('')
}

resetCustomerPassword()