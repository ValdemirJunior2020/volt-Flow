// C:\Users\User\Desktop\meus projetos\volt-Flow\client\src\pages\CustomersPage.jsx

import React, { useMemo, useState } from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import {
  Building2,
  Home,
  Mail,
  Plus,
  Star,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react'
import { customers as mockCustomers } from '../data/mockBusinessData'

const emptyCustomerForm = {
  name: '',
  type: 'Residential',
  phone: '',
  email: '',
  lastJob: '',
  balance: '',
  status: 'Active',
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(emptyCustomerForm)

  const totals = useMemo(() => {
    const balance = customers.reduce(
      (sum, customer) => sum + Number(customer.balance || 0),
      0
    )

    return {
      commercial: customers.filter((customer) => customer.type === 'Commercial').length,
      residential: customers.filter((customer) => customer.type === 'Residential').length,
      balance,
      vip: customers.filter((customer) => customer.status === 'VIP').length,
    }
  }, [customers])

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function openAddCustomerModal() {
    setMessage('')
    setFormData(emptyCustomerForm)
    setShowAddModal(true)
  }

  function handleAddCustomer(event) {
    event.preventDefault()

    if (!formData.name.trim()) {
      setMessage('Customer name is required.')
      return
    }

    if (!formData.phone.trim()) {
      setMessage('Customer phone is required.')
      return
    }

    const newCustomer = {
      name: formData.name.trim(),
      type: formData.type,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      lastJob: formData.lastJob.trim() || 'No job added yet',
      balance: Number(formData.balance || 0),
      status: formData.status,
    }

    setCustomers((currentCustomers) => [newCustomer, ...currentCustomers])
    setFormData(emptyCustomerForm)
    setShowAddModal(false)
    setMessage(`${newCustomer.name} was added successfully.`)
  }

  function handleDeleteCustomer(customerEmail, customerName) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customerName}? This action cannot be undone.`
    )

    if (!confirmed) return

    setCustomers((currentCustomers) =>
      currentCustomers.filter((customer) => customer.email !== customerEmail)
    )

    setMessage(`${customerName} was deleted successfully.`)
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          eyebrow="CRM"
          title="Customers"
          description="Manage residential and commercial customers, contact history, balances, and QuickBooks customer sync."
        />

        <button
          type="button"
          onClick={openAddCustomerModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#162b48]"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            message.toLowerCase().includes('required')
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Building2}
          label="Commercial"
          value={totals.commercial}
          sub="Business accounts"
        />

        <KpiCard
          icon={Home}
          label="Residential"
          value={totals.residential}
          sub="Home service customers"
        />

        <KpiCard
          icon={WalletCards}
          label="Open balance"
          value={`$${totals.balance.toLocaleString()}`}
          sub="Total receivables"
        />

        <KpiCard
          icon={Mail}
          label="VIP accounts"
          value={totals.vip}
          sub="High-value relationships"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {customers.map((customer, index) => {
          const customerKey = customer.email || `${customer.name}-${index}`

          return (
            <article
              key={customerKey}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900">{customer.name}</h3>
                  <p className="text-xs text-slate-500">{customer.type}</p>
                </div>

                <StatusBadge>{customer.status}</StatusBadge>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>{customer.phone}</p>
                <p className="truncate">{customer.email || 'No email added'}</p>
                <p>
                  Last job:{' '}
                  <span className="font-semibold text-slate-800">
                    {customer.lastJob}
                  </span>
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Current balance</p>
                <p className="font-black text-slate-900">
                  ${Number(customer.balance || 0).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCustomer(customer.email, customer.name)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={15} />
                Delete Customer
              </button>
            </article>
          )
        })}

        {customers.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Star className="text-slate-500" size={30} />
            </div>

            <h3 className="text-lg font-black text-slate-900">No customers found</h3>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              Click Add Customer to create your first customer.
            </p>

            <button
              type="button"
              onClick={openAddCustomerModal}
              className="mt-5 rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white"
            >
              Add Customer
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Add Customer</h2>
                <p className="text-xs font-semibold text-slate-500">
                  Add a new residential or commercial customer profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Example: Palm Beach Dental"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                    Customer Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Example: (561) 555-0181"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Example: customer@email.com"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                  Last Job
                </label>

                <input
                  type="text"
                  name="lastJob"
                  value={formData.lastJob}
                  onChange={handleInputChange}
                  placeholder="Example: Panel Upgrade"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                    Current Balance
                  </label>

                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-slate-500">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  >
                    <option value="Active">Active</option>
                    <option value="VIP">VIP</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#162b48]"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}