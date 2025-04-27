"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditHabitRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard habits tab
    router.push('/dashboard?tab=habits');
  }, [router]);

  return null;
}