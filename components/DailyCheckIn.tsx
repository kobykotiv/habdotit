"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { CheckCircle, Circle, Sun, Moon, Sunrise } from 'lucide-react'
import type { Habit } from '../src/types/models'
import { notificationService } from '../src/services/notificationService'

interface DailyCheckInProps {
  habits: Habit[]
}

export function DailyCheckIn({ habits }: DailyCheckInProps) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [completedToday, setCompletedToday] = useState<string[]>([])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    // TODO: Replace with proper habit completion tracking once implemented
    
    setCompletedToday([])
  }, [habits])

  useEffect(() => {
    const checkRiskPeriods = async () => {
      const hour = new Date().getHours();

      // Identify high-risk periods based on category
      const criticalHabits = habits.filter(h =>
        (h.category === "substances-track" || h.category === "substances-recovery") &&
        !completedToday.includes(h.id)
      );

      // Evening/night are often higher risk periods
      if (hour >= 18 && criticalHabits.length > 0) {
        for (const habit of criticalHabits) {
          await notificationService.scheduleNotification({
            id: habit.id,
            name: habit.title,
            message: "Stay strong! Remember your goals."
          });
        }
      }
    };

    checkRiskPeriods();
  }, [habits, completedToday, timeOfDay]);

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise className="h-6 w-6 text-yellow-500" />
      case 'afternoon':
        return <Sun className="h-6 w-6 text-orange-500" />
      case 'evening':
        return <Moon className="h-6 w-6 text-blue-500" />
    }
  }

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good morning!'
      case 'afternoon':
        return 'Good afternoon!'
      case 'evening':
        return 'Good evening!'
    }
  }

  const progress = habits.length > 0 
    ? (completedToday.length / habits.length) * 100
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {getTimeIcon()}
          <div>
            <CardTitle>{getGreeting()}</CardTitle>
            <CardDescription>Here's your daily check-in</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Daily Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-3">
            {habits.map(habit => {
              const isCompleted = completedToday.includes(habit.id)
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={`flex-1 text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                   {habit.title}
                  </span>
                  {!isCompleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0]
                        // Update local state immediately for better UX
                        setCompletedToday(prev => [...prev, habit.id])
                        // Here you would typically also update the habit logs in your storage
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          {habits.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No habits tracked yet. Add some habits to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
