"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Home, 
  PlusCircle, 
  X, 
  ListChecks,
  Settings,
  Sparkles
} from 'lucide-react';
import HabitModal from '@/components/habits/habit-modal';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = React.useState(false);
  
  // Function to navigate and close sidebar
  const handleNavigation = (path: string) => {
    router.push(path);
    closeSidebar();
  };
  
  // Function to open modal and close sidebar
  const handleOpenModal = () => {
    setOpenModal(true);
    closeSidebar();
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Habit Tracker</span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeSidebar} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button
              variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => handleNavigation('/dashboard')}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleOpenModal}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Habit</span>
            </Button>
            
            <Button
              variant={pathname.includes('/dashboard/habits') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => handleNavigation('/dashboard?tab=habits')}
            >
              <ListChecks className="h-5 w-5" />
              <span>My Habits</span>
            </Button>
            
            <Button
              variant={pathname.includes('analytics') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => handleNavigation('/dashboard?tab=analytics')}
            >
              <BarChart className="h-5 w-5" />
              <span>Analytics</span>
            </Button>
          </nav>
          
          <div className="mt-2">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-muted-foreground">Settings</h3>
            </div>
            <Button
              variant={pathname === '/dashboard/settings' ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2 px-3"
              onClick={() => handleNavigation('/dashboard/settings')}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </ScrollArea>
        
        <div className="mt-auto p-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium">Pro Tips</h4>
            <p className="mt-2 text-xs text-muted-foreground">
              Track habits at the same time each day to build consistency.
            </p>
          </div>
        </div>
      </div>
      
      {/* Add Habit Modal */}
      {openModal && (
        <HabitModal 
          trigger={<div style={{ display: 'none' }}></div>}
          title="Create New Habit" 
          open={openModal}
          onOpenChange={setOpenModal}
        />
      )}
    </>
  );
}