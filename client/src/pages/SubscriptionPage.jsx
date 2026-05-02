// client/src/pages/SubscriptionPage.jsx
import React, { useEffect, useState } from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import {
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { subscriptionService } from '../services/subscriptionService'

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState(null)
  const [paypalConfig, setPayPalConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSubscriptionPage()
    captureReturnPayment()
  }, [])

  async function captureReturnPayment() {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const paypalSuccess = params.get('paypal')

    if (!token || paypalSuccess !== 'success') return

    try {
      setWorking(true)
      setMessage('Confirming PayPal payment...')

      const result = await subscriptionService.captureOrder(token)

      setSubscription(result.subscription)
      setMessage('Payment complete. Full access unlocked for 4 months.')

      window.history.replaceState({}, '', '/subscription')
    } catch (error) {
      setMessage(error.message || 'Unable to confirm PayPal payment.')
    } finally {
      setWorking(false)
    }
  }

  async function loadSubscriptionPage() {
    try {
      setLoading(true)

      const [statusResult, configResult] = await Promise.all([
        subscriptionService.getStatus(),
        subscriptionService.getPayPalConfig(),
      ])

      setSubscription(statusResult.subscription)
      setPayPalConfig(configResult.config)
    } catch (error) {
      setMessage(error.message || 'Unable to load subscription status.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePayWithPayPal() {
    try {
      setWorking(true)
      setMessage('Creating secure PayPal checkout...')

      const result = await subscriptionService.createOrder()

      if (!result.order?.approvalLink) {
        throw new Error('PayPal approval link was not returned.')
      }

      window.location.href = result.order.approvalLink
    } catch (error) {
      setMessage(error.message || 'Unable to start PayPal checkout.')
    } finally {
      setWorking(false)
    }
  }

  async function handleCancelAccess() {
    try {
      setWorking(true)
      setMessage('Cancelling access...')

      const result = await subscriptionService.cancel()

      setSubscription(result.subscription)
      setMessage('Access cancelled.')
    } catch (error) {
      setMessage(error.message || 'Unable to cancel access.')
    } finally {
      setWorking(false)
    }
  }

  async function handleDemoActivate() {
    try {
      setWorking(true)

      const result = await subscriptionService.activateDemo()

      setSubscription(result.subscription)
      setMessage('Demo access activated for 4 months.')
    } catch (error) {
      setMessage(error.message || 'Unable to activate demo access.')
    } finally {
      setWorking(false)
    }
  }

  const isActive = subscription?.active || subscription?.status === 'ACTIVE'

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Billing"
        title="Fieldora Pro Access"
        description="Unlock full software access with a one-time $500 payment for 4 months."
        primaryLabel={isActive ? 'Access Active' : 'Pay $500'}
        secondaryLabel="Refresh Status"
        onPrimaryClick={isActive ? loadSubscriptionPage : handlePayWithPayPal}
        onSecondaryClick={loadSubscriptionPage}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={isActive ? CheckCircle2 : XCircle}
          label="Access"
          value={isActive ? 'Unlocked' : 'Locked'}
          sub="Full software access"
        />
        <KpiCard icon={CreditCard} label="Payment" value="$500" sub="One-time payment" />
        <KpiCard icon={Crown} label="Access Length" value="4 Months" sub="Expires automatically" />
        <KpiCard icon={ShieldCheck} label="Provider" value="PayPal" sub="Secure checkout" />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('failed') ||
            message.toLowerCase().includes('unable') ||
            message.toLowerCase().includes('cancelled')
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Current Access</p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {isActive ? 'Fieldora Pro Active' : 'Fieldora Pro Locked'}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Full access includes jobs, invoices, payroll command center, employees,
              reports, exports, company branding, and optional QuickBooks accounting sync.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">Access Status</p>

              <p className="mt-1 text-sm text-slate-600">
                Status:{' '}
                <span className="font-black text-[#0f1c2e]">
                  {loading ? 'Loading...' : subscription?.status || 'INACTIVE'}
                </span>
              </p>

              {subscription?.orderId && (
                <p className="mt-1 text-xs text-slate-500">
                  PayPal Order: {subscription.orderId}
                </p>
              )}

              {subscription?.expiresAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Expires: {new Date(subscription.expiresAt).toLocaleString()}
                </p>
              )}

              {isActive && (
                <p className="mt-1 text-xs font-black text-green-700">
                  Days remaining: {subscription.daysRemaining}
                </p>
              )}
            </div>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-[#f5d000]/50 bg-[#fff9d6] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#0f1c2e] p-3">
                {isActive ? (
                  <CheckCircle2 className="text-[#f5d000]" size={24} />
                ) : (
                  <Lock className="text-[#f5d000]" size={24} />
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-[#0f1c2e]">$500</h3>
                <p className="text-sm font-semibold text-slate-600">
                  One-time payment for 4 months full access.
                </p>
              </div>
            </div>

            {!isActive && (
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={handlePayWithPayPal}
                  disabled={working}
                  className="w-full rounded-xl bg-[#f5d000] px-5 py-3 text-sm font-black text-[#0f1c2e] disabled:opacity-60"
                >
                  {working ? 'Opening PayPal...' : 'Pay $500 with PayPal'}
                </button>

                <button
                  type="button"
                  onClick={handleDemoActivate}
                  disabled={working}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-60"
                >
                  Activate Demo Access
                </button>
              </div>
            )}

            {isActive && (
              <button
                type="button"
                onClick={handleCancelAccess}
                disabled={working}
                className="mt-5 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 disabled:opacity-60"
              >
                {working ? 'Working...' : 'Cancel Access'}
              </button>
            )}

            {working && (
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}