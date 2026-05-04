// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\pages\SubscriptionPage.jsx

import React, { useEffect, useState } from 'react'
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import { paypalSubscriptionService } from '../services/paypalSubscriptionService'

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
const localPlanId = import.meta.env.VITE_PAYPAL_PLAN_ID

function PayPalSubscriptionBox({
  planId,
  confirming,
  onApproved,
  onErrorMessage,
}) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer()

  if (isPending) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs font-bold text-slate-600">
        <Loader2 size={16} className="animate-spin" />
        Loading PayPal buttons...
      </div>
    )
  }

  if (isRejected) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
        PayPal failed to load. Check that your PayPal Client ID and Plan ID are both Sandbox or both Live.
      </div>
    )
  }

  return (
    <PayPalButtons
      forceReRender={[planId]}
      style={{
        shape: 'rect',
        layout: 'vertical',
        color: 'gold',
        label: 'subscribe',
      }}
      disabled={confirming}
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: planId,
        })
      }}
      onApprove={onApproved}
      onError={(error) => {
        console.error('PayPal subscription error:', error)
        onErrorMessage(
          'PayPal subscription failed. Check that your Client ID and Plan ID are from the same PayPal environment.'
        )
      }}
    />
  )
}

export default function SubscriptionPage() {
  const [planId, setPlanId] = useState(localPlanId || '')
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [message, setMessage] = useState('')
  const [paypalError, setPaypalError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    loadSubscriptionPage()
  }, [])

  async function loadSubscriptionPage() {
    setLoading(true)
    setMessage('')
    setPaypalError('')

    try {
      const configResult = await paypalSubscriptionService.getConfig()
      const finalPlanId = configResult?.planId || localPlanId || ''

      setPlanId(finalPlanId)

      try {
        const subscriptionResult = await paypalSubscriptionService.getMySubscription()
        setSubscription(subscriptionResult.subscription)
      } catch (error) {
        console.warn('Subscription check skipped:', error.message)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Unable to load subscription page:', error)
      setPlanId(localPlanId || '')
      setSubscription(null)
      setMessage(error.message || 'Unable to load subscription information.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubscriptionApproved(data) {
    try {
      setConfirming(true)
      setMessage('Confirming your PayPal subscription...')
      setPaypalError('')

      const result = await paypalSubscriptionService.confirmSubscription(data.subscriptionID)

      setSubscription({
        status: 'active',
        amount: 70,
        currency: 'USD',
        paypalSubscriptionId: data.subscriptionID,
        trialEndsAt: result.company?.subscription_trial_ends_at,
        nextBillingAt: result.paypalSubscription?.nextBillingAt,
      })

      window.dispatchEvent(new Event('fildemora:subscription-updated'))

      setMessage(
        'Success! Your $20 first-week access is active. After the first week, your plan continues at $70/month.'
      )
    } catch (error) {
      setMessage(error.message || 'Subscription confirmation failed.')
    } finally {
      setConfirming(false)
    }
  }

  async function handleCancelSubscription() {
    const confirmed = window.confirm(
      'Are you sure you want to cancel your Fildemora Pro subscription?'
    )

    if (!confirmed) return

    try {
      setCancelling(true)
      setMessage('Cancelling your subscription...')
      setPaypalError('')

      await paypalSubscriptionService.cancelSubscription()
      await loadSubscriptionPage()
      window.dispatchEvent(new Event('fildemora:subscription-updated'))
      setMessage('Subscription cancelled successfully.')
    } catch (error) {
      setMessage(error.message || 'Unable to cancel subscription.')
    } finally {
      setCancelling(false)
    }
  }

  const isActive = subscription?.status === 'active'

  if (!paypalClientId) {
    return (
      <div className="p-4 sm:p-5">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-black text-red-700">
          Missing VITE_PAYPAL_CLIENT_ID in client .env.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Subscription"
        title="Fildemora Pro Access"
        description="Start with $20 for the first week. After that, continue with full Pro access for $70/month."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={CreditCard}
          label="First Week"
          value="$20"
          sub="7-day starter access"
        />
        <KpiCard
          icon={BadgeCheck}
          label="After First Week"
          value="$70/mo"
          sub="Monthly Pro access"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Payment"
          value="PayPal"
          sub="Secure checkout"
        />
        <KpiCard
          icon={Lock}
          label="Premium Tools"
          value={isActive ? 'Unlocked' : 'Locked'}
          sub="Based on subscription"
        />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('success') ||
            message.toLowerCase().includes('active')
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}
        >
          {message}
        </div>
      )}

      {paypalError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {paypalError}
        </div>
      )}

      <section className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-green-700">
              <Sparkles size={15} />
              Starter + Pro Plan
            </div>

            <h2 className="mt-5 text-3xl font-black text-[#0f1c2e]">
              $20 first week, then $70/month
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              Give your company one week to try Fildemora Pro for $20. After the first week,
              the subscription continues automatically at $70 per month.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Company dashboard',
                'Employee and payroll tools',
                'Invoice and customer tools',
                'Company branding',
                'Reports and exports',
                'QuickBooks integration access',
                'User guide and business workflow support',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8 xl:border-l xl:border-t-0">
            {loading && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
                <Loader2 size={18} className="animate-spin" />
                Checking current subscription...
              </div>
            )}

            {isActive ? (
              <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-green-600 p-3">
                    <BadgeCheck className="text-white" size={26} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-green-900">Pro is active</h3>
                    <p className="text-sm font-semibold text-green-700">
                      Your company has premium access.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700">
                  <p><strong>First week:</strong> $20</p>
                  <p><strong>After first week:</strong> $70/month</p>
                  <p><strong>Status:</strong> Active</p>

                  {subscription?.paypalSubscriptionId && (
                    <p><strong>PayPal ID:</strong> {subscription.paypalSubscriptionId}</p>
                  )}

                  {subscription?.trialEndsAt && (
                    <p>
                      <strong>First week ends:</strong>{' '}
                      {new Date(subscription.trialEndsAt).toLocaleDateString()}
                    </p>
                  )}

                  {subscription?.nextBillingAt && (
                    <p>
                      <strong>Next billing:</strong>{' '}
                      {new Date(subscription.nextBillingAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="mt-5 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? 'Cancelling Subscription...' : 'Cancel Subscription'}
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-black text-[#0f1c2e]">
                  Start Fildemora Pro
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Pay $20 for the first week. Continue at $70/month after that.
                </p>

                <div className="mt-4 rounded-2xl bg-[#fff9d6] border border-[#f5d000]/50 p-4">
                  <p className="text-sm font-black text-[#0f1c2e]">Plan ID</p>
                  <p className="mt-1 break-all text-xs font-semibold text-slate-600">
                    {planId || 'Missing PayPal Plan ID'}
                  </p>
                </div>

                {!planId ? (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                    Missing PayPal Plan ID. Add VITE_PAYPAL_PLAN_ID to your client .env and PAYPAL_PLAN_ID to your server .env.
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4">
                      <p className="text-sm font-black text-slate-900">
                        Pay with PayPal
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        The PayPal subscription buttons should appear below.
                      </p>
                    </div>

                    <PayPalScriptProvider
                      options={{
                        'client-id': paypalClientId,
                        vault: true,
                        intent: 'subscription',
                        currency: 'USD',
                        components: 'buttons',
                      }}
                    >
                      <PayPalSubscriptionBox
                        planId={planId}
                        confirming={confirming}
                        onApproved={handleSubscriptionApproved}
                        onErrorMessage={setPaypalError}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}

                {confirming && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Activating your subscription...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}