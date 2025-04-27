import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HabitLog, StatsData } from '@/types';
import { differenceInDays, format, isToday, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { calculateStreak } from '@/lib/habits';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStats(habits: any[], logs: HabitLog[]): StatsData {
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentWeekStart = startOfWeek(new Date());
  const currentWeekEnd = endOfWeek(new Date());
  
  // Total habits
  const totalHabits = habits.length;
  
  // Completed today
  const completedToday = logs.filter(log => 
    log.date === today && log.completed
  ).length;
  
  // Total completed this week
  const thisWeekLogs = logs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= currentWeekStart && 
           logDate <= currentWeekEnd && 
           log.completed;
  });
  const totalCompletedThisWeek = thisWeekLogs.length;
  
  // Calculate longest streak across all habits
  let longestStreak = 0;
  if (habits.length > 0) {
    // Get streak for each habit and find the maximum
    const streaks = habits.map(habit => calculateStreak(habit.id));
    longestStreak = Math.max(...streaks);
  }
  
  // Completion rate
  const totalPossibleCompletions = totalHabits * 7; // Last 7 days
  const totalActualCompletions = logs.filter(log => {
    const logDate = parseISO(log.date);
    const daysDifference = differenceInDays(new Date(), logDate);
    return daysDifference <= 7 && log.completed;
  }).length;
  
  const completionRate = totalPossibleCompletions > 0 
    ? (totalActualCompletions / totalPossibleCompletions) * 100 
    : 0;
  
  return {
    totalHabits,
    completedToday,
    totalCompletedThisWeek,
    longestStreak,
    completionRate
  };
}

export function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    '#0ea5e9': 'bg-blue-500 text-white',
    '#10b981': 'bg-emerald-500 text-white',
    '#8b5cf6': 'bg-violet-500 text-white',
    '#f59e0b': 'bg-amber-500 text-white',
    '#ef4444': 'bg-red-500 text-white',
    '#ec4899': 'bg-pink-500 text-white',
    '#64748b': 'bg-slate-500 text-white',
  };
  
  return colorMap[color] || 'bg-gray-500 text-white';
}

export function getContrastText(color: string): string {
  return 'text-white';
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return format(d, 'MMM d, yyyy');
}

export function formatDateShort(date: string): string {
  const d = new Date(date);
  return format(d, 'EEE');
}