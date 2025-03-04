"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Zap } from "lucide-react"
import { QUICK_START_HABITS } from "@/lib/constants"
import type { HabitSuggestion } from "@/lib/habitSuggestions"

interface QuickStartProps {
  onSelect: (habit: HabitSuggestion) => void
}

export function QuickStart({ onSelect }: QuickStartProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Start
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4" onClick={() => onSelect(QUICK_START_HABITS[0])}>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">Most Popular</h3>
                  <p className="text-sm text-muted-foreground">Start with proven habits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4" onClick={() => onSelect(QUICK_START_HABITS[1])}>
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-medium">Recommended</h3>
                  <p className="text-sm text-muted-foreground">Personalized for you</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_START_HABITS.slice(2).map((habit: HabitSuggestion) => (
            <Button
              key={habit.name}
              variant="outline"
              className="text-sm"
              onClick={() => onSelect(habit)}
            >
              {habit.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}