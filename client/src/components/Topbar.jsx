// client/src/components/Topbar.jsx
import React from 'react'
import { Search, Mail, Bell, ChevronDown } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="fixed top-0 left-44 right-0 h-14 bg-white border-b border-slate-100 flex items-center px-5 z-20 max-lg:static max-lg:left-0 max-lg:right-0">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-64 max-sm:w-full">
        <Search size={14} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-sm text-slate-600 outline-none placeholder-slate-400 w-full"
        />
      </div>

      <div className="ml-auto flex items-center gap-4 max-sm:hidden">
        <button className="text-slate-500 hover:text-slate-700 transition-colors">
          <Mail size={18} />
        </button>

        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Sarah J.</p>
            <p className="text-[10px] text-slate-400">Admin</p>
          </div>
          <img
            src="https://i.pravatar.cc/32?img=5"
            alt="Sarah J."
            className="w-8 h-8 rounded-full object-cover"
          />
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  )
}
