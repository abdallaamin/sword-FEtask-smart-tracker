"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HabitForm from "./habit-form";

export interface HabitModalProps {
  trigger: ReactNode;
  title?: string;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}

export default function HabitModal({ 
  trigger, 
  title = "Create new habit",
  open: controlledOpen,
  onOpenChange: setControlledOpen 
}: HabitModalProps) {
  // Use internal state if no controlled state is provided
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determine if we're using controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const handleComplete = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent 
        className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto"
        autoFocus={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <HabitForm isModal onComplete={handleComplete} />
      </DialogContent>
    </Dialog>
  );
} 