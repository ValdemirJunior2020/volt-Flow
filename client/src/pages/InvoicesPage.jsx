// client/src/pages/InvoicesPage.jsx
import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import StatusBadge from '../components/business/StatusBadge'
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Plus,
  Send,
  X,
} from 'lucide-react'
import { quickbooksService } from '../services/quickbooksService'

const DEFAULT_COMPANY_PROFILE = {
  companyName: 'VOLT PRO SERVICE CORP.',
  tagline: 'Electrical Residential & Commercial',
  phone: '(561) 555-0100',
  email: 'billing@voltproservice.com',
  address: 'Lake Worth, FL',
  license: 'Licensed & Insured',
  logoUrl: '/assets/volt-logo.png',
}

const demoInvoice = {
  id: 'INV-1001',
  customer: 'Palm Beach Dental',
  customerEmail: 'office@pbdental.com',
  customerPhone: '(561) 555-0181',
  job: 'JOB-1001',
  serviceAddress: '820 Lake Ave, Lake Worth, FL',
  technician: 'Mike Rodriguez',
  issueDate: 'May 01, 2026',
  due: 'May 15, 2026',
  status: 'Draft',
  qb: 'Not Synced',
  notes: 'Panel upgrade service completed. Includes labor, materials, and permit support.',
  lineItems: [
    {
      name: 'Electrical Labor',
      description: 'Master electrician labor - panel upgrade',
      quantity: 6,
      rate: 95,
    },
    {
      name: '200 AMP Panel',
      description: 'Main electrical panel and installation materials',
      quantity: 1,
      rate: 1250,
    },
    {
      name: 'Permit / Inspection Support',
      description: 'Permit documentation and inspection coordination',
      quantity: 1,
      rate: 180,
    },
  ],
}

function calculateSubtotal(invoice) {
  return invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)
}

function calculateTax(invoice) {
  return calculateSubtotal(invoice) * 0.07
}

function calculateTotal(invoice) {
  return calculateSubtotal(invoice) + calculateTax(invoice)
}

