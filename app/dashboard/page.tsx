"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import HabitsList from '@/components/habits/habits-list';
import DashboardStats from '@/components/dashboard/dashboard-stats';
import StatsCharts from '@/components/dashboard/stats-charts';
import LoadingScreen from '@/components/common/loading-screen';
import { useHabitStore } from '@/store/habit-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateStats } from '@/lib/utils';
import { getAvailableTags } from '@/lib/habits';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import HabitModal from "@/components/habits/habit-modal";
import { auth } from '@/lib/auth';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active tab from URL query param or default to "overview"
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam === 'habits' || tabParam === 'analytics' ? tabParam : "overview"
  );
  
  const { 
    habits, 
    habitsWithLogs, 
    logs, 
    isLoading: habitsLoading, 
    selectedTag, 
    filterByTag,
    initialize 
  } = useHabitStore();
  const [isMounted, setIsMounted] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const stats = calculateStats(habits, logs);
  const tags = getAvailableTags();

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize habit store
    initialize();
    
    // Update tab when URL param changes
    if (tabParam === 'habits' || tabParam === 'analytics') {
      setActiveTab(tabParam);
    }
    
    // Check for stored user in localStorage only once when the component mounts
    const checkAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('currentUser');
          
          if (storedUser && !isAuthenticated) {
            // We have a user in localStorage, but not in context
            // Let's authenticate with the stored user
            await auth.loginWithStoredUser(JSON.parse(storedUser));
            console.log("Authenticated with stored user");
          }
          
          setHasCheckedAuth(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setHasCheckedAuth(true);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, initialize, tabParam]);

  // Show loading screen while initializing or checking auth
  if (isLoading || habitsLoading || !isMounted || !hasCheckedAuth) {
    return <LoadingScreen />;
  }
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Only add query param if not overview (default) tab
    if (value !== 'overview') {
      router.push(`/dashboard?tab=${value}`);
    } else {
      router.push('/dashboard');
    }
  };
  
  // Check if we have a user, either from context or localStorage
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const hasUser = isAuthenticated || !!storedUser;
  
  // Use the middleware for auth protection instead of client-side redirects
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your daily habits and build consistency.
            </p>
          </div>
          <HabitModal
            trigger={
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Habit</span>
              </Button>
            }
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        </div>
        
        <DashboardStats stats={stats} />
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Your Habits</CardTitle>
                  <CardDescription>
                    Track your daily progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HabitsList 
                    habits={habitsWithLogs.slice(0, 3)} 
                    compact={true} 
                  />
                  {habitsWithLogs.length > 3 && (
                    <button 
                      onClick={() => handleTabChange("habits")}
                      className="mt-4 text-sm text-primary hover:underline"
                    >
                      View all habits
                    </button>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>
                    Your habit completion rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsCharts habits={habits} logs={logs} />
                  <button 
                    onClick={() => handleTabChange("analytics")}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    View detailed analytics
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="habits" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Habits</CardTitle>
                    <CardDescription>
                      Track and manage your daily habits
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <select 
                      className="py-1 px-3 rounded-md border border-input bg-background text-sm"
                      value={selectedTag || ""}
                      onChange={(e) => filterByTag(e.target.value || null)}
                    >
                      <option value="">All Tags</option>
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {habitsWithLogs.length > 0 ? (
                  <HabitsList habits={habitsWithLogs} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {selectedTag ? "No habits with this tag" : "No habits added yet"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Habit Analytics</CardTitle>
                <CardDescription>
                  Visualize your progress over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <StatsCharts habits={habits} logs={logs} detailed />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}