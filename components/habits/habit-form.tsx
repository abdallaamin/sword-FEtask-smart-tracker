"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Habit } from '@/types';
import { useHabitStore } from '@/store/habit-store';
import { getAvailableTags } from '@/lib/habits';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Icons to choose from
const habitIcons = [
  'Droplet', 'Heart', 'Wind', 'BookOpen', 'Dumbbell', 
  'Coffee', 'Brain', 'Pencil', 'Code', 'Music', 
  'Utensils', 'Bike', 'Moon', 'Flame', 'TreePine'
];

// Colors to choose from
const habitColors = [
  { name: 'Blue', value: '#0ea5e9' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Slate', value: '#64748b' },
];

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description is too long"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HabitFormProps {
  habitData?: Habit;
  onComplete?: () => void;
  isModal?: boolean;
}

export default function HabitForm({ habitData, onComplete, isModal = false }: HabitFormProps) {
  const router = useRouter();
  const { addHabit, editHabit } = useHabitStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const availableTags = getAvailableTags();
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the name input field when modal opens
  useEffect(() => {
    if (isModal && nameInputRef.current) {
      // Delay focus to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isModal]);
  
  // Add helper function for maintaining focus
  const maintainFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Prevent any default behavior that might steal focus
    e.preventDefault();
    e.stopPropagation();
    // Ensure the current target maintains focus
    e.currentTarget.focus();
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: habitData?.name || "",
      description: habitData?.description || "",
      icon: habitData?.icon || "Droplet",
      color: habitData?.color || "#0ea5e9",
      tags: habitData?.tags || [],
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (habitData) {
        // Edit existing habit
        const updatedHabit = editHabit({
          ...habitData,
          ...values,
        });
        
        toast({
          title: "Habit updated",
          description: `${updatedHabit.name} has been updated successfully.`,
        });
      } else {
        // Create new habit
        const newHabit = addHabit({
          ...values,
          createdAt: new Date().toISOString()
        });
        
        toast({
          title: "Habit created",
          description: `${newHabit.name} has been created successfully.`,
        });
      }
      
      if (onComplete) {
        onComplete();
      } else {
        // Navigate back to dashboard if not in modal
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      toast({
        title: "Error",
        description: "Failed to save habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="habit-name">Habit Name</FormLabel>
              <FormControl>
                <Input 
                  id="habit-name"
                  placeholder="Drink water" 
                  {...field} 
                  ref={nameInputRef}
                  autoComplete="off"
                  className="focus:z-10 focus-visible:ring-offset-0"
                  onFocus={maintainFocus}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    field.onChange(e);
                    // Ensure we maintain focus after value changes
                    e.currentTarget.focus();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="habit-description">Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  id="habit-description"
                  placeholder="Drink 8 glasses of water daily" 
                  className="resize-none focus:z-10 focus-visible:ring-offset-0"
                  autoComplete="off"
                  {...field} 
                  onFocus={maintainFocus}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    field.onChange(e);
                    // Ensure we maintain focus after value changes
                    e.currentTarget.focus();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                  {habitIcons.map((iconName) => {
                    // @ts-ignore - dynamic import
                    const Icon = LucideIcons[iconName];
                    return (
                      <Button
                        key={iconName}
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-10 w-10 p-0 aspect-square",
                          field.value === iconName && "ring-2 ring-primary ring-offset-2"
                        )}
                        onClick={() => form.setValue("icon", iconName)}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
                  {habitColors.map((color) => (
                    <Button
                      key={color.value}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-10 w-10 p-0 aspect-square",
                        field.value === color.value && "ring-2 ring-primary ring-offset-2"
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => form.setValue("color", color.value)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags (optional)</FormLabel>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {availableTags.map((tag) => (
                  <FormField
                    key={tag.id}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tag.id}
                          className="flex items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                const currentTags = field.value || [];
                                if (checked) {
                                  form.setValue("tags", [...currentTags, tag.id]);
                                } else {
                                  form.setValue(
                                    "tags",
                                    currentTags.filter((value) => value !== tag.id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="flex items-center space-x-1 cursor-pointer">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span>{tag.name}</span>
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onComplete || (() => router.back())}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? habitData
                ? "Updating..."
                : "Creating..."
              : habitData
              ? "Update Habit"
              : "Create Habit"}
          </Button>
        </div>
      </form>
    </Form>
  );
  
  if (isModal) {
    return <FormContent />;
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <FormContent />
      </CardContent>
    </Card>
  );
}