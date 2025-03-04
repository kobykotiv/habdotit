"use client"

import { useState, useEffect, useCallback } from "react"
import { PlusCircle, CheckCircle, XCircle, Flame, Trophy, TrendingUp, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import HabitGraph from "@/components/HabitGraph"
import StreakWidget from "@/components/StreakWidget"
import Tutorial from "@/components/Tutorial"
import { HABIT_CATEGORIES, FREQUENCY_OPTIONS } from "../lib/constants"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/ThemeToggle"
import { scheduleHabitReminder } from "@/lib/pushNotifications"
import { checkAchievements } from "@/lib/achievements"
import { Analytics } from "@/components/Analytics"
import { ShareModal } from "@/components/ShareModal"
import { AccessibilityMenu } from "@/components/AccessibilityMenu"
import { requestHealthKitPermissions } from "@/lib/healthKit"
import { Habit, Achievement, Profile, getDaysSinceCreation } from "@/lib/utils"
import { ShareModalStats, ShareModalProps } from "@/lib/types"

interface NewHabitData {
  name: string;
  category: string;
  frequency: string;
  reminderTime: string;
  notes: string;
  createdAt: string;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState<NewHabitData>({
    name: "",
    category: "health-positive",
    frequency: "daily",
    reminderTime: "09:00",
    notes: "",
    createdAt: new Date().toISOString(),
  })
  const [showTutorial, setShowTutorial] = useState(false)
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile>({})
  const { theme } = useTheme()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [healthSync, setHealthSync] = useState(false)

  useEffect(() => {
    const loadHabits = () => {
      const savedHabits = Cookies.get("habits")
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits))
      }
    }

    loadHabits()

    // Check if it's the user's first visit
    const isFirstVisit = !Cookies.get("hasVisitedBefore")
    if (isFirstVisit) {
      setShowTutorial(true)
      Cookies.set("hasVisitedBefore", "true", { expires: 365 })
    }
    const savedProfile = Cookies.get("profile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  useEffect(() => {
    Cookies.set("habits", JSON.stringify(habits), { expires: 365 })
  }, [habits])

  useEffect(() => {
    const stats = {
      totalHabits: habits.length,
      longestStreak: Math.max(...habits.map(h => h.longestStreak)),
      activeHabits: habits.filter(h => h.currentStreak > 0).length
    }
    
    const earned = checkAchievements(stats)
    setAchievements(earned)
  }, [habits])

  useEffect(() => {
    const initHealthKit = async () => {
      const hasPermission = await requestHealthKitPermissions()
      setHealthSync(hasPermission)
    }
    initHealthKit()
  }, [])

  const addHabit = async () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        ...newHabit,
        logs: {},
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        points: 0,
      }
      setHabits([...habits, habit])
      
      // Schedule reminder if time is set
      if (newHabit.reminderTime) {
        await scheduleHabitReminder(habit)
      }
      
      setNewHabit({
        name: "",
        category: "health-positive",
        frequency: "daily",
        reminderTime: "09:00",
        notes: "",
        createdAt: new Date().toISOString(),
      })
      setShowAddForm(false)
      toast({
        title: "Habit added! 🎉",
        description: "Keep up the good work!",
      })
    }
  }

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]

    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const newLogs = { ...habit.logs }
          if (newLogs[today]) {
            delete newLogs[today]
          } else {
            newLogs[today] = true
          }

          let currentStreak = 0
          let longestStreak = habit.longestStreak
          const checkDate = new Date()

          while (true) {
            const dateStr = checkDate.toISOString().split("T")[0]
            if (newLogs[dateStr]) {
              currentStreak++
              checkDate.setDate(checkDate.getDate() - 1)
            } else {
              break
            }
          }

          if (currentStreak > longestStreak) {
            longestStreak = currentStreak
          }

          return {
            ...habit,
            logs: newLogs,
            currentStreak,
            longestStreak,
          }
        }
        return habit
      })
    )
    toast({
      title: "Habit updated! 💪",
      description: "Great job staying consistent!",
    })
    checkNewAchievements()
  }

  const checkNewAchievements = () => {
    const stats = {
      totalHabits: habits.length,
      longestStreak: Math.max(...habits.map(h => h.longestStreak)),
      activeHabits: habits.filter(h => h.currentStreak > 0).length
    }
    
    const earned = checkAchievements(stats)
    const newAchievements = earned.filter(
      a => !achievements.find(existing => existing.id === a.id)
    )
    
    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        toast({
          title: `🎉 Achievement Unlocked!`,
          description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
          duration: 5000
        })
      })
    }
    
    setAchievements(earned)
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId))
    toast({
      title: "Habit deleted",
      description: "Don't worry, you can always add it back later!",
    })
  }

  const exportToJson = useCallback(() => {
    const dataStr = JSON.stringify(habits, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "habits.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data exported! 📤",
      description: "Your habits data has been saved as a JSON file.",
    })
  }, [habits, toast])

  const remindBackup = useCallback(() => {
    toast({
      title: "Time for a backup! 💾",
      description: "It's been a while since your last backup. Click to export your data now.",
      action: <Button onClick={exportToJson}>Backup Now</Button>,
      duration: 10000,
    })
  }, [toast, exportToJson])

  useEffect(() => {
    const backupInterval = setInterval(remindBackup, 7 * 24 * 60 * 60 * 1000)
    return () => clearInterval(backupInterval)
  }, [remindBackup])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-primary">🌟 Habit Tracker</CardTitle>
            <div className="flex gap-2">
              <AccessibilityMenu />
              <ThemeToggle />
            </div>
          </div>
          <CardDescription className="text-lg">Track your daily habits and build streaks</CardDescription>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)} className="w-full text-lg">
              <PlusCircle className="w-5 h-5 mr-2" />
              Track New Habit
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-lg">Category</Label>
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {HABIT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.emoji} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="habit-name" className="text-lg">Habit Name</Label>
                <Input
                  id="habit-name"
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Enter habit to track..."
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="frequency" className="text-lg">Frequency</Label>
                <Select
                  value={newHabit.frequency}
                  onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={addHabit} className="flex-1 text-lg">Create</Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1 text-lg">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {habits.map((habit) => {
        const category = HABIT_CATEGORIES.find((c) => c.value === habit.category) as Category | undefined
        const borderColor = habit.category === "substances-track" ? profile.color1 : "border-border"

        return (
          <Card key={habit.id} className={`mb-4 border-2 ${borderColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={habit.logs[new Date().toISOString().split("T")[0]] ? "default" : "outline"}
                    size="icon"
                    onClick={() => toggleHabit(habit.id)}
                    className="w-12 h-12"
                  >
                    <CheckCircle className="w-6 h-6" />
                  </Button>
                  <div>
                    <h3 className="font-medium text-xl">
                      {category?.emoji} {habit.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Flame className="w-4 h-4 mr-1 text-orange-500" />
                        Current: {habit.currentStreak}
                      </span>
                      <span className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                        Best: {habit.longestStreak}
                      </span>
                    </div>
                    <div className={`text-sm mt-1 ${category?.color}`}>
                      {category?.label} • {habit.frequency}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteHabit(habit.id)}>
                  <XCircle className="w-5 h-5 text-red-500" />
                </Button>
              </div>
              <StreakWidget streak={habit.currentStreak} />
              <Progress value={((habit.currentStreak % 7) * 100) / 7} className="mt-2" />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{habit.name} Progress</DialogTitle>
                    <DialogDescription>Your habit tracking journey visualized</DialogDescription>
                  </DialogHeader>
                  <HabitGraph habit={habit} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )
      })}

      <div className="space-y-4 mt-6">
        <ShareModal 
          stats={{
            totalCompletions: habits.reduce((acc, habit) => acc + Object.keys(habit.logs || {}).length, 0),
            totalHabits: habits.length,
            longestStreak: Math.max(...habits.map(h => h.longestStreak || 0)),
          }}
          achievements={achievements}
        />
        <Button onClick={exportToJson} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Backup Habits Data
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Achievements ({achievements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div key={achievement.id} className="text-center p-4 border rounded">
                <span className="text-4xl">{achievement.icon}</span>
                <h3 className="font-bold mt-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <Analytics habits={habits} />
      </div>

      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  )
}

export default HabitTracker
