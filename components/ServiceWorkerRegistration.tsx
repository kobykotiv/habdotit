"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  registerServiceWorker,
  checkOnlineStatus,
  setupNetworkListeners,
  setupInstallPrompt,
  isPWAInstalled
} from '@/lib/serviceWorkerRegistration'

export function ServiceWorkerRegistration() {
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Register service worker
    registerServiceWorker()

    // Initial online status check
    setIsOnline(checkOnlineStatus())

    // Setup network status listeners
    setupNetworkListeners(
      // Online callback
      () => {
        setIsOnline(true)
        toast({
          title: "You're back online!",
          description: "Your habits will now sync automatically.",
          variant: "default"
        })
      },
      // Offline callback
      () => {
        setIsOnline(false)
        toast({
          title: "You're offline",
          description: "Don't worry - your habits are saved locally and will sync when you're back online.",
          variant: "destructive"
        })
      }
    )

    // Setup installation prompt
    if (!isPWAInstalled()) {
      setupInstallPrompt((showPrompt) => {
        setCanInstall(true)
        toast({
          title: "Install Habit Tracker",
          description: "Install our app for a better experience!",
          action: (
            <button
              onClick={async () => {
                await showPrompt()
                setCanInstall(false)
              }}
              className="rounded bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
            >
              Install
            </button>
          ),
          duration: 10000
        })
      })
    }
  }, [toast])

  return null
}
