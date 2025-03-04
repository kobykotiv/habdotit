"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Brain, Clock, Calendar, TrendingUp } from 'lucide-react'
import { analyzeHabitPatterns, type HabitPattern } from '@/lib/habitAnalysis'
import type { Habit } from '@/lib/types'

interface HabitInsightsProps {
  habits: Habit[]
}

export function HabitInsights({ habits }: HabitInsightsProps) {
  const [insights, setInsights] = useState<HabitPattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const patterns = await analyzeHabitPatterns(habits)
        setInsights(patterns)
      } catch (error) {
        console.error('Error analyzing habits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [habits])

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analyzing your habits...</CardTitle>
            <CardDescription>Using AI to find patterns in your habit data</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((pattern) => (
        <Card key={pattern.habitId}>
          <CardHeader>
            <CardTitle className="text-lg">{pattern.habitName}</CardTitle>
            <CardDescription>AI-powered habit analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Best Time</p>
                  <p className="text-sm text-muted-foreground">
                    Most consistent during the {pattern.timeOfDay}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Best Day</p>
                  <p className="text-sm text-muted-foreground">
                    Highest success rate on {pattern.dayOfWeek}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Consistency</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={pattern.consistency * 100}
                      className="h-2"
                    />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(pattern.consistency * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Success Prediction</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={pattern.predictedSuccess * 100}
                      className="h-2"
                    />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(pattern.predictedSuccess * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {insights.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Insights Available</CardTitle>
            <CardDescription>
              Keep tracking your habits to get AI-powered insights about your patterns
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
