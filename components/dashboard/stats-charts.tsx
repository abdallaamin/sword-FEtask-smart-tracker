"use client";

import { useMemo } from 'react';
import { Habit, HabitLog } from '@/types';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  parseISO,
  isSameDay 
} from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StatsChartsProps {
  habits: Habit[];
  logs: HabitLog[];
  detailed?: boolean;
}

export default function StatsCharts({ 
  habits, 
  logs,
  detailed = false 
}: StatsChartsProps) {
  // Weekly completion data
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return daysOfWeek.map(day => {
      const dayStr = format(day, 'EEE');
      const loggedHabits = habits.map(habit => {
        const isCompleted = logs.some(log => 
          log.habitId === habit.id && 
          isSameDay(parseISO(log.date), day) && 
          log.completed
        );
        
        return {
          name: habit.name,
          completed: isCompleted ? 1 : 0,
        };
      });
      
      const totalCompleted = loggedHabits.reduce((sum, h) => sum + h.completed, 0);
      
      return {
        day: dayStr,
        total: totalCompleted,
        ...loggedHabits.reduce((acc, h) => ({
          ...acc,
          [h.name]: h.completed
        }), {})
      };
    });
  }, [habits, logs]);
  
  // Monthly completion data (simplified for demo)
  const monthlyData = useMemo(() => {
    return [
      { week: 'Week 1', completed: 14, total: 21 },
      { week: 'Week 2', completed: 16, total: 21 },
      { week: 'Week 3', completed: 19, total: 21 },
      { week: 'Week 4', completed: 21, total: 21 },
    ].map(week => ({
      ...week,
      percentage: Math.round((week.completed / week.total) * 100)
    }));
  }, []);
  
  if (!detailed) {
    // Simple view for dashboard
    return (
      <div className="h-[200px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barGap={2}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false}
              fontSize={12}
            />
            <YAxis 
              hide 
              domain={[0, 'dataMax']}
            />
            <Tooltip 
              cursor={false}
              formatter={(value: number) => [
                `${value} habit${value !== 1 ? 's' : ''}`, 
                'Completed'
              ]}
            />
            <Bar 
              dataKey="total" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  // Detailed view
  return (
    <Tabs defaultValue="weekly">
      <TabsList className="mb-4">
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      
      <TabsContent value="weekly" className="h-full">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                allowDecimals={false}
                fontSize={12}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip 
                cursor={false}
                formatter={(value: number, name: string) => [
                  name === 'total' 
                    ? `${value} habit${value !== 1 ? 's' : ''}`
                    : value === 1 ? 'Completed' : 'Not completed', 
                  name === 'total' ? 'Total' : name
                ]}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
                name="Total Completed"
              />
              {habits.length <= 5 && habits.map((habit, index) => (
                <Bar 
                  key={habit.id}
                  dataKey={habit.name}
                  stackId="a"
                  fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={30}
                  name={habit.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly" className="h-full">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barGap={0}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                allowDecimals={false}
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                cursor={false}
                formatter={(value: number, name: string) => [
                  name === 'percentage' ? `${value}%` : value, 
                  name === 'percentage' ? 'Completion Rate' : 
                  name === 'completed' ? 'Habits Completed' : 'Total Habits'
                ]}
              />
              <Legend />
              <Bar 
                dataKey="percentage" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
                name="Completion Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
}