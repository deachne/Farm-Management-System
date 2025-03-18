import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-theme-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-theme-primary text-primary-foreground hover:bg-theme-primary/80',
        secondary:
          'border-transparent bg-theme-secondary text-secondary-foreground hover:bg-theme-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-theme-text-primary',
        success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        warning: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
        danger: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        // Farm-specific variants
        crop: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        field: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        equipment: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        weather: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
        pest: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        soil: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.25 text-xs',
        lg: 'px-3 py-0.75 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants }; 