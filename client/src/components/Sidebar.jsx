// client/src/components/Sidebar.jsx
import React from 'react'
import {
  LayoutDashboard, Briefcase, Calendar, FileText,
  Users, UserCog, DollarSign, Package, BarChart2, Settings, Zap, PlugZap, ScrollText
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Calendar, label: 'Scheduling', path: '/scheduling' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: UserCog, label: 'Employees', path: '/employees' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
  { icon: Package, label: 'Materials', path: '/materials' },
  { icon: BarChart2, label: 'Reports', path: '/reports' },
  { icon: PlugZap, label: 'Integrations', path: '/integrations/quickbooks' },
  { icon: ScrollText, label: 'Sync Logs', path: '/sync-logs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar({ currentPath, onNavigate }) {
  return (
    <aside className="w-44 min-h-screen bg-[#0f1c2e] flex flex-col fixed left-0 top-0 z-30 max-lg:w-full max-lg:min-h-0 max-lg:h-auto max-lg:relative">
      <div className="flex items-center gap-2 px-4 py-5 max-lg:py-3">
        <div className="bg-[#f5d000] rounded-md p-1.5">
          <Zap size={16} className="text-[#0f1c2e]" fill="#0f1c2e" />
        </div>
        <span className="text-white font-bold text-base tracking-tight">VoltFlow</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 mt-2 flex-1 max-lg:flex-row max-lg:overflow-x-auto max-lg:mt-0 max-lg:pb-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = currentPath === path || (path !== '/' && currentPath.startsWith(path))
          return (
            <button
              key={label}
              onClick={() => onNavigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left whitespace-nowrap max-lg:w-auto
                ${active
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a2a3f]'
                }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
