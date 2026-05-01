// client/src/App.jsx
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

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(path) {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
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
    if (currentPath === '/settings' || currentPath === '/settings/integrations') return <SettingsPage />
    return <Dashboard />
  }, [currentPath])

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] font-sans max-lg:flex-col">
      <Sidebar currentPath={currentPath} onNavigate={navigate} />

      <div className="ml-44 flex-1 flex flex-col max-lg:ml-0">
        <Topbar />
        <main className="pt-14 flex-1 overflow-auto max-lg:pt-0">
          {content}
        </main>
      </div>
    </div>
  )
}
