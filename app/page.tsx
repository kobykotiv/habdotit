import HabitTracker from "@/components/HabitTracker"
import Navbar from "@/components/Navbar"
import CarbonAds from "@/components/CarbonAds"
import CookieConsent from "@/components/CookieConsent"
import { DATA_SOVEREIGNTY_MESSAGE } from "@/lib/constants"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <CarbonAds />
        <div className="max-w-2xl mx-auto px-4 py-2 text-sm text-center text-gray-600">{DATA_SOVEREIGNTY_MESSAGE}</div>
        <HabitTracker />
      </main>
      <Navbar />
      <CookieConsent />
    </div>
  )
}

