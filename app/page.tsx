'use client';

import HabitTracker from "@/components/HabitTracker"
import Navbar from "@/components/Navbar"
import CarbonAds from "@/components/CarbonAds"
import CookieConsent from "@/components/CookieConsent"
import { DATA_SOVEREIGNTY_MESSAGE } from "@/lib/constants"
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { storage } from '@/lib/storage'
import { useEffect } from 'react'

const addSampleData = () => {
  if (typeof window === 'undefined') return;
  // Sample tasks
  storage.addTask({
    id: '1',
    title: 'Implement Dashboard',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  storage.addTask({
    id: '2',
    title: 'Add Analytics',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Sample assets
  storage.addAsset({
    id: '1',
    name: 'Logo',
    type: 'image',
    tags: ['branding', 'logo'],
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: 'base64data'
  });

  // Sample template
  storage.addTemplate({
    id: '1',
    name: 'Basic Template',
    content: 'Template content',
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

export default function Home() {
  useEffect(() => {
    addSampleData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <CarbonAds />
        <div className="max-w-2xl mx-auto px-4 py-2 text-sm text-center text-gray-600">{DATA_SOVEREIGNTY_MESSAGE}</div>
        <HabitTracker />
        <AnalyticsDashboard />
      </main>
      <Navbar />
      <CookieConsent />
    </div>
  )
}
