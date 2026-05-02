// client/src/components/business/PageHeader.jsx
import React from 'react'

export default function PageHeader({
  eyebrow,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 text-2xl font-black text-slate-900">{title}</h1>

        {description && (
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {secondaryLabel && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            {secondaryLabel}
          </button>
        )}

        {primaryLabel && (
          <button
            type="button"
            onClick={onPrimaryClick}
            className="rounded-xl bg-[#0f1c2e] px-4 py-2.5 text-sm font-black text-white hover:bg-[#1a2a3f]"
          >
            + {primaryLabel}
          </button>
        )}
      </div>
    </div>
  )
}