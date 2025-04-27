"use client";

import { useState, useEffect } from 'react';
import { 
  getHabits, 
  getHabitLogs, 
  getHabitsWithLogs, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  logHabit,
  calculateStreak,
  filterHabitsByTag,
  initializeWithDemoData
} from '@/lib/habits';
import { Habit, HabitLog, HabitWithLogs } from '@/types';

export function useHabits(days: number = 7) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsWithLogs, setHabitsWithLogs] = useState<HabitWithLogs[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with demo data if needed
    initializeWithDemoData();
    
    // Load habits and logs
    const loadData = () => {
      const habitsData = getHabits();
      const logsData = getHabitLogs();
      const habitsWithLogsData = selectedTag 
        ? filterHabitsByTag(selectedTag) 
        : getHabitsWithLogs(days);

      setHabits(habitsData);
      setLogs(logsData);
      setHabitsWithLogs(habitsWithLogsData);
      setIsLoading(false);
    };

    loadData();
  }, [days, selectedTag]);

  const addHabit = (habitData: Omit<Habit, 'id'>) => {
    const newHabit = createHabit(habitData);
    setHabits([...habits, newHabit]);
    setHabitsWithLogs(selectedTag 
      ? filterHabitsByTag(selectedTag) 
      : getHabitsWithLogs(days)
    );
    return newHabit;
  };

  const editHabit = (habit: Habit) => {
    const updatedHabit = updateHabit(habit);
    setHabits(habits.map(h => h.id === habit.id ? updatedHabit : h));
    setHabitsWithLogs(selectedTag 
      ? filterHabitsByTag(selectedTag) 
      : getHabitsWithLogs(days)
    );
    return updatedHabit;
  };

  const removeHabit = (habitId: string) => {
    deleteHabit(habitId);
    setHabits(habits.filter(h => h.id !== habitId));
    setLogs(logs.filter(log => log.habitId !== habitId));
    setHabitsWithLogs(habitsWithLogs.filter(h => h.id !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: Date = new Date(), completed: boolean = true) => {
    const newLog = logHabit(habitId, date, completed);
    
    // Update logs
    const updatedLogs = [...logs.filter(log => 
      !(log.habitId === habitId && log.date === newLog.date)
    ), newLog];
    setLogs(updatedLogs);
    
    // Update habitsWithLogs
    setHabitsWithLogs(selectedTag 
      ? filterHabitsByTag(selectedTag) 
      : getHabitsWithLogs(days)
    );
    
    return newLog;
  };

  const getStreak = (habitId: string) => {
    return calculateStreak(habitId);
  };

  const filterByTag = (tagId: string | null) => {
    setSelectedTag(tagId);
  };

  return {
    habits,
    habitsWithLogs,
    logs,
    isLoading,
    selectedTag,
    addHabit,
    editHabit,
    removeHabit,
    toggleHabitCompletion,
    getStreak,
    filterByTag
  };
}