import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { useRadioGroup } from './RadioGroup';

/**
 * Radio variants
 */
const radioVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-full border border-theme-sidebar-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-theme-accent-primary checked:text-theme-text-white",
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
 * Radio container variants
 */
const radioContainerVariants = cva(
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
 * Radio component props
 */
export interface RadioProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof radioVariants> {
  /**
   * Label for the radio
   */
  label?: string;
  
  /**
   * Helper text to display below the radio
   */
  helperText?: string;
  
  /**
   * Error message to display below the radio
   */
  errorMessage?: string;
  
  /**
   * Orientation of the radio relative to its label
   */
  orientation?: VariantProps<typeof radioContainerVariants>['orientation'];
  
  /**
   * Additional class names to apply to the radio container
   */
  containerClassName?: string;
  
  /**
   * Value of the radio button (used with RadioGroup)
   */
  value?: string;
}

/**
 * Radio component that follows the BizzyPerson design system
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    className, 
    size,
    label, 
    helperText,
    errorMessage,
    orientation,
    containerClassName,
    id,
    name: propName,
    checked: propChecked,
    onChange: propOnChange,
    value,
    ...props 
  }, ref) => {
    const radioId = id || React.useId();
    
    // Try to use RadioGroup context if available
    let name = propName;
    let checked = propChecked;
    let onChange = propOnChange;
    
    try {
      const radioGroup = useRadioGroup();
      
      // If within a RadioGroup, use its context
      if (radioGroup) {
        name = name || radioGroup.name;
        
        // Only override checked state if we have a value and group has a value
        if (value !== undefined && radioGroup.value !== undefined) {
          checked = value === radioGroup.value;
        }
        
        const originalOnChange = onChange;
        
        // Handle both the RadioGroup onChange and local onChange
        onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (originalOnChange) {
            originalOnChange(e);
          }
          
          if (radioGroup.onChange && value) {
            radioGroup.onChange(value);
          }
        };
      }
    } catch (error) {
      // Not within a RadioGroup, use props as is
    }
    
    return (
      <div className={cn(
        radioContainerVariants({ orientation }),
        containerClassName
      )}>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type="radio"
              id={radioId}
              ref={ref}
              name={name}
              checked={checked}
              onChange={onChange}
              value={value}
              className={cn(
                radioVariants({ size }),
                className
              )}
              {...props}
            />
            {/* Custom radio dot */}
            <div 
              className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white hidden peer-checked:block",
                {
                  "h-1.5 w-1.5": size === "sm",
                  "h-2 w-2": size === "md" || !size,
                  "h-2.5 w-2.5": size === "lg",
                }
              )}
              aria-hidden="true" 
            />
          </div>
          
          {label && (
            <label
              htmlFor={radioId}
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

Radio.displayName = "Radio";

export default Radio;

// Re-export RadioGroup to fix the import error
export { default as RadioGroup } from './RadioGroup'; 