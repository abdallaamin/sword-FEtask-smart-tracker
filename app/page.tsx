"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import LoginView from '@/components/auth/login-view';
import LoadingScreen from '@/components/common/loading-screen';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (isMounted && !isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

  // Show loading screen while checking authentication
  if (isLoading || !isMounted) {
    return <LoadingScreen />;
  }

  return <LoginView />;
}