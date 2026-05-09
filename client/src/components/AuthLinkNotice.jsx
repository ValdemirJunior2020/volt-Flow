// C:\Users\User\Desktop\meus projetos\volt-Flow\client\src\components\AuthLinkNotice.jsx

import React, { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

function getAuthErrorMessage() {
  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))

  const error =
    searchParams.get('error') ||
    hashParams.get('error') ||
    ''

  const errorCode =
    searchParams.get('error_code') ||
    hashParams.get('error_code') ||
    ''

  const errorDescription =
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    ''

  const fullErrorText = `${error} ${errorCode} ${errorDescription}`.toLowerCase()

  if (
    fullErrorText.includes('expired') ||
    fullErrorText.includes('otp_expired') ||
    fullErrorText.includes('invalid') ||
    fullErrorText.includes('access_denied')
  ) {
    return 'Your confirmation link has expired or is no longer valid. Please sign up again or request a new confirmation email.'
  }

  return ''
}

export default function AuthLinkNotice() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const authMessage = getAuthErrorMessage()

    if (authMessage) {
      setMessage(authMessage)

      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  if (!message) {
    return null
  }

  return (
    <div className="fixed left-1/2 top-5 z-[9999] w-[92%] max-w-xl -translate-x-1/2 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <AlertTriangle size={18} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-black text-amber-900">
            Confirmation link expired
          </p>

          <p className="mt-1 text-sm font-semibold leading-relaxed text-amber-800">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMessage('')}
          className="rounded-lg p-1 text-amber-700 hover:bg-amber-100"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  )
}