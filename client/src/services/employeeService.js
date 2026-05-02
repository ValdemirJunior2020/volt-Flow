// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\services\employeeService.js
import { apiRequest } from './apiClient'

export const employeeService = {
  getEmployees() {
    return apiRequest('/employees')
  },

  createEmployee(employee) {
    return apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    })
  },

  updateEmployee(id, employee) {
    return apiRequest(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    })
  },

  deleteEmployee(id) {
    return apiRequest(`/employees/${id}`, {
      method: 'DELETE',
    })
  },
}