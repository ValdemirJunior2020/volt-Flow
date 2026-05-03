// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\App.jsx
import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import JobsPage from './pages/JobsPage'
import SchedulingPage from './pages/SchedulingPage'
import InvoicesPage from './pages/InvoicesPage'
import CustomersPage from './pages/CustomersPage'
import EmployeesPage from './pages/EmployeesPage'
import PayrollPage from './pages/PayrollPage'
import MaterialsPage from './pages/MaterialsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import QuickBooksPage from './pages/QuickBooksPage'
import SyncLogsPage from './pages/SyncLogsPage'
import CompanyBrandingPage from './pages/CompanyBrandingPage'
import SubscriptionPage from './pages/SubscriptionPage'
import UserGuidePage from './pages/UserGuidePage'
import LoginPage from './pages/LoginPage'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      setSession(currentSession)
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      setAuthLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(window.location.pathname)
    }

    function syncProStatus() {
      const localPaid = localStorage.getItem('voltflow_subscription_active') === 'true'
      const localDemo = localStorage.getItem('fieldora_pro_active') === 'true'

      setIsPro(localPaid || localDemo)
    }

    syncProStatus()

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('storage', syncProStatus)
    window.addEventListener('focus', syncProStatus)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('storage', syncProStatus)
      window.removeEventListener('focus', syncProStatus)
    }
  }, [])

  function navigate(path) {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const content = useMemo(() => {
    if (currentPath === '/' || currentPath === '/dashboard') return <Dashboard />
    if (currentPath === '/jobs') return <JobsPage />
    if (currentPath === '/scheduling') return <SchedulingPage />
    if (currentPath === '/invoices') return <InvoicesPage />
    if (currentPath === '/customers') return <CustomersPage />
    if (currentPath === '/employees') return <EmployeesPage />
    if (currentPath === '/payroll') return <PayrollPage />
    if (currentPath === '/materials') return <MaterialsPage />
    if (currentPath === '/reports') return <ReportsPage />
    if (currentPath === '/integrations/quickbooks') return <QuickBooksPage />
    if (currentPath === '/sync-logs') return <SyncLogsPage />
    if (currentPath === '/company-branding') return <CompanyBrandingPage />
    if (currentPath === '/subscription' || currentPath === '/pricing') return <SubscriptionPage />
    if (currentPath === '/user-guide' || currentPath === '/help') return <UserGuidePage />
    if (currentPath === '/settings' || currentPath === '/settings/integrations') return <SettingsPage />

    return <Dashboard />
  }, [currentPath])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1c2e] flex items-center justify-center text-white font-black">
        Loading Fildemora Pro...
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <Sidebar currentPath={currentPath} onNavigate={navigate} isPro={isPro} />

      <div className="ml-56 flex min-h-screen flex-col max-lg:ml-0">
        <Topbar
          isPro={isPro}
          user={session.user}
          onLogout={handleLogout}
          onNavigate={navigate}
        />

        <div className="px-4 sm:px-5 pt-4">
          <div className="rounded-2xl border border-[#f5d000]/40 bg-[#fff9d6] px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-black uppercase tracking-wide text-[#9a6a00]">
                    Fildemora Pro
                  </p>

                  {isPro && (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-green-700 border border-green-200">
                      Pro Active
                    </span>
                  )}
                </div>

                <h2 className="mt-1 text-xl font-black text-[#0f1c2e]">
                  The complete command center for field service businesses.
                </h2>

                <p className="mt-1 max-w-4xl text-sm font-semibold text-slate-700">
                  Manage jobs, scheduling, customers, invoices, employees, payroll previews,
                  reports, company branding, and optional QuickBooks accounting sync from one
                  professional platform.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1">
                  <img
                    src="/assets/logo.gif?v=2"
                    alt="Fildemora Pro"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-[#0f1c2e]">Fildemora Pro</p>

                    {isPro && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-green-700 border border-green-200">
                        Pro
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-500">Secure Business OS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="pt-4 flex-1 overflow-auto">{content}</main>
      </div>
    </div>
  )
}