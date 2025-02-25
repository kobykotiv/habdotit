"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import confetti from "canvas-confetti"
import { Share2 } from "lucide-react"

const Stats = () => {
  const [habits, setHabits] = useState([])
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const savedHabits = Cookies.get("habits")
    const savedProfile = Cookies.get("profile")
    if (savedHabits) setHabits(JSON.parse(savedHabits))
    if (savedProfile) setProfile(JSON.parse(savedProfile))
  }, [])

  const getLastQuarterDates = () => {
    const dates = []
    for (let i = 90; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split("T")[0])
    }
    return dates
  }

  const renderGitGraph = () => {
    const dates = getLastQuarterDates()
    return (
      <div className="grid grid-cols-13 gap-1">
        {dates.map((date) => {
          const habitsDone = habits.filter((habit) => habit.logs[date]).length
          let color = "bg-gray-200"
          if (habitsDone > 0) color = profile.color1 || "#ff0000"
          if (habitsDone > 1) color = profile.color2 || "#00ff00"
          if (habitsDone > 2) color = profile.color3 || "#0000ff"
          return <div key={date} className={`w-4 h-4 rounded-sm ${color}`} title={`${date}: ${habitsDone} habits`} />
        })}
      </div>
    )
  }

  const shareStats = () => {
    confetti()
    // Here you would typically generate an image of the stats
    // For now, we'll just encourage a screenshot
    alert("Great job on your habits! Take a screenshot of your progress to share with friends!")
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Habit Stats</CardTitle>
          <CardDescription>See your progress over the last quarter</CardDescription>
        </CardHeader>
        <CardContent>
          {renderGitGraph()}
          <Button onClick={shareStats} className="mt-4">
            <Share2 className="w-4 h-4 mr-2" />
            Share Your Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Stats

