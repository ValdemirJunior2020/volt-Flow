// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\components\Sidebar.jsx
import React from 'react'
import {
  BadgeCheck,
  BarChart2,
  BookOpen,
  Briefcase,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Package,
  PlugZap,
  ScrollText,
  Settings,
  UserCog,
  Users,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CreditCard, label: 'Subscription', path: '/subscription' },
  { icon: BookOpen, label: 'User Guide', path: '/user-guide', special: 'guide' },
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
  { icon: BadgeCheck, label: 'Branding', path: '/company-branding' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar({ currentPath, onNavigate, isPro }) {
  return (
    <aside className="w-56 min-h-screen bg-[#0f1c2e] flex flex-col fixed left-0 top-0 z-30 max-lg:w-full max-lg:min-h-0 max-lg:h-auto max-lg:relative">
      <div className="flex flex-col items-center justify-center px-3 py-6 max-lg:py-4">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl bg-white p-2 shadow-lg hover:scale-105 transition-transform"
          title="Go to Dashboard"
        >
          <img
            src="/assets/logo.gif?v=2"
            alt="Fildemora Pro"
            className="h-full w-full object-contain"
          />
        </button>

        {isPro && (
          <div className="mt-3 flex items-center justify-center">
            <span className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white shadow-md">
              Pro
            </span>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1 px-2 mt-1 flex-1 max-lg:flex-row max-lg:overflow-x-auto max-lg:mt-0 max-lg:pb-2">
        {navItems.map(({ icon: Icon, label, path, special }) => {
          const active = currentPath === path || (path !== '/' && currentPath.startsWith(path))
          const isUserGuide = special === 'guide'

          let buttonClass =
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-black text-white transition-all w-full text-left whitespace-nowrap max-lg:w-auto'

          if (isUserGuide && active) {
            buttonClass += ' bg-green-700 shadow-md'
          } else if (isUserGuide) {
            buttonClass += ' bg-green-950/70 hover:bg-green-800 border border-green-800/50'
          } else if (active) {
            buttonClass += ' bg-[#1e3a5f] shadow-sm'
          } else {
            buttonClass += ' hover:bg-[#1a2a3f]'
          }

          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(path)}
              className={buttonClass}
            >
              <Icon size={16} className="text-white" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}