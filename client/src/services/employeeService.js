// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\services\employeeService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

export const employeeService = {
  getEmployees() {
    return request('/employees')
  },

  createEmployee(employee) {
    return request('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    })
  },

  updateEmployee(id, employee) {
    return request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    })
  },

  deleteEmployee(id) {
    return request(`/employees/${id}`, {
      method: 'DELETE',
    })
  },
}