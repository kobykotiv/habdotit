import type React from "react"
import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' }
  ]
}

export const metadata: Metadata = {
  title: "Habit Tracker PWA",
  description: "Track your daily habits and build streaks",
  manifest: "/manifest.json",
  applicationName: "Habit Tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habit Tracker",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/icon-192x192.png",
    apple: [
      { url: "/icon-192x192.png" },
      { url: "/icon-512x512.png", sizes: "512x512" }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="pb-[calc(4rem+env(safe-area-inset-bottom))] min-h-screen">
            <ServiceWorkerRegistration />
            {children}
            <Navbar />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
