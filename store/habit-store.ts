import { create } from 'zustand';
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

interface HabitState {
  habits: Habit[];
  habitsWithLogs: HabitWithLogs[];
  logs: HabitLog[];
  isLoading: boolean;
  selectedTag: string | null;
  
  // Actions
  initialize: (days?: number) => void;
  addHabit: (habitData: Omit<Habit, 'id'>) => Habit;
  editHabit: (habit: Habit) => Habit;
  removeHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string, date?: Date, completed?: boolean) => HabitLog;
  getStreak: (habitId: string) => number;
  filterByTag: (tagId: string | null) => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  habitsWithLogs: [],
  logs: [],
  isLoading: true,
  selectedTag: null,
  
  initialize: (days = 7) => {
    // Initialize with demo data if needed
    initializeWithDemoData();
    
    // Load habits and logs
    const habitsData = getHabits();
    const logsData = getHabitLogs();
    const { selectedTag } = get();
    const habitsWithLogsData = selectedTag 
      ? filterHabitsByTag(selectedTag) 
      : getHabitsWithLogs(days);

    set({
      habits: habitsData,
      logs: logsData,
      habitsWithLogs: habitsWithLogsData,
      isLoading: false
    });
  },
  
  addHabit: (habitData) => {
    const newHabit = createHabit(habitData);
    const { habits, selectedTag } = get();
    
    set({ 
      habits: [...habits, newHabit],
      habitsWithLogs: selectedTag 
        ? filterHabitsByTag(selectedTag) 
        : getHabitsWithLogs(7)
    });
    
    return newHabit;
  },
  
  editHabit: (habit) => {
    const updatedHabit = updateHabit(habit);
    const { habits, selectedTag } = get();
    
    set({
      habits: habits.map(h => h.id === habit.id ? updatedHabit : h),
      habitsWithLogs: selectedTag 
        ? filterHabitsByTag(selectedTag) 
        : getHabitsWithLogs(7)
    });
    
    return updatedHabit;
  },
  
  removeHabit: (habitId) => {
    deleteHabit(habitId);
    const { habits, logs, habitsWithLogs } = get();
    
    set({
      habits: habits.filter(h => h.id !== habitId),
      logs: logs.filter(log => log.habitId !== habitId),
      habitsWithLogs: habitsWithLogs.filter(h => h.id !== habitId)
    });
  },
  
  toggleHabitCompletion: (habitId, date = new Date(), completed = true) => {
    const newLog = logHabit(habitId, date, completed);
    const { logs, selectedTag } = get();
    
    // Update logs
    const updatedLogs = [
      ...logs.filter(log => !(log.habitId === habitId && log.date === newLog.date)),
      newLog
    ];
    
    set({
      logs: updatedLogs,
      habitsWithLogs: selectedTag 
        ? filterHabitsByTag(selectedTag) 
        : getHabitsWithLogs(7)
    });
    
    return newLog;
  },
  
  getStreak: (habitId) => {
    return calculateStreak(habitId);
  },
  
  filterByTag: (tagId) => {
    set({
      selectedTag: tagId,
      habitsWithLogs: tagId 
        ? filterHabitsByTag(tagId) 
        : getHabitsWithLogs(7)
    });
  }
})); 