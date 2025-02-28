import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { analyzeHabitPatterns } from '@/lib/habitAnalysis';

const HabitInsights = ({ habits }) => {
  const { toast } = useToast();

  const habitPatterns = useMemo(() => {
    return analyzeHabitPatterns(habits);
  }, [habits]);

  return (
    <div className="space-y-4">
      {habitPatterns.map((pattern) => (
        <Card key={pattern.habitId}>
          <CardHeader>
            <CardTitle>{pattern.habitName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Time of Day: {pattern.timeOfDay}</p>
            <p>Day of Week: {pattern.dayOfWeek}</p>
            <p>Consistency: {Math.round(pattern.consistency * 100)}%</p>
            <p>Predicted Success: {Math.round(pattern.predictedSuccess * 100)}%</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HabitInsights;
