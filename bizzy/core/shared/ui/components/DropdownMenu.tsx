import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { ChevronDown } from 'lucide-react';

/**
 * Dropdown menu container variants
 */
const dropdownContainerVariants = cva(
  "relative inline-block",
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

/**
 * Dropdown menu trigger button variants
 */
const dropdownTriggerVariants = cva(
  "flex items-center justify-between gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-theme-accent-primary text-theme-text-white hover:bg-theme-accent-primary/90",
        secondary: "bg-theme-button-secondary text-theme-text-primary hover:bg-theme-button-secondary/80",
        outline: "border border-theme-button-border bg-transparent hover:bg-theme-bg-secondary",
        ghost: "bg-transparent hover:bg-theme-bg-secondary",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-2.5 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      fullWidth: false,
    },
  }
);

/**
 * Dropdown menu content variants
 */
const dropdownContentVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-theme-sidebar-border bg-theme-bg-primary p-1 shadow-md",
  {
    variants: {
      position: {
        bottomLeft: "origin-top-left",
        bottomRight: "origin-top-right",
        topLeft: "origin-bottom-left",
        topRight: "origin-bottom-right",
      },
      align: {
        start: "",
        center: "",
        end: "",
      },
      sideOffset: {
        0: "",
        2: "",
        4: "",
        6: "",
        8: "",
      },
      withArrow: {
        true: "data-[side=top]:after:absolute data-[side=top]:after:top-0 data-[side=top]:after:left-1/2 data-[side=top]:after:-translate-x-1/2 data-[side=top]:after:-translate-y-1/2 data-[side=top]:after:border-8 data-[side=top]:after:border-transparent data-[side=top]:after:border-t-transparent data-[side=top]:after:border-b-theme-sidebar-border",
        false: "",
      },
      animate: {
        true: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        false: "",
      },
    },
    defaultVariants: {
      position: "bottomLeft",
      align: "start",
      sideOffset: 4,
      withArrow: false,
      animate: true,
    },
  }
);

/**
 * Dropdown menu item variants
 */
const dropdownItemVariants = cva(
  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-theme-bg-secondary data-[highlighted]:text-theme-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      inset: {
        true: "pl-8",
        false: "pl-2",
      },
      destructive: {
        true: "text-theme-status-error",
        false: "text-theme-text-primary",
      },
    },
    defaultVariants: {
      inset: false,
      destructive: false,
    },
  }
);

/**
 * Dropdown menu separator variant
 */
const dropdownSeparatorVariants = cva(
  "my-1 h-px bg-theme-sidebar-border",
  {
    variants: {},
    defaultVariants: {},
  }
);

/**
 * Dropdown menu label variant
 */
const dropdownLabelVariants = cva(
  "px-2 py-1.5 text-sm font-semibold text-theme-text-secondary",
  {
    variants: {
      inset: {
        true: "pl-8",
        false: "pl-2",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

/**
 * Dropdown menu props
 */
export interface DropdownMenuProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropdownContainerVariants> {
  /**
   * Trigger element or component
   */
  trigger?: React.ReactNode;
  
  /**
   * The variant of the trigger button (ignored if custom trigger is provided)
   */
  triggerVariant?: VariantProps<typeof dropdownTriggerVariants>['variant'];
  
  /**
   * The size of the trigger button (ignored if custom trigger is provided)
   */
  triggerSize?: VariantProps<typeof dropdownTriggerVariants>['size'];
  
  /**
   * Children to render in the dropdown menu
   */
  children: React.ReactNode;
  
  /**
   * Position of the dropdown menu relative to the trigger
   */
  position?: VariantProps<typeof dropdownContentVariants>['position'];
  
  /**
   * Alignment of the dropdown menu relative to the trigger
   */
  align?: VariantProps<typeof dropdownContentVariants>['align'];
  
  /**
   * Offset from the trigger in pixels
   */
  sideOffset?: VariantProps<typeof dropdownContentVariants>['sideOffset'];
  
  /**
   * Whether to show an arrow pointing to the trigger
   */
  withArrow?: VariantProps<typeof dropdownContentVariants>['withArrow'];
  
  /**
   * Whether to apply open/close animations
   */
  animate?: VariantProps<typeof dropdownContentVariants>['animate'];
  
  /**
   * Whether the dropdown is open
   */
  open?: boolean;
  
  /**
   * Called when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * Title text for the default trigger button
   */
  title?: string;
}

/**
 * Dropdown menu component that follows the BizzyPerson design system
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ 
    className,
    fullWidth,
    trigger,
    triggerVariant,
    triggerSize,
    children,
    position,
    align,
    sideOffset,
    withArrow,
    animate,
    open,
    onOpenChange,
    title,
    ...props 
  }, ref) => {
    // Controlled/uncontrolled state
    const [isOpen, setIsOpen] = useState(open || false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    
    // Use controlled state if provided
    const effectiveOpen = open !== undefined ? open : isOpen;
    const handleToggle = () => {
      const newState = !effectiveOpen;
      setIsOpen(newState);
      onOpenChange?.(newState);
    };
    
    // Close when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };
      
      if (effectiveOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [effectiveOpen, onOpenChange]);
    
    // Close on Escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };
      
      if (effectiveOpen) {
        document.addEventListener('keydown', handleEscape);
      }
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [effectiveOpen, onOpenChange]);
    
    // Default trigger if none provided
    const defaultTrigger = (
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={effectiveOpen}
        className={cn(
          dropdownTriggerVariants({ variant: triggerVariant, size: triggerSize, fullWidth }),
          "focus:outline-none"
        )}
      >
        <span>{title || "Menu"}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          effectiveOpen && "transform rotate-180"
        )} />
      </button>
    );
    
    return (
      <div 
        ref={ref} 
        className={cn(
          dropdownContainerVariants({ fullWidth }),
          className
        )}
        {...props}
      >
        {trigger || defaultTrigger}
        
        {effectiveOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              dropdownContentVariants({ position, align, sideOffset, withArrow, animate }),
              "absolute mt-1",
              position?.includes("top") ? "bottom-full mb-1" : "top-full mt-1",
              align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"
            )}
            role="menu"
            aria-orientation="vertical"
            data-state={effectiveOpen ? "open" : "closed"}
            data-side={position?.includes("top") ? "top" : "bottom"}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

// Export sub-components
export interface DropdownMenuItemProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dropdownItemVariants> {}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, inset, destructive, disabled, ...props }, ref) => {
    const [isHighlighted, setIsHighlighted] = useState(false);
    
    return (
      <button
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        data-highlighted={isHighlighted}
        data-disabled={disabled ? true : undefined}
        onMouseEnter={() => setIsHighlighted(true)}
        onMouseLeave={() => setIsHighlighted(false)}
        onFocus={() => setIsHighlighted(true)}
        onBlur={() => setIsHighlighted(false)}
        className={cn(
          dropdownItemVariants({ inset, destructive }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

export interface DropdownMenuSeparatorProps 
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn(dropdownSeparatorVariants(), className)}
        {...props}
      />
    );
  }
);

export interface DropdownMenuLabelProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropdownLabelVariants> {}

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(dropdownLabelVariants({ inset }), className)}
        {...props}
      />
    );
  }
);

// Set display names
DropdownMenu.displayName = "DropdownMenu";
DropdownMenuItem.displayName = "DropdownMenuItem";
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export default DropdownMenu; 