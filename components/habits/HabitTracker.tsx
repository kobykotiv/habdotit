import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedHabits = Cookies.get('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const updatedHabits = [...habits, { id: Date.now().toString(), name: newHabit, logs: {} }];
    setHabits(updatedHabits);
    setNewHabit('');
    Cookies.set('habits', JSON.stringify(updatedHabits), { expires: 365 });
    toast({
      title: 'Habit added! 🎉',
      description: 'Your new habit has been added.',
    });
  };

  const toggleHabitLog = (habitId, date) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedLogs = { ...habit.logs, [date]: !habit.logs[date] };
        return { ...habit, logs: updatedLogs };
      }
      return habit;
    });
    setHabits(updatedHabits);
    Cookies.set('habits', JSON.stringify(updatedHabits), { expires: 365 });
  };

  const today = new Date().toISOString().split('T')[0];

  const habitList = useMemo(() => {
    return habits.map((habit) => (
      <div key={habit.id} className="flex items-center justify-between mb-2">
        <span>{habit.name}</span>
        <Button onClick={() => toggleHabitLog(habit.id, today)}>
          {habit.logs[today] ? 'Undo' : 'Complete'}
        </Button>
      </div>
    ));
  }, [habits, today]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Habit Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-habit">New Habit</Label>
            <Input
              id="new-habit"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter a new habit"
            />
            <Button onClick={addHabit} className="mt-2">
              Add Habit
            </Button>
          </div>
          <div>{habitList}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTracker;
