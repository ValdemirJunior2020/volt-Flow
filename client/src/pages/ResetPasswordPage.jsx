// C:\Users\Valdemir Goncalves\Downloads\Projetos Maio\Fildemora Pro\client\src\pages\ResetPasswordPage.jsx

import React, { useEffect, useState } from 'react'
import { KeyRound, Loader2, LockKeyhole } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function checkRecoverySession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setMessage(
          'Your reset link is expired or invalid. Please request a new password reset link.'
        )
      }

      setReady(true)
    }

    checkRecoverySession()
  }, [])

  async function handleResetPassword(event) {
    event.preventDefault()

    if (!password || !confirmPassword) {
      setMessage('Please enter and confirm your new password.')
      return
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    try {
      setWorking(true)
      setMessage('')

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setMessage('Password updated successfully. Please sign in with your new password.')

      setTimeout(async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
      }, 1500)
    } catch (error) {
      const errorMessage = error.message || 'Unable to update password.'

      if (
        errorMessage.toLowerCase().includes('expired') ||
        errorMessage.toLowerCase().includes('invalid')
      ) {
        setMessage(
          'Your reset link is expired or invalid. Please request a new password reset link.'
        )
      } else {
        setMessage(errorMessage)
      }
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
            Reset Password
          </h1>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Create a new password for your Fildemora Pro account.
          </p>
        </div>

        {message && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {message}
          </div>
        )}

        {!ready ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-black text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Checking reset link...
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                New Password
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
                  placeholder="New password"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <KeyRound
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-[#0f1c2e]"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={working}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f1c2e] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {working ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              Update Password
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  )
}