"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Share2, Activity, Brain } from "lucide-react"
import { DailyCheckIn } from "@/components/DailyCheckIn"
import { HabitInsights } from "@/components/HabitInsights"
import Cookies from "js-cookie"
import confetti from "canvas-confetti"
import { ACHIEVEMENTS, checkAchievements, calculateLevel } from "@/lib/achievements"

const Stats = () => {
  interface Habit {
    id: string;
    name: string;
    logs: { [key: string]: boolean };
  }

  interface Profile {
    color1?: string;
    color2?: string;
    color3?: string;
  }

  const [habits, setHabits] = useState<Habit[]>([])
  const [profile, setProfile] = useState<Profile>({})
  const [achievements, setAchievements] = useState<typeof ACHIEVEMENTS>([])
  const [stats, setStats] = useState({
    totalHabits: 0,
    longestStreak: 0,
    activeHabits: 0,
    points: 0
  })

  useEffect(() => {
    const savedHabits = Cookies.get("habits")
    const savedProfile = Cookies.get("profile")
    
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits)
      setHabits(parsedHabits)
      
      // Calculate stats
      const currentStats = {
        totalHabits: parsedHabits.length,
        longestStreak: calculateLongestStreak(parsedHabits),
        activeHabits: parsedHabits.filter((h: Habit) => hasRecentActivity(h)).length,
        points: 0
      }
      
      // Check achievements and calculate points
      const unlockedAchievements = checkAchievements(currentStats)
      currentStats.points = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
      
      setStats(currentStats)
      setAchievements(unlockedAchievements)
    }
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const hasRecentActivity = (habit: Habit) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    })
    return last7Days.some(date => habit.logs[date])
  }

  const calculateLongestStreak = (habits: Habit[]) => {
    let maxStreak = 0
    habits.forEach(habit => {
      let currentStreak = 0
      let maxHabitStreak = 0
      const dates = Object.keys(habit.logs).sort()
      
      dates.forEach((date, i) => {
        if (habit.logs[date]) {
          currentStreak++
          maxHabitStreak = Math.max(maxHabitStreak, currentStreak)
        } else {
          currentStreak = 0
        }
      })
      
      maxStreak = Math.max(maxStreak, maxHabitStreak)
    })
    return maxStreak
  }

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
      <div className="grid grid-cols-13 gap-1 overflow-x-auto pb-2">
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
    alert("Great job on your habits! Take a screenshot of your progress to share with friends!")
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold">Level {calculateLevel(stats.points)}</h2>
          <p className="text-sm text-muted-foreground">
            {stats.points} XP Total
          </p>
        </div>
        <Button onClick={shareStats} variant="outline" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Your progress over the last quarter</CardDescription>
            </CardHeader>
            <CardContent>
              {renderGitGraph()}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Habits</span>
                  <span>{stats.activeHabits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Longest Streak</span>
                  <span>{stats.longestStreak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Habits</span>
                  <span>{stats.totalHabits}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Unlock more by maintaining your habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = achievements.some(a => a.id === achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        isUnlocked ? 'bg-secondary/50' : 'opacity-50'
                      }`}
                    >
                      <div className="text-2xl mr-3">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">
                          {achievement.points} XP
                        </span>
                        {isUnlocked && (
                          <span className="text-xs text-green-600">Unlocked!</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Stats
