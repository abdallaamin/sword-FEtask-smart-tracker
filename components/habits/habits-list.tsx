"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HabitWithLogs } from '@/types';
import { useHabitStore } from '@/store/habit-store';
import { parseISO, format } from 'date-fns';
import { cn, getColorClass, formatDateShort } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DivideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Pencil, Trash, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface HabitsListProps {
  habits: HabitWithLogs[];
  compact?: boolean;
}

export default function HabitsList({ habits, compact = false }: HabitsListProps) {
  const router = useRouter();
  const { toggleHabitCompletion, removeHabit, getStreak } = useHabitStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  
  const confirmDelete = (habitId: string) => {
    setHabitToDelete(habitId);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (habitToDelete) {
      removeHabit(habitToDelete);
      setDeleteDialogOpen(false);
      setHabitToDelete(null);
    }
  };
  
  const handleToggle = (habitId: string, date: string, completed: boolean) => {
    toggleHabitCompletion(habitId, parseISO(date), !completed);
  };
  
  const getIconComponent = (iconName: string) => {
    // @ts-ignore - dynamic icon component
    return LucideIcons[iconName] || LucideIcons.Circle;
  };
  
  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No habits to display</p>
        <Button onClick={() => router.push('/dashboard/habits/new')}>Create a Habit</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const streak = getStreak(habit.id);
        const IconComponent = getIconComponent(habit.icon);
        
        return (
          <Card key={habit.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="flex items-center p-4">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full mr-3",
                    getColorClass(habit.color)
                  )}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{habit.name}</h3>
                      
                      {streak > 0 && (
                        <Badge variant="outline" className="ml-2 flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-amber-500" />
                          <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {habit.description}
                    </p>
                  </div>
                  
                  {!compact && (
                    <div className="flex space-x-1 ml-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/habits/${habit.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDelete(habit.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Calendar squares */}
                <div className="flex justify-between bg-muted/40 p-3 pt-2">
                  {habit.logs.map((log, index) => {
                    const date = parseISO(log.date);
                    const isToday = format(new Date(), 'yyyy-MM-dd') === log.date;
                    
                    return (
                      <div key={log.date} className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground mb-1">
                          {formatDateShort(log.date)}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggle(habit.id, log.date, log.completed)}
                          className={cn(
                            "w-8 h-8 rounded-md border flex items-center justify-center",
                            log.completed ? cn("bg-primary border-primary", isToday && "ring-2 ring-offset-1") : "bg-background border-input",
                            isToday && "ring-1 ring-offset-1"
                          )}
                        >
                          {log.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <IconComponent className="h-4 w-4 text-primary-foreground" />
                            </motion.div>
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all its tracking history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}