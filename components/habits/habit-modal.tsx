"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Habit } from "@/types";
import HabitForm from "./habit-form";

export interface HabitModalProps {
  trigger: ReactNode;
  title?: string;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
  habitData?: Habit;
}

export default function HabitModal({ 
  trigger, 
  title = "Create new habit",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  habitData
}: HabitModalProps) {
  // Use internal state if no controlled state is provided
  const [internalOpen, setInternalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're using controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const handleComplete = () => {
    setOpen(false);
  };

  // Handle clicks on the trigger element
  const handleTriggerClick = () => {
    setOpen(true);
  };

  // Handle clicks on the backdrop to close the modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  // Handle escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  // Custom implementation of focus trap
  useEffect(() => {
    if (!open) return;

    // Lock the body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  return (
    <>
      {/* Trigger element */}
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>

      {/* Modal */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleBackdropClick}
        >
          <div 
            ref={modalRef}
            className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                {habitData ? `Edit ${habitData.name}` : title}
              </h2>
              <button 
                onClick={() => setOpen(false)}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Content */}
            <HabitForm 
              isModal 
              onComplete={handleComplete} 
              habitData={habitData} 
            />
          </div>
        </div>
      )}
    </>
  );
} 