"use client";

import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginView() {
  const { isLoading } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Sword Smart Habit Tracker</CardTitle>
            <CardDescription>
              Build better habits and reach your goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-2">Features</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Track daily habits with visual progress</li>
                <li>See your streaks and completion rates</li>
                <li>Analyze your data with intuitive charts</li>
                <li>Organize habits with custom tags</li>
                <li>Dark mode support</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Link href="/auth/signin" className="w-full">
              <Button 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full">
              <Button 
                className="w-full" 
                size="lg"
                variant="outline"
                disabled={isLoading}
              >
                Create an account
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}