// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\repositories\employee.repository.js
import { supabase } from '../config/supabase.js'

function mapEmployeeFromDb(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    role: row.role,
    hourlyRate: Number(row.hourly_rate || 0),
    hours: Number(row.default_hours || 0),
    overtimeHours: Number(row.default_overtime_hours || 0),
    status: row.status || 'Ready',
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function createEmployeeId() {
  return `EMP-${Date.now()}`
}

export async function getEmployees(companyId) {
  if (!companyId) {
    throw new Error('Missing companyId.')
  }

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map(mapEmployeeFromDb)
}

export async function createEmployee(employee = {}, companyId, authUserId) {
  if (!companyId) {
    throw new Error('Missing companyId.')
  }

  const payload = {
    id: employee.id || createEmployeeId(),
    company_id: companyId,
    created_by: authUserId || null,
    name: employee.name,
    role: employee.role,
    hourly_rate: Number(employee.hourlyRate || 0),
    default_hours: Number(employee.hours || 0),
    default_overtime_hours: Number(employee.overtimeHours || 0),
    status: employee.status || 'Ready',
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('employees')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapEmployeeFromDb(data)
}

export async function updateEmployee(employeeId, updates = {}, companyId) {
  if (!companyId) {
    throw new Error('Missing companyId.')
  }

  const payload = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name !== undefined) payload.name = updates.name
  if (updates.role !== undefined) payload.role = updates.role
  if (updates.hourlyRate !== undefined) payload.hourly_rate = Number(updates.hourlyRate)
  if (updates.hours !== undefined) payload.default_hours = Number(updates.hours)
  if (updates.overtimeHours !== undefined) {
    payload.default_overtime_hours = Number(updates.overtimeHours)
  }
  if (updates.status !== undefined) payload.status = updates.status

  const { data, error } = await supabase
    .from('employees')
    .update(payload)
    .eq('id', employeeId)
    .eq('company_id', companyId)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapEmployeeFromDb(data)
}

export async function deleteEmployee(employeeId, companyId) {
  if (!companyId) {
    throw new Error('Missing companyId.')
  }

  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', employeeId)
    .eq('company_id', companyId)

  if (error) {
    throw new Error(error.message)
  }

  return {
    success: true,
    id: employeeId,
  }
}

export const employeeRepository = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
}

export default employeeRepository