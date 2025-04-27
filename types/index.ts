export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tags?: string[];
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
}

export interface HabitTag {
  id: string;
  name: string;
  color: string;
}

export interface StatsData {
  totalHabits: number;
  completedToday: number;
  totalCompletedThisWeek: number;
  longestStreak: number;
  completionRate: number;
}