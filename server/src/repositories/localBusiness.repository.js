// server/src/repositories/localBusiness.repository.js
import { JsonFileRepository } from './jsonFileRepository.js'

const seed = {
  customers: [
    { id: 'CUST-1001', name: 'Bright Home Services', email: 'billing@example.com', phone: '555-0100' },
    { id: 'CUST-1002', name: 'Lakeside Apartments', email: 'ap@lakeside.example', phone: '555-0101' }
  ],
  jobs: [
    { id: 'JOB-1004', customerId: 'CUST-1001', technician: 'Mike R.', title: 'Panel diagnostic and repair', status: 'scheduled' }
  ],
  serviceItems: [
    { id: 'ITEM-LABOR', name: 'Electrical service labor', type: 'labor', rate: 125 },
    { id: 'ITEM-BREAKER', name: 'Breaker materials', type: 'materials', rate: 95 }
  ]
}

const repo = new JsonFileRepository('localBusiness.json', seed)

export const localBusinessRepository = {
  async listCustomers() {
    const store = await repo.read()
    return store.customers
  },

  async listServiceItems() {
    const store = await repo.read()
    return store.serviceItems
  },

  async findCustomerByName(name) {
    const store = await repo.read()
    return store.customers.find((customer) => customer.name.toLowerCase() === name.toLowerCase())
  },
}
