import React, { forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

/**
 * Card variants
 */
const cardVariants = cva(
  "rounded-lg border shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-theme-bg-container border-theme-sidebar-border",
        outline: "bg-transparent border-theme-sidebar-border",
        filled: "bg-theme-bg-secondary border-transparent",
      },
      clickable: {
        true: "cursor-pointer transition-shadow hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      clickable: false,
    }
  }
);

/**
 * Card component props
 */
export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether the card is clickable, adding hover effects
   */
  clickable?: boolean;
}

/**
 * Card component that follows the BizzyPerson design system
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, clickable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, clickable }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * CardHeader component props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardHeader component
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle component props
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * CardTitle component
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight text-theme-text-primary", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * CardDescription component props
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * CardDescription component
 */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-theme-text-secondary", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

/**
 * CardContent component props
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardContent component
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

/**
 * CardFooter component props
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardFooter component
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export default Card; 