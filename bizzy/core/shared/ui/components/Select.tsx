import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { ChevronDown } from 'lucide-react';

/**
 * SelectTrigger variants
 */
const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-theme-sidebar-border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-theme-accent-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-theme-bg-primary text-theme-text-primary",
        filled: "bg-theme-bg-chat-input text-theme-text-primary",
        outline: "bg-transparent text-theme-text-primary",
      },
      status: {
        default: "",
        error: "border-theme-status-error focus:ring-theme-status-error/20",
        success: "border-theme-status-success focus:ring-theme-status-success/20",
        warning: "border-theme-status-warning focus:ring-theme-status-warning/20",
      }
    },
    defaultVariants: {
      variant: "default",
      status: "default",
    }
  }
);

/**
 * Select component
 */
export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Error message to display below the input
   */
  errorMessage?: string;
  
  /**
   * Label text to display above the select
   */
  label?: string;
  
  /**
   * Helper text to display below the select
   */
  helperText?: string;
  
  /**
   * Whether the input is required
   */
  required?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, children, label, errorMessage, helperText, required, ...props }, ref) => (
    <div ref={ref} className={cn("w-full flex flex-col gap-1.5", className)} {...props}>
      {label && (
        <label 
          className="text-sm font-medium text-theme-text-primary"
        >
          {label} {required && <span className="text-theme-status-error">*</span>}
        </label>
      )}
      
      {children}
      
      {errorMessage && (
        <p className="text-sm text-theme-status-error">
          {errorMessage}
        </p>
      )}
      
      {!errorMessage && helperText && (
        <p className="text-sm text-theme-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  )
);
Select.displayName = "Select";

/**
 * SelectTrigger component props
 */
export interface SelectTriggerProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectTriggerVariants> {
  /**
   * Whether to hide the dropdown icon
   */
  hideIcon?: boolean;
}

/**
 * SelectTrigger component
 */
export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, variant, status, hideIcon = false, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(selectTriggerVariants({ variant, status }), className)}
      {...props}
    >
      {children}
      {!hideIcon && (
        <ChevronDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

/**
 * SelectValue component props
 */
export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Placeholder text to display when no value is selected
   */
  placeholder?: string;
}

/**
 * SelectValue component
 */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, children, placeholder, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    >
      {children || placeholder || "Select an option"}
    </span>
  )
);
SelectValue.displayName = "SelectValue";

/**
 * SelectContent component props
 */
export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * SelectContent component
 */
export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-theme-sidebar-border bg-theme-bg-primary shadow-md animate-in fade-in-80",
        className
      )}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
        {children}
      </div>
    </div>
  )
);
SelectContent.displayName = "SelectContent";

/**
 * SelectItem component props
 */
export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the item is selected
   */
  selected?: boolean;
}

/**
 * SelectItem component
 */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, selected, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "hover:bg-theme-bg-secondary focus:bg-theme-bg-secondary focus:text-theme-text-primary",
        selected && "bg-theme-bg-secondary",
        className
      )}
      {...props}
    >
      {selected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3332 4L5.99984 11.3333L2.6665 8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-theme-accent-primary"
            />
          </svg>
        </span>
      )}
      <span className="truncate">{children}</span>
    </div>
  )
);
SelectItem.displayName = "SelectItem";

/**
 * SelectGroup component props
 */
export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * SelectGroup component
 */
export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-1 text-theme-text-primary", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SelectGroup.displayName = "SelectGroup";

/**
 * SelectLabel component props
 */
export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * SelectLabel component
 */
export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-theme-text-primary", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SelectLabel.displayName = "SelectLabel";

export default Select; 