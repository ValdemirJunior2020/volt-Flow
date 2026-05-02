// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\server\src\controllers\employee.controller.js
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../repositories/employee.repository.js'
import { addSyncLog } from '../repositories/syncLog.repository.js'

function validateEmployeePayload(body) {
  if (!body.name || !String(body.name).trim()) {
    return 'Employee name is required.'
  }

  if (!body.role || !String(body.role).trim()) {
    return 'Employee role is required.'
  }

  if (Number.isNaN(Number(body.hourlyRate)) || Number(body.hourlyRate) < 0) {
    return 'Hourly rate must be a valid number.'
  }

  if (Number.isNaN(Number(body.hours)) || Number(body.hours) < 0) {
    return 'Hours must be a valid number.'
  }

  if (Number.isNaN(Number(body.overtimeHours || 0)) || Number(body.overtimeHours || 0) < 0) {
    return 'Overtime hours must be a valid number.'
  }

  if (Number(body.overtimeHours || 0) > Number(body.hours || 0)) {
    return 'Overtime hours cannot be greater than total hours.'
  }

  return null
}

export async function listEmployees(req, res, next) {
  try {
    const employees = await getEmployees(req.companyId)

    return res.json({
      success: true,
      companyId: req.companyId,
      count: employees.length,
      employees,
    })
  } catch (error) {
    next(error)
  }
}

export async function addEmployee(req, res, next) {
  try {
    const validationError = validateEmployeePayload(req.body)

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      })
    }

    const employee = await createEmployee(
      {
        name: String(req.body.name).trim(),
        role: String(req.body.role).trim(),
        hourlyRate: Number(req.body.hourlyRate),
        hours: Number(req.body.hours),
        overtimeHours: Number(req.body.overtimeHours || 0),
        status: req.body.status || 'Ready',
      },
      req.companyId,
      req.authUserId
    )

    await addSyncLog({
      companyId: req.companyId,
      action: 'EMPLOYEE_CREATED',
      status: 'SUCCESS',
      source: 'Fildemora Pro',
      message: `${employee.name} was added.`,
      localId: employee.id,
      metadata: {
        employee,
        authUserId: req.authUserId,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Employee saved to Supabase.',
      employee,
    })
  } catch (error) {
    next(error)
  }
}

export async function editEmployee(req, res, next) {
  try {
    const { id } = req.params
    const validationError = validateEmployeePayload(req.body)

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      })
    }

    const employee = await updateEmployee(
      id,
      {
        name: String(req.body.name).trim(),
        role: String(req.body.role).trim(),
        hourlyRate: Number(req.body.hourlyRate),
        hours: Number(req.body.hours),
        overtimeHours: Number(req.body.overtimeHours || 0),
        status: req.body.status || 'Ready',
      },
      req.companyId
    )

    await addSyncLog({
      companyId: req.companyId,
      action: 'EMPLOYEE_UPDATED',
      status: 'SUCCESS',
      source: 'Fildemora Pro',
      message: `${employee.name} was updated.`,
      localId: employee.id,
      metadata: {
        employee,
        authUserId: req.authUserId,
      },
    })

    return res.json({
      success: true,
      message: 'Employee updated in Supabase.',
      employee,
    })
  } catch (error) {
    next(error)
  }
}

export async function removeEmployee(req, res, next) {
  try {
    const { id } = req.params

    await deleteEmployee(id, req.companyId)

    await addSyncLog({
      companyId: req.companyId,
      action: 'EMPLOYEE_DELETED',
      status: 'SUCCESS',
      source: 'Fildemora Pro',
      message: `Employee ${id} was deleted.`,
      localId: id,
      metadata: {
        authUserId: req.authUserId,
      },
    })

    return res.json({
      success: true,
      message: 'Employee deleted from Supabase.',
      id,
    })
  } catch (error) {
    next(error)
  }
}