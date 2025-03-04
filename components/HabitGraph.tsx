"use client"

import { Habit } from '../lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HabitGraphProps {
  habit: Habit;
}

const HabitGraph = ({ habit }: HabitGraphProps) => {
  const data = Object.entries(habit.logs)
    .map(([date, completed]) => ({
      date,
      completed: completed ? 1 : 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="completed" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default HabitGraph
