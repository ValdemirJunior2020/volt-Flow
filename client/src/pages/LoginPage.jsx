// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\pages\LoginPage.jsx
import React, { useState } from 'react'
import { Loader2, LockKeyhole, Mail, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email || !password) {
      setMessage('Email and password are required.')
      return
    }

    try {
      setWorking(true)
      setMessage('')

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name || email,
            },
          },
        })

        if (error) throw error

        setMessage('Account created. Check your email if confirmation is required, then sign in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        window.location.reload()
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1c2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-md">
            <img
              src="/assets/logo.gif?v=2"
              alt="Fildemora Pro"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="mt-5 text-2xl font-black text-[#0f1c2e]">
            Fildemora Pro
          </h1>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Secure command center for field service businesses.
          </p>
        </div>

        {message && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#0f1c2e]"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Email
            </label>
            <div className="relative mt-2">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-[#0f1c2e]"
                placeholder="owner@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Password
            </label>
            <div className="relative mt-2">
              <LockKeyhole
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-[#0f1c2e]"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={working}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {working ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === 'signup' ? (
              <UserPlus size={16} />
            ) : (
              <LockKeyhole size={16} />
            )}
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((current) => (current === 'login' ? 'signup' : 'login'))
            setMessage('')
          }}
          className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
        >
          {mode === 'login'
            ? 'Need an account? Create one'
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}