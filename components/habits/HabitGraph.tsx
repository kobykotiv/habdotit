import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HabitGraph = ({ habits }) => {
  const data = useMemo(() => {
    const labels = habits.map(habit => habit.name);
    const datasets = [
      {
        label: 'Completion Rate',
        data: habits.map(habit => {
          const totalDays = Object.keys(habit.logs).length;
          const completedDays = Object.values(habit.logs).filter(log => log).length;
          return (completedDays / totalDays) * 100;
        }),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ];
    return { labels, datasets };
  }, [habits]);

  const options = useMemo(() => ({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`,
        },
      },
    },
  }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Completion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default HabitGraph;
