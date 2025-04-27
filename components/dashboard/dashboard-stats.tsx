"use client";

import { StatsData } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarRange, CheckCircle, CheckCircle2, Trophy, Zap } from 'lucide-react';

interface DashboardStatsProps {
  stats: StatsData;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Habits</p>
            <h3 className="text-2xl font-bold mt-1">{stats.totalHabits}</h3>
          </div>
          <div className="rounded-full p-2 bg-primary/10">
            <CalendarRange className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <Badge variant="outline" className="text-xs">All habits</Badge>
        </div>
      </Card>
      
      <Card className="p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
            <h3 className="text-2xl font-bold mt-1">{stats.completedToday}</h3>
          </div>
          <div className="rounded-full p-2 bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <Progress 
            value={(stats.completedToday / stats.totalHabits) * 100} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round((stats.completedToday / stats.totalHabits) * 100)}% complete today
          </p>
        </div>
      </Card>
      
      <Card className="p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
            <h3 className="text-2xl font-bold mt-1">{Math.round(stats.completionRate)}%</h3>
          </div>
          <div className="rounded-full p-2 bg-blue-500/10">
            <Zap className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <Progress 
            value={stats.completionRate} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Last 30 days
          </p>
        </div>
      </Card>
      
      <Card className="p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Longest Streak</p>
            <h3 className="text-2xl font-bold mt-1">{stats.longestStreak} days</h3>
          </div>
          <div className="rounded-full p-2 bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <Badge variant="outline" className="text-xs">Current streak</Badge>
        </div>
      </Card>
    </div>
  );
}