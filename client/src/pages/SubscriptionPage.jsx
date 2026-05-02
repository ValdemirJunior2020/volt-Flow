// client/src/pages/SubscriptionPage.jsx
import React, { useEffect, useRef, useState } from 'react'
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
  const paypalContainerRef = useRef(null)

  const [subscription, setSubscription] = useState(null)
  const [paypalConfig, setPayPalConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [paypalLoaded, setPayPalLoaded] = useState(false)

  useEffect(() => {
    loadSubscriptionPage()
  }, [])

  useEffect(() => {
    if (!paypalConfig?.clientId || !paypalConfig?.planId) return
    if (subscription?.active) return

    loadPayPalScript()
  }, [paypalConfig, subscription])

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

  function loadPayPalScript() {
    if (window.paypal) {
      renderPayPalButtons()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&vault=true&intent=subscription`
    script.async = true
    script.onload = () => {
      setPayPalLoaded(true)
      renderPayPalButtons()
    }
    script.onerror = () => {
      setMessage('Unable to load PayPal checkout. Check your PayPal client ID.')
    }

    document.body.appendChild(script)
  }

  function renderPayPalButtons() {
    if (!window.paypal || !paypalContainerRef.current || !paypalConfig?.planId) return

    paypalContainerRef.current.innerHTML = ''

    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        },

        createSubscription(data, actions) {
          return actions.subscription.create({
            plan_id: paypalConfig.planId,
          })
        },

        async onApprove(data) {
          try {
            setWorking(true)
            setMessage('Confirming your PayPal subscription...')

            const result = await subscriptionService.confirmSubscription(data.subscriptionID)

            setSubscription(result.subscription)
            setMessage('Subscription active. Full software access is unlocked.')
          } catch (error) {
            setMessage(error.message || 'Unable to confirm subscription.')
          } finally {
            setWorking(false)
          }
        },

        onCancel() {
          setMessage('PayPal subscription was cancelled before approval.')
        },

        onError(error) {
          console.error(error)
          setMessage('PayPal checkout failed. Please try again.')
        },
      })
      .render(paypalContainerRef.current)
  }

  async function handleCancelSubscription() {
    try {
      setWorking(true)
      setMessage('Cancelling subscription...')

      const result = await subscriptionService.cancel()

      setSubscription(result.subscription)
      setMessage('Subscription cancelled.')
    } catch (error) {
      setMessage(error.message || 'Unable to cancel subscription.')
    } finally {
      setWorking(false)
    }
  }

  async function handleDemoActivate() {
    try {
      setWorking(true)

      const result = await subscriptionService.activateDemo()

      setSubscription(result.subscription)
      setMessage('Demo subscription activated for testing.')
    } catch (error) {
      setMessage(error.message || 'Unable to activate demo subscription.')
    } finally {
      setWorking(false)
    }
  }

  const isActive = subscription?.active || subscription?.status === 'ACTIVE'

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Billing"
        title="Fieldora Pro Subscription"
        description="Unlock full software access with the $150/month Fieldora Pro subscription."
        primaryLabel={isActive ? 'Active Plan' : 'Subscribe'}
        secondaryLabel="Refresh Status"
        onPrimaryClick={() => window.scrollTo({ top: 350, behavior: 'smooth' })}
        onSecondaryClick={loadSubscriptionPage}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={isActive ? CheckCircle2 : XCircle}
          label="Access"
          value={isActive ? 'Unlocked' : 'Locked'}
          sub="Full software access"
        />
        <KpiCard
          icon={CreditCard}
          label="Plan"
          value="$150/mo"
          sub="Monthly subscription"
        />
        <KpiCard
          icon={Crown}
          label="Features"
          value="Premium"
          sub="Jobs, payroll, reports, exports"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Provider"
          value="PayPal"
          sub="Subscription billing"
        />
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
            <p className="text-xs font-bold uppercase text-slate-400">Current Plan</p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {isActive ? 'Fieldora Pro Active' : 'Fieldora Pro Locked'}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Full access includes invoices, payroll command center, employee management,
              reports, exports, company branding, and optional QuickBooks accounting sync.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">Subscription Status</p>
              <p className="mt-1 text-sm text-slate-600">
                Status:{' '}
                <span className="font-black text-[#0f1c2e]">
                  {loading ? 'Loading...' : subscription?.status || 'INACTIVE'}
                </span>
              </p>

              {subscription?.subscriptionId && (
                <p className="mt-1 text-xs text-slate-500">
                  PayPal ID: {subscription.subscriptionId}
                </p>
              )}

              {subscription?.nextBillingTime && (
                <p className="mt-1 text-xs text-slate-500">
                  Next billing: {subscription.nextBillingTime}
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
                <h3 className="text-xl font-black text-[#0f1c2e]">$150/month</h3>
                <p className="text-sm font-semibold text-slate-600">
                  Cancel anytime through PayPal.
                </p>
              </div>
            </div>

            {!isActive && (
              <div className="mt-5">
                {!paypalConfig?.clientId || !paypalConfig?.planId ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    Missing PayPal config. Add PAYPAL_CLIENT_ID and PAYPAL_PLAN_ID on the backend.
                  </div>
                ) : (
                  <div ref={paypalContainerRef} />
                )}

                {working && (
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDemoActivate}
                  disabled={working}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-60"
                >
                  Activate Demo Subscription
                </button>
              </div>
            )}

            {isActive && (
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={working}
                className="mt-5 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 disabled:opacity-60"
              >
                {working ? 'Working...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}