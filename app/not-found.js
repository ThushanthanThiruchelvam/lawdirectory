'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const { t } = useTranslation()

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev > 1 ? prev - 1 : 0)
    }, 1000)

    const redirectTimer = setTimeout(() => router.push('/'), 5000)

    return () => {
      clearInterval(countdownInterval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">


        <div className="mb-10">
          <div className="text-8xl font-light text-gray-200 mb-6">404</div>
          <h1 className="text-xl font-normal text-gray-800 mb-4">
            {t('Page Not Found')}
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {t('The page you\'re looking for doesn\'t exist or has been moved.')}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <Link
            href="/"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            {t('Go Home')}
          </Link>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
          >
            {t('Go Back')}
          </button>
        </div>

        <div className="text-xs text-gray-400">
          <p>
            {t('Redirecting in')} <span className="font-medium">{countdown}</span> {t('seconds')}
          </p>
        </div>
      </div>
    </div>
  )
}