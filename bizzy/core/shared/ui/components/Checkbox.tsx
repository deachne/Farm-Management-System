import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Check, Minus } from 'lucide-react';

/**
 * Checkbox variants
 */
const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-theme-sidebar-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-theme-accent-primary data-[state=checked]:text-white",
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Checkbox container variants
 */
const checkboxContainerVariants = cva(
  "flex items-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-start gap-1.5",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

/**
 * Checkbox component props
 */
export interface CheckboxProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  /**
   * Label for the checkbox
   */
  label?: string;
  
  /**
   * Whether the checkbox is indeterminate
   */
  indeterminate?: boolean;
  
  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;
  
  /**
   * Error message to display below the checkbox
   */
  errorMessage?: string;
  
  /**
   * Orientation of the checkbox relative to its label
   */
  orientation?: VariantProps<typeof checkboxContainerVariants>['orientation'];
  
  /**
   * Additional class names to apply to the checkbox container
   */
  containerClassName?: string;
}

/**
 * Checkbox component that follows the BizzyPerson design system
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    size,
    label, 
    indeterminate = false,
    helperText,
    errorMessage,
    orientation,
    containerClassName,
    checked,
    id,
    ...props 
  }, ref) => {
    // Use a callback ref to set the indeterminate property
    // since it's not available as a prop in React
    const innerRef = React.useRef<HTMLInputElement>(null);
    
    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    
    // Combine refs
    const setRefs = (element: HTMLInputElement) => {
      innerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };
    
    const checkboxId = id || React.useId();
    
    return (
      <div className={cn(
        checkboxContainerVariants({ orientation }),
        containerClassName
      )}>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={checkboxId}
              ref={setRefs}
              checked={checked}
              className={cn(
                checkboxVariants({ size }),
                "appearance-none",
                className
              )}
              {...props}
            />
            {/* Custom checkbox appearance */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center",
                !checked && !indeterminate && "text-transparent"
              )}
            >
              {indeterminate ? (
                <Minus className="h-3 w-3 text-white" />
              ) : (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
          </div>
          
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium text-theme-text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              )}
            >
              {label}
            </label>
          )}
        </div>
        
        {errorMessage && (
          <p className="mt-1 text-sm text-theme-status-error">
            {errorMessage}
          </p>
        )}
        
        {!errorMessage && helperText && (
          <p className="mt-1 text-sm text-theme-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox; 