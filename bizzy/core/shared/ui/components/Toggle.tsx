import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

/**
 * Toggle container variants
 */
const toggleContainerVariants = cva(
  "flex items-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row space-x-2",
        vertical: "flex-col items-start space-y-1.5",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

/**
 * Toggle track (background) variants
 */
const toggleTrackVariants = cva(
  "peer h-5 w-9 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-theme-button-secondary data-[state=checked]:bg-theme-accent-primary",
        success: "bg-theme-button-secondary data-[state=checked]:bg-theme-status-success",
        warning: "bg-theme-button-secondary data-[state=checked]:bg-theme-status-warning",
        danger: "bg-theme-button-secondary data-[state=checked]:bg-theme-status-error",
      },
      size: {
        sm: "h-4 w-7",
        md: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * Toggle thumb (slider) variants
 */
const toggleThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-3",
        md: "h-4 w-4 data-[state=checked]:translate-x-4",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Toggle component props
 */
export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof toggleTrackVariants> {
  /**
   * Label for the toggle
   */
  label?: string;
  
  /**
   * Helper text to display below the toggle
   */
  helperText?: string;
  
  /**
   * Error message to display below the toggle
   */
  errorMessage?: string;
  
  /**
   * Orientation of the toggle relative to its label
   */
  orientation?: VariantProps<typeof toggleContainerVariants>['orientation'];
  
  /**
   * Additional class names to apply to the toggle container
   */
  containerClassName?: string;
}

/**
 * Toggle component that follows the BizzyPerson design system
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ 
    className,
    variant,
    size,
    label,
    helperText,
    errorMessage,
    orientation,
    containerClassName,
    checked,
    defaultChecked,
    onChange,
    id,
    disabled,
    ...props 
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    const toggleId = id || React.useId();
    
    // Handle controlled and uncontrolled modes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
    };
    
    // Determine the checked state for aria attributes and styling
    const effectiveChecked = checked !== undefined ? checked : isChecked;
    const dataState = effectiveChecked ? "checked" : "unchecked";
    
    return (
      <div className={cn(
        toggleContainerVariants({ orientation }),
        containerClassName
      )}>
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            id={toggleId}
            ref={ref}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            aria-checked={effectiveChecked}
            {...props}
          />
          
          <label
            htmlFor={toggleId}
            data-state={dataState}
            className={cn(
              toggleTrackVariants({ variant, size }),
              className
            )}
          >
            <span 
              data-state={dataState}
              className={cn(
                toggleThumbVariants({ size }),
                "absolute left-0.5 top-0.5"
              )}
            />
            <span className="sr-only">{label || "Toggle"}</span>
          </label>
        </div>
        
        {label && (
          <label
            htmlFor={toggleId}
            className="text-sm font-medium text-theme-text-primary"
          >
            {label}
          </label>
        )}
        
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

Toggle.displayName = "Toggle";

export default Toggle; 