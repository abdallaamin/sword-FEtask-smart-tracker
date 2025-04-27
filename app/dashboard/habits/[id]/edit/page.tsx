"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import HabitForm from '@/components/habits/habit-form';
import LoadingScreen from '@/components/common/loading-screen';
import { useHabitStore } from '@/store/habit-store';

export default function EditHabit({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { habits, isLoading: habitsLoading, initialize } = useHabitStore();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize habit store
    initialize();
    
    if (isMounted && !isLoading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, router, isMounted, initialize]);

  const habit = habits.find(h => h.id === params.id);

  // Show loading screen while checking authentication or loading habits
  if (isLoading || habitsLoading || !isMounted) {
    return <LoadingScreen />;
  }
  
  // Redirect if habit not found
  if (!habit) {
    router.push('/dashboard');
    return <LoadingScreen />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Habit</h1>
          <p className="text-muted-foreground">
            Update your habit details
          </p>
        </div>
        
        <HabitForm habitData={habit} />
      </div>
    </DashboardLayout>
  );
}