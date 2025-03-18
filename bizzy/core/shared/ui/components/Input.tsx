import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { designTokens } from '../design-tokens';

/**
 * Input variants using the class-variance-authority library
 */
const inputVariants = cva(
  /* Base styles for all inputs */
  "w-full flex rounded-md border font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      /* Size variants */
      size: {
        sm: "h-8 text-xs px-3 py-1",
        md: "h-10 text-sm px-3 py-2",
        lg: "h-12 text-base px-4 py-2.5",
      },
      /* Variant styles */
      variant: {
        default: "border-theme-sidebar-border bg-theme-bg-primary text-theme-text-primary focus-visible:border-theme-accent-primary focus-visible:ring-theme-accent-primary/20",
        outline: "border-theme-sidebar-border bg-transparent text-theme-text-primary focus-visible:border-theme-accent-primary focus-visible:ring-theme-accent-primary/20",
        filled: "border-transparent bg-theme-bg-chat-input text-theme-text-primary focus-visible:border-theme-accent-primary focus-visible:ring-theme-accent-primary/20",
        fieldInput: "border-transparent bg-theme-bg-secondary text-theme-text-primary focus-visible:border-theme-accent-primary focus-visible:ring-theme-accent-primary/20",
      },
      /* Status styles */
      status: {
        default: "",
        error: "border-theme-status-error focus-visible:border-theme-status-error focus-visible:ring-theme-status-error/20",
        success: "border-theme-status-success focus-visible:border-theme-status-success focus-visible:ring-theme-status-success/20",
        warning: "border-theme-status-warning focus-visible:border-theme-status-warning focus-visible:ring-theme-status-warning/20",
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      status: "default",
    },
  }
);

/**
 * Input component props
 */
export interface InputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, 
    VariantProps<typeof inputVariants> {
  /**
   * Left icon element to display inside the input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon element to display inside the input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Error message to display below the input
   */
  errorMessage?: string;
  
  /**
   * Label text to display above the input
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Whether the input is required
   */
  required?: boolean;

  /**
   * Additional class names to apply to the input wrapper
   */
  wrapperClassName?: string;
}

/**
 * Input component that follows the BizzyPerson design system
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    size,
    variant,
    status,
    type = 'text',
    leftIcon,
    rightIcon,
    errorMessage,
    label,
    helperText,
    wrapperClassName,
    disabled,
    required,
    ...props 
  }, ref) => {
    // Calculate the effective status based on error message
    const effectiveStatus = errorMessage ? 'error' : status;
  
    return (
      <div className={cn("w-full flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label 
            className="text-sm font-medium text-theme-text-primary"
            htmlFor={props.id}
          >
            {label} {required && <span className="text-theme-status-error">*</span>}
          </label>
        )}
        
        <div className="relative w-full flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-theme-text-secondary">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              inputVariants({ size, variant, status: effectiveStatus }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
            ref={ref}
            required={required}
            aria-invalid={effectiveStatus === 'error'}
            aria-describedby={errorMessage ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-theme-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        
        {errorMessage && (
          <p id={`${props.id}-error`} className="text-sm text-theme-status-error">
            {errorMessage}
          </p>
        )}
        
        {!errorMessage && helperText && (
          <p id={`${props.id}-helper`} className="text-sm text-theme-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 