// client/src/pages/QuickBooksPage.jsx
import React, { useEffect, useState } from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Loader2,
  PlugZap,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { quickbooksService } from '../services/quickbooksService'

export default function QuickBooksPage() {
  const [status, setStatus] = useState({
    connected: false,
    companyName: null,
    realmId: null,
    lastSyncAt: null,
  })
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadStatus()
  }, [])

  async function loadStatus() {
    try {
      setLoading(true)
      const result = await quickbooksService.getStatus()
      setStatus(result.status || result)
    } catch (error) {
      setMessage(error.message || 'Unable to load QuickBooks status.')
    } finally {
      setLoading(false)
    }
  }

  function handleConnect() {
    quickbooksService.connect()
  }

  async function handleDisconnect() {
    try {
      setWorking(true)
      await quickbooksService.disconnect()
      setMessage('QuickBooks disconnected.')
      await loadStatus()
    } catch (error) {
      setMessage(error.message || 'Unable to disconnect QuickBooks.')
    } finally {
      setWorking(false)
    }
  }

  async function handleRefreshToken() {
    try {
      setWorking(true)
      await quickbooksService.refreshToken()
      setMessage('QuickBooks token refreshed.')
      await loadStatus()
    } catch (error) {
      setMessage(error.message || 'Unable to refresh QuickBooks token.')
    } finally {
      setWorking(false)
    }
  }

  async function handleSyncCustomers() {
    try {
      setWorking(true)
      await quickbooksService.syncCustomers('from-qbo')
      setMessage('Customers synced from QuickBooks.')
      await loadStatus()
    } catch (error) {
      setMessage(error.message || 'Customer sync failed.')
    } finally {
      setWorking(false)
    }
  }

  async function handleSyncInvoices() {
    try {
      setWorking(true)
      await quickbooksService.syncInvoices('to-qbo')
      setMessage('Invoices synced to QuickBooks.')
      await loadStatus()
    } catch (error) {
      setMessage(error.message || 'Invoice sync failed.')
    } finally {
      setWorking(false)
    }
  }

  function maskRealmId(realmId) {
    if (!realmId) return 'Not connected'
    const value = String(realmId)
    return `${value.slice(0, 4)}••••${value.slice(-4)}`
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Accounting Integration"
        title="QuickBooks Online"
        description="Let each client connect their own QuickBooks company. VoltFlow never exposes client secrets or raw tokens to the browser."
        primaryLabel="Connect QuickBooks"
        secondaryLabel="Refresh Status"
        onPrimaryClick={handleConnect}
        onSecondaryClick={loadStatus}
      />

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 text-blue-700" size={20} />
          <div>
            <h3 className="font-black text-blue-900">Client-Owned QuickBooks Connection</h3>
            <p className="mt-1 text-sm font-semibold text-blue-800">
              Your client clicks Connect QuickBooks, signs in to their own Intuit account,
              chooses their company, and authorizes VoltFlow. Your app stores the connection on
              the backend and uses it only for approved sync actions.
            </p>
          </div>
        </div>
      </section>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('failed') ||
            message.toLowerCase().includes('unable')
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={status.connected ? CheckCircle2 : XCircle}
          label="Connection"
          value={loading ? 'Loading...' : status.connected ? 'Connected' : 'Disconnected'}
          sub="QuickBooks Online"
        />
        <KpiCard
          icon={Building2}
          label="Company"
          value={status.companyName || 'Not connected'}
          sub="Client company"
        />
        <KpiCard
          icon={PlugZap}
          label="Realm ID"
          value={maskRealmId(status.realmId)}
          sub="Masked company ID"
        />
        <KpiCard
          icon={RefreshCcw}
          label="Last Sync"
          value={status.lastSyncAt || 'Never'}
          sub="Latest sync action"
        />
      </div>

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">QuickBooks Connection</h2>
            <p className="mt-1 text-sm text-slate-500">
              Connect, refresh, disconnect, and run manual accounting syncs.
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-black ${
              status.connected
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {status.connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {!status.connected && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 text-amber-700" size={20} />
              <div>
                <h3 className="font-black text-amber-900">QuickBooks Not Connected</h3>
                <p className="mt-1 text-sm font-semibold text-amber-800">
                  Click Connect QuickBooks. Your client will log in with their own Intuit account.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleConnect}
            disabled={working}
            className="rounded-xl bg-[#0f1c2e] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {status.connected ? 'Reconnect QuickBooks' : 'Connect QuickBooks'}
          </button>

          <button
            type="button"
            onClick={handleRefreshToken}
            disabled={!status.connected || working}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-60"
          >
            Refresh Token
          </button>

          <button
            type="button"
            onClick={handleSyncCustomers}
            disabled={!status.connected || working}
            className="rounded-xl bg-[#f5d000] px-4 py-3 text-sm font-black text-[#0f1c2e] disabled:opacity-60"
          >
            Sync Customers
          </button>

          <button
            type="button"
            onClick={handleSyncInvoices}
            disabled={!status.connected || working}
            className="rounded-xl bg-[#f5d000] px-4 py-3 text-sm font-black text-[#0f1c2e] disabled:opacity-60"
          >
            Sync Invoices
          </button>
        </div>

        {status.connected && (
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={working}
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 disabled:opacity-60"
          >
            Disconnect QuickBooks
          </button>
        )}

        {working && (
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Loader2 size={16} className="animate-spin" />
            Working...
          </div>
        )}
      </section>
    </div>
  )
}