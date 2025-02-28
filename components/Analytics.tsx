"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export function Analytics({ habits }: { habits: any[] }) {
  const [stats, setStats] = useState({
    weeklyCompletion: [],
    bestDay: '',
    totalCompletions: 0,
    averageStreak: 0
  })

  useEffect(() => {
    calculateStats()
  }, [habits])

  const calculateStats = () => {
    // Calculate weekly completion rates
    const weeklyData = habits.reduce((acc, habit) => {
      Object.keys(habit.logs).forEach(date => {
        const week = getWeekNumber(new Date(date))
        acc[week] = (acc[week] || 0) + 1
      })
      return acc
    }, {})

    // Find best performing day
    const dayStats = habits.reduce((acc, habit) => {
      Object.keys(habit.logs).forEach(date => {
        const day = new Date(date).getDay()
        acc[day] = (acc[day] || 0) + 1
      })
      return acc
    }, {})

    const bestDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0]?.[0] as string

    setStats({
      weeklyCompletion: Object.entries(weeklyData).map(([week, count]) => ({
        week,
        completions: count
      })),
      bestDay: getDayName(parseInt(bestDay)),
      totalCompletions: Object.values(dayStats).reduce((a, b) => a + b, 0),
      averageStreak: habits.reduce((acc, habit) => acc + habit.currentStreak, 0) / habits.length
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.weeklyCompletion}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completions" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Best Day"
          value={stats.bestDay}
          icon="📅"
        />
        <StatCard
          title="Total Completions"
          value={stats.totalCompletions}
          icon="✅"
        />
        <StatCard
          title="Average Streak"
          value={Math.round(stats.averageStreak)}
          icon="🔥"
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{icon}</span>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getWeekNumber(date: Date): string {
  const startDate = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(days / 7)
  return `Week ${weekNumber}`
}

function getDayName(day: number): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
}
