// client/src/pages/QuickBooksPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock3, CloudCog, FileText, Loader2, PlugZap, RefreshCw, ShieldCheck, Unplug, XCircle } from 'lucide-react'
import { quickbooksService } from '../services/quickbooksService'

const emptyInvoice = {
  customerName: 'Bright Home Services',
  customerEmail: 'billing@example.com',
  jobId: 'JOB-1004',
  technician: 'Mike R.',
  serviceDate: new Date().toISOString().slice(0, 10),
  taxRate: 0.07,
  lines: [
    { name: 'Electrical service labor', description: 'Panel diagnostic and repair', quantity: 2, unitPrice: 125, type: 'labor' },
    { name: 'Breaker materials', description: 'Replacement breaker and connectors', quantity: 1, unitPrice: 95, type: 'materials' },
  ],
}

function StatusBadge({ status }) {
  const styles = {
    connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    disconnected: 'bg-slate-50 text-slate-600 border-slate-200',
    token_expired: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
  }

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${styles[status] || styles.disconnected}`}>{status?.replace('_', ' ') || 'disconnected'}</span>
}

export default function QuickBooksPage() {
  const [status, setStatus] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [notice, setNotice] = useState(null)

  const connected = status?.status === 'connected'
  const maskedRealm = useMemo(() => {
    if (!status?.realmId) return 'Not connected'
    return `${status.realmId.slice(0, 4)}••••${status.realmId.slice(-4)}`
  }, [status])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [statusPayload, logPayload] = await Promise.all([
        quickbooksService.getStatus(),
        quickbooksService.getSyncLogs({ limit: 5 }),
      ])
      setStatus(statusPayload.data)
      setLogs(logPayload.data.items || [])
    } catch (error) {
      setNotice({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function runAction(name, handler) {
    setActionLoading(name)
    setNotice(null)
    try {
      const result = await handler()
      setNotice({ type: 'success', message: result.message || `${name} completed successfully.` })
      await loadData()
    } catch (error) {
      setNotice({ type: 'error', message: error.message })
    } finally {
      setActionLoading('')
    }
  }

  async function connectQuickBooks() {
    await runAction('connect', async () => {
      const payload = await quickbooksService.getConnectUrl()
      window.location.href = payload.data.authorizationUrl
      return { message: 'Redirecting to QuickBooks...' }
    })
  }

  const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Settings / Integrations</p>
          <h1 className="text-2xl font-bold text-slate-900">QuickBooks Online</h1>
          <p className="text-sm text-slate-500 mt-1">Connect VoltFlow invoices, customers, payments, jobs, labor, and materials to QuickBooks Online.</p>
        </div>
        <button onClick={loadData} className={`${buttonBase} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50`}>
          <RefreshCw size={14} /> Refresh status
        </button>
      </div>

      {notice && (
        <div className={`rounded-xl border p-4 text-sm font-medium ${notice.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {notice.message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <PlugZap size={22} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">QuickBooks Online Connection</h2>
                <p className="text-xs text-slate-500">OAuth 2.0 secure backend-only token flow</p>
              </div>
            </div>
            {loading ? <Loader2 className="animate-spin text-slate-400" size={20} /> : <StatusBadge status={status?.status} />}
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 font-semibold">Company</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{status?.companyName || 'Not connected'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 font-semibold">Realm ID</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{maskedRealm}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 font-semibold">Last Sync</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{status?.lastSyncAt ? new Date(status.lastSyncAt).toLocaleString() : 'Never'}</p>
            </div>
          </div>

          <div className="px-5 pb-5 flex flex-wrap gap-2">
            {!connected ? (
              <button disabled={!!actionLoading} onClick={connectQuickBooks} className={`${buttonBase} bg-[#0f1c2e] text-white hover:bg-[#1a2a3f]`}>
                {actionLoading === 'connect' ? <Loader2 size={14} className="animate-spin" /> : <PlugZap size={14} />} Connect to QuickBooks
              </button>
            ) : (
              <button disabled={!!actionLoading} onClick={() => runAction('disconnect', quickbooksService.disconnect)} className={`${buttonBase} bg-rose-50 text-rose-700 hover:bg-rose-100`}>
                {actionLoading === 'disconnect' ? <Loader2 size={14} className="animate-spin" /> : <Unplug size={14} />} Disconnect
              </button>
            )}
            <button disabled={!!actionLoading} onClick={() => runAction('refresh-token', quickbooksService.refreshToken)} className={`${buttonBase} bg-amber-50 text-amber-700 hover:bg-amber-100`}>
              <Clock3 size={14} /> Refresh Token
            </button>
            <button disabled={!!actionLoading} onClick={() => runAction('test', quickbooksService.testConnection)} className={`${buttonBase} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}>
              <ShieldCheck size={14} /> Test Connection
            </button>
          </div>
        </section>

        <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-900">Sync Actions</h3>
          <p className="text-xs text-slate-500 mt-1">Run manual syncs and create a sample invoice in QuickBooks.</p>
          <div className="mt-4 space-y-2">
            <button disabled={!!actionLoading} onClick={() => runAction('customers', () => quickbooksService.syncCustomers('from-qbo'))} className={`${buttonBase} w-full bg-slate-900 text-white hover:bg-slate-800`}><CloudCog size={14} /> Sync Customers</button>
            <button disabled={!!actionLoading} onClick={() => runAction('invoices', () => quickbooksService.syncInvoices('from-qbo'))} className={`${buttonBase} w-full bg-slate-900 text-white hover:bg-slate-800`}><FileText size={14} /> Sync Invoices</button>
            <button disabled={!!actionLoading} onClick={() => runAction('payments', quickbooksService.syncPayments)} className={`${buttonBase} w-full bg-slate-900 text-white hover:bg-slate-800`}><CheckCircle2 size={14} /> Sync Payments</button>
            <button disabled={!!actionLoading} onClick={() => runAction('create-invoice', () => quickbooksService.createInvoice(emptyInvoice))} className={`${buttonBase} w-full bg-[#f5d000] text-[#0f1c2e] hover:bg-yellow-300`}><FileText size={14} /> Create Invoice in QuickBooks</button>
          </div>
        </aside>
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Recent Sync History</h2>
            <p className="text-xs text-slate-500">Latest QuickBooks API activity</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Time</th>
                <th className="px-5 py-3 text-left">Action</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="4" className="px-5 py-6 text-center text-slate-400">No sync logs yet.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-5 py-3 font-semibold text-slate-800">{log.action}</td>
                  <td className="px-5 py-3">{log.status === 'success' ? <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 size={14}/> success</span> : <span className="inline-flex items-center gap-1 text-rose-700"><XCircle size={14}/> {log.status}</span>}</td>
                  <td className="px-5 py-3 text-slate-500">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
