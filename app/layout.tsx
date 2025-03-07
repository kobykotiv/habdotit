import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Habit Tracker PWA",
  description: "Track your daily habits and build streaks",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
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
          <ServiceWorkerRegistration />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
