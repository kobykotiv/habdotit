"use client"

import { useEffect, useRef } from "react"
import Cookies from "js-cookie"

const CarbonAds = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (Cookies.get("cookieConsent") !== "true") return

    const script = document.createElement("script")
    script.src = "//cdn.carbonads.com/carbon.js?serve=CESDK53J&placement=examplecom"
    script.id = "_carbonads_js"
    script.async = true
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return <div ref={containerRef} className="mb-4" />
}

export default CarbonAds

