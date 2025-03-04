"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart, User, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { checkOnlineStatus } from "@/lib/serviceWorkerRegistration"
import { useEffect, useState } from "react"

const Navbar = () => {
  const pathname = usePathname()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(checkOnlineStatus())
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/stats", icon: BarChart, label: "Stats" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe-bottom">
      <div className="relative">
        {/* Network Status Indicator */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background rounded-full p-1 shadow-lg border border-border">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-primary" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
        </div>

        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center space-y-1 w-full py-2 transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive && "font-semibold"
                )}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
