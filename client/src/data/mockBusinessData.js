// client/src/data/mockBusinessData.js
export const jobs = [
  { id: 'JOB-1001', customer: 'Palm Beach Dental', type: 'Panel Upgrade', technician: 'Mike Rodriguez', date: 'Today 9:00 AM', status: 'In Progress', amount: 2850, priority: 'High', address: '820 Lake Ave, Lake Worth, FL' },
  { id: 'JOB-1002', customer: 'Santos Residence', type: 'EV Charger Install', technician: 'Sarah Philips', date: 'Today 11:30 AM', status: 'Scheduled', amount: 1250, priority: 'Normal', address: '1104 N K St, Lake Worth, FL' },
  { id: 'JOB-1003', customer: 'Ocean Breeze Cafe', type: 'Lighting Retrofit', technician: 'Carlos Mendes', date: 'Tomorrow 8:00 AM', status: 'Estimate Sent', amount: 4300, priority: 'Normal', address: '312 Dixie Hwy, West Palm Beach, FL' },
  { id: 'JOB-1004', customer: 'Marina Offices', type: 'Breaker Troubleshooting', technician: 'Naomi Lee', date: 'Fri 2:00 PM', status: 'Ready to Invoice', amount: 680, priority: 'Urgent', address: '2440 Broadway, Riviera Beach, FL' },
]

export const scheduleEvents = [
  { time: '08:00 AM', title: 'Warehouse material pickup', technician: 'Carlos Mendes', status: 'Confirmed' },
  { time: '09:00 AM', title: 'Panel upgrade - Palm Beach Dental', technician: 'Mike Rodriguez', status: 'In Progress' },
  { time: '11:30 AM', title: 'EV charger install - Santos Residence', technician: 'Sarah Philips', status: 'Confirmed' },
  { time: '02:00 PM', title: 'Emergency troubleshooting - Marina Offices', technician: 'Naomi Lee', status: 'Tentative' },
]

export const invoices = [
  { id: 'INV-2401', customer: 'Palm Beach Dental', job: 'JOB-1001', amount: 2850, due: 'May 07, 2026', status: 'Draft', qb: 'Not Synced' },
  { id: 'INV-2398', customer: 'Ocean Breeze Cafe', job: 'JOB-0994', amount: 4300, due: 'May 03, 2026', status: 'Sent', qb: 'Synced' },
  { id: 'INV-2388', customer: 'Santos Residence', job: 'JOB-0988', amount: 1250, due: 'Apr 30, 2026', status: 'Overdue', qb: 'Synced' },
  { id: 'INV-2375', customer: 'Marina Offices', job: 'JOB-0975', amount: 680, due: 'Paid Apr 26, 2026', status: 'Paid', qb: 'Synced' },
]

export const customers = [
  { name: 'Palm Beach Dental', type: 'Commercial', phone: '(561) 555-0181', email: 'office@pbdental.com', balance: 2850, lastJob: 'Panel Upgrade', status: 'Active' },
  { name: 'Santos Residence', type: 'Residential', phone: '(561) 555-0144', email: 'maria@santoshome.com', balance: 1250, lastJob: 'EV Charger Install', status: 'Active' },
  { name: 'Ocean Breeze Cafe', type: 'Commercial', phone: '(561) 555-0167', email: 'manager@oceanbreeze.com', balance: 4300, lastJob: 'Lighting Retrofit', status: 'VIP' },
  { name: 'Marina Offices', type: 'Commercial', phone: '(561) 555-0199', email: 'ops@marinaoffices.com', balance: 0, lastJob: 'Breaker Troubleshooting', status: 'Active' },
]

export const employees = [
  { name: 'Mike Rodriguez', role: 'Master Electrician', jobs: 7, hours: 38.5, payRate: 42, status: 'In Field' },
  { name: 'Sarah Philips', role: 'Journeyman Electrician', jobs: 6, hours: 36, payRate: 34, status: 'In Field' },
  { name: 'Carlos Mendes', role: 'Apprentice', jobs: 5, hours: 32, payRate: 24, status: 'Warehouse' },
  { name: 'Naomi Lee', role: 'Service Technician', jobs: 8, hours: 40, payRate: 37, status: 'Available' },
]

export const materials = [
  { sku: 'WIRE-12-2', item: '12/2 Romex Wire Roll', category: 'Wire', stock: 18, reorder: 10, cost: 92.5, vendor: 'City Electric' },
  { sku: 'BRK-20A', item: '20A Single Pole Breaker', category: 'Breakers', stock: 44, reorder: 25, cost: 8.75, vendor: 'Graybar' },
  { sku: 'BOX-GANG1', item: '1-Gang Electrical Box', category: 'Boxes', stock: 120, reorder: 60, cost: 1.24, vendor: 'Home Depot Pro' },
  { sku: 'EV-CHG-48', item: '48A EV Charger Kit', category: 'EV', stock: 3, reorder: 4, cost: 418, vendor: 'ChargePoint' },
]

export const reports = [
  { label: 'Revenue this month', value: '$86,420', change: '+18.4%', tone: 'green' },
  { label: 'Outstanding invoices', value: '$14,780', change: '-6.2%', tone: 'yellow' },
  { label: 'Average job margin', value: '42%', change: '+3.1%', tone: 'green' },
  { label: 'Technician utilization', value: '84%', change: '+9.0%', tone: 'blue' },
]

export const payrollRows = employees.map((employee) => ({
  ...employee,
  gross: employee.hours * employee.payRate,
  overtime: employee.hours > 40 ? employee.hours - 40 : 0,
  approved: employee.name !== 'Carlos Mendes',
}))
