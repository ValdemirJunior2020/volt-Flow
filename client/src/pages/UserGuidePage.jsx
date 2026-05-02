// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\pages\UserGuidePage.jsx
import React from 'react'
import {
  BookOpen,
  ExternalLink,
  FileText,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'

const DOC_EDIT_URL =
  'https://docs.google.com/document/d/19xw-bx5mpUrjMU40_3h0ZIVi81RPVW76adRuYOotZvU/edit?usp=sharing'

const DOC_PREVIEW_URL =
  'https://docs.google.com/document/d/19xw-bx5mpUrjMU40_3h0ZIVi81RPVW76adRuYOotZvU/preview'

export default function UserGuidePage() {
  function openGuide() {
    window.open(DOC_EDIT_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader
        eyebrow="Help Center"
        title="Fildemora Pro User Guide"
        description="A simple company-friendly guide explaining how to use Fildemora Pro, what each feature does, and how teams can manage daily operations."
        primaryLabel="Open Full Guide"
        secondaryLabel="Back to Dashboard"
        onPrimaryClick={openGuide}
        onSecondaryClick={() => {
          window.history.pushState({}, '', '/')
          window.dispatchEvent(new PopStateEvent('popstate'))
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={BookOpen}
          label="Guide"
          value="User Manual"
          sub="Easy company instructions"
        />
        <KpiCard
          icon={FileText}
          label="Format"
          value="Document"
          sub="Viewable inside the app"
        />
        <KpiCard
          icon={HelpCircle}
          label="Support"
          value="Q&A"
          sub="Common questions answered"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Access"
          value="Team Ready"
          sub="Useful for managers and staff"
        />
      </div>

      <section className="rounded-3xl border border-[#f5d000]/50 bg-[#fff9d6] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#0f1c2e] p-3">
              <Lightbulb className="text-[#f5d000]" size={26} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#0f1c2e]">
                New to Fildemora Pro?
              </h2>

              <p className="mt-1 max-w-4xl text-sm font-semibold text-slate-700">
                This guide helps your company understand how to use the dashboard,
                jobs, scheduling, customers, invoices, employees, payroll previews,
                reports, branding, and QuickBooks connection in one place.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openGuide}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white hover:bg-[#1a2a3f]"
          >
            <ExternalLink size={16} />
            Open in Google Docs
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              Embedded Guide
            </p>
            <h2 className="text-lg font-black text-slate-900">
              Fildemora Pro Company User Guide
            </h2>
          </div>

          <button
            type="button"
            onClick={openGuide}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-100"
          >
            <ExternalLink size={15} />
            Open Larger
          </button>
        </div>

        <div className="h-[78vh] bg-slate-100">
          <iframe
            title="Fildemora Pro User Guide"
            src={DOC_PREVIEW_URL}
            className="h-full w-full border-0"
          />
        </div>
      </section>
    </div>
  )
}