export default function InvoicesPage() {
  const [companyProfile, setCompanyProfile] = useState(DEFAULT_COMPANY_PROFILE)
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [syncingInvoiceId, setSyncingInvoiceId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const savedProfile = localStorage.getItem('voltflow_company_profile')

    if (savedProfile) {
      setCompanyProfile(JSON.parse(savedProfile))
    } else {
      localStorage.setItem('voltflow_company_profile', JSON.stringify(DEFAULT_COMPANY_PROFILE))
    }
  }, [])

  const totals = useMemo(() => {
    const outstanding = invoices
      .filter((invoice) => invoice.status !== 'Paid')
      .reduce((sum, invoice) => sum + calculateTotal(invoice), 0)

    return {
      total: invoices.length,
      outstanding,
      overdue: invoices.filter((invoice) => invoice.status === 'Overdue').length,
      synced: invoices.filter((invoice) => invoice.qb === 'Synced').length,
    }
  }, [invoices])

  function handleCreateDemoInvoice() {
    setInvoices([demoInvoice])
    setSelectedInvoice(demoInvoice)
    setMessage('Demo invoice created. You can now preview it or sync it to QuickBooks.')
  }

  async function handleSyncInvoice(invoice) {
    try {
      setSyncingInvoiceId(invoice.id)
      setMessage('Syncing invoice with QuickBooks...')

      const payload = {
        localId: invoice.id,
        customerName: invoice.customer,
        customerEmail: invoice.customerEmail,
        customerPhone: invoice.customerPhone,
        jobId: invoice.job,
        serviceAddress: invoice.serviceAddress,
        technician: invoice.technician,
        dueDate: invoice.due,
        notes: invoice.notes,
        lineItems: invoice.lineItems.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        })),
        subtotal: calculateSubtotal(invoice),
        tax: calculateTax(invoice),
        total: calculateTotal(invoice),
      }

      await quickbooksService.createInvoice(payload)

      setInvoices((currentInvoices) =>
        currentInvoices.map((item) =>
          item.id === invoice.id
            ? {
                ...item,
                qb: 'Synced',
                status: 'Sent',
              }
            : item
        )
      )

      setSelectedInvoice((currentInvoice) =>
        currentInvoice?.id === invoice.id
          ? {
              ...currentInvoice,
              qb: 'Synced',
              status: 'Sent',
            }
          : currentInvoice
      )

      setMessage('Invoice synced to QuickBooks successfully.')
    } catch (error) {
      setMessage(
        error.message ||
          'QuickBooks sync failed. Make sure the backend is running and QuickBooks is connected.'
      )
    } finally {
      setSyncingInvoiceId(null)
    }
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Accounting"
        title="Invoices"
        description="Create invoices from electrician jobs, preview them, and sync them to QuickBooks."
        primaryLabel="New Invoice"
        secondaryLabel="Export PDF"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={FileText} label="Total invoices" value={totals.total} sub="Created in this platform" />
        <KpiCard
          icon={Send}
          label="Outstanding"
          value={`$${totals.outstanding.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          sub="Open balance"
        />
        <KpiCard icon={AlertTriangle} label="Overdue" value={totals.overdue} sub="Needs follow-up" />
        <KpiCard icon={CheckCircle2} label="QuickBooks synced" value={totals.synced} sub="Sent to QBO" />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('failed') || message.toLowerCase().includes('error')
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Invoice Center</h2>
            <p className="text-xs text-slate-500">
              Create, preview, send, sync, and reconcile invoices.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateDemoInvoice}
            className="rounded-xl bg-[#f5d000] px-4 py-2 text-sm font-black text-[#0f1c2e] flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Create Demo Invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText className="text-slate-500" size={30} />
            </div>

            <h3 className="text-lg font-black text-slate-900">No invoices yet</h3>

            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              Your platform needs a local invoice before QuickBooks can sync anything. Click
              <span className="font-bold text-slate-700"> Create Demo Invoice </span>
              to see how an electrician invoice will look.
            </p>

            <button
              type="button"
              onClick={handleCreateDemoInvoice}
              className="mt-5 rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white"
            >
              Create Demo Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Invoice</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Job</th>
                  <th className="px-5 py-3 text-left">Due</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">QBO</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-black text-slate-900">{invoice.id}</td>
                    <td className="px-5 py-4 text-slate-700 font-semibold">{invoice.customer}</td>
                    <td className="px-5 py-4 text-slate-500">{invoice.job}</td>
                    <td className="px-5 py-4 text-slate-500">{invoice.due}</td>
                    <td className="px-5 py-4">
                      <StatusBadge>{invoice.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge>{invoice.qb}</StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right font-black text-slate-900">
                      $
                      {calculateTotal(invoice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(invoice)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Preview
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSyncInvoice(invoice)}
                          disabled={syncingInvoiceId === invoice.id || invoice.qb === 'Synced'}
                          className="rounded-lg bg-[#f5d000] px-3 py-2 text-xs font-black text-[#0f1c2e] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {syncingInvoiceId === invoice.id && <Loader2 size={14} className="animate-spin" />}
                          {invoice.qb === 'Synced' ? 'Synced' : 'Sync QBO'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedInvoice && (
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Invoice Preview
              </p>
              <h2 className="text-xl font-black text-slate-900">{selectedInvoice.id}</h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedInvoice(null)}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#0f1c2e] p-2">
                    <img
                      src={companyProfile.logoUrl || '/assets/volt-logo.png'}
                      alt="Company logo"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#0f1c2e]">
                      {companyProfile.companyName}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">{companyProfile.tagline}</p>
                    <p className="mt-2 text-sm text-slate-500">{companyProfile.address}</p>
                    <p className="text-sm text-slate-500">{companyProfile.phone}</p>
                    <p className="text-sm text-slate-500">{companyProfile.email}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <h4 className="text-xl font-black text-slate-900">INVOICE</h4>
                  <p className="text-sm text-slate-500">{selectedInvoice.id}</p>
                  <p className="text-sm text-slate-500">Issue Date: {selectedInvoice.issueDate}</p>
                  <p className="text-sm text-slate-500">Due Date: {selectedInvoice.due}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Bill To</p>
                  <p className="mt-2 font-black text-slate-900">{selectedInvoice.customer}</p>
                  <p className="text-sm text-slate-500">{selectedInvoice.customerEmail}</p>
                  <p className="text-sm text-slate-500">{selectedInvoice.customerPhone}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Job Details</p>
                  <p className="mt-2 font-black text-slate-900">{selectedInvoice.job}</p>
                  <p className="text-sm text-slate-500">{selectedInvoice.serviceAddress}</p>
                  <p className="text-sm text-slate-500">
                    Technician: {selectedInvoice.technician}
                  </p>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="py-3 text-left">Service</th>
                      <th className="py-3 text-right">Qty</th>
                      <th className="py-3 text-right">Rate</th>
                      <th className="py-3 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedInvoice.lineItems.map((item) => (
                      <tr key={item.name} className="border-b border-slate-100">
                        <td className="py-4">
                          <p className="font-black text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </td>
                        <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                        <td className="py-4 text-right text-slate-600">
                          ${item.rate.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-black text-slate-900">
                          ${(item.quantity * item.rate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>
                      $
                      {calculateSubtotal(selectedInvoice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax 7%</span>
                    <span>
                      $
                      {calculateTax(selectedInvoice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-black text-slate-900">
                    <span>Total</span>
                    <span>
                      $
                      {calculateTotal(selectedInvoice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-[#0f1c2e] p-4 text-white">
                <p className="text-sm font-bold">Notes</p>
                <p className="mt-1 text-sm text-slate-200">{selectedInvoice.notes}</p>
              </div>

              <p className="mt-5 text-center text-xs font-semibold text-slate-500">
                {companyProfile.license}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}