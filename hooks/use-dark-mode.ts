"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function useDarkMode() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Only return actual theme when mounted to avoid hydration mismatch
  const currentTheme = mounted ? theme : undefined;

  return {
    isDarkMode: currentTheme === 'dark',
    theme: currentTheme,
    toggleDarkMode,
  };
}