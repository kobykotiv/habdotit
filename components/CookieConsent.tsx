"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex justify-between items-center">
      <p className="text-sm">This site uses cookies for essential functionality and anonymized analytics.</p>
      <Button onClick={handleAccept}>Accept</Button>
    </div>
  )
}

export default CookieConsent

