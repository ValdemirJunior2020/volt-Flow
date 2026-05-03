// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\components\Topbar.jsx
import React, { useEffect, useRef, useState } from 'react'
import {
  Bell,
  BookOpen,
  ChevronDown,
  FileText,
  LogOut,
  Mail,
  Search,
  UserPlus,
} from 'lucide-react'

export default function Topbar({ isPro = false, user, onLogout, onNavigate }) {
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const messagesRef = useRef(null)
  const notificationsRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setMessagesOpen(false)
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function goTo(path) {
    if (typeof onNavigate === 'function') {
      onNavigate(path)
      return
    }

    window.location.href = path
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User'

  const messages = [
    {
      title: 'Welcome to Fildemora Pro',
      text: 'Your business command center is ready.',
    },
    {
      title: 'User Guide Available',
      text: 'Open the User Guide from the sidebar for help.',
    },
  ]

  const notifications = [
    {
      title: 'Payroll Review',
      text: 'Review employee hours before approving payroll.',
    },
    {
      title: 'QuickBooks',
      text: 'Connect QuickBooks to sync invoices and customers.',
    },
    {
      title: 'Branding',
      text: 'Add your company logo after Pro access is active.',
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

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo('/invoices')}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 lg:flex"
        >
          <FileText size={15} />
          Invoices
        </button>

        <button
          type="button"
          onClick={() => goTo('/employees')}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 lg:flex"
        >
          <UserPlus size={15} />
          Employees
        </button>

        <button
          type="button"
          onClick={() => goTo('/user-guide')}
          className="hidden items-center gap-2 rounded-xl bg-green-800 px-3 py-2 text-xs font-black text-white hover:bg-green-700 lg:flex"
        >
          <BookOpen size={15} />
          User Guide
        </button>

        <div className="relative" ref={messagesRef}>
          <button
            type="button"
            onClick={() => {
              setMessagesOpen((current) => !current)
              setNotificationsOpen(false)
              setUserOpen(false)
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="Messages"
          >
            <Mail size={17} />
          </button>

          {messagesOpen && (
            <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl z-50">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-black text-slate-900">Messages</p>
                <p className="text-xs text-slate-500">
                  Helpful updates for your workspace.
                </p>
              </div>

              <div className="p-2">
                {messages.map((message) => (
                  <div
                    key={message.title}
                    className="rounded-xl px-3 py-3 hover:bg-slate-50"
                  >
                    <p className="text-sm font-black text-slate-900">
                      {message.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((current) => !current)
              setMessagesOpen(false)
              setUserOpen(false)
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="Notifications"
          >
            <Bell size={17} />

            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl z-50">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-black text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">
                  Business reminders and important actions.
                </p>
              </div>

              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.title}
                    className="rounded-xl px-3 py-3 hover:bg-slate-50"
                  >
                    <p className="text-sm font-black text-slate-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {notification.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setUserOpen((current) => !current)
              setMessagesOpen(false)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50"
          >
            <div className="text-right leading-tight max-sm:hidden">
              <div className="flex items-center justify-end gap-2">
                <p className="text-xs font-black text-slate-900">{displayName}</p>

                {isPro && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-green-700 border border-green-200">
                    Pro
                  </span>
                )}
              </div>

              <p className="text-[10px] font-semibold text-slate-400">
                {user?.email || 'Signed in'}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#0f1c2e] text-xs font-black text-white">
              {displayName.slice(0, 2).toUpperCase()}
            </div>

            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl z-50">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-black text-slate-900">{displayName}</p>
                <p className="text-xs font-semibold text-slate-500">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-black text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}