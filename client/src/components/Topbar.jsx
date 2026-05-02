// client/src/components/Topbar.jsx
import React, { useEffect, useRef, useState } from 'react'
import {
  Bell,
  Briefcase,
  CalendarPlus,
  ChevronDown,
  FileText,
  Mail,
  Plus,
  PlugZap,
  Search,
  UserPlus,
  X,
} from 'lucide-react'

export default function Topbar() {
  const [quickOpen, setQuickOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setQuickOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function navigate(path) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setQuickOpen(false)
  }

  const quickActions = [
    {
      label: 'Create Invoice',
      description: 'Open invoices and create a demo invoice',
      icon: FileText,
      path: '/invoices',
    },
    {
      label: 'Add Job',
      description: 'Go to job management',
      icon: Briefcase,
      path: '/jobs',
    },
    {
      label: 'Add Employee',
      description: 'Open employee management',
      icon: UserPlus,
      path: '/employees',
    },
    {
      label: 'Open Schedule',
      description: 'Review upcoming service work',
      icon: CalendarPlus,
      path: '/scheduling',
    },
    {
      label: 'Connect QuickBooks',
      description: 'Connect client accounting account',
      icon: PlugZap,
      path: '/integrations/quickbooks',
    },
  ]

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#0f1c2e] focus:bg-white max-sm:w-40"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Mail size={17} />
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell size={17} />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right leading-tight max-sm:hidden">
            <p className="text-xs font-black text-slate-900">Sarah J.</p>
            <p className="text-[10px] font-semibold text-slate-400">Admin</p>
          </div>

          <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
              alt="Admin"
              className="h-full w-full object-cover"
            />
          </div>

          <ChevronDown size={14} className="text-slate-400" />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setQuickOpen((current) => !current)}
            className="flex items-center gap-2 rounded-xl bg-[#0f1c2e] px-4 py-2.5 text-sm font-black text-white hover:bg-[#1a2a3f]"
          >
            Quick action
            {quickOpen ? (
              <X size={17} className="rounded-md bg-white/10 p-0.5" />
            ) : (
              <Plus size={17} className="rounded-md bg-white/10 p-0.5" />
            )}
          </button>

          {quickOpen && (
            <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-black text-slate-900">Quick Actions</p>
                <p className="text-xs text-slate-500">
                  Jump into the most used manager workflows.
                </p>
              </div>

              <div className="p-2">
                {quickActions.map((action) => {
                  const Icon = action.icon

                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => navigate(action.path)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50"
                    >
                      <div className="rounded-xl bg-[#fff5bf] p-2">
                        <Icon size={17} className="text-[#0f1c2e]" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {action.label}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}