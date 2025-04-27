import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Create a ref that we can use if no ref is provided
    const innerRef = React.useRef<HTMLInputElement>(null);
    // Use the provided ref or our inner ref
    const inputRef = (ref || innerRef) as React.RefObject<HTMLInputElement>;
    
    // Custom focus handler to ensure input keeps focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (props.onFocus) {
        props.onFocus(e);
      }
      
      // Make sure we keep input focused
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={inputRef}
        onFocus={handleFocus}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
