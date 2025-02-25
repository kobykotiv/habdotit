"use client"

import { useEffect } from 'react'
import { registerServiceWorker, checkOnlineStatus } from '@/lib/serviceWorkerRegistration'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker()
    checkOnlineStatus()
  }, [])

  return null
}
