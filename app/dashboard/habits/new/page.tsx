"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import HabitForm from '@/components/habits/habit-form';
import LoadingScreen from '@/components/common/loading-screen';
import { useHabitStore } from '@/store/habit-store';

export default function NewHabit() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { initialize } = useHabitStore();

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

  // Show loading screen while checking authentication
  if (isLoading || !isMounted) {
    return <LoadingScreen />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New Habit</h1>
          <p className="text-muted-foreground">
            Add a new habit to track daily
          </p>
        </div>
        
        <HabitForm />
      </div>
    </DashboardLayout>
  );
}