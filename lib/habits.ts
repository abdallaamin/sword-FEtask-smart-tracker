import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitLog, HabitWithLogs, HabitTag } from '@/types';
import { startOfDay, format, differenceInDays, addDays, subDays, isToday, isSameDay, isAfter, isBefore, parseISO } from 'date-fns';

// Get habits from localStorage
export const getHabits = (): Habit[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('habits');
  return stored ? JSON.parse(stored) : [];
};

// Get habit logs from localStorage
export const getHabitLogs = (): HabitLog[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('habitLogs');
  return stored ? JSON.parse(stored) : [];
};

// Save habits to localStorage
export const saveHabits = (habits: Habit[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('habits', JSON.stringify(habits));
};

// Save habit logs to localStorage
export const saveHabitLogs = (logs: HabitLog[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('habitLogs', JSON.stringify(logs));
};

// Create a new habit
export const createHabit = (habit: Omit<Habit, 'id'>): Habit => {
  const newHabit: Habit = {
    id: uuidv4(),
    ...habit,
    createdAt: new Date().toISOString(),
  };
  
  const habits = getHabits();
  saveHabits([...habits, newHabit]);
  
  return newHabit;
};

// Update an existing habit
export const updateHabit = (habit: Habit): Habit => {
  const habits = getHabits();
  const updatedHabits = habits.map(h => h.id === habit.id ? habit : h);
  saveHabits(updatedHabits);
  return habit;
};

// Delete a habit
export const deleteHabit = (habitId: string): void => {
  const habits = getHabits();
  const updatedHabits = habits.filter(h => h.id !== habitId);
  saveHabits(updatedHabits);
  
  // Also remove logs for this habit
  const logs = getHabitLogs();
  const updatedLogs = logs.filter(log => log.habitId !== habitId);
  saveHabitLogs(updatedLogs);
};

// Log a habit completion
export const logHabit = (habitId: string, date: Date = new Date(), completed: boolean = true): HabitLog => {
  const formattedDate = format(startOfDay(date), 'yyyy-MM-dd');
  
  const logs = getHabitLogs();
  const existingLog = logs.find(log => 
    log.habitId === habitId && log.date === formattedDate
  );
  
  let habitLog: HabitLog;
  
  if (existingLog) {
    // Update existing log
    habitLog = { ...existingLog, completed };
    const updatedLogs = logs.map(log => 
      log.habitId === habitId && log.date === formattedDate ? habitLog : log
    );
    saveHabitLogs(updatedLogs);
  } else {
    // Create new log
    habitLog = {
      id: uuidv4(),
      habitId,
      date: formattedDate,
      completed,
      createdAt: new Date().toISOString(),
    };
    saveHabitLogs([...logs, habitLog]);
  }
  
  return habitLog;
};

// Get habits with their logs
export const getHabitsWithLogs = (days: number = 7): HabitWithLogs[] => {
  const habits = getHabits();
  const logs = getHabitLogs();
  const today = startOfDay(new Date());
  
  return habits.map(habit => {
    const startDate = subDays(today, days - 1);
    const habitLogs = [];
    
    // Generate array of dates
    for (let i = 0; i < days; i++) {
      const date = addDays(startDate, i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Find log for this date or create an empty one
      const log = logs.find(l => 
        l.habitId === habit.id && l.date === formattedDate
      ) || {
        id: '',
        habitId: habit.id,
        date: formattedDate,
        completed: false,
        createdAt: '',
      };
      
      habitLogs.push(log);
    }
    
    return {
      ...habit,
      logs: habitLogs,
    };
  });
};

// Calculate streak for a habit
export const calculateStreak = (habitId: string): number => {
  const logs = getHabitLogs();
  const habitLogs = logs.filter(log => log.habitId === habitId && log.completed)
    .sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  
  if (habitLogs.length === 0) return 0;
  
  // Check if today's log exists and is completed
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const hasTodayCompleted = habitLogs.some(log => log.date === today);
  
  let currentStreak = hasTodayCompleted ? 1 : 0;
  let previousDate = hasTodayCompleted 
    ? subDays(parseISO(today), 1) 
    : parseISO(today);
  
  for (let i = 0; i < habitLogs.length; i++) {
    const logDate = parseISO(habitLogs[i].date);
    
    // Skip today's log since we already counted it
    if (hasTodayCompleted && i === 0 && isSameDay(logDate, parseISO(today))) {
      continue;
    }
    
    // If this log is for the expected previous day, increase streak
    if (isSameDay(logDate, previousDate)) {
      currentStreak++;
      previousDate = subDays(previousDate, 1);
    } else {
      // Streak is broken
      break;
    }
  }
  
  return currentStreak;
};

// Get available tags
export const getAvailableTags = (): HabitTag[] => {
  return [
    { id: 'health', name: 'Health', color: '#10b981' },
    { id: 'productivity', name: 'Productivity', color: '#3b82f6' },
    { id: 'mindfulness', name: 'Mindfulness', color: '#8b5cf6' },
    { id: 'learning', name: 'Learning', color: '#f59e0b' },
    { id: 'finance', name: 'Finance', color: '#64748b' },
    { id: 'social', name: 'Social', color: '#ec4899' },
    { id: 'creativity', name: 'Creativity', color: '#ef4444' },
  ];
};

// Filter habits by tag
export const filterHabitsByTag = (tagId: string | null): HabitWithLogs[] => {
  const habitsWithLogs = getHabitsWithLogs();
  
  if (!tagId) return habitsWithLogs;
  
  return habitsWithLogs.filter(habit => habit.tags?.includes(tagId));
};

// Get completion rate for a habit
export const getCompletionRate = (habitId: string, days: number = 30): number => {
  const logs = getHabitLogs();
  const today = startOfDay(new Date());
  const startDate = subDays(today, days - 1);
  
  let completed = 0;
  let total = 0;
  
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Only count days until today
    if (isAfter(date, today)) continue;
    
    total++;
    
    if (logs.some(log => 
      log.habitId === habitId && 
      log.date === formattedDate && 
      log.completed
    )) {
      completed++;
    }
  }
  
  return total > 0 ? (completed / total) * 100 : 0;
};

// Initialize with demo data if empty
export const initializeWithDemoData = () => {
  if (typeof window === 'undefined') return;
  
  const habits = getHabits();
  if (habits.length > 0) return;
  
  const demoHabits: Omit<Habit, 'id'>[] = [
    {
      name: 'Drink Water',
      description: 'Drink 8 glasses of water daily',
      icon: 'droplet',
      color: '#0ea5e9',
      tags: ['health'],
      createdAt: new Date().toISOString(),
    },
    {
      name: 'Meditate',
      description: '10 minutes of mindfulness meditation',
      icon: 'wind',
      color: '#8b5cf6',
      tags: ['mindfulness'],
      createdAt: new Date().toISOString(),
    },
    {
      name: 'Read Book',
      description: 'Read at least 30 minutes',
      icon: 'book-open',
      color: '#f59e0b',
      tags: ['learning'],
      createdAt: new Date().toISOString(),
    },
  ];
  
  const newHabits = demoHabits.map(habit => createHabit(habit));
  
  // Create some logs for the last week
  const today = startOfDay(new Date());
  const logs: HabitLog[] = [];
  
  newHabits.forEach(habit => {
    for (let i = 6; i >= 0; i--) {
      // Random completion (more likely to be completed for recent days)
      const completed = Math.random() < (1 - i / 10);
      if (completed) {
        const date = subDays(today, i);
        logs.push({
          id: uuidv4(),
          habitId: habit.id,
          date: format(date, 'yyyy-MM-dd'),
          completed: true,
          createdAt: new Date().toISOString(),
        });
      }
    }
  });
  
  saveHabitLogs(logs);
};