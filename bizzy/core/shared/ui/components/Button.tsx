import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

/**
 * Button variants using class-variance-authority
 */
const buttonVariants = cva(
  /* Base styles for all buttons */
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      /* Variant styles */
      variant: {
        primary: "bg-theme-button-primary hover:bg-theme-button-primary-hover text-white focus-visible:ring-theme-accent-primary",
        secondary: "bg-theme-button-secondary hover:bg-theme-button-secondary-hover text-theme-text-primary focus-visible:ring-theme-accent-primary/50",
        outline: "border border-theme-sidebar-border bg-transparent hover:bg-theme-button-secondary text-theme-text-primary focus-visible:ring-theme-accent-primary/50",
        ghost: "bg-transparent hover:bg-theme-button-secondary text-theme-text-primary focus-visible:ring-theme-accent-primary/50",
        destructive: "bg-theme-status-error hover:bg-theme-status-error/90 text-white focus-visible:ring-theme-status-error",
      },
      /* Size variants */
      size: {
        sm: "h-8 text-xs px-3 py-1.5",
        md: "h-10 text-sm px-4 py-2",
        lg: "h-12 text-base px-5 py-2.5",
      },
      /* Full width variant */
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

/**
 * Button component props
 */
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button component that follows the BizzyPerson design system
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant,
    size,
    fullWidth,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props 
  }, ref) => {
    return (
      <button 
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button; 