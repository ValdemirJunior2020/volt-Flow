// client/src/pages/SettingsPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import { Settings, ShieldCheck, Bell, PlugZap, BadgeCheck } from 'lucide-react'

const settingsGroups = [
  {
    title: 'Company Profile',
    description: 'Business name, license number, phone, address, tax settings.',
    fields: ['VoltFlow Electric LLC', 'License EC-13000000', 'Lake Worth, FL'],
  },
  {
    title: 'User Roles',
    description: 'Control who can create jobs, approve payroll, send invoices, and sync QuickBooks.',
    fields: ['Owner', 'Dispatcher', 'Technician', 'Bookkeeper'],
  },
  {
    title: 'Notifications',
    description: 'Email and in-app alerts for overdue invoices, low stock, and urgent service calls.',
    fields: ['Invoice reminders enabled', 'Low stock alerts enabled', 'Daily dispatch digest'],
  },
  {
    title: 'Integrations',
    description: 'QuickBooks Online is connected from the Integrations page. Webhooks are ready for future upgrade.',
    fields: ['QuickBooks Online', 'Webhook placeholder', 'API logs'],
  },
]

export default function SettingsPage() {
  function goToBranding() {
    window.history.pushState({}, '', '/company-branding')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Control company profile, permissions, notifications, and integration preferences."
        primaryLabel="Save Settings"
        secondaryLabel="Audit Log"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Settings} label="Configured modules" value="12" sub="All sidebar pages active" />
        <KpiCard icon={ShieldCheck} label="Security mode" value="On" sub="Backend secrets protected" />
        <KpiCard icon={Bell} label="Alerts" value="8" sub="Operational triggers" />
        <KpiCard icon={PlugZap} label="Integrations" value="1" sub="QuickBooks ready" />
      </div>

      <section className="rounded-2xl border border-[#f5d000]/50 bg-[#fff9d6] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#0f1c2e] p-3">
              <BadgeCheck className="text-[#f5d000]" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#0f1c2e]">
                Premium Company Branding
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                Let subscribed users upload their own company logo and personalize invoices after
                paying the $150 subscription.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToBranding}
            className="rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white hover:bg-[#1a2a3f]"
          >
            Open Branding Settings
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {settingsGroups.map((group) => (
          <section key={group.title} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h2 className="font-black text-slate-900">{group.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{group.description}</p>

            <div className="mt-4 space-y-2">
              {group.fields.map((field) => (
                <div
                  key={field}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {field}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}