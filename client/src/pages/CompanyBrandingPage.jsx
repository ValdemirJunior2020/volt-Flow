// client/src/pages/CompanyBrandingPage.jsx
import React, { useEffect, useState } from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import { Crown, ImagePlus, Lock, Save, Upload, Building2 } from 'lucide-react'

const DEFAULT_COMPANY_PROFILE = {
  companyName: 'Fildemora Pro',
  tagline: 'The complete command center for field service businesses.',
  phone: '(561) 555-0100',
  email: 'billing@fildemorapro.com',
  address: 'Lake Worth, FL',
  license: 'Professional Field Service Management Platform',
  logoUrl: '/assets/logo.png',
}

export default function CompanyBrandingPage() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [profile, setProfile] = useState(DEFAULT_COMPANY_PROFILE)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const savedSubscription = localStorage.getItem('voltflow_subscription_active')
    const savedProfile = localStorage.getItem('voltflow_company_profile')

    setIsSubscribed(savedSubscription === 'true')

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)

      setProfile({
        ...DEFAULT_COMPANY_PROFILE,
        ...parsedProfile,
        logoUrl: parsedProfile.logoUrl || '/assets/logo.png',
      })
    } else {
      localStorage.setItem('voltflow_company_profile', JSON.stringify(DEFAULT_COMPANY_PROFILE))
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }))
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!isSubscribed) {
      setMessage('Logo upload is locked. Activate paid access first.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setProfile((currentProfile) => ({
        ...currentProfile,
        logoUrl: reader.result,
      }))

      setMessage('Logo added. Click Save Branding to apply it to invoices.')
    }

    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!isSubscribed) {
      setMessage('Company branding is locked. Activate paid access first.')
      return
    }

    localStorage.setItem(
      'voltflow_company_profile',
      JSON.stringify({
        ...profile,
        logoUrl: profile.logoUrl || '/assets/logo.png',
      })
    )

    setMessage('Company branding saved. Your invoices will now use this branding.')
  }

  function handleUseDefaultLogo() {
    const updatedProfile = {
      ...profile,
      logoUrl: '/assets/logo.png',
    }

    setProfile(updatedProfile)
    localStorage.setItem('voltflow_company_profile', JSON.stringify(updatedProfile))
    setMessage('Default Fildemora Pro logo restored.')
  }

  function handleActivateDemoSubscription() {
    localStorage.setItem('voltflow_subscription_active', 'true')
    setIsSubscribed(true)
    setMessage('Demo paid access activated for testing. Branding tools are now unlocked.')
  }

  function handleCancelDemoSubscription() {
    localStorage.setItem('voltflow_subscription_active', 'false')
    setIsSubscribed(false)
    setMessage('Demo paid access disabled. Branding tools are locked again.')
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Premium Branding"
        title="Company Branding"
        description="Personalize invoices with your company logo, business name, contact info, license, and branding. If no logo is uploaded, the default Fildemora Pro logo will be used."
        primaryLabel="Premium Feature"
        secondaryLabel="Use Default Logo"
        onSecondaryClick={handleUseDefaultLogo}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Crown}
          label="Access"
          value={isSubscribed ? 'Active' : 'Locked'}
          sub="Paid branding feature"
        />
        <KpiCard
          icon={ImagePlus}
          label="Logo"
          value={profile.logoUrl ? 'Ready' : 'Default'}
          sub="Shown on invoices"
        />
        <KpiCard
          icon={Building2}
          label="Company"
          value={profile.companyName ? 'Set' : 'Missing'}
          sub="Invoice business profile"
        />
        <KpiCard
          icon={Lock}
          label="Customization"
          value={isSubscribed ? 'Unlocked' : 'Paywall'}
          sub="Branding customization"
        />
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.toLowerCase().includes('locked') || message.toLowerCase().includes('disabled')
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {!isSubscribed && (
        <section className="rounded-2xl border border-[#f5d000]/50 bg-[#fff9d6] p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0f1c2e]">
                Unlock Company Personalization
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                Customers can use the platform normally, but custom invoice branding is only
                available after paid access is active. If they do not upload a logo, invoices
                will use the Fildemora Pro logo.
              </p>
            </div>

            <button
              type="button"
              onClick={handleActivateDemoSubscription}
              className="rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white hover:bg-[#1a2a3f]"
            >
              Activate Demo Paid Access
            </button>
          </div>
        </section>
      )}

      {isSubscribed && (
        <section className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-green-800">Premium Branding Active</h2>
              <p className="mt-1 text-sm text-green-700">
                This account can personalize invoices, upload a logo, and save company details.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelDemoSubscription}
              className="rounded-xl border border-green-300 bg-white px-5 py-3 text-sm font-black text-green-700 hover:bg-green-100"
            >
              Disable Demo Paid Access
            </button>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="font-black text-slate-900">Branding Settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            These details will appear on generated invoices.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">Company Logo</label>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={profile.logoUrl || '/assets/logo.png'}
                    alt="Company logo"
                    className="h-full w-full object-contain"
                  />
                </div>

                <label
                  className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black ${
                    isSubscribed
                      ? 'bg-[#f5d000] text-[#0f1c2e]'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Upload size={16} />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleLogoUpload}
                    disabled={!isSubscribed}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleUseDefaultLogo}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Use Fildemora Logo
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Recommended: PNG logo, square or horizontal, transparent background if possible.
              </p>
            </div>

            <Input
              label="Company Name"
              name="companyName"
              value={profile.companyName}
              disabled={!isSubscribed}
              onChange={handleChange}
            />

            <Input
              label="Tagline"
              name="tagline"
              value={profile.tagline}
              disabled={!isSubscribed}
              onChange={handleChange}
            />

            <Input
              label="Phone"
              name="phone"
              value={profile.phone}
              disabled={!isSubscribed}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={profile.email}
              disabled={!isSubscribed}
              onChange={handleChange}
            />

            <Input
              label="Address"
              name="address"
              value={profile.address}
              disabled={!isSubscribed}
              onChange={handleChange}
            />

            <Input
              label="License / Footer Text"
              name="license"
              value={profile.license}
              disabled={!isSubscribed}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black ${
                isSubscribed
                  ? 'bg-[#0f1c2e] text-white hover:bg-[#1a2a3f]'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Save Branding
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="font-black text-slate-900">Invoice Branding Preview</h2>
          <p className="mt-1 text-sm text-slate-500">
            This is how the customer’s company branding will appear on invoices.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#0f1c2e] p-2">
                  <img
                    src={profile.logoUrl || '/assets/logo.png'}
                    alt="Company logo preview"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0f1c2e]">{profile.companyName}</h3>
                  <p className="text-sm font-semibold text-slate-600">{profile.tagline}</p>
                  <p className="mt-2 text-xs text-slate-500">{profile.address}</p>
                  <p className="text-xs text-slate-500">{profile.phone}</p>
                  <p className="text-xs text-slate-500">{profile.email}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-bold uppercase text-slate-400">Invoice</p>
                <p className="text-lg font-black text-slate-900">INV-1001</p>
                <p className="text-xs text-slate-500">Due on receipt</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Field Service Labor</span>
                <span className="font-black text-slate-900">$570.00</span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Materials</span>
                <span className="font-black text-slate-900">$1,250.00</span>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between">
                <span className="text-lg font-black text-slate-900">Total</span>
                <span className="text-lg font-black text-slate-900">$1,947.40</span>
              </div>
            </div>

            <p className="mt-5 text-center text-xs font-semibold text-slate-500">
              {profile.license}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Input({ label, name, value, disabled, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase text-slate-400">{label}</label>
      <input
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none disabled:bg-slate-100 disabled:text-slate-400"
      />
    </div>
  )
}