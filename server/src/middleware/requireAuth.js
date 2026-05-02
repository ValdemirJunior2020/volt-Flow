// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\middleware\requireAuth.js
import crypto from 'crypto'
import { supabase } from '../config/supabase.js'

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`
}

async function getOrCreateAppUser(authUser) {
  const authUserId = authUser.id
  const email = authUser.email || null
  const name =
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    email ||
    'New User'

  const { data: existingUser, error: findError } = await supabase
    .from('app_users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (findError) {
    throw new Error(findError.message)
  }

  if (existingUser) {
    return existingUser
  }

  const appUserPayload = {
    id: createId('user'),
    auth_user_id: authUserId,
    name,
    email,
    role: 'owner',
  }

  const { data: newUser, error: createError } = await supabase
    .from('app_users')
    .insert(appUserPayload)
    .select('*')
    .single()

  if (createError) {
    throw new Error(createError.message)
  }

  return newUser
}

async function getOrCreateCompany(appUser, authUser) {
  const authUserId = authUser.id

  const { data: membership, error: membershipError } = await supabase
    .from('company_members')
    .select('company_id, role')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (membershipError) {
    throw new Error(membershipError.message)
  }

  if (membership?.company_id) {
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', membership.company_id)
      .single()

    if (companyError) {
      throw new Error(companyError.message)
    }

    return {
      company,
      memberRole: membership.role,
    }
  }

  const companyPayload = {
    id: createId('company'),
    user_id: appUser.id,
    owner_auth_user_id: authUserId,
    name: `${appUser.name}'s Company`,
    email: appUser.email,
    subscription_status: 'inactive',
  }

  const { data: newCompany, error: companyCreateError } = await supabase
    .from('companies')
    .insert(companyPayload)
    .select('*')
    .single()

  if (companyCreateError) {
    throw new Error(companyCreateError.message)
  }

  const { error: memberCreateError } = await supabase
    .from('company_members')
    .insert({
      company_id: newCompany.id,
      auth_user_id: authUserId,
      role: 'owner',
    })

  if (memberCreateError) {
    throw new Error(memberCreateError.message)
  }

  return {
    company: newCompany,
    memberRole: 'owner',
  }
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : null

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session.',
      })
    }

    const authUser = data.user
    const appUser = await getOrCreateAppUser(authUser)
    const { company, memberRole } = await getOrCreateCompany(appUser, authUser)

    req.authUser = authUser
    req.authUserId = authUser.id
    req.appUser = appUser
    req.appUserId = appUser.id
    req.company = company
    req.companyId = company.id
    req.companyRole = memberRole

    next()
  } catch (error) {
    next(error)
  }
}